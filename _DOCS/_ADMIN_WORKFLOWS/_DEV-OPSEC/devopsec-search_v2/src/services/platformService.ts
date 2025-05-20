/**
 * Platform Service for DevOpSec Search
 * Manages platform and category data
 */

import { v4 as uuidv4 } from 'uuid';
import SheetsClient, { SHEET_NAMES } from './sheetsClient';
import { 
  Platform, 
  PlatformCategory, 
  PlatformCategoryCount, 
  PlatformPriority, 
  PlatformStatus 
} from '../types/platform';

/**
 * Platform Service class
 */
export class PlatformService {
  private sheetsClient: SheetsClient;
  
  /**
   * Create a new PlatformService instance
   * @param sheetsClient Google Sheets client
   */
  constructor(sheetsClient: SheetsClient) {
    this.sheetsClient = sheetsClient;
  }
  
  /**
   * Get all platforms
   * @returns Promise with the list of platforms
   */
  async getPlatforms(): Promise<Platform[]> {
    try {
      // Get all platforms from the sheet
      const platformsData = await this.sheetsClient.readSheet(SHEET_NAMES.PLATFORMS);
      
      // Skip the header row
      const platformRows = platformsData.slice(1);
      
      // Parse platform data
      const platforms: Platform[] = platformRows.map(row => ({
        id: row[0],
        name: row[1],
        category: row[2] as PlatformCategory,
        priority: row[3] as PlatformPriority,
        status: row[4] as PlatformStatus,
        enabled: row[5] === 'true',
        icon: row[6] || undefined
      }));
      
      return platforms;
    } catch (error) {
      console.error('Error getting platforms:', error);
      return [];
    }
  }
  
  /**
   * Get platforms by category
   * @param category Platform category
   * @returns Promise with the list of platforms in the category
   */
  async getPlatformsByCategory(category: PlatformCategory): Promise<Platform[]> {
    const platforms = await this.getPlatforms();
    return platforms.filter(platform => platform.category === category);
  }
  
  /**
   * Get platform by ID
   * @param platformId Platform ID
   * @returns Promise with the platform or null if not found
   */
  async getPlatform(platformId: string): Promise<Platform | null> {
    const platforms = await this.getPlatforms();
    const platform = platforms.find(p => p.id === platformId);
    return platform || null;
  }
  
  /**
   * Create a new platform
   * @param platform Platform data
   * @returns Promise with the created platform
   */
  async createPlatform(platform: Omit<Platform, 'id'>): Promise<Platform> {
    try {
      // Generate a unique ID
      const platformId = uuidv4();
      
      // Create the full platform object
      const newPlatform: Platform = {
        id: platformId,
        ...platform
      };
      
      // Add to Google Sheets
      await this.sheetsClient.appendSheet(SHEET_NAMES.PLATFORMS, [
        [
          newPlatform.id,
          newPlatform.name,
          newPlatform.category,
          newPlatform.priority,
          newPlatform.status,
          newPlatform.enabled.toString(),
          newPlatform.icon || ''
        ]
      ]);
      
      return newPlatform;
    } catch (error) {
      console.error('Error creating platform:', error);
      throw new Error(`Failed to create platform: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Update an existing platform
   * @param platformId Platform ID
   * @param platform Updated platform data
   * @returns Promise with success status
   */
  async updatePlatform(platformId: string, platform: Partial<Platform>): Promise<boolean> {
    try {
      // Get all platforms
      const platformsData = await this.sheetsClient.readSheet(SHEET_NAMES.PLATFORMS);
      
      // Find the row index for this platform
      const platformIndex = platformsData.findIndex(row => row[0] === platformId);
      
      if (platformIndex < 0) {
        return false;
      }
      
      // Get current platform data
      const currentPlatform = await this.getPlatform(platformId);
      
      if (!currentPlatform) {
        return false;
      }
      
      // Prepare the updated row
      const updatedRow = [
        platformId,
        platform.name || currentPlatform.name,
        platform.category || currentPlatform.category,
        platform.priority || currentPlatform.priority,
        platform.status || currentPlatform.status,
        (platform.enabled !== undefined ? platform.enabled : currentPlatform.enabled).toString(),
        platform.icon || currentPlatform.icon || ''
      ];
      
      // Update the platform
      await this.sheetsClient.writeSheet({
        sheet: SHEET_NAMES.PLATFORMS,
        range: `A${platformIndex + 1}:G${platformIndex + 1}`
      }, [updatedRow]);
      
      return true;
    } catch (error) {
      console.error('Error updating platform:', error);
      return false;
    }
  }
  
  /**
   * Delete a platform
   * @param platformId Platform ID
   * @returns Promise with success status
   */
  async deletePlatform(platformId: string): Promise<boolean> {
    // Note: Google Sheets API doesn't support direct row deletion
    // Instead, we'll mark the platform as disabled
    return this.updatePlatform(platformId, { enabled: false });
  }
  
  /**
   * Get all platform categories
   * @returns Promise with the list of categories
   */
  async getCategories(): Promise<PlatformCategory[]> {
    const platforms = await this.getPlatforms();
    const categories = new Set(platforms.map(p => p.category));
    return Array.from(categories);
  }
  
  /**
   * Get platform categories with counts
   * @param includeDisabled Whether to include disabled platforms
   * @returns Promise with the list of categories and counts
   */
  async getCategoryCounts(includeDisabled = false): Promise<PlatformCategoryCount[]> {
    const platforms = await this.getPlatforms();
    const filteredPlatforms = includeDisabled ? platforms : platforms.filter(p => p.enabled);
    
    // Group platforms by category
    const categoryCounts: Record<string, { total: number; confirmed: number }> = {};
    
    filteredPlatforms.forEach(platform => {
      if (!categoryCounts[platform.category]) {
        categoryCounts[platform.category] = { total: 0, confirmed: 0 };
      }
      
      categoryCounts[platform.category].total++;
      // In a real implementation, you would get confirmed counts from results
      // This is just a placeholder
      if (platform.status === 'online') {
        categoryCounts[platform.category].confirmed++;
      }
    });
    
    // Convert to array
    return Object.entries(categoryCounts).map(([category, counts]) => ({
      category: category as PlatformCategory,
      count: counts.total,
      confirmed: counts.confirmed
    }));
  }
  
  /**
   * Update platform status
   * @param platformId Platform ID
   * @param status New status
   * @returns Promise with success status
   */
  async updatePlatformStatus(platformId: string, status: PlatformStatus): Promise<boolean> {
    return this.updatePlatform(platformId, { status });
  }
}

export default PlatformService; 