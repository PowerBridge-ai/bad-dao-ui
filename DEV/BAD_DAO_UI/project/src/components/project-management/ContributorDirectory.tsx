import React, { useState, useEffect } from 'react';
import { Search, Filter, SortDesc, Sliders, Star, Award, Users, X } from 'lucide-react';
import ContributorCard from './ContributorCard';

interface Contributor {
  id: string;
  name: string;
  avatar: string;
  title?: string;
  bio: string;
  skills: string[];
  rating: number;
  completedTasks: number;
  availableForWork: boolean;
  daos?: Array<{
    id: string;
    name: string;
    logo: string;
  }>;
}

interface ContributorDirectoryProps {
  contributors: Contributor[];
  isLoading?: boolean;
}

const ContributorDirectory: React.FC<ContributorDirectoryProps> = ({
  contributors,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortOption, setSortOption] = useState<'name' | 'rating' | 'tasks'>('rating');
  const [filteredContributors, setFilteredContributors] = useState<Contributor[]>(contributors);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Extract unique skills from all contributors
  const allSkills = Array.from(
    new Set(contributors.flatMap(contributor => contributor.skills))
  ).sort();
  
  // Filter and sort contributors when dependencies change
  useEffect(() => {
    let result = [...contributors];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(contributor => 
        contributor.name.toLowerCase().includes(lowerCaseSearch) || 
        contributor.bio.toLowerCase().includes(lowerCaseSearch) ||
        (contributor.title && contributor.title.toLowerCase().includes(lowerCaseSearch)) ||
        contributor.skills.some(skill => skill.toLowerCase().includes(lowerCaseSearch))
      );
    }
    
    // Apply skill filter
    if (selectedSkill) {
      result = result.filter(contributor => 
        contributor.skills.includes(selectedSkill)
      );
    }
    
    // Apply availability filter
    if (onlyAvailable) {
      result = result.filter(contributor => contributor.availableForWork);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'rating') {
        return b.rating - a.rating;
      } else if (sortOption === 'tasks') {
        return b.completedTasks - a.completedTasks;
      }
      return 0;
    });
    
    setFilteredContributors(result);
  }, [contributors, searchTerm, selectedSkill, onlyAvailable, sortOption]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Users size={24} className="text-primary mr-3" />
            <h2 className="text-2xl font-bold text-white">Contributors</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search contributors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-neutral-dark/30 border border-neutral-dark/50 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary w-72"
              />
            </div>
            <button 
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                isFilterOpen 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-dark/30 hover:bg-neutral-dark/50 text-white'
              }`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Sliders size={16} />
              <span>Filters</span>
            </button>
          </div>
        </div>
        
        {isFilterOpen && (
          <div className="bg-neutral-dark/20 border border-neutral-dark/50 p-5 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-medium">Filter Contributors</h4>
              <button 
                className="text-neutral-400 hover:text-white"
                onClick={() => setIsFilterOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-neutral-300 text-sm font-medium mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  <button
                    className={`px-3 py-1.5 rounded-md text-xs ${
                      selectedSkill === null 
                        ? 'bg-primary text-white'
                        : 'bg-neutral-dark/40 text-neutral-300 hover:bg-neutral-dark/60'
                    }`}
                    onClick={() => setSelectedSkill(null)}
                  >
                    All Skills
                  </button>
                  {allSkills.map(skill => (
                    <button
                      key={skill}
                      className={`px-3 py-1.5 rounded-md text-xs ${
                        selectedSkill === skill 
                          ? 'bg-primary text-white'
                          : 'bg-neutral-dark/40 text-neutral-300 hover:bg-neutral-dark/60'
                      }`}
                      onClick={() => setSelectedSkill(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-neutral-300 text-sm font-medium mb-3">Availability</h4>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={onlyAvailable}
                        onChange={(e) => setOnlyAvailable(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 ${onlyAvailable ? 'bg-primary' : 'bg-neutral-dark/50'} rounded flex items-center justify-center transition-colors`}>
                        {onlyAvailable && <span className="text-white text-xs">✓</span>}
                      </div>
                    </div>
                    <span className="text-sm text-white">Show only available for work</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-neutral-400">Showing <span className="text-white font-medium">{filteredContributors.length}</span> contributors</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-neutral-400 text-sm">Sort by:</span>
            <div className="flex border border-neutral-dark/50 rounded-lg overflow-hidden">
              <button
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${
                  sortOption === 'rating' 
                    ? 'bg-primary text-white'
                    : 'bg-neutral-dark/30 text-white hover:bg-neutral-dark/50'
                }`}
                onClick={() => setSortOption('rating')}
              >
                <Star size={14} />
                Rating
              </button>
              <button
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 border-l border-neutral-dark/50 ${
                  sortOption === 'tasks' 
                    ? 'bg-primary text-white'
                    : 'bg-neutral-dark/30 text-white hover:bg-neutral-dark/50'
                }`}
                onClick={() => setSortOption('tasks')}
              >
                <Award size={14} />
                Tasks
              </button>
              <button
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 border-l border-neutral-dark/50 ${
                  sortOption === 'name' 
                    ? 'bg-primary text-white'
                    : 'bg-neutral-dark/30 text-white hover:bg-neutral-dark/50'
                }`}
                onClick={() => setSortOption('name')}
              >
                <SortDesc size={14} />
                Name
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 overflow-y-auto flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div 
                key={index}
                className="bg-neutral-dark/30 border border-neutral-dark/50 rounded-lg animate-pulse"
                style={{ height: '220px' }}
              >
                <div className="h-full rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredContributors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContributors.map(contributor => (
              <ContributorCard key={contributor.id} {...contributor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-neutral-dark/20 border border-neutral-dark/50 rounded-lg">
            <h3 className="text-xl font-medium text-white mb-2">No Contributors Found</h3>
            <p className="text-neutral-400">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributorDirectory; 