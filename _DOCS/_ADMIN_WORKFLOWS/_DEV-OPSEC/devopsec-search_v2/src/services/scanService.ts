/**
 * Scan Service for DevOpSec Search
 * Manages scan creation, retrieval, and updates
 */

import { v4 as uuidv4 } from 'uuid';
import SheetsClient, { SHEET_NAMES } from './sheetsClient';
import { 
  Scan, 
  ScanConfig, 
  ScanInfo, 
  ScanStatus 
} from '../types/scan';
import { ScanResult, ResultStatus } from '../types/results';

/**
 * Scan Service class
 */
export class ScanService {
  private sheetsClient: SheetsClient;
  
  /**
   * Create a new ScanService instance
   * @param sheetsClient Google Sheets client
   */
  constructor(sheetsClient: SheetsClient) {
    this.sheetsClient = sheetsClient;
  }
  
  /**
   * Create a new scan
   * @param emails List of emails to scan
   * @param platformIds List of platform IDs to scan
   * @param config Scan configuration
   * @returns Promise with the created scan
   */
  async createScan(
    emails: string[],
    platformIds: string[],
    config: ScanConfig
  ): Promise<Scan> {
    try {
      // Create a unique ID for the scan
      const scanId = uuidv4();
      const createdAt = new Date().toISOString();
      
      // Create the scan object
      const scan: Scan = {
        id: scanId,
        createdAt,
        emailCount: emails.length,
        platformCount: platformIds.length,
        status: 'pending',
        emails,
        platformIds,
        config
      };
      
      // Save the scan to Google Sheets
      await this.sheetsClient.appendSheet(SHEET_NAMES.SCANS, [
        [
          scan.id,
          scan.createdAt,
          scan.emailCount.toString(),
          scan.platformCount.toString(),
          scan.status,
          '0', // Confirmed count
          '0', // Not found count
          '0', // Manual count
          '0'  // Error count
        ]
      ]);
      
      return scan;
    } catch (error) {
      console.error('Error creating scan:', error);
      throw new Error(`Failed to create scan: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Get scan by ID
   * @param scanId Scan ID
   * @returns Promise with the scan or null if not found
   */
  async getScan(scanId: string): Promise<Scan | null> {
    try {
      // Get scan info from Scans sheet
      const scanInfo = await this.getScanInfo(scanId);
      
      if (!scanInfo) {
        return null;
      }
      
      // Get results for this scan
      const results = await this.getScanResults(scanId);
      
      // Count results by status
      const summary = {
        confirmed: results.filter(r => r.status === 'confirmed').length,
        notFound: results.filter(r => r.status === 'not_found').length,
        manualCheck: results.filter(r => r.status === 'manual_check').length,
        error: results.filter(r => r.status === 'error').length
      };
      
      // Get unique emails and platforms from results
      const emails = [...new Set(results.map(r => r.email))];
      const platformIds = [...new Set(results.map(r => r.platformId))];
      
      // Construct the full scan object
      const scan: Scan = {
        ...scanInfo,
        emails,
        platformIds,
        config: {
          retryAttempts: 3, // Default values since we don't store these
          stealthMode: false,
          useProxies: false
        },
        summary
      };
      
      return scan;
    } catch (error) {
      console.error('Error getting scan:', error);
      return null;
    }
  }
  
  /**
   * Get basic scan info by ID
   * @param scanId Scan ID
   * @returns Promise with the scan info or null if not found
   */
  async getScanInfo(scanId: string): Promise<ScanInfo | null> {
    try {
      // Get all scans
      const scansData = await this.sheetsClient.readSheet(SHEET_NAMES.SCANS);
      
      // Skip header row
      const scanRows = scansData.slice(1);
      
      // Find the scan with matching ID
      const scanRow = scanRows.find(row => row[0] === scanId);
      
      if (!scanRow) {
        return null;
      }
      
      // Parse the scan info
      const scanInfo: ScanInfo = {
        id: scanRow[0],
        createdAt: scanRow[1],
        emailCount: parseInt(scanRow[2], 10),
        platformCount: parseInt(scanRow[3], 10),
        status: scanRow[4] as ScanStatus
      };
      
      return scanInfo;
    } catch (error) {
      console.error('Error getting scan info:', error);
      return null;
    }
  }
  
  /**
   * Get scan history
   * @param limit Maximum number of scans to return
   * @param offset Number of scans to skip
   * @returns Promise with the list of scans
   */
  async getScanHistory(limit = 10, offset = 0): Promise<ScanInfo[]> {
    try {
      // Get all scans
      const scansData = await this.sheetsClient.readSheet(SHEET_NAMES.SCANS);
      
      // Skip header row
      const scanRows = scansData.slice(1);
      
      // Sort by creation date (newest first)
      const sortedRows = [...scanRows].sort((a, b) => {
        const dateA = new Date(a[1]).getTime();
        const dateB = new Date(b[1]).getTime();
        return dateB - dateA;
      });
      
      // Apply pagination
      const paginatedRows = sortedRows.slice(offset, offset + limit);
      
      // Parse the scan info
      const scans: ScanInfo[] = paginatedRows.map(row => ({
        id: row[0],
        createdAt: row[1],
        emailCount: parseInt(row[2], 10),
        platformCount: parseInt(row[3], 10),
        status: row[4] as ScanStatus
      }));
      
      return scans;
    } catch (error) {
      console.error('Error getting scan history:', error);
      return [];
    }
  }
  
  /**
   * Get results for a specific scan
   * @param scanId Scan ID
   * @returns Promise with the list of results
   */
  async getScanResults(scanId: string): Promise<ScanResult[]> {
    try {
      // Get all results
      const resultsData = await this.sheetsClient.readSheet(SHEET_NAMES.RESULTS);
      
      // Skip header row
      const resultRows = resultsData.slice(1);
      
      // Filter results for this scan
      const scanResultRows = resultRows.filter(row => row[1] === scanId);
      
      // Parse the results
      const results: ScanResult[] = scanResultRows.map(row => ({
        id: row[0],
        scanId: row[1],
        email: row[2],
        platformId: row[3],
        platformName: row[4],
        category: row[5],
        status: row[6] as ResultStatus,
        method: row[7] as any, // VerificationMethod
        flag: row[8] as any, // ResultFlag
        timestamp: row[9]
      }));
      
      return results;
    } catch (error) {
      console.error('Error getting scan results:', error);
      return [];
    }
  }
  
  /**
   * Update scan status
   * @param scanId Scan ID
   * @param status New status
   * @returns Promise with success status
   */
  async updateScanStatus(scanId: string, status: ScanStatus): Promise<boolean> {
    try {
      // Get all scans
      const scansData = await this.sheetsClient.readSheet(SHEET_NAMES.SCANS);
      
      // Find the row index for this scan
      const scanIndex = scansData.findIndex(row => row[0] === scanId);
      
      if (scanIndex < 0) {
        return false;
      }
      
      // Update the status
      await this.sheetsClient.writeSheet({
        sheet: SHEET_NAMES.SCANS,
        range: `E${scanIndex + 1}`
      }, [[status]]);
      
      return true;
    } catch (error) {
      console.error('Error updating scan status:', error);
      return false;
    }
  }
  
  /**
   * Add results to a scan
   * @param results List of results to add
   * @returns Promise with success status
   */
  async addScanResults(results: ScanResult[]): Promise<boolean> {
    if (results.length === 0) {
      return true;
    }
    
    try {
      // Prepare the rows to add
      const resultRows = results.map(result => [
        result.id,
        result.scanId,
        result.email,
        result.platformId,
        result.platformName,
        result.category,
        result.status,
        result.method,
        result.flag || '',
        result.timestamp
      ]);
      
      // Add the results
      await this.sheetsClient.appendSheet(SHEET_NAMES.RESULTS, resultRows);
      
      // Update the result counts for the scan
      await this.updateResultCounts(results[0].scanId);
      
      return true;
    } catch (error) {
      console.error('Error adding scan results:', error);
      return false;
    }
  }
  
  /**
   * Update result counts for a scan
   * @param scanId Scan ID
   * @returns Promise with success status
   */
  private async updateResultCounts(scanId: string): Promise<boolean> {
    try {
      // Get all results for this scan
      const results = await this.getScanResults(scanId);
      
      // Count results by status
      const confirmedCount = results.filter(r => r.status === 'confirmed').length;
      const notFoundCount = results.filter(r => r.status === 'not_found').length;
      const manualCount = results.filter(r => r.status === 'manual_check').length;
      const errorCount = results.filter(r => r.status === 'error').length;
      
      // Get all scans
      const scansData = await this.sheetsClient.readSheet(SHEET_NAMES.SCANS);
      
      // Find the row index for this scan
      const scanIndex = scansData.findIndex(row => row[0] === scanId);
      
      if (scanIndex < 0) {
        return false;
      }
      
      // Update the counts
      await this.sheetsClient.batchUpdate([
        {
          range: `${SHEET_NAMES.SCANS}!F${scanIndex + 1}:I${scanIndex + 1}`,
          values: [[
            confirmedCount.toString(),
            notFoundCount.toString(),
            manualCount.toString(),
            errorCount.toString()
          ]]
        }
      ]);
      
      return true;
    } catch (error) {
      console.error('Error updating result counts:', error);
      return false;
    }
  }
}

export default ScanService; 