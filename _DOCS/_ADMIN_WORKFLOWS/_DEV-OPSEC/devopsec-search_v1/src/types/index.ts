// Platform Types

export enum PlatformCategory {
  SocialMedia = 'Social Media',
  Development = 'Development',
  WebInfrastructure = 'Web Infrastructure',
  EmailCommunication = 'Email & Communication',
  Web3Platforms = 'Web3 Platforms',
  BusinessServices = 'Business Services'
}

export enum PriorityLevel {
  Critical = 'Critical',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export enum VerificationStatus {
  Confirmed = 'Confirmed',
  NotFound = 'Not Found',
  ManualCheckRequired = 'Manual Check Required',
  InProgress = 'In Progress',
  Error = 'Error'
}

export enum VerificationMethod {
  PasswordReset = 'Password Reset',
  LoginAttempt = 'Login Attempt',
  SignupAttempt = 'Signup Attempt',
  Manual = 'Manual'
}

export enum ScraperEngine {
  Playwright = 'Playwright',
  Puppeteer = 'Puppeteer',
  Cheerio = 'Cheerio'
}

export type PlatformDefinition = {
  id: string;
  name: string;
  category: PlatformCategory;
  priority: PriorityLevel;
  url: string;
  loginUrl?: string;
  forgotPasswordUrl?: string;
  emailFieldSelector?: string;
  submitButtonSelector?: string;
  responseSelectors?: {
    success?: string;
    error?: string;
    notFound?: string;
  };
  recommendedEngine: ScraperEngine;
};

export type VerificationResult = {
  email: string;
  platform: string;
  category: PlatformCategory;
  status: VerificationStatus;
  method?: VerificationMethod;
  timestamp: string;
  retryCount: number;
  flags?: string[];
  notes?: string;
};

export type VerificationRequest = {
  email: string;
  platforms?: string[]; // Platform IDs to check, if empty check all
};

// UI Types

export type TabularVerificationResult = VerificationResult & {
  id: string; // Unique identifier for the table
};

export type GroupedResults = {
  confirmed: VerificationResult[];
  manualCheck: VerificationResult[];
  notFound: VerificationResult[];
};

// Settings Types

export type ProxySettings = {
  enabled: boolean;
  url?: string;
  username?: string;
  password?: string;
  rotationEnabled?: boolean;
  rotationInterval?: number; // in seconds
};

export type ScraperSettings = {
  retryLimit: number;
  timeout: number; // in milliseconds
  delayBetweenRequests: number; // in milliseconds
  userAgentRotation: boolean;
  proxy: ProxySettings;
};

export type AppSettings = {
  scraper: ScraperSettings;
  reportFormat: 'excel' | 'markdown' | 'both';
  concurrentScans: number;
};

// Cookie Types

export type StoredCookie = {
  platform: string;
  cookies: string;
  expiresAt: string;
}; 