/**
 * Type definitions for platform operations
 */

/**
 * Platform category types
 */
export type PlatformCategory = 
  | 'Social Media'
  | 'Development'
  | 'Web Infrastructure'
  | 'Email & Communication'
  | 'Web3 Platforms'
  | 'Business Services';

/**
 * Platform priority levels
 */
export type PlatformPriority = 'high' | 'medium' | 'low';

/**
 * Platform status types
 */
export type PlatformStatus = 'online' | 'offline' | 'unknown';

/**
 * Platform information
 */
export interface Platform {
  /** Unique platform identifier */
  id: string;
  /** Platform name */
  name: string;
  /** Platform category */
  category: PlatformCategory;
  /** Platform priority */
  priority: PlatformPriority;
  /** Current platform status */
  status: PlatformStatus;
  /** Whether platform is enabled */
  enabled: boolean;
  /** Platform icon or logo */
  icon?: string;
}

/**
 * Platform category with count
 */
export interface PlatformCategoryCount {
  /** Category name */
  category: PlatformCategory;
  /** Number of platforms in category */
  count: number;
  /** Number of confirmed accounts */
  confirmed: number;
} 