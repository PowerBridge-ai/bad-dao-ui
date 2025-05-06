import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  addEdge,
  NodeTypes,
  Edge,
  Connection,
  Node
} from 'reactflow';
import 'reactflow/dist/style.css';
import TokenNode from './nodes/TokenNode';
import './NodeEditor.css';

// Node types for the flow chart
const nodeTypes: NodeTypes = {
  tokenNode: TokenNode
};

// Initial nodes - just one empty token node
const initialNodes = [
  {
    id: 'token-1',
    type: 'tokenNode',
    position: { x: 150, y: 150 },
    data: { 
      name: 'DAO Token',
      symbol: 'DAO',
      decimals: '18',
      supply: ''
    }
  }
];

// No initial edges/connections
const initialEdges: Edge[] = [];

// Props interface
interface NodeEditorProps {
  onSave?: (nodes: any[], edges: any[]) => void;
}

// Handle interface
interface NodeEditorHandle {
  addNodeToCanvas: (nodeData: any) => string;
  clearCanvas: () => void;
  getCanvas: () => { nodes: any[], edges: any[] };
}

const NodeEditor = forwardRef<NodeEditorHandle, NodeEditorProps>(({ onSave }, ref) => {
  // State for the nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Reference to the wrapper div
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // Add state for dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Add state for the selected node and the property modal
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showNodeProperties, setShowNodeProperties] = useState(false);
  
  // Update dimensions on mount and window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (reactFlowWrapper.current) {
        const { width, height } = reactFlowWrapper.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    
    // Set dimensions on mount
    updateDimensions();
    
    // Add window resize listener
    window.addEventListener('resize', updateDimensions);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Handle connections between nodes
  const onConnect = (params: Connection) => {
    console.log('Creating connection from', params);
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  };
  
  // Handle node double-click
  const onNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
    console.log('Node double-clicked:', node);
    setSelectedNode(node);
    setShowNodeProperties(true);
  };
  
  // Handle node click
  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
    // You could also handle single clicks differently here
  };
  
  // Handle closing the node properties modal
  const closeNodeProperties = () => {
    setShowNodeProperties(false);
    setSelectedNode(null);
  };
  
  // Handle saving changes to the node properties
  const saveNodeProperties = (updatedData: any) => {
    if (selectedNode) {
      // Update the node data
      setNodes(nodes.map(node => 
        node.id === selectedNode.id 
          ? { ...node, data: { ...node.data, ...updatedData } }
          : node
      ));
      
      // Close the modal
      closeNodeProperties();
    }
  };
  
  // Add a node to the canvas
  const addNodeToCanvas = (nodeData: any) => {
    // Get node type from data or default to token
    const nodeType = nodeData.type === 'token' ? 'tokenNode' : nodeData.type;
    
    // Create position for new node - slightly offset from existing nodes
    const position = {
      x: 150 + nodes.length * 20,
      y: 150 + nodes.length * 20
    };
    
    // Create the node
    const newNode = {
      id: `${nodeData.type}-${Date.now()}`,
      type: nodeType,
      position,
      data: { 
        name: nodeData.name || 'New Token',
        symbol: nodeData.symbol || 'TKN',
        decimals: nodeData.decimals || '18',
        supply: nodeData.supply || '1000000',
        ...nodeData.configuration
      }
    };
    
    // Add to state
    setNodes(nds => [...nds, newNode]);
    
    // Return the ID
    return newNode.id;
  };
  
  // Clear the canvas
  const clearCanvas = () => {
    setNodes(initialNodes);
    setEdges([]);
  };
  
  // Get the current state of the canvas
  const getCanvas = () => {
    return { nodes, edges };
  };
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    addNodeToCanvas,
    clearCanvas,
    getCanvas
  }));
  
  // Run a delayed fit view to ensure nodes are properly positioned
  useEffect(() => {
    const timer = setTimeout(() => {
      const reactFlowInstance = document.querySelector('.react-flow__renderer');
      if (reactFlowInstance) {
        // Force a repaint to ensure nodes are visible
        reactFlowInstance.setAttribute('style', 'transform: scale(1);');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="node-editor" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div 
        ref={reactFlowWrapper} 
        className="node-editor-canvas" 
        style={{ 
          width: '100%', 
          height: '100%', 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          zIndex: 1
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          nodeTypes={nodeTypes}
          style={{ width: '100%', height: '100%' }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Controls position="bottom-right" />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
      
      {/* Node Properties Modal */}
      {showNodeProperties && selectedNode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-dark rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-neutral-light/10">
              <h2 className="text-xl font-semibold text-white">
                {selectedNode.data.name || 'Node'} Properties
              </h2>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-light mb-1">Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-neutral-dark border border-neutral-light/20 rounded-md p-2 text-white"
                    defaultValue={selectedNode.data.name || ''}
                    id="node-name-input"
                  />
                </div>
                
                {selectedNode.type === 'tokenNode' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-neutral-light mb-1">Symbol</label>
                      <input 
                        type="text" 
                        className="w-full bg-neutral-dark border border-neutral-light/20 rounded-md p-2 text-white"
                        defaultValue={selectedNode.data.symbol || ''}
                        id="node-symbol-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-light mb-1">Decimals</label>
                      <input 
                        type="number" 
                        className="w-full bg-neutral-dark border border-neutral-light/20 rounded-md p-2 text-white"
                        defaultValue={selectedNode.data.decimals || '18'}
                        id="node-decimals-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-light mb-1">Supply</label>
                      <input 
                        type="text" 
                        className="w-full bg-neutral-dark border border-neutral-light/20 rounded-md p-2 text-white"
                        defaultValue={selectedNode.data.supply || ''}
                        id="node-supply-input"
                      />
                    </div>
                  </>
                )}
                
                {/* Add other node type specific fields here */}
              </div>
            </div>
            
            <div className="p-4 border-t border-neutral-light/10 flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-neutral hover:bg-neutral-light/20 text-white rounded-md"
                onClick={closeNodeProperties}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-primary hover:bg-primary-light text-black rounded-md"
                onClick={() => {
                  // Get all the values from the inputs
                  const nameInput = document.getElementById('node-name-input') as HTMLInputElement;
                  const updatedData: any = { name: nameInput.value };
                  
                  // Add token specific fields if it's a token node
                  if (selectedNode.type === 'tokenNode') {
                    const symbolInput = document.getElementById('node-symbol-input') as HTMLInputElement;
                    const decimalsInput = document.getElementById('node-decimals-input') as HTMLInputElement;
                    const supplyInput = document.getElementById('node-supply-input') as HTMLInputElement;
                    
                    updatedData.symbol = symbolInput.value;
                    updatedData.decimals = decimalsInput.value;
                    updatedData.supply = supplyInput.value;
                  }
                  
                  // Save the changes
                  saveNodeProperties(updatedData);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

NodeEditor.displayName = 'NodeEditor';

export default NodeEditor; 