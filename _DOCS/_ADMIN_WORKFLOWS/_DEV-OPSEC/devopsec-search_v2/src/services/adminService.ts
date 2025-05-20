/**
 * Admin Service for DevOpSec Search
 * Manages application configuration including API keys, security settings, etc.
 */

import { z } from 'zod';
import SheetsClient, { SHEET_NAMES } from './sheetsClient';
import {
  AdminConfig,
  ApiKeys,
  SecuritySettings,
  StorageConfig,
  ExportSettings
} from '../types/admin';

// Default admin configuration
const DEFAULT_CONFIG: AdminConfig = {
  apiKeys: {
    googleApiKey: '',
    githubToken: '',
    proxyServiceKey: ''
  },
  securitySettings: {
    twoFactorAuth: false,
    apiKeyRotation: 30,
    activityLogging: true,
    typingDnaVerification: false
  },
  storageConfig: {
    googleSheetsId: '',
    createNewSheetPerScan: false,
    autoBackupResults: true,
    dataRetention: 30
  },
  exportSettings: {
    defaultExportFormat: 'excel',
    autoExportResults: false,
    includeTimestamps: true
  }
};

/**
 * Admin Service class
 */
export class AdminService {
  private sheetsClient: SheetsClient;
  
  /**
   * Create a new AdminService instance
   * @param sheetsClient Google Sheets client
   */
  constructor(sheetsClient: SheetsClient) {
    this.sheetsClient = sheetsClient;
  }
  
  /**
   * Get complete admin configuration
   * @returns Promise with admin configuration
   */
  async getAdminConfig(): Promise<AdminConfig> {
    try {
      const configData = await this.sheetsClient.readSheet(SHEET_NAMES.CONFIG);
      
      // Skip header row
      const configRows = configData.slice(1);
      
      // Convert to key-value object
      const configMap: Record<string, string> = {};
      configRows.forEach(row => {
        if (row.length >= 2) {
          configMap[row[0]] = row[1];
        }
      });
      
      // Build admin config from map
      const config: AdminConfig = {
        apiKeys: {
          googleApiKey: configMap.googleApiKey || DEFAULT_CONFIG.apiKeys.googleApiKey,
          githubToken: configMap.githubToken || DEFAULT_CONFIG.apiKeys.githubToken,
          proxyServiceKey: configMap.proxyServiceKey || DEFAULT_CONFIG.apiKeys.proxyServiceKey
        },
        securitySettings: {
          twoFactorAuth: configMap.twoFactorAuth === 'true',
          apiKeyRotation: parseInt(configMap.apiKeyRotation || '30', 10),
          activityLogging: configMap.activityLogging === 'true',
          typingDnaVerification: configMap.typingDnaVerification === 'true'
        },
        storageConfig: {
          googleSheetsId: configMap.googleSheetsId || DEFAULT_CONFIG.storageConfig.googleSheetsId,
          createNewSheetPerScan: configMap.createNewSheetPerScan === 'true',
          autoBackupResults: configMap.autoBackupResults === 'true',
          dataRetention: parseInt(configMap.dataRetention || '30', 10)
        },
        exportSettings: {
          defaultExportFormat: (configMap.defaultExportFormat || 'excel') as 'excel' | 'csv' | 'json',
          autoExportResults: configMap.autoExportResults === 'true',
          includeTimestamps: configMap.includeTimestamps === 'true'
        }
      };
      
      return config;
    } catch (error) {
      console.error('Error getting admin config:', error);
      return DEFAULT_CONFIG;
    }
  }
  
  /**
   * Get API keys
   * @returns Promise with API keys
   */
  async getApiKeys(): Promise<ApiKeys> {
    const config = await this.getAdminConfig();
    return config.apiKeys;
  }
  
  /**
   * Update API keys
   * @param apiKeys New API keys
   * @returns Promise with success status
   */
  async updateApiKeys(apiKeys: ApiKeys): Promise<boolean> {
    try {
      await this.updateConfigValues([
        ['googleApiKey', apiKeys.googleApiKey],
        ['githubToken', apiKeys.githubToken],
        ['proxyServiceKey', apiKeys.proxyServiceKey]
      ]);
      return true;
    } catch (error) {
      console.error('Error updating API keys:', error);
      return false;
    }
  }
  
  /**
   * Get security settings
   * @returns Promise with security settings
   */
  async getSecuritySettings(): Promise<SecuritySettings> {
    const config = await this.getAdminConfig();
    return config.securitySettings;
  }
  
  /**
   * Update security settings
   * @param settings New security settings
   * @returns Promise with success status
   */
  async updateSecuritySettings(settings: SecuritySettings): Promise<boolean> {
    try {
      await this.updateConfigValues([
        ['twoFactorAuth', settings.twoFactorAuth.toString()],
        ['apiKeyRotation', settings.apiKeyRotation.toString()],
        ['activityLogging', settings.activityLogging.toString()],
        ['typingDnaVerification', settings.typingDnaVerification.toString()]
      ]);
      return true;
    } catch (error) {
      console.error('Error updating security settings:', error);
      return false;
    }
  }
  
  /**
   * Get storage configuration
   * @returns Promise with storage configuration
   */
  async getStorageConfig(): Promise<StorageConfig> {
    const config = await this.getAdminConfig();
    return config.storageConfig;
  }
  
  /**
   * Update storage configuration
   * @param storageConfig New storage configuration
   * @returns Promise with success status
   */
  async updateStorageConfig(storageConfig: StorageConfig): Promise<boolean> {
    try {
      await this.updateConfigValues([
        ['googleSheetsId', storageConfig.googleSheetsId],
        ['createNewSheetPerScan', storageConfig.createNewSheetPerScan.toString()],
        ['autoBackupResults', storageConfig.autoBackupResults.toString()],
        ['dataRetention', storageConfig.dataRetention.toString()]
      ]);
      return true;
    } catch (error) {
      console.error('Error updating storage config:', error);
      return false;
    }
  }
  
  /**
   * Get export settings
   * @returns Promise with export settings
   */
  async getExportSettings(): Promise<ExportSettings> {
    const config = await this.getAdminConfig();
    return config.exportSettings;
  }
  
  /**
   * Update export settings
   * @param exportSettings New export settings
   * @returns Promise with success status
   */
  async updateExportSettings(exportSettings: ExportSettings): Promise<boolean> {
    try {
      await this.updateConfigValues([
        ['defaultExportFormat', exportSettings.defaultExportFormat],
        ['autoExportResults', exportSettings.autoExportResults.toString()],
        ['includeTimestamps', exportSettings.includeTimestamps.toString()]
      ]);
      return true;
    } catch (error) {
      console.error('Error updating export settings:', error);
      return false;
    }
  }
  
  /**
   * Private helper to update configuration values
   * @param keyValuePairs Array of [key, value] pairs to update
   */
  private async updateConfigValues(keyValuePairs: [string, string][]): Promise<void> {
    try {
      // Read current config
      const configData = await this.sheetsClient.readSheet(SHEET_NAMES.CONFIG);
      
      // Find index for each key and prepare updates
      const updates: { range: string; values: string[][] }[] = [];
      
      keyValuePairs.forEach(([key, value]) => {
        const rowIndex = configData.findIndex(row => row[0] === key);
        
        if (rowIndex >= 0) {
          // Key exists, update value
          updates.push({
            range: `${SHEET_NAMES.CONFIG}!B${rowIndex + 1}`,
            values: [[value]]
          });
        } else {
          // Key doesn't exist, append new row
          updates.push({
            range: `${SHEET_NAMES.CONFIG}!A${configData.length + 1}`,
            values: [[key, value]]
          });
        }
      });
      
      // Apply all updates in batch
      if (updates.length > 0) {
        await this.sheetsClient.batchUpdate(updates);
      }
    } catch (error) {
      console.error('Error updating config values:', error);
      throw error;
    }
  }
}

export default AdminService; 