import { useState, useEffect } from 'react';
import { Search, Star, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dbService, { Space as DBSpace } from '../services/database';

// Define space type
type Space = {
  id: string;
  name: string;
  logo: string;
  isVerified: boolean;
  description: string;
  proposalCount: number;
  voteCount: number;
  isFollowing?: boolean;
  tags?: string[];
};

// Categories for filtering
const categories = [
  { id: 'all', name: 'All categories' },
  { id: 'defi', name: 'DeFi' },
  { id: 'nft', name: 'NFT' },
  { id: 'dao', name: 'DAO' },
  { id: 'gaming', name: 'Gaming' },
];

// Networks for filtering
const networks = [
  { id: 'all', name: 'All networks' },
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'polygon', name: 'Polygon' },
  { id: 'base', name: 'Base' },
  { id: 'arbitrum', name: 'Arbitrum' },
];

// Protocols for filtering
const protocols = [
  { id: 'all', name: 'All protocols' },
  { id: 'snapshot', name: 'Snapshot' },
  { id: 'compound', name: 'Compound' },
  { id: 'aave', name: 'Aave' },
];

// Mock data for initial loading or fallback
const mockSpaces: Space[] = [
  {
    id: 'stargate-dao',
    name: 'Stargate DAO',
    logo: '/mock/stargate-logo.png',
    isVerified: true,
    description: 'Stargate is a fully composable liquidity transport protocol that lives at the heart of Omnichain DeFi.',
    proposalCount: 135,
    voteCount: 18000,
    tags: ['DeFi', 'Bridge'],
  },
  {
    id: 'arbitrum-dao',
    name: 'Arbitrum DAO',
    logo: '/mock/arbitrum-logo.png',
    isVerified: true,
    description: 'The official snapshot space for the Arbitrum DAO',
    proposalCount: 366,
    voteCount: 5600,
    tags: ['L2', 'Ethereum'],
  },
  {
    id: 'aave-dao',
    name: 'Aave DAO',
    logo: '/mock/aave-logo.png',
    isVerified: true,
    description: 'Aave is an Open Source Protocol to create Non-Custodial Liquidity Markets.',
    proposalCount: 832,
    voteCount: 3200000,
    tags: ['DeFi', 'Lending'],
  },
  {
    id: 'aavegotchi',
    name: 'Aavegotchi',
    logo: '/mock/aavegotchi-logo.png',
    isVerified: true,
    description: 'A decentralized community building the future of gaming.',
    proposalCount: 558,
    voteCount: 430000,
    tags: ['Gaming', 'NFT'],
  },
  {
    id: 'uniswap',
    name: 'Uniswap',
    logo: '/mock/uniswap-logo.png',
    isVerified: true,
    description: 'Only delegated UNI may be used to vote on proposals. You can delegate to yourself or others.',
    proposalCount: 175,
    voteCount: 308000,
    tags: ['DeFi', 'Exchange'],
  },
  {
    id: 'decentraland',
    name: 'Decentraland',
    logo: '/mock/decentraland-logo.png',
    isVerified: true,
    description: 'Decentraland Snapshot Space',
    proposalCount: 2700,
    voteCount: 175000,
    tags: ['Metaverse', 'NFT'],
  },
  {
    id: 'event-horizon',
    name: 'Event Horizon',
    logo: '/mock/event-horizon-logo.png',
    isVerified: true,
    description: 'Public Good, Public-Access Governance Pool',
    proposalCount: 747,
    voteCount: 29000,
    tags: ['Public Goods', 'Governance'],
  },
  {
    id: 'balancer',
    name: 'Balancer',
    logo: '/mock/balancer-logo.png',
    isVerified: true,
    description: 'veCRV voting for Convex Finance on Curve Protocol',
    proposalCount: 984,
    voteCount: 124000,
    tags: ['DeFi', 'AMM'],
  },
  {
    id: 'convex-finance',
    name: 'Convex Finance',
    logo: '/mock/convex-logo.png',
    isVerified: true,
    description: 'veCRV voting for Convex Finance on Curve Protocol',
    proposalCount: 1800,
    voteCount: 115000,
    tags: ['DeFi', 'Yield'],
  },
  {
    id: 'radiant-capital',
    name: 'Radiant Capital',
    logo: '/mock/radiant-logo.png',
    isVerified: true,
    description: 'Radiant is building the first omnichain money market atop LayerZero. Deposit & borrow assets on any chain.',
    proposalCount: 53,
    voteCount: 84000,
    tags: ['DeFi', 'Lending'],
  },
  {
    id: 'beets',
    name: 'Beets',
    logo: '/mock/beets-logo.png',
    isVerified: true,
    description: 'Beethoven X is a next-generation decentralized exchange.',
    proposalCount: 230,
    voteCount: 67000,
    tags: ['DeFi', 'AMM'],
  },
  {
    id: 'xborg',
    name: 'XBorg',
    logo: '/mock/xborg-logo.png',
    isVerified: true,
    description: 'Build the future of gaming.',
    proposalCount: 188,
    voteCount: 54000,
    tags: ['Gaming', 'Esports'],
  },
];

const Spaces = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [selectedProtocol, setSelectedProtocol] = useState('all');
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch spaces from database
    const fetchSpaces = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First check if we have spaces in the database
        const dbSpaces = await dbService.getAllSpaces();
        
        if (dbSpaces && dbSpaces.length > 0) {
          // Convert DB spaces to UI format
          const formattedSpaces = dbSpaces.map((dbSpace: DBSpace) => ({
            id: dbSpace.id?.toString() || '',
            name: dbSpace.name,
            logo: dbSpace.logo || `/mock/${dbSpace.name.toLowerCase().replace(/\s+/g, '-')}-logo.png`,
            isVerified: false, // New user-created spaces aren't verified
            description: dbSpace.description,
            proposalCount: dbSpace.proposalCount || 0,
            voteCount: dbSpace.voteCount || 0,
            tags: dbSpace.categories,
          }));
          
          // Combine with mock data for now (in a real app, we'd only use DB data)
          setSpaces([...formattedSpaces, ...mockSpaces]);
        } else {
          // Fall back to mock data if no spaces in DB
          setSpaces(mockSpaces);
        }
      } catch (error) {
        console.error('Error fetching spaces:', error);
        setError('Failed to load spaces. Please try again later.');
        // Fall back to mock data
        setSpaces(mockSpaces);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  // Filter spaces based on search query and filters
  const filteredSpaces = spaces.filter((space) => {
    const matchesSearch = 
      searchQuery === '' || 
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      space.tags?.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase());
    
    // In a real implementation, we would check the network and protocol attributes
    // For now, we'll assume all match as we don't have that data mocked
    return matchesSearch && matchesCategory;
  });

  // Format number functions
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}m`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const handleFollow = (spaceId: string) => {
    setSpaces(spaces.map(space => 
      space.id === spaceId 
        ? {...space, isFollowing: !space.isFollowing} 
        : space
    ));
  };

  // Handle create space button click
  const handleCreateSpace = () => {
    navigate('/create-space');
  };

  return (
    <div className="pb-xl">
      {/* Error message if any */}
      {error && (
        <div className="mb-md p-md bg-red-500/20 border border-red-500 rounded-lg text-white">
          {error}
        </div>
      )}

      {/* Onboarding banner for new users */}
      <div className="mb-xl">
        <div className="bg-neutral-dark rounded-xl p-lg">
          <h2 className="text-h2 mb-sm">ONBOARDING</h2>
          <div className="space-y-md">
            <div className="flex items-center gap-md">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                1
              </div>
              <p className="text-white">Setup your profile</p>
            </div>
            <div className="flex items-center gap-md">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                2
              </div>
              <p className="text-white">Follow at least 3 spaces</p>
            </div>
            <div className="flex items-center gap-md">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                3
              </div>
              <p className="text-white">Cast your first vote</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-lg">
        <div className="relative mb-lg">
          <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-light" />
          </div>
          <input
            type="text"
            className="py-md pl-xl pr-md w-full bg-neutral-dark/50 border border-neutral-light/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Search for a space"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-md">
          {/* Category filter */}
          <div className="relative">
            <select
              className="appearance-none w-full px-md py-md pr-8 bg-neutral-dark border border-neutral-light/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-md flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-neutral-light" />
            </div>
          </div>

          {/* Network filter */}
          <div className="relative">
            <select
              className="appearance-none w-full px-md py-md pr-8 bg-neutral-dark border border-neutral-light/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
            >
              {networks.map(network => (
                <option key={network.id} value={network.id}>{network.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-md flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-neutral-light" />
            </div>
          </div>

          {/* Protocol filter */}
          <div className="relative">
            <select
              className="appearance-none w-full px-md py-md pr-8 bg-neutral-dark border border-neutral-light/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              value={selectedProtocol}
              onChange={(e) => setSelectedProtocol(e.target.value)}
            >
              {protocols.map(protocol => (
                <option key={protocol.id} value={protocol.id}>{protocol.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-md flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-neutral-light" />
            </div>
          </div>
        </div>
      </div>

      {/* Section title */}
      <div className="mb-lg flex justify-between items-center">
        <h2 className="text-h2 text-white">SPACES</h2>
        <button 
          className="flex items-center gap-sm bg-primary hover:bg-primary-dark text-white px-md py-sm rounded-lg transition-colors"
          onClick={handleCreateSpace}
        >
          <Plus size={18} />
          <span>Create Space</span>
        </button>
      </div>

      {/* Spaces grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
          {Array.from({ length: 8 }).map((_, index) => (
            <div 
              key={index} 
              className="animate-pulse bg-neutral-dark/70 rounded-xl h-64"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
          {filteredSpaces.map((space) => (
            <div 
              key={space.id} 
              className="group bg-neutral-dark hover:bg-neutral-dark/70 rounded-xl overflow-hidden transition-all cursor-pointer"
            >
              {/* Space card header/banner image - using gradient as placeholder */}
              <div className="h-24 bg-gradient-to-r from-primary/20 to-primary-dark/20 relative">
                {/* Space logo */}
                <div className="absolute -bottom-6 left-4 w-12 h-12 rounded-lg bg-neutral-dark border border-neutral-dark flex items-center justify-center overflow-hidden">
                  {space.logo ? (
                    <img 
                      src={space.logo.startsWith('/') ? `/bad-dao${space.logo}` : space.logo} 
                      alt={`${space.name} logo`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/1E1E1E/1AB759?text=DAO';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {space.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                {/* Follow button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollow(space.id);
                  }}
                  className={`absolute top-3 right-3 p-1 rounded-full transition-colors ${space.isFollowing ? 'bg-primary text-white' : 'bg-neutral-dark/50 text-white hover:bg-neutral-light/20'}`}
                >
                  <Star size={18} fill={space.isFollowing ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Space content */}
              <div className="p-4 pt-8">
                {/* Space name and verification */}
                <div className="flex items-center mb-2">
                  <h3 className="text-h3 text-white mr-1">{space.name}</h3>
                  {space.isVerified && (
                    <span className="text-primary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </div>

                {/* Space description */}
                <p className="text-body text-neutral-light/80 mb-4 line-clamp-2">{space.description}</p>

                {/* Space stats */}
                <div className="flex items-center text-sm text-neutral-light/60">
                  <span className="mr-4">{space.proposalCount} proposals</span>
                  <span>{formatNumber(space.voteCount)} votes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredSpaces.length === 0 && (
        <div className="bg-neutral-dark/50 rounded-xl p-xl flex flex-col items-center justify-center">
          <div className="mb-md text-4xl">🔍</div>
          <h3 className="text-h3 text-white mb-sm">No spaces found</h3>
          <p className="text-neutral-light/80 text-center max-w-md">
            We couldn't find any spaces matching your search. Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </div>
  );
};

export default Spaces; 