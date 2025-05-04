import { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Bell, Menu, Sun, Moon, ChevronDown, User, Search } from 'lucide-react';
import { useThirdwebWallet } from '../../hooks/useThirdwebWallet';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { truncateAddress } from '../../utils/address';
import Logo from '../common/Logo';
import dbService from '../../services/database';
import { Space } from '../../services/database'; // Import Space interface

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

// Mock data for search when database is empty or fails - ensure IDs are provided
const MOCK_SPACES: Space[] = [
  { 
    id: 'stargate-dao', 
    name: 'Stargate DAO', 
    description: 'Cross-chain liquidity protocol',
    categories: ['DAO', 'DeFi'], 
    creator: 'stargate-team',
    isPublic: true
  },
  { 
    id: 'arbitrum-dao', 
    name: 'Arbitrum DAO', 
    description: 'Layer 2 scaling solution',
    categories: ['DAO', 'Layer 2'],
    creator: 'arbitrum-team',
    isPublic: true
  },
  { 
    id: 'aave-dao', 
    name: 'Aave DAO', 
    description: 'Decentralized money market protocol',
    categories: ['DAO', 'DeFi', 'Lending'],
    creator: 'aave-team',
    isPublic: true
  },
  { 
    id: 'uniswap-dao', 
    name: 'Uniswap DAO', 
    description: 'Decentralized exchange protocol',
    categories: ['DAO', 'DeFi', 'DEX'],
    creator: 'uniswap-team',
    isPublic: true
  },
];

const Header = ({ title, onMenuClick }: HeaderProps) => {
  const { disconnect, address } = useThirdwebWallet();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Space[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await disconnect();
    logout();
    navigate('/connect');
  };
  
  // Search functionality
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    try {
      // Try to get spaces from database
      let spaces: Space[] = [];
      try {
        spaces = await dbService.getAllSpaces();
      } catch (error) {
        console.error('Error fetching spaces from database:', error);
        spaces = [];
      }
      
      // If database returned empty array or failed, use mock data
      if (!spaces || spaces.length === 0) {
        spaces = MOCK_SPACES;
      }
      
      // Filter spaces based on search query
      const filteredSpaces = spaces.filter((space: Space) => 
        space.name.toLowerCase().includes(query.toLowerCase()) ||
        (space.description && space.description.toLowerCase().includes(query.toLowerCase())) ||
        (space.categories && Array.isArray(space.categories) && 
          space.categories.some((category: string) => category.toLowerCase().includes(query.toLowerCase())))
      );
      
      setSearchResults(filteredSpaces);
      // Always show results dropdown if we have results and query is not empty
      setShowResults(filteredSpaces.length > 0);
      
    } catch (error) {
      console.error('Error during search:', error);
      // Fallback to filtered mock data
      const filteredMockResults = MOCK_SPACES.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        (item.categories && item.categories.some(cat => cat.toLowerCase().includes(query.toLowerCase())))
      );
      
      setSearchResults(filteredMockResults);
      setShowResults(filteredMockResults.length > 0);
    }
  };
  
  const handleResultClick = (spaceId: string) => {
    navigate(`/spaces/${spaceId}`);
    setShowResults(false);
    setSearchQuery('');
  };

  return (
    <header className="bg-black border-b border-neutral-dark sticky top-0 z-30 transition-shadow">
      <div className="max-w-7xl mx-auto px-md py-3 flex items-center justify-between">
        <div className="flex items-center gap-md">
          <button 
            type="button"
            className="lg:hidden text-white hover:text-primary p-2 rounded-lg"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          
          <Logo size="medium" />
        </div>
        
        {/* Search bar - replaces the navigation */}
        <div className="flex-1 mx-6 relative" ref={searchRef}>
          <div className="relative w-full max-w-2xl mx-auto">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-light" 
            />
            <input
              type="text"
              placeholder="Search spaces and communities..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.trim() !== '' && setShowResults(true)}
              className="w-full bg-neutral-dark/70 border border-neutral-light/20 rounded-xl py-2 pl-10 pr-4 text-white placeholder-neutral-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            />
            
            {/* Search results dropdown */}
            {showResults && (
              <div className="absolute mt-2 w-full bg-neutral-dark border border-neutral-light/20 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <div
                      key={result.id || `space-${result.name}`}
                      onClick={() => result.id ? handleResultClick(result.id) : null}
                      className={`px-4 py-3 ${result.id ? 'hover:bg-neutral-light/10 cursor-pointer' : ''} flex items-center`}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        {result.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{result.name}</div>
                        <div className="text-neutral-light text-sm">
                          {result.categories?.join(', ') || 'Space'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-neutral-light">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-md">
          <button
            type="button"
            className="text-white hover:text-primary p-2 rounded-lg relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full"></span>
          </button>
          
          <button
            type="button"
            className="text-white hover:text-primary p-2 rounded-lg hidden md:flex"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-sm font-medium hover:bg-neutral-dark/30 py-2 px-3 rounded-lg text-white"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                {user?.displayName?.charAt(0) || 'U'}
              </div>
              <span className="hidden md:block">
                {user?.displayName || truncateAddress(address || '')}
              </span>
              <ChevronDown size={16} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-neutral-dark rounded-lg shadow-dropdown py-1 animate-enter">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-neutral-light/10"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    navigate('/admin');
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-neutral-light/10"
                >
                  Admin Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-accent-red hover:bg-neutral-light/10"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;