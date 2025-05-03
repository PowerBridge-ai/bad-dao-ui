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
}

const LOCAL_STORAGE_KEY = 'ai_chat_sessions';

// Default model configurations
const defaultModels: Record<string, AiModelConfig> = {
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
    apiKey: process.env.MISTRAL_API_KEY || '',
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
    apiKey: process.env.OPENROUTER_API_KEY || '',
    temperature: 0.7,
    maxTokens: 4096
  },
  anthropic: {
    provider: 'anthropic',
    model: 'claude-3-opus-20240229',
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    temperature: 0.7,
    maxTokens: 4096
  },
  nebula: {
    provider: 'nebula',
    model: 'nebula',
    apiKey: process.env.THIRDWEB_SECRET_KEY || '',
    endpoint: 'https://nebula-api.thirdweb.com/chat'
  }
};

// Initialize the service with provided API keys or use environment variables
export const initAiService = (apiKeys?: Record<string, string>): void => {
  if (apiKeys) {
    if (apiKeys.OPENAI_API_KEY) defaultModels.openai.apiKey = apiKeys.OPENAI_API_KEY;
    if (apiKeys.MISTRAL_API_KEY) defaultModels.mistral.apiKey = apiKeys.MISTRAL_API_KEY;
    if (apiKeys.GOOGLE_API_KEY) defaultModels.google.apiKey = apiKeys.GOOGLE_API_KEY;
    if (apiKeys.OPENROUTER_API_KEY) defaultModels.openrouter.apiKey = apiKeys.OPENROUTER_API_KEY;
    if (apiKeys.ANTHROPIC_API_KEY) defaultModels.anthropic.apiKey = apiKeys.ANTHROPIC_API_KEY;
    if (apiKeys.THIRDWEB_SECRET_KEY) defaultModels.nebula.apiKey = apiKeys.THIRDWEB_SECRET_KEY;
  }
  
  // Initialize chat sessions from localStorage if available
  if (typeof localStorage !== 'undefined' && !localStorage.getItem(LOCAL_STORAGE_KEY)) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
  }
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

// Send a message to the AI
export const sendMessageToAI = async (
  sessionId: string,
  message: string,
  modelConfig: AiModelConfig = defaultModels.openai
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
    throw new Error('Thirdweb API key is required for Nebula');
  }
  
  try {
    const requestBody: any = {
      message,
      execute_config: {
        mode: "client"
      }
    };
    
    // If contract address is provided, add it to the request
    if (contractAddress) {
      requestBody.context = {
        contract_address: contractAddress
      };
    }
    
    const response = await fetch(defaultModels.nebula.endpoint || 'https://nebula-api.thirdweb.com/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret-key': defaultModels.nebula.apiKey
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`Nebula API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Process any actions returned by Nebula
    if (data.actions && data.actions.length > 0) {
      // Just return information about the action for now
      // In a real implementation, we would handle the transaction with user approval
      return `${data.response}\n\n**Action Required**\n\nNebula suggests the following blockchain action:\n\`\`\`json\n${JSON.stringify(data.actions[0], null, 2)}\n\`\`\`\n\nTo execute this action, please approve it in the interface.`;
    }
    
    return data.response || data.message || 'No response from Nebula API';
  } catch (error) {
    console.error('Error calling Nebula API:', error);
    throw error;
  }
};

// Handle Nebula transaction execution with user approval
export const executeNebulaTransaction = async (
  actionData: string,
  walletAddress: string
): Promise<string> => {
  try {
    const txData = JSON.parse(actionData);
    
    // Create Thirdweb client
    const client = createThirdwebClient({
      secretKey: defaultModels.nebula.apiKey
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
  
  // Check for blockchain/smart contract specific keywords
  const blockchainKeywords = [
    'contract', 'blockchain', 'ethereum', 'token', 'wallet', 'transaction',
    'solidity', 'web3', 'gas', 'nft', 'defi', 'dao', 'smart contract'
  ];
  
  const hasBlockchainContext = blockchainKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
  
  // Prioritize Nebula for blockchain queries
  if (hasBlockchainContext && availableModels.find(m => m.provider === 'nebula')) {
    return availableModels.find(m => m.provider === 'nebula')!;
  }
  
  // Prioritize more capable models for complex queries
  if (message.length > 200) {
    // Try to use the most capable models first
    const preferredProviders = ['anthropic', 'openai', 'openrouter', 'mistral', 'google'];
    
    for (const provider of preferredProviders) {
      const model = availableModels.find(m => m.provider === provider);
      if (model) return model;
    }
  }
  
  // Default to first available model
  return availableModels[0];
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
  autoSelectModel
}; 