/**
 * Export Service for DevOpSec Search
 * Handles exporting data to various formats
 */

import * as XLSX from 'xlsx';
import ScanService from './scanService';
import { ScanResult } from '../types/results';
import { ExportSettings } from '../types/admin';

/**
 * Export format types
 */
export type ExportFormat = 'excel' | 'csv' | 'json';

/**
 * Export options
 */
export interface ExportOptions {
  /** Export format */
  format: ExportFormat;
  /** Include timestamps */
  includeTimestamps: boolean;
  /** Include headers */
  includeHeaders: boolean;
}

/**
 * Export Service class
 */
export class ExportService {
  private scanService: ScanService;
  
  /**
   * Create a new ExportService instance
   * @param scanService Scan service
   */
  constructor(scanService: ScanService) {
    this.scanService = scanService;
  }
  
  /**
   * Export scan results
   * @param scanId Scan ID
   * @param options Export options
   * @returns Promise with exported data
   */
  async exportScanResults(
    scanId: string,
    options: ExportOptions
  ): Promise<string | Uint8Array | null> {
    try {
      // Get scan results
      const results = await this.scanService.getScanResults(scanId);
      
      if (results.length === 0) {
        return null;
      }
      
      // Export based on format
      switch (options.format) {
        case 'excel':
          return this.exportToExcel(results, options);
        case 'csv':
          return this.exportToCsv(results, options);
        case 'json':
          return this.exportToJson(results, options);
        default:
          throw new Error('Unsupported export format');
      }
    } catch (error) {
      console.error('Error exporting scan results:', error);
      return null;
    }
  }
  
  /**
   * Export results to Excel
   * @param results Scan results
   * @param options Export options
   * @returns Excel file as byte array
   */
  private exportToExcel(
    results: ScanResult[],
    options: ExportOptions
  ): Uint8Array {
    // Prepare data for Excel
    const data = this.prepareDataForExport(results, options);
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scan Results');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
    return new Uint8Array(excelBuffer);
  }
  
  /**
   * Export results to CSV
   * @param results Scan results
   * @param options Export options
   * @returns CSV string
   */
  private exportToCsv(
    results: ScanResult[],
    options: ExportOptions
  ): string {
    // Prepare data for CSV
    const data = this.prepareDataForExport(results, options);
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Generate CSV
    const csv = XLSX.utils.sheet_to_csv(ws);
    
    return csv;
  }
  
  /**
   * Export results to JSON
   * @param results Scan results
   * @param options Export options
   * @returns JSON string
   */
  private exportToJson(
    results: ScanResult[],
    options: ExportOptions
  ): string {
    // Prepare data for JSON
    const data = this.prepareDataForExport(results, options);
    
    // Generate JSON
    return JSON.stringify(data, null, 2);
  }
  
  /**
   * Prepare data for export
   * @param results Scan results
   * @param options Export options
   * @returns Prepared data for export
   */
  private prepareDataForExport(
    results: ScanResult[],
    options: ExportOptions
  ): Record<string, any>[] {
    return results.map(result => {
      const exportData: Record<string, any> = {
        Email: result.email,
        Platform: result.platformName,
        Category: result.category,
        Status: result.status,
        Method: result.method
      };
      
      // Add flag if it exists
      if (result.flag) {
        exportData.Flag = result.flag;
      }
      
      // Add timestamp if requested
      if (options.includeTimestamps) {
        exportData.Timestamp = result.timestamp;
      }
      
      return exportData;
    });
  }
  
  /**
   * Export email summary
   * @param scanId Scan ID
   * @param options Export options
   * @returns Promise with exported data
   */
  async exportEmailSummary(
    scanId: string,
    options: ExportOptions
  ): Promise<string | Uint8Array | null> {
    try {
      // Get scan results
      const results = await this.scanService.getScanResults(scanId);
      
      if (results.length === 0) {
        return null;
      }
      
      // Group by email
      const emailMap: Record<string, {
        confirmed: number;
        notFound: number;
        manualCheck: number;
        error: number;
        platforms: string[];
      }> = {};
      
      results.forEach(result => {
        if (!emailMap[result.email]) {
          emailMap[result.email] = {
            confirmed: 0,
            notFound: 0,
            manualCheck: 0,
            error: 0,
            platforms: []
          };
        }
        
        // Increment appropriate counter
        if (result.status === 'confirmed') {
          emailMap[result.email].confirmed++;
        } else if (result.status === 'not_found') {
          emailMap[result.email].notFound++;
        } else if (result.status === 'manual_check') {
          emailMap[result.email].manualCheck++;
        } else if (result.status === 'error') {
          emailMap[result.email].error++;
        }
        
        // Add platform to list if confirmed
        if (result.status === 'confirmed') {
          emailMap[result.email].platforms.push(result.platformName);
        }
      });
      
      // Convert to array
      const summaryData = Object.entries(emailMap).map(([email, counts]) => ({
        Email: email,
        Confirmed: counts.confirmed,
        'Not Found': counts.notFound,
        'Manual Check': counts.manualCheck,
        Error: counts.error,
        Total: counts.confirmed + counts.notFound + counts.manualCheck + counts.error,
        Platforms: counts.platforms.join(', ')
      }));
      
      // Export based on format
      switch (options.format) {
        case 'excel': {
          const ws = XLSX.utils.json_to_sheet(summaryData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Email Summary');
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          return new Uint8Array(excelBuffer);
        }
        case 'csv': {
          const ws = XLSX.utils.json_to_sheet(summaryData);
          const csv = XLSX.utils.sheet_to_csv(ws);
          return csv;
        }
        case 'json':
          return JSON.stringify(summaryData, null, 2);
        default:
          throw new Error('Unsupported export format');
      }
    } catch (error) {
      console.error('Error exporting email summary:', error);
      return null;
    }
  }
  
  /**
   * Get file name for export
   * @param scanId Scan ID
   * @param type Export type
   * @param format Export format
   * @returns File name
   */
  getExportFileName(
    scanId: string,
    type: 'results' | 'summary',
    format: ExportFormat
  ): string {
    const date = new Date().toISOString().slice(0, 10);
    const extension = format === 'excel' ? 'xlsx' : format;
    
    return `devopsec_${type}_${scanId}_${date}.${extension}`;
  }
  
  /**
   * Get default export options from settings
   * @param settings Export settings
   * @returns Export options
   */
  getDefaultExportOptions(settings: ExportSettings): ExportOptions {
    return {
      format: settings.defaultExportFormat,
      includeTimestamps: settings.includeTimestamps,
      includeHeaders: true
    };
  }
}

export default ExportService; 