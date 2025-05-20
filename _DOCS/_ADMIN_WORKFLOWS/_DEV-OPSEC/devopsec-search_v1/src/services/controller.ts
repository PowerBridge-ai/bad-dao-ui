import { PlatformDefinition, VerificationResult, VerificationRequest, AppSettings } from '../types';
import { ScraperService, defaultScraperSettings } from './scraper';
import ReportGenerator from './reportGenerator';
import { platforms, getPlatformById } from '../data/platforms';

export class ControllerService {
  private scraperService: ScraperService;
  private reportGenerator: ReportGenerator;
  private settings: AppSettings;
  private cookieStore: Map<string, string> = new Map();
  private isInitialized: boolean = false;
  
  constructor(settings?: Partial<AppSettings>) {
    this.settings = {
      scraper: defaultScraperSettings,
      reportFormat: 'both',
      concurrentScans: 3,
      ...settings
    };
    
    this.scraperService = new ScraperService(this.settings.scraper);
    this.reportGenerator = new ReportGenerator();
  }
  
  /**
   * Initialize the controller and services
   */
  async initialize(): Promise<void> {
    if (!this.isInitialized) {
      await this.scraperService.initialize();
      this.isInitialized = true;
    }
  }
  
  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    if (this.isInitialized) {
      await this.scraperService.cleanup();
      this.isInitialized = false;
    }
  }
  
  /**
   * Store a cookie for a platform
   */
  storeCookie(platformId: string, cookie: string): void {
    this.cookieStore.set(platformId, cookie);
  }
  
  /**
   * Get platforms to check based on request
   */
  private getPlatformsToCheck(request: VerificationRequest): PlatformDefinition[] {
    if (!request.platforms || request.platforms.length === 0) {
      // If no platforms specified, check all
      return platforms;
    }
    
    // Filter platforms by the IDs specified
    return request.platforms
      .map(id => getPlatformById(id))
      .filter((platform): platform is PlatformDefinition => platform !== undefined);
  }
  
  /**
   * Verify email on specified platforms
   */
  async verifyEmail(request: VerificationRequest): Promise<VerificationResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const platformsToCheck = this.getPlatformsToCheck(request);
    const results: VerificationResult[] = [];
    
    // Process platforms in batches according to concurrency setting
    for (let i = 0; i < platformsToCheck.length; i += this.settings.concurrentScans) {
      const batch = platformsToCheck.slice(i, i + this.settings.concurrentScans);
      
      // Process batch concurrently
      const batchResults = await Promise.all(
        batch.map(platform => 
          this.scraperService.verifyEmailOnPlatform(
            platform, 
            request.email, 
            this.cookieStore.get(platform.id)
          )
        )
      );
      
      results.push(...batchResults);
    }
    
    return results;
  }
  
  /**
   * Generate report in the specified format
   */
  generateReport(results: VerificationResult[], title: string = 'DevOpSec Search Report'): { 
    excel?: Buffer, 
    markdown?: string 
  } {
    const report: { excel?: Buffer, markdown?: string } = {};
    
    if (this.settings.reportFormat === 'excel' || this.settings.reportFormat === 'both') {
      report.excel = this.reportGenerator.generateExcelReport(results);
    }
    
    if (this.settings.reportFormat === 'markdown' || this.settings.reportFormat === 'both') {
      report.markdown = this.reportGenerator.generateMarkdownReport(results, title);
    }
    
    return report;
  }
  
  /**
   * Get all available platforms
   */
  getAllPlatforms(): PlatformDefinition[] {
    return platforms;
  }
  
  /**
   * Update settings
   */
  updateSettings(newSettings: Partial<AppSettings>): void {
    this.settings = {
      ...this.settings,
      ...newSettings,
      scraper: {
        ...this.settings.scraper,
        ...(newSettings.scraper || {})
      }
    };
    
    // Update scraper service with new settings
    this.scraperService = new ScraperService(this.settings.scraper);
    
    // Reset initialized state if scraper service was recreated
    this.isInitialized = false;
  }
}

export default ControllerService; 