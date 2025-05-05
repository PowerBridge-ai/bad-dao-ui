import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Wallet, 
  Coins, 
  Clock, 
  Users, 
  Bot,
  Plus,
  X,
  Save,
  AlertTriangle,
  PieChart,
  Settings,
  Lock,
  Rocket,
  MessageSquare,
  Mic,
  ChevronRight,
  ChevronLeft,
  Volume2
} from 'lucide-react';
import './NodeEditor.css'; // Import the CSS
import TokenDistributionChart from './TokenDistributionChart';
import AIResponseText from './AIResponseText'; // Import the AI response component
import elevenlabsService from '../../services/elevenlabsService';
import ElevenLabsConfig from './ElevenLabsConfig';

// Node types based on contract types
type NodeType = 'governance' | 'token' | 'vesting' | 'delegation' | 'ai' | 'treasury' | 'role' | 'tokenomics';

// Position interface for node placement
interface Position {
  x: number;
  y: number;
}

// Node interface for editor
interface Node {
  id: string;
  type: NodeType;
  position: Position;
  data: Record<string, any>;
  width: number;
  height: number;
  inputs: string[];
  outputs: string[];
  isSelected: boolean;
}

// Connection between nodes
interface Connection {
  id: string;
  sourceId: string;
  sourceHandle: string;
  targetId: string;
  targetHandle: string;
  label?: string;
  color?: string;
  animated?: boolean;
}

// Connection start position with coordinates for drawing
interface ConnectionStartPosition {
  nodeId: string;
  handle: string;
  x: number;
  y: number;
}

// NodeEditor Props
interface NodeEditorProps {
  onSave?: (nodes: Node[], connections: Connection[]) => void;
  onDeploy?: (nodes: Node[], connections: Connection[]) => void;
  initialNodes?: Node[];
  initialConnections?: Connection[];
}

const defaultNodes: Node[] = [
  {
    id: 'governance-1',
    type: 'governance',
    position: { x: 250, y: 100 },
    data: { 
      name: 'Governance Contract',
      votingPeriod: '3 days',
      quorum: '20%',
      proposalThreshold: '1%',
    },
    width: 220,
    height: 120,
    inputs: ['token'],
    outputs: ['deploy'],
    isSelected: false
  },
  {
    id: 'token-1',
    type: 'token',
    position: { x: 50, y: 100 },
    data: { 
      name: 'DAO Token',
      symbol: 'DAO',
      decimals: '18',
      supply: '100000000'
    },
    width: 180,
    height: 120,
    inputs: [],
    outputs: ['token'],
    isSelected: false
  },
  {
    id: 'roles-1',
    type: 'role',
    position: { x: 50, y: 300 },
    data: { 
      name: 'Roles',
      roles: [
        { name: 'Core Team', percentage: 20 },
        { name: 'Contributors', percentage: 30 },
        { name: 'Community', percentage: 50 }
      ]
    },
    width: 180,
    height: 140,
    inputs: [],
    outputs: ['roles'],
    isSelected: false
  }
];

const defaultConnections: Connection[] = [
  {
    id: 'conn-1',
    sourceId: 'token-1',
    sourceHandle: 'token',
    targetId: 'governance-1',
    targetHandle: 'token'
  }
];

const NodeEditor: React.FC<NodeEditorProps> = ({ 
  onSave, 
  onDeploy,
  initialNodes = defaultNodes,
  initialConnections = defaultConnections
}) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<ConnectionStartPosition | null>(null);
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [showNodePalette, setShowNodePalette] = useState(false);
  const [showNodeEditor, setShowNodeEditor] = useState(false);
  const [showConnectionEditor, setShowConnectionEditor] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
  
  // Voice configuration state variables
  const [showVoiceConfig, setShowVoiceConfig] = useState(false);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>(localStorage.getItem('elevenlabsApiKey') || '');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(localStorage.getItem('elevenlabsVoiceId') || '');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  
  // Color mapping for node types
  const nodeTypeColors = {
    governance: 'rgb(59, 130, 246)', // blue
    token: 'rgb(16, 185, 129)',      // green
    vesting: 'rgb(236, 72, 153)',     // pink
    delegation: 'rgb(139, 92, 246)',  // purple
    ai: 'rgb(245, 158, 11)',          // amber
    treasury: 'rgb(251, 191, 36)',    // yellow
    role: 'rgb(6, 182, 212)',         // cyan
    tokenomics: 'rgb(248, 113, 113)'  // red
  };

  // Icon mapping for node types
  const nodeTypeIcons = {
    governance: <Shield size={20} />,
    token: <Coins size={20} />,
    vesting: <Clock size={20} />,
    delegation: <Users size={20} />,
    ai: <Bot size={20} />,
    treasury: <Wallet size={20} />,
    role: <Users size={20} />,
    tokenomics: <PieChart size={20} />
  };

  // Node templates for palette
  const nodeTemplates: Array<Omit<Node, 'position' | 'isSelected' | 'id'>> = [
    {
      type: 'governance',
      data: { 
        name: 'Governance Contract',
        votingPeriod: '3 days',
        quorum: '20%',
        proposalThreshold: '1%',
      },
      width: 220,
      height: 120,
      inputs: ['token', 'roles'],
      outputs: ['deploy']
    },
    {
      type: 'token',
      data: { 
        name: 'DAO Token',
        symbol: 'DAO',
        decimals: '18',
        supply: '100000000'
      },
      width: 180,
      height: 120,
      inputs: [],
      outputs: ['token']
    },
    {
      type: 'vesting',
      data: { 
        name: 'Vesting Schedule',
        cliffPeriod: '6 months',
        vestingDuration: '2 years',
        releaseInterval: 'Monthly'
      },
      width: 180,
      height: 120,
      inputs: ['token'],
      outputs: ['vesting']
    },
    {
      type: 'delegation',
      data: { 
        name: 'Delegation Rules',
        canDelegatePartial: true,
        minDelegationPeriod: '1 week'
      },
      width: 180,
      height: 120,
      inputs: ['token', 'roles'],
      outputs: ['delegation']
    },
    {
      type: 'treasury',
      data: { 
        name: 'Treasury',
        address: '0x...',
        withdrawalThreshold: '3 signers'
      },
      width: 180,
      height: 120,
      inputs: ['token', 'governance'],
      outputs: ['treasury']
    },
    {
      type: 'ai',
      data: { 
        name: 'AI Integration',
        provider: 'OpenAI',
        integrationType: 'Proposal Analysis'
      },
      width: 180,
      height: 120,
      inputs: ['governance'],
      outputs: ['ai']
    },
    {
      type: 'role',
      data: { 
        name: 'Roles',
        roles: [
          { name: 'Core Team', percentage: 20 },
          { name: 'Contributors', percentage: 30 },
          { name: 'Community', percentage: 50 }
        ]
      },
      width: 180,
      height: 140,
      inputs: [],
      outputs: ['roles']
    },
    {
      type: 'tokenomics',
      data: { 
        name: 'Token Distribution',
        distribution: [
          { category: 'Team', percentage: 15 },
          { category: 'Community', percentage: 40 },
          { category: 'Treasury', percentage: 25 },
          { category: 'Investors', percentage: 20 }
        ]
      },
      width: 220,
      height: 160,
      inputs: ['token'],
      outputs: ['distribution']
    }
  ];

  // Initialize ElevenLabs on component mount if API key exists
  useEffect(() => {
    if (elevenLabsApiKey) {
      elevenlabsService.initElevenLabsService(elevenLabsApiKey);
    }
  }, [elevenLabsApiKey]);

  // Handle node selection
  const handleNodeClick = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If clicking the same node twice, open editor
    if (selectedNodeId === nodeId) {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        setEditingNode(node);
        setShowNodeEditor(true);
        return;
      }
    }
    
    setSelectedNodeId(nodeId);
    
    // Update node selection state
    setNodes(prev => prev.map(node => ({
      ...node,
      isSelected: node.id === nodeId
    })));
  };

  // Start dragging a node
  const handleNodeDragStart = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
    
    const node = nodes.find(n => n.id === nodeId);
    if (node && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - (canvasRect.left + node.position.x),
        y: e.clientY - (canvasRect.top + node.position.y)
      });
    }
  };

  // Handle mouse movement when dragging
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - canvasRect.left;
      const mouseY = e.clientY - canvasRect.top;
      
      // Update mouse position for temp connection line
      setMousePosition({ x: mouseX, y: mouseY });
      
      // Handle node dragging
      if (draggingNodeId) {
        setNodes(prev => prev.map(node => {
          if (node.id === draggingNodeId) {
            return {
              ...node,
              position: {
                x: mouseX - dragOffset.x,
                y: mouseY - dragOffset.y
              }
            };
          }
          return node;
        }));
      }
    }
  };

  // Handle mouse up to stop dragging
  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    setDraggingNodeId(null);
    if (isConnecting) {
      // If we're connecting and mouse is released on canvas (not on a node input),
      // cancel the connection
      setIsConnecting(false);
      setConnectionStart(null);
    }
  };

  // Handle clicking on canvas background
  const handleCanvasClick = () => {
    setSelectedNodeId(null);
    setNodes(prev => prev.map(node => ({
      ...node,
      isSelected: false
    })));
  };

  // Add a new node from the palette
  const addNodeFromTemplate = (template: typeof nodeTemplates[0]) => {
    const newNode: Node = {
      ...template,
      id: `${template.type}-${Date.now()}`,
      position: { x: 100, y: 100 }, // Default position
      isSelected: false
    };
    
    setNodes(prev => [...prev, newNode]);
    setShowNodePalette(false);
  };

  // Start creating a connection
  const handleConnectorMouseDown = (nodeId: string, handleId: string, isInput: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Only allow starting connections from outputs
    if (isInput) return;
    
    // Find the node and get the position of the handle
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const handlePos = getHandlePosition(node, handleId, isInput);
    const x = node.position.x + handlePos.x;
    const y = node.position.y + handlePos.y;
    
    setIsConnecting(true);
    setConnectionStart({ 
      nodeId, 
      handle: handleId,
      x,
      y 
    });
  };

  // Complete a connection
  const handleConnectorMouseUp = (nodeId: string, handleId: string, isInput: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If we're not currently creating a connection, do nothing
    if (!isConnecting || !connectionStart) {
      return;
    }

    // Only allow ending connections at inputs
    if (!isInput || connectionStart.nodeId === nodeId) {
      return;
    }
    
    console.log("Creating connection from", connectionStart, "to", { nodeId, handleId });
    
    // Create the new connection
    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      sourceId: connectionStart.nodeId,
      sourceHandle: connectionStart.handle,
      targetId: nodeId,
      targetHandle: handleId,
      animated: true
    };
    
    setConnections(prev => [...prev, newConnection]);
    setIsConnecting(false);
    setConnectionStart(null);
  };

  // Save the current state
  const handleSave = () => {
    if (onSave) {
      onSave(nodes, connections);
    }
  };
  
  // Deploy the current configuration
  const handleDeploy = () => {
    if (onDeploy) {
      onDeploy(nodes, connections);
    } else if (onSave) {
      // Fallback to save if deploy not provided
      onSave(nodes, connections);
    }
  };

  // Update node data when editing
  const handleNodeUpdate = (updatedData: Record<string, any>) => {
    if (!editingNode) return;
    
    setNodes(prev => prev.map(node => {
      if (node.id === editingNode.id) {
        return {
          ...node,
          data: updatedData
        };
      }
      return node;
    }));
    
    setShowNodeEditor(false);
    setEditingNode(null);
  };

  // Delete a connection
  const handleDeleteConnection = (connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  };

  // Delete a node and its connections
  const handleDeleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => 
      prev.filter(conn => conn.sourceId !== nodeId && conn.targetId !== nodeId)
    );
  };

  // Get handle position relative to node
  const getHandlePosition = (node: Node, handleId: string, isInput: boolean): Position => {
    const handleIndex = isInput 
      ? node.inputs.indexOf(handleId)
      : node.outputs.indexOf(handleId);
    
    if (handleIndex === -1) return { x: 0, y: 0 };
    
    const handleCount = isInput ? node.inputs.length : node.outputs.length;
    const spacing = node.height / (handleCount + 1);
    
    return {
      x: isInput ? 0 : node.width,
      y: spacing * (handleIndex + 1)
    };
  };

  // Handle connection click for editing
  const handleConnectionClick = (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId);
    if (connection) {
      setEditingConnection(connection);
      setShowConnectionEditor(true);
    }
  };
  
  // Handle connection update
  const handleConnectionUpdate = (updatedData: Partial<Connection>) => {
    if (!editingConnection) return;
    
    const updatedConnections = connections.map(conn => 
      conn.id === editingConnection.id
        ? { ...conn, ...updatedData }
        : conn
    );
    
    setConnections(updatedConnections);
    setShowConnectionEditor(false);
    setEditingConnection(null);
  };

  // Handle voice configuration save
  const handleSaveVoiceConfig = (apiKey: string, voiceId: string) => {
    setElevenLabsApiKey(apiKey);
    setSelectedVoiceId(voiceId);
    setIsVoiceEnabled(true);
    
    // Save to localStorage
    localStorage.setItem('elevenlabsApiKey', apiKey);
    localStorage.setItem('elevenlabsVoiceId', voiceId);
    
    // Initialize service
    elevenlabsService.initElevenLabsService(apiKey);
  };

  // Calculate path for connections
  const getConnectionPath = (connection: Connection): string => {
    const sourceNode = nodes.find(n => n.id === connection.sourceId);
    const targetNode = nodes.find(n => n.id === connection.targetId);
    
    if (!sourceNode || !targetNode) return '';
    
    const sourcePos = getHandlePosition(sourceNode, connection.sourceHandle, false);
    const targetPos = getHandlePosition(targetNode, connection.targetHandle, true);
    
    const source = {
      x: sourceNode.position.x + sourcePos.x,
      y: sourceNode.position.y + sourcePos.y
    };
    
    const target = {
      x: targetNode.position.x + targetPos.x,
      y: targetNode.position.y + targetPos.y
    };
    
    // Calculate control points for a nicer curve
    const dx = Math.abs(target.x - source.x);
    const offsetX = dx * 0.3;
    
    const cp1x = source.x + (source.x < target.x ? offsetX : -offsetX);
    const cp1y = source.y;
    const cp2x = target.x + (source.x < target.x ? -offsetX : offsetX);
    const cp2y = target.y;
    
    return `M${source.x},${source.y} C${cp1x},${cp1y} ${cp2x},${cp2y} ${target.x},${target.y}`;
  };

  // Get the midpoint of a connection path for label positioning
  const getConnectionMidPoint = (connection: Connection): Position => {
    const sourceNode = nodes.find(n => n.id === connection.sourceId);
    const targetNode = nodes.find(n => n.id === connection.targetId);
    
    if (!sourceNode || !targetNode) return { x: 0, y: 0 };
    
    const sourcePos = getHandlePosition(sourceNode, connection.sourceHandle, false);
    const targetPos = getHandlePosition(targetNode, connection.targetHandle, true);
    
    const source = {
      x: sourceNode.position.x + sourcePos.x,
      y: sourceNode.position.y + sourcePos.y
    };
    
    const target = {
      x: targetNode.position.x + targetPos.x,
      y: targetNode.position.y + targetPos.y
    };
    
    // Calculate midpoint
    return {
      x: source.x + (target.x - source.x) / 2,
      y: source.y + (target.y - source.y) / 2
    };
  };

  // Get path for temporary connection line
  const getTempConnectionPath = (): string => {
    if (!connectionStart) return '';
    
    // Calculate control points for a nicer curve
    const dx = Math.abs(mousePosition.x - connectionStart.x);
    const offsetX = dx * 0.3;
    
    const cp1x = connectionStart.x + (connectionStart.x < mousePosition.x ? offsetX : -offsetX);
    const cp1y = connectionStart.y;
    const cp2x = mousePosition.x + (connectionStart.x < mousePosition.x ? -offsetX : offsetX);
    const cp2y = mousePosition.y;
    
    return `M${connectionStart.x},${connectionStart.y} C${cp1x},${cp1y} ${cp2x},${cp2y} ${mousePosition.x},${mousePosition.y}`;
  };

  // Render a node
  const renderNode = (node: Node) => {
    const nodeColor = nodeTypeColors[node.type] || 'gray';
    const borderColor = node.isSelected ? 'white' : nodeColor;
    
    return (
      <div
        key={node.id}
        className={`absolute rounded-lg shadow-lg overflow-visible cursor-move node-item
                   ${node.isSelected ? 'node-selected' : ''} node-${node.type}`}
        style={{
          left: node.position.x,
          top: node.position.y,
          width: node.width,
          height: node.height,
          backgroundColor: 'rgba(30, 30, 45, 0.95)',
          borderLeft: `4px solid ${nodeColor}`,
          zIndex: node.isSelected ? 50 : 40
        }}
        onClick={(e) => handleNodeClick(node.id, e)}
        onMouseDown={(e) => handleNodeDragStart(node.id, e)}
      >
        {/* Node header */}
        <div 
          className="flex items-center justify-between p-2"
          style={{ backgroundColor: `${nodeColor}50` }}
        >
          <div className="flex items-center">
            {nodeTypeIcons[node.type]}
            <span className="ml-2 font-medium text-white truncate">
              {node.data.name}
            </span>
          </div>
          <button 
            className="text-white/70 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteNode(node.id);
            }}
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Node content */}
        <div className="p-2 text-xs text-white/80">
          {node.type === 'governance' && (
            <>
              <div>Voting: {node.data.votingPeriod}</div>
              <div>Quorum: {node.data.quorum}</div>
            </>
          )}
          
          {node.type === 'token' && (
            <>
              <div>Symbol: {node.data.symbol}</div>
              <div>Supply: {node.data.supply}</div>
            </>
          )}

          {node.type === 'vesting' && (
            <>
              <div>Cliff: {node.data.cliffPeriod}</div>
              <div>Duration: {node.data.vestingDuration}</div>
            </>
          )}

          {node.type === 'delegation' && (
            <>
              <div>Partial: {node.data.canDelegatePartial ? 'Yes' : 'No'}</div>
              <div>Min Period: {node.data.minDelegationPeriod}</div>
            </>
          )}

          {node.type === 'treasury' && (
            <>
              <div>Address: {node.data.address?.substring(0, 8)}...</div>
              <div>Threshold: {node.data.withdrawalThreshold}</div>
            </>
          )}

          {node.type === 'ai' && (
            <>
              <div>Provider: {node.data.provider}</div>
              <div>Type: {node.data.integrationType}</div>
            </>
          )}
          
          {node.type === 'role' && (
            <div className="max-h-16 overflow-y-auto">
              {node.data.roles?.map((role: any, i: number) => (
                <div key={i} className="flex justify-between">
                  <span>{role.name}</span>
                  <span>{role.percentage}%</span>
                </div>
              ))}
            </div>
          )}
          
          {node.type === 'tokenomics' && (
            <div className="flex flex-col items-center">
              <TokenDistributionChart 
                distribution={node.data.distribution || []} 
                size={80} 
              />
            </div>
          )}
        </div>
        
        {/* Input handles */}
        {node.inputs.map((input, index) => {
          const position = getHandlePosition(node, input, true);
          return (
            <div
              key={`in-${input}`}
              className="absolute node-handle node-handle-input"
              style={{
                top: position.y
              }}
              onMouseUp={(e) => handleConnectorMouseUp(node.id, input, true, e)}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-full rounded-full animate-ping bg-blue-400 opacity-20"></div>
              <span className="absolute top-6 left-3 text-xs text-white opacity-70 whitespace-nowrap">{input}</span>
            </div>
          );
        })}
        
        {/* Output handles */}
        {node.outputs.map((output, index) => {
          const position = getHandlePosition(node, output, false);
          return (
            <div
              key={`out-${output}`}
              className="absolute node-handle node-handle-output"
              style={{
                top: position.y
              }}
              onMouseDown={(e) => handleConnectorMouseDown(node.id, output, false, e)}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-full rounded-full animate-ping bg-green-400 opacity-20"></div>
              <span className="absolute top-6 right-3 text-xs text-white opacity-70 whitespace-nowrap">{output}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Add node at a specific position (used by AI commands)
  const addNode = (type: string, position: { x: number, y: number }) => {
    const template = nodeTemplates.find(t => t.type === type);
    if (template) {
      const newNode: Node = {
        ...template,
        id: `${template.type}-${Date.now()}`,
        position,
        isSelected: false
      };
      
      setNodes(prev => [...prev, newNode]);
      
      // Auto-select the new node
      setSelectedNodeId(newNode.id);
    }
  };

  return (
    <div className="node-editor h-[800px] relative border border-[#1c1e2a] rounded-lg overflow-hidden">
      <div className="flex justify-between items-center mb-md">
        <h2 className="text-h3">Contract Builder</h2>
        <div className="flex gap-2">
          <button 
            className="btn-secondary flex items-center"
            onClick={() => setShowNodePalette(true)}
          >
            <Plus size={16} className="mr-1" />
            Add Node
          </button>
          <button 
            className="btn-primary flex items-center"
            onClick={handleDeploy}
          >
            <Rocket size={16} className="mr-1" />
            Deploy
          </button>
        </div>
      </div>
      
      <div 
        ref={canvasRef}
        className="node-editor-canvas border border-[#1c1e2a] rounded-lg h-[800px] relative resize-vertical overflow-auto"
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onClick={handleCanvasClick}
        style={{ minHeight: "400px", resize: "vertical" }}
      >
        {/* Connection line being drawn during drag */}
        {isConnecting && connectionStart && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            <defs>
              <marker
                id="arrowhead-temp"
                markerWidth="6"
                markerHeight="4"
                refX="6"
                refY="2"
                orient="auto"
              >
                <polygon points="0 0, 6 2, 0 4" fill="#10b981" />
              </marker>
            </defs>
            <path
              d={getTempConnectionPath()}
              stroke="#10b981"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5"
              className="connection-path"
              markerEnd="url(#arrowhead-temp)"
            />
          </svg>
        )}
        
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="4"
              refX="6"
              refY="2"
              orient="auto"
            >
              <polygon points="0 0, 6 2, 0 4" fill="white" />
            </marker>
          </defs>
          {connections.map(connection => {
            const connectionColor = connection.color || nodeTypeColors[nodes.find(n => n.id === connection.sourceId)?.type || 'governance'];
            const midPoint = getConnectionMidPoint(connection);
            
            return (
              <g key={connection.id}>
                <path
                  d={getConnectionPath(connection)}
                  stroke={connectionColor}
                  strokeWidth="2"
                  fill="none"
                  strokeOpacity="0.8"
                  className="connection-path"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnectionClick(connection.id);
                  }}
                  style={{ pointerEvents: 'all', cursor: 'pointer' }}
                  markerEnd="url(#arrowhead)"
                />
                
                {/* Show label if it exists */}
                {connection.label && (
                  <g transform={`translate(${midPoint.x}, ${midPoint.y})`}>
                    <rect
                      x="-40"
                      y="-10"
                      width="80"
                      height="20"
                      rx="4"
                      fill="rgba(30, 30, 45, 0.8)"
                      stroke={connectionColor}
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="10"
                    >
                      {connection.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Nodes */}
        {nodes.map(node => renderNode(node))}
        
        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
            <AlertTriangle size={32} className="mb-3" />
            <p>No nodes in the canvas</p>
            <button 
              className="mt-3 px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded-md"
              onClick={() => setShowNodePalette(true)}
            >
              Add Your First Node
            </button>
          </div>
        )}
      </div>
      
      {/* Node palette modal */}
      {showNodePalette && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-md">
          <div className="bg-neutral-dark rounded-lg w-full max-w-2xl">
            <div className="p-lg">
              <div className="flex justify-between items-center mb-lg">
                <h2 className="text-h3">Add Node</h2>
                <button 
                  className="text-neutral-light hover:text-white"
                  onClick={() => setShowNodePalette(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-md">
                {nodeTemplates.map((template, index) => (
                  <div 
                    key={index}
                    className="bg-neutral p-md rounded-lg border border-neutral-light/10 hover:border-primary cursor-pointer transition-colors"
                    onClick={() => addNodeFromTemplate(template)}
                  >
                    <div className="flex items-center mb-sm">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                        style={{ backgroundColor: `${nodeTypeColors[template.type]}30` }}
                      >
                        {nodeTypeIcons[template.type]}
                      </div>
                      <h3 className="text-h4">{template.data.name}</h3>
                    </div>
                    <p className="text-sm text-neutral-light">
                      {template.type === 'governance' && 'Define governance rules and voting parameters'}
                      {template.type === 'token' && 'Configure the DAO token and its properties'}
                      {template.type === 'vesting' && 'Set up token vesting schedules'}
                      {template.type === 'delegation' && 'Configure voting delegation rules'}
                      {template.type === 'role' && 'Define member roles and permissions'}
                      {template.type === 'tokenomics' && 'Visualize token distribution'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Node editor modal */}
      {showNodeEditor && editingNode && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-md">
          <div className="bg-neutral-dark rounded-lg w-full max-w-2xl">
            <div className="p-lg">
              <div className="flex justify-between items-center mb-lg">
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                    style={{ backgroundColor: `${nodeTypeColors[editingNode.type]}30` }}
                  >
                    {nodeTypeIcons[editingNode.type]}
                  </div>
                  <h2 className="text-h3">Edit {editingNode.data.name}</h2>
                </div>
                <button 
                  className="text-neutral-light hover:text-white"
                  onClick={() => {
                    setShowNodeEditor(false);
                    setEditingNode(null);
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-lg">
                {/* Common fields for all node types */}
                <div className="mb-md">
                  <label className="block text-white mb-xs">Node Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2" 
                    defaultValue={editingNode.data.name}
                  />
                </div>

                {editingNode.type === 'governance' && (
                  <div className="space-y-md">
                    <div>
                      <label className="block text-white mb-xs">Voting Period</label>
                      <select 
                        className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2"
                        defaultValue={editingNode.data.votingPeriod}
                      >
                        <option value="1 day">1 day</option>
                        <option value="3 days">3 days</option>
                        <option value="7 days">7 days</option>
                        <option value="14 days">14 days</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white mb-xs">Quorum</label>
                      <select 
                        className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2"
                        defaultValue={editingNode.data.quorum}
                      >
                        <option value="5%">5%</option>
                        <option value="10%">10%</option>
                        <option value="20%">20%</option>
                        <option value="33%">33%</option>
                        <option value="51%">51%</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white mb-xs">Proposal Threshold</label>
                      <select 
                        className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2"
                        defaultValue={editingNode.data.proposalThreshold}
                      >
                        <option value="0.1%">0.1%</option>
                        <option value="1%">1%</option>
                        <option value="5%">5%</option>
                        <option value="10%">10%</option>
                      </select>
                    </div>
                  </div>
                )}
                
                {editingNode.type === 'token' && (
                  <div className="space-y-md">
                    <div>
                      <label className="block text-white mb-xs">Token Symbol</label>
                      <input 
                        type="text" 
                        className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2" 
                        defaultValue={editingNode.data.symbol}
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-xs">Decimals</label>
                      <input 
                        type="number" 
                        className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2" 
                        defaultValue={editingNode.data.decimals || "18"}
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-xs">Total Supply</label>
                      <input 
                        type="text" 
                        className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2" 
                        defaultValue={editingNode.data.supply}
                      />
                    </div>
                  </div>
                )}

                {editingNode.type === 'vesting' && (
                  <div className="space-y-md">
                    <div>
                      <label className="block text-white mb-xs">Cliff Period</label>
                      <select 
                        className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2"
                        defaultValue={editingNode.data.cliffPeriod || "6 months"}
                      >
                        <option value="3 months">3 months</option>
                        <option value="6 months">6 months</option>
                        <option value="1 year">1 year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white mb-xs">Vesting Duration</label>
                      <select 
                        className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2"
                        defaultValue={editingNode.data.vestingDuration || "2 years"}
                      >
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                        <option value="3 years">3 years</option>
                        <option value="4 years">4 years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white mb-xs">Release Interval</label>
                      <select 
                        className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2"
                        defaultValue={editingNode.data.releaseInterval || "Monthly"}
                      >
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                      </select>
                    </div>
                  </div>
                )}

                {editingNode.type === 'delegation' && (
                  <div className="space-y-md">
                    <div className="flex items-center mb-2">
                      <input 
                        type="checkbox" 
                        id="delegatePartial" 
                        className="mr-2" 
                        defaultChecked={editingNode.data.canDelegatePartial}
                      />
                      <label htmlFor="delegatePartial" className="text-white">Allow Partial Delegation</label>
                    </div>
                    <div>
                      <label className="block text-white mb-xs">Minimum Delegation Period</label>
                      <select 
                        className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2"
                        defaultValue={editingNode.data.minDelegationPeriod || "1 week"}
                      >
                        <option value="1 day">1 day</option>
                        <option value="1 week">1 week</option>
                        <option value="1 month">1 month</option>
                      </select>
                    </div>
                  </div>
                )}

                {editingNode.type === 'treasury' && (
                  <div className="space-y-md">
                    <div>
                      <label className="block text-white mb-xs">Treasury Address</label>
                      <input 
                        type="text" 
                        className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2" 
                        defaultValue={editingNode.data.address || "0x..."}
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-xs">Threshold for Withdrawal</label>
                      <select 
                        className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2"
                        defaultValue={editingNode.data.withdrawalThreshold || "3 signers"}
                      >
                        <option value="2 signers">2 signers</option>
                        <option value="3 signers">3 signers</option>
                        <option value="5 signers">5 signers</option>
                      </select>
                    </div>
                  </div>
                )}

                {editingNode.type === 'ai' && (
                  <div className="space-y-md">
                    <div>
                      <label className="block text-white mb-xs">AI Provider</label>
                      <select 
                        className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2"
                        defaultValue={editingNode.data.provider || "OpenAI"}
                      >
                        <option value="OpenAI">OpenAI</option>
                        <option value="Claude">Claude</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white mb-xs">Integration Type</label>
                      <select 
                        className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2"
                        defaultValue={editingNode.data.integrationType || "Proposal Analysis"}
                      >
                        <option value="Proposal Analysis">Proposal Analysis</option>
                        <option value="Treasury Management">Treasury Management</option>
                        <option value="Voting Recommendations">Voting Recommendations</option>
                      </select>
                    </div>
                  </div>
                )}
                
                {editingNode.type === 'role' && (
                  <div>
                    <label className="block text-white mb-sm">Roles & Distribution</label>
                    <div className="space-y-md">
                      {editingNode.data.roles?.map((role: any, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input 
                            type="text" 
                            className="flex-1 bg-neutral-dark border border-neutral-light/30 rounded-lg p-2" 
                            defaultValue={role.name}
                          />
                          <input 
                            type="number" 
                            className="w-20 bg-neutral-dark border border-neutral-light/30 rounded-lg p-2" 
                            defaultValue={role.percentage}
                          />
                          <span className="text-white">%</span>
                        </div>
                      ))}
                      <button className="btn-secondary w-full flex items-center justify-center">
                        <Plus size={16} className="mr-1" />
                        Add Role
                      </button>
                    </div>
                  </div>
                )}
                
                {editingNode.type === 'tokenomics' && (
                  <div>
                    <label className="block text-white mb-sm">Token Distribution</label>
                    <div className="grid grid-cols-2 gap-md mb-md">
                      <div className="flex flex-col space-y-md">
                        {editingNode.data.distribution?.map((item: any, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input 
                              type="text" 
                              className="flex-1 bg-neutral-dark border border-neutral-light/30 rounded-lg p-2" 
                              defaultValue={item.category}
                            />
                            <input 
                              type="number" 
                              className="w-20 bg-neutral-dark border border-neutral-light/30 rounded-lg p-2" 
                              defaultValue={item.percentage}
                            />
                            <span className="text-white">%</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-neutral rounded-lg flex items-center justify-center p-3">
                        <TokenDistributionChart distribution={editingNode.data.distribution || []} />
                      </div>
                    </div>
                    <button className="btn-secondary w-full flex items-center justify-center">
                      <Plus size={16} className="mr-1" />
                      Add Category
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-md">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setShowNodeEditor(false);
                    setEditingNode(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => handleNodeUpdate(editingNode.data)}
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Connection editor modal */}
      {showConnectionEditor && editingConnection && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-md">
          <div className="bg-neutral-dark rounded-lg w-full max-w-md">
            <div className="p-lg">
              <div className="flex justify-between items-center mb-lg">
                <h2 className="text-h3">Edit Connection</h2>
                <button 
                  className="text-neutral-light hover:text-white"
                  onClick={() => {
                    setShowConnectionEditor(false);
                    setEditingConnection(null);
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-lg space-y-md">
                <div>
                  <label className="block text-white mb-xs">Label</label>
                  <input 
                    type="text" 
                    className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2" 
                    defaultValue={editingConnection.label || ''}
                    placeholder="Optional label for connection"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-xs">Connection Type</label>
                  <select 
                    className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2"
                    defaultValue={editingConnection.animated ? 'animated' : 'static'}
                  >
                    <option value="static">Static</option>
                    <option value="animated">Animated Flow</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white mb-xs">Color</label>
                  <div className="grid grid-cols-4 gap-2 mt-1">
                    {Object.values(nodeTypeColors).map((color, index) => (
                      <div 
                        key={index}
                        className={`w-8 h-8 rounded-full cursor-pointer ${
                          editingConnection.color === color ? 'ring-2 ring-white' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setEditingConnection(prev => 
                          prev ? { ...prev, color } : null
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button 
                  className="btn-danger flex items-center"
                  onClick={() => {
                    handleDeleteConnection(editingConnection.id);
                    setShowConnectionEditor(false);
                    setEditingConnection(null);
                  }}
                >
                  Delete
                </button>
                
                <div className="flex gap-md">
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setShowConnectionEditor(false);
                      setEditingConnection(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      const animatedValue = document.querySelector('select')?.value === 'animated';
                      const labelValue = (document.querySelector('input[type="text"]') as HTMLInputElement)?.value;
                      
                      handleConnectionUpdate({ 
                        animated: animatedValue,
                        label: labelValue || undefined
                      });
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice configuration modal */}
      {showVoiceConfig && (
        <ElevenLabsConfig
          onClose={() => setShowVoiceConfig(false)}
          onSave={handleSaveVoiceConfig}
          apiKey={elevenLabsApiKey}
          selectedVoiceId={selectedVoiceId}
        />
      )}
    </div>
  );
};

export default NodeEditor; 