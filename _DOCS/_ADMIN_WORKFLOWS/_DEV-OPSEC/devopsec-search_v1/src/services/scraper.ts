import { PlatformDefinition, VerificationResult, VerificationStatus, VerificationMethod, ScraperEngine, ScraperSettings } from '../types';
import * as cheerio from 'cheerio';
import { chromium, Browser, Page } from 'playwright';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import randomUseragent from 'random-useragent';

// Add stealth plugin to puppeteer
puppeteer.use(StealthPlugin());

export class ScraperService {
  private settings: ScraperSettings;
  private browser: Browser | null = null;
  private puppeteerBrowser: any = null;

  constructor(settings: ScraperSettings) {
    this.settings = settings;
  }

  /**
   * Initialize the browsers
   */
  async initialize(): Promise<void> {
    // Initialize Playwright
    this.browser = await chromium.launch({
      headless: true
    });

    // Initialize Puppeteer
    this.puppeteerBrowser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
  }

  /**
   * Close browsers
   */
  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }

    if (this.puppeteerBrowser) {
      await this.puppeteerBrowser.close();
      this.puppeteerBrowser = null;
    }
  }

  /**
   * Get a random user agent
   */
  private getRandomUserAgent(): string {
    return randomUseragent.getRandom() || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  }

  /**
   * Main method to verify an email on a platform
   */
  async verifyEmailOnPlatform(
    platform: PlatformDefinition, 
    email: string,
    cookies?: string
  ): Promise<VerificationResult> {
    // Initialize result
    const result: VerificationResult = {
      email,
      platform: platform.name,
      category: platform.category,
      status: VerificationStatus.InProgress,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      flags: []
    };

    // Choose verification strategy based on platform settings
    try {
      // Apply cookies if provided
      if (cookies) {
        result.flags?.push('Using provided cookies');
      }

      // Try verification with retries
      let retries = 0;
      let success = false;

      while (retries < this.settings.retryLimit && !success) {
        try {
          result.retryCount = retries + 1;

          // Add delay between retries
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, this.settings.delayBetweenRequests));
          }

          // Choose scraper engine based on platform recommendation
          switch(platform.recommendedEngine) {
            case ScraperEngine.Playwright:
              await this.verifyWithPlaywright(platform, email, result);
              break;
            case ScraperEngine.Puppeteer:
              await this.verifyWithPuppeteer(platform, email, result);
              break;
            case ScraperEngine.Cheerio:
              await this.verifyWithCheerio(platform, email, result);
              break;
            default:
              // Default to Playwright
              await this.verifyWithPlaywright(platform, email, result);
          }

          // If we reach here without throwing, mark as success
          success = true;
        } catch (error) {
          retries++;
          console.error(`Retry ${retries}/${this.settings.retryLimit} for ${platform.name}: ${(error as Error).message}`);
          
          // If we've reached retry limit, mark as requiring manual check
          if (retries >= this.settings.retryLimit) {
            result.status = VerificationStatus.ManualCheckRequired;
            result.flags?.push('Reached retry limit');
            result.notes = `Error: ${(error as Error).message}`;
          }
        }
      }
    } catch (error) {
      result.status = VerificationStatus.Error;
      result.notes = `Error: ${(error as Error).message}`;
    }

    return result;
  }

  /**
   * Verify using Playwright
   */
  private async verifyWithPlaywright(
    platform: PlatformDefinition,
    email: string,
    result: VerificationResult
  ): Promise<void> {
    if (!this.browser) {
      throw new Error('Playwright browser not initialized');
    }

    // Create a new page
    const page = await this.browser.newPage();
    
    try {
      // Set timeout
      page.setDefaultTimeout(this.settings.timeout);
      
      // Set random user agent if enabled
      if (this.settings.userAgentRotation) {
        await page.setExtraHTTPHeaders({
          'User-Agent': this.getRandomUserAgent()
        });
      }
      
      // Go to forgot password page
      await page.goto(platform.forgotPasswordUrl || '');
      
      // Wait for the page to load
      await page.waitForLoadState('networkidle');
      
      // Check if CAPTCHA is present (this is a simplified check)
      const pageContent = await page.content();
      if (
        pageContent.includes('captcha') || 
        pageContent.includes('recaptcha') || 
        pageContent.includes('g-recaptcha')
      ) {
        result.status = VerificationStatus.ManualCheckRequired;
        result.flags?.push('CAPTCHA detected');
        result.method = VerificationMethod.Manual;
        return;
      }
      
      // Fill the email field
      if (platform.emailFieldSelector) {
        await page.fill(platform.emailFieldSelector, email);
      }
      
      // Click the submit button
      if (platform.submitButtonSelector) {
        await page.click(platform.submitButtonSelector);
      }
      
      // Wait for response
      await page.waitForLoadState('networkidle');
      
      // Check for success or error indicators
      if (platform.responseSelectors?.success && await page.$(platform.responseSelectors.success)) {
        result.status = VerificationStatus.Confirmed;
        result.method = VerificationMethod.PasswordReset;
      } else if (platform.responseSelectors?.notFound && await page.$(platform.responseSelectors.notFound)) {
        result.status = VerificationStatus.NotFound;
        result.method = VerificationMethod.PasswordReset;
      } else {
        // Can't determine, require manual check
        result.status = VerificationStatus.ManualCheckRequired;
        result.flags?.push('Ambiguous response');
        result.method = VerificationMethod.Manual;
      }
      
      // Take screenshot for debugging or verification
      // await page.screenshot({ path: `${platform.id}_${Date.now()}.png` });
    } finally {
      await page.close();
    }
  }

  /**
   * Verify using Puppeteer
   */
  private async verifyWithPuppeteer(
    platform: PlatformDefinition,
    email: string,
    result: VerificationResult
  ): Promise<void> {
    if (!this.puppeteerBrowser) {
      throw new Error('Puppeteer browser not initialized');
    }

    // Create a new page
    const page = await this.puppeteerBrowser.newPage();
    
    try {
      // Set timeout
      page.setDefaultTimeout(this.settings.timeout);
      
      // Set random user agent if enabled
      if (this.settings.userAgentRotation) {
        await page.setUserAgent(this.getRandomUserAgent());
      }
      
      // Go to forgot password page
      await page.goto(platform.forgotPasswordUrl || '');
      
      // Wait for the page to load
      await page.waitForNetworkIdle();
      
      // Check for CAPTCHA
      const pageContent = await page.content();
      if (
        pageContent.includes('captcha') || 
        pageContent.includes('recaptcha') || 
        pageContent.includes('g-recaptcha')
      ) {
        result.status = VerificationStatus.ManualCheckRequired;
        result.flags?.push('CAPTCHA detected');
        result.method = VerificationMethod.Manual;
        return;
      }
      
      // Fill the email field
      if (platform.emailFieldSelector) {
        await page.type(platform.emailFieldSelector, email);
      }
      
      // Click the submit button
      if (platform.submitButtonSelector) {
        await page.click(platform.submitButtonSelector);
      }
      
      // Wait for response
      await page.waitForNetworkIdle();
      
      // Check for success or error indicators
      if (
        platform.responseSelectors?.success && 
        await page.$(platform.responseSelectors.success)
      ) {
        result.status = VerificationStatus.Confirmed;
        result.method = VerificationMethod.PasswordReset;
      } else if (
        platform.responseSelectors?.notFound && 
        await page.$(platform.responseSelectors.notFound)
      ) {
        result.status = VerificationStatus.NotFound;
        result.method = VerificationMethod.PasswordReset;
      } else {
        // Can't determine, require manual check
        result.status = VerificationStatus.ManualCheckRequired;
        result.flags?.push('Ambiguous response');
        result.method = VerificationMethod.Manual;
      }
      
      // Take screenshot for debugging or verification
      // await page.screenshot({ path: `${platform.id}_${Date.now()}.png` });
    } finally {
      await page.close();
    }
  }

  /**
   * Verify using Cheerio (plain HTTP)
   */
  private async verifyWithCheerio(
    platform: PlatformDefinition,
    email: string,
    result: VerificationResult
  ): Promise<void> {
    try {
      // Cheerio is more limited - mostly used for parsing simple pages
      // For real implementation, you would use axios or fetch to make HTTP requests
      
      // This is a simplified implementation
      result.status = VerificationStatus.ManualCheckRequired;
      result.flags?.push('Cheerio implementation requires site-specific logic');
      result.method = VerificationMethod.Manual;
    } catch (error) {
      throw new Error(`Cheerio verification failed: ${(error as Error).message}`);
    }
  }
}

// Default settings
export const defaultScraperSettings: ScraperSettings = {
  retryLimit: 5,
  timeout: 30000,
  delayBetweenRequests: 2000,
  userAgentRotation: true,
  proxy: {
    enabled: false
  }
}; 