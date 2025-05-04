import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  ExternalLink, 
  Star, 
  Award, 
  Calendar, 
  Clock, 
  Building,
  Users,
  GitBranch,
  Shield,
  Code,
  Briefcase,
  Terminal,
  BarChart2,
  CheckCircle,
  Globe,
  Twitter,
  Github,
  Database,
  User,
  FileText,
  Lock,
  AlertCircle,
  Zap,
  Bot,
  Coffee,
  Activity,
  Cpu,
  Layers,
  Command,
  BrainCircuit,
  Trophy
} from 'lucide-react';
import { mockContributors } from '../mock/contributors';

// Mock data for tasks
const mockContributorTasks = [
  {
    id: '1',
    title: 'Create a new landing page and UI for Devidon',
    dao: {
      id: '3',
      name: 'Peaq Network',
      logo: 'https://avatars.githubusercontent.com/u/76402479'
    },
    date: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000), // 3 months ago
    status: 'Completed',
  },
  {
    id: '2',
    title: 'Stake-able token balance',
    dao: {
      id: '2',
      name: 'MakerDAO',
      logo: 'https://cryptologos.cc/logos/makerdao-mkr-logo.png'
    },
    date: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000), // 4 months ago
    status: 'Completed',
  },
  {
    id: '3',
    title: 'Fix image generation plug-in and posting to Twitter',
    dao: {
      id: '1',
      name: 'Aragon',
      logo: 'https://cryptologos.cc/logos/aragon-ant-logo.png'
    },
    date: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000), // 6 months ago
    status: 'Completed',
  },
  {
    id: '4',
    title: 'Enable Ethereum wallet simple transfers',
    dao: {
      id: '3',
      name: 'Peaq Network',
      logo: 'https://avatars.githubusercontent.com/u/76402479'
    },
    date: new Date(Date.now() - 7 * 30 * 24 * 60 * 60 * 1000), // 7 months ago
    status: 'Completed',
  },
  {
    id: '5',
    title: 'Design QA',
    dao: {
      id: '2',
      name: 'MakerDAO',
      logo: 'https://cryptologos.cc/logos/makerdao-mkr-logo.png'
    },
    date: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000), // 1 year ago
    status: 'Completed',
  },
];

// Mock contribution data
const mockContributions = [
  { type: 'Development', count: 46 },
  { type: 'Operations', count: 12 },
  { type: 'Admin', count: 7 },
  { type: 'Product', count: 19 }
];

// Mock stats
const mockStats = {
  reputation: 11340,
  earnings: 3767.14,
  revenueShare: '1.00%',
  revenueScore: 87, // Out of 100
  performanceScore: 92, // Out of 100
  avgResponseTime: '2.3 hours',
  avgProjectCompletionTime: '8.2 days',
  avgTaskCompletionTime: '3.1 days',
  onTimeCompletion: '94%'
};

// Mock organizations
const mockOrganizations = [
  { id: '1', name: 'LexDAO', logo: 'https://avatars.githubusercontent.com/u/51493084' },
  { id: '2', name: 'Aleo', logo: 'https://avatars.githubusercontent.com/u/57996701' },
  { id: '3', name: 'GoblinDefiFun', logo: 'https://avatars.githubusercontent.com/u/78001592' },
  { id: '4', name: 'ShapeShift DAO', logo: 'https://avatars.githubusercontent.com/u/86011353' },
  { id: '5', name: 'MetaGame', logo: 'https://avatars.githubusercontent.com/u/57432678' },
];

// Update the mock badges data to be organized by categories
const mockBadgeCategories = [
  {
    id: 'ai-platforms',
    name: 'AI Platforms',
    icon: <BrainCircuit size={18} className="text-purple-400" />,
    badges: [
      { 
        id: 'chatgpt', 
        name: 'ChatGPT', 
        icon: <Bot size={16} />, 
        acquired: 'Jan 15, 2023', 
        level: 'Expert',
        levelValue: 5, // out of 5
        description: 'Proficient in prompt engineering and GPT application development'
      },
      { 
        id: 'cursor-ai', 
        name: 'Cursor AI', 
        icon: <Command size={16} />, 
        acquired: 'Feb 23, 2023', 
        level: 'Advanced',
        levelValue: 4, // out of 5
        description: 'Skilled in AI-assisted coding and development workflows'
      },
      { 
        id: 'github-copilot', 
        name: 'GitHub Copilot', 
        icon: <Github size={16} />, 
        acquired: 'Mar 10, 2023', 
        level: 'Intermediate',
        levelValue: 3, // out of 5
        description: 'Effective use of AI pair programming tools'
      }
    ]
  },
  {
    id: 'blockchain-dev',
    name: 'Blockchain Development',
    icon: <Layers size={18} className="text-blue-400" />,
    badges: [
      { 
        id: 'solidity', 
        name: 'Solidity', 
        icon: <Terminal size={16} />, 
        acquired: 'Mar 22, 2023', 
        level: 'Expert',
        levelValue: 5, // out of 5
        description: 'Expert-level smart contract development and optimization'
      },
      { 
        id: 'smart-contract-audit', 
        name: 'Smart Contract Auditor', 
        icon: <Shield size={16} />, 
        acquired: 'Apr 18, 2023', 
        level: 'Expert',
        levelValue: 5, // out of 5
        description: 'Conducted 20+ security audits for major protocols'
      }
    ]
  },
  {
    id: 'dao-governance',
    name: 'DAO Governance',
    icon: <Users size={18} className="text-green-400" />,
    badges: [
      { 
        id: 'governance', 
        name: 'DAO Governance', 
        icon: <Users size={16} />, 
        acquired: 'May 30, 2023', 
        level: 'Intermediate',
        levelValue: 3, // out of 5
        description: 'Active participation in DAO voting and proposal processes'
      }
    ]
  },
  {
    id: 'performance',
    name: 'Performance',
    icon: <Zap size={18} className="text-orange-400" />,
    badges: [
      { 
        id: 'fast-responder', 
        name: 'Fast Responder', 
        icon: <Zap size={16} />, 
        acquired: 'Jun 12, 2023', 
        level: 'Advanced',
        levelValue: 4, // out of 5
        description: 'Consistently quick response time to tasks and communication'
      }
    ]
  }
];

const ContributorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [contributor, setContributor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'contributions' | 'tasks' | 'skills' | 'reputation'>('contributions');

  useEffect(() => {
    // Simulate API call to fetch contributor data
    const fetchContributor = async () => {
      setLoading(true);
      try {
        // Find the contributor from mock data
        const foundContributor = mockContributors.find(c => c.id === id);
        if (foundContributor) {
          setContributor(foundContributor);
        }
      } catch (error) {
        console.error('Error fetching contributor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!contributor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white">
        <h2 className="text-2xl font-bold mb-4">Contributor Not Found</h2>
        <p className="text-neutral-400 mb-6">The contributor you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/project-management/contributors" 
          className="flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Contributors
        </Link>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Header with back button */}
      <div className="border-b border-neutral-800 p-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/project-management/contributors" className="flex items-center text-neutral-400 hover:text-white">
            <ArrowLeft size={18} className="mr-2" />
            <span>Back to Contributors</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left sidebar - Profile Information */}
          <div className="col-span-1">
            <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg overflow-hidden">
              {/* Profile header */}
              <div className="p-6">
                <div className="flex flex-col items-center">
                  <img 
                    src={contributor.avatar} 
                    alt={contributor.name}
                    className="w-32 h-32 rounded-full border-4 border-neutral-700"
                  />
                  <h1 className="text-2xl font-bold mt-4">{contributor.name}</h1>
                  <p className="text-primary text-sm font-medium mt-1">{contributor.title}</p>
                  
                  <p className="text-neutral-400 text-sm mt-4 text-center">{contributor.bio}</p>
                  
                  <div className="mt-5 flex gap-2">
                    <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Contact
                    </button>
                    <button className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                      View on GitHub
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="border-t border-neutral-700/50 p-6">
                <h2 className="text-lg font-medium mb-4">Stats</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-neutral-400">Reputation Score</span>
                      <span className="text-sm font-medium">{mockStats.reputation}</span>
                    </div>
                    <div className="w-full bg-neutral-700/50 rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-neutral-400">Performance Score</span>
                      <span className="text-sm font-medium">{mockStats.performanceScore}/100</span>
                    </div>
                    <div className="w-full bg-neutral-700/50 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${mockStats.performanceScore}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-neutral-400">Revenue Score</span>
                      <span className="text-sm font-medium">{mockStats.revenueScore}/100</span>
                    </div>
                    <div className="w-full bg-neutral-700/50 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${mockStats.revenueScore}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-neutral-400">Earnings</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">${mockStats.earnings}</span>
                      <button className="ml-2 p-1 rounded-full hover:bg-neutral-700/50" title="Hide with premium subscription">
                        <Lock size={12} className="text-neutral-400" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-400">Revenue Share</span>
                    <span className="text-sm font-medium">{mockStats.revenueShare}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-400">Avg. Response Time</span>
                    <span className="text-sm font-medium">{mockStats.avgResponseTime}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-400">Avg. Project Completion</span>
                    <span className="text-sm font-medium">{mockStats.avgProjectCompletionTime}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-400">Avg. Task Completion</span>
                    <span className="text-sm font-medium">{mockStats.avgTaskCompletionTime}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-400">On-time Completion Rate</span>
                    <span className="text-sm font-medium">{mockStats.onTimeCompletion}</span>
                  </div>
                </div>
              </div>
              
              {/* Badges section - categorized and enhanced */}
              <div className="border-t border-neutral-700/50 p-6">
                <h2 className="text-lg font-medium mb-4">Platform Badges</h2>
                
                <div className="space-y-6">
                  {mockBadgeCategories.map((category) => (
                    <div key={category.id} className="mb-4">
                      <div className="flex items-center mb-3">
                        <div className="bg-neutral-800/70 rounded-full p-1.5 mr-2">
                          {category.icon}
                        </div>
                        <h3 className="font-medium text-sm">{category.name}</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {category.badges.map((badge) => (
                          <div key={badge.id} className="relative group cursor-pointer">
                            <div className="flex items-center p-2 rounded-md hover:bg-neutral-700/30 transition-colors">
                              {/* Badge with level indicator */}
                              <div className="relative flex-shrink-0 mr-3">
                                <div className={`
                                  w-10 h-10 rounded-full flex items-center justify-center
                                  ${badge.levelValue === 5 ? 'bg-yellow-500/20 border-2 border-yellow-500/60' : 
                                    badge.levelValue === 4 ? 'bg-blue-500/20 border-2 border-blue-500/60' : 
                                    badge.levelValue === 3 ? 'bg-green-500/20 border-2 border-green-500/60' : 
                                    badge.levelValue === 2 ? 'bg-orange-500/20 border-2 border-orange-500/60' : 
                                    'bg-neutral-500/20 border-2 border-neutral-500/60'}
                                `}>
                                  <div className="text-white">
                                    {React.cloneElement(badge.icon, { 
                                      className: `
                                        ${badge.levelValue === 5 ? 'text-yellow-400' : 
                                          badge.levelValue === 4 ? 'text-blue-400' : 
                                          badge.levelValue === 3 ? 'text-green-400' : 
                                          badge.levelValue === 2 ? 'text-orange-400' : 
                                          'text-neutral-400'}
                                      ` 
                                    })}
                                  </div>
                                </div>
                                
                                {/* Small indicator for level */}
                                <div className="absolute -top-1 -right-1 bg-neutral-900 rounded-full p-0.5 border border-neutral-700">
                                  <div className="text-[8px] font-bold w-4 h-4 flex items-center justify-center">
                                    {badge.levelValue}
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="font-medium text-sm">{badge.name}</div>
                                <div className="text-xs text-neutral-400">{badge.level}</div>
                              </div>
                            </div>
                            
                            {/* Enhanced tooltip on hover */}
                            <div className="absolute left-0 top-full mt-2 p-3 bg-neutral-800 rounded-md shadow-lg z-10 w-64 invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100">
                              <div className="flex justify-between items-center mb-2">
                                <div className="text-sm font-medium">{badge.name}</div>
                                <div className={`
                                  text-xs px-2 py-0.5 rounded-full
                                  ${badge.level === 'Expert' ? 'bg-yellow-500/20 text-yellow-400' : 
                                    badge.level === 'Advanced' ? 'bg-blue-500/20 text-blue-400' : 
                                    badge.level === 'Intermediate' ? 'bg-green-500/20 text-green-400' : 
                                    'bg-neutral-500/20 text-neutral-400'}
                                `}>
                                  {badge.level}
                                </div>
                              </div>
                              
                              <p className="text-xs text-neutral-300 mb-2">{badge.description}</p>
                              
                              <div className="flex items-center text-xs text-neutral-400 mt-2">
                                <Calendar size={12} className="mr-1" /> 
                                <span>Acquired: {badge.acquired}</span>
                              </div>
                              
                              {/* Level progress bar */}
                              <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-neutral-400">Skill Level</span>
                                  <span className="text-xs text-neutral-300">{badge.levelValue}/5</span>
                                </div>
                                <div className="w-full bg-neutral-700/50 rounded-full h-1">
                                  <div 
                                    className={`h-1 rounded-full ${
                                      badge.levelValue === 5 ? 'bg-yellow-500' : 
                                      badge.levelValue === 4 ? 'bg-blue-500' : 
                                      badge.levelValue === 3 ? 'bg-green-500' : 
                                      badge.levelValue === 2 ? 'bg-orange-500' : 
                                      'bg-neutral-500'
                                    }`} 
                                    style={{ width: `${(badge.levelValue / 5) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full mt-4 py-2 px-3 text-sm text-primary hover:text-primary/80 bg-neutral-700/20 hover:bg-neutral-700/40 rounded-md transition-colors flex items-center justify-center">
                    <Trophy size={16} className="mr-2" />
                    View All Badges & Achievements
                  </button>
                </div>
              </div>
              
              {/* Skills section */}
              <div className="border-t border-neutral-700/50 p-6">
                <h2 className="text-lg font-medium mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {contributor.skills.map((skill: string) => (
                    <span 
                      key={skill} 
                      className="bg-neutral-700/50 text-neutral-300 px-2 py-1 rounded-md text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Membership in DAOs */}
              <div className="border-t border-neutral-700/50 p-6">
                <h2 className="text-lg font-medium mb-4">Organizations</h2>
                
                <div className="space-y-3">
                  {mockOrganizations.map(org => (
                    <div key={org.id} className="flex items-center gap-3">
                      <img 
                        src={org.logo} 
                        alt={org.name} 
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm">{org.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Contact & Social */}
              <div className="border-t border-neutral-700/50 p-6">
                <h2 className="text-lg font-medium mb-4">Contact & Social</h2>
                
                <div className="space-y-3">
                  <a 
                    href="#" 
                    className="flex items-center gap-3 text-neutral-400 hover:text-primary"
                  >
                    <Globe size={16} />
                    <span className="text-sm">https://contributor.dev</span>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center gap-3 text-neutral-400 hover:text-primary"
                  >
                    <Twitter size={16} />
                    <span className="text-sm">@contributor</span>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center gap-3 text-neutral-400 hover:text-primary"
                  >
                    <Github size={16} />
                    <span className="text-sm">github.com/contributor</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right content area - Tabs and content */}
          <div className="col-span-2">
            {/* Rating & Availability banner */}
            <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-neutral-700/50 rounded-full p-2 mr-3">
                  <Star size={20} className="text-yellow-400" />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{contributor.rating}</span>
                    <div className="flex ml-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star 
                          key={idx} 
                          size={14} 
                          className={idx < Math.floor(contributor.rating) ? "text-yellow-400" : "text-neutral-600"} 
                          fill={idx < Math.floor(contributor.rating) ? "#FACC15" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400">Based on {contributor.completedTasks} completed tasks</span>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-sm ${
                contributor.availableForWork 
                  ? 'bg-green-900/20 text-green-400' 
                  : 'bg-neutral-700/50 text-neutral-400'
              }`}>
                {contributor.availableForWork ? 'Available for Work' : 'Not Available'}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-neutral-700/50 mb-6">
              <div className="flex">
                <button
                  className={`px-4 py-3 font-medium text-sm border-b-2 ${
                    activeTab === 'contributions' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('contributions')}
                >
                  Contributions
                </button>
                <button
                  className={`px-4 py-3 font-medium text-sm border-b-2 ${
                    activeTab === 'tasks' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('tasks')}
                >
                  Tasks
                </button>
                <button
                  className={`px-4 py-3 font-medium text-sm border-b-2 ${
                    activeTab === 'skills' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('skills')}
                >
                  Skills & Experience
                </button>
                <button
                  className={`px-4 py-3 font-medium text-sm border-b-2 ${
                    activeTab === 'reputation' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('reputation')}
                >
                  Reputation
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'contributions' && (
              <div>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {mockContributions.map((contribution) => (
                    <div 
                      key={contribution.type} 
                      className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-4 flex items-center"
                    >
                      <div className="bg-neutral-700/50 rounded-full p-2 mr-3">
                        {contribution.type === 'Development' && <Code size={20} className="text-blue-400" />}
                        {contribution.type === 'Operations' && <Shield size={20} className="text-green-400" />}
                        {contribution.type === 'Admin' && <Users size={20} className="text-yellow-400" />}
                        {contribution.type === 'Product' && <Database size={20} className="text-purple-400" />}
                      </div>
                      <div>
                        <div className="font-medium">{contribution.count}</div>
                        <div className="text-xs text-neutral-400">{contribution.type}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-medium mb-4">Contribution Activity</h3>
                
                {/* Replace the heatmap with an activity timeline */}
                <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-6 mb-6">
                  <div className="space-y-6">
                    {/* Platform signup */}
                    <div className="flex items-start">
                      <div className="bg-primary/20 rounded-full p-2 mr-4 mt-1">
                        <User size={16} className="text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Joined Platform</h4>
                          <span className="mx-2 text-neutral-600">•</span>
                          <span className="text-xs text-neutral-400">Feb 12, 2023</span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-400">
                          Completed onboarding and verification process
                        </p>
                      </div>
                    </div>
                    
                    {/* Badge earned */}
                    <div className="flex items-start">
                      <div className="bg-yellow-500/20 rounded-full p-2 mr-4 mt-1">
                        <Award size={16} className="text-yellow-400" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Earned Badge: Smart Contract Security Expert</h4>
                          <span className="mx-2 text-neutral-600">•</span>
                          <span className="text-xs text-neutral-400">Mar 5, 2023</span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-400">
                          Completed verification and demonstrated expertise in smart contract security
                        </p>
                      </div>
                    </div>
                    
                    {/* Joined DAO */}
                    <div className="flex items-start">
                      <div className="bg-blue-500/20 rounded-full p-2 mr-4 mt-1">
                        <Users size={16} className="text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Joined DAO: LexDAO</h4>
                          <span className="mx-2 text-neutral-600">•</span>
                          <span className="text-xs text-neutral-400">Apr 18, 2023</span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-400">
                          Approved as contributor with security auditor role
                        </p>
                      </div>
                    </div>
                    
                    {/* Submitted proposal */}
                    <div className="flex items-start">
                      <div className="bg-green-500/20 rounded-full p-2 mr-4 mt-1">
                        <FileText size={16} className="text-green-400" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Submitted Proposal: Contract Audit Framework</h4>
                          <span className="mx-2 text-neutral-600">•</span>
                          <span className="text-xs text-neutral-400">May 22, 2023</span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-400">
                          Proposal #145 for standardized audit framework and reporting tools
                        </p>
                      </div>
                    </div>
                    
                    {/* Completed task */}
                    <div className="flex items-start">
                      <div className="bg-purple-500/20 rounded-full p-2 mr-4 mt-1">
                        <CheckCircle size={16} className="text-purple-400" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Completed Task: Stake-able token balance</h4>
                          <span className="mx-2 text-neutral-600">•</span>
                          <span className="text-xs text-neutral-400">Jun 14, 2023</span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-400">
                          For MakerDAO • Completed in 8 days (2 days ahead of schedule)
                        </p>
                      </div>
                    </div>
                    
                    {/* Token activity */}
                    <div className="flex items-start">
                      <div className="bg-teal-500/20 rounded-full p-2 mr-4 mt-1">
                        <Database size={16} className="text-teal-400" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Received DAO Tokens: 500 MAKER</h4>
                          <span className="mx-2 text-neutral-600">•</span>
                          <span className="text-xs text-neutral-400">Jul 3, 2023</span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-400">
                          Reward for successful task completion and proposal execution
                        </p>
                      </div>
                    </div>
                    
                    {/* Team delegation */}
                    <div className="flex items-start">
                      <div className="bg-indigo-500/20 rounded-full p-2 mr-4 mt-1">
                        <Users size={16} className="text-indigo-400" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Delegated to Team: Security Working Group</h4>
                          <span className="mx-2 text-neutral-600">•</span>
                          <span className="text-xs text-neutral-400">Aug 15, 2023</span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-400">
                          Assigned as lead security auditor for critical infrastructure
                        </p>
                      </div>
                    </div>
                    
                    {/* Project delegation */}
                    <div className="flex items-start">
                      <div className="bg-rose-500/20 rounded-full p-2 mr-4 mt-1">
                        <GitBranch size={16} className="text-rose-400" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Assigned to Project: ShapeShift Security Audit</h4>
                          <span className="mx-2 text-neutral-600">•</span>
                          <span className="text-xs text-neutral-400">Sep 8, 2023</span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-400">
                          Conducting smart contract security audit for ShapeShift DAO treasury
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Completed Tasks</h3>
                
                <div className="space-y-4">
                  {mockContributorTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            src={task.dao.logo} 
                            alt={task.dao.name} 
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-neutral-400">{task.dao.name}</span>
                              <span className="mx-2 text-neutral-600">•</span>
                              <span className="text-xs text-neutral-400">{formatDate(task.date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-green-900/20 text-green-400 px-2 py-0.5 rounded-full text-xs">
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Skills</h3>
                
                <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {contributor.skills.map((skill: string) => (
                      <div key={skill} className="flex items-start">
                        <div className="mt-1 bg-neutral-700/50 rounded-full p-1.5 mr-3">
                          <Terminal size={14} className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{skill}</h4>
                          <div className="mt-1 w-full bg-neutral-700/50 rounded-full h-1.5">
                            {/* Randomize skill level for demo */}
                            <div 
                              className="bg-primary h-1.5 rounded-full" 
                              style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mb-4">Experience</h3>
                
                <div className="space-y-4">
                  <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-6">
                    <div className="flex items-start">
                      <div className="mt-1 bg-neutral-700/50 rounded-full p-2 mr-4">
                        <Building size={18} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Senior Blockchain Developer</h4>
                        <p className="text-sm text-neutral-400">WebBlock Technologies • 2020 - Present</p>
                        <p className="mt-2 text-sm text-neutral-300">Leading development of DeFi protocols and NFT marketplaces. Specialized in smart contract security and optimization.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-6">
                    <div className="flex items-start">
                      <div className="mt-1 bg-neutral-700/50 rounded-full p-2 mr-4">
                        <Building size={18} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Blockchain Developer</h4>
                        <p className="text-sm text-neutral-400">CryptoVentures • 2018 - 2020</p>
                        <p className="mt-2 text-sm text-neutral-300">Developed Ethereum smart contracts and dApps. Worked on token standards and DeFi primitives.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reputation' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Reputation Score</h3>
                    <div className="flex items-center">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-primary/20 mr-4">
                        <span className="text-xl font-bold">{mockStats.reputation}</span>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">Based on task completion, quality of work, and community feedback</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Activity Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-400">Tasks Completed</span>
                        <span className="font-medium">{contributor.completedTasks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-400">Organizations</span>
                        <span className="font-medium">{mockOrganizations.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-400">Average Rating</span>
                        <span className="font-medium">{contributor.rating} / 5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mb-4">Reviews</h3>
                
                <div className="space-y-4">
                  <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-6">
                    <div className="flex items-start">
                      <img 
                        src="https://randomuser.me/api/portraits/men/32.jpg" 
                        alt="Reviewer" 
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">John Smith</h4>
                          <span className="mx-2 text-neutral-600">•</span>
                          <span className="text-xs text-neutral-400">2 years ago</span>
                        </div>
                        <div className="flex mt-1 mb-2">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star 
                              key={idx} 
                              size={14} 
                              className="text-yellow-400" 
                              fill="#FACC15"
                            />
                          ))}
                        </div>
                        <p className="text-sm text-neutral-300">
                          Excellent work! Delivered the project ahead of schedule with exceptional quality. 
                          Communication was clear throughout the process, and they were able to adapt to changing requirements.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-6">
                    <div className="flex items-start">
                      <img 
                        src="https://randomuser.me/api/portraits/women/44.jpg" 
                        alt="Reviewer" 
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Jane Doe</h4>
                          <span className="mx-2 text-neutral-600">•</span>
                          <span className="text-xs text-neutral-400">8 months ago</span>
                        </div>
                        <div className="flex mt-1 mb-2">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star 
                              key={idx} 
                              size={14} 
                              className={idx < 4 ? "text-yellow-400" : "text-neutral-600"} 
                              fill={idx < 4 ? "#FACC15" : "none"}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-neutral-300">
                          Very knowledgeable developer who solved our complex problems efficiently. 
                          The only reason for 4 stars instead of 5 is that some documentation could have been more thorough. 
                          Overall, a great contributor that I would work with again.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorProfilePage; 