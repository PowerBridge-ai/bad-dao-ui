import React, { useState, useEffect } from 'react';
import { Search, Filter, SortDesc, Sliders, PlusCircle } from 'lucide-react';
import BountyCard, { BountyStatus, BountyDifficulty } from './BountyCard';

interface Bounty {
  id: string;
  title: string;
  description: string;
  dao: {
    id: string;
    name: string;
    logo: string;
  };
  amount: number;
  tokenSymbol: string;
  dueDate?: Date;
  createdAt: Date;
  status: BountyStatus;
  applicants: number;
  difficulty: BountyDifficulty;
  skills: string[];
}

interface BountyMarketplaceProps {
  bounties: Bounty[];
  isLoading?: boolean;
  onCreateBounty?: () => void;
  currentUserCanCreate?: boolean;
}

const BountyMarketplace: React.FC<BountyMarketplaceProps> = ({
  bounties,
  isLoading = false,
  onCreateBounty,
  currentUserCanCreate = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BountyStatus | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<BountyDifficulty | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'recent' | 'amount' | 'dueDate'>('recent');
  const [filteredBounties, setFilteredBounties] = useState<Bounty[]>(bounties);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Extract unique skills from all bounties
  const allSkills = Array.from(
    new Set(bounties.flatMap(bounty => bounty.skills))
  ).sort();
  
  // Filter and sort bounties when dependencies change
  useEffect(() => {
    let result = [...bounties];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(bounty => 
        bounty.title.toLowerCase().includes(lowerCaseSearch) || 
        bounty.description.toLowerCase().includes(lowerCaseSearch) ||
        bounty.dao.name.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    // Apply status filter
    if (selectedStatus) {
      result = result.filter(bounty => bounty.status === selectedStatus);
    }
    
    // Apply difficulty filter
    if (selectedDifficulty) {
      result = result.filter(bounty => bounty.difficulty === selectedDifficulty);
    }
    
    // Apply skill filter
    if (selectedSkill) {
      result = result.filter(bounty => 
        bounty.skills.includes(selectedSkill)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortOption === 'recent') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else if (sortOption === 'amount') {
        return b.amount - a.amount;
      } else if (sortOption === 'dueDate' && a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      return 0;
    });
    
    setFilteredBounties(result);
  }, [bounties, searchTerm, selectedStatus, selectedDifficulty, selectedSkill, sortOption]);
  
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-h2">Bounty Marketplace</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search bounties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button 
            className={`btn-outline flex items-center gap-1 ${isFilterOpen ? 'bg-primary-50 text-primary-600' : ''}`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Sliders size={16} />
            Filter
          </button>
          {currentUserCanCreate && (
            <button 
              className="btn-primary flex items-center gap-1"
              onClick={onCreateBounty}
            >
              <PlusCircle size={16} />
              Create Bounty
            </button>
          )}
        </div>
      </div>
      
      {isFilterOpen && (
        <div className="bg-neutral-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-body-sm font-medium mb-2">Status</h4>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 rounded-md text-xs ${
                  selectedStatus === null 
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                }`}
                onClick={() => setSelectedStatus(null)}
              >
                All
              </button>
              {(['open', 'in-progress', 'review', 'completed'] as BountyStatus[]).map(status => (
                <button
                  key={status}
                  className={`px-3 py-1.5 rounded-md text-xs ${
                    selectedStatus === status 
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-body-sm font-medium mb-2">Difficulty</h4>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 rounded-md text-xs ${
                  selectedDifficulty === null 
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                }`}
                onClick={() => setSelectedDifficulty(null)}
              >
                All
              </button>
              {(['beginner', 'intermediate', 'advanced', 'expert'] as BountyDifficulty[]).map(difficulty => (
                <button
                  key={difficulty}
                  className={`px-3 py-1.5 rounded-md text-xs ${
                    selectedDifficulty === difficulty 
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }`}
                  onClick={() => setSelectedDifficulty(difficulty)}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-body-sm font-medium mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              <button
                className={`px-3 py-1.5 rounded-md text-xs ${
                  selectedSkill === null 
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                }`}
                onClick={() => setSelectedSkill(null)}
              >
                All
              </button>
              {allSkills.map(skill => (
                <button
                  key={skill}
                  className={`px-3 py-1.5 rounded-md text-xs ${
                    selectedSkill === skill 
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }`}
                  onClick={() => setSelectedSkill(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-neutral-medium">Showing {filteredBounties.length} bounties</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-neutral-medium">Sort by:</span>
          <div className="flex border border-neutral-300 rounded-md overflow-hidden">
            <button
              className={`px-3 py-1.5 text-sm ${
                sortOption === 'recent' 
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-white text-neutral-800 hover:bg-neutral-50'
              }`}
              onClick={() => setSortOption('recent')}
            >
              Recent
            </button>
            <button
              className={`px-3 py-1.5 text-sm border-l border-neutral-300 ${
                sortOption === 'amount' 
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-white text-neutral-800 hover:bg-neutral-50'
              }`}
              onClick={() => setSortOption('amount')}
            >
              Reward
            </button>
            <button
              className={`px-3 py-1.5 text-sm border-l border-neutral-300 ${
                sortOption === 'dueDate' 
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-white text-neutral-800 hover:bg-neutral-50'
              }`}
              onClick={() => setSortOption('dueDate')}
            >
              Due Date
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div 
              key={index}
              className="card animate-pulse"
              style={{ height: '280px' }}
            >
              <div className="h-full bg-neutral-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : filteredBounties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBounties.map(bounty => (
            <BountyCard key={bounty.id} {...bounty} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <h3 className="text-h3 mb-2">No Bounties Found</h3>
          <p className="text-neutral-medium">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          {currentUserCanCreate && (
            <button 
              className="btn-primary flex items-center gap-1 mt-4 mx-auto"
              onClick={onCreateBounty}
            >
              <PlusCircle size={16} />
              Create New Bounty
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BountyMarketplace; 