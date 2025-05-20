/**
 * Type definitions for scan results
 */

/**
 * Result status types
 */
export type ResultStatus = 'confirmed' | 'not_found' | 'manual_check' | 'error';

/**
 * Result verification method
 */
export type VerificationMethod = 'password_reset' | 'api_check' | 'manual' | 'none';

/**
 * Flag types for results
 */
export type ResultFlag = 'captcha' | 'rate_limited' | 'proxy_blocked' | 'error' | null;

/**
 * Scan result information
 */
export interface ScanResult {
  /** Unique result identifier */
  id: string;
  /** Associated scan identifier */
  scanId: string;
  /** Email address */
  email: string;
  /** Platform identifier */
  platformId: string;
  /** Platform name (denormalized for convenience) */
  platformName: string;
  /** Category (denormalized for convenience) */
  category: string;
  /** Result status */
  status: ResultStatus;
  /** Verification method used */
  method: VerificationMethod;
  /** Any flags/issues */
  flag: ResultFlag;
  /** Timestamp of result */
  timestamp: string;
}

/**
 * Email summary information
 */
export interface EmailSummary {
  /** Email address */
  email: string;
  /** Number of confirmed results */
  confirmed: number;
  /** Number of not found results */
  notFound: number;
  /** Number of manual results */
  manual: number;
}

/**
 * Platform distribution information
 */
export interface PlatformDistribution {
  /** Category name */
  category: string;
  /** Total count */
  total: number;
  /** Number of confirmed accounts */
  confirmed: number;
  /** Other statuses */
  other?: Record<string, number>;
} 