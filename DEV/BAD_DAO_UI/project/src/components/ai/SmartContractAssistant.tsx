import { useState, useEffect } from 'react';
import { Plus, Settings, Check, Brain } from 'lucide-react';
import ChatInterface from './ChatInterface';
import ChatHistory from './ChatHistory';
import ContractExplorer from './ContractExplorer';
import aiService, { 
  ChatSession, 
  AiModelConfig, 
  initAiService, 
  getChatSessions, 
  createChatSession, 
  deleteChatSession, 
  sendMessageToAI, 
  scanAvailableModels,
  getModelsFromProvider,
  autoSelectModel
} from '../../services/aiService';

interface SmartContractAssistantProps {
  initialContractAddress?: string;
  adminMode?: boolean;
}

const SmartContractAssistant = ({ 
  initialContractAddress, 
  adminMode = false 
}: SmartContractAssistantProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
  const [contractAddress, setContractAddress] = useState<string | undefined>(initialContractAddress);
  const [availableModels, setAvailableModels] = useState<AiModelConfig[]>([]);
  const [selectedModel, setSelectedModel] = useState<AiModelConfig | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    OPENAI_API_KEY: '',
    MISTRAL_API_KEY: '',
    GOOGLE_API_KEY: '',
    OPENROUTER_API_KEY: '',
    ANTHROPIC_API_KEY: '',
    THIRDWEB_SECRET_KEY: '',
    THIRDWEB_CLIENT_ID: ''
  });
  const [isProcessingMessage, setIsProcessingMessage] = useState(false);
  const [providerModels, setProviderModels] = useState<Record<string, string[]>>({});

  // Initialize on first load
  useEffect(() => {
    // Log environment variables to verify they're loaded
    console.log("🔑 Environment variables check:", {
      hasThirdWebSecretKey: !!process.env.THIRDWEB_SECRET_KEY,
      secretKeyLength: process.env.THIRDWEB_SECRET_KEY?.length || 0,
      hasThirdWebClientId: !!process.env.THIRDWEB_CLIENT_ID,
      clientIdLength: process.env.THIRDWEB_CLIENT_ID?.length || 0
    });
    
    // Initialize apiKeys from environment
    setApiKeys({
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
      MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || '',
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
      THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY || '',
      THIRDWEB_CLIENT_ID: process.env.THIRDWEB_CLIENT_ID || ''
    });
    
    // Initialize AI service with these keys
    initAiService({
      THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY || '',
      THIRDWEB_CLIENT_ID: process.env.THIRDWEB_CLIENT_ID || ''
    });
    
    // Load existing sessions
    const loadedSessions = getChatSessions();
    setSessions(loadedSessions);
    
    // Create a new session if none exist or set the active session to the most recent
    if (loadedSessions.length === 0) {
      const newSession = createChatSession(initialContractAddress);
      setSessions([newSession]);
      setActiveChatId(newSession.id);
      setActiveChat(newSession);
    } else {
      // Sort sessions by lastUpdated (most recent first)
      const sortedSessions = [...loadedSessions].sort((a, b) => 
        b.lastUpdated.getTime() - a.lastUpdated.getTime()
      );
      
      setActiveChatId(sortedSessions[0].id);
      setActiveChat(sortedSessions[0]);
    }
    
    // Scan for available models
    scanAndSetAvailableModels();
    
  }, [initialContractAddress]);

  // Update active chat when active chat ID changes
  useEffect(() => {
    if (activeChatId) {
      const chat = sessions.find(s => s.id === activeChatId) || null;
      setActiveChat(chat);
      
      if (chat?.contractAddress) {
        setContractAddress(chat.contractAddress);
      }
    }
  }, [activeChatId, sessions]);

  // Handle creating a new chat
  const handleNewChat = () => {
    const newSession = createChatSession(contractAddress);
    setSessions(prev => [newSession, ...prev]);
    setActiveChatId(newSession.id);
  };

  // Handle selecting a chat
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  // Handle deleting a chat
  const handleDeleteChat = (chatId: string) => {
    if (deleteChatSession(chatId)) {
      setSessions(prev => prev.filter(s => s.id !== chatId));
      
      // If active chat is deleted, set active chat to the first available
      if (activeChatId === chatId) {
        const remainingSessions = sessions.filter(s => s.id !== chatId);
        if (remainingSessions.length > 0) {
          setActiveChatId(remainingSessions[0].id);
        } else {
          // Create a new session if all are deleted
          const newSession = createChatSession();
          setSessions([newSession]);
          setActiveChatId(newSession.id);
        }
      }
    }
  };

  // Handle contract address change
  const handleContractAddressChange = (address: string) => {
    setContractAddress(address);
    
    // Update active chat if it exists
    if (activeChat) {
      // Create new chat with new contract
      const newSession = createChatSession(address);
      setSessions(prev => [newSession, ...prev]);
      setActiveChatId(newSession.id);
    }
  };

  // Handle sending message
  const handleSendMessage = async (message: string): Promise<string> => {
    if (!activeChatId) {
      throw new Error('No active chat session');
    }
    
    setIsProcessingMessage(true);
    
    try {
      // Auto-select best model based on message content
      const model = selectedModel || autoSelectModel(message);
      
      // Send message to AI
      const response = await sendMessageToAI(activeChatId, message, model);
      
      // Refresh sessions list
      setSessions(getChatSessions());
      
      setIsProcessingMessage(false);
      return response.text;
    } catch (error) {
      console.error('Error sending message:', error);
      setIsProcessingMessage(false);
      return 'Sorry, there was an error processing your request. Please try again.';
    }
  };

  // Handle API key update
  const handleApiKeyUpdate = async () => {
    initAiService(apiKeys);
    
    // Test Nebula API connection if credentials are provided
    if (apiKeys.THIRDWEB_SECRET_KEY) {
      const testResult = await aiService.testNebulaApiConnection();
      
      if (!testResult.success) {
        alert(`ThirdWeb Nebula API connection error: ${testResult.message}`);
        console.error("Nebula API connection test failed:", testResult.message);
      } else {
        console.log("Nebula API connection test successful!");
      }
    }
    
    // Scan for available models after updating API keys
    scanAndSetAvailableModels();
    
    setShowSettings(false);
  };

  // Scan for available models from all providers
  const scanAndSetAvailableModels = async () => {
    const models = scanAvailableModels();
    
    // Sort models to ensure Nebula comes first
    models.sort((a, b) => {
      if (a.provider === 'nebula') return -1;
      if (b.provider === 'nebula') return 1;
      return 0;
    });
    
    setAvailableModels(models);
    
    // Set default model if available - prioritize Nebula
    if (models.length > 0) {
      const nebulaModel = models.find(m => m.provider === 'nebula');
      setSelectedModel(nebulaModel || models[0]);
    }
    
    // Fetch actual models from each provider with valid API key
    const providerModelMap: Record<string, string[]> = {};
    
    // Process each provider with a valid API key in parallel
    await Promise.all(models.map(async (model) => {
      try {
        const availableModels = await getModelsFromProvider(model.provider, model.apiKey);
        if (availableModels.length > 0) {
          providerModelMap[model.provider] = availableModels;
        }
      } catch (err) {
        console.error(`Error fetching models for ${model.provider}:`, err);
        // Fallback for providers that fail to return models
        switch (model.provider) {
          case 'nebula':
            providerModelMap[model.provider] = ['nebula'];
            break;
          case 'openai':
            providerModelMap[model.provider] = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'];
            break;
          case 'mistral':
            providerModelMap[model.provider] = ['mistral-tiny', 'mistral-small', 'mistral-medium', 'mistral-large-latest'];
            break;
          case 'google':
            providerModelMap[model.provider] = ['gemini-pro', 'gemini-pro-vision'];
            break;
          case 'anthropic':
            providerModelMap[model.provider] = ['claude-instant', 'claude-3-haiku', 'claude-3-sonnet', 'claude-3-opus'];
            break;
          case 'openrouter':
            providerModelMap[model.provider] = ['anthropic/claude-3-opus', 'openai/gpt-4-turbo', 'mistral/mistral-large'];
            break;
        }
      }
    }));
    
    setProviderModels(providerModelMap);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with controls */}
      <div className="p-md border-b border-neutral-light flex items-center justify-between">
        <h2 className="text-h2">Smart Contract Assistant</h2>
        
        <div className="flex items-center space-x-sm">
          <button 
            className="btn-secondary p-2"
            onClick={handleNewChat}
          >
            <Plus size={20} />
          </button>
          
          {adminMode && (
            <button 
              className="btn-secondary p-2"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={20} />
            </button>
          )}
          
          {availableModels.length > 0 && (
            <div className="relative">
              <button 
                className="btn-secondary p-2"
                onClick={() => setShowModelSelector(!showModelSelector)}
              >
                <Brain size={20} />
              </button>
              
              {showModelSelector && (
                <div className="absolute right-0 mt-2 w-64 bg-neutral-dark border border-neutral-light/20 rounded-lg shadow-lg z-50">
                  <div className="p-md">
                    <h4 className="text-body-sm font-medium mb-md">Select AI Model</h4>
                    
                    {Object.entries(providerModels).map(([provider, models]) => (
                      <div key={provider} className="mb-md">
                        <h5 className="text-caption font-medium mb-xs text-neutral-medium uppercase">
                          {provider.charAt(0).toUpperCase() + provider.slice(1)}
                        </h5>
                        <div className="space-y-xs">
                          {models.map(model => (
                            <div 
                              key={model}
                              className={`p-xs rounded-md cursor-pointer flex items-center ${
                                selectedModel?.provider === provider && selectedModel?.model === model
                                  ? 'bg-primary/20 text-primary'
                                  : 'hover:bg-neutral-light/10'
                              }`}
                              onClick={() => {
                                const modelConfig = availableModels.find(m => m.provider === provider);
                                if (modelConfig) {
                                  setSelectedModel({
                                    ...modelConfig,
                                    model: model
                                  });
                                  setShowModelSelector(false);
                                }
                              }}
                            >
                              {selectedModel?.provider === provider && selectedModel?.model === model && (
                                <Check size={14} className="mr-2 text-primary" />
                              )}
                              <span className={selectedModel?.provider === provider && selectedModel?.model === model ? 'ml-0' : 'ml-6'}>
                                {model}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {selectedModel && (
            <div className="text-body-sm bg-neutral-dark/70 border border-neutral-light/20 rounded-md px-2 py-1">
              {selectedModel.provider.charAt(0).toUpperCase() + selectedModel.provider.slice(1)} - {selectedModel.model}
            </div>
          )}
          
          {contractAddress ? (
            <div className="text-body-sm">
              Connected to: <span className="font-medium">{contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}</span>
            </div>
          ) : (
            <input
              type="text"
              className="input bg-neutral-dark/50 border-neutral-light/30 text-white"
              placeholder="Enter contract address"
              onChange={(e) => handleContractAddressChange(e.target.value)}
            />
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar with Chat History and Contract Explorer */}
        <div className="w-96 h-full flex flex-col overflow-hidden border-r border-neutral-light/20">
          {/* Chat History section - takes up top half */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <ChatHistory 
              sessions={sessions}
              activeChatId={activeChatId}
              onSelectChat={handleSelectChat}
              onDeleteChat={handleDeleteChat}
            />
          </div>
          
          {/* Contract Explorer section - takes up bottom half */}
          <div className="flex-1 overflow-hidden">
            <ContractExplorer onSelectContract={handleContractAddressChange} />
          </div>
        </div>
        
        {/* Chat interface - takes remaining width */}
        <div className="flex-1 p-md">
          {activeChat && (
            <ChatInterface 
              contractAddress={activeChat.contractAddress}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>
      
      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-dark text-white rounded-lg w-full max-w-md p-lg border border-neutral-light/20">
            <h3 className="text-h3 mb-md">AI Model Settings</h3>
            
            <div className="space-y-md">
              <div className="border p-md rounded-md border-primary-light/30 bg-neutral-light/5">
                <h4 className="text-body-lg font-semibold mb-sm">ThirdWeb Nebula Settings</h4>
                
                <div className="mb-sm">
                  <label className="block text-body-sm font-medium mb-xs">
                    ThirdWeb Secret Key (Nebula)
                  </label>
                  <input 
                    type="text" 
                    className="input w-full bg-neutral-dark/50 border-neutral-light/30 text-white"
                    value={apiKeys.THIRDWEB_SECRET_KEY}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, THIRDWEB_SECRET_KEY: e.target.value }))}
                    placeholder="thirdwebsk_... or just the key"
                  />
                  <p className="text-xs text-neutral-light mt-1">
                    Required for smart contract interactions. Powers Nebula AI.
                    The key will be automatically formatted if needed.
                  </p>
                </div>
                
                <div className="mb-sm">
                  <label className="block text-body-sm font-medium mb-xs">
                    ThirdWeb Client ID
                  </label>
                  <input 
                    type="text" 
                    className="input w-full bg-neutral-dark/50 border-neutral-light/30 text-white"
                    value={apiKeys.THIRDWEB_CLIENT_ID}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, THIRDWEB_CLIENT_ID: e.target.value }))}
                    placeholder="3eb..."
                  />
                  <p className="text-xs text-neutral-light mt-1">
                    Required for ThirdWeb authentication. Both Secret Key and Client ID are needed.
                  </p>
                </div>
                
                <button
                  className="btn-secondary-sm w-full mt-sm"
                  onClick={async () => {
                    // Test the ThirdWeb connection
                    if (!apiKeys.THIRDWEB_SECRET_KEY || !apiKeys.THIRDWEB_CLIENT_ID) {
                      alert("Both Secret Key and Client ID are required for testing");
                      return;
                    }
                    
                    // Update service with current values
                    initAiService(apiKeys);
                    
                    // Test connection
                    const testResult = await aiService.testNebulaApiConnection();
                    
                    if (testResult.success) {
                      alert("Connection successful! ThirdWeb Nebula API is working properly.");
                    } else {
                      alert(`Connection failed: ${testResult.message}`);
                    }
                  }}
                >
                  Test ThirdWeb Connection
                </button>

                <button
                  className="btn-primary-sm w-full mt-sm"
                  onClick={async () => {
                    // Send a simple test message directly to Nebula
                    initAiService(apiKeys);
                    
                    // Create a temporary chat session for testing
                    const testSession = createChatSession();
                    
                    try {
                      // Display info about which keys are being used
                      console.log("🔑 Diagnostic test using keys:", {
                        secretKey: apiKeys.THIRDWEB_SECRET_KEY.substring(0, 5) + "..." + 
                                  apiKeys.THIRDWEB_SECRET_KEY.substring(apiKeys.THIRDWEB_SECRET_KEY.length - 5),
                        clientId: apiKeys.THIRDWEB_CLIENT_ID
                      });
                      
                      // Set this model as active for the test
                      setSelectedModel({
                        provider: 'nebula',
                        model: 'nebula',
                        apiKey: apiKeys.THIRDWEB_SECRET_KEY,
                        clientId: apiKeys.THIRDWEB_CLIENT_ID,
                        endpoint: 'https://nebula-api.thirdweb.com/chat'
                      });
                      
                      const response = await sendMessageToAI(
                        testSession.id, 
                        "Hello, this is a diagnostic test for Nebula API. What can you tell me about smart contracts?",
                        {
                          provider: 'nebula',
                          model: 'nebula',
                          apiKey: apiKeys.THIRDWEB_SECRET_KEY,
                          clientId: apiKeys.THIRDWEB_CLIENT_ID,
                          endpoint: 'https://nebula-api.thirdweb.com/chat'
                        }
                      );
                      
                      console.log("📝 Diagnostic test response:", response);
                      alert(`Test complete. Response received: "${response.text.length > 100 ? response.text.substring(0, 100) + "..." : response.text}"`);
                    } catch (error) {
                      console.error("❌ Diagnostic test error:", error);
                      alert(`Test failed: ${error instanceof Error ? error.message : "Unknown error"}`);
                    } finally {
                      // Clean up the test session
                      deleteChatSession(testSession.id);
                    }
                  }}
                >
                  Run Diagnostic Test
                </button>
              </div>
              
              <div className="border p-md rounded-md border-neutral-light/30 bg-neutral-light/5">
                <h4 className="text-body-lg font-semibold mb-sm">Backup AI Providers</h4>
                
                <div>
                  <label className="block text-body-sm font-medium mb-xs">
                    OpenRouter API Key
                  </label>
                  <input 
                    type="text" 
                    className="input w-full bg-neutral-dark/50 border-neutral-light/30 text-white"
                    value={apiKeys.OPENROUTER_API_KEY}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, OPENROUTER_API_KEY: e.target.value }))}
                    placeholder="sk-or-..."
                  />
                  <p className="text-xs text-neutral-light mt-1">
                    Fallback option for general AI assistance. Uses Claude via OpenRouter.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-sm mt-lg">
              <button
                className="btn-secondary"
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleApiKeyUpdate}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartContractAssistant; 