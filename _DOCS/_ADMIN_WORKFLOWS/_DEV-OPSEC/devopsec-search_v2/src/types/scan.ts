/**
 * Type definitions for scan operations
 */

/**
 * Scan status types
 */
export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';

/**
 * Scan configuration
 */
export interface ScanConfig {
  /** Number of retry attempts */
  retryAttempts: number;
  /** Whether to use stealth mode */
  stealthMode: boolean;
  /** Whether to use proxies */
  useProxies: boolean;
}

/**
 * Basic scan information
 */
export interface ScanInfo {
  /** Unique scan identifier */
  id: string;
  /** Scan creation timestamp */
  createdAt: string;
  /** Number of emails scanned */
  emailCount: number;
  /** Number of platforms scanned */
  platformCount: number;
  /** Current scan status */
  status: ScanStatus;
}

/**
 * Scan with full details
 */
export interface Scan extends ScanInfo {
  /** List of emails to scan */
  emails: string[];
  /** List of platform IDs to scan */
  platformIds: string[];
  /** Scan configuration */
  config: ScanConfig;
  /** Results summary */
  summary?: ScanSummary;
}

/**
 * Summary of scan results
 */
export interface ScanSummary {
  /** Number of confirmed results */
  confirmed: number;
  /** Number of not found results */
  notFound: number;
  /** Number of manual check results */
  manualCheck: number;
  /** Number of error results */
  error: number;
} 