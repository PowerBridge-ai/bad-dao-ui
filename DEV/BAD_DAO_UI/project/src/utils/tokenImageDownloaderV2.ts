import fs from 'fs';
import path from 'path';
import axios from 'axios';
import readline from 'readline';

// Define the base directory where token images will be saved
const BASE_DIR = 'G:\\TOKEN IMAGES';

// Define the range to scan (from ID 1 to 25000)
const START_ID = 1;
const END_ID = 25000;
const BATCH_SIZE = 100; // Process in batches to avoid overloading

// CoinMarketCap base URL
const BASE_URL = 'https://s2.coinmarketcap.com/static/img/coins/64x64';

// Emoji for logs - make them fun and informative
const EMOJI = {
  start: '🚀',
  folder: '📁',
  download: '⬇️',
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
  complete: '🎉',
  token: '🪙',
  batch: '📦',
  progress: '📊',
  timestamp: '⏱️',
  numbered: '🔢',
  named: '🔤',
  count: '🔢',
  wait: '⏳',
  json: '📋',
  html: '🌐'
};

// Token data interface
interface TokenData {
  id: number;
  symbol?: string;
  name?: string;
  imageUrl: string;
}

// Token metadata API source URL
const TOKEN_METADATA_API = 'https://api.coingecko.com/api/v3/coins/list';

// -----------------------------------------------------
// Helper functions for file/directory management
// -----------------------------------------------------

/**
 * Creates a timestamp-based folder for this download session
 */
const createTimestampFolder = (): string => {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/:/g, '-')
    .replace(/\..+/, '')
    .replace('T', '_');
  
  const downloadMode = process.argv[2] === 'named' ? 'named' : 'numbered';
  const sessionDir = path.join(BASE_DIR, `${timestamp}_${downloadMode}`);
  
  if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
    console.log(`${EMOJI.folder} Created base directory: ${BASE_DIR}`);
  }
  
  fs.mkdirSync(sessionDir, { recursive: true });
  console.log(`${EMOJI.folder} Created session directory: ${sessionDir}`);
  
  return sessionDir;
};

// -----------------------------------------------------
// Token metadata fetching and management
// -----------------------------------------------------

/**
 * Fetch token metadata from CoinGecko API
 */
const fetchTokenMetadata = async (): Promise<Record<number, { symbol: string, name: string }>> => {
  console.log(`${EMOJI.info} Fetching token metadata from CoinGecko...`);
  
  try {
    // Attempt to load from cache file first
    const cacheFile = path.join(BASE_DIR, 'token_metadata_cache.json');
    
    if (fs.existsSync(cacheFile)) {
      const cacheData = fs.readFileSync(cacheFile, 'utf8');
      const cached = JSON.parse(cacheData);
      console.log(`${EMOJI.success} Loaded token metadata from cache (${Object.keys(cached).length} tokens)`);
      return cached;
    }
    
    // Fetch from API if no cache exists
    console.log(`${EMOJI.download} No cache found, fetching from API...`);
    const response = await axios.get(TOKEN_METADATA_API);
    const tokens = response.data;
    
    // Process the data into our desired format
    const tokenMap: Record<number, { symbol: string, name: string }> = {};
    
    // Include our known mappings first
    Object.assign(tokenMap, KNOWN_TOKENS);
    
    // Create a cache file for future use
    fs.writeFileSync(cacheFile, JSON.stringify(tokenMap, null, 2));
    console.log(`${EMOJI.success} Saved token metadata to cache file`);
    
    return tokenMap;
  } catch (error) {
    console.error(`${EMOJI.error} Error fetching token metadata:`, error);
    return KNOWN_TOKENS; // Fall back to known tokens
  }
};

// Known tokens as fallback
const KNOWN_TOKENS: Record<number, { symbol: string, name: string }> = {
  1: { symbol: 'BTC', name: 'Bitcoin' },
  1027: { symbol: 'ETH', name: 'Ethereum' },
  5426: { symbol: 'SOL', name: 'Solana' },
  825: { symbol: 'USDT', name: 'Tether' },
  1839: { symbol: 'BNB', name: 'BNB' },
  3408: { symbol: 'USDC', name: 'USD Coin' },
  52: { symbol: 'XRP', name: 'XRP' },
  5805: { symbol: 'AVAX', name: 'Avalanche' },
  2010: { symbol: 'ADA', name: 'Cardano' },
  6636: { symbol: 'DOT', name: 'Polkadot' },
  74: { symbol: 'DOGE', name: 'Dogecoin' },
  3890: { symbol: 'MATIC', name: 'Polygon' },
  1958: { symbol: 'TRX', name: 'TRON' },
  4687: { symbol: 'LINK', name: 'Chainlink' },
  7083: { symbol: 'UNI', name: 'Uniswap' },
  2: { symbol: 'LTC', name: 'Litecoin' },
  1831: { symbol: 'BCH', name: 'Bitcoin Cash' },
  3794: { symbol: 'ATOM', name: 'Cosmos' },
  11419: { symbol: 'VET', name: 'VeChain' },
  // Add more known tokens here
};

// -----------------------------------------------------
// Image downloading functions
// -----------------------------------------------------

/**
 * Attempts to download a token image by ID with numbered naming
 */
const downloadTokenImageNumbered = async (
  id: number, 
  tokenDir: string, 
  tokenMetadata: Record<number, { symbol: string, name: string }>
): Promise<TokenData | null> => {
  try {
    const url = `${BASE_URL}/${id}.png`;
    const response = await axios.get(url, { 
      responseType: 'arraybuffer',
      validateStatus: (status) => status < 500 
    });
    
    // If image doesn't exist, skip it
    if (response.status === 404 || !response.data || response.data.length === 0) {
      return null;
    }

    // Use ID for the filename in numbered mode
    const fileName = `${id}.png`;
    const outputPath = path.join(tokenDir, fileName);
    
    // Save the image
    fs.writeFileSync(outputPath, response.data);
    
    // Get token info if available
    const tokenInfo = tokenMetadata[id] || { symbol: undefined, name: undefined };
    
    // Prepare token data
    const tokenData: TokenData = {
      id,
      symbol: tokenInfo.symbol,
      name: tokenInfo.name,
      imageUrl: outputPath
    };
    
    const displayName = tokenInfo.symbol 
      ? `${tokenInfo.name || 'Unknown'} (${tokenInfo.symbol})` 
      : `ID ${id}`;
    
    console.log(`${EMOJI.download} Downloaded ${displayName} to ${fileName}`);
    return tokenData;
  } catch (error) {
    console.error(`${EMOJI.error} Error downloading token ID ${id}:`, error);
    return null;
  }
};

/**
 * Attempts to download a token image by ID with symbol-based naming
 */
const downloadTokenImageNamed = async (
  id: number, 
  tokenDir: string, 
  tokenMetadata: Record<number, { symbol: string, name: string }>
): Promise<TokenData | null> => {
  try {
    const url = `${BASE_URL}/${id}.png`;
    const response = await axios.get(url, { 
      responseType: 'arraybuffer',
      validateStatus: (status) => status < 500 
    });
    
    // If image doesn't exist, skip it
    if (response.status === 404 || !response.data || response.data.length === 0) {
      return null;
    }

    // Get token info if available
    const tokenInfo = tokenMetadata[id] || { symbol: undefined, name: undefined };
    
    // Determine filename based on token info
    let fileName: string;
    if (tokenInfo.symbol) {
      // Use symbol for filename if available
      fileName = `${tokenInfo.symbol.toLowerCase()}.png`;
    } else {
      // Fall back to ID if no symbol available
      fileName = `id_${id}.png`;
    }
    
    const outputPath = path.join(tokenDir, fileName);
    
    // Save the image
    fs.writeFileSync(outputPath, response.data);
    
    // Prepare token data
    const tokenData: TokenData = {
      id,
      symbol: tokenInfo.symbol,
      name: tokenInfo.name,
      imageUrl: outputPath
    };
    
    const displayName = tokenInfo.symbol 
      ? `${tokenInfo.name || 'Unknown'} (${tokenInfo.symbol})` 
      : `ID ${id}`;
    
    console.log(`${EMOJI.download} Downloaded ${displayName} to ${fileName}`);
    return tokenData;
  } catch (error) {
    console.error(`${EMOJI.error} Error downloading token ID ${id}:`, error);
    return null;
  }
};

// -----------------------------------------------------
// Index file generation
// -----------------------------------------------------

/**
 * Creates an index file mapping token IDs to their details
 */
const createTokenIndex = (tokenDir: string, downloadedTokens: TokenData[]): void => {
  const indexPath = path.join(tokenDir, 'index.ts');
  
  // Create token map objects
  const tokenMapById: Record<string, string> = {};
  const tokenMapBySymbol: Record<string, string> = {};
  
  downloadedTokens.forEach(token => {
    tokenMapById[token.id] = token.imageUrl;
    if (token.symbol) {
      tokenMapBySymbol[token.symbol] = token.imageUrl;
    }
  });
  
  const tokenIndexContent = `
// This file is auto-generated - do not edit manually
export interface TokenInfo {
  id: number;
  symbol?: string;
  name?: string;
  imageUrl: string;
}

// All downloaded tokens
export const tokens: TokenInfo[] = ${JSON.stringify(downloadedTokens, null, 2)};

// Map of token IDs to image URLs
export const tokenImagesById: Record<string, string> = ${JSON.stringify(tokenMapById, null, 2)};

// Map of token symbols to image URLs (only for known tokens)
export const tokenImagesBySymbol: Record<string, string> = ${JSON.stringify(tokenMapBySymbol, null, 2)};

// Get token image URL by ID
export const getTokenImageById = (id: number): string => {
  return tokenImagesById[id] || '';
};

// Get token image URL by symbol
export const getTokenImageBySymbol = (symbol: string): string => {
  return tokenImagesBySymbol[symbol.toUpperCase()] || '';
};
`;

  fs.writeFileSync(indexPath, tokenIndexContent);
  console.log(`${EMOJI.json} Created TypeScript index file at ${indexPath}`);
};

/**
 * Creates a simple JSON file mapping token details
 */
const createJsonIndex = (tokenDir: string, downloadedTokens: TokenData[]): void => {
  const jsonPath = path.join(tokenDir, 'tokens.json');
  
  // Create a more readable structure for the JSON file
  const jsonData = {
    tokens: downloadedTokens,
    byId: downloadedTokens.reduce((acc, token) => {
      acc[token.id] = token;
      return acc;
    }, {} as Record<number, TokenData>),
    bySymbol: downloadedTokens.reduce((acc, token) => {
      if (token.symbol) {
        acc[token.symbol] = token;
      }
      return acc;
    }, {} as Record<string, TokenData>)
  };
  
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
  console.log(`${EMOJI.json} Created JSON index file at ${jsonPath}`);
};

/**
 * Creates an HTML file for preview of all downloaded tokens
 */
const createHtmlPreview = (tokenDir: string, downloadedTokens: TokenData[]): void => {
  const htmlPath = path.join(tokenDir, 'preview.html');
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CoinMarketCap Token Images</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 1600px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
    }
    .stats {
      text-align: center;
      margin-bottom: 20px;
      font-size: 18px;
    }
    .search {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }
    .search input {
      padding: 8px 16px;
      font-size: 16px;
      width: 300px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .token-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 15px;
    }
    .token-card {
      background: white;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.2s;
    }
    .token-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    .token-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 10px;
    }
    .token-symbol {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 4px;
    }
    .token-name {
      color: #666;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .token-id {
      color: #999;
      font-size: 12px;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <h1>CoinMarketCap Token Images</h1>
  <div class="stats">Total tokens downloaded: ${downloadedTokens.length}</div>
  <div class="search">
    <input type="text" id="search" placeholder="Search by ID or symbol...">
  </div>
  <div class="token-grid" id="tokenGrid">
    ${downloadedTokens.map(token => {
      // Determine the image filename based on the path
      const imageName = path.basename(token.imageUrl);
      return `
    <div class="token-card" data-id="${token.id}" data-symbol="${token.symbol || ''}">
      <img class="token-icon" src="${imageName}" alt="Token ${token.id}">
      <div class="token-symbol">${token.symbol || `ID: ${token.id}`}</div>
      ${token.name ? `<div class="token-name">${token.name}</div>` : ''}
      <div class="token-id">ID: ${token.id}</div>
    </div>`;
    }).join('')}
  </div>

  <script>
    document.getElementById('search').addEventListener('input', function(e) {
      const value = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.token-card');
      
      cards.forEach(card => {
        const id = card.getAttribute('data-id');
        const symbol = card.getAttribute('data-symbol').toLowerCase();
        
        if (id.includes(value) || symbol.includes(value)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  </script>
</body>
</html>
  `;
  
  fs.writeFileSync(htmlPath, htmlContent);
  console.log(`${EMOJI.html} Created HTML preview file at ${htmlPath}`);
};

// -----------------------------------------------------
// Batch processing and main download functions
// -----------------------------------------------------

/**
 * Process a batch of token IDs
 */
const processBatch = async (
  startId: number, 
  endId: number, 
  tokenDir: string,
  tokenMetadata: Record<number, { symbol: string, name: string }>,
  mode: 'numbered' | 'named'
): Promise<number> => {
  let successCount = 0;
  
  for (let id = startId; id <= endId; id++) {
    let success = false;
    
    if (mode === 'numbered') {
      const result = await downloadTokenImageNumbered(id, tokenDir, tokenMetadata);
      success = !!result;
      if (success) {
        successCount++;
      }
    } else {
      const result = await downloadTokenImageNamed(id, tokenDir, tokenMetadata);
      success = !!result;
      if (success) {
        successCount++;
      }
    }
    
    // Small delay to avoid rate limiting
    if (id % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  
  return successCount;
};

/**
 * Main function to download all token images and create the index
 */
const downloadAllTokenImages = async (mode: 'numbered' | 'named'): Promise<void> => {
  try {
    console.log(`\n${EMOJI.start} Starting comprehensive token image download (${mode} mode)...`);
    console.log(`${EMOJI.timestamp} Time: ${new Date().toLocaleString()}`);
    
    // Create timestamped directory for this download
    const tokenDir = createTimestampFolder();
    console.log(`${EMOJI.info} Target directory: ${tokenDir}`);
    console.log(`${EMOJI.info} Scanning token IDs from ${START_ID} to ${END_ID}`);
    
    // Fetch token metadata
    const tokenMetadata = await fetchTokenMetadata();
    
    // Storage for downloaded tokens
    const downloadedTokens: TokenData[] = [];
    
    // Process in batches to avoid overloading
    let totalSuccessful = 0;
    
    for (let batchStart = START_ID; batchStart <= END_ID; batchStart += BATCH_SIZE) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, END_ID);
      console.log(`\n${EMOJI.batch} Processing batch: ${batchStart} to ${batchEnd}`);
      
      const batchSuccessful = await processBatch(batchStart, batchEnd, tokenDir, tokenMetadata, mode);
      totalSuccessful += batchSuccessful;
      
      console.log(`${EMOJI.success} Batch completed. Found ${batchSuccessful} valid tokens in this batch.`);
      console.log(`${EMOJI.progress} Total successful downloads so far: ${totalSuccessful}`);
      
      // Create intermediate index files every 10 batches
      if (batchStart % (BATCH_SIZE * 10) === 0 && batchStart > START_ID) {
        console.log(`${EMOJI.wait} Creating intermediate index...`);
        createJsonIndex(tokenDir, downloadedTokens);
      }
      
      // Add a small delay between batches
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Create the index files
    console.log(`\n${EMOJI.json} Creating final index files...`);
    createTokenIndex(tokenDir, downloadedTokens);
    createJsonIndex(tokenDir, downloadedTokens);
    
    // Create HTML preview
    console.log(`${EMOJI.html} Creating HTML preview...`);
    createHtmlPreview(tokenDir, downloadedTokens);
    
    console.log(`\n${EMOJI.complete} Token image download process completed successfully!`);
    console.log(`${EMOJI.count} Total tokens downloaded: ${totalSuccessful}`);
    console.log(`${EMOJI.folder} Images saved to: ${tokenDir}`);
    console.log(`${EMOJI.html} Preview available at: ${path.join(tokenDir, 'preview.html')}`);
    console.log(`${EMOJI.timestamp} Finished at: ${new Date().toLocaleString()}\n`);
  } catch (error) {
    console.error(`\n${EMOJI.error} Error in token image download process:`, error);
  }
};

// -----------------------------------------------------
// CLI interface
// -----------------------------------------------------

/**
 * Display the CLI menu for user selection
 */
const displayMenu = (): Promise<'numbered' | 'named'> => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    console.log('\n🪙 CoinMarketCap Token Image Downloader v2 🪙');
    console.log('=================================================\n');
    console.log('Please select a download mode:');
    console.log(`${EMOJI.numbered} 1. Numbered Mode - Downloads images with ID as filename (e.g., 1.png, 2.png)`);
    console.log(`${EMOJI.named} 2. Named Mode - Downloads images with token symbol as filename (e.g., btc.png, eth.png)`);
    console.log('\nEnter your choice (1 or 2):');
    
    rl.question('> ', (answer) => {
      rl.close();
      if (answer === '2') {
        resolve('named');
      } else {
        resolve('numbered');
      }
    });
  });
};

// -----------------------------------------------------
// Main execution
// -----------------------------------------------------

/**
 * Main execution function
 */
const main = async (): Promise<void> => {
  // Check if mode specified in command line
  const modeArg = process.argv[2];
  
  let mode: 'numbered' | 'named';
  
  if (modeArg === 'numbered' || modeArg === 'named') {
    mode = modeArg;
  } else {
    // If no valid mode provided, show menu
    mode = await displayMenu();
  }
  
  await downloadAllTokenImages(mode);
};

// Run the tool
main();

// Export functions for use in other files (if needed)
export {
  downloadAllTokenImages,
}; 