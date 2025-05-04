import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Award, User, CheckCircle, AlertCircle } from 'lucide-react';
import MarkdownRenderer from '../ai/MarkdownRenderer';

// Types for our course content
interface Lesson {
  id: string;
  title: string;
  videoId: string;  // YouTube video ID
  description: string;
  duration: string;
  resources?: {
    title: string;
    url: string;
    type: 'document' | 'repository' | 'link';
  }[];
  hasQuiz: boolean;
}

interface Course {
  id: string;
  title: string;
  category: string;
  instructor: {
    name: string;
    avatar: string;
  };
  description: string;
  lessons: Lesson[];
  difficulty: string;
  badge: {
    name: string;
    icon: React.ReactNode;
  };
}

// Mock data - this would be fetched from API in production
const coursesData: Record<string, Course> = {
  'crypto-basics': {
    id: 'crypto-basics',
    title: 'Cryptocurrency Basics',
    category: 'Blockchain Fundamentals',
    instructor: {
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    description: 'An introduction to cryptocurrency concepts, blockchain technology fundamentals, and how digital assets function in the modern economy.',
    difficulty: 'Beginner',
    badge: {
      name: 'Crypto Basics',
      icon: <span>🔰</span>
    },
    lessons: [
      {
        id: 'lesson-1',
        title: 'What is Cryptocurrency?',
        videoId: 'bBC-nXj3Ng4', // 3Blue1Brown explainer video as example
        description: '# Introduction to Cryptocurrency\n\nThis lesson covers the fundamental concepts of cryptocurrency, how it differs from traditional currency, and the basic technology that makes it possible.\n\n## Learning Objectives\n\n- Understand the definition of cryptocurrency\n- Learn about decentralization\n- Explore public and private keys\n- Understand basic blockchain concepts',
        duration: '12 min',
        resources: [
          {
            title: 'Cryptocurrency Whitepaper',
            url: 'https://bitcoin.org/bitcoin.pdf',
            type: 'document'
          },
          {
            title: 'GitHub Resources',
            url: 'https://github.com/bitcoin/bitcoin',
            type: 'repository'
          }
        ],
        hasQuiz: true
      },
      {
        id: 'lesson-2',
        title: 'Blockchain Technology Explained',
        videoId: 'SSo_EIwHSd4', // Another educational video
        description: '# Blockchain Technology\n\nThis lesson explains how blockchain technology works, the concept of distributed ledgers, and why this innovation is important for cryptocurrencies.\n\n## Learning Objectives\n\n- Understand blockchain structure\n- Learn about consensus mechanisms\n- Explore mining and validation\n- Understand immutability and security features',
        duration: '15 min',
        resources: [
          {
            title: 'Blockchain Explorer',
            url: 'https://www.blockchain.com/explorer',
            type: 'link'
          }
        ],
        hasQuiz: true
      }
    ]
  },
  'solidity-101': {
    id: 'solidity-101',
    title: 'Solidity Programming 101',
    category: 'Smart Contract Development',
    instructor: {
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    description: 'Learn the fundamentals of Solidity programming language to build smart contracts on Ethereum and compatible blockchains.',
    difficulty: 'Intermediate',
    badge: {
      name: 'Solidity Basics',
      icon: <span>👨‍💻</span>
    },
    lessons: [
      {
        id: 'lesson-1',
        title: 'Introduction to Solidity',
        videoId: 'ipwxYa-F1uY', // Example Solidity intro video
        description: '# Getting Started with Solidity\n\nThis lesson introduces Solidity programming language, basic syntax, and how to set up your development environment.\n\n## Learning Objectives\n\n- Understand Solidity\'s purpose\n- Setup a development environment\n- Write your first smart contract\n- Learn about contract structure',
        duration: '18 min',
        resources: [
          {
            title: 'Solidity Documentation',
            url: 'https://docs.soliditylang.org/',
            type: 'link'
          },
          {
            title: 'Remix IDE',
            url: 'https://remix.ethereum.org/',
            type: 'link'
          }
        ],
        hasQuiz: true
      }
    ]
  },
  'dao-proposals': {
    id: 'dao-proposals',
    title: 'Creating Effective DAO Proposals',
    category: 'DAO Governance',
    instructor: {
      name: 'Sophia Williams',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    description: 'Learn how to craft clear and effective governance proposals for DAOs that achieve consensus and drive meaningful change.',
    difficulty: 'Intermediate',
    badge: {
      name: 'Proposal Creator',
      icon: <span>📝</span>
    },
    lessons: [
      {
        id: 'lesson-1',
        title: 'Introduction to DAO Governance',
        videoId: '3sh2eh7zDiM', // Example video about DAO governance
        description: '# DAO Governance Fundamentals\n\nThis lesson introduces the concept of decentralized governance, different voting mechanisms, and how proposals work in DAOs.\n\n## Learning Objectives\n\n- Understand DAO governance structures\n- Learn about different voting systems\n- Explore proposal lifecycle\n- Understand stakeholder management',
        duration: '14 min',
        resources: [
          {
            title: 'Example DAO Constitution',
            url: 'https://docs.daoexample.com/constitution',
            type: 'document'
          }
        ],
        hasQuiz: true
      }
    ]
  }
};

const CourseViewer: React.FC = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  
  // Guard clause for invalid course ID
  if (!courseId || !coursesData[courseId]) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
        <p className="text-neutral-400 mb-6">The course you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/academy')}
          className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition-colors"
        >
          Back to Academy
        </button>
      </div>
    );
  }
  
  const course = coursesData[courseId];
  
  // Set first lesson as active by default if none selected
  if (!activeLesson && course.lessons.length > 0) {
    setActiveLesson(course.lessons[0].id);
  }
  
  const currentLesson = course.lessons.find(lesson => lesson.id === activeLesson) || course.lessons[0];
  
  // YouTube options
  const opts = {
    height: '500',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };
  
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Back button and course title */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/academy')}
          className="flex items-center text-neutral-400 hover:text-primary mb-4"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Academy
        </button>
        <h1 className="text-3xl font-bold text-white">{course.title}</h1>
        <div className="flex items-center mt-2">
          <span className="text-xs font-medium text-neutral-400 bg-neutral-800 py-1 px-2 rounded-md">
            {course.category}
          </span>
          <span className="text-xs font-medium text-neutral-400 bg-neutral-800 py-1 px-2 rounded-md ml-2">
            {course.difficulty}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - video and description */}
        <div className="lg:col-span-2">
          {/* Video player */}
          <div className="bg-neutral-900 rounded-lg overflow-hidden mb-6">
            <YouTube videoId={currentLesson.videoId} opts={opts} className="w-full" />
          </div>
          
          {/* Lesson title and info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">{currentLesson.title}</h2>
            <div className="flex items-center text-neutral-400 text-sm mb-4">
              <Clock size={16} className="mr-1.5" />
              <span className="mr-4">{currentLesson.duration}</span>
              <User size={16} className="mr-1.5" />
              <span>{course.instructor.name}</span>
            </div>
          </div>
          
          {/* Lesson content */}
          <div className="bg-neutral-800/50 rounded-lg p-6 mb-6">
            <MarkdownRenderer content={currentLesson.description} />
          </div>
          
          {/* Resources */}
          {currentLesson.resources && currentLesson.resources.length > 0 && (
            <div className="bg-neutral-800/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-3">
                {currentLesson.resources.map((resource, index) => (
                  <li key={index}>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      {resource.type === 'document' && <BookOpen size={16} className="mr-2" />}
                      {resource.type === 'repository' && <span className="mr-2">📦</span>}
                      {resource.type === 'link' && <span className="mr-2">🔗</span>}
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Quiz section */}
          {currentLesson.hasQuiz && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">📝</span> Knowledge Check
              </h3>
              <p className="text-neutral-300 mb-4">
                Test your understanding of this lesson with a short quiz.
              </p>
              <button className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition-colors">
                Start Quiz
              </button>
            </div>
          )}
        </div>
        
        {/* Sidebar - lesson list */}
        <div className="bg-neutral-800/50 rounded-lg p-6 h-fit">
          <div className="flex items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Course Content</h3>
            <span className="ml-auto text-xs text-neutral-400">
              {course.lessons.length} lessons
            </span>
          </div>
          
          <div className="space-y-4">
            {course.lessons.map((lesson, index) => (
              <div 
                key={lesson.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  activeLesson === lesson.id 
                    ? 'bg-primary/20 border border-primary/30' 
                    : 'hover:bg-neutral-700/30'
                }`}
                onClick={() => setActiveLesson(lesson.id)}
              >
                <div className="flex items-start">
                  <div className="bg-neutral-700 text-white text-xs font-medium h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">{lesson.title}</h4>
                    <div className="flex items-center text-xs text-neutral-400">
                      <Clock size={12} className="mr-1" />
                      <span>{lesson.duration}</span>
                      {activeLesson === lesson.id && (
                        <span className="ml-2 flex items-center text-primary">
                          <CheckCircle size={12} className="mr-1" />
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Course completion and badge */}
          <div className="mt-8 pt-6 border-t border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-medium">Course Progress</h4>
              <span className="text-primary text-sm">0%</span>
            </div>
            <div className="h-2 bg-neutral-700 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `0%` }}
              ></div>
            </div>
            
            <div className="bg-neutral-700/30 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Award size={24} className="text-yellow-400" />
              </div>
              <h4 className="text-white font-medium mb-1">Complete to Earn</h4>
              <div className="text-sm text-neutral-400 mb-3">
                {course.badge.name} Badge
              </div>
              <button className="w-full bg-neutral-700 hover:bg-neutral-600 text-white py-2 rounded-md transition-colors">
                View Badge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer; 