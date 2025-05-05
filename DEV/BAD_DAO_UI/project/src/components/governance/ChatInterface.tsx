import React, { useRef, useEffect } from 'react';
import { Bot, Mic, Volume2, Play, Pause } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  content: string;
  isPlaying?: boolean;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  currentPlayingMessageId: string | null;
  isRecording: boolean;
  onPlayMessage?: (messageId: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  currentPlayingMessageId,
  isRecording,
  onPlayMessage
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-light text-sm">
        <p>No conversation yet. Start by selecting a workflow step.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="flex">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              {message.role === 'ai' ? (
                <Bot size={14} className="text-primary" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-neutral-light/20 flex items-center justify-center">
                  <span className="text-white text-xs">U</span>
                </div>
              )}
            </div>
            <div className="ml-2 flex-1">
              <div className={`rounded-lg p-2 max-w-[85%] ${message.role === 'ai' ? 'bg-neutral-dark' : 'bg-neutral-light/10 ml-auto'}`}>
                <p className="text-sm text-white whitespace-pre-line">{message.content}</p>
              </div>
              
              {/* Controls for AI messages */}
              {message.role === 'ai' && onPlayMessage && (
                <div className="flex items-center mt-1 space-x-1">
                  <button
                    className={`p-1 rounded ${message.id === currentPlayingMessageId ? 'text-primary bg-primary/10' : 'text-primary/60 hover:text-primary'}`}
                    onClick={() => onPlayMessage(message.id)}
                    title={message.id === currentPlayingMessageId ? 'Pause' : 'Play'}
                  >
                    {message.id === currentPlayingMessageId ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="flex">
            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <Mic size={14} className="text-red-500 animate-pulse" />
            </div>
            <div className="ml-2 flex-1">
              <div className="rounded-lg p-2 bg-neutral-light/5 text-neutral-light text-sm animate-pulse">
                Listening...
              </div>
            </div>
          </div>
        )}
        
        {/* End of messages marker for auto-scroll */}
        <div ref={messageEndRef}></div>
      </div>
    </div>
  );
};

export default ChatInterface; 