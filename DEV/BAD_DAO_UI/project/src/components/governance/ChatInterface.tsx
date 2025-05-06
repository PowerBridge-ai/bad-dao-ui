import React, { useRef, useEffect } from 'react';
import { Bot, Mic, Volume2, Play, Pause, User } from 'lucide-react';
import MarkdownRenderer from '../ai/MarkdownRenderer';

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
  onSubmitResponse?: (response: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  currentPlayingMessageId,
  isRecording,
  onPlayMessage,
  onSubmitResponse
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRef.current && inputRef.current.value.trim() && onSubmitResponse) {
      onSubmitResponse(inputRef.current.value);
      inputRef.current.value = '';
    }
  };

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
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2 flex-shrink-0">
                <Bot size={14} className="text-primary" />
              </div>
            )}
            
            <div className={`rounded-lg p-2 max-w-[85%] ${
              message.role === 'ai' 
                ? 'bg-neutral-dark' 
                : 'bg-primary/10 text-right'
            }`}>
              {message.role === 'ai' ? (
                <div className="markdown-content text-sm text-white">
                  <MarkdownRenderer content={message.content} />
                </div>
              ) : (
                <p className="text-sm text-white whitespace-pre-line">{message.content}</p>
              )}
              
              {/* Voice controls for AI messages */}
              {message.role === 'ai' && onPlayMessage && (
                <div className="flex items-center mt-1 space-x-1">
                  <button
                    className={`p-1 rounded ${message.id === currentPlayingMessageId ? 'text-primary bg-primary/10' : 'text-primary/60 hover:text-primary'}`}
                    onClick={() => onPlayMessage(message.id)}
                    disabled={isRecording || (currentPlayingMessageId !== null && currentPlayingMessageId !== message.id)}
                    title={message.id === currentPlayingMessageId ? 'Playing' : 'Play'}
                  >
                    {message.id === currentPlayingMessageId ? (
                      <Volume2 size={14} className="animate-pulse" />
                    ) : (
                      <Play size={14} />
                    )}
                  </button>
                </div>
              )}
            </div>
            
            {message.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-neutral-light/20 flex items-center justify-center ml-2 flex-shrink-0">
                <User size={14} className="text-white" />
              </div>
            )}
          </div>
        ))}
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="flex">
            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mr-2">
              <Mic size={14} className="text-red-500 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="rounded-lg p-2 bg-red-500/5 border border-red-500/20 text-neutral-light text-sm">
                Listening...
              </div>
            </div>
          </div>
        )}
        
        {/* End of messages marker for auto-scroll */}
        <div ref={messageEndRef} />
      </div>
      
      {/* Input area (optional) */}
      {onSubmitResponse && (
        <div className="p-2 border-t border-neutral-light/10">
          <form onSubmit={handleSubmit} className="flex">
            <input
              ref={inputRef}
              type="text"
              className={`flex-1 bg-neutral-dark border border-neutral-light/20 rounded-l-md p-2 text-white text-sm ${isRecording ? 'border-red-500 bg-red-500/5' : ''}`}
              placeholder={isRecording ? "Listening..." : "Type your response..."}
              disabled={currentPlayingMessageId !== null}
            />
            <button
              type="submit"
              className="bg-primary text-white p-2 rounded-r-md hover:bg-primary-dark disabled:opacity-50"
              disabled={currentPlayingMessageId !== null || isRecording}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatInterface; 