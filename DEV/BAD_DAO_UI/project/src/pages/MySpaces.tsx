import { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  InfoIcon, 
  Edit3, 
  Settings, 
  LayoutGrid, 
  Check, 
  Clock, 
  Star, 
  ChevronRight, 
  Award, 
  FileText, 
  Wallet,
  Users,
  Database,
  Home,
  Folder,
  FolderPlus,
  List
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import dbService, { Space as DBSpace } from '../services/database';

interface Space {
  id: string;
  name: string;
  logo: string;
  description: string;
  lastAccessed?: Date;
  isActive?: boolean;
  type: 'dao' | 'project' | 'bounty' | 'proposal' | 'treasury';
}

// Mock user spaces
const mockSpaces: Space[] = [
  {
    id: 'bad-dao',
    name: 'BAD DAO',
    logo: '/mock/bad-dao-logo.png',
    description: 'Building decentralized tooling for the next generation of DAOs',
    type: 'dao',
    lastAccessed: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    isActive: true,
  },
  {
    id: 'defi-development',
    name: 'DeFi Development',
    logo: '/mock/defi-dev-logo.png',
    description: 'Community for DeFi developers and enthusiasts',
    type: 'dao',
    lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: 'governance-ai',
    name: 'Governance AI',
    logo: '/mock/gov-ai-logo.png',
    description: 'Project for developing AI governance tools',
    type: 'project',
    lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
  }
];

const MySpaces = () => {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'all' | 'daos' | 'projects' | 'bounties' | 'proposals' | 'treasury'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchUserSpaces = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would fetch the user's spaces
        // For now, we'll use mock data
        setSpaces(mockSpaces);
      } catch (error) {
        console.error('Error fetching spaces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSpaces();
  }, []);

  // Filter spaces based on the selected tab
  const filteredSpaces = spaces.filter(space => {
    if (selectedTab === 'all') return true;
    return space.type === selectedTab;
  });

  const handleCreateSpace = () => {
    navigate('/create-space');
  };

  const handleSelectSpace = (spaceId: string) => {
    navigate(`/spaces/${spaceId}`);
  };

  const renderTimeAgo = (date?: Date) => {
    if (!date) return 'Never accessed';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      const days = Math.floor(diffMins / 1440);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
  };
  
  return (
    <div className="pb-xl">
      <div className="mb-xl">
        <div className="flex justify-between items-center mb-md">
          <h2 className="text-h2">My Spaces</h2>
          <div className="flex items-center gap-md">
            <div className="bg-neutral-dark border border-neutral-light/20 rounded-lg flex">
              <button 
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-neutral-light'}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-neutral-light'}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
            <button 
              className="btn-primary flex items-center"
              onClick={handleCreateSpace}
            >
              <FolderPlus size={18} className="mr-xs" />
              New Space
            </button>
          </div>
        </div>
        
        {/* Spaces explanation */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-lg mb-xl">
          <div className="flex gap-md">
            <div className="bg-primary/10 rounded-full p-2 flex-shrink-0 h-10 w-10 flex items-center justify-center">
              <InfoIcon className="text-primary h-6 w-6" />
            </div>
            <div>
              <h3 className="text-h3 text-white mb-sm">About Spaces</h3>
              <p className="text-neutral-light mb-md">
                Spaces are your personal containers for organizing all your decentralized activities. 
                Think of them as digital notebooks where you can create and manage DAOs, 
                communities, projects, and other collaborative work.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                <div className="bg-neutral-dark/50 rounded-lg p-md flex gap-sm">
                  <div className="bg-primary/20 rounded-full p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-h4 text-white mb-1">DAOs & Communities</h4>
                    <p className="text-sm text-neutral-light">
                      Create or join decentralized organizations within your spaces
                    </p>
                  </div>
                </div>
                
                <div className="bg-neutral-dark/50 rounded-lg p-md flex gap-sm">
                  <div className="bg-primary/20 rounded-full p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
                    <Database className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-h4 text-white mb-1">Projects</h4>
                    <p className="text-sm text-neutral-light">
                      Organize work and coordinate contributors
                    </p>
                  </div>
                </div>
                
                <div className="bg-neutral-dark/50 rounded-lg p-md flex gap-sm">
                  <div className="bg-primary/20 rounded-full p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-h4 text-white mb-1">Bounties</h4>
                    <p className="text-sm text-neutral-light">
                      Create tasks and incentives for contributors
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs for filtering spaces */}
        <div className="flex border-b border-neutral-light/20 mb-lg overflow-x-auto">
          <button
            className={`px-md py-sm text-body ${selectedTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-neutral-light hover:text-white'}`}
            onClick={() => setSelectedTab('all')}
          >
            All Spaces
          </button>
          <button
            className={`px-md py-sm text-body ${selectedTab === 'daos' ? 'text-primary border-b-2 border-primary' : 'text-neutral-light hover:text-white'}`}
            onClick={() => setSelectedTab('daos')}
          >
            DAOs
          </button>
          <button
            className={`px-md py-sm text-body ${selectedTab === 'projects' ? 'text-primary border-b-2 border-primary' : 'text-neutral-light hover:text-white'}`}
            onClick={() => setSelectedTab('projects')}
          >
            Projects
          </button>
          <button
            className={`px-md py-sm text-body ${selectedTab === 'bounties' ? 'text-primary border-b-2 border-primary' : 'text-neutral-light hover:text-white'}`}
            onClick={() => setSelectedTab('bounties')}
          >
            Bounties
          </button>
        </div>
        
        {/* Spaces notebook interface */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {/* Create new space card */}
            <div 
              className="bg-neutral-dark border border-neutral-light/10 rounded-lg p-lg flex flex-col items-center justify-center hover:border-primary/30 cursor-pointer transition-colors h-64"
              onClick={handleCreateSpace}
            >
              <div className="bg-primary/10 rounded-full p-4 mb-md">
                <PlusCircle className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-h3 text-white mb-sm">Create New Space</h3>
              <p className="text-neutral-light text-center">
                Start a new collaborative space
              </p>
            </div>
            
            {/* User spaces */}
            {isLoading ? (
              // Loading skeletons
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-neutral-dark border border-neutral-light/10 rounded-lg p-lg h-64">
                    <div className="flex items-center gap-md mb-md">
                      <div className="bg-neutral-light/20 rounded-full h-16 w-16"></div>
                      <div className="flex-1">
                        <div className="bg-neutral-light/20 h-6 w-2/3 rounded mb-sm"></div>
                        <div className="bg-neutral-light/20 h-4 w-1/2 rounded"></div>
                      </div>
                    </div>
                    <div className="bg-neutral-light/20 h-20 w-full rounded"></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {filteredSpaces.map((space) => (
                  <div 
                    key={space.id}
                    className={`bg-neutral-dark border ${space.isActive ? 'border-primary/50' : 'border-neutral-light/10'} rounded-lg p-lg hover:border-primary/30 transition-colors h-64 flex flex-col`}
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
                          {space.isActive && (
                            <span className="badge badge-success text-caption flex items-center gap-1">
                              <Check size={12} /> Active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-neutral-light">
                          <Clock size={14} className="mr-1" />
                          <span>{renderTimeAgo(space.lastAccessed)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <p className="text-neutral-light mb-md line-clamp-3">
                        {space.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="bg-neutral-dark/60 text-neutral-light text-xs py-1 px-2 rounded-full">
                          {space.type.charAt(0).toUpperCase() + space.type.slice(1)}
                        </span>
                        <div className="flex gap-sm">
                          <Link 
                            to={`/spaces/${space.id}`} 
                            className="p-1 hover:text-primary text-neutral-light transition-colors"
                            title="View Details"
                          >
                            <InfoIcon size={18} />
                          </Link>
                          <Link 
                            to={`/spaces/${space.id}/dashboard`} 
                            className="p-1 hover:text-primary text-neutral-light transition-colors"
                            title="Open Dashboard"
                          >
                            <LayoutGrid size={18} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        ) : (
          // List view
          <div className="space-y-md">
            {/* Create new space button */}
            <div 
              className="bg-neutral-dark border border-neutral-light/10 rounded-lg p-md flex items-center hover:border-primary/30 cursor-pointer transition-colors"
              onClick={handleCreateSpace}
            >
              <div className="bg-primary/10 rounded-full p-2 mr-md">
                <PlusCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-h3 text-white">Create New Space</h3>
                <p className="text-neutral-light">
                  Start a new collaborative space
                </p>
              </div>
            </div>
            
            {/* User spaces */}
            {isLoading ? (
              // Loading skeletons
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-neutral-dark border border-neutral-light/10 rounded-lg p-md">
                    <div className="flex items-center gap-md">
                      <div className="bg-neutral-light/20 rounded-full h-12 w-12"></div>
                      <div className="flex-1">
                        <div className="bg-neutral-light/20 h-6 w-1/3 rounded mb-sm"></div>
                        <div className="bg-neutral-light/20 h-4 w-1/2 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {filteredSpaces.map((space) => (
                  <div 
                    key={space.id}
                    className={`bg-neutral-dark border ${space.isActive ? 'border-primary/50' : 'border-neutral-light/10'} rounded-lg p-md hover:border-primary/30 transition-colors`}
                  >
                    <div className="flex items-center gap-md">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-neutral-dark/30 flex items-center justify-center">
                        {space.logo ? (
                          <img src={space.logo} alt={`${space.name} logo`} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-h3 font-bold text-primary">{space.name.charAt(0)}</span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-sm">
                          <h3 className="text-h3 truncate">{space.name}</h3>
                          {space.isActive && (
                            <span className="badge badge-success text-caption flex items-center gap-1">
                              <Check size={12} /> Active
                            </span>
                          )}
                        </div>
                        
                        <p className="text-neutral-light truncate">
                          {space.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center text-sm text-neutral-light">
                        <Clock size={14} className="mr-1" />
                        <span>{renderTimeAgo(space.lastAccessed)}</span>
                      </div>
                      
                      <div className="flex gap-sm ml-md">
                        <Link 
                          to={`/spaces/${space.id}`} 
                          className="btn-icon-secondary"
                          title="View Details"
                        >
                          <InfoIcon size={18} />
                        </Link>
                        <Link 
                          to={`/spaces/${space.id}/dashboard`} 
                          className="btn-icon-secondary"
                          title="Open Dashboard"
                        >
                          <LayoutGrid size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySpaces; 