# Developer Notes - Bolt AI UI Coding Assistant Framework

## Technical Implementation Details

### System Specifications

#### Frontend Technology Stack
- **Framework**: Next.js 13 (React 18)
- **UI Library**: Chakra UI with custom Tron theme
- **State Management**: React Context API + SWR/React Query
- **Code Editor**: Monaco Editor (VS Code core)
- **Authentication**: NextAuth.js with custom providers
- **Styling**: Emotion (CSS-in-JS) with Chakra UI theming system
- **Type Checking**: TypeScript 5.0+
- **Testing**: Jest + React Testing Library

#### Backend Technology Stack
- **API Routes**: Next.js API routes (serverless functions)
- **Database**: Google Sheets API (as specified)
- **Authentication**: OAuth 2.0 + JWT + TypingDNA
- **AI Integration**: Cortex AI + OpenAI fallback
- **Search**: Algolia with custom indexing
- **Caching**: Redis (optional)

#### Infrastructure
- **Hosting**: Vercel or Netlify for frontend and serverless functions
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry for error tracking
- **Analytics**: Google Analytics or Plausible

### Google Sheets as Database

#### Design Considerations

Using Google Sheets as a database presents several challenges that require careful design:

1. **Performance Optimization**:
   - Implement aggressive caching
   - Batch read/write operations
   - Use named ranges for faster access
   - Maintain local indices

2. **Schema Management**:
   - Define explicit schemas (see file-tree.md)
   - Validate data before writing
   - Use separate sheets for different entity types
   - Include timestamp columns for all modifications

3. **Concurrency Handling**:
   - Implement optimistic locking
   - Use revision tracking
   - Queue write operations when possible
   - Implement retry logic for conflicts

4. **Connection Management**:
   - Pool API connections
   - Implement circuit breakers
   - Handle rate limiting gracefully
   - Cache authentication tokens

#### Implementation Approach

```typescript
// Example Google Sheets integration

// Service interface
interface DatabaseService {
  get<T>(sheet: string, id: string): Promise<T>;
  query<T>(sheet: string, filter: FilterOptions): Promise<T[]>;
  create<T>(sheet: string, data: Omit<T, 'id'>): Promise<T>;
  update<T>(sheet: string, id: string, data: Partial<T>): Promise<T>;
  delete(sheet: string, id: string): Promise<boolean>;
}

// Google Sheets implementation
class GoogleSheetsDatabase implements DatabaseService {
  private readonly sheetCache = new Map<string, SheetCache>();
  private readonly tokenManager: TokenManager;
  private readonly schemaValidator: SchemaValidator;
  
  constructor(config: GoogleSheetsConfig) {
    this.tokenManager = new TokenManager(config);
    this.schemaValidator = new SchemaValidator();
  }
  
  async get<T>(sheet: string, id: string): Promise<T> {
    // Get sheet data (with caching)
    const sheetData = await this.getSheetData(sheet);
    
    // Find row by id
    const row = sheetData.find(row => row.id === id);
    if (!row) throw new Error(`Record ${id} not found in ${sheet}`);
    
    // Convert row to object
    return this.rowToObject<T>(row);
  }
  
  async query<T>(sheet: string, filter: FilterOptions): Promise<T[]> {
    // Get sheet data (with caching)
    const sheetData = await this.getSheetData(sheet);
    
    // Apply filters
    const filtered = this.applyFilters(sheetData, filter);
    
    // Convert rows to objects
    return filtered.map(row => this.rowToObject<T>(row));
  }
  
  // Additional methods implementation...
  
  private async getSheetData(sheet: string): Promise<any[]> {
    // Check cache first
    const cached = this.sheetCache.get(sheet);
    if (cached && !this.isCacheExpired(cached)) {
      return cached.data;
    }
    
    // Fetch from Google Sheets API
    const token = await this.tokenManager.getToken();
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}/values/${sheet}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    
    const result = await response.json();
    const data = this.parseSheetData(result);
    
    // Update cache
    this.sheetCache.set(sheet, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  }
  
  // Additional helper methods...
}
```

### TypingDNA Integration

#### Implementation Approach

The TypingDNA integration will be handled through their JavaScript SDK with the following approach:

1. **Initial Setup**:
   - Include the TypingDNA JavaScript recorder
   - Initialize during user registration
   - Create a typing pattern during account setup

2. **Authentication Process**:
   - User logs in with GitHub/Google OAuth
   - For sensitive operations, prompt for typing pattern
   - Verify pattern against stored baseline
   - Use as second factor authentication

3. **Stealth Mode**:
   - Special handling for `@devopsec-search.md` password
   - No visual indication of biometric verification
   - Silent verification in background

```typescript
// Example TypingDNA integration

class TypingDnaService {
  private tdna: any; // TypingDNA SDK
  private recorder: any;
  
  constructor() {
    // Initialize TypingDNA
    this.tdna = new TypingDNA();
    this.recorder = this.tdna.getRecorder();
    this.recorder.start();
  }
  
  capturePattern(text: string): string {
    return this.tdna.getTypingPattern({
      text,
      caseSensitive: false,
      textId: 'verification'
    });
  }
  
  async verifyPattern(
    userId: string, 
    currentPattern: string
  ): Promise<VerificationResult> {
    // Fetch user's stored patterns from Google Sheets
    const userPatterns = await this.getUserPatterns(userId);
    
    // Send for verification to TypingDNA API
    const response = await fetch('/api/auth/typing-dna/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        currentPattern,
        storedPatterns: userPatterns
      })
    });
    
    if (!response.ok) {
      throw new Error('TypingDNA verification failed');
    }
    
    const result = await response.json();
    return {
      success: result.success,
      score: result.score,
      match: result.score >= TYPING_MATCH_THRESHOLD
    };
  }
  
  async stealthVerify(password: string): Promise<boolean> {
    // Special handling for stealth verification
    if (password !== '@devopsec-search.md') return false;
    
    // Get current user
    const user = getCurrentUser();
    if (!user) return false;
    
    // Get typing pattern for password
    const pattern = this.capturePattern(password);
    
    // Verify pattern silently
    try {
      const verification = await this.verifyPattern(user.id, pattern);
      return verification.match;
    } catch (error) {
      console.error('Stealth verification failed:', error);
      return false;
    }
  }
  
  // Additional methods...
}
```

### Tron Theme Implementation

The Tron theme will be implemented using Chakra UI's theming system with the following approach:

```typescript
// theme.ts
import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    primary: '#00ff41', // Neon green
    secondary: '#00ffd9', // Cyan
    accent: '#0058ff', // Blue
    background: '#000000', // Black
    surface: '#0a0a0a', // Very dark gray
    surface2: '#1a1a1a', // Dark gray
  },
};

const fonts = {
  body: '"Source Code Pro", monospace',
  heading: '"Source Code Pro", monospace',
  mono: '"Fira Code", monospace',
};

const styles = {
  global: {
    body: {
      bg: 'brand.background',
      color: 'brand.primary',
    },
    '::-webkit-scrollbar': {
      width: '6px',
    },
    '::-webkit-scrollbar-track': {
      bg: 'brand.surface',
    },
    '::-webkit-scrollbar-thumb': {
      bg: 'brand.primary',
      borderRadius: '3px',
    },
  },
};

// Custom components styling
const components = {
  Button: {
    baseStyle: {
      borderRadius: '0',
      fontWeight: 'normal',
      letterSpacing: '1px',
      _focus: {
        boxShadow: `0 0 0 3px ${colors.brand.primary}`,
      },
    },
    variants: {
      solid: {
        bg: 'brand.surface',
        border: '1px solid',
        borderColor: 'brand.primary',
        color: 'brand.primary',
        _hover: {
          bg: 'rgba(0, 255, 65, 0.1)',
        },
        _active: {
          bg: 'rgba(0, 255, 65, 0.2)',
        },
      },
      outline: {
        bg: 'transparent',
        border: '1px solid',
        borderColor: 'brand.primary',
        color: 'brand.primary',
      },
      ghost: {
        bg: 'transparent',
        color: 'brand.primary',
        _hover: {
          bg: 'rgba(0, 255, 65, 0.05)',
        },
      },
    },
    defaultProps: {
      variant: 'solid',
    },
  },
  Card: {
    baseStyle: {
      bg: 'brand.surface',
      border: '1px solid',
      borderColor: 'brand.primary',
      borderRadius: '0',
      overflow: 'hidden',
      boxShadow: `0 0 10px rgba(0, 255, 65, 0.2)`,
    },
  },
  Input: {
    baseStyle: {
      field: {
        bg: 'brand.surface',
        borderColor: 'brand.primary',
        borderRadius: '0',
        _focus: {
          borderColor: 'brand.secondary',
          boxShadow: `0 0 0 1px ${colors.brand.secondary}`,
        },
      },
    },
    variants: {
      outline: {
        field: {
          border: '1px solid',
          borderColor: 'brand.primary',
        },
      },
      filled: {
        field: {
          bg: 'brand.surface2',
          _hover: {
            bg: 'brand.surface',
          },
          _focus: {
            bg: 'brand.surface',
          },
        },
      },
    },
    defaultProps: {
      variant: 'outline',
    },
  },
  // Additional component styling...
};

export const tronTheme = extendTheme({
  colors,
  fonts,
  styles,
  components,
});
```

### Custom Tron UI Elements

```typescript
// TronElements.tsx
import { Box, BoxProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const TronGrid = (props: BoxProps) => (
  <Box
    position="absolute"
    top="0"
    left="0"
    right="0"
    bottom="0"
    zIndex="0"
    backgroundImage="linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)"
    backgroundSize="20px 20px"
    opacity="0.4"
    pointerEvents="none"
    {...props}
  />
);

export const TronGlow = (props: BoxProps) => (
  <MotionBox
    position="absolute"
    top="0"
    left="0"
    right="0"
    bottom="0"
    zIndex="0"
    bg="transparent"
    boxShadow="0 0 20px 5px rgba(0, 255, 65, 0.2), 0 0 40px 10px rgba(0, 255, 65, 0.1)"
    pointerEvents="none"
    initial={{ opacity: 0.5 }}
    animate={{ 
      opacity: [0.5, 0.7, 0.5], 
    }}
    transition={{ 
      duration: 4, 
      repeat: Infinity,
      ease: "easeInOut" 
    }}
    {...props}
  />
);

export const TronLine = (props: BoxProps) => (
  <Box
    height="1px"
    width="100%"
    bg="brand.primary"
    boxShadow="0 0 5px 1px rgba(0, 255, 65, 0.5)"
    {...props}
  />
);

export const TronScanline = (props: BoxProps) => (
  <MotionBox
    position="absolute"
    height="2px"
    width="100%"
    bg="rgba(0, 255, 65, 0.3)"
    zIndex="1"
    pointerEvents="none"
    initial={{ top: "0%" }}
    animate={{ top: "100%" }}
    transition={{ 
      duration: 3, 
      repeat: Infinity,
      ease: "linear" 
    }}
    {...props}
  />
);

export const TronCircuit = (props: BoxProps) => (
  <Box
    position="absolute"
    top="0"
    left="0"
    right="0"
    bottom="0"
    zIndex="0"
    opacity="0.1"
    backgroundImage="url('/images/circuit-pattern.svg')"
    backgroundSize="cover"
    backgroundPosition="center"
    backgroundRepeat="no-repeat"
    pointerEvents="none"
    {...props}
  />
);
```

### AI Integration

#### Cortex AI Implementation

For the Cortex AI integration, we'll use a unified client interface that can later support multiple AI providers:

```typescript
// AI Service interface
interface AIService {
  analyzeCode(code: string, language: string): Promise<CodeAnalysis>;
  generateCode(prompt: string, language: string): Promise<string>;
  completeSuggestion(code: string, position: Position): Promise<Completion[]>;
  chat(messages: ChatMessage[]): Promise<ChatMessage>;
}

// Cortex AI implementation
class CortexAIService implements AIService {
  private apiKey: string;
  private baseUrl: string;
  
  constructor(config: CortexAIConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.cortex.ai';
  }
  
  async analyzeCode(code: string, language: string): Promise<CodeAnalysis> {
    const response = await this.makeRequest('/code/analyze', {
      code,
      language,
      options: {
        includeVulnerabilities: true,
        includeOptimizations: true,
        includeDocumentation: true
      }
    });
    
    return this.mapResponseToCodeAnalysis(response);
  }
  
  async generateCode(prompt: string, language: string): Promise<string> {
    const response = await this.makeRequest('/code/generate', {
      prompt,
      language,
      options: {
        quality: 'high',
        creativity: 0.7
      }
    });
    
    return response.code;
  }
  
  async completeSuggestion(code: string, position: Position): Promise<Completion[]> {
    const response = await this.makeRequest('/code/complete', {
      code,
      position,
      options: {
        maxCompletions: 5,
        maxTokens: 100
      }
    });
    
    return response.completions.map(c => ({
      text: c.text,
      displayText: c.displayText,
      documentation: c.documentation,
      kind: c.kind
    }));
  }
  
  async chat(messages: ChatMessage[]): Promise<ChatMessage> {
    const response = await this.makeRequest('/chat', {
      messages,
      options: {
        temperature: 0.7,
        maxTokens: 500
      }
    });
    
    return {
      role: 'assistant',
      content: response.message
    };
  }
  
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(`Cortex AI request failed: ${error?.message || response.statusText}`);
    }
    
    return await response.json();
  }
  
  private mapResponseToCodeAnalysis(response: any): CodeAnalysis {
    // Map API response to our internal model
    return {
      vulnerabilities: response.vulnerabilities.map(v => ({
        severity: v.severity,
        description: v.description,
        location: v.location,
        fix: v.suggestedFix
      })),
      optimizations: response.optimizations.map(o => ({
        impact: o.impact,
        description: o.description,
        location: o.location,
        suggestion: o.suggestion
      })),
      documentation: response.documentation,
      complexity: response.metrics.complexity,
      quality: response.metrics.quality
    };
  }
}
```

### Search Implementation

```typescript
// SearchService.ts
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';

class SearchService {
  private client: SearchClient;
  private indices: Record<string, SearchIndex>;
  
  constructor(config: SearchConfig) {
    this.client = algoliasearch(config.appId, config.apiKey);
    this.indices = {
      snippets: this.client.initIndex('snippets'),
      interactions: this.client.initIndex('ai_interactions'),
      documentation: this.client.initIndex('documentation')
    };
  }
  
  async search(query: string, options: SearchOptions = {}): Promise<SearchResults> {
    const { indexName = 'snippets', filters, page = 0, hitsPerPage = 20 } = options;
    
    const index = this.indices[indexName];
    if (!index) throw new Error(`Index "${indexName}" not found`);
    
    const results = await index.search(query, {
      filters: filters ? this.buildFilters(filters) : undefined,
      page,
      hitsPerPage
    });
    
    return {
      hits: results.hits,
      nbHits: results.nbHits,
      page: results.page,
      nbPages: results.nbPages,
      query: results.query
    };
  }
  
  async indexDocument(
    indexName: string, 
    document: Record<string, any>
  ): Promise<void> {
    const index = this.indices[indexName];
    if (!index) throw new Error(`Index "${indexName}" not found`);
    
    await index.saveObject({
      ...document,
      objectID: document.id || document.objectID
    });
  }
  
  async deleteDocument(
    indexName: string, 
    objectID: string
  ): Promise<void> {
    const index = this.indices[indexName];
    if (!index) throw new Error(`Index "${indexName}" not found`);
    
    await index.deleteObject(objectID);
  }
  
  private buildFilters(filters: Record<string, any>): string {
    return Object.entries(filters)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `(${value.map(v => `${key}:${v}`).join(' OR ')})`;
        }
        return `${key}:${value}`;
      })
      .join(' AND ');
  }
}
```

### Google Sheets Synchronization with Search Index

```typescript
// SyncService.ts
class SyncService {
  private readonly sheetsDb: GoogleSheetsDatabase;
  private readonly searchService: SearchService;
  
  constructor(
    sheetsDb: GoogleSheetsDatabase,
    searchService: SearchService
  ) {
    this.sheetsDb = sheetsDb;
    this.searchService = searchService;
  }
  
  async syncSnippets(): Promise<SyncResult> {
    // Get all snippets from Google Sheets
    const snippets = await this.sheetsDb.query('code_snippets', {});
    
    let indexed = 0;
    let errors = 0;
    
    // Index each snippet
    for (const snippet of snippets) {
      try {
        await this.searchService.indexDocument('snippets', {
          objectID: snippet.id,
          title: snippet.title,
          description: snippet.description,
          language: snippet.language,
          code: snippet.code,
          tags: snippet.tags,
          created_at: snippet.created_at,
          updated_at: snippet.updated_at,
          user_id: snippet.user_id
        });
        indexed++;
      } catch (error) {
        console.error(`Failed to index snippet ${snippet.id}:`, error);
        errors++;
      }
    }
    
    return { total: snippets.length, indexed, errors };
  }
  
  async syncInteractions(): Promise<SyncResult> {
    // Similar implementation for AI interactions
    // ...
  }
  
  async scheduleSync(intervalMs: number = 60 * 60 * 1000): void {
    // Set up periodic sync
    setInterval(async () => {
      try {
        await this.syncSnippets();
        await this.syncInteractions();
        console.log('Sync completed successfully');
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }, intervalMs);
  }
}
```

## Performance Considerations

### Frontend Optimization

1. **Component Memoization**:
   - Use React.memo for expensive components
   - Implement useMemo for expensive calculations
   - Utilize useCallback for stable function references

2. **Code Splitting**:
   - Use dynamic imports for large components
   - Implement page-level code splitting
   - Lazy load non-critical resources

3. **Image Optimization**:
   - Use Next.js Image component
   - Implement responsive images
   - Optimize SVG assets

4. **Bundle Optimization**:
   - Tree-shake unused code
   - Minimize dependencies
   - Use production builds

### Backend Optimization

1. **Google Sheets Performance**:
   - Implement aggressive caching
   - Use batch operations
   - Minimize API calls
   - Implement connection pooling

2. **Serverless Functions**:
   - Keep cold start time minimal
   - Optimize memory usage
   - Implement proper timeout handling

3. **Search Optimization**:
   - Use efficient indexing strategies
   - Implement faceted search carefully
   - Consider pagination for large result sets

## Security Implementation

### Authentication Flow

1. **Primary Authentication**:
   - OAuth 2.0 with GitHub or Google
   - JWT-based session management
   - Short-lived tokens with refresh mechanism

2. **Biometric Verification**:
   - TypingDNA integration for keystroke analysis
   - Pattern matching against stored profiles
   - Secure storage of biometric templates

3. **Stealth Mode**:
   - Special handling for predefined password
   - Background verification without visual indicators
   - Enhanced security for sensitive operations

### Data Security

1. **API Keys Protection**:
   - Encrypted storage in Google Sheets
   - Access through admin panel only
   - Regular rotation
   - Audit logging

2. **Code Snippet Security**:
   - User-based access control
   - Sanitization of input
   - Prevention of unsafe execution

3. **Session Security**:
   - CSRF protection
   - Secure, HTTP-only cookies
   - SameSite cookie policy
   - XSS prevention

## Configuration Management

### Admin Panel Implementation

The admin panel will provide interfaces for:

1. **API Key Management**:
   - View, add, edit, and delete API keys
   - Automatic rotation scheduling
   - Usage monitoring

2. **User Management**:
   - View and manage user accounts
   - Role assignment
   - Access control

3. **System Configuration**:
   - AI model selection
   - Default settings
   - Feature toggles
   - Performance tuning

4. **Analytics Dashboard**:
   - Usage statistics
   - Performance metrics
   - Error monitoring

## Integration Testing Strategy

To ensure all components work together:

1. **Authentication Testing**:
   - Mock OAuth providers
   - Test TypingDNA integration
   - Verify session management

2. **AI Integration Testing**:
   - Mock Cortex AI responses
   - Test different AI operation types
   - Verify error handling

3. **Google Sheets Testing**:
   - Create test spreadsheets
   - Verify CRUD operations
   - Test concurrency handling

4. **End-to-End Testing**:
   - Cypress for UI testing
   - Complete user flows
   - Cross-browser compatibility 