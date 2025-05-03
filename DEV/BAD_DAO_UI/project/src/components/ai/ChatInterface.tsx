import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  contractAddress?: string;
  onSendMessage: (message: string) => Promise<string>;
}

const ChatInterface = ({ contractAddress, onSendMessage }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: contractAddress 
        ? `I'm your AI assistant for smart contract ${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}. How can I help you today?` 
        : "Welcome to the Smart Contract AI Assistant. Please select a contract or enter an address to get started.",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Send message to AI and get response
      const response = await onSendMessage(inputValue);
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        text: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        text: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-240px)] md:h-[600px] card">
      {/* Chat Header */}
      <div className="p-md border-b border-neutral-light">
        <h3 className="text-h3">Smart Contract Assistant</h3>
        <p className="text-body-sm text-neutral-medium">
          {contractAddress 
            ? `Connected to ${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}`
            : 'No contract connected'}
        </p>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-md space-y-md">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-md ${
                message.sender === 'user' 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-light/50'
              }`}
            >
              <div className="flex items-center mb-sm">
                {message.sender === 'ai' ? (
                  <Bot size={16} className="mr-1" />
                ) : (
                  <User size={16} className="mr-1" />
                )}
                <span className="text-caption font-medium">
                  {message.sender === 'ai' ? 'AI Assistant' : 'You'}
                </span>
              </div>
              <p className="text-body whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-md bg-neutral-light/50">
              <div className="flex items-center">
                <Bot size={16} className="mr-1" />
                <span className="text-caption font-medium">AI Assistant</span>
              </div>
              <div className="flex mt-sm space-x-1">
                <div className="w-2 h-2 bg-neutral-medium rounded-full animate-pulse delay-0"></div>
                <div className="w-2 h-2 bg-neutral-medium rounded-full animate-pulse delay-300"></div>
                <div className="w-2 h-2 bg-neutral-medium rounded-full animate-pulse delay-600"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="p-md border-t border-neutral-light">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            className="input flex-1 mr-md"
            placeholder="Ask about contract functions, data, or actions..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading || !contractAddress}
          />
          <button
            type="submit"
            className="btn-primary p-3"
            disabled={isLoading || !inputValue.trim() || !contractAddress}
          >
            <Send size={20} />
          </button>
        </form>
        {!contractAddress && (
          <p className="mt-sm text-body-sm text-neutral-medium">
            Please select a contract to start chatting with the AI assistant.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;