import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Award,
  Tag,
  Building,
  FileText,
  ExternalLink,
  Globe,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { mockBounties } from '../mock/bounties';
import { mockDAOs } from '../mock/daos';
import Avatar from '../components/common/Avatar';

const BountyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
  // Find the bounty by ID
  const bounty = mockBounties.find(b => b.id === id);
  
  // Find additional DAO info
  const daoInfo = mockDAOs.find(dao => dao.id === bounty?.dao.id);
  
  // If bounty not found, show error
  if (!bounty) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertTriangle size={20} className="mr-2" />
          <span>Bounty not found. The requested bounty may have been removed or doesn't exist.</span>
        </div>
        <button 
          onClick={() => navigate('/project-management/bounties')}
          className="mt-4 flex items-center text-primary hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Return to bounty list
        </button>
      </div>
    );
  }
  
  // Calculate time remaining
  const getTimeLeft = (dueDate: Date) => {
    const now = new Date();
    const timeLeft = dueDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : 'Expired';
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/project-management/bounties')}
          className="flex items-center text-primary hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to bounties
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg overflow-hidden">
            <div className="flex items-center p-5 border-b border-neutral-700/50">
              <img 
                src={bounty.dao.logo} 
                alt={bounty.dao.name}
                className="w-12 h-12 rounded-md mr-4"
              />
              <div>
                <Link to={`/project-management/daos/${bounty.dao.id}`} className="text-lg font-medium text-white hover:text-primary">
                  {bounty.dao.name}
                </Link>
                <div className="flex items-center text-sm text-neutral-400 mt-1">
                  <Users size={14} className="mr-1" />
                  <span>Active contributors: {bounty.applicants}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-sm font-medium py-1 px-3 rounded-full ${
                  bounty.status === 'open' ? 'bg-green-500/10 text-green-400' :
                  bounty.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-neutral-500/10 text-neutral-400'
                }`}>
                  {bounty.status.charAt(0).toUpperCase() + bounty.status.slice(1)}
                </span>
                <span className="text-sm text-neutral-400 bg-neutral-700/20 py-1 px-3 rounded-full flex items-center">
                  <Clock size={14} className="mr-1.5" />
                  {getTimeLeft(bounty.dueDate)}
                </span>
                <span className="text-sm text-neutral-400 bg-neutral-700/20 py-1 px-3 rounded-full flex items-center">
                  <Tag size={14} className="mr-1.5" />
                  {bounty.difficulty.charAt(0).toUpperCase() + bounty.difficulty.slice(1)}
                </span>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">{bounty.title}</h1>
              
              <div className="flex items-center mb-6">
                <Award size={20} className="text-yellow-400 mr-2" />
                <span className="text-2xl font-bold text-white">${bounty.amount} {bounty.tokenSymbol}</span>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
                <p className="text-neutral-300 whitespace-pre-line">{bounty.description}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {bounty.skills.map(skill => (
                    <span 
                      key={skill} 
                      className="text-sm bg-neutral-700/40 text-neutral-300 py-1 px-3 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-700/20 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-neutral-400 mb-1">Posted On</h3>
                  <div className="flex items-center text-white">
                    <Calendar size={16} className="mr-2 text-neutral-400" />
                    {formatDate(bounty.createdAt)}
                  </div>
                </div>
                
                <div className="bg-neutral-700/20 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-neutral-400 mb-1">Due Date</h3>
                  <div className="flex items-center text-white">
                    <Calendar size={16} className="mr-2 text-neutral-400" />
                    {formatDate(bounty.dueDate)}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button 
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-5 rounded-md transition-colors flex-1 flex justify-center items-center"
                  onClick={() => setIsApplyModalOpen(true)}
                >
                  Apply for this Bounty
                </button>
                <Link 
                  to={`/project-management/daos/${bounty.dao.id}`}
                  className="bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-2.5 px-5 rounded-md transition-colors flex items-center justify-center"
                >
                  <Building size={16} className="mr-2" />
                  View DAO Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg overflow-hidden mb-6">
            <div className="p-5 border-b border-neutral-700/50">
              <h2 className="text-lg font-semibold text-white">About {bounty.dao.name}</h2>
            </div>
            
            <div className="p-5">
              {daoInfo && (
                <>
                  <p className="text-neutral-300 mb-4">{daoInfo.description}</p>
                  
                  <div className="flex items-center mb-3">
                    <Users size={16} className="text-neutral-400 mr-2" />
                    <span className="text-neutral-300">{daoInfo.memberCount.toLocaleString()} members</span>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <Tag size={16} className="text-neutral-400 mr-2" />
                    <span className="text-neutral-300">{daoInfo.category}</span>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <Globe size={16} className="text-neutral-400 mr-2" />
                    <a 
                      href={daoInfo.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      Visit Website
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {daoInfo.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="text-xs bg-neutral-700/40 text-neutral-300 py-1 px-2 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
              
              {!daoInfo && (
                <p className="text-neutral-400">No additional information available about this DAO.</p>
              )}
            </div>
          </div>
          
          <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg overflow-hidden">
            <div className="p-5 border-b border-neutral-700/50">
              <h2 className="text-lg font-semibold text-white">Similar Bounties</h2>
            </div>
            
            <div className="p-5">
              {mockBounties
                .filter(b => b.id !== bounty.id && b.skills.some(skill => bounty.skills.includes(skill)))
                .slice(0, 3)
                .map(similarBounty => (
                  <Link
                    key={similarBounty.id}
                    to={`/project-management/bounties/${similarBounty.id}`}
                    className="block p-3 hover:bg-neutral-700/20 rounded-md mb-2 transition-colors"
                  >
                    <div className="flex items-start">
                      <img 
                        src={similarBounty.dao.logo} 
                        alt={similarBounty.dao.name}
                        className="w-8 h-8 rounded mr-2 mt-1"
                      />
                      <div>
                        <h3 className="text-white font-medium">{similarBounty.title}</h3>
                        <div className="flex items-center mt-1">
                          <Award size={14} className="text-yellow-400 mr-1" />
                          <span className="text-sm text-neutral-300">${similarBounty.amount} {similarBounty.tokenSymbol}</span>
                          <span className="mx-2 text-neutral-500">•</span>
                          <span className="text-sm text-neutral-400">{getTimeLeft(similarBounty.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              
              {mockBounties.filter(b => b.id !== bounty.id && b.skills.some(skill => bounty.skills.includes(skill))).length === 0 && (
                <p className="text-neutral-400">No similar bounties found.</p>
              )}
              
              <Link 
                to="/project-management/bounties"
                className="mt-4 flex items-center text-primary hover:underline"
              >
                View all bounties
                <ArrowLeft size={14} className="ml-1 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Apply Modal (placeholder) */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 rounded-lg w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Apply for Bounty</h2>
            <p className="text-neutral-300 mb-6">Submit your application for "{bounty.title}"</p>
            
            <div className="mb-4">
              <label className="block text-neutral-300 mb-2">
                Cover Letter / Proposal
              </label>
              <textarea 
                className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-3 text-white h-40"
                placeholder="Describe why you're a good fit for this bounty..."
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-neutral-300 mb-2">
                Estimated Completion Time
              </label>
              <input 
                type="text" 
                className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-3 text-white"
                placeholder="e.g., 2 weeks"
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                className="bg-neutral-700 hover:bg-neutral-600 text-white py-2 px-4 rounded-md"
                onClick={() => setIsApplyModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md"
                onClick={() => {
                  alert('Application submitted successfully!');
                  setIsApplyModalOpen(false);
                }}
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BountyDetailPage; 