import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  LayoutGrid, 
  List, 
  Settings, 
  PlusCircle,
  Users,
  FileText,
  Wallet,
  Award,
  Database,
  Shield
} from 'lucide-react';
import dbService, { Space } from '../services/database';

// Extended space interface with additional fields
interface ExtendedSpace extends Space {
  visibility?: string;
  members?: number;
}

const SpaceDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [space, setSpace] = useState<ExtendedSpace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSpace = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const spaceData = await dbService.getSpaceById(id);
        
        if (spaceData) {
          // Add additional fields for the extended space interface
          const extendedSpace: ExtendedSpace = {
            ...spaceData,
            visibility: spaceData.isPublic ? 'Public' : 'Private',
            members: spaceData.membersCount || 0
          };
          setSpace(extendedSpace);
        } else {
          // Create mock space data
          const mockSpace: ExtendedSpace = {
            id: id,
            name: 'Unknown Space',
            creator: 'Anonymous',
            description: 'A collaborative space for community collaboration',
            categories: ['Example'],
            isPublic: true,
            visibility: 'Public',
            members: 0
          };
          
          setSpace(mockSpace);
        }
      } catch (err) {
        console.error('Error fetching space details:', err);
        setError('Failed to load space details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpace();
  }, [id]);

  // Navigation handlers for adding items
  const handleAddDAO = () => {
    // Navigate to create DAO page with space context
    navigate(`/spaces/${id}/create-dao`);
  };
  
  const handleAddProject = () => {
    // Navigate to create project page with space context
    navigate(`/spaces/${id}/create-project`);
  };
  
  const handleAddBounty = () => {
    // Navigate to create bounty page with space context
    navigate(`/spaces/${id}/create-bounty`);
  };
  
  const handleAddProposal = () => {
    // Navigate to create proposal page with space context
    navigate(`/spaces/${id}/create-proposal`);
  };
  
  const handleAddTreasury = () => {
    // Navigate to create/setup treasury page with space context
    navigate(`/spaces/${id}/setup-treasury`);
  };
  
  const handleAddGovernance = () => {
    // Navigate to create/setup governance page with space context
    navigate(`/spaces/${id}/setup-governance`);
  };
  
  const handleAddMember = () => {
    // Navigate to add member page with space context
    navigate(`/spaces/${id}/add-member`);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-lg">
        <div className="h-48 bg-neutral-light/50 rounded-lg"></div>
        <div className="h-24 bg-neutral-light/50 rounded-lg"></div>
        <div className="h-96 bg-neutral-light/50 rounded-lg"></div>
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="card py-xl text-center">
        <h2 className="text-h2 mb-md text-accent-red">Error</h2>
        <p className="text-body mb-lg">{error || 'Space not found'}</p>
        <Link to="/spaces/my" className="btn-primary">
          Back to My Spaces
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-xl">
      {/* Back Button and Title */}
      <div className="flex items-center mb-lg">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-white mr-md"
        >
          <ArrowLeft size={20} className="mr-xs" />
          <span>Back</span>
        </button>
        <h1 className="text-h2">{space.name}</h1>
      </div>
      
      {/* Space Header Card */}
      <div className="bg-neutral-dark rounded-lg mb-xl">
        <div className="flex items-start p-lg">
          {/* Space Icon */}
          <div className="w-16 h-16 bg-neutral-dark flex items-center justify-center rounded-lg mr-md">
            {space.logo ? (
              <img src={space.logo} alt={`${space.name} logo`} className="w-full h-full object-cover" />
            ) : (
              <span className="text-h3 font-bold text-primary">{space.name.charAt(0)}</span>
            )}
          </div>
          
          {/* Space Details */}
          <div className="flex-1">
            <h2 className="text-h2 mb-2">{space.name}</h2>
            <p className="text-neutral-light mb-2">{space.description}</p>
            <div className="flex items-center gap-md">
              <div className="text-sm">Creator: {space.creator}</div>
              <div className="text-sm">Visibility: {space.visibility || 'Public'}</div>
              <div className="text-sm">Members: {space.members || 0}</div>
            </div>
          </div>
          
          {/* View Toggle and Customize */}
          <div className="flex gap-xs">
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
            <button className="flex items-center gap-xs bg-neutral-dark border border-neutral-light/20 rounded-lg p-2 text-white hover:border-primary">
              <Settings size={18} />
              <span>Customize</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {/* DAOs Module */}
        <div className="bg-neutral-dark rounded-lg overflow-hidden">
          <div className="p-md flex justify-between items-center">
            <div className="flex items-center">
              <Users size={20} className="mr-xs" />
              <h3 className="text-h3">DAOs</h3>
            </div>
            <button 
              className="text-primary hover:text-primary-light"
              onClick={handleAddDAO}
            >
              <PlusCircle size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-xl px-md">
            <Users size={36} className="text-neutral-light mb-md opacity-50" />
            <p className="text-neutral-light mb-md">No daos yet</p>
            <button 
              className="text-primary flex items-center hover:underline"
              onClick={handleAddDAO}
            >
              <PlusCircle size={16} className="mr-xs" />
              <span>Add DAO</span>
            </button>
          </div>
        </div>
        
        {/* Projects Module */}
        <div className="bg-neutral-dark rounded-lg overflow-hidden">
          <div className="p-md flex justify-between items-center">
            <div className="flex items-center">
              <Database size={20} className="mr-xs" />
              <h3 className="text-h3">Projects</h3>
            </div>
            <button 
              className="text-primary hover:text-primary-light"
              onClick={handleAddProject}
            >
              <PlusCircle size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-xl px-md">
            <Database size={36} className="text-neutral-light mb-md opacity-50" />
            <p className="text-neutral-light mb-md">No projects yet</p>
            <button 
              className="text-primary flex items-center hover:underline"
              onClick={handleAddProject}
            >
              <PlusCircle size={16} className="mr-xs" />
              <span>Add Project</span>
            </button>
          </div>
        </div>
        
        {/* Bounties Module */}
        <div className="bg-neutral-dark rounded-lg overflow-hidden">
          <div className="p-md flex justify-between items-center">
            <div className="flex items-center">
              <Award size={20} className="mr-xs" />
              <h3 className="text-h3">Bounties</h3>
            </div>
            <button 
              className="text-primary hover:text-primary-light"
              onClick={handleAddBounty}
            >
              <PlusCircle size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-xl px-md">
            <Award size={36} className="text-neutral-light mb-md opacity-50" />
            <p className="text-neutral-light mb-md">No bounties yet</p>
            <button 
              className="text-primary flex items-center hover:underline"
              onClick={handleAddBounty}
            >
              <PlusCircle size={16} className="mr-xs" />
              <span>Add Bounty</span>
            </button>
          </div>
        </div>
        
        {/* Proposals Module */}
        <div className="bg-neutral-dark rounded-lg overflow-hidden">
          <div className="p-md flex justify-between items-center">
            <div className="flex items-center">
              <FileText size={20} className="mr-xs" />
              <h3 className="text-h3">Proposals</h3>
            </div>
            <button 
              className="text-primary hover:text-primary-light"
              onClick={handleAddProposal}
            >
              <PlusCircle size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-xl px-md">
            <FileText size={36} className="text-neutral-light mb-md opacity-50" />
            <p className="text-neutral-light mb-md">No proposals yet</p>
            <button 
              className="text-primary flex items-center hover:underline"
              onClick={handleAddProposal}
            >
              <PlusCircle size={16} className="mr-xs" />
              <span>Add Proposal</span>
            </button>
          </div>
        </div>
        
        {/* Treasury Module */}
        <div className="bg-neutral-dark rounded-lg overflow-hidden">
          <div className="p-md flex justify-between items-center">
            <div className="flex items-center">
              <Wallet size={20} className="mr-xs" />
              <h3 className="text-h3">Treasury</h3>
            </div>
            <button 
              className="text-primary hover:text-primary-light"
              onClick={handleAddTreasury}
            >
              <PlusCircle size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-xl px-md">
            <Wallet size={36} className="text-neutral-light mb-md opacity-50" />
            <p className="text-neutral-light mb-md">No treasury yet</p>
            <button 
              className="text-primary flex items-center hover:underline"
              onClick={handleAddTreasury}
            >
              <PlusCircle size={16} className="mr-xs" />
              <span>Add Treasury</span>
            </button>
          </div>
        </div>
        
        {/* Governance Module */}
        <div className="bg-neutral-dark rounded-lg overflow-hidden">
          <div className="p-md flex justify-between items-center">
            <div className="flex items-center">
              <Shield size={20} className="mr-xs" />
              <h3 className="text-h3">Governance</h3>
            </div>
            <button 
              className="text-primary hover:text-primary-light"
              onClick={handleAddGovernance}
            >
              <PlusCircle size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-xl px-md">
            <Shield size={36} className="text-neutral-light mb-md opacity-50" />
            <p className="text-neutral-light mb-md">No governance yet</p>
            <button 
              className="text-primary flex items-center hover:underline"
              onClick={handleAddGovernance}
            >
              <PlusCircle size={16} className="mr-xs" />
              <span>Add Governance</span>
            </button>
          </div>
        </div>
        
        {/* Members Module */}
        <div className="bg-neutral-dark rounded-lg overflow-hidden">
          <div className="p-md flex justify-between items-center">
            <div className="flex items-center">
              <Users size={20} className="mr-xs" />
              <h3 className="text-h3">Members</h3>
            </div>
            <button 
              className="text-primary hover:text-primary-light"
              onClick={handleAddMember}
            >
              <PlusCircle size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-xl px-md">
            <Users size={36} className="text-neutral-light mb-md opacity-50" />
            <p className="text-neutral-light mb-md">No members yet</p>
            <button 
              className="text-primary flex items-center hover:underline"
              onClick={handleAddMember}
            >
              <PlusCircle size={16} className="mr-xs" />
              <span>Add Member</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDashboard; 