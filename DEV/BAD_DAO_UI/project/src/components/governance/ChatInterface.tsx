import React, { useRef, useEffect, useState } from 'react';
import { Bot, Mic, Volume2, Play, Pause, User, Plus, Edit, Link, Trash, Info } from 'lucide-react';
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
  nodeEditorRef?: React.RefObject<{
    addNodeToCanvas: (nodeData: any) => string;
    clearCanvas: () => void;
    getCanvas: () => { nodes: any[], edges: any[] };
    removeNodeFromCanvas: (nodeId: string) => void;
    connectNodes: (sourceId: string, targetId: string) => void;
  }>;
}

// Node command patterns for natural language processing
const NODE_COMMANDS = {
  ADD: [
    /add(?:\s+a)?(?:\s+new)?(?:\s+node)?(?:\s+called|named)?\s+(\w+)(?:\s+of\s+type|type)?\s+(\w+)/i,
    /create(?:\s+a)?(?:\s+new)?(?:\s+node)?(?:\s+called|named)?\s+(\w+)(?:\s+of\s+type|type)?\s+(\w+)/i,
    /new(?:\s+node)?(?:\s+called|named)?\s+(\w+)(?:\s+of\s+type|type)?\s+(\w+)/i
  ],
  REMOVE: [
    /remove(?:\s+node)?\s+(\w+-\d+)/i,
    /delete(?:\s+node)?\s+(\w+-\d+)/i
  ],
  CONNECT: [
    /connect(?:\s+node)?\s+(\w+-\d+)(?:\s+to)?\s+(\w+-\d+)/i,
    /link(?:\s+node)?\s+(\w+-\d+)(?:\s+to)?\s+(\w+-\d+)/i
  ],
  LIST: [
    /list(?:\s+all)?(?:\s+nodes)?/i,
    /show(?:\s+all)?(?:\s+nodes)?/i
  ],
  CLEAR: [
    /clear(?:\s+canvas)?/i,
    /reset(?:\s+canvas)?/i
  ]
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  currentPlayingMessageId,
  isRecording,
  onPlayMessage,
  onSubmitResponse,
  nodeEditorRef
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [commandHelp, setCommandHelp] = useState<boolean>(false);
  const [nodeCommandFeedback, setNodeCommandFeedback] = useState<{type: string, message: string} | null>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Process natural language commands
  const processNaturalLanguageCommand = (input: string) => {
    if (!nodeEditorRef || !nodeEditorRef.current) {
      return { success: false, message: "Node editor reference not available" };
    }

    const trimmedInput = input.trim();
    
    // Check for add node patterns
    for (const pattern of NODE_COMMANDS.ADD) {
      const match = trimmedInput.match(pattern);
      if (match) {
        const [_, nodeName, nodeType] = match;
        return processAddNode(nodeName, nodeType);
      }
    }
    
    // Check for remove node patterns
    for (const pattern of NODE_COMMANDS.REMOVE) {
      const match = trimmedInput.match(pattern);
      if (match) {
        const [_, nodeId] = match;
        return processRemoveNode(nodeId);
      }
    }
    
    // Check for connect node patterns
    for (const pattern of NODE_COMMANDS.CONNECT) {
      const match = trimmedInput.match(pattern);
      if (match) {
        const [_, sourceId, targetId] = match;
        return processConnectNodes(sourceId, targetId);
      }
    }
    
    // Check for list nodes patterns
    for (const pattern of NODE_COMMANDS.LIST) {
      if (pattern.test(trimmedInput)) {
        return processListNodes();
      }
    }
    
    // Check for clear canvas patterns
    for (const pattern of NODE_COMMANDS.CLEAR) {
      if (pattern.test(trimmedInput)) {
        return processClearCanvas();
      }
    }
    
    // Check for explicit commands starting with /
    if (trimmedInput.startsWith('/')) {
      return processExplicitCommand(trimmedInput);
    }
    
    // Not a recognized command
    return { success: false, message: null };
  };

  // Helper to process explicit node commands
  const processExplicitCommand = (input: string) => {
    if (!nodeEditorRef || !nodeEditorRef.current) {
      return { success: false, message: "Node editor reference not available" };
    }

    const trimmedInput = input.trim().toLowerCase();
    
    // Command: help
    if (trimmedInput === '/help') {
      setCommandHelp(true);
      return { success: true, message: null };
    }
    
    // Command: add node
    if (trimmedInput.startsWith('/add')) {
      const parts = input.slice(4).trim().split(' ');
      let nodeType = 'token';
      let nodeName = 'New Node';
      
      if (parts.length >= 1) {
        nodeType = parts[0].toLowerCase();
      }
      
      if (parts.length >= 2) {
        nodeName = parts.slice(1).join(' ');
      }
      
      return processAddNode(nodeName, nodeType);
    }
    
    // Command: remove node
    if (trimmedInput.startsWith('/remove')) {
      const nodeId = input.slice(7).trim();
      if (!nodeId) {
        return { success: false, message: "Please specify a node ID to remove" };
      }
      
      return processRemoveNode(nodeId);
    }
    
    // Command: connect nodes
    if (trimmedInput.startsWith('/connect')) {
      const parts = input.slice(8).trim().split(' ');
      if (parts.length < 2) {
        return { success: false, message: "Please specify source and target node IDs to connect" };
      }
      
      const sourceId = parts[0];
      const targetId = parts[1];
      
      return processConnectNodes(sourceId, targetId);
    }
    
    // Command: list nodes
    if (trimmedInput === '/list') {
      return processListNodes();
    }
    
    // Command: clear canvas
    if (trimmedInput === '/clear') {
      return processClearCanvas();
    }
    
    // Not a recognized command
    return { success: false, message: null };
  };
  
  // Process add node command
  const processAddNode = (nodeName: string, nodeType: string) => {
    const nodeData = {
      name: nodeName || 'New Node',
      type: nodeType.toLowerCase() || 'token',
      ...(nodeType.toLowerCase() === 'token' && {
        symbol: nodeName.substring(0, 4).toUpperCase() || 'TKN',
        decimals: '18',
        supply: '1000000'
      })
    };
    
    // Show feedback to user
    setNodeCommandFeedback({
      type: 'add',
      message: `Creating ${nodeType} node named "${nodeName}"...`
    });
    
    // Add node with a slight delay to allow feedback to show
    setTimeout(() => {
      const nodeId = nodeEditorRef!.current!.addNodeToCanvas(nodeData);
      
      // Clear feedback after 2 seconds
      setTimeout(() => {
        setNodeCommandFeedback(null);
      }, 2000);
    }, 300);
    
    return { 
      success: true, 
      message: `Added ${nodeType} node "${nodeName}"` 
    };
  };
  
  // Process remove node command
  const processRemoveNode = (nodeId: string) => {
    // Show feedback to user
    setNodeCommandFeedback({
      type: 'remove',
      message: `Removing node ${nodeId}...`
    });
    
    // Remove node with a slight delay to allow feedback to show
    setTimeout(() => {
      nodeEditorRef!.current!.removeNodeFromCanvas(nodeId);
      
      // Clear feedback after 2 seconds
      setTimeout(() => {
        setNodeCommandFeedback(null);
      }, 2000);
    }, 300);
    
    return { 
      success: true, 
      message: `Removed node with ID: ${nodeId}` 
    };
  };
  
  // Process connect nodes command
  const processConnectNodes = (sourceId: string, targetId: string) => {
    // Show feedback to user
    setNodeCommandFeedback({
      type: 'connect',
      message: `Connecting node ${sourceId} to ${targetId}...`
    });
    
    // Connect nodes with a slight delay to allow feedback to show
    setTimeout(() => {
      nodeEditorRef!.current!.connectNodes(sourceId, targetId);
      
      // Clear feedback after 2 seconds
      setTimeout(() => {
        setNodeCommandFeedback(null);
      }, 2000);
    }, 300);
    
    return { 
      success: true, 
      message: `Connected node ${sourceId} to ${targetId}` 
    };
  };
  
  // Process list nodes command
  const processListNodes = () => {
    const { nodes } = nodeEditorRef!.current!.getCanvas();
    const nodeList = nodes.map(node => `${node.id}: ${node.data.name} (${node.type})`).join('\n');
    
    // Show feedback briefly
    setNodeCommandFeedback({
      type: 'list',
      message: 'Listing all nodes...'
    });
    
    // Clear feedback after 1 second
    setTimeout(() => {
      setNodeCommandFeedback(null);
    }, 1000);
    
    return { 
      success: true, 
      message: `Available nodes:\n${nodeList}` 
    };
  };
  
  // Process clear canvas command
  const processClearCanvas = () => {
    // Show feedback to user
    setNodeCommandFeedback({
      type: 'clear',
      message: 'Clearing canvas...'
    });
    
    // Clear canvas with a slight delay to allow feedback to show
    setTimeout(() => {
      nodeEditorRef!.current!.clearCanvas();
      
      // Clear feedback after 2 seconds
      setTimeout(() => {
        setNodeCommandFeedback(null);
      }, 2000);
    }, 300);
    
    return { 
      success: true, 
      message: "Canvas cleared" 
    };
  };

  // Handle input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRef.current && inputRef.current.value.trim()) {
      const userInput = inputRef.current.value;
      
      // Check if this is a natural language or explicit node command
      const result = processNaturalLanguageCommand(userInput);
      
      // If it was a command and we should respond with a message
      if (result.success) {
        // Always pass the user input to the parent
        if (onSubmitResponse) {
          onSubmitResponse(userInput);
        }
        
        // Clear the input field
        inputRef.current.value = '';
        
        // If we have a message to display, create an AI response
        if (result.message && onSubmitResponse) {
          // We simulate the AI response after a short delay
          setTimeout(() => {
            onSubmitResponse(`**Node Command Result:**\n\n${result.message}`);
          }, 300);
        }
        return;
      }
      
      // Not a recognized command, pass to normal handler
      if (onSubmitResponse) {
        onSubmitResponse(userInput);
        inputRef.current.value = '';
      }
    }
  };
  
  // Get icon for node command feedback
  const getNodeCommandIcon = (type: string) => {
    switch (type) {
      case 'add':
        return <Plus size={14} className="text-green-400" />;
      case 'remove':
        return <Trash size={14} className="text-red-400" />;
      case 'connect':
        return <Link size={14} className="text-blue-400" />;
      case 'list':
        return <Info size={14} className="text-yellow-400" />;
      case 'clear':
        return <Trash size={14} className="text-orange-400" />;
      default:
        return <Bot size={14} className="text-primary" />;
    }
  };

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-light text-sm">
        <p>No conversation yet. Start by selecting a workflow step or type /help for node commands.</p>
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
        
        {/* Node command feedback */}
        {nodeCommandFeedback && (
          <div className="flex">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
              {getNodeCommandIcon(nodeCommandFeedback.type)}
            </div>
            <div className="flex-1">
              <div className="rounded-lg p-2 bg-primary/5 border border-primary/20 text-neutral-light text-sm animate-pulse">
                {nodeCommandFeedback.message}
              </div>
            </div>
          </div>
        )}

        {/* Command help tooltip */}
        {commandHelp && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2 flex-shrink-0">
              <Bot size={14} className="text-primary" />
            </div>
            <div className="rounded-lg p-3 bg-neutral-dark text-sm text-white max-w-[85%]">
              <h3 className="font-medium mb-2">Node Command Help</h3>
              <div className="space-y-2 mb-3">
                <p className="text-neutral-light text-xs">You can use the following commands to manage nodes:</p>
                <ul className="space-y-1 text-xs">
                  <li><code className="bg-neutral-light/10 rounded px-1">/add [type] [name]</code> - Create a new node</li>
                  <li><code className="bg-neutral-light/10 rounded px-1">/remove [node-id]</code> - Delete a node</li>
                  <li><code className="bg-neutral-light/10 rounded px-1">/connect [source-id] [target-id]</code> - Connect nodes</li>
                  <li><code className="bg-neutral-light/10 rounded px-1">/list</code> - Show all nodes</li>
                  <li><code className="bg-neutral-light/10 rounded px-1">/clear</code> - Clear the canvas</li>
                </ul>
              </div>
              <h4 className="font-medium mb-1">Natural Language Examples:</h4>
              <ul className="space-y-1 text-xs text-neutral-light">
                <li>"Add a token node called MyToken"</li>
                <li>"Create a governance node named DAOGov"</li>
                <li>"Connect token-1234 to governance-5678"</li>
                <li>"Remove token-1234"</li>
                <li>"Show all nodes"</li>
              </ul>
            </div>
          </div>
        )}
        
        <div ref={messageEndRef} />
      </div>
      
      <div className="p-3 border-t border-neutral-light/10">
        <form onSubmit={handleSubmit} className="flex">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-neutral-dark border border-neutral-light/20 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-primary/50"
            placeholder={nodeEditorRef ? "Type a message or node command..." : "Type a message..."}
            disabled={isRecording || currentPlayingMessageId !== null}
          />
          <button
            type="submit"
            className="ml-2 bg-primary hover:bg-primary-light text-black rounded-lg px-3 py-2 text-sm flex items-center"
            disabled={isRecording || currentPlayingMessageId !== null}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface; 