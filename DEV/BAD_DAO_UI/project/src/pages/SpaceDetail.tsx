import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Shield, Settings, FileText, Wallet, Star, Lock, Eye, EyeOff, Crown, LayoutGrid } from 'lucide-react';
import dbService, { Space } from '../services/database';
import { truncateAddress } from '../utils/address';

// Mock additional data for space details
interface SpaceMember {
  id: string;
  address: string;
  displayName?: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
}

interface SpaceActivity {
  id: string;
  type: 'proposal_created' | 'proposal_vote' | 'member_joined';
  timestamp: Date;
  actor: {
    address: string;
    displayName?: string;
  };
  data: {
    title?: string;
    proposalId?: string;
    vote?: 'for' | 'against' | 'abstain';
  };
}

interface SpaceTreasury {
  assets: {
    token: string;
    symbol: string;
    amount: number;
    value: number;
  }[];
  totalValue: number;
}

const SpaceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [space, setSpace] = useState<Space | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'activity' | 'treasury'>('overview');
  const [privacySettings, setPrivacySettings] = useState({
    treasuryVisible: true,
    membersVisible: true,
    activitiesVisible: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data for the space
  const [members] = useState<SpaceMember[]>([
    {
      id: '1',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      displayName: 'Alex',
      role: 'admin',
      joinedAt: new Date(2023, 5, 15)
    },
    {
      id: '2',
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      displayName: 'Taylor',
      role: 'moderator',
      joinedAt: new Date(2023, 6, 20)
    },
    {
      id: '3',
      address: '0x7890abcdef1234567890abcdef1234567890abcd',
      role: 'member',
      joinedAt: new Date(2023, 7, 10)
    },
    {
      id: '4',
      address: '0x567890abcdef1234567890abcdef1234567890ab',
      displayName: 'Jordan',
      role: 'member',
      joinedAt: new Date(2023, 8, 5)
    },
    {
      id: '5',
      address: '0x90abcdef1234567890abcdef1234567890abcdef',
      role: 'member',
      joinedAt: new Date(2023, 9, 12)
    }
  ]);

  const [activities] = useState<SpaceActivity[]>([
    {
      id: 'act1',
      type: 'proposal_created',
      timestamp: new Date(2023, 10, 15, 14, 30),
      actor: {
        address: '0x1234567890abcdef1234567890abcdef12345678',
        displayName: 'Alex'
      },
      data: {
        title: 'Treasury fund allocation for Q1',
        proposalId: 'prop1'
      }
    },
    {
      id: 'act2',
      type: 'proposal_vote',
      timestamp: new Date(2023, 10, 16, 9, 45),
      actor: {
        address: '0xabcdef1234567890abcdef1234567890abcdef12',
        displayName: 'Taylor'
      },
      data: {
        proposalId: 'prop1',
        vote: 'for'
      }
    },
    {
      id: 'act3',
      type: 'member_joined',
      timestamp: new Date(2023, 10, 17, 11, 20),
      actor: {
        address: '0x567890abcdef1234567890abcdef1234567890ab',
        displayName: 'Jordan'
      },
      data: {}
    },
    {
      id: 'act4',
      type: 'proposal_vote',
      timestamp: new Date(2023, 10, 18, 16, 10),
      actor: {
        address: '0x90abcdef1234567890abcdef1234567890abcdef'
      },
      data: {
        proposalId: 'prop1',
        vote: 'against'
      }
    },
    {
      id: 'act5',
      type: 'proposal_created',
      timestamp: new Date(2023, 10, 20, 13, 25),
      actor: {
        address: '0x1234567890abcdef1234567890abcdef12345678',
        displayName: 'Alex'
      },
      data: {
        title: 'Community development initiatives',
        proposalId: 'prop2'
      }
    }
  ]);

  const [treasury] = useState<SpaceTreasury>({
    assets: [
      {
        token: 'Ethereum',
        symbol: 'ETH',
        amount: 24.5,
        value: 73500
      },
      {
        token: 'USD Coin',
        symbol: 'USDC',
        amount: 50000,
        value: 50000
      },
      {
        token: 'Space Token',
        symbol: 'SPACE',
        amount: 1000000,
        value: 30000
      }
    ],
    totalValue: 153500
  });

  // Toggle privacy settings
  const togglePrivacySetting = (setting: keyof typeof privacySettings) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting]
    });
  };

  // Toggle follow status
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format activity description
  const getActivityDescription = (activity: SpaceActivity) => {
    switch (activity.type) {
      case 'proposal_created':
        return (
          <>
            <span className="font-medium">
              {activity.actor.displayName || truncateAddress(activity.actor.address)}
            </span>
            {' created proposal '}
            <Link to={`/proposals/${activity.data.proposalId}`} className="text-primary hover:underline">
              {activity.data.title}
            </Link>
          </>
        );
      case 'proposal_vote':
        return (
          <>
            <span className="font-medium">
              {activity.actor.displayName || truncateAddress(activity.actor.address)}
            </span>
            {' voted '}
            <span className={`font-medium ${
              activity.data.vote === 'for' ? 'text-accent-green' : 
              activity.data.vote === 'against' ? 'text-accent-red' : 'text-primary'
            }`}>
              {activity.data.vote}
            </span>
            {' on '}
            <Link to={`/proposals/${activity.data.proposalId}`} className="text-primary hover:underline">
              proposal #{activity.data.proposalId}
            </Link>
          </>
        );
      case 'member_joined':
        return (
          <>
            <span className="font-medium">
              {activity.actor.displayName || truncateAddress(activity.actor.address)}
            </span>
            {' joined the space'}
          </>
        );
      default:
        return 'Unknown activity';
    }
  };

  useEffect(() => {
    const fetchSpace = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const spaceData = await dbService.getSpaceById(id);
        
        if (spaceData) {
          setSpace(spaceData);
        } else {
          // Try to find in mock data
          const mockSpace = {
            id: id,
            name: 'Example Space',
            creator: '0x1234567890abcdef1234567890abcdef12345678',
            description: 'This is an example space from mock data.',
            categories: ['Example', 'DAO'],
            isPublic: true,
            logo: `/mock/${id}-logo.png`,
            proposalCount: 42,
            voteCount: 156
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
        <Link to="/spaces" className="btn-primary">
          Back to Spaces
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-lg pb-xl">
      {/* Header & Navigation */}
      <div className="flex items-center">
        <Link to="/spaces" className="btn-icon-secondary mr-md">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-h1">Space Details</h1>
      </div>
      
      {/* Space Header Card */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-lg">
          {/* Space Logo */}
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-dark/30 flex items-center justify-center">
            {space.logo ? (
              <img src={space.logo} alt={`${space.name} logo`} className="w-full h-full object-cover" />
            ) : (
              <span className="text-h1 font-bold text-primary">{space.name.charAt(0)}</span>
            )}
          </div>
          
          {/* Space Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-sm mb-sm">
              <h2 className="text-h2">{space.name}</h2>
              
              {/* Tags */}
              <div className="flex gap-sm">
                {space.categories?.map(tag => (
                  <span key={tag} className="badge badge-secondary">{tag}</span>
                ))}
              </div>
            </div>
            
            <p className="text-body text-neutral-medium mb-md">{space.description}</p>
            
            <div className="flex flex-wrap gap-md">
              <div className="flex items-center">
                <Users size={18} className="text-neutral-light mr-sm" />
                <span className="text-body">{members.length} members</span>
              </div>
              
              <div className="flex items-center">
                <FileText size={18} className="text-neutral-light mr-sm" />
                <span className="text-body">{space.proposalCount || 0} proposals</span>
              </div>
              
              <div className="flex items-center">
                <Wallet size={18} className="text-neutral-light mr-sm" />
                <span className="text-body">${treasury.totalValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-md">
            <button 
              className={`btn-secondary flex items-center ${isFollowing ? 'text-primary' : ''}`}
              onClick={toggleFollow}
            >
              <Star size={18} className="mr-sm" fill={isFollowing ? 'currentColor' : 'none'} />
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            
            <Link to={`/spaces/${id}/dashboard`} className="btn-secondary flex items-center">
              <LayoutGrid size={18} className="mr-sm" />
              Dashboard
            </Link>
            
            <button className="btn-primary">
              <Shield size={18} className="mr-sm" />
              Join Space
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="flex border-b border-neutral-light overflow-x-auto">
        <button
          type="button"
          className={`py-md px-lg text-body font-medium border-b-2 transition-colors ${
            activeTab === 'overview' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-neutral-medium hover:text-neutral-dark'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        
        <button
          type="button"
          className={`py-md px-lg text-body font-medium border-b-2 transition-colors ${
            activeTab === 'members' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-neutral-medium hover:text-neutral-dark'
          }`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        
        <button
          type="button"
          className={`py-md px-lg text-body font-medium border-b-2 transition-colors ${
            activeTab === 'activity' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-neutral-medium hover:text-neutral-dark'
          }`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
        
        <button
          type="button"
          className={`py-md px-lg text-body font-medium border-b-2 transition-colors ${
            activeTab === 'treasury' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-neutral-medium hover:text-neutral-dark'
          }`}
          onClick={() => setActiveTab('treasury')}
        >
          Treasury
        </button>
      </div>
      
      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-lg">
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              <div className="card">
                <div className="flex items-center mb-md">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-md">
                    <Users size={20} className="text-primary" />
                  </div>
                  <h3 className="text-h3">Members</h3>
                </div>
                <p className="text-h2 font-bold">{members.length}</p>
                <button 
                  className="mt-sm text-primary text-body-sm font-medium flex items-center hover:underline"
                  onClick={() => setActiveTab('members')}
                >
                  View all members
                </button>
              </div>
              
              <div className="card">
                <div className="flex items-center mb-md">
                  <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center mr-md">
                    <Wallet size={20} className="text-accent-gold" />
                  </div>
                  <h3 className="text-h3">Treasury</h3>
                </div>
                <p className="text-h2 font-bold">${treasury.totalValue.toLocaleString()}</p>
                <button 
                  className="mt-sm text-primary text-body-sm font-medium flex items-center hover:underline"
                  onClick={() => setActiveTab('treasury')}
                >
                  View treasury details
                </button>
              </div>
              
              <div className="card">
                <div className="flex items-center mb-md">
                  <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center mr-md">
                    <FileText size={20} className="text-accent-green" />
                  </div>
                  <h3 className="text-h3">Proposals</h3>
                </div>
                <p className="text-h2 font-bold">{space.proposalCount || 0}</p>
                <Link 
                  to="/proposals" 
                  className="mt-sm text-primary text-body-sm font-medium flex items-center hover:underline"
                >
                  View all proposals
                </Link>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="card">
              <div className="flex justify-between items-center mb-lg">
                <h3 className="text-h3">Recent Activity</h3>
                <button 
                  className="btn-icon-secondary"
                  onClick={() => togglePrivacySetting('activitiesVisible')}
                  title={privacySettings.activitiesVisible ? 'Hide activity' : 'Show activity'}
                >
                  {privacySettings.activitiesVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              
              {privacySettings.activitiesVisible ? (
                <div className="space-y-md">
                  {activities.slice(0, 3).map(activity => (
                    <div key={activity.id} className="flex items-start p-md border-b border-neutral-light/20 last:border-0">
                      <div className="w-10 h-10 rounded-full bg-neutral-light/10 flex items-center justify-center mr-md flex-shrink-0">
                        {activity.type === 'proposal_created' && <FileText size={18} />}
                        {activity.type === 'proposal_vote' && <FileText size={18} />}
                        {activity.type === 'member_joined' && <Users size={18} />}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-body">
                          {getActivityDescription(activity)}
                        </p>
                        <p className="text-body-sm text-neutral-medium mt-sm">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    className="btn-tertiary w-full"
                    onClick={() => setActiveTab('activity')}
                  >
                    View All Activity
                  </button>
                </div>
              ) : (
                <div className="text-center py-xl">
                  <EyeOff size={36} className="mx-auto mb-md text-neutral-light" />
                  <h4 className="text-h4 mb-sm">Activity Hidden</h4>
                  <p className="text-body text-neutral-medium mb-md">
                    You've chosen to hide activity for this space.
                  </p>
                  <button 
                    className="btn-primary"
                    onClick={() => togglePrivacySetting('activitiesVisible')}
                  >
                    Show Activity
                  </button>
                </div>
              )}
            </div>
            
            {/* Privacy Settings */}
            <div className="card bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-md mb-md">
                <Crown size={24} className="text-accent-gold" />
                <h3 className="text-h3 text-primary">Premium Privacy Controls</h3>
              </div>
              
              <p className="text-body mb-lg">
                Control who can see your space information with our premium privacy settings.
                Choose exactly what information is public and what remains private.
              </p>
              
              <div className="space-y-md">
                <div className="flex items-center justify-between p-md rounded-lg bg-neutral-dark/50">
                  <div>
                    <p className="text-body font-medium">Treasury Visibility</p>
                    <p className="text-body-sm text-neutral-medium">
                      Control who can see your treasury information
                    </p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={privacySettings.treasuryVisible}
                      onChange={() => togglePrivacySetting('treasuryVisible')}
                    />
                    <div className="w-11 h-6 bg-neutral-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-md rounded-lg bg-neutral-dark/50">
                  <div>
                    <p className="text-body font-medium">Member Visibility</p>
                    <p className="text-body-sm text-neutral-medium">
                      Control who can see your membership information
                    </p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={privacySettings.membersVisible}
                      onChange={() => togglePrivacySetting('membersVisible')}
                    />
                    <div className="w-11 h-6 bg-neutral-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-md rounded-lg bg-neutral-dark/50">
                  <div>
                    <p className="text-body font-medium">Activity Visibility</p>
                    <p className="text-body-sm text-neutral-medium">
                      Control who can see your activity information
                    </p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={privacySettings.activitiesVisible}
                      onChange={() => togglePrivacySetting('activitiesVisible')}
                    />
                    <div className="w-11 h-6 bg-neutral-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'members' && (
          <div className="card">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="text-h3">Members ({members.length})</h3>
              <button 
                className="btn-icon-secondary"
                onClick={() => togglePrivacySetting('membersVisible')}
                title={privacySettings.membersVisible ? 'Hide members' : 'Show members'}
              >
                {privacySettings.membersVisible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            
            {privacySettings.membersVisible ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neutral-light">
                      <th className="px-md py-sm text-label text-neutral-medium font-semibold">Member</th>
                      <th className="px-md py-sm text-label text-neutral-medium font-semibold">Role</th>
                      <th className="px-md py-sm text-label text-neutral-medium font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(member => (
                      <tr key={member.id} className="border-b border-neutral-light">
                        <td className="px-md py-md">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-neutral-light/20 flex items-center justify-center mr-md text-body font-bold">
                              {member.displayName?.charAt(0) || member.address.charAt(2)}
                            </div>
                            <div>
                              {member.displayName && <p className="text-body font-medium">{member.displayName}</p>}
                              <p className={`text-body-sm ${member.displayName ? 'text-neutral-medium' : ''}`}>
                                {truncateAddress(member.address)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-md py-md">
                          <span className={`badge ${
                            member.role === 'admin' ? 'badge-warning' : 
                            member.role === 'moderator' ? 'badge-info' : 'badge-secondary'
                          }`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="px-md py-md">
                          <p className="text-body-sm">{formatDate(member.joinedAt)}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-xl">
                <EyeOff size={36} className="mx-auto mb-md text-neutral-light" />
                <h4 className="text-h4 mb-sm">Members Hidden</h4>
                <p className="text-body text-neutral-medium mb-md">
                  You've chosen to hide members for this space.
                </p>
                <button 
                  className="btn-primary"
                  onClick={() => togglePrivacySetting('membersVisible')}
                >
                  Show Members
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'activity' && (
          <div className="card">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="text-h3">Space Activity</h3>
              <button 
                className="btn-icon-secondary"
                onClick={() => togglePrivacySetting('activitiesVisible')}
                title={privacySettings.activitiesVisible ? 'Hide activity' : 'Show activity'}
              >
                {privacySettings.activitiesVisible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            
            {privacySettings.activitiesVisible ? (
              <div className="space-y-md">
                {activities.map(activity => (
                  <div key={activity.id} className="flex items-start p-md border-b border-neutral-light/20 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-neutral-light/10 flex items-center justify-center mr-md flex-shrink-0">
                      {activity.type === 'proposal_created' && <FileText size={18} />}
                      {activity.type === 'proposal_vote' && <FileText size={18} />}
                      {activity.type === 'member_joined' && <Users size={18} />}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-body">
                        {getActivityDescription(activity)}
                      </p>
                      <p className="text-body-sm text-neutral-medium mt-sm">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-xl">
                <EyeOff size={36} className="mx-auto mb-md text-neutral-light" />
                <h4 className="text-h4 mb-sm">Activity Hidden</h4>
                <p className="text-body text-neutral-medium mb-md">
                  You've chosen to hide activity for this space.
                </p>
                <button 
                  className="btn-primary"
                  onClick={() => togglePrivacySetting('activitiesVisible')}
                >
                  Show Activity
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'treasury' && (
          <div className="card">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="text-h3">Treasury</h3>
              <button 
                className="btn-icon-secondary"
                onClick={() => togglePrivacySetting('treasuryVisible')}
                title={privacySettings.treasuryVisible ? 'Hide treasury' : 'Show treasury'}
              >
                {privacySettings.treasuryVisible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            
            {privacySettings.treasuryVisible ? (
              <div>
                <div className="mb-lg p-lg rounded-lg bg-neutral-dark/50">
                  <p className="text-body-sm text-neutral-medium">Total Value</p>
                  <p className="text-h2 font-bold">${treasury.totalValue.toLocaleString()}</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-neutral-light">
                        <th className="px-md py-sm text-label text-neutral-medium font-semibold">Asset</th>
                        <th className="px-md py-sm text-label text-neutral-medium font-semibold">Amount</th>
                        <th className="px-md py-sm text-label text-neutral-medium font-semibold">Value (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {treasury.assets.map((asset, index) => (
                        <tr key={index} className="border-b border-neutral-light">
                          <td className="px-md py-md">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-md text-body-sm font-bold">
                                {asset.symbol.charAt(0)}
                              </div>
                              <div>
                                <p className="text-body font-medium">{asset.token}</p>
                                <p className="text-body-sm text-neutral-medium">{asset.symbol}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-md py-md">
                            <p className="text-body">{asset.amount.toLocaleString()} {asset.symbol}</p>
                          </td>
                          <td className="px-md py-md">
                            <p className="text-body">${asset.value.toLocaleString()}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-xl">
                  <h4 className="text-h4 mb-md">Treasury Activity</h4>
                  
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-md flex items-center">
                    <Lock size={20} className="text-primary mr-md" />
                    <div>
                      <p className="text-body font-medium text-primary">Premium Feature</p>
                      <p className="text-body-sm">Upgrade to view detailed treasury activity and analytics</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-xl">
                <EyeOff size={36} className="mx-auto mb-md text-neutral-light" />
                <h4 className="text-h4 mb-sm">Treasury Hidden</h4>
                <p className="text-body text-neutral-medium mb-md">
                  You've chosen to hide treasury for this space.
                </p>
                <button 
                  className="btn-primary"
                  onClick={() => togglePrivacySetting('treasuryVisible')}
                >
                  Show Treasury
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceDetail;