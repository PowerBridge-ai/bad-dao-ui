import React, { useState, useEffect } from 'react';
import { Search, Filter, SortDesc, TrendingUp, Users } from 'lucide-react';
import DAOCard from './DAOCard';

interface DAO {
  id: string;
  name: string;
  description: string;
  logo: string;
  memberCount: number;
  category: string;
  tvl?: number;
  currency?: string;
  website?: string;
  tags: string[];
}

interface DAODirectoryProps {
  daos: DAO[];
  isLoading?: boolean;
}

const DAODirectory: React.FC<DAODirectoryProps> = ({ 
  daos,
  isLoading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'name' | 'members' | 'tvl'>('members');
  const [filteredDaos, setFilteredDaos] = useState<DAO[]>(daos);
  
  // Get unique categories from DAOs
  const categories = Array.from(new Set(daos.map(dao => dao.category)));
  
  // Filter and sort DAOs when dependencies change
  useEffect(() => {
    let result = [...daos];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(dao => 
        dao.name.toLowerCase().includes(lowerCaseSearch) || 
        dao.description.toLowerCase().includes(lowerCaseSearch) ||
        dao.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearch))
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(dao => dao.category === selectedCategory);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'members') {
        return b.memberCount - a.memberCount;
      } else if (sortOption === 'tvl') {
        const aTvl = a.tvl || 0;
        const bTvl = b.tvl || 0;
        return bTvl - aTvl;
      }
      return 0;
    });
    
    setFilteredDaos(result);
  }, [daos, searchTerm, selectedCategory, sortOption]);
  
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-h2">DAO Directory</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search DAOs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-3 py-1.5 rounded-md text-sm ${
            selectedCategory === null 
              ? 'bg-primary-100 text-primary-800'
              : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All Categories
        </button>
        
        {categories.map(category => (
          <button
            key={category}
            className={`px-3 py-1.5 rounded-md text-sm ${
              selectedCategory === category 
                ? 'bg-primary-100 text-primary-800'
                : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-neutral-medium">Showing {filteredDaos.length} DAOs</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-neutral-medium">Sort by:</span>
          <div className="flex border border-neutral-300 rounded-md overflow-hidden">
            <button
              className={`px-3 py-1.5 text-sm flex items-center gap-1 ${
                sortOption === 'members' 
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-white text-neutral-800 hover:bg-neutral-50'
              }`}
              onClick={() => setSortOption('members')}
            >
              <Users size={14} />
              Members
            </button>
            <button
              className={`px-3 py-1.5 text-sm flex items-center gap-1 border-l border-neutral-300 ${
                sortOption === 'tvl' 
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-white text-neutral-800 hover:bg-neutral-50'
              }`}
              onClick={() => setSortOption('tvl')}
            >
              <TrendingUp size={14} />
              TVL
            </button>
            <button
              className={`px-3 py-1.5 text-sm flex items-center gap-1 border-l border-neutral-300 ${
                sortOption === 'name' 
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-white text-neutral-800 hover:bg-neutral-50'
              }`}
              onClick={() => setSortOption('name')}
            >
              <SortDesc size={14} />
              Name
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      ) : filteredDaos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDaos.map(dao => (
            <DAOCard key={dao.id} {...dao} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <h3 className="text-h3 mb-2">No DAOs Found</h3>
          <p className="text-neutral-medium">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default DAODirectory; 