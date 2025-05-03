import { useState } from 'react';
import { Clock, FileCode, Hash, Copy, ChevronDown, ChevronRight, X } from 'lucide-react';
import type { ChatSession, Message, CodeSnippet } from '../../services/aiService';

interface ChatHistoryProps {
  sessions: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

const ChatHistory = ({ sessions, activeChatId, onSelectChat, onDeleteChat }: ChatHistoryProps) => {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);

  // Toggle session expansion
  const toggleSessionExpand = (sessionId: string) => {
    setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
  };

  // Toggle message metadata expansion
  const toggleMessageExpand = (messageId: string) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  // Open modal with content
  const openModal = (title: string, content: React.ReactNode) => {
    setModalContent({ title, content });
    setShowModal(true);
  };

  // Show code snippet in modal
  const showCodeSnippet = (snippet: CodeSnippet) => {
    openModal(
      snippet.title || `${snippet.language} Code Snippet`,
      <div>
        <div className="flex justify-between items-center mb-sm">
          <div className="text-caption font-medium">{snippet.language}</div>
          <button 
            className="btn-sm"
            onClick={() => copyToClipboard(snippet.code)}
          >
            <Copy size={14} className="mr-1" />
            Copy
          </button>
        </div>
        <pre className="bg-neutral-dark text-white p-md rounded overflow-x-auto">
          <code>{snippet.code}</code>
        </pre>
      </div>
    );
  };

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Check if message has metadata
  const hasMetadata = (message: Message) => {
    return message.metadata && (
      (message.metadata.contracts && message.metadata.contracts.length > 0) ||
      (message.metadata.codeSnippets && message.metadata.codeSnippets.length > 0) ||
      (message.metadata.transactionIds && message.metadata.transactionIds.length > 0) ||
      (message.metadata.tokenAddresses && message.metadata.tokenAddresses.length > 0)
    );
  };

  // Group sessions by date
  const groupedSessions = sessions.reduce((groups, session) => {
    const date = formatDate(session.lastUpdated);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
    return groups;
  }, {} as Record<string, ChatSession[]>);

  return (
    <div className="h-full flex flex-col border-r border-neutral-light">
      <div className="p-md border-b border-neutral-light">
        <h3 className="text-h3">Chat History</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-md">
        {Object.entries(groupedSessions).map(([date, dateSessions]) => (
          <div key={date} className="mb-lg">
            <div className="text-caption text-neutral-medium mb-sm flex items-center">
              <Clock size={12} className="mr-1" />
              {date}
            </div>
            
            <div className="space-y-sm">
              {dateSessions.map(session => (
                <div 
                  key={session.id} 
                  className="rounded-lg overflow-hidden"
                >
                  <div 
                    className={`p-md cursor-pointer flex items-center justify-between ${
                      session.id === activeChatId 
                        ? 'bg-primary/10 border-l-4 border-primary' 
                        : 'bg-neutral-light/50 hover:bg-neutral-light'
                    }`}
                    onClick={() => {
                      if (session.id !== activeChatId) {
                        onSelectChat(session.id);
                      }
                      toggleSessionExpand(session.id);
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="text-body-sm font-medium truncate">{session.title}</div>
                      <div className="text-caption text-neutral-medium">
                        {session.messages.length} messages
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <button 
                        className="text-neutral-medium hover:text-error p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(session.id);
                        }}
                      >
                        <X size={16} />
                      </button>
                      
                      {expandedSessionId === session.id ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </div>
                  </div>
                  
                  {expandedSessionId === session.id && (
                    <div className="bg-neutral-light/30 p-sm">
                      {session.messages.filter(msg => msg.sender === 'ai' && hasMetadata(msg)).map(message => (
                        <div 
                          key={message.id}
                          className="rounded bg-white/50 p-sm mb-xs"
                        >
                          <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleMessageExpand(message.id)}
                          >
                            <div className="text-caption truncate">
                              {message.text.slice(0, 50)}...
                            </div>
                            
                            {expandedMessageId === message.id ? (
                              <ChevronDown size={14} />
                            ) : (
                              <ChevronRight size={14} />
                            )}
                          </div>
                          
                          {expandedMessageId === message.id && message.metadata && (
                            <div className="mt-sm space-y-sm">
                              {message.metadata.contracts && message.metadata.contracts.length > 0 && (
                                <div className="bg-neutral-light rounded p-xs">
                                  <div className="text-caption font-medium">Contract Addresses</div>
                                  <div className="space-y-xs">
                                    {message.metadata.contracts.map((contract, idx) => (
                                      <div 
                                        key={idx}
                                        className="flex items-center justify-between text-caption text-neutral-medium"
                                      >
                                        <span className="truncate">{contract}</span>
                                        <button 
                                          className="text-primary p-1"
                                          onClick={() => copyToClipboard(contract)}
                                        >
                                          <Copy size={12} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {message.metadata.transactionIds && message.metadata.transactionIds.length > 0 && (
                                <div className="bg-neutral-light rounded p-xs">
                                  <div className="text-caption font-medium">Transaction IDs</div>
                                  <div className="space-y-xs">
                                    {message.metadata.transactionIds.map((tx, idx) => (
                                      <div 
                                        key={idx}
                                        className="flex items-center justify-between text-caption text-neutral-medium"
                                      >
                                        <span className="truncate">{tx}</span>
                                        <button 
                                          className="text-primary p-1"
                                          onClick={() => copyToClipboard(tx)}
                                        >
                                          <Copy size={12} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {message.metadata.tokenAddresses && message.metadata.tokenAddresses.length > 0 && (
                                <div className="bg-neutral-light rounded p-xs">
                                  <div className="text-caption font-medium">Token Addresses</div>
                                  <div className="space-y-xs">
                                    {message.metadata.tokenAddresses.map((token, idx) => (
                                      <div 
                                        key={idx}
                                        className="flex items-center justify-between text-caption text-neutral-medium"
                                      >
                                        <span className="truncate">{token}</span>
                                        <button 
                                          className="text-primary p-1"
                                          onClick={() => copyToClipboard(token)}
                                        >
                                          <Copy size={12} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {message.metadata.codeSnippets && message.metadata.codeSnippets.length > 0 && (
                                <div className="bg-neutral-light rounded p-xs">
                                  <div className="text-caption font-medium">Code Snippets</div>
                                  <div className="space-y-xs">
                                    {message.metadata.codeSnippets.map((snippet, idx) => (
                                      <div 
                                        key={idx}
                                        className="flex items-center justify-between text-caption"
                                      >
                                        <div className="flex items-center text-neutral-medium">
                                          <FileCode size={12} className="mr-1" />
                                          <span>{snippet.language || 'Code'}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <button 
                                            className="text-primary p-1"
                                            onClick={() => copyToClipboard(snippet.code)}
                                          >
                                            <Copy size={12} />
                                          </button>
                                          <button 
                                            className="text-primary p-1"
                                            onClick={() => showCodeSnippet(snippet)}
                                          >
                                            <Hash size={12} />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for displaying code snippets */}
      {showModal && modalContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-md border-b border-neutral-light flex items-center justify-between">
              <h3 className="text-h3">{modalContent.title}</h3>
              <button 
                className="text-neutral-medium hover:text-error"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-md overflow-y-auto flex-1">
              {modalContent.content}
            </div>
            
            <div className="p-md border-t border-neutral-light flex justify-end">
              <button 
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistory; 