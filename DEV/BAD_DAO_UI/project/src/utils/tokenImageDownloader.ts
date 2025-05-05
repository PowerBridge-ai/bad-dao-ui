import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Define the directory where token images will be saved
const TOKEN_IMAGES_DIR = 'G:\\TOKEN IMAGES';

// Define the range to scan (from ID 1 to 25000)
const START_ID = 1;
const END_ID = 25000;
const BATCH_SIZE = 100; // Process in batches to avoid overloading

// Note: When using these images in production, ensure to properly attribute CoinMarketCap
// as the source of these images following their attribution requirements.
// CoinMarketCap's terms of service should be reviewed before using these images in a public application.
const BASE_URL = 'https://s2.coinmarketcap.com/static/img/coins/64x64';

// Known token mappings to use as fallback for naming
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
};

// Storage for downloaded token data
interface TokenData {
  id: number;
  symbol?: string;
  name?: string;
  imageUrl: string;
}

// Collected token data
const downloadedTokens: TokenData[] = [];

/**
 * Creates the token images directory if it doesn't exist
 */
const createTokenImagesDir = (): void => {
  if (!fs.existsSync(TOKEN_IMAGES_DIR)) {
    fs.mkdirSync(TOKEN_IMAGES_DIR, { recursive: true });
    console.log(`Created directory: ${TOKEN_IMAGES_DIR}`);
  }
};

/**
 * Attempts to download a token image by ID
 */
const downloadTokenImage = async (id: number): Promise<boolean> => {
  try {
    const url = `${BASE_URL}/${id}.png`;
    const response = await axios.get(url, { 
      responseType: 'arraybuffer',
      // Don't throw on 404s
      validateStatus: (status) => status < 500 
    });
    
    // If image doesn't exist, skip it
    if (response.status === 404 || !response.data || response.data.length === 0) {
      return false;
    }

    // Determine the file name (using ID for all files to ensure uniqueness)
    const fileName = `${id}.png`;
    const outputPath = path.join(TOKEN_IMAGES_DIR, fileName);
    
    // Save the image
    fs.writeFileSync(outputPath, response.data);
    
    // Store token data with known info or just ID
    const tokenInfo = KNOWN_TOKENS[id] || { symbol: undefined, name: undefined };
    
    downloadedTokens.push({
      id,
      symbol: tokenInfo.symbol,
      name: tokenInfo.name,
      imageUrl: `G:/TOKEN IMAGES/${fileName}`
    });
    
    const displayName = tokenInfo.symbol 
      ? `${tokenInfo.name || 'Unknown'} (${tokenInfo.symbol})` 
      : `ID ${id}`;
    
    console.log(`Downloaded ${displayName} image to ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Error downloading token ID ${id}:`, error);
    return false;
  }
};

/**
 * Creates an index file mapping token IDs to their details
 */
const createTokenIndex = (): void => {
  const indexPath = path.join(TOKEN_IMAGES_DIR, 'index.ts');
  
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
  console.log(`Created token index file at ${indexPath}`);
};

/**
 * Creates a simple JSON file mapping token details
 */
const createJsonIndex = (): void => {
  const jsonPath = path.join(TOKEN_IMAGES_DIR, 'tokens.json');
  
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
  console.log(`Created JSON index file at ${jsonPath}`);
};

/**
 * Creates an HTML file for preview of all downloaded tokens
 */
const createHtmlPreview = (): void => {
  const htmlPath = path.join(TOKEN_IMAGES_DIR, 'preview.html');
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Token Image Preview</title>
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
    ${downloadedTokens.map(token => `
    <div class="token-card" data-id="${token.id}" data-symbol="${token.symbol || ''}">
      <img class="token-icon" src="${token.id}.png" alt="Token ${token.id}">
      <div class="token-symbol">${token.symbol || `ID: ${token.id}`}</div>
      ${token.name ? `<div class="token-name">${token.name}</div>` : ''}
      <div class="token-id">ID: ${token.id}</div>
    </div>`).join('')}
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
  console.log(`Created HTML preview file at ${htmlPath}`);
};

/**
 * Process a batch of token IDs
 */
const processBatch = async (startId: number, endId: number): Promise<number> => {
  let successCount = 0;
  
  for (let id = startId; id <= endId; id++) {
    const success = await downloadTokenImage(id);
    if (success) {
      successCount++;
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
const downloadAllTokenImages = async (): Promise<void> => {
  try {
    console.log('Starting comprehensive token image download process...');
    console.log(`Target directory: ${TOKEN_IMAGES_DIR}`);
    console.log(`Scanning token IDs from ${START_ID} to ${END_ID}`);
    
    // Create the directory if it doesn't exist
    createTokenImagesDir();
    
    // Process in batches to avoid overloading
    let totalSuccessful = 0;
    
    for (let batchStart = START_ID; batchStart <= END_ID; batchStart += BATCH_SIZE) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, END_ID);
      console.log(`Processing batch: ${batchStart} to ${batchEnd}`);
      
      const batchSuccessful = await processBatch(batchStart, batchEnd);
      totalSuccessful += batchSuccessful;
      
      console.log(`Batch completed. Found ${batchSuccessful} valid tokens in this batch.`);
      console.log(`Total successful downloads so far: ${totalSuccessful}`);
      
      // Create intermediate index files every 10 batches
      if (batchStart % (BATCH_SIZE * 10) === 0 && batchStart > START_ID) {
        createJsonIndex();
      }
      
      // Add a small delay between batches
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Create the index files
    createTokenIndex();
    createJsonIndex();
    
    // Create HTML preview
    createHtmlPreview();
    
    console.log('Token image download process completed successfully!');
    console.log(`Total tokens downloaded: ${downloadedTokens.length}`);
    console.log(`Images saved to: ${TOKEN_IMAGES_DIR}`);
    console.log(`Preview available at: ${path.join(TOKEN_IMAGES_DIR, 'preview.html')}`);
  } catch (error) {
    console.error('Error in token image download process:', error);
  }
};

// Run the download process as soon as this module is loaded
downloadAllTokenImages();

// Export functions for use in other files
export {
  downloadAllTokenImages,
}; 