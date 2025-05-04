import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Book,
  Award,
  Star,
  Clock,
  Users,
  CheckCircle,
  BookOpen,
  Code,
  Database,
  BrainCircuit,
  Blocks,
  BarChart3,
  Zap,
  ArrowRight,
  SearchIcon,
  Filter,
  TrendingUp,
  AlertCircle,
  Lock
} from 'lucide-react';
import Tabs from '../components/common/Tabs';
import Avatar from '../components/common/Avatar';

// Mock data for learning paths
const learningPaths = [
  {
    id: 'blockchain-fundamentals',
    title: 'Blockchain Fundamentals',
    description: 'Learn the core concepts and technology behind blockchain systems',
    icon: <Blocks size={24} className="text-blue-500" />,
    courses: 4,
    totalDuration: '6 hours',
    difficulty: 'Beginner',
    progress: 0
  },
  {
    id: 'smart-contracts',
    title: 'Smart Contract Development',
    description: 'Master Solidity programming and secure contract development',
    icon: <Code size={24} className="text-purple-500" />,
    courses: 6,
    totalDuration: '10 hours',
    difficulty: 'Intermediate',
    progress: 0
  },
  {
    id: 'dao-governance',
    title: 'DAO Governance',
    description: 'Understand the mechanisms of decentralized governance',
    icon: <Users size={24} className="text-green-500" />,
    courses: 3,
    totalDuration: '4 hours',
    difficulty: 'Intermediate',
    progress: 0
  },
  {
    id: 'web3-development',
    title: 'Web3 Development',
    description: 'Build decentralized applications with modern frameworks',
    icon: <Database size={24} className="text-orange-500" />,
    courses: 5,
    totalDuration: '8 hours',
    difficulty: 'Advanced',
    progress: 0
  },
  {
    id: 'ai-integration',
    title: 'AI Integration for Web3',
    description: 'Combine AI capabilities with blockchain technologies',
    icon: <BrainCircuit size={24} className="text-purple-400" />,
    courses: 4,
    totalDuration: '7 hours',
    difficulty: 'Advanced',
    progress: 0
  }
];

// Mock data for popular courses
const popularCourses = [
  {
    id: 'crypto-basics',
    title: 'Cryptocurrency Basics',
    category: 'Blockchain Fundamentals',
    instructor: {
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    duration: '1.5 hours',
    lessons: 8,
    rating: 4.8,
    students: 1245,
    difficulty: 'Beginner',
    badge: {
      name: 'Crypto Basics',
      icon: <Blocks size={16} />
    }
  },
  {
    id: 'solidity-101',
    title: 'Solidity Programming 101',
    category: 'Smart Contract Development',
    instructor: {
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    duration: '2.5 hours',
    lessons: 12,
    rating: 4.9,
    students: 986,
    difficulty: 'Intermediate',
    badge: {
      name: 'Solidity Basics',
      icon: <Code size={16} />
    }
  },
  {
    id: 'dao-proposals',
    title: 'Creating Effective DAO Proposals',
    category: 'DAO Governance',
    instructor: {
      name: 'Sophia Williams',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    duration: '1 hour',
    lessons: 6,
    rating: 4.7,
    students: 754,
    difficulty: 'Intermediate',
    badge: {
      name: 'Proposal Creator',
      icon: <Users size={16} />
    }
  },
  {
    id: 'smart-contract-security',
    title: 'Smart Contract Security & Auditing',
    category: 'Smart Contract Development',
    instructor: {
      name: 'Daniel Lee',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    duration: '3 hours',
    lessons: 15,
    rating: 4.9,
    students: 632,
    difficulty: 'Advanced',
    badge: {
      name: 'Security Expert',
      icon: <AlertCircle size={16} />
    },
    premium: true
  }
];

// Mock data for badges
const academyBadges = [
  {
    id: 'blockchain-basics',
    name: 'Blockchain Basics',
    description: 'Understands fundamental blockchain concepts',
    image: <Blocks size={20} className="text-blue-400" />,
    level: 1,
    category: 'Blockchain Fundamentals',
    earnedBy: 3456
  },
  {
    id: 'solidity-developer',
    name: 'Solidity Developer',
    description: 'Can write and deploy basic smart contracts',
    image: <Code size={20} className="text-purple-400" />,
    level: 2,
    category: 'Smart Contract Development',
    earnedBy: 1872
  },
  {
    id: 'dao-governance',
    name: 'DAO Governance Expert',
    description: 'Understands governance mechanisms and proposal systems',
    image: <Users size={20} className="text-green-400" />,
    level: 3,
    category: 'DAO Governance',
    earnedBy: 964
  },
  {
    id: 'web3-frontend',
    name: 'Web3 Frontend Developer',
    description: 'Can build decentralized application frontends',
    image: <Database size={20} className="text-orange-400" />,
    level: 2,
    category: 'Web3 Development',
    earnedBy: 1245
  },
  {
    id: 'ai-integrator',
    name: 'AI-Blockchain Integrator',
    description: 'Can combine AI capabilities with blockchain technologies',
    image: <BrainCircuit size={20} className="text-purple-500" />,
    level: 4,
    category: 'AI Integration',
    earnedBy: 386
  },
  {
    id: 'security-auditor',
    name: 'Security Auditor',
    description: 'Can identify and fix security vulnerabilities in smart contracts',
    image: <AlertCircle size={20} className="text-red-400" />,
    level: 5,
    category: 'Smart Contract Development',
    earnedBy: 254
  }
];

// Badge level colors
const badgeLevelColors = {
  1: 'border-gray-400', // Beginner
  2: 'border-green-400', // Intermediate
  3: 'border-blue-400', // Advanced
  4: 'border-purple-400', // Expert
  5: 'border-orange-400' // Authority
};

const AcademyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('paths');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Tabs for the academy page
  const tabs = [
    { id: 'paths', label: 'Learning Paths', icon: <Book size={16} /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen size={16} /> },
    { id: 'badges', label: 'Badges & Certifications', icon: <Award size={16} /> },
    { id: 'progress', label: 'My Progress', icon: <TrendingUp size={16} /> }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Build a DAO Academy</h1>
          <p className="text-neutral-400">Upskill quickly, unlock higher tier bounties, and advance your Web3 career</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses, topics..."
                className="bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-lg px-4 py-2 pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon size={18} className="absolute left-3 top-2.5 text-neutral-500" />
            </div>
            <button className="bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg px-3 flex items-center">
              <Filter size={18} className="mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mb-8"
      />

      {activeTab === 'paths' && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <div 
                key={path.id}
                className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-6 hover:border-primary/70 transition-colors"
              >
                <div className="mb-4 bg-neutral-700/30 p-3 inline-block rounded-lg">
                  {path.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{path.title}</h3>
                <p className="text-neutral-400 text-sm mb-4">{path.description}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center text-sm text-neutral-400">
                    <BookOpen size={16} className="mr-1.5" />
                    <span>{path.courses} Courses</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-400">
                    <Clock size={16} className="mr-1.5" />
                    <span>{path.totalDuration}</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-400">
                    <Star size={16} className="mr-1.5" />
                    <span>{path.difficulty}</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-400">
                    <CheckCircle size={16} className="mr-1.5" />
                    <span>Get certified</span>
                  </div>
                </div>

                {path.progress > 0 ? (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-neutral-300">Progress</span>
                      <span className="text-primary">{path.progress}%</span>
                    </div>
                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 py-1.5"></div>
                )}

                <div className="flex justify-between items-center mt-auto">
                  <Link
                    to={`/academy/path/${path.id}`}
                    className="text-primary text-sm font-medium hover:underline flex items-center"
                  >
                    View Path
                    <ArrowRight size={14} className="ml-1.5" />
                  </Link>
                  <button className="bg-primary hover:bg-primary/90 text-white text-sm font-medium py-1.5 px-3 rounded-md transition-colors">
                    Start Learning
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-white mt-12 mb-6">Popular Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularCourses.map((course) => (
              <div 
                key={course.id}
                className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg overflow-hidden hover:border-primary/70 transition-colors"
              >
                <div className="h-3 bg-primary"></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-medium text-neutral-400 bg-neutral-700/50 py-1 px-2 rounded-md">
                      {course.category}
                    </span>
                    {course.premium && (
                      <span className="flex items-center text-xs font-medium text-yellow-400 bg-yellow-400/10 py-1 px-2 rounded-md">
                        <Lock size={12} className="mr-1" />
                        Premium
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-white mb-3">{course.title}</h3>
                  
                  <div className="flex items-center mb-4">
                    <Avatar
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      size="xs"
                      className="mr-2"
                    />
                    <span className="text-sm text-neutral-300">{course.instructor.name}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div className="flex items-center text-neutral-400">
                      <Clock size={14} className="mr-1.5" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center text-neutral-400">
                      <BookOpen size={14} className="mr-1.5" />
                      <span>{course.lessons} Lessons</span>
                    </div>
                    <div className="flex items-center text-neutral-400">
                      <Star size={14} className="mr-1.5 text-yellow-400" />
                      <span>{course.rating} Rating</span>
                    </div>
                    <div className="flex items-center text-neutral-400">
                      <Users size={14} className="mr-1.5" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-sm text-neutral-300">
                      <Award size={16} className="mr-1.5 text-yellow-400" />
                      <span>Earn Badge</span>
                    </div>
                    <Link
                      to={`/academy/course/${course.id}`}
                      className="text-primary text-sm font-medium hover:underline flex items-center"
                    >
                      View Course
                      <ArrowRight size={14} className="ml-1.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-2 md:mb-0">All Courses</h2>
            <div className="flex gap-2">
              <button className={`px-3 py-1.5 text-sm rounded-md ${selectedFilters.includes('all') ? 'bg-primary text-white' : 'bg-neutral-800 text-neutral-300'}`}>
                All
              </button>
              <button className={`px-3 py-1.5 text-sm rounded-md ${selectedFilters.includes('beginner') ? 'bg-primary text-white' : 'bg-neutral-800 text-neutral-300'}`}>
                Beginner
              </button>
              <button className={`px-3 py-1.5 text-sm rounded-md ${selectedFilters.includes('intermediate') ? 'bg-primary text-white' : 'bg-neutral-800 text-neutral-300'}`}>
                Intermediate
              </button>
              <button className={`px-3 py-1.5 text-sm rounded-md ${selectedFilters.includes('advanced') ? 'bg-primary text-white' : 'bg-neutral-800 text-neutral-300'}`}>
                Advanced
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularCourses.concat(popularCourses).map((course, index) => (
              <div 
                key={`${course.id}-${index}`}
                className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg overflow-hidden hover:border-primary/70 transition-colors"
              >
                <div className="h-3 bg-primary"></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-medium text-neutral-400 bg-neutral-700/50 py-1 px-2 rounded-md">
                      {course.category}
                    </span>
                    {course.premium && (
                      <span className="flex items-center text-xs font-medium text-yellow-400 bg-yellow-400/10 py-1 px-2 rounded-md">
                        <Lock size={12} className="mr-1" />
                        Premium
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-white mb-3">{course.title}</h3>
                  
                  <div className="flex items-center mb-4">
                    <Avatar
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      size="xs"
                      className="mr-2"
                    />
                    <span className="text-sm text-neutral-300">{course.instructor.name}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div className="flex items-center text-neutral-400">
                      <Clock size={14} className="mr-1.5" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center text-neutral-400">
                      <BookOpen size={14} className="mr-1.5" />
                      <span>{course.lessons} Lessons</span>
                    </div>
                    <div className="flex items-center text-neutral-400">
                      <Star size={14} className="mr-1.5 text-yellow-400" />
                      <span>{course.rating} Rating</span>
                    </div>
                    <div className="flex items-center text-neutral-400">
                      <Users size={14} className="mr-1.5" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-sm text-neutral-300">
                      <Award size={16} className="mr-1.5 text-yellow-400" />
                      <span>Earn Badge</span>
                    </div>
                    <Link
                      to={`/academy/course/${course.id}`}
                      className="text-primary text-sm font-medium hover:underline flex items-center"
                    >
                      View Course
                      <ArrowRight size={14} className="ml-1.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'badges' && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Badges & Certifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academyBadges.map((badge) => (
              <div 
                key={badge.id}
                className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-5 hover:border-primary/70 transition-colors"
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-neutral-700/30 border-2 ${badgeLevelColors[badge.level as keyof typeof badgeLevelColors]}`}>
                    {badge.image}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-semibold text-white">{badge.name}</h3>
                    <div className="flex items-center">
                      <span className="text-xs py-0.5 px-1.5 bg-neutral-700/50 text-neutral-300 rounded mr-2">
                        Level {badge.level}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {badge.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-neutral-400 mb-4">
                  {badge.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-neutral-400">
                    <Users size={14} className="mr-1.5" />
                    <span>{badge.earnedBy.toLocaleString()} have earned this</span>
                  </div>
                  <Link
                    to={`/academy/badge/${badge.id}`}
                    className="text-primary text-sm font-medium hover:underline flex items-center"
                  >
                    How to earn
                    <ArrowRight size={14} className="ml-1.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div>
          <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Your Progress</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-neutral-700/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-blue-500/20 p-2 rounded">
                    <BookOpen size={20} className="text-blue-400" />
                  </div>
                  <span className="text-2xl font-bold text-white">0</span>
                </div>
                <h3 className="text-sm font-medium text-neutral-300">Courses Started</h3>
              </div>
              
              <div className="bg-neutral-700/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-green-500/20 p-2 rounded">
                    <CheckCircle size={20} className="text-green-400" />
                  </div>
                  <span className="text-2xl font-bold text-white">0</span>
                </div>
                <h3 className="text-sm font-medium text-neutral-300">Courses Completed</h3>
              </div>
              
              <div className="bg-neutral-700/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-yellow-500/20 p-2 rounded">
                    <Award size={20} className="text-yellow-400" />
                  </div>
                  <span className="text-2xl font-bold text-white">0</span>
                </div>
                <h3 className="text-sm font-medium text-neutral-300">Badges Earned</h3>
              </div>
              
              <div className="bg-neutral-700/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-purple-500/20 p-2 rounded">
                    <Clock size={20} className="text-purple-400" />
                  </div>
                  <span className="text-2xl font-bold text-white">0h</span>
                </div>
                <h3 className="text-sm font-medium text-neutral-300">Learning Time</h3>
              </div>
            </div>
          </div>
          
          <div className="text-center py-10">
            <Zap size={48} className="text-neutral-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Start Your Learning Journey</h3>
            <p className="text-neutral-400 mb-6 max-w-md mx-auto">You haven't started any courses yet. Begin learning to improve your skills and unlock higher-tier bounties.</p>
            <button className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Explore Courses
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademyPage; 