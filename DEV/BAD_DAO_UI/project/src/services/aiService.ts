import { 
  createThirdwebClient
} from 'thirdweb';
import { 
  prepareTransaction, 
  sendTransaction 
} from 'thirdweb/transaction';
import { 
  generateAccount 
} from 'thirdweb/wallets';

// Types
export interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  metadata?: {
    contracts?: string[];
    codeSnippets?: CodeSnippet[];
    transactionIds?: string[];
    tokenAddresses?: string[];
  };
}

export interface CodeSnippet {
  id: string;
  language: string;
  code: string;
  title?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  lastUpdated: Date;
  contractAddress?: string;
  messages: Message[];
}

export interface AiModelConfig {
  provider: 'openai' | 'mistral' | 'google' | 'openrouter' | 'anthropic' | 'nebula';
  model: string;
  apiKey: string;
  endpoint?: string;
  temperature?: number;
  maxTokens?: number;
  clientId?: string;
}

const LOCAL_STORAGE_KEY = 'ai_chat_sessions';

// Default model configurations
const defaultModels: Record<string, AiModelConfig> = {
  nebula: {
    provider: 'nebula',
    model: 'nebula',
    apiKey: process.env.THIRDWEB_SECRET_KEY || '',
    endpoint: 'https://nebula-api.thirdweb.com/chat',
    clientId: process.env.THIRDWEB_CLIENT_ID || ''
  },
  openai: {
    provider: 'openai',
    model: 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY || '',
    temperature: 0.7,
    maxTokens: 2048
  },
  mistral: {
    provider: 'mistral',
    model: 'mistral-large-latest',
    apiKey: process.env.MISTRAL_API_KEY || 'YkPOw8pc2totUqczBksPrC3Z5s7Plw0y',
    temperature: 0.7,
    maxTokens: 2048
  },
  google: {
    provider: 'google',
    model: 'gemini-pro',
    apiKey: process.env.GOOGLE_API_KEY || '',
    temperature: 0.7,
    maxTokens: 2048
  },
  openrouter: {
    provider: 'openrouter',
    model: 'anthropic/claude-3-opus',
    apiKey: process.env.OPENROUTER_API_KEY || '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',
    temperature: 0.7,
    maxTokens: 4096
  },
  anthropic: {
    provider: 'anthropic',
    model: 'claude-3-opus-20240229',
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    temperature: 0.7,
    maxTokens: 4096
  }
};

// Initialize AI service
export const initAiService = (credentials?: {
  OPENAI_API_KEY?: string;
  MISTRAL_API_KEY?: string;
  GOOGLE_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  THIRDWEB_SECRET_KEY?: string;
  THIRDWEB_CLIENT_ID?: string;
}): typeof defaultModels => {
  // Set API keys from parameters or environment variables
  if (credentials) {
    if (credentials.OPENAI_API_KEY) defaultModels.openai.apiKey = credentials.OPENAI_API_KEY;
    if (credentials.MISTRAL_API_KEY) defaultModels.mistral.apiKey = credentials.MISTRAL_API_KEY;
    if (credentials.GOOGLE_API_KEY) defaultModels.google.apiKey = credentials.GOOGLE_API_KEY;
    if (credentials.OPENROUTER_API_KEY) defaultModels.openrouter.apiKey = credentials.OPENROUTER_API_KEY;
    if (credentials.ANTHROPIC_API_KEY) defaultModels.anthropic.apiKey = credentials.ANTHROPIC_API_KEY;
  }
  
  // Special handling for ThirdWeb credentials with fallbacks
  defaultModels.nebula.apiKey = credentials?.THIRDWEB_SECRET_KEY || 
    process.env.THIRDWEB_SECRET_KEY || 
    // Fallback hardcoded key
    'ZuG7FQ2uD7F5sJzckw02P_SNAiEHtWsUA46AYC124wHsZxqmgz84RPDsuFO_dfUF6Uj6K2e4XtzN_ODQGO41UA';
  
  defaultModels.nebula.clientId = credentials?.THIRDWEB_CLIENT_ID || 
    process.env.THIRDWEB_CLIENT_ID || 
    // Fallback hardcoded client ID
    '3eb01797a1d9f0b74a8f3e1dc5b624ab';
  
  // Initialize chat sessions from localStorage if available
  if (typeof localStorage !== 'undefined' && !localStorage.getItem(LOCAL_STORAGE_KEY)) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
  }
  
  debugLog.init('🔑', 'AI Service Initialized', {
    nebulaConfigured: !!defaultModels.nebula.apiKey,
    nebulaKeyLength: defaultModels.nebula.apiKey?.length || 0,
    clientIdConfigured: !!defaultModels.nebula.clientId,
    clientIdLength: defaultModels.nebula.clientId?.length || 0
  });
  
  return defaultModels;
};

// Get all chat sessions
export const getChatSessions = (): ChatSession[] => {
  if (typeof localStorage === 'undefined') return [];
  
  try {
    const sessions = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    return sessions.map((session: any) => ({
      ...session,
      lastUpdated: new Date(session.lastUpdated),
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return [];
  }
};

// Get a chat session by ID
export const getChatSessionById = (sessionId: string): ChatSession | null => {
  const sessions = getChatSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session) return null;
  
  return session;
};

// Create a new chat session
export const createChatSession = (contractAddress?: string): ChatSession => {
  const sessions = getChatSessions();
  
  const newSession: ChatSession = {
    id: Date.now().toString(),
    title: contractAddress 
      ? `Chat with ${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}`
      : `New Chat ${sessions.length + 1}`,
    lastUpdated: new Date(),
    contractAddress,
    messages: []
  };
  
  // Add welcome message if contract address is provided
  if (contractAddress) {
    newSession.messages.push({
      id: 'welcome',
      sender: 'ai',
      text: `I'm your AI assistant for smart contract ${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}. How can I help you today?`,
      timestamp: new Date()
    });
  } else {
    newSession.messages.push({
      id: 'welcome',
      sender: 'ai',
      text: "Welcome to the Smart Contract AI Assistant. Please select a contract or enter an address to get started.",
      timestamp: new Date()
    });
  }
  
  // Save to localStorage
  sessions.push(newSession);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
  
  return newSession;
};

// Update an existing chat session
export const updateChatSession = (sessionId: string, updates: Partial<ChatSession>): ChatSession | null => {
  const sessions = getChatSessions();
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  
  if (sessionIndex === -1) return null;
  
  // Update session
  const updatedSession = {
    ...sessions[sessionIndex],
    ...updates,
    lastUpdated: new Date()
  };
  
  sessions[sessionIndex] = updatedSession;
  
  // Save to localStorage
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
  
  return updatedSession;
};

// Delete a chat session
export const deleteChatSession = (sessionId: string): boolean => {
  const sessions = getChatSessions();
  const filteredSessions = sessions.filter(s => s.id !== sessionId);
  
  if (filteredSessions.length === sessions.length) return false;
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredSessions));
  return true;
};

// Add a message to a chat session
export const addMessageToChatSession = (
  sessionId: string, 
  message: Omit<Message, 'id' | 'timestamp'>
): ChatSession | null => {
  const session = getChatSessionById(sessionId);
  if (!session) return null;
  
  const newMessage: Message = {
    id: Date.now().toString(),
    timestamp: new Date(),
    ...message
  };
  
  const updatedMessages = [...session.messages, newMessage];
  
  return updateChatSession(sessionId, {
    messages: updatedMessages
  });
};

// Extract metadata from AI response
const extractMetadata = (response: string) => {
  const metadata: Message['metadata'] = {
    contracts: [],
    codeSnippets: [],
    transactionIds: [],
    tokenAddresses: []
  };
  
  // Extract contract addresses (0x format)
  const contractRegex = /0x[a-fA-F0-9]{40}/g;
  const contractMatches = response.match(contractRegex);
  if (contractMatches) {
    metadata.contracts = [...new Set(contractMatches)];
  }
  
  // Extract transaction IDs (0x format with longer length)
  const txRegex = /0x[a-fA-F0-9]{64}/g;
  const txMatches = response.match(txRegex);
  if (txMatches) {
    metadata.transactionIds = [...new Set(txMatches)];
  }
  
  // Extract token addresses (mentioned as token addresses specifically)
  const tokenRegex = /token address[:\s]+(0x[a-fA-F0-9]{40})/gi;
  const tokenMatches = [...response.matchAll(tokenRegex)];
  if (tokenMatches.length > 0) {
    metadata.tokenAddresses = [...new Set(tokenMatches.map(match => match[1]))];
  }
  
  // Extract code snippets
  const codeRegex = /```([\w-]*)\n([\s\S]*?)```/g;
  const codeMatches = [...response.matchAll(codeRegex)];
  if (codeMatches.length > 0) {
    metadata.codeSnippets = codeMatches.map((match, index) => ({
      id: `code-${index}-${Date.now()}`,
      language: match[1] || 'text',
      code: match[2].trim()
    }));
  }
  
  return metadata;
};

// Debug logging utilities
const debugLog = {
  api: (emoji: string, message: string, data?: any) => {
    console.log(`📡 [NEBULA_API] ${emoji} ${message}`, data || '');
  },
  auth: (emoji: string, message: string, data?: any) => {
    console.log(`🔐 [NEBULA_AUTH] ${emoji} ${message}`, data || '');
  },
  error: (emoji: string, message: string, data?: any) => {
    console.error(`❌ [NEBULA_ERROR] ${emoji} ${message}`, data || '');
  },
  debug: (emoji: string, message: string, data?: any) => {
    console.log(`🔍 [NEBULA_DEBUG] ${emoji} ${message}`, data || '');
  },
  success: (emoji: string, message: string, data?: any) => {
    console.log(`✅ [NEBULA_SUCCESS] ${emoji} ${message}`, data || '');
  },
  init: (emoji: string, message: string, data?: any) => {
    console.log(`🚀 [NEBULA_INIT] ${emoji} ${message}`, data || '');
  }
};

// Helper function to ensure ThirdWeb secret key is correctly formatted
const formatThirdWebSecretKey = (key: string): string => {
  if (!key) {
    debugLog.error('🚫', 'Empty ThirdWeb secret key provided');
    return '';
  }
  
  // Clean the key - remove any whitespace that might have been accidentally included
  const cleanKey = key.trim();
  
  // Log key details for debugging
  debugLog.debug('🔑', `Processing ThirdWeb key (${cleanKey.length} chars)`, {
    firstChars: cleanKey.substring(0, 5) + '...',
    lastChars: '...' + cleanKey.substring(cleanKey.length - 5),
    hasPrefix: cleanKey.startsWith('thirdwebsk_') || cleanKey.startsWith('thirdwebpk_')
  });
  
  // Return the key as-is, without trying to add any prefix
  // ThirdWeb's backend will handle the proper format requirements
  return cleanKey;
};

// Send a message to the AI
export const sendMessageToAI = async (
  sessionId: string,
  message: string,
  modelConfig: AiModelConfig = defaultModels.openrouter
): Promise<Message> => {
  const session = getChatSessionById(sessionId);
  if (!session) {
    throw new Error(`Chat session ${sessionId} not found`);
  }
  
  // Add user message to session
  const userMessage: Message = {
    id: Date.now().toString(),
    sender: 'user',
    text: message,
    timestamp: new Date()
  };
  
  updateChatSession(sessionId, {
    messages: [...session.messages, userMessage]
  });
  
  try {
    let aiResponse: string;
    
    // Use thirdweb Nebula if selected
    if (modelConfig.provider === 'nebula') {
      aiResponse = await sendMessageToNebula(message, session.contractAddress);
    } else {
      // Use standard AI API
      aiResponse = await sendMessageToStandardAI(message, modelConfig, session);
    }
    
    // Extract metadata from response
    const metadata = extractMetadata(aiResponse);
    
    // Create AI message
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: aiResponse,
      timestamp: new Date(),
      metadata
    };
    
    // Update session with AI response
    updateChatSession(sessionId, {
      messages: [...session.messages, userMessage, aiMessage]
    });
    
    return aiMessage;
  } catch (error) {
    console.error('Error sending message to AI:', error);
    
    // Create error message
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: 'Sorry, there was an error processing your request. Please try again.',
      timestamp: new Date()
    };
    
    // Update session with error message
    updateChatSession(sessionId, {
      messages: [...session.messages, userMessage, errorMessage]
    });
    
    return errorMessage;
  }
};

// Send message to standard AI API
const sendMessageToStandardAI = async (
  message: string,
  modelConfig: AiModelConfig,
  session: ChatSession
): Promise<string> => {
  // Convert session messages to format expected by API
  const messages = session.messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text
  }));
  
  // Add system message for context
  if (session.contractAddress) {
    messages.unshift({
      role: 'system',
      content: `You are an AI assistant specialized in blockchain and smart contracts. You are currently analyzing smart contract at address ${session.contractAddress}. Provide helpful, accurate information about this contract and blockchain concepts in general.`
    });
  } else {
    messages.unshift({
      role: 'system',
      content: 'You are an AI assistant specialized in blockchain and smart contracts. Provide helpful, accurate information about blockchain concepts, smart contracts, and cryptocurrency.'
    });
  }
  
  // Add the current user message
  messages.push({
    role: 'user',
    content: message
  });
  
  // Different API handling based on provider
  let response;
  
  switch (modelConfig.provider) {
    case 'openai':
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${modelConfig.apiKey}`
        },
        body: JSON.stringify({
          model: modelConfig.model,
          messages,
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.maxTokens
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }
      
      const openaiData = await response.json();
      return openaiData.choices[0].message.content;
      
    case 'anthropic':
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': modelConfig.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: modelConfig.model,
          messages,
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.maxTokens
        })
      });
      
      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }
      
      const anthropicData = await response.json();
      return anthropicData.content[0].text;
      
    case 'mistral':
      response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${modelConfig.apiKey}`
        },
        body: JSON.stringify({
          model: modelConfig.model,
          messages,
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.maxTokens
        })
      });
      
      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.statusText}`);
      }
      
      const mistralData = await response.json();
      return mistralData.choices[0].message.content;
      
    case 'google':
      response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: messages.map(msg => ({
            role: msg.role === 'system' ? 'user' : msg.role,
            parts: [{ text: msg.content }]
          })),
          generationConfig: {
            temperature: modelConfig.temperature,
            maxOutputTokens: modelConfig.maxTokens
          },
          key: modelConfig.apiKey
        })
      });
      
      if (!response.ok) {
        throw new Error(`Google API error: ${response.statusText}`);
      }
      
      const googleData = await response.json();
      return googleData.candidates[0].content.parts[0].text;
      
    case 'openrouter':
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${modelConfig.apiKey}`
        },
        body: JSON.stringify({
          model: modelConfig.model,
          messages,
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.maxTokens
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }
      
      const openrouterData = await response.json();
      return openrouterData.choices[0].message.content;
      
    default:
      throw new Error(`Unsupported AI provider: ${modelConfig.provider}`);
  }
};

// Send message to ThirdWeb Nebula API
const sendMessageToNebula = async (
  message: string,
  contractAddress?: string
): Promise<string> => {
  if (!defaultModels.nebula.apiKey) {
    debugLog.error('🚫', 'Missing ThirdWeb Secret Key');
    return "Thirdweb Secret Key is required for Nebula. Please add it in the settings.";
  }
  
  try {
    // Make sure we have the correctly formatted secret key
    const formattedSecretKey = formatThirdWebSecretKey(defaultModels.nebula.apiKey);
    
    if (!formattedSecretKey) {
      debugLog.error('🚫', 'Invalid ThirdWeb Secret Key format');
      return "Invalid ThirdWeb Secret Key format. The key appears to be malformed.";
    }
    
    debugLog.api('🔄', 'Preparing Nebula API request', {
      hasKey: !!formattedSecretKey,
      keyLength: formattedSecretKey.length,
      keyStart: formattedSecretKey.substring(0, 10) + '...',
      hasClientId: !!defaultModels.nebula.clientId,
      clientIdLength: defaultModels.nebula.clientId?.length || 0,
      clientIdStart: defaultModels.nebula.clientId?.substring(0, 10) + '...',
      message: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
      contractAddress: contractAddress || 'None'
    });
    
    // Define the request body type
    interface NebulaRequestBody {
      message: string;
      stream: boolean;
      user_id: string;
      execute_config: {
        mode: string;
      };
      context?: {
        contract_address: string;
      };
    }
    
    // Prepare request body with smart contract context if available
    const requestBody: NebulaRequestBody = {
      message: contractAddress 
        ? `[Context: Analyzing smart contract at address ${contractAddress}] ${message}`
        : `[Context: General blockchain assistant] ${message}`,
      stream: false,
      user_id: "default-user", // Track conversation history with user ID
      execute_config: {
        mode: "client" // Client mode allows user to approve transactions
      }
    };
    
    // If contract address is provided, add it to the request context
    if (contractAddress) {
      requestBody.context = {
        contract_address: contractAddress
      };
      debugLog.api('🏠', `Added contract context: ${contractAddress}`);
    }
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-secret-key': formattedSecretKey
    };
    
    // Add client ID if available
    if (defaultModels.nebula.clientId) {
      headers['x-client-id'] = defaultModels.nebula.clientId;
      debugLog.auth('🆔', `Added client ID to request: ${defaultModels.nebula.clientId.substring(0, 8)}...`);
    } else {
      debugLog.auth('⚠️', 'No client ID provided. This is likely required for ThirdWeb authentication.');
      return "ThirdWeb Client ID is required for Nebula. Please add it in the settings.";
    }
    
    // Validate the API endpoint
    const endpoint = defaultModels.nebula.endpoint || 'https://nebula-api.thirdweb.com/chat';
    debugLog.api('🌐', `Using Nebula API endpoint: ${endpoint}`);
    
    // Log the request headers (sanitized)
    const sanitizedHeaders = { ...headers };
    if (sanitizedHeaders['x-secret-key']) {
      sanitizedHeaders['x-secret-key'] = sanitizedHeaders['x-secret-key'].substring(0, 12) + '...';
    }
    if (sanitizedHeaders['x-client-id']) {
      sanitizedHeaders['x-client-id'] = sanitizedHeaders['x-client-id'].substring(0, 8) + '...';
    }
    
    // Log the final request
    debugLog.api('📤', 'Sending request to Nebula API', {
      endpoint,
      headers: sanitizedHeaders,
      body: {
        message: requestBody.message.substring(0, 30) + (requestBody.message.length > 30 ? '...' : ''),
        has_context: !!requestBody.context,
        user_id: requestBody.user_id,
        mode: requestBody.execute_config.mode
      }
    });
    
    try {
      // Enhanced logging before making request
      console.log("🌐 Making Nebula API request with:", {
        endpoint,
        secretKeyLength: formattedSecretKey.length,
        clientIdLength: defaultModels.nebula.clientId?.length || 0
      });
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });
      
      // Enhanced response handling
      debugLog.api('📥', `Received response with status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorInfo = "No details available";
        
        try {
          const errorJson = JSON.parse(errorText);
          errorInfo = JSON.stringify(errorJson, null, 2);
          debugLog.error('🚫', `Nebula API error response (${response.status})`, errorJson);
        } catch (e) {
          errorInfo = errorText;
          debugLog.error('🚫', `Nebula API error response (${response.status})`, errorText);
        }
        
        // Special handling for 401 errors
        if (response.status === 401) {
          debugLog.error('🔒', 'Authentication failed - Troubleshooting tips:');
          debugLog.error('🔑', '1. Generate new API credentials from ThirdWeb dashboard');
          debugLog.error('🆔', '2. Make sure you have both Client ID and Secret Key configured');
          debugLog.error('🔄', '3. Check if the API keys have the correct permissions');
          debugLog.error('🔐', '4. Verify your account has access to the Nebula API');
          
          return "Authentication failed. Please generate new credentials from the ThirdWeb dashboard with permissions for the Nebula API. Make sure to include both the Client ID and Secret Key in your settings.";
        }
        
        throw new Error(`Nebula API error: ${response.status} - ${errorInfo}`);
      }
      
      const data = await response.json();
      debugLog.success('✅', 'Successfully received response from Nebula API');
      
      // Add detailed logging of the response data
      console.log('📦 Full Nebula API response:', JSON.stringify(data, null, 2));
      
      if (!data || typeof data !== 'object') {
        debugLog.error('❌', 'Invalid response data format:', data);
        return 'Invalid response format received from Nebula API. Expected JSON object.';
      }
      
      // Handle new response format - API now uses 'message' field instead of 'response'
      const responseContent = data.response || data.message;
      
      if (!responseContent) {
        debugLog.error('❌', 'No response or message field in data:', data);
        return 'Nebula API response is missing both "response" and "message" fields. This may indicate a configuration issue or API change.';
      }
      
      // Process any blockchain actions returned by Nebula
      if (data.actions && data.actions.length > 0) {
        debugLog.api('🔄', `Nebula returned ${data.actions.length} blockchain actions`);
        
        // Format action details for user approval
        const actionDetails = data.actions.map((action: any, index: number) => {
          // Extract key details about the action
          const type = action.type || 'Transaction';
          const to = action.to || 'Unknown contract';
          const value = action.value ? `${action.value} ETH` : '0 ETH';
          
          debugLog.debug('🔍', `Action ${index + 1} details`, {
            type,
            to,
            value,
            data: action.data ? `${action.data.substring(0, 30)}...` : 'No data'
          });
          
          return `**Action ${index + 1}:** ${type}\n- To: \`${to}\`\n- Value: ${value}`;
        }).join('\n\n');
        
        return `${responseContent}\n\n---\n\n### 🔷 Blockchain Action Available\n\nNebula suggests the following action:\n\n${actionDetails}\n\nTo execute this action, please approve it using the interface.`;
      }
      
      return responseContent || 'No response content from Nebula API';
    } catch (error) {
      debugLog.error('💥', 'Error during Nebula API request', error);
      
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'Unknown error occurred when calling Nebula API';
    }
  } catch (error) {
    debugLog.error('💥', 'Error during Nebula API request', error);
    
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return 'Unknown error occurred when calling Nebula API';
  }
};

// Handle Nebula transaction execution with user approval
export const executeNebulaTransaction = async (
  actionData: string,
  walletAddress: string
): Promise<string> => {
  try {
    const txData = JSON.parse(actionData);
    
    // Format the secret key properly
    const formattedSecretKey = formatThirdWebSecretKey(defaultModels.nebula.apiKey);
    
    // Create Thirdweb client
    const client = createThirdwebClient({
      secretKey: formattedSecretKey,
      clientId: defaultModels.nebula.clientId
    });
    
    // Generate account (in a real app, this would be the user's connected wallet)
    const account = await generateAccount({ client });
    
    // Prepare transaction
    const transaction = prepareTransaction({
      to: txData.to,
      data: txData.data,
      value: BigInt(txData.value || '0'),
      chain: txData.chainId,
      client
    });
    
    // Send transaction
    const result = await sendTransaction({
      transaction,
      account
    });
    
    return `Transaction successful! Transaction hash: ${result.transactionHash}`;
  } catch (error: unknown) {
    console.error('Error executing transaction:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to execute transaction: ${error.message}`);
    }
    throw new Error('Failed to execute transaction: Unknown error');
  }
};

// Scan available models and return those with valid API keys
export const scanAvailableModels = (): AiModelConfig[] => {
  return Object.values(defaultModels).filter(model => !!model.apiKey);
};

// Get available models from a specific provider
export const getModelsFromProvider = async (provider: string, apiKey: string): Promise<string[]> => {
  try {
    switch (provider) {
      case 'openrouter':
        // OpenRouter API call to get models
        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!openRouterResponse.ok) {
          throw new Error(`OpenRouter API error: ${openRouterResponse.statusText}`);
        }
        
        const openRouterData = await openRouterResponse.json();
        return openRouterData.data.map((model: any) => model.id);
        
      case 'openai':
        // OpenAI API call to get models
        const openAIResponse = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!openAIResponse.ok) {
          throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
        }
        
        const openAIData = await openAIResponse.json();
        return openAIData.data
          .filter((model: any) => model.id.includes('gpt'))
          .map((model: any) => model.id);
        
      case 'anthropic':
        // For Anthropic, return hardcoded models as they don't have a models list endpoint
        return [
          'claude-instant-1',
          'claude-2',
          'claude-3-haiku-20240307',
          'claude-3-sonnet-20240229',
          'claude-3-opus-20240229'
        ];
        
      case 'mistral':
        // For Mistral, similar to Anthropic
        return [
          'mistral-tiny',
          'mistral-small',
          'mistral-medium',
          'mistral-large-latest'
        ];
        
      case 'google':
        // For Google Gemini
        return [
          'gemini-pro',
          'gemini-pro-vision'
        ];
        
      case 'nebula':
        // Nebula only has one model
        return ['nebula'];
        
      default:
        return [];
    }
  } catch (error) {
    console.error(`Error fetching models for ${provider}:`, error);
    return [];
  }
};

// Auto-select best model based on message content and available models
export const autoSelectModel = (message: string): AiModelConfig => {
  const availableModels = scanAvailableModels();
  
  if (availableModels.length === 0) {
    throw new Error('No AI models available. Please configure API keys.');
  }
  
  // Always prioritize Nebula if available
  const nebulaModel = availableModels.find(m => m.provider === 'nebula');
  if (nebulaModel && nebulaModel.apiKey) {
    return nebulaModel;
  }
  
  // Check for blockchain/smart contract specific keywords
  const blockchainKeywords = [
    'contract', 'blockchain', 'ethereum', 'token', 'wallet', 'transaction',
    'solidity', 'web3', 'gas', 'nft', 'defi', 'dao', 'smart contract'
  ];
  
  const hasBlockchainContext = blockchainKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
  
  // Fallback to OpenRouter if Nebula not available for blockchain queries
  if (hasBlockchainContext) {
    const openRouterModel = availableModels.find(m => m.provider === 'openrouter');
    if (openRouterModel) {
      return openRouterModel;
    }
  }
  
  // Fallback to other capable models
  if (message.length > 200) {
    // Try to use the most capable models first
    const preferredProviders = ['anthropic', 'openai', 'mistral', 'google'];
    
    for (const provider of preferredProviders) {
      const model = availableModels.find(m => m.provider === provider);
      if (model) return model;
    }
  }
  
  // Default to first available model
  return availableModels[0];
};

// Check API health and get available models
export const checkApiHealth = async (): Promise<Record<string, { available: boolean, models: string[] }>> => {
  const results: Record<string, { available: boolean, models: string[] }> = {};
  
  // Check Nebula first
  try {
    const nebulaModels = await getModelsFromProvider('nebula', defaultModels.nebula.apiKey);
    results.nebula = {
      available: nebulaModels.length > 0,
      models: nebulaModels
    };
  } catch (error) {
    console.error('Error checking Nebula API:', error);
    results.nebula = {
      available: false,
      models: []
    };
  }
  
  // Check OpenRouter
  try {
    const openRouterModels = await getModelsFromProvider('openrouter', defaultModels.openrouter.apiKey);
    results.openrouter = {
      available: openRouterModels.length > 0,
      models: openRouterModels
    };
  } catch (error) {
    console.error('Error checking OpenRouter API:', error);
    results.openrouter = {
      available: false,
      models: []
    };
  }
  
  // Check Mistral
  try {
    const mistralModels = await getModelsFromProvider('mistral', defaultModels.mistral.apiKey);
    results.mistral = {
      available: mistralModels.length > 0,
      models: mistralModels
    };
  } catch (error) {
    console.error('Error checking Mistral API:', error);
    results.mistral = {
      available: false,
      models: []
    };
  }
  
  // Check other providers if their API keys are available
  const otherProviders = ['openai', 'google', 'anthropic'];
  for (const provider of otherProviders) {
    if (defaultModels[provider].apiKey) {
      try {
        const models = await getModelsFromProvider(provider, defaultModels[provider].apiKey);
        results[provider] = {
          available: models.length > 0,
          models
        };
      } catch (error) {
        console.error(`Error checking ${provider} API:`, error);
        results[provider] = {
          available: false,
          models: []
        };
      }
    } else {
      results[provider] = {
        available: false,
        models: []
      };
    }
  }
  
  return results;
};

// Test Nebula API connection
export const testNebulaApiConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if keys are available
    if (!defaultModels.nebula.apiKey) {
      return { 
        success: false, 
        message: "Missing ThirdWeb Secret Key" 
      };
    }

    if (!defaultModels.nebula.clientId) {
      return {
        success: false,
        message: "Missing ThirdWeb Client ID - this is required for authentication"
      };
    }

    // Format the secret key
    const formattedSecretKey = formatThirdWebSecretKey(defaultModels.nebula.apiKey);
    
    if (!formattedSecretKey) {
      return {
        success: false,
        message: "Invalid ThirdWeb Secret Key format"
      };
    }
    
    console.log("🔑 Secret Key Info:", {
      length: formattedSecretKey.length,
      firstChars: formattedSecretKey.substring(0, 5) + '...',
      lastChars: '...' + formattedSecretKey.substring(formattedSecretKey.length - 5),
    });
    
    console.log("🆔 Client ID Info:", {
      length: defaultModels.nebula.clientId.length,
      value: defaultModels.nebula.clientId,
    });
    
    // Prepare headers with both required credentials
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-secret-key': formattedSecretKey,
      'x-client-id': defaultModels.nebula.clientId
    };
    
    // Simple test request
    const requestBody = {
      message: "test connection",
      stream: false,
      user_id: "connection-test",
      execute_config: {
        mode: "client"
      }
    };
    
    const endpoint = defaultModels.nebula.endpoint || 'https://nebula-api.thirdweb.com/chat';
    
    debugLog.auth('🔄', "Testing Nebula API connection", {
      endpoint,
      secretKeyLength: formattedSecretKey.length,
      clientIdLength: defaultModels.nebula.clientId.length
    });
    
    // Make the request
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      debugLog.error('🚫', `Nebula API test failed (${response.status})`, {
        status: response.status,
        statusText: response.statusText,
        responseHeaders: Object.fromEntries(response.headers.entries()),
        errorBody: errorText
      });
      
      if (response.status === 401) {
        // Provide detailed advice for 401 errors
        return {
          success: false,
          message: `Authentication failed (401): Please verify your ThirdWeb credentials. Try generating new credentials from the ThirdWeb dashboard with specific permissions for the Nebula API. Error details: ${errorText}`
        };
      }
      
      return {
        success: false,
        message: `API Error (${response.status}): ${errorText || response.statusText}`
      };
    }
    
    const data = await response.json();
    debugLog.success('✅', "Nebula API connection successful!");
    
    // Log full test response
    console.log('📦 Nebula test response:', JSON.stringify(data, null, 2));
    
    // Handle either response or message field
    const responseContent = data.response || data.message || '';
    
    return {
      success: true,
      message: "Connection successful! ThirdWeb Nebula API is working properly." +
        (responseContent ? ` Message: "${responseContent.substring(0, 50)}${responseContent.length > 50 ? '...' : ''}"` : " No response content found.")
    };
  } catch (error) {
    debugLog.error('💥', "Nebula API test error:", error);
    return {
      success: false,
      message: error instanceof Error 
        ? `Error connecting to ThirdWeb Nebula API: ${error.message}` 
        : "Unknown error testing connection to ThirdWeb Nebula API"
    };
  }
};

export default {
  initAiService,
  getChatSessions,
  getChatSessionById,
  createChatSession,
  updateChatSession,
  deleteChatSession,
  addMessageToChatSession,
  sendMessageToAI,
  executeNebulaTransaction,
  scanAvailableModels,
  getModelsFromProvider,
  autoSelectModel,
  checkApiHealth,
  testNebulaApiConnection
}; 