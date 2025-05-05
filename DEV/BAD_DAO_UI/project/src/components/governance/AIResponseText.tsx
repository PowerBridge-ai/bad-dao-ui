import React from 'react';

interface AIResponseTextProps {
  text: string;
}

const AIResponseText: React.FC<AIResponseTextProps> = ({ text }) => {
  // Check if the text is the loading indicator
  if (text === '...') {
    return (
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
      </div>
    );
  }

  // Simple text formatter with line breaks and basic markdown-like formatting
  const formattedText = text
    .split('\n')
    .map((line, i) => {
      // Handle bullet points
      if (line.trim().startsWith('- ')) {
        return (
          <div key={i} className="flex items-start mb-1">
            <span className="mr-2 text-primary">•</span>
            <span>{line.replace('- ', '')}</span>
          </div>
        );
      }
      
      // Handle headers
      if (line.trim().startsWith('### ')) {
        return <h3 key={i} className="text-lg font-medium mt-3 mb-2">{line.replace('### ', '')}</h3>;
      }
      
      if (line.trim().startsWith('## ')) {
        return <h2 key={i} className="text-xl font-medium mt-4 mb-2">{line.replace('## ', '')}</h2>;
      }
      
      // Handle horizontal rule
      if (line.trim() === '---') {
        return <hr key={i} className="my-3 border-neutral-light/20" />;
      }
      
      // Handle code blocks - this is simplified, a real implementation would need more robust parsing
      if (line.includes('`')) {
        return (
          <div key={i} className="mb-1">
            {line.split('`').map((segment, j) => (
              j % 2 === 0 ? 
                <span key={j}>{segment}</span> : 
                <code key={j} className="bg-neutral-light/10 px-1 rounded font-mono text-primary">{segment}</code>
            ))}
          </div>
        );
      }
      
      // Regular text with break if not empty
      return line.trim() ? <p key={i} className="mb-1">{line}</p> : <br key={i} />;
    });

  return <div className="ai-response">{formattedText}</div>;
};

export default AIResponseText; 