import { useState, useEffect } from 'react';
import { Search, Star, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dbService, { Space as DBSpace } from '../services/database';
import seedDatabase from '../utils/seedDatabase';

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

const SpacesExplorer = () => {
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
          // No spaces found, seed the database
          console.log('No spaces found, seeding database...');
          await seedDatabase();
          
          // Try fetching again after seeding
          const seededSpaces = await dbService.getAllSpaces();
          
          if (seededSpaces && seededSpaces.length > 0) {
            const formattedSpaces = seededSpaces.map((dbSpace: DBSpace) => ({
              id: dbSpace.id?.toString() || '',
              name: dbSpace.name,
              logo: dbSpace.logo || `/mock/${dbSpace.name.toLowerCase().replace(/\s+/g, '-')}-logo.png`,
              isVerified: false,
              description: dbSpace.description,
              proposalCount: dbSpace.proposalCount || 0,
              voteCount: dbSpace.voteCount || 0,
              tags: dbSpace.categories,
            }));
            
            setSpaces(formattedSpaces);
          } else {
            // Fall back to mock data if seeding fails
            setSpaces(mockSpaces);
          }
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

      <div className="mb-lg flex justify-between items-center">
        <h2 className="text-h2 text-white">EXPLORE SPACES</h2>
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
              className="card hover:shadow-md transition-shadow border-t-4 border-primary cursor-pointer"
              onClick={() => navigate(`/spaces/${space.id}`)}
            >
              <div className="flex items-center gap-md">
                <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-neutral-dark/30 flex items-center justify-center">
                  {space.logo ? (
                    <img src={space.logo} alt={`${space.name} logo`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-h2 font-bold text-primary">{space.name.charAt(0)}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-sm">
                    <h3 className="text-h3 truncate">{space.name}</h3>
                    {space.isVerified && (
                      <span className="badge badge-success text-caption">Verified</span>
                    )}
                  </div>
                  <p className="text-body-sm text-neutral-medium line-clamp-2">{space.description}</p>
                </div>
                
                <button
                  className={`btn-icon-secondary flex-shrink-0 ${space.isFollowing ? 'text-primary' : 'text-neutral-light'}`}
                  onClick={(e) => {
                    e.stopPropagation();  // Prevent card click when follow button is clicked
                    handleFollow(space.id);
                  }}
                  aria-label={space.isFollowing ? 'Unfollow' : 'Follow'}
                >
                  <Star size={20} fill={space.isFollowing ? 'currentColor' : 'none'} />
                </button>
              </div>
              
              <div className="mt-md pt-md border-t border-neutral-dark/30 flex justify-between">
                <div>
                  <div className="text-body-sm text-neutral-medium">Proposals</div>
                  <div className="text-body font-medium">{formatNumber(space.proposalCount)}</div>
                </div>
                <div>
                  <div className="text-body-sm text-neutral-medium">Votes</div>
                  <div className="text-body font-medium">{formatNumber(space.voteCount)}</div>
                </div>
                <div>
                  <div className="text-body-sm text-neutral-medium">Tags</div>
                  <div className="flex gap-1">
                    {space.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="bg-neutral-dark rounded-full px-2 py-1 text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpacesExplorer; 