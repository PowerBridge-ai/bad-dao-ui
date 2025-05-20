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
import GovernorNode from './nodes/GovernorNode';
import TreasuryNode from './nodes/TreasuryNode';
import TimelockNode from './nodes/TimelockNode';
import AiNode from './nodes/AiNode';
import VestingNode from './nodes/VestingNode';
import DelegationNode from './nodes/DelegationNode';
import './NodeEditor.css';
import { Plus } from 'lucide-react';

// Node types for the flow chart
const nodeTypes: NodeTypes = {
  tokenNode: TokenNode,
  governorNode: GovernorNode,
  treasuryNode: TreasuryNode,
  timelockNode: TimelockNode,
  aiNode: AiNode,
  vestingNode: VestingNode,
  delegationNode: DelegationNode
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
  removeNodeFromCanvas: (nodeId: string) => void;
  connectNodes: (sourceId: string, targetId: string) => void;
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
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  
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
    // Get node type from data
    let nodeType;
    switch(nodeData.type) {
      case 'token':
        nodeType = 'tokenNode';
        break;
      case 'governor':
        nodeType = 'governorNode';
        break;
      case 'treasury':
        nodeType = 'treasuryNode';
        break;
      case 'timelock':
        nodeType = 'timelockNode';
        break;
      case 'ai':
        nodeType = 'aiNode';
        break;
      case 'vesting':
        nodeType = 'vestingNode';
        break;
      case 'delegation':
        nodeType = 'delegationNode';
        break;
      default:
        nodeType = 'tokenNode';
    }
    
    // Create position for new node - slightly offset from existing nodes
    const position = {
      x: 150 + nodes.length * 20,
      y: 150 + nodes.length * 20
    };
    
    // Default data based on node type
    const defaultData = getDefaultDataForNodeType(nodeData.type, nodeData.name);
    
    // Create the node
    const newNode = {
      id: `${nodeData.type || 'token'}-${Date.now()}`,
      type: nodeType,
      position,
      data: { 
        ...defaultData,
        ...nodeData.configuration
      }
    };
    
    // Add to state
    setNodes(nds => [...nds, newNode]);
    
    // Return the ID
    return newNode.id;
  };

  // Helper to get default data for a node type
  const getDefaultDataForNodeType = (type: string, name: string) => {
    switch(type) {
      case 'token':
        return {
          name: name || 'New Token',
          symbol: name ? name.substring(0, 4).toUpperCase() : 'TKN',
          decimals: '18',
          supply: '1000000'
        };
      case 'governor':
        return {
          name: name || 'Governance',
          votingPeriod: '3 days',
          quorum: '20%',
          proposalThreshold: '1%'
        };
      case 'treasury':
        return {
          name: name || 'Treasury',
          multiSig: true,
          threshold: 3
        };
      case 'timelock':
        return {
          name: name || 'Timelock',
          delay: '24 hours'
        };
      case 'ai':
        return {
          name: name || 'AI Integration',
          model: 'GPT-4',
          purpose: 'Voting analysis'
        };
      case 'vesting':
        return {
          name: name || 'Vesting',
          period: '12 months',
          cliff: '3 months'
        };
      case 'delegation':
        return {
          name: name || 'Delegation',
          minDelegation: '1000',
          maxDelegates: '10'
        };
      default:
        return {
          name: name || 'New Node'
        };
    }
  };

  // Remove a node from the canvas
  const removeNodeFromCanvas = (nodeId: string) => {
    // Remove the node
    setNodes(nodes.filter(node => node.id !== nodeId));
    
    // Remove any edges connected to this node
    setEdges(edges.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
  };

  // Connect two nodes
  const connectNodes = (sourceId: string, targetId: string) => {
    const newEdge = {
      id: `e-${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      animated: true
    };
    
    setEdges(eds => [...eds, newEdge]);
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
    getCanvas,
    removeNodeFromCanvas,
    connectNodes
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

  // Handle "Add Node" button click
  const handleAddNodeClick = () => {
    setShowAddNodeModal(true);
  };

  // Handle closing the add node modal
  const closeAddNodeModal = () => {
    setShowAddNodeModal(false);
  };

  // Handle adding a new node from the modal
  const handleAddNewNode = () => {
    const nameInput = document.getElementById('new-node-name-input') as HTMLInputElement;
    const typeInput = document.getElementById('new-node-type-input') as HTMLSelectElement;
    
    if (nameInput && typeInput) {
      const nodeData = {
        name: nameInput.value || 'New Node',
        type: typeInput.value || 'token'
      };
      
      addNodeToCanvas(nodeData);
      closeAddNodeModal();
    }
  };

  // Generate form fields based on selected node type
  const renderNodePropertyFields = () => {
    if (!selectedNode) return null;

    const nodeType = selectedNode.type;
    const commonFields = (
      <div>
        <label className="block text-sm font-medium text-neutral-light mb-1">Name</label>
        <input 
          type="text" 
          className="w-full bg-neutral-dark border border-neutral-light/20 rounded-md p-2 text-white"
          defaultValue={selectedNode.data.name || ''}
          id="node-name-input"
        />
      </div>
    );

    // Return different fields based on node type
    switch(nodeType) {
      case 'tokenNode':
        return (
          <>
            {commonFields}
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
        );
      case 'governorNode':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-sm font-medium text-neutral-light mb-1">Voting Period</label>
              <input 
                type="text" 
                className="w-full bg-neutral-dark border border-neutral-light/20 rounded-md p-2 text-white"
                defaultValue={selectedNode.data.votingPeriod || '3 days'}
                id="node-votingPeriod-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-light mb-1">Quorum</label>
              <input 
                type="text" 
                className="w-full bg-neutral-dark border border-neutral-light/20 rounded-md p-2 text-white"
                defaultValue={selectedNode.data.quorum || '20%'}
                id="node-quorum-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-light mb-1">Proposal Threshold</label>
              <input 
                type="text" 
                className="w-full bg-neutral-dark border border-neutral-light/20 rounded-md p-2 text-white"
                defaultValue={selectedNode.data.proposalThreshold || '1%'}
                id="node-proposalThreshold-input"
              />
            </div>
          </>
        );
      case 'treasuryNode':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-sm font-medium text-neutral-light mb-1">MultiSig</label>
              <select
                className="w-full bg-neutral-dark border border-neutral-light/20 rounded-md p-2 text-white"
                defaultValue={selectedNode.data.multiSig ? 'true' : 'false'}
                id="node-multiSig-input"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-light mb-1">Threshold</label>
              <input 
                type="number" 
                className="w-full bg-neutral-dark border border-neutral-light/20 rounded-md p-2 text-white"
                defaultValue={selectedNode.data.threshold || '1'}
                id="node-threshold-input"
              />
            </div>
          </>
        );
      // Add other node types as needed
      default:
        return commonFields;
    }
  };
  
  // Handle saving node properties based on node type
  const handleSaveNodeProperties = () => {
    if (!selectedNode) return;
    
    // Get basic data
    const nameInput = document.getElementById('node-name-input') as HTMLInputElement;
    const updatedData: any = { name: nameInput.value };
    
    // Add type-specific fields
    switch (selectedNode.type) {
      case 'tokenNode':
        const symbolInput = document.getElementById('node-symbol-input') as HTMLInputElement;
        const decimalsInput = document.getElementById('node-decimals-input') as HTMLInputElement;
        const supplyInput = document.getElementById('node-supply-input') as HTMLInputElement;
        
        updatedData.symbol = symbolInput.value;
        updatedData.decimals = decimalsInput.value;
        updatedData.supply = supplyInput.value;
        break;
      case 'governorNode':
        const votingPeriodInput = document.getElementById('node-votingPeriod-input') as HTMLInputElement;
        const quorumInput = document.getElementById('node-quorum-input') as HTMLInputElement;
        const proposalThresholdInput = document.getElementById('node-proposalThreshold-input') as HTMLInputElement;
        
        updatedData.votingPeriod = votingPeriodInput.value;
        updatedData.quorum = quorumInput.value;
        updatedData.proposalThreshold = proposalThresholdInput.value;
        break;
      case 'treasuryNode':
        const multiSigInput = document.getElementById('node-multiSig-input') as HTMLSelectElement;
        const thresholdInput = document.getElementById('node-threshold-input') as HTMLInputElement;
        
        updatedData.multiSig = multiSigInput.value === 'true';
        updatedData.threshold = thresholdInput.value;
        break;
      // Add other node types as needed
    }
    
    // Save the changes
    saveNodeProperties(updatedData);
  };
  
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

      {/* Add Node Button - Improved Floating Action Button */}
      <button
        className="absolute top-4 right-4 bg-primary hover:bg-primary-light text-black font-medium rounded-full p-3 flex items-center justify-center z-10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        onClick={handleAddNodeClick}
        title="Add Node"
      >
        <Plus size={24} className="mr-1" />
        <span className="ml-1">Add Node</span>
      </button>
      
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
                {renderNodePropertyFields()}
              </div>
            </div>
            
            <div className="p-4 border-t border-neutral-light/10 flex justify-between space-x-2">
              <button 
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                onClick={() => {
                  if (selectedNode) {
                    removeNodeFromCanvas(selectedNode.id);
                    closeNodeProperties();
                  }
                }}
              >
                Delete
              </button>
              <div className="flex space-x-2">
                <button 
                  className="px-4 py-2 bg-neutral hover:bg-neutral-light/20 text-white rounded-md"
                  onClick={closeNodeProperties}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-primary hover:bg-primary-light text-black rounded-md"
                  onClick={handleSaveNodeProperties}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Node Modal */}
      {showAddNodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-dark rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-neutral-light/10">
              <h2 className="text-xl font-semibold text-white">
                Add New Node
              </h2>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-light mb-1">Node Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-neutral-dark border border-neutral-light/20 rounded-md p-2 text-white"
                    id="new-node-name-input"
                    placeholder="Enter node name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-light mb-1">Node Type</label>
                  <select 
                    className="w-full bg-neutral-dark border border-neutral-light/20 rounded-md p-2 text-white"
                    id="new-node-type-input"
                  >
                    <option value="token">Token</option>
                    <option value="governor">Governor</option>
                    <option value="timelock">Timelock</option>
                    <option value="treasury">Treasury</option>
                    <option value="ai">AI Integration</option>
                    <option value="vesting">Vesting</option>
                    <option value="delegation">Delegation</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-neutral-light/10 flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-neutral hover:bg-neutral-light/20 text-white rounded-md"
                onClick={closeAddNodeModal}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-primary hover:bg-primary-light text-black rounded-md"
                onClick={handleAddNewNode}
              >
                Add
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