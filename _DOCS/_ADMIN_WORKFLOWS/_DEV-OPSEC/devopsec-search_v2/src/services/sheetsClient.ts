/**
 * Google Sheets API client for DevOpSec Search
 * This module handles all interactions with Google Sheets API
 */

import { google, sheets_v4 } from 'googleapis';
import { z } from 'zod';
import { StorageConfig } from '../types/admin';

// Schema for validating sheets configuration
const sheetsConfigSchema = z.object({
  googleSheetsId: z.string().min(1),
  apiKey: z.string().min(1),
});

// Default sheet names
export const SHEET_NAMES = {
  CONFIG: 'Configuration',
  PLATFORMS: 'Platforms',
  SCANS: 'Scans',
  RESULTS: 'Results',
};

// Types of range inputs
type SheetRange = string | {
  sheet: string;
  range: string;
};

/**
 * Google Sheets Client class
 */
export class SheetsClient {
  private sheets: sheets_v4.Sheets;
  private sheetsId: string;
  
  /**
   * Create a new SheetsClient instance
   * @param config Google Sheets configuration
   */
  constructor(config: { googleSheetsId: string; apiKey: string }) {
    // Validate configuration
    const validatedConfig = sheetsConfigSchema.parse(config);
    
    // Initialize Google Sheets API client
    const auth = new google.auth.GoogleAuth({
      apiKey: validatedConfig.apiKey,
    });
    
    this.sheets = google.sheets({ version: 'v4', auth });
    this.sheetsId = validatedConfig.googleSheetsId;
  }
  
  /**
   * Format a range for Google Sheets API
   * @param range Sheet range or object with sheet and range
   * @returns Formatted range string
   */
  private formatRange(range: SheetRange): string {
    if (typeof range === 'string') {
      return range;
    }
    return `${range.sheet}!${range.range}`;
  }
  
  /**
   * Read data from Google Sheets
   * @param range Sheet range to read
   * @returns Promise with the data
   */
  async readSheet(range: SheetRange): Promise<any[][]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetsId,
        range: this.formatRange(range),
      });
      
      return response.data.values || [];
    } catch (error) {
      console.error('Error reading from sheets:', error);
      throw new Error(`Failed to read from Google Sheets: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Write data to Google Sheets
   * @param range Sheet range to write
   * @param values Data to write
   * @returns Promise with the update result
   */
  async writeSheet(range: SheetRange, values: any[][]): Promise<sheets_v4.Schema$UpdateValuesResponse> {
    try {
      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.sheetsId,
        range: this.formatRange(range),
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error writing to sheets:', error);
      throw new Error(`Failed to write to Google Sheets: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Append data to Google Sheets
   * @param range Sheet range to append to
   * @param values Data to append
   * @returns Promise with the append result
   */
  async appendSheet(range: SheetRange, values: any[][]): Promise<sheets_v4.Schema$AppendValuesResponse> {
    try {
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.sheetsId,
        range: this.formatRange(range),
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error appending to sheets:', error);
      throw new Error(`Failed to append to Google Sheets: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Batch update for multiple operations
   * @param updates Array of range and values to update
   * @returns Promise with the batch update result
   */
  async batchUpdate(updates: { range: SheetRange; values: any[][] }[]): Promise<sheets_v4.Schema$BatchUpdateValuesResponse> {
    try {
      const data = updates.map(update => ({
        range: this.formatRange(update.range),
        values: update.values,
      }));
      
      const response = await this.sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: this.sheetsId,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error batch updating sheets:', error);
      throw new Error(`Failed to batch update Google Sheets: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Create a new sheet in the spreadsheet
   * @param title Title of the new sheet
   * @returns Promise with the sheet ID
   */
  async createSheet(title: string): Promise<number> {
    try {
      const response = await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.sheetsId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title,
                },
              },
            },
          ],
        },
      });
      
      const sheetId = response.data.replies?.[0]?.addSheet?.properties?.sheetId;
      
      if (!sheetId) {
        throw new Error('Failed to get new sheet ID');
      }
      
      return sheetId;
    } catch (error) {
      console.error('Error creating sheet:', error);
      throw new Error(`Failed to create new sheet: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Initialize the Google Sheets structure for a new installation
   * Creates all required sheets with headers
   */
  async initializeSheets(): Promise<void> {
    try {
      // Check if Configuration sheet exists
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.sheetsId,
      });
      
      const existingSheets = response.data.sheets?.map((sheet: sheets_v4.Schema$Sheet) => sheet.properties?.title) || [];
      
      // Create Configuration sheet if it doesn't exist
      if (!existingSheets.includes(SHEET_NAMES.CONFIG)) {
        await this.createSheet(SHEET_NAMES.CONFIG);
        await this.writeSheet(SHEET_NAMES.CONFIG, [
          ['Key', 'Value'],
          ['googleApiKey', ''],
          ['githubToken', ''],
          ['proxyServiceKey', ''],
          ['twoFactorAuth', 'false'],
          ['apiKeyRotation', '30'],
          ['activityLogging', 'true'],
          ['typingDnaVerification', 'false'],
          ['createNewSheetPerScan', 'false'],
          ['autoBackupResults', 'true'],
          ['dataRetention', '30'],
          ['defaultExportFormat', 'excel'],
          ['autoExportResults', 'false'],
          ['includeTimestamps', 'true'],
        ]);
      }
      
      // Create Platforms sheet if it doesn't exist
      if (!existingSheets.includes(SHEET_NAMES.PLATFORMS)) {
        await this.createSheet(SHEET_NAMES.PLATFORMS);
        await this.writeSheet(SHEET_NAMES.PLATFORMS, [
          ['PlatformID', 'Name', 'Category', 'Priority', 'Status', 'Enabled', 'Icon'],
        ]);
      }
      
      // Create Scans sheet if it doesn't exist
      if (!existingSheets.includes(SHEET_NAMES.SCANS)) {
        await this.createSheet(SHEET_NAMES.SCANS);
        await this.writeSheet(SHEET_NAMES.SCANS, [
          ['ScanID', 'CreatedAt', 'EmailCount', 'PlatformCount', 'Status', 'ConfirmedCount', 'NotFoundCount', 'ManualCount', 'ErrorCount'],
        ]);
      }
      
      // Create Results sheet if it doesn't exist
      if (!existingSheets.includes(SHEET_NAMES.RESULTS)) {
        await this.createSheet(SHEET_NAMES.RESULTS);
        await this.writeSheet(SHEET_NAMES.RESULTS, [
          ['ResultID', 'ScanID', 'Email', 'PlatformID', 'PlatformName', 'Category', 'Status', 'Method', 'Flag', 'Timestamp'],
        ]);
      }
    } catch (error) {
      console.error('Error initializing sheets:', error);
      throw new Error(`Failed to initialize Google Sheets: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Factory function to create a SheetsClient instance from storage config
 * @param config Storage configuration
 * @param apiKey Google API key
 * @returns SheetsClient instance
 */
export const createSheetsClient = (
  config: StorageConfig,
  apiKey: string
): SheetsClient => {
  return new SheetsClient({
    googleSheetsId: config.googleSheetsId,
    apiKey,
  });
};

export default SheetsClient; 