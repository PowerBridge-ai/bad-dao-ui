/**
 * Type definitions for admin configuration
 */

/**
 * API keys configuration
 */
export interface ApiKeys {
  /** Google API key */
  googleApiKey: string;
  /** GitHub OAuth token */
  githubToken: string;
  /** Proxy service API key */
  proxyServiceKey: string;
}

/**
 * Security settings
 */
export interface SecuritySettings {
  /** Two-factor authentication enabled */
  twoFactorAuth: boolean;
  /** API key rotation period in days */
  apiKeyRotation: number;
  /** Activity logging enabled */
  activityLogging: boolean;
  /** TypingDNA verification enabled */
  typingDnaVerification: boolean;
}

/**
 * Storage configuration
 */
export interface StorageConfig {
  /** Google Sheets ID */
  googleSheetsId: string;
  /** Create new sheet per scan */
  createNewSheetPerScan: boolean;
  /** Auto-backup results */
  autoBackupResults: boolean;
  /** Data retention period in days */
  dataRetention: number;
}

/**
 * Export settings
 */
export interface ExportSettings {
  /** Default export format */
  defaultExportFormat: 'excel' | 'csv' | 'json';
  /** Auto-export results */
  autoExportResults: boolean;
  /** Include timestamps */
  includeTimestamps: boolean;
}

/**
 * Complete admin configuration
 */
export interface AdminConfig {
  /** API keys */
  apiKeys: ApiKeys;
  /** Security settings */
  securitySettings: SecuritySettings;
  /** Storage configuration */
  storageConfig: StorageConfig;
  /** Export settings */
  exportSettings: ExportSettings;
} 