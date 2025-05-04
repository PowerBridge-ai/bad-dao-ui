import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Users,
  Clock,
  Tag,
  Award,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { mockBounties } from '../mock/bounties';

const BountyPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const navigate = useNavigate();

  const filterOptions = [
    { id: 'all', label: 'All Bounties' },
    { id: 'open', label: 'Open' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' }
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'highest', label: 'Highest Reward' },
    { id: 'lowest', label: 'Lowest Reward' }
  ];

  // Simplified for this example
  const filteredBounties = mockBounties.filter(bounty => 
    currentFilter === 'all' || bounty.status.toLowerCase() === currentFilter
  );

  // Function to format the time left from due date
  const getTimeLeft = (dueDate: Date) => {
    const now = new Date();
    const timeLeft = dueDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : 'Expired';
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Bounty Marketplace</h1>
        <div className="flex gap-2">
          <button 
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
            onClick={() => navigate('/project-management/bounties/create')}
          >
            <Plus size={16} className="mr-2" />
            Post Bounty
          </button>
          <button className="bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-md px-3 py-2 flex items-center">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="flex gap-2 mb-4 md:mb-0 overflow-x-auto hide-scrollbar">
          {filterOptions.map(option => (
            <button
              key={option.id}
              className={`px-4 py-2 rounded-md whitespace-nowrap ${currentFilter === option.id ? 'bg-primary text-white' : 'bg-neutral-800 text-neutral-300'}`}
              onClick={() => setCurrentFilter(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bounties..."
              className="bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-lg px-4 py-2 pl-10 w-60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-2.5 text-neutral-500" />
          </div>
          <div className="relative">
            <select className="bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg px-4 py-2 pr-10 appearance-none cursor-pointer">
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-3 top-2.5 text-neutral-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBounties.map(bounty => (
          <div 
            key={bounty.id}
            className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg overflow-hidden"
          >
            <div className="flex items-center p-5 border-b border-neutral-700/50">
              <img 
                src={bounty.dao.logo} 
                alt={bounty.dao.name}
                className="w-10 h-10 rounded-md mr-3"
              />
              <div>
                <h3 className="font-medium text-white">{bounty.dao.name}</h3>
                <div className="flex items-center text-xs text-neutral-400 mt-0.5">
                  <Users size={12} className="mr-1" />
                  <span>Active contributors: {bounty.applicants}</span>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between">
                <span className={`text-xs font-medium py-1 px-2 rounded-md ${
                  bounty.status === 'open' ? 'bg-green-500/10 text-green-400' :
                  bounty.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-neutral-500/10 text-neutral-400'
                }`}>
                  {bounty.status.charAt(0).toUpperCase() + bounty.status.slice(1)}
                </span>
                <span className="text-xs text-neutral-400 flex items-center">
                  <Clock size={12} className="mr-1" />
                  {getTimeLeft(bounty.dueDate)}
                </span>
              </div>

              <h2 className="text-lg font-semibold text-white mt-3 mb-2">{bounty.title}</h2>
              <p className="text-sm text-neutral-400 mb-4">{bounty.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {bounty.skills.map(skill => (
                  <span 
                    key={skill} 
                    className="text-xs bg-neutral-700/40 text-neutral-300 py-1 px-2 rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <Award size={18} className="text-yellow-400 mr-2" />
                  <span className="text-lg font-bold text-white">${bounty.amount} {bounty.tokenSymbol}</span>
                </div>
                
                <div className="flex gap-2">
                  <Link 
                    to={`/project-management/bounties/${bounty.id}`}
                    className="bg-neutral-700 hover:bg-neutral-600 text-white text-sm py-1.5 px-3 rounded-md transition-colors"
                  >
                    View Details
                  </Link>
                  <button 
                    className="bg-primary hover:bg-primary/90 text-white text-sm py-1.5 px-3 rounded-md transition-colors"
                    onClick={() => navigate(`/project-management/bounties/${bounty.id}/apply`)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BountyPage; 