import React from 'react';
import { Bot, Mic, Volume2 } from 'lucide-react';

interface AIResponseTextProps {
  message: string;
  isPlaying?: boolean;
  onPlayClick?: () => void;
}

const AIResponseText: React.FC<AIResponseTextProps> = ({
  message,
  isPlaying = false,
  onPlayClick
}) => {
  return (
    <div className="bg-neutral rounded-lg p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-2">
            <Bot size={14} className="text-primary" />
          </div>
          <span className="text-sm font-medium text-white">AI Assistant</span>
        </div>
        
        {onPlayClick && (
          <button 
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isPlaying ? 'bg-primary text-white' : 'bg-neutral-light/10 text-neutral-light hover:bg-primary/20 hover:text-primary'
            }`}
            onClick={onPlayClick}
          >
            <Volume2 size={14} />
          </button>
        )}
      </div>
      
      <div className="text-sm text-neutral-light">
        {message}
      </div>
    </div>
  );
};

export default AIResponseText; 