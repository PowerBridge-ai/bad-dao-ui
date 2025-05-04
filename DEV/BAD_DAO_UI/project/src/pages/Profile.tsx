import { useState, useEffect } from 'react';
import { Settings, Wallet, FileText, Users, Copy, CheckCircle, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useThirdwebWallet } from '../hooks/useThirdwebWallet';
import { truncateAddress } from '../utils/address';
import { getMockProposals } from '../utils/mockData';
import { ProposalType } from '../types/proposal';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const { address } = useThirdwebWallet();
  const [activeTab, setActiveTab] = useState('voting');
  const [userProposals, setUserProposals] = useState<ProposalType[]>([]);
  const [userVotes, setUserVotes] = useState<{
    proposalId: string;
    proposalTitle: string;
    vote: 'for' | 'against' | 'abstain';
    votingPower: number;
    date: Date;
  }[]>([]);
  const [delegations, setDelegations] = useState<{
    address: string;
    power: number;
    since: Date;
  }[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Mock data loading
        const allProposals = getMockProposals();
        // Filter to show only user's proposals
        setUserProposals(allProposals.filter((p, i) => i % 5 === 0));
        
        // Mock user votes
        setUserVotes([
          {
            proposalId: 'prop-001',
            proposalTitle: 'Upgrade Infrastructure',
            vote: 'for',
            votingPower: 5000,
            date: new Date(2025, 3, 15),
          },
          {
            proposalId: 'prop-002',
            proposalTitle: 'Treasury Allocation for Marketing',
            vote: 'against',
            votingPower: 5000,
            date: new Date(2025, 3, 10),
          },
          {
            proposalId: 'prop-004',
            proposalTitle: 'Partnership with DeFi Protocol',
            vote: 'for',
            votingPower: 5000,
            date: new Date(2025, 3, 5),
          },
        ]);
        
        // Mock delegations
        setDelegations([
          {
            address: '0x7890abcdef1234567890abcdef1234567890abcd',
            power: 1000,
            since: new Date(2025, 2, 20),
          },
        ]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getVoteIcon = (vote: 'for' | 'against' | 'abstain') => {
    switch (vote) {
      case 'for':
        return <CheckCircle size={16} className="text-accent-green" />;
      case 'against':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'abstain':
        return <HelpCircle size={16} className="text-primary-light" />;
    }
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-md">
          <div className="h-16 bg-neutral-light/50 rounded-lg"></div>
          <div className="h-16 bg-neutral-light/50 rounded-lg"></div>
          <div className="h-16 bg-neutral-light/50 rounded-lg"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'voting':
        return (
          <div>
            <h2 className="text-h2 mb-md">Voting History</h2>
            
            {userVotes.length > 0 ? (
              <div className="space-y-md">
                {userVotes.map((vote) => (
                  <div 
                    key={vote.proposalId} 
                    className="card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-sm">
                      <h3 className="text-h3">{vote.proposalTitle}</h3>
                      <span className="text-body-sm text-neutral-medium">
                        {vote.date.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-md">
                      <div className="px-md py-sm rounded-full bg-neutral-light/50 flex items-center gap-sm">
                        {getVoteIcon(vote.vote)}
                        <span className="text-body font-medium capitalize">{vote.vote}</span>
                      </div>
                      
                      <div className="text-body-sm text-neutral-medium">
                        Voting Power: {vote.votingPower.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card py-xl text-center">
                <h3 className="text-h3 mb-md">No Voting History</h3>
                <p className="text-body text-neutral-medium mb-lg">
                  You haven't voted on any proposals yet.
                </p>
                <Link to="/proposals" className="btn-primary">
                  Browse Active Proposals
                </Link>
              </div>
            )}
          </div>
        );

      case 'proposals':
        return (
          <div>
            <h2 className="text-h2 mb-md">My Proposals</h2>
            
            {userProposals.length > 0 ? (
              <div className="space-y-md">
                {userProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-sm">
                      <h3 className="text-h3">{proposal.title}</h3>
                      <span className={`
                        badge
                        ${proposal.status === 'active' ? 'badge-info' : ''}
                        ${proposal.status === 'pending' ? 'badge-warning' : ''}
                        ${proposal.status === 'passed' ? 'badge-success' : ''}
                        ${proposal.status === 'rejected' ? 'badge-error' : ''}
                      `}>
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-body text-neutral-medium mb-md">
                      {proposal.description.slice(0, 120)}...
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-body-sm text-neutral-medium">
                        Created {proposal.createdAt.toLocaleDateString()}
                      </span>
                      
                      <Link 
                        to={`/proposals/${proposal.id}`}
                        className="text-primary text-body-sm font-medium hover:underline"
                      >
                        View Proposal
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card py-xl text-center">
                <h3 className="text-h3 mb-md">No Proposals Created</h3>
                <p className="text-body text-neutral-medium mb-lg">
                  You haven't created any proposals yet.
                </p>
                <Link to="/proposals/create" className="btn-primary">
                  Create a Proposal
                </Link>
              </div>
            )}
          </div>
        );

      case 'delegation':
        return (
          <div>
            <h2 className="text-h2 mb-md">Delegation</h2>
            
            <div className="card mb-lg">
              <h3 className="text-h3 mb-md">Your Voting Power</h3>
              
              <div className="flex justify-between items-center p-md rounded-lg bg-neutral-light/30 mb-md">
                <span className="text-body font-medium">Total Voting Power</span>
                <span className="text-h3 font-bold">5,000</span>
              </div>
              
              <div className="flex justify-between items-center p-md rounded-lg bg-neutral-light/30 mb-md">
                <span className="text-body font-medium">Owned</span>
                <span className="text-body font-bold">5,000</span>
              </div>
              
              <div className="flex justify-between items-center p-md rounded-lg bg-neutral-light/30">
                <span className="text-body font-medium">Delegated to You</span>
                <span className="text-body font-bold">0</span>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-h3 mb-md">Your Delegations</h3>
              
              {delegations.length > 0 ? (
                <div className="space-y-md">
                  {delegations.map((delegation) => (
                    <div
                      key={delegation.address}
                      className="p-md rounded-lg border border-neutral-light"
                    >
                      <div className="flex justify-between items-center mb-sm">
                        <span className="text-body font-medium">Delegated to</span>
                        <a
                          href={`https://etherscan.io/address/${delegation.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {truncateAddress(delegation.address)}
                        </a>
                      </div>
                      
                      <div className="flex justify-between items-center mb-sm">
                        <span className="text-body-sm text-neutral-medium">Amount</span>
                        <span className="text-body font-medium">{delegation.power.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-body-sm text-neutral-medium">Since</span>
                        <span className="text-body-sm">{delegation.since.toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-lg">
                  <p className="text-body text-neutral-medium mb-md">
                    You haven't delegated your voting power to anyone.
                  </p>
                  <button type="button" className="btn-primary">
                    Delegate Voting Power
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div>
            <h2 className="text-h2 mb-md">Account Settings</h2>
            
            <div className="card mb-lg">
              <h3 className="text-h3 mb-md">Profile Information</h3>
              
              <div className="space-y-md">
                <div>
                  <label htmlFor="displayName" className="label">Display Name</label>
                  <input
                    type="text"
                    id="displayName"
                    className="input w-full"
                    defaultValue={user?.displayName || ''}
                    placeholder="Enter a display name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="input w-full"
                    defaultValue={user?.email || ''}
                    placeholder="your@email.com"
                  />
                  <p className="mt-sm text-body-sm text-neutral-medium">
                    Email is used for notifications (optional)
                  </p>
                </div>
                
                <div className="pt-md">
                  <button type="button" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-h3 mb-md">Preferences</h3>
              
              <div className="space-y-md">
                <div className="flex items-center justify-between p-md rounded-lg border border-neutral-light">
                  <div>
                    <p className="text-body font-medium">Email Notifications</p>
                    <p className="text-body-sm text-neutral-medium">
                      Receive emails about new proposals and voting results
                    </p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-neutral-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-md rounded-lg border border-neutral-light">
                  <div>
                    <p className="text-body font-medium">Voting Reminders</p>
                    <p className="text-body-sm text-neutral-medium">
                      Get reminders when proposals are about to end
                    </p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-11 h-6 bg-neutral-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-xl pb-lg">
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center gap-lg">
          <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-h1 font-bold">
            {user?.displayName?.charAt(0) || address?.charAt(2) || 'U'}
          </div>
          
          <div className="flex-1">
            <h1 className="text-h1 mb-sm">
              {user?.displayName || `User ${truncateAddress(address || '')}`}
            </h1>
            
            <div className="flex items-center">
              <button
                type="button"
                className="flex items-center text-body font-medium bg-neutral-light/50 px-md py-sm rounded-lg mr-md"
                onClick={handleCopyAddress}
              >
                {address ? truncateAddress(address) : 'Not connected'}
                {copied ? (
                  <CheckCircle size={16} className="ml-sm text-accent-green" />
                ) : (
                  <Copy size={16} className="ml-sm text-neutral-medium" />
                )}
              </button>
              
              <a
                href={`https://etherscan.io/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-body-sm hover:underline"
              >
                View on Etherscan
              </a>
            </div>
          </div>
          
          <div>
            <button type="button" className="btn-secondary">
              <Settings size={18} className="mr-sm" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex border-b border-neutral-light overflow-x-auto">
        <button
          type="button"
          className={`py-md px-lg text-body font-medium border-b-2 transition-colors ${
            activeTab === 'voting' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-neutral-medium hover:text-neutral-dark'
          }`}
          onClick={() => setActiveTab('voting')}
        >
          <div className="flex items-center">
            <FileText size={18} className="mr-sm" />
            Voting History
          </div>
        </button>
        
        <button
          type="button"
          className={`py-md px-lg text-body font-medium border-b-2 transition-colors ${
            activeTab === 'proposals' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-neutral-medium hover:text-neutral-dark'
          }`}
          onClick={() => setActiveTab('proposals')}
        >
          <div className="flex items-center">
            <FileText size={18} className="mr-sm" />
            My Proposals
          </div>
        </button>
        
        <button
          type="button"
          className={`py-md px-lg text-body font-medium border-b-2 transition-colors ${
            activeTab === 'delegation' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-neutral-medium hover:text-neutral-dark'
          }`}
          onClick={() => setActiveTab('delegation')}
        >
          <div className="flex items-center">
            <Users size={18} className="mr-sm" />
            Delegation
          </div>
        </button>
        
        <button
          type="button"
          className={`py-md px-lg text-body font-medium border-b-2 transition-colors ${
            activeTab === 'settings' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-neutral-medium hover:text-neutral-dark'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          <div className="flex items-center">
            <Settings size={18} className="mr-sm" />
            Settings
          </div>
        </button>
      </div>
      
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile;