/**
 * Metrics Service for DevOpSec Search
 * Calculates application metrics for dashboard displays
 */

import SheetsClient, { SHEET_NAMES } from './sheetsClient';
import ScanService from './scanService';
import PlatformService from './platformService';
import { ScanInfo } from '../types/scan';
import { PlatformCategoryCount } from '../types/platform';
import { PlatformDistribution } from '../types/results';

/**
 * Dashboard metrics
 */
export interface DashboardMetrics {
  /** Total accounts found */
  totalAccounts: number;
  /** Platforms scanned */
  platformsScanned: number;
  /** Critical issues */
  criticalIssues: number;
  /** Latest scan time */
  latestScan: string;
  /** Total emails scanned */
  emailsScanned: number;
  /** Status distribution */
  statusDistribution: {
    confirmed: number;
    notFound: number;
    manualCheck: number;
    error: number;
  };
  /** Platform categories */
  platformCategories: PlatformCategoryCount[];
  /** Recent scans */
  recentScans: ScanInfo[];
}

/**
 * Metrics Service class
 */
export class MetricsService {
  private sheetsClient: SheetsClient;
  private scanService: ScanService;
  private platformService: PlatformService;
  
  /**
   * Create a new MetricsService instance
   * @param sheetsClient Google Sheets client
   * @param scanService Scan service
   * @param platformService Platform service
   */
  constructor(
    sheetsClient: SheetsClient,
    scanService: ScanService,
    platformService: PlatformService
  ) {
    this.sheetsClient = sheetsClient;
    this.scanService = scanService;
    this.platformService = platformService;
  }
  
  /**
   * Get complete dashboard metrics
   * @returns Promise with dashboard metrics
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      // Get recent scans for other metrics
      const recentScans = await this.scanService.getScanHistory(5, 0);
      
      // Get total counts
      const totalCounts = await this.getTotalCounts();
      
      // Get status distribution
      const statusDistribution = await this.getStatusDistribution();
      
      // Get platform categories
      const platformCategories = await this.platformService.getCategoryCounts();
      
      // Get latest scan time
      const latestScan = recentScans.length > 0 ? recentScans[0].createdAt : '';
      
      // Calculate critical issues (this would be more sophisticated in a real app)
      const criticalIssues = Math.round(totalCounts.confirmed * 0.05);
      
      return {
        totalAccounts: totalCounts.confirmed + totalCounts.manualCheck,
        platformsScanned: totalCounts.platforms,
        criticalIssues,
        latestScan,
        emailsScanned: totalCounts.emails,
        statusDistribution,
        platformCategories,
        recentScans
      };
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      
      // Return default values on error
      return {
        totalAccounts: 0,
        platformsScanned: 0,
        criticalIssues: 0,
        latestScan: '',
        emailsScanned: 0,
        statusDistribution: {
          confirmed: 0,
          notFound: 0,
          manualCheck: 0,
          error: 0
        },
        platformCategories: [],
        recentScans: []
      };
    }
  }
  
  /**
   * Get total counts from results
   * @returns Promise with total counts
   */
  async getTotalCounts(): Promise<{
    confirmed: number;
    notFound: number;
    manualCheck: number;
    error: number;
    platforms: number;
    emails: number;
  }> {
    try {
      // Get results
      const resultsData = await this.sheetsClient.readSheet(SHEET_NAMES.RESULTS);
      
      // Skip header row
      const resultRows = resultsData.slice(1);
      
      // Count by status
      const confirmed = resultRows.filter(row => row[6] === 'confirmed').length;
      const notFound = resultRows.filter(row => row[6] === 'not_found').length;
      const manualCheck = resultRows.filter(row => row[6] === 'manual_check').length;
      const error = resultRows.filter(row => row[6] === 'error').length;
      
      // Count unique platforms and emails
      const platforms = new Set(resultRows.map(row => row[3])).size;
      const emails = new Set(resultRows.map(row => row[2])).size;
      
      return {
        confirmed,
        notFound,
        manualCheck,
        error,
        platforms,
        emails
      };
    } catch (error) {
      console.error('Error getting total counts:', error);
      return {
        confirmed: 0,
        notFound: 0,
        manualCheck: 0,
        error: 0,
        platforms: 0,
        emails: 0
      };
    }
  }
  
  /**
   * Get status distribution
   * @returns Promise with status distribution
   */
  async getStatusDistribution(): Promise<{
    confirmed: number;
    notFound: number;
    manualCheck: number;
    error: number;
  }> {
    const counts = await this.getTotalCounts();
    
    return {
      confirmed: counts.confirmed,
      notFound: counts.notFound,
      manualCheck: counts.manualCheck,
      error: counts.error
    };
  }
  
  /**
   * Get platform distribution
   * @returns Promise with platform distribution
   */
  async getPlatformDistribution(): Promise<PlatformDistribution[]> {
    try {
      // Get results
      const resultsData = await this.sheetsClient.readSheet(SHEET_NAMES.RESULTS);
      
      // Skip header row
      const resultRows = resultsData.slice(1);
      
      // Group by category
      const categoryCounts: Record<string, {
        total: number;
        confirmed: number;
        other: Record<string, number>;
      }> = {};
      
      resultRows.forEach(row => {
        const category = row[5]; // Category column
        const status = row[6]; // Status column
        
        if (!categoryCounts[category]) {
          categoryCounts[category] = {
            total: 0,
            confirmed: 0,
            other: {}
          };
        }
        
        categoryCounts[category].total++;
        
        if (status === 'confirmed') {
          categoryCounts[category].confirmed++;
        } else {
          if (!categoryCounts[category].other[status]) {
            categoryCounts[category].other[status] = 0;
          }
          categoryCounts[category].other[status]++;
        }
      });
      
      // Convert to array
      return Object.entries(categoryCounts).map(([category, counts]) => ({
        category,
        total: counts.total,
        confirmed: counts.confirmed,
        other: counts.other
      }));
    } catch (error) {
      console.error('Error getting platform distribution:', error);
      return [];
    }
  }
  
  /**
   * Get results count by email
   * @returns Promise with email counts
   */
  async getEmailCounts(): Promise<{ email: string; count: number }[]> {
    try {
      // Get results
      const resultsData = await this.sheetsClient.readSheet(SHEET_NAMES.RESULTS);
      
      // Skip header row
      const resultRows = resultsData.slice(1);
      
      // Count by email
      const emailCounts: Record<string, number> = {};
      
      resultRows.forEach(row => {
        const email = row[2]; // Email column
        
        if (!emailCounts[email]) {
          emailCounts[email] = 0;
        }
        
        emailCounts[email]++;
      });
      
      // Convert to array and sort
      return Object.entries(emailCounts)
        .map(([email, count]) => ({ email, count }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error getting email counts:', error);
      return [];
    }
  }
  
  /**
   * Generate chart data for platform categories
   * @returns Promise with chart data
   */
  async getPlatformCategoryChartData(): Promise<{
    category: string;
    confirmed: number;
    notFound: number;
    manualCheck: number;
  }[]> {
    try {
      // Get results
      const resultsData = await this.sheetsClient.readSheet(SHEET_NAMES.RESULTS);
      
      // Skip header row
      const resultRows = resultsData.slice(1);
      
      // Group by category and status
      const categoryData: Record<string, {
        confirmed: number;
        notFound: number;
        manualCheck: number;
      }> = {};
      
      resultRows.forEach(row => {
        const category = row[5]; // Category column
        const status = row[6]; // Status column
        
        if (!categoryData[category]) {
          categoryData[category] = {
            confirmed: 0,
            notFound: 0,
            manualCheck: 0
          };
        }
        
        if (status === 'confirmed') {
          categoryData[category].confirmed++;
        } else if (status === 'not_found') {
          categoryData[category].notFound++;
        } else if (status === 'manual_check') {
          categoryData[category].manualCheck++;
        }
      });
      
      // Convert to array
      return Object.entries(categoryData)
        .map(([category, data]) => ({
          category,
          confirmed: data.confirmed,
          notFound: data.notFound,
          manualCheck: data.manualCheck
        }))
        .sort((a, b) => b.confirmed - a.confirmed);
    } catch (error) {
      console.error('Error getting platform category chart data:', error);
      return [];
    }
  }
  
  /**
   * Generate chart data for overall status
   * @returns Promise with chart data
   */
  async getOverallStatusChartData(): Promise<{
    status: string;
    value: number;
    percentage: number;
  }[]> {
    try {
      const statusDistribution = await this.getStatusDistribution();
      
      const total = 
        statusDistribution.confirmed +
        statusDistribution.notFound +
        statusDistribution.manualCheck +
        statusDistribution.error;
      
      // Calculate percentages
      const getPercentage = (value: number) => 
        total > 0 ? Math.round((value / total) * 100) : 0;
      
      return [
        {
          status: 'Confirmed',
          value: statusDistribution.confirmed,
          percentage: getPercentage(statusDistribution.confirmed)
        },
        {
          status: 'Not Found',
          value: statusDistribution.notFound,
          percentage: getPercentage(statusDistribution.notFound)
        },
        {
          status: 'Manual Check',
          value: statusDistribution.manualCheck,
          percentage: getPercentage(statusDistribution.manualCheck)
        },
        {
          status: 'Error',
          value: statusDistribution.error,
          percentage: getPercentage(statusDistribution.error)
        }
      ];
    } catch (error) {
      console.error('Error getting overall status chart data:', error);
      return [];
    }
  }
}

export default MetricsService; 