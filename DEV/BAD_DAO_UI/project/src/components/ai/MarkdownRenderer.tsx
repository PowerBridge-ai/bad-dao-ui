import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import { Copy, Download, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
});

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const mermaidRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Process mermaid diagrams after render
  useEffect(() => {
    if (mermaidRefs.current.size > 0) {
      mermaidRefs.current.forEach((element, id) => {
        try {
          mermaid.render(
            `mermaid-svg-${id}`, 
            element.textContent || '',
            {
              container: element,
              suppressErrors: true
            } as any
          );
        } catch (error) {
          console.error('Error rendering mermaid diagram:', error);
        }
      });
    }
  }, [content]);

  // Handle code copying
  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Handle code download
  const handleDownloadCode = (code: string, language: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-snippet.${language || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Custom renderers
  const renderers = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match && match[1] ? match[1] : '';
      const code = String(children).replace(/\n$/, '');
      const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;
      
      // Check if it's a mermaid diagram
      if (language === 'mermaid') {
        return (
          <div 
            className="mermaid-diagram bg-neutral-dark/50 rounded-lg p-md my-md overflow-auto"
            ref={(element) => {
              if (element) {
                mermaidRefs.current.set(codeId, element);
                element.textContent = code;
              }
            }}
          />
        );
      }
      
      // Regular code block
      if (!inline && language) {
        return (
          <div className="code-block-container bg-neutral-dark/70 rounded-lg overflow-hidden my-md">
            <div className="code-header flex items-center justify-between bg-neutral-dark/90 px-md py-sm">
              <span className="text-caption font-medium text-neutral-light">{language}</span>
              <div className="flex items-center space-x-xs">
                <button 
                  className="text-neutral-light hover:text-primary p-1 rounded"
                  onClick={() => handleCopyCode(code, codeId)}
                  title="Copy code"
                >
                  {copiedCodeId === codeId ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
                <button 
                  className="text-neutral-light hover:text-primary p-1 rounded"
                  onClick={() => handleDownloadCode(code, language)}
                  title="Download code"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
            <pre className="p-md overflow-auto">
              <code className={`language-${language}`} {...props}>
                {children}
              </code>
            </pre>
          </div>
        );
      }
      
      // Inline code
      return (
        <code className="bg-neutral-dark/50 text-primary px-1 py-0.5 rounded text-sm" {...props}>
          {children}
        </code>
      );
    },
    // Custom table renderer
    table({ node, ...props }: any) {
      return (
        <div className="overflow-x-auto my-md">
          <table className="border-collapse w-full" {...props} />
        </div>
      );
    },
    tr({ node, ...props }: any) {
      return <tr className="border-b border-neutral-light/20" {...props} />;
    },
    th({ node, ...props }: any) {
      return <th className="px-4 py-2 text-left bg-neutral-dark/50 font-medium" {...props} />;
    },
    td({ node, ...props }: any) {
      return <td className="px-4 py-2" {...props} />;
    },
    // Custom blockquote
    blockquote({ node, ...props }: any) {
      return (
        <blockquote 
          className="border-l-4 border-primary/40 pl-4 py-1 my-md text-neutral-light/90 bg-neutral-dark/30 rounded-r-lg"
          {...props} 
        />
      );
    },
    // Custom list items
    li({ node, ordered, ...props }: any) {
      return <li className="my-1" {...props} />;
    }
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
        components={renderers}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 