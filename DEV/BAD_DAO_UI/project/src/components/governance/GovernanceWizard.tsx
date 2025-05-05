import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Circle, 
  HelpCircle, 
  X, 
  ChevronRight, 
  Bot, 
  Mic, 
  Volume2, 
  Lightbulb,
  Cpu,
  Users,
  Building2,
  CoinsIcon,
  VoteIcon,
  ClipboardList,
  UserPlus,
  FileCode,
  Briefcase,
  AlertCircle,
  Calendar,
  Box,
  Play,
  Pause,
  SkipForward,
  Info,
  Command,
  Settings
} from 'lucide-react';
import elevenlabsService from '../../services/elevenlabsService';
import ElevenLabsConfig from './ElevenLabsConfig';

// Define the DAO Type and Step interfaces
type DAOType = 'standard' | 'project' | 'corporate';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  fallbackPrompt: string;
  options?: string[];
  required: boolean;
  category: 'fundamental' | 'optional';
}

// Define chat message structure
interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  content: string;
  isPlaying?: boolean;
}

// Voice command interface
interface VoiceCommand {
  command: string;
  description: string;
  action: string;
}

// Define the governance wizard component props
interface GovernanceWizardProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
  onChatUpdate?: (messages: ChatMessage[]) => void;
}

const GovernanceWizard: React.FC<GovernanceWizardProps> = ({ onComplete, onCancel, onChatUpdate }) => {
  // State to track wizard progress and data
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [daoType, setDaoType] = useState<DAOType>('standard');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [wizardData, setWizardData] = useState<Record<string, any>>({});
  const [userResponse, setUserResponse] = useState<string>('');
  const [aiMessage, setAiMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showVoiceCommands, setShowVoiceCommands] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentPlayingMessageId, setCurrentPlayingMessageId] = useState<string | null>(null);
  
  // Voice config state
  const [showVoiceConfig, setShowVoiceConfig] = useState<boolean>(false);
  const [voiceApiKey, setVoiceApiKey] = useState<string>(localStorage.getItem('elevenlabsApiKey') || '');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(localStorage.getItem('elevenlabsVoiceId') || '');
  
  // References
  const inputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Voice commands
  const voiceCommands: VoiceCommand[] = [
    { command: "help", description: "Show voice commands help", action: "Opens voice command help sheet" },
    { command: "next step", description: "Move to next step", action: "Navigates to the next step in the wizard" },
    { command: "previous step", description: "Move to previous step", action: "Navigates to the previous step" },
    { command: "pause", description: "Pause voice interaction", action: "Pauses current voice playback or recording" },
    { command: "resume", description: "Resume voice interaction", action: "Resumes voice playback or recording" },
    { command: "repeat", description: "Repeat current message", action: "Replays the current AI message" },
    { command: "skip", description: "Skip current message", action: "Skips to the next part without answering" },
    { command: "I don't know", description: "Get suggestions", action: "Shows suggestions for the current step" },
    { command: "disable voice", description: "Turn off voice mode", action: "Disables voice interaction" },
    { command: "enable voice", description: "Turn on voice mode", action: "Enables voice interaction" },
    { command: "close", description: "Close current popup", action: "Closes any open popup or modal" },
    { command: "submit", description: "Submit current response", action: "Submits your current answer" }
  ];

  // Define steps based on the structure in bad-dao-voice-layer-chat-dev.md
  const standardSteps: WizardStep[] = [
    {
      id: 'project-context',
      title: 'Project Context',
      description: 'Define your DAO\'s purpose',
      icon: <Lightbulb size={20} />,
      prompt: "Let's start with your project. What is your DAO about, and what is its primary purpose?",
      fallbackPrompt: "Here are some common DAO types to choose from. Pick the one that best describes your project—or feel free to describe it in your own words.",
      options: [
        "Protocol DAO (governs a blockchain/protocol)",
        "Investment DAO (pools funds to invest)",
        "Grant DAO (distributes funds for grants)",
        "Service DAO (delivers services to clients)",
        "Social DAO (built around communities/interests)",
        "Collector DAO (NFT or asset acquisition)"
      ],
      required: true,
      category: 'fundamental'
    },
    {
      id: 'token-design',
      title: 'Token Design',
      description: 'Configure your governance token',
      icon: <CoinsIcon size={20} />,
      prompt: "Will your governance use a token? If yes, what will the token be called?",
      fallbackPrompt: "Most DAOs use a token to represent voting power. Would you like help choosing between the following options?",
      options: [
        "Use ERC-20 token for voting",
        "Use reputation-based voting (no token, score-based)",
        "Use NFT-based governance (each NFT = 1 vote)",
        "Hybrid (tokens + activity-based reputation)"
      ],
      required: true,
      category: 'fundamental'
    },
    {
      id: 'roles-permissions',
      title: 'Roles & Permissions',
      description: 'Define participants and roles',
      icon: <Users size={20} />,
      prompt: "Who are the participants in your DAO and what roles will they have? (e.g., token holders, delegates, admins, council members, etc.)",
      fallbackPrompt: "Here are some roles you might want to include. Pick what makes sense for your DAO or modify as needed.",
      options: [
        "Token Holders – can vote",
        "Proposers – can create proposals",
        "Delegates – can vote on behalf of others",
        "Admins – optional trusted role with special permissions",
        "Multisig Signers – execute critical actions"
      ],
      required: true,
      category: 'fundamental'
    },
    {
      id: 'voting-mechanics',
      title: 'Voting Mechanics',
      description: 'Configure voting rules',
      icon: <VoteIcon size={20} />,
      prompt: "How should voting work in your DAO? (E.g., how long do votes last, what % of votes are needed to pass, etc.)",
      fallbackPrompt: "Here are common default settings. You can change them later:",
      options: [
        "Voting Duration: 3 days",
        "Quorum Required: 20% of total tokens must participate",
        "Passing Threshold: 50% of votes must approve",
        "One Token = One Vote: Yes / No",
        "Allow Delegation?: Yes / No"
      ],
      required: true,
      category: 'fundamental'
    },
    {
      id: 'proposal-rules',
      title: 'Proposal Rules',
      description: 'Define proposal creation rules',
      icon: <ClipboardList size={20} />,
      prompt: "Who can create proposals and what's required for a proposal to go live?",
      fallbackPrompt: "Here are some suggested setups:",
      options: [
        "Any token holder can propose",
        "Only holders with X tokens can propose (e.g., 1000 tokens)",
        "Proposal must be seconded (endorsed by others)",
        "Proposal fee to prevent spam (e.g., 10 tokens)"
      ],
      required: true,
      category: 'fundamental'
    },
    {
      id: 'treasury-management',
      title: 'Treasury Management',
      description: 'Configure treasury access',
      icon: <Briefcase size={20} />,
      prompt: "Will your DAO have a treasury? If yes, who can access or vote on fund allocations?",
      fallbackPrompt: "Most DAOs use a treasury contract controlled by governance. Pick a starting setup:",
      options: [
        "Funds released via proposals",
        "Multi-signature wallet (e.g., Gnosis Safe)",
        "Community-approved budget cycles",
        "Admin-controlled (for early-stage DAOs only)"
      ],
      required: true,
      category: 'fundamental'
    },
    {
      id: 'emergency-mechanisms',
      title: 'Emergency Mechanisms',
      description: 'Define emergency controls',
      icon: <AlertCircle size={20} />,
      prompt: "Would you like an emergency shutdown or override mechanism in case something goes wrong?",
      fallbackPrompt: "Here are common options for fail-safes:",
      options: [
        "Multisig-controlled pause function",
        "Admin with limited override powers",
        "No emergency controls (fully decentralized from day one)"
      ],
      required: false,
      category: 'optional'
    },
    {
      id: 'contract-options',
      title: 'Contract Framework',
      description: 'Choose contract implementation',
      icon: <FileCode size={20} />,
      prompt: "Do you want to deploy using a pre-built governance framework like OpenZeppelin, DAOstack, or Tally-compatible Governor Bravo?",
      fallbackPrompt: "These are common smart contract templates you could start from:",
      options: [
        "OpenZeppelin Governor – well-audited, modular",
        "DAOstack (Alchemy) – reputation-based DAOs",
        "MolochDAO v2 – simple & minimal, membership-based",
        "Aragon DAO – UI-driven setup",
        "Tally-compatible Governor Bravo – flexible, powerful"
      ],
      required: true,
      category: 'fundamental'
    },
    {
      id: 'reputation-systems',
      title: 'Reputation Systems',
      description: 'Add reputation mechanisms',
      icon: <UserPlus size={20} />,
      prompt: "Would you like to implement a reputation system separate from token holdings?",
      fallbackPrompt: "Here are reputation options to consider:",
      options: [
        "Activity-based reputation that accumulates over time",
        "Quality-based reputation from peer reviews",
        "Contribution-based reputation from metrics",
        "No separate reputation system needed"
      ],
      required: false,
      category: 'optional'
    },
    {
      id: 'automation',
      title: 'Automation Setup',
      description: 'Configure automated processes',
      icon: <Cpu size={20} />,
      prompt: "Would you like to automate any aspects of your DAO governance?",
      fallbackPrompt: "Here are common automation options:",
      options: [
        "Automated treasury distributions",
        "Scheduled proposal cycles",
        "Automated reporting and analytics",
        "Smart contract triggered events",
        "No automation needed at this time"
      ],
      required: false,
      category: 'optional'
    }
  ];

  // Project DAO specific steps
  const projectDaoSteps: WizardStep[] = [
    ...standardSteps,
    {
      id: 'project-deliverable',
      title: 'Project Deliverable',
      description: 'Define project outcome',
      icon: <Box size={20} />,
      prompt: "What specific outcome or deliverable will your DAO fund or produce?",
      fallbackPrompt: "Here are some common project DAO deliverables:",
      options: [
        "Software product or application",
        "Research report or dataset",
        "Media production or content",
        "Physical product or hardware",
        "Service or support system"
      ],
      required: true,
      category: 'fundamental'
    },
    {
      id: 'project-lifespan',
      title: 'Project Lifespan',
      description: 'Define DAO lifecycle',
      icon: <Calendar size={20} />,
      prompt: "Is your Project DAO intended to dissolve or convert once the project is complete?",
      fallbackPrompt: "Here are typical options for Project DAO lifecycles:",
      options: [
        "Dissolve after project completion",
        "Convert to maintenance DAO after delivery",
        "Evolve into a service DAO",
        "Continue as an ongoing organization"
      ],
      required: true,
      category: 'fundamental'
    }
  ];

  // Corporate DAO specific steps
  const corporateDaoSteps: WizardStep[] = [
    ...standardSteps,
    {
      id: 'corporate-structure',
      title: 'Corporate Structure',
      description: 'Define org structure',
      icon: <Building2 size={20} />,
      prompt: "Do you want a full corporate role structure for your DAO?",
      fallbackPrompt: "Here are options for corporate-style DAO structures:",
      options: [
        "Full corporate hierarchy (Board, C-Suite, Directors, etc.)",
        "Simplified leadership structure",
        "Flat organization with specialized teams",
        "Hybrid structure with core team and community"
      ],
      required: true,
      category: 'fundamental'
    },
    {
      id: 'meeting-schedule',
      title: 'Meeting Schedule',
      description: 'Configure governance meetings',
      icon: <Calendar size={20} />,
      prompt: "How often should you hold board or shareholder meetings?",
      fallbackPrompt: "These are common meeting schedules for Corporate DAOs:",
      options: [
        "Weekly leadership meetings",
        "Monthly board meetings",
        "Quarterly shareholder meetings",
        "Annual general meetings",
        "Ad-hoc meeting structure"
      ],
      required: true,
      category: 'fundamental'
    }
  ];

  // Switch steps based on selected DAO type
  const getStepsForDAOType = () => {
    switch (daoType) {
      case 'project':
        return projectDaoSteps;
      case 'corporate':
        return corporateDaoSteps;
      default:
        return standardSteps;
    }
  };

  const steps = getStepsForDAOType();
  const currentStep = steps[currentStepIndex];

  // Initialize chat with first prompt
  useEffect(() => {
    if (currentStep && chatMessages.length === 0) {
      setChatMessages([
        {
          id: 'initial-prompt',
          role: 'ai',
          content: currentStep.prompt
        }
      ]);
    }
  }, [currentStep, chatMessages.length]);

  // Speech recognition setup
  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window) {
      // Use type assertion for the SpeechRecognition constructor
      const SpeechRecognition = window.webkitSpeechRecognition as any;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        setUserResponse(transcript);
        
        // Reset the silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        
        // Set a new silence timer
        silenceTimerRef.current = setTimeout(() => {
          if (isRecording && transcript.trim() !== '') {
            stopRecording();
            processResponse(transcript);
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

  // Process voice commands
  const processVoiceCommand = (transcript: string) => {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    // Check for commands
    if (lowerTranscript === 'help' || lowerTranscript === 'show commands') {
      setShowVoiceCommands(true);
      return true;
    } else if (lowerTranscript === 'next step' || lowerTranscript === 'skip') {
      handleNextStep();
      return true;
    } else if (lowerTranscript === 'pause') {
      setIsPaused(true);
      return true;
    } else if (lowerTranscript === 'resume') {
      setIsPaused(false);
      return true;
    } else if (lowerTranscript === 'close' || lowerTranscript === 'hide commands') {
      setShowVoiceCommands(false);
      return true;
    } else if (lowerTranscript === 'disable voice') {
      setIsVoiceEnabled(false);
      return true;
    } else if (lowerTranscript === 'enable voice') {
      setIsVoiceEnabled(true);
      return true;
    }
    
    return false;
  };

  // Start recording
  const startRecording = () => {
    if (!recognitionRef.current) return;
    
    try {
      // Clear any previous user response
      setUserResponse('');
      
      // Don't start recording if audio is playing
      if (currentPlayingMessageId) {
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

  // Stop recording
  const stopRecording = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      setIsRecording(false);
      console.log('Speech recognition stopped');
      
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  // Process user response
  const processResponse = (response: string) => {
    if (!currentStep) return;
    
    // Check if it's a voice command
    if (processVoiceCommand(response)) {
      return;
    }

    // Trim the response and check if it's not empty
    const trimmedResponse = response.trim();
    if (!trimmedResponse) {
      console.log('Empty response, not processing');
      return;
    }

    setIsLoading(true);
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedResponse
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Save the response
    const newWizardData = {
      ...wizardData,
      [currentStep.id]: trimmedResponse
    };
    
    setWizardData(newWizardData);
    
    // Mark step as completed
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(currentStep.id);
    setCompletedSteps(newCompletedSteps);
    
    // Clear the input field
    setUserResponse('');
    
    // Simulate AI processing
    setTimeout(() => {
      // Generate AI feedback
      const feedback = generateAIFeedback(trimmedResponse, currentStep);
      setAiMessage(feedback);
      
      // Add AI message to chat
      const aiMessageObj: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: feedback
      };
      
      setChatMessages(prev => [...prev, aiMessageObj]);
      
      // Auto-play if voice is enabled
      if (isVoiceEnabled) {
        playMessage(aiMessageObj.id);
      }
      
      setIsLoading(false);
    }, 800);
  };

  // Generate AI feedback based on user response
  const generateAIFeedback = (response: string, step: WizardStep): string => {
    // Simple feedback generator - in production this would call your actual AI service
    if (response.toLowerCase() === 'i don\'t know' || response.trim() === '') {
      return step.fallbackPrompt + "\n\n" + (step.options?.join("\n") || "");
    }
    
    // Check if we're at the final step
    if (currentStepIndex === steps.length - 1) {
      return `Great! We've completed all the steps for your ${daoType === 'project' ? 'Project' : daoType === 'corporate' ? 'Corporate' : 'Standard'} DAO configuration. Would you like to generate the smart contract code, or review any of your choices?`;
    }
    
    // Generate a response for the next step
    const nextStep = steps[currentStepIndex + 1];
    return `Thanks! I've recorded your choice for ${step.title}. Let's move on to ${nextStep.title}:\n\n${nextStep.prompt}`;
  };

  // Handle next step navigation
  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      
      // Add the new step's prompt to chat messages
      const nextStep = steps[currentStepIndex + 1];
      const newAiMessage: ChatMessage = {
        id: `ai-step-${currentStepIndex + 1}`,
        role: 'ai',
        content: nextStep.prompt
      };
      
      setChatMessages(prev => [...prev, newAiMessage]);
      
      // Auto-play if voice is enabled
      if (isVoiceEnabled) {
        setTimeout(() => {
          playMessage(newAiMessage.id);
        }, 300);
      }
    } else {
      // On the last step, complete the wizard
      onComplete(wizardData);
    }
  };

  // Jump to a specific step
  const jumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    
    // Add the step's prompt to chat messages
    const jumpedToStep = steps[index];
    const newAiMessage: ChatMessage = {
      id: `ai-jump-${index}`,
      role: 'ai',
      content: jumpedToStep.prompt
    };
    
    setChatMessages(prev => [...prev, newAiMessage]);
    
    // Auto-play if voice is enabled
    if (isVoiceEnabled) {
      setTimeout(() => {
        playMessage(newAiMessage.id);
      }, 300);
    }
  };

  // Handle input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userResponse.trim()) {
      processResponse(userResponse);
      setUserResponse('');
    }
  };

  // Play message using 11labs
  const playMessage = async (messageId: string) => {
    const message = chatMessages.find(m => m.id === messageId);
    if (!message || message.role !== 'ai') return;
    
    // Make sure to stop any ongoing recording before playing audio
    if (isRecording) {
      stopRecording();
    }
    
    // Update state to show playing status
    setCurrentPlayingMessageId(messageId);
    setChatMessages(prev => prev.map(m => 
      m.id === messageId ? {...m, isPlaying: true} : {...m, isPlaying: false}
    ));
    
    try {
      console.log('Attempting to play message:', message.content.substring(0, 50) + '...');
      
      // Get the voice ID from localStorage or use a default
      const voiceId = localStorage.getItem('elevenlabsVoiceId') || '';
      
      // Check if API key exists in localStorage
      const apiKey = localStorage.getItem('elevenlabsApiKey');
      if (!apiKey) {
        console.error('ElevenLabs API key not found. Please configure it in settings.');
        alert('ElevenLabs API key is missing. Please set it up in Settings > Voice to enable text-to-speech.');
        
        // Reset UI state
        setCurrentPlayingMessageId(null);
        setChatMessages(prev => prev.map(m => 
          m.id === messageId ? {...m, isPlaying: false} : m
        ));
        return;
      }
      
      console.log('Using voice ID:', voiceId || 'No voice ID found');
      
      // Initialize service with API key if needed
      elevenlabsService.initElevenLabsService(apiKey);
      
      if (voiceId) {
        // Clear any existing user input before playing
        setUserResponse('');
        
        // Make sure the microphone is definitely off while playing
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch (error) {
            console.warn('Error stopping speech recognition:', error);
          }
        }
        
        // Play the audio
        await elevenlabsService.speak(message.content, voiceId);
        console.log('Speech playback completed');
        
        // When finished playing, start recording user's response
        setCurrentPlayingMessageId(null);
        setChatMessages(prev => prev.map(m => 
          m.id === messageId ? {...m, isPlaying: false} : m
        ));
        
        // Add a slightly longer delay before activating the microphone
        // This helps avoid capturing any lingering audio from speakers
        if (isVoiceEnabled && !isPaused) {
          console.log('Waiting before starting microphone...');
          setTimeout(() => {
            console.log('Starting voice recording now');
            startRecording();
          }, 1000); // Increased delay to 1 second
        }
      } else {
        console.error('No voice ID configured');
        alert('No ElevenLabs voice selected. Please configure a voice in Settings > Voice.');
        
        // Reset UI state
        setCurrentPlayingMessageId(null);
        setChatMessages(prev => prev.map(m => 
          m.id === messageId ? {...m, isPlaying: false} : m
        ));
      }
    } catch (error) {
      console.error('Error using text-to-speech:', error);
      alert('Error playing audio. Check console for details.');
      setCurrentPlayingMessageId(null);
      setChatMessages(prev => prev.map(m => 
        m.id === messageId ? {...m, isPlaying: false} : m
      ));
    }
  };

  // Pause/resume message playback
  const togglePlayback = (messageId: string) => {
    const message = chatMessages.find(m => m.id === messageId);
    if (!message) return;
    
    if (currentPlayingMessageId === messageId) {
      // Currently playing - pause it
      elevenlabsService.stop();
      setCurrentPlayingMessageId(null);
      setChatMessages(prev => prev.map(m => 
        m.id === messageId ? {...m, isPlaying: false} : m
      ));
    } else {
      // Not playing - start it
      playMessage(messageId);
    }
  };

  // Toggle voice interface
  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    
    // Stop any current processes
    if (isRecording) {
      stopRecording();
    }
    if (currentPlayingMessageId) {
      elevenlabsService.stop();
      setCurrentPlayingMessageId(null);
      setChatMessages(prev => prev.map(m => ({...m, isPlaying: false})));
    }
  };

  // Scroll to bottom of chat when new messages appear
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Focus input field when changing steps
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentStepIndex]);

  // Initialize voice if API key is set
  useEffect(() => {
    if (voiceApiKey) {
      elevenlabsService.initElevenLabsService(voiceApiKey);
    }
  }, [voiceApiKey]);

  // Handle voice configuration save
  const handleVoiceConfigSave = (apiKey: string, voiceId: string) => {
    setVoiceApiKey(apiKey);
    setSelectedVoiceId(voiceId);
    
    // Save to localStorage
    localStorage.setItem('elevenlabsApiKey', apiKey);
    localStorage.setItem('elevenlabsVoiceId', voiceId);
    
    // Initialize the service
    elevenlabsService.initElevenLabsService(apiKey);
    
    // Enable voice if it was disabled
    setIsVoiceEnabled(true);
  };

  // Update chat messages to parent component
  useEffect(() => {
    if (onChatUpdate) {
      onChatUpdate(chatMessages);
    }
  }, [chatMessages, onChatUpdate]);

  return (
    <div className="flex h-full overflow-hidden bg-neutral border-0 rounded-lg">
      {/* Sidebar with step checklist - more compact for sidebar mode */}
      <div className="w-full bg-neutral-dark border-r border-neutral-light/10 overflow-y-auto p-2">
        <h2 className="text-md font-bold mb-2 text-white">DAO Configuration</h2>
        
        {/* DAO Type Selector */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-neutral-light mb-1">DAO Type</label>
          <select
            className="w-full bg-neutral-dark border border-neutral-light/20 rounded-md p-1 text-white text-xs"
            value={daoType}
            onChange={(e) => setDaoType(e.target.value as DAOType)}
          >
            <option value="standard">Standard DAO</option>
            <option value="project">Project DAO</option>
            <option value="corporate">Corporate DAO</option>
          </select>
        </div>
        
        {/* Steps checklist - more compact for sidebar mode */}
        <div className="mt-1">
          <h3 className="text-xs text-neutral-light mb-1">Configuration Steps</h3>
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex items-center p-1 rounded ${
                  currentStepIndex === index ? 'bg-primary/20' : 'hover:bg-neutral-light/5'
                } mb-1 cursor-pointer transition-colors`}
                onClick={() => jumpToStep(index)}
              >
                <div className="flex-shrink-0 mr-1.5">
                  {completedSteps.has(step.id) ? (
                    <CheckCircle size={14} className="text-green-400" />
                  ) : currentStepIndex === index ? (
                    <Circle size={14} className="text-primary" />
                  ) : (
                    <Circle size={14} className="text-neutral-light/40" />
                  )}
                </div>
                <span className={`text-xs truncate ${
                  currentStepIndex === index 
                    ? 'text-primary font-medium' 
                    : completedSteps.has(step.id)
                      ? 'text-white' 
                      : 'text-neutral-light/70'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Voice Commands Help Button */}
        <div className="mt-3">
          <button
            className="w-full flex items-center justify-center p-1 bg-neutral-light/10 hover:bg-neutral-light/20 
                      text-neutral-light hover:text-white rounded"
            onClick={() => setShowVoiceCommands(!showVoiceCommands)}
          >
            <Command size={12} className="mr-1" />
            <span className="text-xs">Voice Commands</span>
          </button>
        </div>
        
        {/* Voice Configuration Button */}
        <div className="mt-2">
          <button
            className="w-full flex items-center justify-center p-1 bg-neutral-light/10 hover:bg-neutral-light/20 
                      text-neutral-light hover:text-white rounded"
            onClick={() => setShowVoiceConfig(true)}
          >
            <Settings size={12} className="mr-1" />
            <span className="text-xs">Voice Settings</span>
          </button>
        </div>
      </div>
      
      {/* Main content area - make more compact */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header - make more compact */}
        <div className="p-2 border-b border-neutral-light/10 flex justify-between items-center">
          <div>
            <h1 className="text-base font-bold text-white">{currentStep?.title || 'DAO Configuration'}</h1>
            <p className="text-neutral-light text-xs">{currentStep?.description || ''}</p>
          </div>
          <div className="flex items-center">
            <button
              className={`p-1 mr-2 rounded-full ${isVoiceEnabled ? 'bg-primary/20 text-primary' : 'text-neutral-light hover:text-primary'}`}
              onClick={toggleVoice}
              title={isVoiceEnabled ? 'Voice Enabled' : 'Voice Disabled'}
            >
              <Volume2 size={14} />
            </button>
            <button 
              className="p-1 text-neutral-light hover:text-white rounded-full"
              onClick={onCancel}
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        {/* Chat area - make more compact */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {chatMessages.map((message) => (
            <div key={message.id} className="flex">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                {message.role === 'ai' ? (
                  <Bot size={12} className="text-primary" />
                ) : (
                  <div className="text-white text-xs">U</div>
                )}
              </div>
              <div className="ml-2 flex-1">
                <div className={`rounded-lg p-1.5 max-w-[85%] ${message.role === 'ai' ? 'bg-neutral' : 'bg-neutral-dark ml-auto'}`}>
                  <p className="text-xs text-white whitespace-pre-line">{message.content}</p>
                </div>
                {/* Controls for AI messages */}
                {message.role === 'ai' && (
                  <div className="flex items-center mt-0.5 space-x-1">
                    <button
                      className={`p-0.5 rounded ${message.isPlaying ? 'text-primary bg-primary/10' : 'text-primary/60 hover:text-primary'}`}
                      onClick={() => togglePlayback(message.id)}
                      title={message.isPlaying ? 'Pause' : 'Play'}
                    >
                      {message.isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button
                      className="p-1 rounded text-primary/60 hover:text-primary"
                      onClick={handleNextStep}
                      title="Next Step"
                      disabled={currentStepIndex >= steps.length - 1}
                    >
                      <SkipForward size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* End of messages marker */}
          <div ref={messageEndRef}></div>
        </div>
        
        {/* Input area - make more compact */}
        <div className="p-2 border-t border-neutral-light/10">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-neutral-dark border border-neutral-light/20 rounded-l-md p-1.5 text-white text-xs"
              placeholder="Type your response..."
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              disabled={isLoading}
            />
            <div className="flex bg-neutral-dark border border-l-0 border-neutral-light/20 rounded-r-md">
              <button
                type="button"
                className={`p-1.5 ${isVoiceEnabled ? 'text-primary' : 'text-primary/60 hover:text-primary'}`}
                onClick={toggleVoice}
                title={isVoiceEnabled ? 'Disable voice' : 'Enable voice'}
              >
                <Volume2 size={14} />
              </button>
              <button
                type="button"
                className={`p-1.5 ${isRecording ? 'text-red-500 animate-pulse' : 'text-primary/60 hover:text-primary'}`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                title={isRecording ? 'Stop recording' : 'Start recording'}
              >
                <Mic size={14} />
              </button>
              <button
                type="submit"
                className="bg-primary text-white p-2 rounded-r-md hover:bg-primary-dark"
                disabled={isLoading || !userResponse.trim()}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
          
          {/* Help text - make brighter */}
          <div className="mt-1.5 flex items-center text-xs text-neutral-light/80">
            <HelpCircle size={10} className="mr-1 text-primary/70" />
            <span className="text-neutral-light">
              Type "I don't know" if you're unsure and need suggestions.
              {currentStepIndex < steps.length - 1 && (
                <button 
                  className="ml-2 bg-primary/20 text-primary hover:bg-primary/30 px-2 py-0.5 rounded text-xs font-medium"
                  onClick={handleNextStep}
                  disabled={isLoading}
                >
                  Skip to next step →
                </button>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Voice Commands Help Modal */}
      {showVoiceCommands && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
          <div className="bg-neutral-dark rounded-lg shadow-lg w-4/5 max-w-md p-4 border border-primary/20">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-bold flex items-center">
                <Command size={16} className="text-primary mr-2" />
                Voice Commands
              </h3>
              <button
                className="text-neutral-light hover:text-white"
                onClick={() => setShowVoiceCommands(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="h-64 overflow-y-auto pr-2">
              <table className="w-full text-sm">
                <thead className="text-neutral-light border-b border-neutral-light/20">
                  <tr>
                    <th className="py-2 text-left">Command</th>
                    <th className="py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {voiceCommands.map((cmd, index) => (
                    <tr key={index} className="border-b border-neutral-light/10">
                      <td className="py-2 text-primary">{cmd.command}</td>
                      <td className="py-2 text-white">{cmd.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-light/20 text-xs text-neutral-light">
              <p>You can say "help" at any time to see these commands again.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* ElevenLabs Voice Configuration */}
      {showVoiceConfig && (
        <ElevenLabsConfig
          onClose={() => setShowVoiceConfig(false)}
          onSave={handleVoiceConfigSave}
          apiKey={voiceApiKey}
          selectedVoiceId={selectedVoiceId}
        />
      )}
      
      {/* Voice Configuration Prompt - Show if voice is enabled but not configured */}
      {isVoiceEnabled && !voiceApiKey && !showVoiceConfig && (
        <div className="fixed bottom-4 right-4 max-w-sm bg-primary/10 border border-primary/30 p-4 rounded-lg shadow-lg">
          <div className="flex items-start">
            <div className="text-primary mr-3">
              <Volume2 size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium">Voice not configured</h4>
              <p className="text-neutral-light text-sm mt-1 mb-3">
                To use voice features, you need to configure your ElevenLabs API key and select a voice.
              </p>
              <div className="flex space-x-3">
                <button 
                  className="text-sm bg-primary rounded px-3 py-1.5 text-white hover:bg-primary/80"
                  onClick={() => setShowVoiceConfig(true)}
                >
                  Configure Now
                </button>
                <button 
                  className="text-sm bg-neutral-dark rounded px-3 py-1.5 text-neutral-light hover:bg-neutral-light/10"
                  onClick={() => setIsVoiceEnabled(false)}
                >
                  Use Text Only
                </button>
              </div>
            </div>
            <button 
              className="text-neutral-light hover:text-white"
              onClick={() => setIsVoiceEnabled(false)}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernanceWizard; 