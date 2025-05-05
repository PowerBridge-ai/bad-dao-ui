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

const Governance: React.FC<GovernanceProps> = () => {
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
  const [wizardMode, setWizardMode] = useState<string>('hidden');

  // Add voice workflow states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [userResponse, setUserResponse] = useState<string>('');
  const [currentPlayingMessageId, setCurrentPlayingMessageId] = useState<string | null>(null);
  
  // Speech recognition reference
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
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

  useEffect(() => {
    // Fetch active contracts
    fetchContracts();
  }, [daoId]);

  useEffect(() => {
    // Listen for URL changes to determine if we should show the wizard
    if (window.location.pathname.includes('/wizard')) {
      setWizardMode('sidebar');
    }
  }, [window.location.pathname]);

  const fetchContracts = async () => {
    try {
      // Mock data - in a real app, this would be fetched from your API
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
    } catch (error) {
      console.error('Error fetching contracts:', error);
      // Handle error state
    }
  };

  const handleAddContract = (type: ContractType) => {
    // Implementation would add a contract to active contracts
    console.log('Adding contract of type:', type);
    setIsAddingContract(false);
  };

  const handleRemoveContract = (contractId: string) => {
    // Implementation would remove a contract
    console.log('Removing contract:', contractId);
    setActiveContracts(prev => prev.filter(c => c.id !== contractId));
  };

  const handleEditContract = (contractId: string) => {
    // Implementation would open the contract editor
    console.log('Editing contract:', contractId);
  };

  const handleDeployContract = (contractId: string) => {
    // Implementation would deploy a contract
    console.log('Deploying contract:', contractId);
    
    // Update the contract to show it's deployed
    setActiveContracts(prev => prev.map(c => 
      c.id === contractId 
        ? { ...c, deployedAddress: '0x' + Math.random().toString(16).substring(2, 14) } 
        : c
    ));
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
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition as any;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        // Update the userResponse state and chat input field
        setUserResponse(transcript);
        
        // Also update the input field directly for immediate feedback
        const chatInput = document.getElementById('chat-input') as HTMLInputElement;
        if (chatInput) {
          chatInput.value = transcript;
        }
        
        // Reset the silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        
        // Set a new silence timer to automatically submit after pause
        silenceTimerRef.current = setTimeout(() => {
          if (isRecording && transcript.trim() !== '') {
            stopRecording();
            processUserResponse(transcript);
          }
        }, 2000); // 2 seconds of silence to auto-submit
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  // Start recording function
  const startRecording = () => {
    if (!recognitionRef.current) return;
    
    try {
      // Clear any previous user response
      setUserResponse('');
      
      // Also clear the input field
      const chatInput = document.getElementById('chat-input') as HTMLInputElement;
      if (chatInput) {
        chatInput.value = '';
        chatInput.placeholder = 'Listening...';
        chatInput.classList.add('listening');
      }
      
      // Don't start recording if audio is playing
      if (isPlaying) {
        console.log('Cannot start recording while audio is playing');
        return;
      }
      
      setIsRecording(true);
      recognitionRef.current.start();
      console.log('Speech recognition started');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      setIsRecording(false);
      console.log('Speech recognition stopped');
      
      // Reset input field appearance
      const chatInput = document.getElementById('chat-input') as HTMLInputElement;
      if (chatInput) {
        chatInput.placeholder = 'Type your response...';
        chatInput.classList.remove('listening');
      }
      
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  // Process user response after speech recognition
  const processUserResponse = (response: string) => {
    if (!response.trim()) return;
    
    console.log('Processing user response:', response);
    
    // Reset the input placeholder
    const chatInput = document.getElementById('chat-input') as HTMLInputElement;
    if (chatInput) {
      chatInput.placeholder = 'Type your response...';
    }
    
    // Create user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as 'user',
      content: response.trim()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Update wizard data with the step completed
    const currentStepId = getCurrentStepFromResponse(response);
    
    if (currentStepId) {
      setWizardData(prev => ({
        ...prev,
        [currentStepId]: response.trim(),
        [`${currentStepId}-completed`]: true
      }));
      
      // Generate AI feedback based on response
      generateAIFeedback(response, currentStepId);
    }
  };

  // Get current step from user response context
  const getCurrentStepFromResponse = (response: string): string | null => {
    // This is a placeholder - in a real implementation, you'd track the current step
    // For now, try to find which step was most recently started
    const steps = ['project-context', 'token-design', 'roles-permissions', 'voting-mechanics', 'proposal-rules', 'treasury-management'];
    
    for (const step of steps) {
      if (wizardData[`${step}-started`] && !wizardData[`${step}-completed`]) {
        return step;
      }
    }
    
    return null;
  };

  // Generate AI feedback
  const generateAIFeedback = (userResponse: string, stepId: string) => {
    // Simple default responses based on step
    let aiResponse = 'Thank you for your input!';
    let nextStepId = '';
    
    // Determine next step based on current step
    if (stepId === 'project-context') {
      aiResponse = `Thanks for explaining your project! Now let's talk about your token design.`;
      nextStepId = 'token-design';
    } else if (stepId === 'token-design') {
      aiResponse = `Great token setup! Now let's configure the roles and permissions for your DAO.`;
      nextStepId = 'roles-permissions';
    } else if (stepId === 'roles-permissions') {
      aiResponse = `Those roles make sense. Let's set up your voting mechanics next.`;
      nextStepId = 'voting-mechanics';
    } else if (stepId === 'voting-mechanics') {
      aiResponse = `Perfect voting setup! Now let's define who can create proposals and what's required.`;
      nextStepId = 'proposal-rules';
    } else if (stepId === 'proposal-rules') {
      aiResponse = `Excellent proposal rules! Finally, let's talk about treasury management.`;
      nextStepId = 'treasury-management';
    } else if (stepId === 'treasury-management') {
      aiResponse = `Great! We've now completed the configuration of your DAO. You can review all settings or make changes as needed.`;
    }
    
    // Add AI message to chat
    const aiMessage = {
      id: `ai-${Date.now()}`,
      role: 'ai' as 'ai',
      content: aiResponse
    };
    
    setChatMessages(prev => [...prev, aiMessage]);
    
    // Use ElevenLabs to read the response
    playVoiceMessage(aiMessage.id, aiResponse);
    
    // If there's a next step, queue it up
    if (nextStepId) {
      setTimeout(() => {
        startWorkflowStep(nextStepId, getPromptForStep(nextStepId));
      }, 1000); // Slight delay before starting next step
    }
  };

  // Get the prompt question for a given step
  const getPromptForStep = (stepId: string): string => {
    switch (stepId) {
      case 'project-context':
        return "Let's start with your project. What is your DAO about, and what is its primary purpose?";
      case 'token-design':
        return "Will your governance use a token? If yes, what will the token be called?";
      case 'roles-permissions':
        return "Who are the participants in your DAO and what roles will they have? (e.g., token holders, delegates, admins, council members, etc.)";
      case 'voting-mechanics':
        return "How should voting work in your DAO? (E.g., how long do votes last, what % of votes are needed to pass, etc.)";
      case 'proposal-rules':
        return "Who can create proposals and what's required for a proposal to go live?";
      case 'treasury-management':
        return "Will your DAO have a treasury? If yes, who can access or vote on fund allocations?";
      default:
        return "Please tell me more about this aspect of your DAO.";
    }
  };

  // Play voice message using elevenlabs
  const playVoiceMessage = async (messageId: string, text: string) => {
    try {
      // Stop any recording first
      if (isRecording) {
        stopRecording();
      }
      
      setIsPlaying(true);
      setCurrentPlayingMessageId(messageId);
      
      // Get API key and voice ID from localStorage
      const apiKey = localStorage.getItem('elevenlabsApiKey') || '';
      const voiceId = localStorage.getItem('elevenlabsVoiceId') || '';
      
      if (!apiKey || !voiceId) {
        console.error('ElevenLabs API key or voice ID not configured');
        alert('Please configure ElevenLabs voice settings to enable AI voice.');
        setIsPlaying(false);
        return;
      }
      
      // Initialize service with API key
      elevenlabsService.initElevenLabsService(apiKey);
      
      // Speak the text
      await elevenlabsService.speak(text, voiceId);
      
      console.log('Speech playback completed');
      
      // Reset states
      setIsPlaying(false);
      setCurrentPlayingMessageId(null);
      
      // Focus the input field and start recording after a short delay
      setTimeout(() => {
        // Find and focus the chat input
        const chatInput = document.getElementById('chat-input') as HTMLInputElement;
        if (chatInput) {
          chatInput.focus();
          chatInput.placeholder = 'Listening...';
        }
        
        startRecording();
      }, 500);
      
    } catch (error) {
      console.error('Error playing voice message:', error);
      setIsPlaying(false);
      setCurrentPlayingMessageId(null);
    }
  };

  // Start the workflow step by adding a question to chat and activating voice
  const startWorkflowStep = (stepId: string, question: string) => {
    // Add AI message to chat with the question
    const aiMessage = {
      id: `ai-${Date.now()}`,
      role: 'ai' as 'ai',
      content: question
    };
    
    setChatMessages(prev => [...prev, aiMessage]);
    
    // Store that this step was started
    setWizardData(prev => ({
      ...prev,
      [`${stepId}-started`]: true
    }));
    
    // Play the voice message, which will automatically start recording after
    playVoiceMessage(aiMessage.id, question);
    
    // Scroll chat area into view
    const chatArea = document.querySelector('.chat-area');
    if (chatArea) {
      chatArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Show visual connection between workflow and chat
    showWorkflowConnection(stepId);
    
    console.log(`Started workflow step: ${stepId} with question: ${question}`);
  };

  // Show visual connection between workflow step and chat
  const showWorkflowConnection = (stepId: string) => {
    // First reset any active connections
    document.querySelectorAll('.step-active-indicator').forEach(el => {
      el.classList.remove('step-active-indicator');
    });
    
    // Add active indicator to the current step
    const stepElement = document.getElementById(`step-${stepId}`);
    if (stepElement) {
      stepElement.classList.add('step-active-indicator');
    }
  };

  const handleWizardComplete = (wizardData: any) => {
    console.log('Wizard completed with data:', wizardData);
    
    // Store the wizard data for code generation
    setWizardData(wizardData);
    
    // Here you would process the wizard data to create actual contract nodes
    // in the contract builder interface. For example:
    // - Create a token node if token data was provided
    // - Create a governance node if governance settings were provided
    // - Add connections between them
    
    // Hide the wizard after completion
    setWizardMode('hidden');
    
    // Process the wizard data and update active contracts as needed
    // This is simplified - in a real implementation you'd map wizard data to contracts
    const newContracts: ActiveContract[] = [];
    
    if (wizardData['token-design']) {
      newContracts.push({
        id: `token-${Date.now()}`,
        templateId: 'token-template-1',
        name: wizardData['token-design'] || 'DAO Token',
        type: 'token',
        description: 'Governance token created via wizard',
        isDeployed: false,
        configuration: {
          name: wizardData['token-design'],
          symbol: wizardData['token-design'].substring(0, 4).toUpperCase(),
          decimals: '18',
          initialSupply: '1000000'
        }
      });
    }
    
    if (wizardData['governance-settings']) {
      newContracts.push({
        id: `governance-${Date.now()}`,
        templateId: 'gov-template-1',
        name: 'Governance Contract',
        type: 'governance',
        description: 'Governance contract created via wizard',
        isDeployed: false,
        configuration: {
          votingPeriod: '3 days',
          quorum: '20%',
          proposalThreshold: '1%'
        }
      });
    }
    
    setActiveContracts(prev => [...prev, ...newContracts]);
  };

  const getContractTypeColor = (type: ContractType) => {
    switch (type) {
      case 'governance':
        return 'bg-primary';
      case 'token':
        return 'bg-primary';
      case 'vesting':
        return 'bg-primary';
      case 'delegation':
        return 'bg-primary';
      case 'ai':
        return 'bg-primary';
      case 'treasury':
        return 'bg-primary';
      default:
        return 'bg-neutral';
    }
  };

  const getContractTypeIcon = (type: ContractType) => {
    switch (type) {
      case 'governance':
        return <Shield size={20} className="text-primary" />;
      case 'token':
        return <Coins size={20} className="text-primary" />;
      case 'vesting':
        return <Clock size={20} className="text-primary" />;
      case 'delegation':
        return <Users size={20} className="text-primary" />;
      case 'ai':
        return <Bot size={20} className="text-primary" />;
      case 'treasury':
        return <Wallet size={20} className="text-primary" />;
      default:
        return null;
    }
  };

  // Toggle the governance wizard
  const handleShowWizard = () => {
    setWizardMode(wizardMode === 'hidden' ? 'sidebar' : 'hidden');
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
                            ? 'bg-primary/20' 
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
                            <CheckCircle size={16} className="text-green-400" />
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
                  
                  {/* Middle panel - Voice Status Indicator */}
                  {(isPlaying || isRecording) && (
                    <div className="mb-3 p-2 bg-neutral-dark rounded-md border border-neutral-light/10">
                      <div className="flex items-center text-sm">
                        {isPlaying && (
                          <>
                            <Volume2 size={16} className="text-primary animate-pulse mr-2" />
                            <span className="text-white">AI speaking...</span>
                          </>
                        )}
                        {isRecording && (
                          <>
                            <Mic size={16} className="text-red-500 animate-pulse mr-2" />
                            <span className="text-white">Listening: {userResponse || "..."}</span>
                          </>
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
                    onClick={() => setWizardMode(wizardMode === 'hidden' ? 'sidebar' : 'hidden')}
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
      
      {/* Chat area below the canvas - Only visible when wizard is active */}
      {wizardMode !== 'hidden' && (
        <div className="mb-6 border border-neutral-light/10 rounded-lg bg-neutral-dark overflow-hidden flex flex-col chat-area">
          <div className="p-3 border-b border-neutral-light/10 flex justify-between items-center">
            <h3 className="text-white font-medium flex items-center">
              <Bot size={16} className="text-primary mr-2" />
              AI Assistant
            </h3>
            <div className="flex items-center space-x-2">
              <button 
                className="text-xs bg-neutral/50 hover:bg-neutral px-2 py-1 rounded text-neutral-light"
                id="show-code-btn"
                onClick={() => {
                  // Toggle code preview modal
                  const codeModal = document.getElementById('code-preview-modal');
                  if (codeModal) {
                    codeModal.style.display = codeModal.style.display === 'none' ? 'flex' : 'none';
                  }
                }}
              >
                <FileCode size={14} className="mr-1 inline-block" />
                View Generated Code
              </button>
            </div>
          </div>
          
          {/* Chat messages area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[250px]">
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
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
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
                  disabled={isPlaying || !userResponse.trim()}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
            
            {/* Voice status indicator */}
            {isPlaying && (
              <div className="mt-2 flex items-center text-xs">
                <Volume2 size={14} className="text-primary animate-pulse mr-2" />
                <span className="text-neutral-light">AI speaking...</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Code Preview Modal */}
      <div 
        id="code-preview-modal" 
        className="fixed inset-0 bg-black/80 justify-center items-center z-50 p-4 hidden"
        onClick={(e) => {
          // Close modal when clicking outside
          if ((e.target as HTMLElement).id === 'code-preview-modal') {
            const modal = document.getElementById('code-preview-modal');
            if (modal) modal.style.display = 'none';
          }
        }}
      >
        <div className="bg-neutral-dark rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-xl">
          <div className="p-4 border-b border-neutral-light/10 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <FileCode size={20} className="text-primary mr-2" />
              Generated Contract Code
            </h3>
            <button
              onClick={() => {
                const modal = document.getElementById('code-preview-modal');
                if (modal) modal.style.display = 'none';
              }}
              className="text-neutral-light hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-4 overflow-auto bg-neutral h-full">
            <pre className="text-sm text-primary font-mono whitespace-pre-wrap">
              {generateContractCode()}
            </pre>
          </div>
          <div className="p-4 border-t border-neutral-light/10 flex justify-end">
            <button 
              className="bg-neutral hover:bg-neutral-light/20 text-neutral-light px-4 py-2 rounded mr-2"
              onClick={() => {
                const modal = document.getElementById('code-preview-modal');
                if (modal) modal.style.display = 'none';
              }}
            >
              Close
            </button>
            <button 
              className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded"
              onClick={() => {
                // Copy code to clipboard
                const code = generateContractCode();
                navigator.clipboard.writeText(code)
                  .then(() => {
                    // Create temporary success message
                    const copyBtn = document.activeElement as HTMLButtonElement;
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = '✓ Copied!';
                    setTimeout(() => {
                      copyBtn.textContent = originalText;
                    }, 2000);
                  })
                  .catch(err => {
                    console.error('Failed to copy code: ', err);
                    alert('Failed to copy code to clipboard');
                  });
              }}
            >
              Copy Code
            </button>
          </div>
        </div>
      </div>
      
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
    </div>
  );
};

export default Governance; 