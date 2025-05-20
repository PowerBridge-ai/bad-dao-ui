/**
 * DevOpSec Search v2 - Backend Services
 * Main entry point that exports all services and types
 */

// Export services
export { default as SheetsClient } from './services/sheetsClient';
export { default as ScanService } from './services/scanService';
export { default as PlatformService } from './services/platformService';
export { default as AdminService } from './services/adminService';
export { default as MetricsService } from './services/metricsService';
export { default as ExportService } from './services/exportService';

// Export types
export * from './types';

// Export constants
export { SHEET_NAMES } from './services/sheetsClient';

/**
 * Create an instance of all services
 * @param googleSheetsId Google Sheets ID
 * @param apiKey Google API key
 * @returns Object with all services
 */
export const createServices = (googleSheetsId: string, apiKey: string) => {
  // Create Google Sheets client
  const sheetsClient = new SheetsClient({
    googleSheetsId,
    apiKey
  });
  
  // Create individual services
  const adminService = new AdminService(sheetsClient);
  const scanService = new ScanService(sheetsClient);
  const platformService = new PlatformService(sheetsClient);
  const metricsService = new MetricsService(
    sheetsClient,
    scanService,
    platformService
  );
  const exportService = new ExportService(scanService);
  
  // Return all services
  return {
    sheetsClient,
    adminService,
    scanService,
    platformService,
    metricsService,
    exportService,
    
    // Initialize the Google Sheets structure
    initialize: async () => {
      await sheetsClient.initializeSheets();
    }
  };
};

/**
 * Create an admin-only service instance
 * Used for initial setup when only admin service is needed
 * @param googleSheetsId Google Sheets ID
 * @param apiKey Google API key
 * @returns Admin service
 */
export const createAdminService = (googleSheetsId: string, apiKey: string) => {
  const sheetsClient = new SheetsClient({
    googleSheetsId,
    apiKey
  });
  
  return new AdminService(sheetsClient);
};

// Import types for easier access
import SheetsClient from './services/sheetsClient';
import ScanService from './services/scanService';
import PlatformService from './services/platformService';
import AdminService from './services/adminService';
import MetricsService from './services/metricsService';
import ExportService from './services/exportService'; 