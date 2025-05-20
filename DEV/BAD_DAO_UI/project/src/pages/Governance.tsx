import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Wallet, 
  Coins, 
  Clock, 
  Users, 
  Bot, 
  PlusCircle,
  GripHorizontal,
  Settings,
  X,
  FileCode,
  Volume2,
  Mic,
  ArrowRight,
  CheckCircle,
  Circle,
  Command
} from 'lucide-react';
import NodeEditor from '../components/governance/NodeEditor';
import GovernanceWizard from '../components/governance/GovernanceWizard';
import elevenlabsService from '../services/elevenlabsService';
import ChatInterface from '../components/governance/ChatInterface';
import { createLogger } from '../utils/logger';

// Define the ChatMessage interface to match the one in GovernanceWizard
interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  content: string;
  isPlaying?: boolean;
}

// Define contract types
type ContractType = 'governance' | 'token' | 'vesting' | 'delegation' | 'ai' | 'treasury';
// Define DAO types
type DAOType = 'standard' | 'project' | 'corporate';

interface ContractTemplate {
  id: string;
  name: string;
  type: ContractType;
  description: string;
  icon: React.ReactNode;
}

interface ActiveContract {
  id: string;
  templateId: string;
  name: string;
  type: ContractType;
  description: string;
  deployedAddress?: string;
  isDeployed: boolean;
  configuration: Record<string, any>;
}

interface GovernanceProps {
  // ... existing code ...
}

// Create a component-specific logger
const logger = createLogger('GOVERNANCE');

const Governance: React.FC<GovernanceProps> = () => {
  // Log component initialization
  logger.debug('🏗️', 'Governance component initializing');
  
  const navigate = useNavigate();
  const { daoId } = useParams<{ daoId: string }>();
  const [isAddingContract, setIsAddingContract] = useState(false);
  const [activeContracts, setActiveContracts] = useState<ActiveContract[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showGettingStartedWizard, setShowGettingStartedWizard] = useState(false);
  
  // Add DAO type state
  const [daoType, setDaoType] = useState<DAOType>('standard');
  
  // Store wizard data for code generation
  const [wizardData, setWizardData] = useState<Record<string, any>>({});

  // Store chat messages from the wizard
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // New state to control the integrated wizard mode
  const [wizardMode, setWizardMode] = useState<'hidden' | 'sidebar' | 'fullscreen'>('hidden');

  // Add voice workflow states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [userResponse, setUserResponse] = useState<string>('');
  const [currentPlayingMessageId, setCurrentPlayingMessageId] = useState<string | null>(null);
  
  // Speech recognition reference
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Additional state for showing node creation feedback
  const [createdNodes, setCreatedNodes] = useState<Record<string, boolean>>({});
  const [nodeCreationFeedback, setNodeCreationFeedback] = useState<string | null>(null);
  
  // Add missing currentWorkflowStep state
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState<string>('');

  // Add a state variable to control the node help visibility
  const [showNodeHelp, setShowNodeHelp] = useState<boolean>(false);

  // Contract templates for the add contract modal
  const contractTemplates: ContractTemplate[] = [
    {
      id: 'gov-template-1',
      name: 'Governance Contract',
      type: 'governance',
      description: 'Core governance contract for proposal creation, voting, and execution',
      icon: <Shield size={24} className="text-primary" />
    },
    {
      id: 'token-template-1',
      name: 'Token Contract',
      type: 'token',
      description: 'ERC-20 token contract for governance and utility',
      icon: <Coins size={24} className="text-primary" />
    },
    {
      id: 'vesting-template-1',
      name: 'Vesting Contract',
      type: 'vesting',
      description: 'Token vesting mechanism with customizable schedules',
      icon: <Clock size={24} className="text-primary" />
    },
    {
      id: 'delegation-template-1',
      name: 'Delegation Contract',
      type: 'delegation',
      description: 'Allow token holders to delegate voting power',
      icon: <Users size={24} className="text-primary" />
    },
    {
      id: 'treasury-template-1',
      name: 'Treasury Contract',
      type: 'treasury',
      description: 'Manage DAO funds and distribute to approved proposals',
      icon: <Wallet size={24} className="text-primary" />
    },
    {
      id: 'ai-template-1',
      name: 'AI Integration',
      type: 'ai',
      description: 'Smart contract oracle with AI-powered voting recommendations',
      icon: <Bot size={24} className="text-primary" />
    },
  ];

  // Add a ref for the NodeEditor
  const nodeEditorRef = useRef<any>(null);

  // Add these state variables to manage UI indicators properly
  const [showListeningIndicator, setShowListeningIndicator] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');

  // Replace the code preview modal code with React state approach
  const [showCodePreview, setShowCodePreview] = useState<boolean>(false);

  // Add state for the ElevenLabs settings modal
  const [showElevenLabsSettings, setShowElevenLabsSettings] = useState<boolean>(false);
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState<string>(localStorage.getItem('elevenlabsApiKey') || '');
  const [elevenlabsVoiceId, setElevenlabsVoiceId] = useState<string>(localStorage.getItem('elevenlabsVoiceId') || '');
  const [isTestingVoice, setIsTestingVoice] = useState<boolean>(false);
  const [voices, setVoices] = useState<any[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState<boolean>(false);

  useEffect(() => {
    // Fetch active contracts
    logger.info('🔄', 'Fetching contracts for DAO', { daoId });
    fetchContracts();
  }, [daoId]);

  useEffect(() => {
    // Listen for URL changes to determine if we should show the wizard
    logger.debug('🧭', 'Checking URL for wizard path');
    if (window.location.pathname.includes('/wizard')) {
      logger.info('🧙', 'Showing wizard sidebar based on URL path');
      setWizardMode('sidebar');
    }
  }, [window.location.pathname]);

  const fetchContracts = async () => {
    try {
      logger.timeStart('Fetch Contracts');
      // Mock data - in a real app, this would be fetched from your API
      logger.debug('🔍', 'Using mock contract data');
      const mockContracts: ActiveContract[] = [
        {
          id: 'contract-1',
          templateId: 'gov-template-1',
          name: 'Main Governance',
          type: 'governance',
          description: 'Primary governance contract for the DAO',
          deployedAddress: '0x1234...5678',
          isDeployed: true,
          configuration: {
            votingPeriod: '3 days',
            quorum: '20%',
            proposalThreshold: '1%',
            executionDelay: '24 hours'
          }
        }
      ];
      
      setActiveContracts(mockContracts);
      logger.success('✅', 'Contracts loaded successfully', { count: mockContracts.length });
      logger.timeEnd('Fetch Contracts');
    } catch (error) {
      logger.error('❌', 'Error fetching contracts:', error);
      // Handle error state
    }
  };

  const handleAddContract = (type: ContractType) => {
    // Implementation would add a contract to active contracts
    logger.info('📝', 'Adding contract of type:', type);
    setIsAddingContract(false);
  };

  const handleRemoveContract = (contractId: string) => {
    // Implementation would remove a contract
    logger.info('🗑️', 'Removing contract:', contractId);
    setActiveContracts(prev => prev.filter(c => c.id !== contractId));
  };

  const handleEditContract = (contractId: string) => {
    // Implementation would open the contract editor
    logger.info('✏️', 'Editing contract:', contractId);
  };

  const handleDeployContract = (contractId: string) => {
    // Implementation would deploy a contract
    logger.info('🚀', 'Deploying contract:', contractId);
    logger.debug('🔍', 'Contract deployment flow starting');
    
    // Update the contract to show it's deployed
    setActiveContracts(prev => {
      const updated = prev.map(c => 
        c.id === contractId 
          ? { ...c, deployedAddress: '0x' + Math.random().toString(16).substring(2, 14) } 
          : c
      );
      logger.success('✅', 'Contract marked as deployed', { contractId });
      return updated;
    });
  };

  const handleDragStart = (contractId: string) => {
    setDraggedItem(contractId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem !== targetId) {
      const draggedIndex = activeContracts.findIndex(c => c.id === draggedItem);
      const targetIndex = activeContracts.findIndex(c => c.id === targetId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newContracts = [...activeContracts];
        const [draggedContract] = newContracts.splice(draggedIndex, 1);
        newContracts.splice(targetIndex, 0, draggedContract);
        
        setActiveContracts(newContracts);
      }
    }
    
    setDraggedItem(null);
  };

  // Setup speech recognition
  useEffect(() => {
    // Initialize Web Speech API if available
    logger.debug('🎤', 'Setting up speech recognition');
    if ('webkitSpeechRecognition' in window) {
      // Use type assertion for the SpeechRecognition constructor
      const SpeechRecognition = window.webkitSpeechRecognition as any;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        // Don't process results if AI is currently speaking
        if (isPlaying) {
          logger.debug('🎤', 'Ignoring speech result while AI is speaking');
          return;
        }
        
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        logger.voice('👂', 'Speech recognition result', { transcript });
        
        // Update the userResponse state and the speech transcript for display
        setUserResponse(transcript);
        setSpeechTranscript(transcript);
        
        // Reset the silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        
        // Set a new silence timer to automatically submit after pause
        silenceTimerRef.current = setTimeout(() => {
          if (isRecording && transcript.trim() !== '') {
            logger.voice('⏱️', 'Silence timer triggered, processing speech input');
            stopRecording();
            processUserResponse(transcript);
          }
        }, 2000);
      };
      
      recognitionRef.current.onend = () => {
        logger.voice('🛑', 'Speech recognition ended');
        setIsRecording(false);
        setShowListeningIndicator(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        logger.error('❌', 'Speech recognition error', event.error);
        setIsRecording(false);
        setShowListeningIndicator(false);
      };
    } else {
      logger.warn('⚠️', 'Speech recognition not supported in this browser');
    }
    
    return () => {
      logger.debug('🧹', 'Cleaning up speech recognition');
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [isPlaying]);

  // Start recording function
  const startRecording = () => {
    logger.group('Speech Recognition');
    logger.voice('🎙️', 'Starting speech recognition');
    
    if (!recognitionRef.current) {
      logger.error('❌', 'Speech recognition not initialized');
      logger.groupEnd();
      return;
    }
    
    // Don't start recording if audio is playing
    if (isPlaying) {
      logger.warn('⚠️', 'Cannot start recording while audio is playing');
      logger.groupEnd();
      return;
    }
    
    try {
      // Clear any previous user response
      setUserResponse('');
      setSpeechTranscript('');
      
      // Use React state instead of direct DOM manipulation
      setShowListeningIndicator(true);
      
      setIsRecording(true);
      recognitionRef.current.start();
      logger.voice('✅', 'Speech recognition started');
      logger.groupEnd();
    } catch (error) {
      logger.error('❌', 'Error starting speech recognition:', error);
      setIsRecording(false);
      setShowListeningIndicator(false);
      logger.groupEnd();
    }
  };

  // Stop recording function
  const stopRecording = () => {
    logger.voice('🎙️', 'Stopping speech recognition');
    
    if (!recognitionRef.current) {
      logger.error('❌', 'Speech recognition not initialized');
      return;
    }
    
    try {
      recognitionRef.current.stop();
      setIsRecording(false);
      setShowListeningIndicator(false);
      logger.voice('✅', 'Speech recognition stopped');
      
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    } catch (error) {
      logger.error('❌', 'Error stopping speech recognition:', error);
      setIsRecording(false);
      setShowListeningIndicator(false);
    }
  };

  // Node command patterns for voice recognition
  const NODE_VOICE_COMMANDS = {
    ADD: [
      /add(?:\s+a)?(?:\s+new)?(?:\s+node)?(?:\s+called|named)?\s+(\w+)(?:\s+of\s+type|type)?\s+(\w+)/i,
      /create(?:\s+a)?(?:\s+new)?(?:\s+node)?(?:\s+called|named)?\s+(\w+)(?:\s+of\s+type|type)?\s+(\w+)/i
    ],
    CONNECT: [
      /connect(?:\s+node)?\s+(\w+)(?:\s+to)?\s+(\w+)/i,
      /link(?:\s+node)?\s+(\w+)(?:\s+to)?\s+(\w+)/i
    ],
    REMOVE: [
      /remove(?:\s+node)?\s+(\w+)/i,
      /delete(?:\s+node)?\s+(\w+)/i
    ]
  };

  // Process user response after speech recognition
  const processUserResponse = (response: string) => {
    if (!response.trim()) return;
    
    console.log('Processing user response:', response);
    
    // Reset the input placeholder
    const chatInput = document.getElementById('chat-input') as HTMLInputElement;
    if (chatInput) {
      chatInput.placeholder = 'Type your response...';
      chatInput.value = ''; // Clear the input field
    }
    
    // Create user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as 'user',
      content: response.trim()
    };
    
    // Add user message to chat
    setChatMessages(prev => [...prev, userMessage]);
    
    // Check for node voice commands
    const trimmedResponse = response.trim().toLowerCase();
    
    // Check for add node commands
    for (const pattern of NODE_VOICE_COMMANDS.ADD) {
      const match = trimmedResponse.match(pattern);
      if (match) {
        const [_, nodeName, nodeType = 'token'] = match;
        processAddNodeVoiceCommand(nodeName, nodeType);
        return;
      }
    }
    
    // Check for connect node commands
    for (const pattern of NODE_VOICE_COMMANDS.CONNECT) {
      const match = trimmedResponse.match(pattern);
      if (match) {
        const [_, sourceNode, targetNode] = match;
        processConnectNodesVoiceCommand(sourceNode, targetNode);
        return;
      }
    }
    
    // Check for remove node commands
    for (const pattern of NODE_VOICE_COMMANDS.REMOVE) {
      const match = trimmedResponse.match(pattern);
      if (match) {
        const [_, nodeName] = match;
        processRemoveNodeVoiceCommand(nodeName);
        return;
      }
    }
    
    // Handle "I don't know" responses with multiple choice options
    if (response.toLowerCase().includes("i don't know") || response.toLowerCase().includes("don't know") || response.toLowerCase().includes("not sure")) {
      let currentStep = '';
      for (const step in wizardData) {
        if (wizardData[`${step}-started`] && !wizardData[`${step}-completed`]) {
          currentStep = step;
          break;
        }
      }
      
      if (currentStep) {
        const suggestedOptions = getSuggestedOptionsForStep(currentStep);
        const suggestedMessage = {
          id: `ai-options-${Date.now()}`,
          role: 'ai' as 'ai',
          content: `No problem! Here are some suggestions to choose from:\n\n${suggestedOptions.map((option, index) => `**Option ${index + 1}**: ${option}`).join('\n\n')}\n\nPlease select 1, 2, or 3 or say your own response.`
        };
        
        setChatMessages(prev => [...prev, suggestedMessage]);
        
        // Play the voice message with options
        playVoiceMessage(suggestedMessage.id, suggestedMessage.content);
        return;
      }
    }
    
    // Check if user asked for help with node management
    if (
      trimmedResponse.includes('how to add node') || 
      trimmedResponse.includes('how to create node') ||
      trimmedResponse.includes('node commands') ||
      trimmedResponse.includes('node help')
    ) {
      const helpMessage = {
        id: `ai-node-help-${Date.now()}`,
        role: 'ai' as 'ai',
        content: "Here's how you can manage nodes:\n\n" +
          "**Voice Commands:**\n" +
          "- \"Add a token node called MyToken\"\n" +
          "- \"Create a governance node named Council\"\n" +
          "- \"Connect Token to Treasury\"\n" +
          "- \"Remove the Vesting node\"\n\n" +
          "**Text Commands:**\n" +
          "- `/add token MyToken`\n" +
          "- `/connect token-123 treasury-456`\n" +
          "- `/remove token-123`\n" +
          "- `/list` (to see all nodes)\n\n" +
          "You can also use the + button on the canvas to add nodes directly."
      };
      
      setChatMessages(prev => [...prev, helpMessage]);
      playVoiceMessage(helpMessage.id, helpMessage.content);
      return;
    }
    
    // Check if response is a number choice (1, 2, 3)
    const numberChoice = parseInt(response.trim());
    if (!isNaN(numberChoice) && numberChoice >= 1 && numberChoice <= 3) {
      let currentStep = '';
      for (const step in wizardData) {
        if (wizardData[`${step}-started`] && !wizardData[`${step}-completed`]) {
          currentStep = step;
          break;
        }
      }
      
      if (currentStep) {
        const suggestedOptions = getSuggestedOptionsForStep(currentStep);
        if (numberChoice <= suggestedOptions.length) {
          const selectedOption = suggestedOptions[numberChoice - 1];
          
          // Create a new user message with the selected option
          const selectedMessage = {
            id: `user-selection-${Date.now()}`,
            role: 'user' as 'user',
            content: `I choose option ${numberChoice}: ${selectedOption}`
          };
          
          setChatMessages(prev => [...prev, selectedMessage]);
          
          // Process the actual selection
          handleStepCompletion(currentStep, selectedOption);
          return;
        }
      }
    }
    
    // Update wizard data with the step completed
    const currentStep = getCurrentStep();
    if (currentStep) {
      handleStepCompletion(currentStep, response);
    }
  };
  
  // Process add node voice command
  const processAddNodeVoiceCommand = (nodeName: string, nodeType: string) => {
    logger.group('Node Management');
    logger.ui('🎮', 'Processing add node voice command', { nodeName, nodeType });
    
    if (!nodeEditorRef.current) {
      logger.error('❌', 'Node editor reference not available');
      const errorMsg = {
        id: `ai-error-${Date.now()}`,
        role: 'ai' as 'ai',
        content: "I can't add a node right now because the node editor isn't ready. Please try again in a moment."
      };
      setChatMessages(prev => [...prev, errorMsg]);
      logger.groupEnd();
      return;
    }
    
    // Create node data
    const nodeData = {
      name: nodeName,
      type: nodeType.toLowerCase(),
      ...(nodeType.toLowerCase() === 'token' && {
        symbol: nodeName.substring(0, 4).toUpperCase(),
        decimals: '18',
        supply: '1000000'
      })
    };
    
    logger.debug('📦', 'Node data prepared', nodeData);
    
    // Add node to canvas
    try {
      logger.ui('➕', 'Adding node to canvas');
      const nodeId = nodeEditorRef.current.addNodeToCanvas(nodeData);
      logger.success('✅', 'Node added successfully', { nodeId });
      
      // Send confirmation message
      const confirmMsg = {
        id: `ai-node-${Date.now()}`,
        role: 'ai' as 'ai',
        content: `I've added a ${nodeType} node named "${nodeName}" for you.`
      };
      setChatMessages(prev => [...prev, confirmMsg]);
      playVoiceMessage(confirmMsg.id, confirmMsg.content);
      
      // Show feedback
      logger.ui('💬', 'Showing node creation feedback');
      setNodeCreationFeedback(`✅ ${nodeType} node "${nodeName}" created`);
      setTimeout(() => setNodeCreationFeedback(null), 3000);
    } catch (error) {
      logger.error('❌', 'Error adding node to canvas', error);
    }
    
    logger.groupEnd();
  };
  
  // Process connect nodes voice command
  const processConnectNodesVoiceCommand = (sourceNodeName: string, targetNodeName: string) => {
    if (!nodeEditorRef.current) {
      const errorMsg = {
        id: `ai-error-${Date.now()}`,
        role: 'ai' as 'ai',
        content: "I can't connect nodes right now because the node editor isn't ready. Please try again in a moment."
      };
      setChatMessages(prev => [...prev, errorMsg]);
      return;
    }
    
    // Get all nodes
    const { nodes } = nodeEditorRef.current.getCanvas();
    
    // Find source and target nodes by name or partial ID
    const sourceNode = nodes.find((node: any) => 
      node.data.name.toLowerCase().includes(sourceNodeName.toLowerCase()) ||
      node.id.toLowerCase().includes(sourceNodeName.toLowerCase())
    );
    
    const targetNode = nodes.find((node: any) => 
      node.data.name.toLowerCase().includes(targetNodeName.toLowerCase()) ||
      node.id.toLowerCase().includes(targetNodeName.toLowerCase())
    );
    
    if (!sourceNode || !targetNode) {
      const errorMsg = {
        id: `ai-error-${Date.now()}`,
        role: 'ai' as 'ai',
        content: `I couldn't find ${!sourceNode ? `a node named "${sourceNodeName}"` : `a node named "${targetNodeName}"`}. Please check the node names and try again.`
      };
      setChatMessages(prev => [...prev, errorMsg]);
      playVoiceMessage(errorMsg.id, errorMsg.content);
      return;
    }
    
    // Connect the nodes
    nodeEditorRef.current.connectNodes(sourceNode.id, targetNode.id);
    
    // Send confirmation message
    const confirmMsg = {
      id: `ai-connect-${Date.now()}`,
      role: 'ai' as 'ai',
      content: `I've connected the ${sourceNode.data.name} node to the ${targetNode.data.name} node.`
    };
    setChatMessages(prev => [...prev, confirmMsg]);
    playVoiceMessage(confirmMsg.id, confirmMsg.content);
  };
  
  // Process remove node voice command
  const processRemoveNodeVoiceCommand = (nodeName: string) => {
    if (!nodeEditorRef.current) {
      const errorMsg = {
        id: `ai-error-${Date.now()}`,
        role: 'ai' as 'ai',
        content: "I can't remove a node right now because the node editor isn't ready. Please try again in a moment."
      };
      setChatMessages(prev => [...prev, errorMsg]);
      return;
    }
    
    // Get all nodes
    const { nodes } = nodeEditorRef.current.getCanvas();
    
    // Find node by name or partial ID
    const node = nodes.find((node: any) => 
      node.data.name.toLowerCase().includes(nodeName.toLowerCase()) ||
      node.id.toLowerCase().includes(nodeName.toLowerCase())
    );
    
    if (!node) {
      const errorMsg = {
        id: `ai-error-${Date.now()}`,
        role: 'ai' as 'ai',
        content: `I couldn't find a node named "${nodeName}". Please check the node name and try again.`
      };
      setChatMessages(prev => [...prev, errorMsg]);
      playVoiceMessage(errorMsg.id, errorMsg.content);
      return;
    }
    
    // Remove the node
    nodeEditorRef.current.removeNodeFromCanvas(node.id);
    
    // Send confirmation message
    const confirmMsg = {
      id: `ai-remove-${Date.now()}`,
      role: 'ai' as 'ai',
      content: `I've removed the ${node.data.name} node.`
    };
    setChatMessages(prev => [...prev, confirmMsg]);
    playVoiceMessage(confirmMsg.id, confirmMsg.content);
  };

  // Get the current active step
  const getCurrentStep = (): string => {
    for (const step in wizardData) {
      if (wizardData[`${step}-started`] && !wizardData[`${step}-completed`]) {
        return step;
      }
    }
    return '';
  };

  // Handle step completion and node creation
  const handleStepCompletion = (stepId: string, response: string) => {
    // Mark step as completed
    setWizardData(prev => ({
      ...prev,
      [stepId]: true,
      [`${stepId}-completed`]: true
    }));
    
    // Add node based on the step and response
    addNodeBasedOnStep(stepId, response);
    
    // Show success notification
    setNodeCreationFeedback(`✅ ${getStepDisplayName(stepId)} configuration saved`);
    setTimeout(() => setNodeCreationFeedback(null), 3000);
    
    // Move to next step automatically after a pause
    setTimeout(() => {
      const nextStep = getNextStep(stepId);
      if (nextStep) {
        startWorkflowStep(nextStep, getPromptForStep(nextStep));
      } else {
        // Workflow completed
        const completionMessage = {
          id: `ai-complete-${Date.now()}`,
          role: 'ai' as 'ai',
          content: "Great job! You've completed the DAO configuration workflow. Your contract nodes have been created and configured based on your responses."
        };
        
        setChatMessages(prev => [...prev, completionMessage]);
        playVoiceMessage(completionMessage.id, completionMessage.content);
      }
    }, 2000);
  };

  // Get suggested options for each step
  const getSuggestedOptionsForStep = (stepId: string): string[] => {
    switch(stepId) {
      case 'project-context':
        return [
          "A governance DAO for open-source software development",
          "A community treasury to fund public goods and grants",
          "An investment DAO focused on DeFi protocol investments"
        ];
      case 'token-design':
        return [
          "Standard ERC-20 governance token with 100 million supply",
          "DAO token with 10 million supply and 18 decimals",
          "Community token with 1 billion supply and deflationary mechanism"
        ];
      case 'roles-permissions':
        return [
          "Core team (20%), Contributors (30%), Community (50%)",
          "Founders (15%), Investors (25%), Community (60%)",
          "Core developers (25%), Treasury (25%), Community voters (50%)"
        ];
      case 'voting-mechanics':
        return [
          "3 day voting period, 20% quorum, 1% proposal threshold",
          "7 day voting period, 10% quorum, 0.5% proposal threshold",
          "5 day voting period, 15% quorum, 1% proposal threshold"
        ];
      case 'proposal-rules':
        return [
          "Any token holder can propose, 3 day discussion period required",
          "Requires 1% token holding to propose, 2 day discussion period",
          "Tiered proposal system based on token holdings"
        ];
      case 'treasury-management':
        return [
          "Multi-signature wallet with 3/5 approval threshold",
          "DAO-governed treasury with proposal-based withdrawals",
          "Programmatic treasury with automated allocations"
        ];
      default:
        return [
          "Option A: Standard configuration",
          "Option B: Advanced configuration",
          "Option C: Custom configuration"
        ];
    }
  };

  // Start the workflow step by adding a question to chat and activating voice
  const startWorkflowStep = (stepId: string, question: string) => {
    // Stop any active recording or playback
    if (isRecording) {
      stopRecording();
    }

    // Mark this step as active
    setCurrentWorkflowStep(stepId);
    
    // Add step active indicator class to the current step in UI
    const stepElements = document.querySelectorAll('.workflow-step');
    stepElements.forEach((el) => {
      el.classList.remove('step-active-indicator', 'step-active');
    });
    
    const currentStepElement = document.querySelector(`[data-step="${stepId}"]`);
    if (currentStepElement) {
      currentStepElement.classList.add('step-active-indicator', 'step-active');
      
      // Scroll into view
      currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Add AI message to chat with the question
    const options = getSuggestedOptionsForStep(stepId);
    const optionsText = `\n\nIf you're not sure, just say "I don't know" and I'll provide some suggestions. Or you can choose one of these options:\n\n${options.map((option, index) => `**Option ${index + 1}**: ${option}`).join('\n\n')}`;
    
    const aiMessage = {
      id: `ai-${Date.now()}`,
      role: 'ai' as 'ai',
      content: question + optionsText
    };
    
    setChatMessages(prev => [...prev, aiMessage]);
    
    // Store that this step was started
    setWizardData(prev => ({
      ...prev,
      [`${stepId}-started`]: true
    }));
    
    // Focus chat area
    const chatArea = document.querySelector('.chat-container');
    if (chatArea) {
      chatArea.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    
    // Don't automatically play voice or start recording to prevent crashes
    // Instead let the user start recording manually or read the text
  };

  // Helper to get display names for steps
  const getStepDisplayName = (stepId: string): string => {
    const displayNames: Record<string, string> = {
      'project-context': 'Project Context',
      'token-design': 'Token Design',
      'roles-permissions': 'Roles & Permissions',
      'voting-mechanics': 'Voting Mechanics',
      'proposal-rules': 'Proposal Rules',
      'treasury-management': 'Treasury Management',
    };
    
    return displayNames[stepId] || stepId;
  };

  // Get the next step in the workflow
  const getNextStep = (currentStep: string): string => {
    const workflowSteps = [
      'project-context',
      'token-design',
      'roles-permissions',
      'voting-mechanics',
      'proposal-rules',
      'treasury-management'
    ];
    
    const currentIndex = workflowSteps.indexOf(currentStep);
    if (currentIndex !== -1 && currentIndex < workflowSteps.length - 1) {
      return workflowSteps[currentIndex + 1];
    }
    
    return '';
  };

  // Get the prompt for each step
  const getPromptForStep = (stepId: string): string => {
    switch(stepId) {
      case 'project-context':
        return "Let's start with your project. What is your DAO about, and what is its primary purpose?";
      case 'token-design':
        return "Now, let's configure your DAO token. What should the token supply be, and do you have any specific requirements?";
      case 'roles-permissions':
        return "Let's define roles in your DAO. How would you like to structure roles and permissions?";
      case 'voting-mechanics':
        return "How should voting work in your DAO? What voting period, quorum, and proposal threshold would you like?";
      case 'proposal-rules':
        return "What rules should govern proposals in your DAO? Who can create proposals and what requirements should there be?";
      case 'treasury-management':
        return "Finally, how should the DAO treasury be managed? What security measures or spending policies would you like?";
      default:
        return "Let's continue configuring your DAO. What would you like to set up next?";
    }
  };

  // Play voice message using elevenlabs
  const playVoiceMessage = async (messageId: string, text: string) => {
    logger.group('Voice Playback');
    logger.voice('🔊', 'Starting voice playback', { messageId });
    
    try {
      // Stop any recording first
      if (isRecording) {
        logger.voice('🎙️', 'Stopping recording before playback');
        stopRecording();
      }
      
      setIsPlaying(true);
      setCurrentPlayingMessageId(messageId);
      
      // Get API key and voice ID from localStorage
      const apiKey = localStorage.getItem('elevenlabsApiKey') || '';
      const voiceId = localStorage.getItem('elevenlabsVoiceId') || '';
      
      logger.debug('🔑', 'Checking ElevenLabs credentials', { 
        hasApiKey: !!apiKey, 
        hasVoiceId: !!voiceId 
      });
      
      if (!apiKey || !voiceId) {
        logger.warn('⚠️', 'ElevenLabs API key or voice ID not configured - skipping voice playback');
        // Simulate a delay then reset the state
        setTimeout(() => {
          setIsPlaying(false);
          setCurrentPlayingMessageId(null);
          
          // Only start recording after AI is done speaking
          setTimeout(() => {
            // Make sure we're not already recording before starting
            if (!isRecording) {
              startRecording();
            }
          }, 500);
        }, 1000);
        logger.groupEnd();
        return;
      }
      
      // Initialize service with API key
      logger.api('🔄', 'Initializing ElevenLabs service with API key');
      elevenlabsService.initElevenLabsService(apiKey);
      
      try {
        // Try to speak the text
        logger.api('📡', 'Sending text-to-speech request to ElevenLabs', { 
          textLength: text.length,
          voiceId 
        });
        
        await elevenlabsService.speak(text, voiceId);
        logger.api('✅', 'ElevenLabs API request successful');
      } catch (speechError) {
        logger.error('❌', 'Error with speech synthesis:', speechError);
      } finally {
        // Always reset the states whether speech succeeds or fails
        logger.voice('✅', 'Speech playback completed');
        setIsPlaying(false);
        setCurrentPlayingMessageId(null);
        
        // Only start recording after AI is done speaking
        setTimeout(() => {
          // Make sure we're not already recording before starting
          if (!isRecording) {
            logger.voice('⏱️', 'Starting recording after speech playback');
            startRecording();
          }
        }, 500);
      }
    } catch (error) {
      logger.error('❌', 'Error playing voice message:', error);
      // Important: reset states when there's an error to prevent UI lockup
      setIsPlaying(false);
      setCurrentPlayingMessageId(null);
    }
    
    logger.groupEnd();
  };

  // Add a node to the canvas based on the workflow step
  const addNodeBasedOnStep = (stepId: string, userResponse: string) => {
    // Create node template based on the step type
    const nodeTemplate = getNodeTemplateForStep(stepId, userResponse);
    
    if (nodeTemplate && nodeEditorRef.current) {
      console.log(`Adding ${nodeTemplate.type} node to canvas based on user response`);
      
      // Use the NodeEditor ref to add the node to the canvas
      nodeEditorRef.current.addNodeToCanvas(nodeTemplate);
      
      // Also add to active contracts array for the contract list
      setActiveContracts(prev => [...prev, {
        id: `node-${Date.now()}`,
        templateId: nodeTemplate.templateId,
        name: nodeTemplate.name,
        type: nodeTemplate.type,
        description: nodeTemplate.description,
        isDeployed: false,
        configuration: nodeTemplate.configuration
      }]);
      
      // Track that a node was created for this step
      setCreatedNodes(prev => ({ ...prev, [stepId]: true }));
      
      // Show brief notification
      setNodeCreationFeedback(`${nodeTemplate.name} created`);
      setTimeout(() => setNodeCreationFeedback(null), 3000);
      
      console.log(`Node added: ${nodeTemplate.name}`);
    }
  };

  // Get node template based on workflow step
  const getNodeTemplateForStep = (stepId: string, userResponse: string): any => {
    switch(stepId) {
      case 'project-context':
        // The project context doesn't create a node directly
        return null;
        
      case 'token-design': 
        // Create a token node based on user response
        return {
          templateId: 'token-template-1',
          name: userResponse || 'DAO Token',
          type: 'token' as ContractType,
          description: 'Governance token for the DAO',
          configuration: {
            name: userResponse,
            symbol: userResponse.split(' ')[0].substring(0, 4).toUpperCase(),
            decimals: '18',
            initialSupply: '1000000'
          }
        };
        
      case 'roles-permissions':
        // Create a delegation node based on user response
        return {
          templateId: 'delegation-template-1',
          name: 'Delegation Contract',
          type: 'delegation' as ContractType,
          description: 'Manage roles and delegation of voting power',
          configuration: {
            roles: userResponse
          }
        };
        
      case 'voting-mechanics':
        // Create a governance node based on user response
        return {
          templateId: 'gov-template-1',
          name: 'Governance Contract',
          type: 'governance' as ContractType,
          description: 'Voting and proposal system',
          configuration: {
            votingPeriod: userResponse.includes('day') ? '3 days' : '1 week',
            quorum: userResponse.includes('20') ? '20%' : '10%',
            proposalThreshold: '1%'
          }
        };
        
      case 'treasury-management':
        // Create a treasury node based on user response
        return {
          templateId: 'treasury-template-1',
          name: 'Treasury Contract',
          type: 'treasury' as ContractType,
          description: 'Manage DAO funds with multi-sig requirements',
          configuration: {
            multiSig: userResponse.includes('Multi-signature') || userResponse.includes('multiple'),
            threshold: userResponse.includes('2') ? 2 : 1
          }
        };
        
      case 'proposal-rules':
        // This doesn't create a new node but updates the governance node configuration
        // Update the most recently added governance contract if it exists
        const govContract = activeContracts.find(c => c.type === 'governance');
        if (govContract) {
          setActiveContracts(prev => 
            prev.map(c => 
              c.id === govContract.id 
                ? {...c, configuration: {...c.configuration, proposalRules: userResponse}}
                : c
            )
          );
        }
        return null;
        
      default:
        return null;
    }
  };

  // Toggle the governance wizard
  const handleShowWizard = () => {
    logger.ui('🧙', 'Toggle governance wizard', { currentMode: wizardMode });
    // Simply toggle the wizard mode without any automatic voice or message creation
    setWizardMode(wizardMode === 'hidden' ? 'sidebar' : 'hidden');
    
    // No automatic voice playback or welcome message to prevent crashes
  };

  // Generate contract code based on collected wizard data
  const generateContractCode = () => {
    // Start with basic template
    let code = `// Generated Contract Code
// This will be updated as you answer the configuration questions

import { ThirdwebSDK } from "@thirdweb-dev/sdk";

async function deployDAO() {
  const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "ethereum");
  
  // Token configuration
  const tokenConfig = {
    name: "${wizardData['token-design'] || 'DAO Token'}",
    symbol: "${wizardData['token-design'] ? wizardData['token-design'].substring(0, 4).toUpperCase() : 'DAO'}",
    primary_sale_recipient: "{{wallet_address}}",`;

    // Add additional token settings based on user input
    if (wizardData['token-design']) {
      code += `
    // Supply settings
    initialSupply: "1000000",
    decimals: 18,`;
    }

    code += `
  };
  
  // Governance configuration
  const governanceConfig = {
    name: "DAO Governance",
    voting_delay_in_blocks: 0,
    voting_period_in_blocks: ${wizardData['voting-mechanics'] ? '5760' : '5760'}, // ~1 day
    voting_token_address: "{{token_address}}",
    proposal_threshold_bps: ${wizardData['proposal-rules'] ? '100' : '100'}, // 1%`;
    
    // Add proposal settings if provided
    if (wizardData['proposal-rules']) {
      code += `
    proposal_token_threshold: "${wizardData['proposal-rules'].includes('1000') ? '1000' : '0'}",`;
    }

    // Add quorum settings if provided
    if (wizardData['voting-mechanics']) {
      code += `
    quorum_bps: 2000, // 20% quorum required`;
    }
    
    code += `
  };`;

    // Add treasury if applicable
    if (wizardData['treasury-management']) {
      code += `
  
  // Treasury configuration
  const treasuryConfig = {
    // Treasury settings based on selections
    multisig: ${wizardData['treasury-management'].includes('Multi-signature') ? 'true' : 'false'},
    signers: ["{{wallet_address}}"],
    threshold: 1,
  };`;
    }

    // Complete the code
    code += `
  
  // Deploy contracts
  const token = await sdk.deployer.deployToken(tokenConfig);
  console.log("Token deployed at:", token.getAddress());
  
  const governance = await sdk.deployer.deployVote({
    ...governanceConfig,
    voting_token_address: token.getAddress(),
  });
  console.log("Governance contract deployed at:", governance.getAddress());`;

    // Add treasury deployment if applicable
    if (wizardData['treasury-management']) {
      code += `
  
  // Deploy treasury if configured
  const treasury = await sdk.deployer.deployMultisig(treasuryConfig);
  console.log("Treasury deployed at:", treasury.getAddress());`;
    }
  
    code += `
  
  return {
    token: token.getAddress(),
    governance: governance.getAddress(),${wizardData['treasury-management'] ? '\n    treasury: treasury.getAddress(),' : ''}
  };
}`;

    return code;
  };

  // Add this function to integrate the contract builder with the wizard steps
  const addNodeFromWizardStep = (stepId: string, stepData: any) => {
    // This function would create a node in the NodeEditor based on the step
    console.log(`Adding node for step: ${stepId} with data:`, stepData);
    
    // Example implementation (in a real app, you'd update the NodeEditor state)
    switch(stepId) {
      case 'token-design':
        // Logic to add token node
        const tokenNode = {
          id: `token-${Date.now()}`,
          type: 'token',
          name: stepData || 'DAO Token',
          configuration: {
            name: stepData,
            symbol: stepData?.substring(0, 4).toUpperCase() || 'DAO',
            decimals: '18',
            initialSupply: '1000000'
          }
        };
        console.log('Would add token node:', tokenNode);
        break;
        
      case 'voting-mechanics':
        // Logic to add voting node
        const votingNode = {
          id: `voting-${Date.now()}`,
          type: 'governance',
          name: 'Voting Configuration',
          configuration: {
            votingPeriod: '3 days',
            quorum: '20%',
            proposalThreshold: '1%'
          }
        };
        console.log('Would add voting node:', votingNode);
        break;
        
      // Add cases for other step types
      default:
        console.log('No specific node type for this step');
    }
  };

  // Get contract type color
  const getContractTypeColor = (type: ContractType) => {
    switch (type) {
      case 'governance':
        return 'bg-primary';
      case 'token':
        return 'bg-emerald-500';
      case 'vesting':
        return 'bg-pink-500';
      case 'delegation':
        return 'bg-violet-500';
      case 'ai':
        return 'bg-amber-500';
      case 'treasury':
        return 'bg-yellow-500';
      default:
        return 'bg-neutral';
    }
  };
  
  // Get contract type icon
  const getContractTypeIcon = (type: ContractType) => {
    switch (type) {
      case 'governance':
        return <Shield size={20} className="text-primary" />;
      case 'token':
        return <Coins size={20} className="text-emerald-500" />;
      case 'vesting':
        return <Clock size={20} className="text-pink-500" />;
      case 'delegation':
        return <Users size={20} className="text-violet-500" />;
      case 'ai':
        return <Bot size={20} className="text-amber-500" />;
      case 'treasury':
        return <Wallet size={20} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  // When switching to the rightmost panel, remove any duplicate chat boxes
  useEffect(() => {
    if (wizardMode === 'sidebar') {
      // Remove any duplicate chat UI that might be in the right panel
      const rightPanelChatElements = document.querySelectorAll('.right-panel .chat-container');
      rightPanelChatElements.forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    }
  }, [wizardMode]);

  // Reset UI state when ElevenLabs API errors occur
  useEffect(() => {
    // Check if API key is valid
    const checkApiKeyValidity = async () => {
      const apiKey = localStorage.getItem('elevenlabsApiKey');
      if (apiKey) {
        try {
          elevenlabsService.initElevenLabsService(apiKey);
          const isValid = await elevenlabsService.validateApiKey();
          if (!isValid) {
            // If key is invalid, clear it from localStorage
            localStorage.removeItem('elevenlabsApiKey');
            console.log('Removed invalid ElevenLabs API key');
          }
        } catch (error) {
          console.warn('Error validating ElevenLabs API key:', error);
        }
      }
    };
    
    checkApiKeyValidity();
  }, []);

  // Add this function right before the return statement
  // Implementation of the handleNodeManagementHelp function
  const handleNodeManagementHelp = () => {
    logger.ui('📘', 'Node Management help button clicked');
    
    const nodeHelpMessage = {
      id: `ai-node-help-${Date.now()}`,
      role: 'ai' as 'ai',
      content: "# 🎮 Node Management Guide\n\nYou can create and manage nodes using text, voice, or direct canvas interaction:\n\n## 🗣️ Voice Commands\n- \"Add a token node called MyToken\"\n- \"Create a governor node named Council\"\n- \"Connect token to treasury\"\n- \"Remove the vesting node\"\n\n## ⌨️ Text Commands\n- `/add token MyToken` - Create new node\n- `/connect token-123 treasury-456` - Link nodes\n- `/remove token-123` - Delete node\n- `/list` - Show all nodes\n- `/clear` - Clear canvas\n\n## 🖱️ Direct Interaction\n- Click the '+' button on canvas to add nodes\n- Double-click nodes to edit properties"
    };
    
    // Always add the message to chat
    logger.ui('📝', 'Adding help message to chat');
    setChatMessages(prev => [...prev, nodeHelpMessage]);
    
    // Check if ElevenLabs API is configured
    const apiKey = localStorage.getItem('elevenlabsApiKey');
    const voiceId = localStorage.getItem('elevenlabsVoiceId');
    logger.debug('🔑', 'Checking ElevenLabs credentials', { hasApiKey: !!apiKey, hasVoiceId: !!voiceId });
    
    if (apiKey && voiceId) {
      // Try voice playback but handle errors gracefully
      logger.voice('🔊', 'Starting voice playback for Node Management help');
      playVoiceMessage(nodeHelpMessage.id, nodeHelpMessage.content);
    } else {
      logger.warn('⚠️', 'Skipping voice playback - ElevenLabs not configured');
    }
  };

  // Add function to save ElevenLabs settings
  const saveElevenLabsSettings = () => {
    logger.group('ElevenLabs Settings');
    logger.info('💾', 'Saving ElevenLabs settings');
    
    localStorage.setItem('elevenlabsApiKey', elevenlabsApiKey);
    localStorage.setItem('elevenlabsVoiceId', elevenlabsVoiceId);
    
    // Initialize the service with the new API key
    elevenlabsService.initElevenLabsService(elevenlabsApiKey);
    
    logger.success('✅', 'ElevenLabs settings saved');
    logger.groupEnd();
    
    setShowElevenLabsSettings(false);
  };

  // Add function to load voices from ElevenLabs
  const loadElevenLabsVoices = async () => {
    logger.group('Load ElevenLabs Voices');
    
    if (!elevenlabsApiKey) {
      logger.warn('⚠️', 'Cannot load voices without API key');
      logger.groupEnd();
      return;
    }
    
    try {
      setIsLoadingVoices(true);
      logger.info('🔄', 'Fetching voices from ElevenLabs API');
      
      // Initialize service first
      elevenlabsService.initElevenLabsService(elevenlabsApiKey);
      
      // Get voices
      const voicesList = await elevenlabsService.getVoices();
      setVoices(voicesList);
      
      logger.success('✅', 'Fetched voices successfully', { count: voicesList.length });
    } catch (error) {
      logger.error('❌', 'Error fetching voices', error);
    } finally {
      setIsLoadingVoices(false);
      logger.groupEnd();
    }
  };

  // Add function to test voice
  const testElevenLabsVoice = async () => {
    logger.group('Test ElevenLabs Voice');
    
    if (!elevenlabsApiKey || !elevenlabsVoiceId) {
      logger.warn('⚠️', 'Cannot test voice without API key and voice ID');
      logger.groupEnd();
      return;
    }
    
    try {
      setIsTestingVoice(true);
      logger.info('🔊', 'Testing voice', { voiceId: elevenlabsVoiceId });
      
      // Initialize service first
      elevenlabsService.initElevenLabsService(elevenlabsApiKey);
      
      // Test with a simple message
      await elevenlabsService.speak('Hello, this is a test of the ElevenLabs voice synthesis.', elevenlabsVoiceId);
      
      logger.success('✅', 'Voice test completed');
    } catch (error) {
      logger.error('❌', 'Error testing voice', error);
    } finally {
      setIsTestingVoice(false);
      logger.groupEnd();
    }
  };

  return (
    <div className="container py-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-lg">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white mr-md"
          >
            <ArrowLeft size={20} className="mr-xs" />
            <span>Back</span>
          </button>
          <h1 className="text-h2">Governance</h1>
        </div>
        <div className="flex gap-2">
          <button 
            className="btn-secondary flex items-center"
            onClick={() => {
              logger.ui('🖱️', 'Voice Settings button clicked');
              setShowElevenLabsSettings(true);
              // Load voices when opening settings
              loadElevenLabsVoices();
            }}
          >
            <Volume2 size={18} className="mr-xs" />
            <span>Voice Settings</span>
          </button>
          <button 
            className={`btn-secondary flex items-center ${wizardMode !== 'hidden' ? 'bg-primary text-white' : ''}`}
            onClick={handleShowWizard}
          >
            <Shield size={18} className="mr-xs" />
            <span>{wizardMode === 'hidden' ? 'Setup Wizard' : 'Hide Wizard'}</span>
          </button>
          <button 
            className="btn-primary flex items-center" 
            onClick={() => setIsAddingContract(true)}
          >
            <PlusCircle size={18} className="mr-xs" />
            <span>Add Contract</span>
          </button>
        </div>
      </div>
      
      {/* Description */}
      <div className="bg-neutral-dark rounded-lg p-lg mb-xl">
        <h2 className="text-h3 mb-md">Smart Contract Management</h2>
        <p className="text-body mb-md">
          Customize your DAO's smart contracts with our drag-and-drop interface. Add, configure, and deploy 
          governance tools, token contracts, vesting schedules, and more.
        </p>
        <div className="flex flex-wrap gap-md mt-lg">
          <div className="badge bg-primary/20 text-primary">Governance</div>
          <div className="badge bg-primary/20 text-primary">Token</div>
          <div className="badge bg-primary/20 text-primary">Vesting</div>
          <div className="badge bg-primary/20 text-primary">Delegation</div>
          <div className="badge bg-primary/20 text-primary">Treasury</div>
          <div className="badge bg-primary/20 text-primary">AI Integration</div>
        </div>
      </div>

      {/* Main content with Node Editor and Wizard */}
      <div className="flex mb-4">
        {/* Left side with Node Editor Canvas */}
        <div className={`${wizardMode !== 'hidden' ? 'w-3/4' : 'w-full'} transition-all duration-300`}>
          <div className="border border-neutral-light/10 rounded-lg overflow-hidden h-[550px]">
            <NodeEditor 
              ref={nodeEditorRef}
              onSave={(nodes, connections) => {
                console.log('Flow saved:', { nodes, connections });
                // Here you could extract contract configuration from nodes
                // and update the activeContracts state
              }}
            />
          </div>
        </div>
        
        {/* Right side with Wizard Checklist */}
        {wizardMode !== 'hidden' && (
          <div className="w-1/4 border border-neutral-light/10 rounded-lg ml-4 h-[550px] overflow-hidden flex flex-col">
            <div className="h-full overflow-y-auto bg-neutral p-4">
              <div className="flex flex-col h-full">
                <h2 className="text-lg font-bold mb-4 text-white">DAO Configuration</h2>
                
                {/* DAO Type Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-light mb-1">DAO Type</label>
                  <select
                    className="w-full bg-neutral-dark border border-neutral-light/20 rounded-md p-2 text-white"
                    value={daoType || 'standard'}
                    onChange={(e) => setDaoType(e.target.value as DAOType)}
                  >
                    <option value="standard">Standard DAO</option>
                    <option value="project">Project DAO</option>
                    <option value="corporate">Corporate DAO</option>
                  </select>
                </div>
                
                {/* Split into two panels: Config steps and Chat history */}
                <div className="flex flex-col flex-1 h-0">
                  {/* Top panel - configuration steps */}
                  <div className="mb-4 flex-1">
                    <h3 className="text-sm font-medium text-neutral-light mb-2">Configuration Steps</h3>
                    <div className="space-y-1">
                      {/* Project Context */}
                      <div 
                        id="step-project-context"
                        className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-300 ${
                          wizardData['project-context-completed'] 
                            ? 'bg-primary/20' 
                            : isRecording && wizardData['project-context-started'] && !wizardData['project-context-completed'] 
                              ? 'bg-red-500/20 step-active' 
                              : isPlaying && currentPlayingMessageId?.includes('project-context') 
                                ? 'bg-primary/10 step-active' 
                                : 'hover:bg-neutral-light/5'
                        }`}
                        onClick={() => {
                          // Start Project Context workflow
                          startWorkflowStep('project-context', 'Let\'s start with your project. What is your DAO about, and what is its primary purpose?');
                        }}
                      >
                        <div className="mr-2">
                          {wizardData['project-context-completed'] ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : isRecording && wizardData['project-context-started'] && !wizardData['project-context-completed'] ? (
                            <Mic size={16} className="text-red-500 animate-pulse" />
                          ) : isPlaying && currentPlayingMessageId?.includes('project-context') ? (
                            <Volume2 size={16} className="text-primary animate-pulse" />
                          ) : (
                            <Circle size={16} className="text-primary/50" />
                          )}
                        </div>
                        <span className="text-sm text-white">Project Context</span>
                      </div>
                      
                      {/* Token Design */}
                      <div 
                        id="step-token-design"
                        className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-300 ${
                          wizardData['token-design-completed'] 
                            ? createdNodes['token-design'] 
                              ? 'bg-green-500/20' 
                              : 'bg-primary/20' 
                            : isRecording && wizardData['token-design-started'] && !wizardData['token-design-completed'] 
                              ? 'bg-red-500/20 step-active' 
                              : isPlaying && currentPlayingMessageId?.includes('token-design') 
                                ? 'bg-primary/10 step-active' 
                                : 'hover:bg-neutral-light/5'
                        }`}
                        onClick={() => {
                          // Start Token Design workflow
                          startWorkflowStep('token-design', 'Will your governance use a token? If yes, what will the token be called?');
                        }}
                      >
                        <div className="mr-2">
                          {wizardData['token-design-completed'] ? (
                            createdNodes['token-design'] ? (
                              <Coins size={16} className="text-green-400" />
                            ) : (
                              <CheckCircle size={16} className="text-green-400" />
                            )
                          ) : isRecording && wizardData['token-design-started'] && !wizardData['token-design-completed'] ? (
                            <Mic size={16} className="text-red-500 animate-pulse" />
                          ) : isPlaying && currentPlayingMessageId?.includes('token-design') ? (
                            <Volume2 size={16} className="text-primary animate-pulse" />
                          ) : (
                            <Circle size={16} className="text-primary/50" />
                          )}
                        </div>
                        <span className="text-sm text-white">Token Design</span>
                      </div>
                      
                      {/* Roles & Permissions */}
                      <div 
                        id="step-roles-permissions"
                        className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-300 ${
                          wizardData['roles-permissions-completed'] 
                            ? 'bg-primary/20' 
                            : isRecording && wizardData['roles-permissions-started'] && !wizardData['roles-permissions-completed'] 
                              ? 'bg-red-500/20 step-active' 
                              : isPlaying && currentPlayingMessageId?.includes('roles-permissions') 
                                ? 'bg-primary/10 step-active' 
                                : 'hover:bg-neutral-light/5'
                        }`}
                        onClick={() => {
                          // Start Roles & Permissions workflow
                          startWorkflowStep('roles-permissions', 'Who are the participants in your DAO and what roles will they have? (e.g., token holders, delegates, admins, council members, etc.)');
                        }}
                      >
                        <div className="mr-2">
                          {wizardData['roles-permissions-completed'] ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : isRecording && wizardData['roles-permissions-started'] && !wizardData['roles-permissions-completed'] ? (
                            <Mic size={16} className="text-red-500 animate-pulse" />
                          ) : isPlaying && currentPlayingMessageId?.includes('roles-permissions') ? (
                            <Volume2 size={16} className="text-primary animate-pulse" />
                          ) : (
                            <Circle size={16} className="text-primary/50" />
                          )}
                        </div>
                        <span className="text-sm text-white">Roles & Permissions</span>
                      </div>
                      
                      {/* Voting Mechanics */}
                      <div 
                        id="step-voting-mechanics"
                        className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-300 ${
                          wizardData['voting-mechanics-completed'] 
                            ? 'bg-primary/20' 
                            : isRecording && wizardData['voting-mechanics-started'] && !wizardData['voting-mechanics-completed'] 
                              ? 'bg-red-500/20 step-active' 
                              : isPlaying && currentPlayingMessageId?.includes('voting-mechanics') 
                                ? 'bg-primary/10 step-active' 
                                : 'hover:bg-neutral-light/5'
                        }`}
                        onClick={() => {
                          // Start Voting Mechanics workflow
                          startWorkflowStep('voting-mechanics', 'How should voting work in your DAO? (E.g., how long do votes last, what % of votes are needed to pass, etc.)');
                        }}
                      >
                        <div className="mr-2">
                          {wizardData['voting-mechanics-completed'] ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : isRecording && wizardData['voting-mechanics-started'] && !wizardData['voting-mechanics-completed'] ? (
                            <Mic size={16} className="text-red-500 animate-pulse" />
                          ) : isPlaying && currentPlayingMessageId?.includes('voting-mechanics') ? (
                            <Volume2 size={16} className="text-primary animate-pulse" />
                          ) : (
                            <Circle size={16} className="text-primary/50" />
                          )}
                        </div>
                        <span className="text-sm text-white">Voting Mechanics</span>
                      </div>
                      
                      {/* Proposal Rules */}
                      <div 
                        id="step-proposal-rules"
                        className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-300 ${
                          wizardData['proposal-rules-completed'] 
                            ? 'bg-primary/20' 
                            : isRecording && wizardData['proposal-rules-started'] && !wizardData['proposal-rules-completed'] 
                              ? 'bg-red-500/20 step-active' 
                              : isPlaying && currentPlayingMessageId?.includes('proposal-rules') 
                                ? 'bg-primary/10 step-active' 
                                : 'hover:bg-neutral-light/5'
                        }`}
                        onClick={() => {
                          // Start Proposal Rules workflow
                          startWorkflowStep('proposal-rules', 'Who can create proposals and what\'s required for a proposal to go live?');
                        }}
                      >
                        <div className="mr-2">
                          {wizardData['proposal-rules-completed'] ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : isRecording && wizardData['proposal-rules-started'] && !wizardData['proposal-rules-completed'] ? (
                            <Mic size={16} className="text-red-500 animate-pulse" />
                          ) : isPlaying && currentPlayingMessageId?.includes('proposal-rules') ? (
                            <Volume2 size={16} className="text-primary animate-pulse" />
                          ) : (
                            <Circle size={16} className="text-primary/50" />
                          )}
                        </div>
                        <span className="text-sm text-white">Proposal Rules</span>
                      </div>
                      
                      {/* Treasury Management */}
                      <div 
                        id="step-treasury-management"
                        className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-300 ${
                          wizardData['treasury-management-completed'] 
                            ? 'bg-primary/20' 
                            : isRecording && wizardData['treasury-management-started'] && !wizardData['treasury-management-completed'] 
                              ? 'bg-red-500/20 step-active' 
                              : isPlaying && currentPlayingMessageId?.includes('treasury-management') 
                                ? 'bg-primary/10 step-active' 
                                : 'hover:bg-neutral-light/5'
                        }`}
                        onClick={() => {
                          // Start Treasury Management workflow
                          startWorkflowStep('treasury-management', 'Will your DAO have a treasury? If yes, who can access or vote on fund allocations?');
                        }}
                      >
                        <div className="mr-2">
                          {wizardData['treasury-management-completed'] ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : isRecording && wizardData['treasury-management-started'] && !wizardData['treasury-management-completed'] ? (
                            <Mic size={16} className="text-red-500 animate-pulse" />
                          ) : isPlaying && currentPlayingMessageId?.includes('treasury-management') ? (
                            <Volume2 size={16} className="text-primary animate-pulse" />
                          ) : (
                            <Circle size={16} className="text-primary/50" />
                          )}
                        </div>
                        <span className="text-sm text-white">Treasury Management</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Replace the problematic element with an empty div that has explicit styling to stay hidden */}
                  <div style={{ 
                    display: 'none', 
                    height: '0px', 
                    margin: '0px', 
                    padding: '0px', 
                    overflow: 'hidden',
                    opacity: 0,
                    visibility: 'hidden',
                    position: 'absolute',
                    zIndex: -9999,
                    pointerEvents: 'none'
                  }} aria-hidden="true" id="blocking-element"></div>
                  
                  {/* Middle panel - Voice Status Indicator */}
                  {(isPlaying || isRecording) && (
                    <div className="mb-3 p-2 bg-neutral-dark rounded-md border border-neutral-light/10">
                      <div className="flex items-center text-sm">
                        {isPlaying && (
                          <div className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1">
                            <Volume2 size={14} className="animate-pulse mr-2" />
                            <span>AI speaking...</span>
                          </div>
                        )}
                        {isRecording && (
                          <div className="flex items-center bg-red-500/10 text-red-500 rounded-full px-3 py-1">
                            <Mic size={14} className="animate-pulse mr-2" />
                            <span>Listening: {userResponse.substring(0, 20)}{userResponse.length > 20 ? '...' : ''}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Bottom panel - Chat History */}
                  <div className="border border-neutral-light/10 rounded-md bg-neutral-dark h-40 overflow-hidden">
                    <ChatInterface
                      messages={chatMessages}
                      currentPlayingMessageId={currentPlayingMessageId}
                      isRecording={isRecording}
                      onPlayMessage={(messageId) => {
                        const message = chatMessages.find(m => m.id === messageId);
                        if (message && message.role === 'ai') {
                          playVoiceMessage(messageId, message.content);
                        }
                      }}
                    />
                  </div>
                </div>
                
                {/* Command buttons */}
                <div className="mt-4 flex flex-col space-y-2">
                  <button 
                    className="flex items-center justify-center p-2 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-sm"
                    onClick={handleShowWizard}
                  >
                    <Command size={14} className="mr-2" />
                    Voice Commands
                  </button>
                  <button 
                    className="flex items-center justify-center p-2 rounded-md bg-neutral-dark hover:bg-neutral-light/10 text-white text-sm"
                    onClick={() => {
                      // Logic to generate and deploy DAO 
                      alert('DAO configuration completed. Ready to deploy!');
                    }}
                  >
                    <CheckCircle size={14} className="mr-2" />
                    Complete Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat area below the canvas - ALWAYS visible */}
      <div className="mb-6 border border-neutral-light/10 rounded-lg bg-neutral-dark overflow-hidden flex flex-col chat-area">
        <div className="p-3 border-b border-neutral-light/10 flex justify-between items-center">
          <h3 className="text-white font-medium flex items-center">
            <Bot size={16} className="text-primary mr-2" />
            AI Assistant
          </h3>
          <div className="flex items-center space-x-2">
            {/* Add Node Management Help Button */}
            <button 
              className="text-xs bg-primary/20 hover:bg-primary/30 px-2 py-1 rounded flex items-center text-primary"
              onClick={() => {
                logger.ui('🖱️', 'Node Management button clicked');
                handleNodeManagementHelp();
              }}
            >
              <Command size={14} className="mr-1 inline-block" />
              Node Management
            </button>
            <button 
              className="text-xs bg-neutral/50 hover:bg-neutral px-2 py-1 rounded text-neutral-light"
              onClick={() => {
                logger.ui('🖱️', 'View Generated Code button clicked');
                setShowCodePreview(!showCodePreview);
              }}
            >
              <FileCode size={14} className="mr-1 inline-block" />
              View Generated Code
            </button>
            
            {/* Add a button to add a welcome message manually */}
            <button 
              className="text-xs bg-primary/20 hover:bg-primary/30 px-2 py-1 rounded text-primary"
              onClick={() => {
                logger.ui('🖱️', 'Start Chat button clicked');
                const welcomeMessage = {
                  id: `ai-welcome-${Date.now()}`,
                  role: 'ai' as 'ai', 
                  content: `# Welcome to the DAO Configuration Wizard! 👋\n\nI'll guide you through setting up your DAO step by step.\n\n**How it works:**\n\n1. Click on any configuration step in the right sidebar when wizard is open\n2. Answer questions about your DAO configuration\n3. Your answers will create smart contract nodes in the builder\n\nYou can also directly chat with me below to configure your DAO!`
                };
                
                setChatMessages([welcomeMessage]);
                logger.success('✅', 'Welcome message added to chat');
              }}
            >
              <Bot size={14} className="mr-1 inline-block" />
              Start Chat
            </button>
          </div>
        </div>
        
        {/* Voice status indicator */}
        {(isPlaying || isRecording) && (
          <div className="p-2 bg-neutral-dark border-b border-neutral-light/10">
            <div className="flex items-center text-sm">
              {isPlaying && (
                <div className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1">
                  <Volume2 size={14} className="animate-pulse mr-2" />
                  <span>AI speaking...</span>
                </div>
              )}
              {isRecording && (
                <div className="flex items-center bg-red-500/10 text-red-500 rounded-full px-3 py-1">
                  <Mic size={14} className="animate-pulse mr-2" />
                  <span>Listening: {userResponse.substring(0, 20)}{userResponse.length > 20 ? '...' : ''}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Voice status indicator - using only React state */}
        {(isPlaying || (isRecording && showListeningIndicator)) && (
          <div className="p-2 bg-neutral-dark border-b border-neutral-light/10">
            <div className="flex items-center text-sm">
              {isPlaying && (
                <div className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1">
                  <Volume2 size={14} className="animate-pulse mr-2" />
                  <span>AI speaking...</span>
                </div>
              )}
              {isRecording && showListeningIndicator && (
                <div className="flex items-center bg-red-500/10 text-red-500 rounded-full px-3 py-1">
                  <Mic size={14} className="animate-pulse mr-2" />
                  <span>Listening: {speechTranscript?.substring(0, 20)}{speechTranscript?.length > 20 ? '...' : ''}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Integrated chat interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            messages={chatMessages}
            currentPlayingMessageId={currentPlayingMessageId}
            isRecording={isRecording}
            onPlayMessage={(messageId) => {
              const message = chatMessages.find(m => m.id === messageId);
              if (message && message.role === 'ai') {
                playVoiceMessage(messageId, message.content);
              }
            }}
            onSubmitResponse={(response) => {
              if (response.trim()) {
                processUserResponse(response);
              }
            }}
            nodeEditorRef={nodeEditorRef}
          />
        </div>
        
        {/* Input area */}
        <div className="p-3 border-t border-neutral-light/10">
          <form className="flex items-center" onSubmit={(e) => {
            e.preventDefault();
            const input = document.getElementById('chat-input') as HTMLInputElement;
            if (input && input.value.trim()) {
              processUserResponse(input.value);
              input.value = '';
            }
          }}>
            <input
              id="chat-input"
              type="text"
              className={`flex-1 bg-neutral-dark border border-neutral-light/20 rounded-l-md p-2 text-white text-sm ${isRecording ? 'border-red-500 bg-red-500/5 animate-pulse' : ''}`}
              placeholder={isRecording ? "Listening..." : "Type your response..."}
              disabled={isPlaying}
            />
            <div className="flex bg-neutral-dark border border-l-0 border-neutral-light/20 rounded-r-md">
              <button
                type="button"
                className={`p-2 ${isRecording ? 'text-red-500 animate-pulse' : 'text-primary/60 hover:text-primary'}`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isPlaying}
                title={isRecording ? 'Stop recording' : 'Start recording'}
              >
                <Mic size={18} />
              </button>
              <button
                type="submit"
                className="bg-primary text-white p-2 rounded-r-md hover:bg-primary-dark"
                disabled={isPlaying}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Code Preview Modal using React state */}
      {showCodePreview && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCodePreview(false)}
        >
          <div 
            className="bg-neutral-dark rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal content */}
            <div className="p-4 border-b border-neutral-light/10 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Generated Code</h2>
              <button 
                className="text-neutral-light hover:text-white"
                onClick={() => setShowCodePreview(false)}
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(80vh-8rem)]">
              <pre className="text-sm bg-neutral-darker p-4 rounded-md overflow-x-auto">
                <code>
                  {generateContractCode()}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}
      
      {/* Wizard toggle button */}
      <div className="flex justify-end mb-6">
        <button 
          className={`btn ${wizardMode !== 'hidden' ? 'btn-primary' : 'btn-outline'} flex items-center`}
          onClick={handleShowWizard}
        >
          {wizardMode !== 'hidden' ? (
            <>
              <X size={16} className="mr-2" />
              <span>Close AI Wizard</span>
            </>
          ) : (
            <>
              <Bot size={16} className="mr-2" />
              <span>Open AI Wizard</span>
            </>
          )}
        </button>
      </div>

      <h2 className="text-h2 mb-md">Active Contracts</h2>
      
      <div className="space-y-sm mb-xl">
        {activeContracts.map(contract => (
          <div 
            key={contract.id} 
            className="flex items-center justify-between gap-md p-md border border-neutral-light/10 rounded-lg bg-neutral-dark"
          >
            <div className="flex items-center">
              <div className="cursor-move p-2 mr-md">
                <GripHorizontal size={20} className="text-neutral-light" />
              </div>
              
              {/* Icon */}
              <div 
                className="w-10 h-10 rounded-full mr-md flex items-center justify-center"
                style={{ backgroundColor: getContractTypeColor(contract.type) }}
              >
                {getContractTypeIcon(contract.type)}
              </div>
              
              {/* Contract Info */}
              <div>
                <h3 className="text-white font-medium">{contract.name}</h3>
                {contract.deployedAddress ? (
                  <div className="text-xs text-neutral-light flex items-center mt-1">
                    <span className="bg-green-500/20 text-green-400 px-1 rounded text-xs mr-2">Deployed</span>
                    Address: {contract.deployedAddress.substring(0, 6)}...{contract.deployedAddress.substring(contract.deployedAddress.length - 4)}
                  </div>
                ) : (
                  <div className="text-xs text-neutral-light mt-1">
                    Primary governance contract for the DAO
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-md">
              <button 
                className="btn-icon-subtle mr-xs"
                onClick={() => handleEditContract(contract.id)}
              >
                <Settings size={18} />
              </button>
              <button 
                className="btn-outline"
                onClick={() => handleDeployContract(contract.id)}
              >
                Deploy
              </button>
            </div>
          </div>
        ))}

        {activeContracts.length === 0 && (
          <div className="bg-neutral-dark rounded-lg p-lg text-center">
            <Shield size={36} className="text-neutral-light mb-md opacity-50 mx-auto" />
            <p className="text-neutral-light mb-md">No contracts added yet</p>
            <button 
              className="btn-primary flex items-center mx-auto"
              onClick={() => setIsAddingContract(true)}
            >
              <PlusCircle size={16} className="mr-xs" />
              <span>Add Your First Contract</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Add Contract Modal */}
      {isAddingContract && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-md">
          <div className="bg-neutral-dark rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-lg">
              <div className="flex justify-between items-center mb-lg">
                <h2 className="text-h3">Add Contract</h2>
                <button 
                  className="text-neutral-light hover:text-white"
                  onClick={() => setIsAddingContract(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {contractTemplates.map(template => (
                  <div 
                    key={template.id}
                    className="bg-neutral p-md rounded-lg border border-neutral-light/10 hover:border-primary cursor-pointer transition-colors"
                    onClick={() => handleAddContract(template.type)}
                  >
                    <div className="flex items-center mb-sm">
                      {template.icon}
                      <h3 className="text-h4 ml-sm">{template.name}</h3>
                    </div>
                    <p className="text-sm text-neutral-light">{template.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-lg">
                <button 
                  className="btn-secondary mr-md"
                  onClick={() => setIsAddingContract(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Node creation feedback toast */}
      {nodeCreationFeedback && (
        <div className="fixed top-20 right-5 bg-green-500 text-white py-2 px-4 rounded shadow-lg animate-fade-in-out">
          ✅ {nodeCreationFeedback}
        </div>
      )}

      {/* ElevenLabs Settings Modal */}
      {showElevenLabsSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-md">
          <div className="bg-neutral-dark rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-lg">
              <div className="flex justify-between items-center mb-lg">
                <h2 className="text-h3">ElevenLabs Voice Settings</h2>
                <button 
                  className="text-neutral-light hover:text-white"
                  onClick={() => setShowElevenLabsSettings(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-md">
                <div>
                  <label className="block text-sm font-medium text-neutral-light mb-xs">
                    ElevenLabs API Key
                  </label>
                  <input
                    type="password"
                    value={elevenlabsApiKey}
                    onChange={(e) => setElevenlabsApiKey(e.target.value)}
                    placeholder="Enter your ElevenLabs API key"
                    className="w-full bg-neutral p-sm rounded-md border border-neutral-light/20 text-white"
                  />
                  <p className="text-xs text-neutral-light mt-xs">
                    You can get your API key from your <a href="https://elevenlabs.io/app/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ElevenLabs dashboard</a>.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-light mb-xs">
                    Voice ID
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={elevenlabsVoiceId}
                      onChange={(e) => setElevenlabsVoiceId(e.target.value)}
                      className="flex-1 bg-neutral p-sm rounded-md border border-neutral-light/20 text-white"
                      disabled={isLoadingVoices}
                    >
                      <option value="">Select a voice</option>
                      {voices.map((voice) => (
                        <option key={voice.voice_id} value={voice.voice_id}>
                          {voice.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={loadElevenLabsVoices}
                      disabled={!elevenlabsApiKey || isLoadingVoices}
                      className="bg-primary text-white p-sm rounded-md disabled:opacity-50"
                    >
                      {isLoadingVoices ? 'Loading...' : 'Load Voices'}
                    </button>
                  </div>
                  {!voices.length && !isLoadingVoices && (
                    <p className="text-xs text-neutral-light mt-xs">
                      Enter your API key and click "Load Voices" to see available voices.
                    </p>
                  )}
                </div>
                
                <div className="pt-md">
                  <button
                    onClick={testElevenLabsVoice}
                    disabled={!elevenlabsApiKey || !elevenlabsVoiceId || isTestingVoice}
                    className="bg-primary text-white p-sm rounded-md mr-sm disabled:opacity-50"
                  >
                    {isTestingVoice ? 'Testing...' : 'Test Voice'}
                  </button>
                  <button
                    onClick={saveElevenLabsSettings}
                    className="bg-green-600 text-white p-sm rounded-md disabled:opacity-50"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Governance; 