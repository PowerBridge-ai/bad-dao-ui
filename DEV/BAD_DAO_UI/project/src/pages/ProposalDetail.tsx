import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import VotingInterface from '../components/common/VotingInterface';
import { getMockProposalById } from '../utils/mockData';
import { ProposalType } from '../types/proposal';
import { formatDistanceToNow } from 'date-fns';

const ProposalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<ProposalType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userVote, setUserVote] = useState<'for' | 'against' | 'abstain' | null>(null);
  const [comments, setComments] = useState<{
    id: string;
    author: string;
    text: string;
    timestamp: Date;
  }[]>([
    {
      id: '1',
      author: '0x1234...5678',
      text: 'I support this proposal. It will help us scale our operations significantly.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3)
    },
    {
      id: '2',
      author: '0xabcd...efgh',
      text: "Have we considered the long-term implications? I'm concerned about sustainability.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12)
    }
  ]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchProposal = async () => {
      if (!id) return;
      
      try {
        // In a real app, this would fetch data from API/blockchain
        const data = getMockProposalById(id);
        if (data) {
          setProposal(data);
        }
      } catch (error) {
        console.error('Error fetching proposal:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposal();
  }, [id]);

  const handleVote = async (vote: 'for' | 'against' | 'abstain') => {
    // In a real app, this would send a transaction to the blockchain
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUserVote(vote);
        resolve();
      }, 1500);
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      author: '0xYourAddress', // In a real app, this would be the user's address
      text: newComment.trim(),
      timestamp: new Date(),
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-lg">
        <div className="h-8 bg-neutral-light/50 rounded-lg w-1/4"></div>
        <div className="h-16 bg-neutral-light/50 rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          <div className="lg:col-span-2 h-64 bg-neutral-light/50 rounded-lg"></div>
          <div className="h-64 bg-neutral-light/50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="card text-center py-xl">
        <h2 className="text-h2 mb-md">Proposal Not Found</h2>
        <p className="text-body text-neutral-medium mb-lg">
          The proposal you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/proposals" className="btn-primary">
          <ArrowLeft size={18} className="mr-sm" />
          Back to Proposals
        </Link>
      </div>
    );
  }

  const forPercentage = proposal.totalVotes > 0 
    ? (proposal.votesFor / proposal.totalVotes) * 100 
    : 0;
    
  const againstPercentage = proposal.totalVotes > 0 
    ? (proposal.votesAgainst / proposal.totalVotes) * 100 
    : 0;
    
  const abstainPercentage = proposal.totalVotes > 0 
    ? (proposal.abstainVotes / proposal.totalVotes) * 100 
    : 0;

  return (
    <div className="space-y-xl pb-lg">
      <div>
        <Link to="/proposals" className="text-primary text-body flex items-center hover:underline mb-md">
          <ArrowLeft size={16} className="mr-sm" />
          Back to Proposals
        </Link>
        
        <div className="flex flex-wrap gap-sm items-center mb-md">
          <span className={`
            badge
            ${proposal.status === 'active' ? 'badge-info' : ''}
            ${proposal.status === 'pending' ? 'badge-warning' : ''}
            ${proposal.status === 'passed' ? 'badge-success' : ''}
            ${proposal.status === 'rejected' ? 'badge-error' : ''}
          `}>
            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
          </span>
          
          <div className="flex items-center text-body-sm text-neutral-medium">
            <Calendar size={14} className="mr-1" />
            {formatDistanceToNow(proposal.createdAt, { addSuffix: true })}
          </div>
          
          <div className="flex items-center text-body-sm text-neutral-medium">
            <Users size={14} className="mr-1" />
            {proposal.totalVotes} votes
          </div>
        </div>
        
        <h1 className="text-h1 mb-md">{proposal.title}</h1>
        
        <div className="flex items-center text-body-sm text-neutral-medium mb-lg">
          <span>Proposed by {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-h2 mb-lg">Proposal Details</h2>
            
            <div className="prose text-body">
              <p className="text-body mb-md">
                {proposal.description}
              </p>
              
              <h3 className="text-h3 mt-xl mb-md">Background</h3>
              <p className="text-body mb-md">
                The BAD DAO has been growing steadily and is now facing the need to expand its infrastructure to accommodate increasing user activity. This proposal seeks to allocate funds for server expansion and improvement of our scaling capabilities.
              </p>
              
              <h3 className="text-h3 mt-xl mb-md">Specification</h3>
              <ul className="list-disc pl-lg space-y-sm mb-md">
                <li>Allocate 45.5 ETH (~$150,000) for infrastructure expansion</li>
                <li>Upgrade server capacity to handle 10x current load</li>
                <li>Implement enhanced security measures</li>
                <li>Hire two additional DevOps specialists for 6 months</li>
              </ul>
              
              <h3 className="text-h3 mt-xl mb-md">Timeline</h3>
              <p className="text-body mb-md">
                If approved, the implementation will begin immediately with an expected completion date of July 15, 2025. Progress reports will be provided bi-weekly.
              </p>
            </div>
          </div>
          
          <div className="card mt-lg">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="text-h2">Voting Results</h2>
              <span className="text-body-sm text-neutral-medium">
                {proposal.totalVotes} total votes
              </span>
            </div>
            
            <div className="space-y-md mb-lg">
              <div>
                <div className="flex justify-between mb-sm">
                  <div className="flex items-center">
                    <CheckCircle size={16} className="text-accent-green mr-sm" />
                    <span className="text-body font-medium">For</span>
                  </div>
                  <div className="text-body">
                    {proposal.votesFor.toLocaleString()} ({Math.round(forPercentage)}%)
                  </div>
                </div>
                <div className="h-2 bg-neutral-light rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent-green rounded-full"
                    style={{ width: `${forPercentage}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-sm">
                  <div className="flex items-center">
                    <XCircle size={16} className="text-accent-red mr-sm" />
                    <span className="text-body font-medium">Against</span>
                  </div>
                  <div className="text-body">
                    {proposal.votesAgainst.toLocaleString()} ({Math.round(againstPercentage)}%)
                  </div>
                </div>
                <div className="h-2 bg-neutral-light rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent-red rounded-full"
                    style={{ width: `${againstPercentage}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-sm">
                  <div className="flex items-center">
                    <HelpCircle size={16} className="text-primary-light mr-sm" />
                    <span className="text-body font-medium">Abstain</span>
                  </div>
                  <div className="text-body">
                    {proposal.abstainVotes.toLocaleString()} ({Math.round(abstainPercentage)}%)
                  </div>
                </div>
                <div className="h-2 bg-neutral-light rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-light rounded-full"
                    style={{ width: `${abstainPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="p-md rounded-lg bg-neutral-light/50">
              <p className="text-body-sm text-neutral-medium">
                This proposal {proposal.status === 'active' ? 'will pass' : proposal.status === 'passed' ? 'passed' : 'failed'} if{proposal.status !== 'active' ? '' : ' voting ends now and'} at least 50% of votes are in favor and a minimum of 100,000 voting power participates.
              </p>
            </div>
          </div>
          
          <div className="card mt-lg">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="text-h2">Discussion</h2>
              <span className="text-body-sm text-neutral-medium">
                {comments.length} comments
              </span>
            </div>
            
            <form onSubmit={handleAddComment} className="mb-xl">
              <label htmlFor="comment" className="label">Add your thoughts</label>
              <textarea
                id="comment"
                className="input w-full min-h-[100px]"
                placeholder="Share your perspective on this proposal..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="mt-md flex justify-end">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!newComment.trim()}
                >
                  <MessageSquare size={16} className="mr-sm" />
                  Post Comment
                </button>
              </div>
            </form>
            
            <div className="space-y-lg">
              {comments.map((comment) => (
                <div key={comment.id} className="border-t border-neutral-light pt-lg">
                  <div className="flex justify-between mb-sm">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-light/10 flex items-center justify-center mr-sm text-primary">
                        {comment.author.charAt(2)}
                      </div>
                      <span className="text-body font-medium">
                        {comment.author.slice(0, 6)}...{comment.author.slice(-4)}
                      </span>
                    </div>
                    <span className="text-body-sm text-neutral-medium">
                      {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-body">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <VotingInterface
            proposalId={proposal.id}
            proposalStatus={proposal.status}
            votingEnds={proposal.votingEnds}
            userVote={userVote}
            onVote={handleVote}
          />
          
          <div className="card mt-lg">
            <h3 className="text-h3 mb-md">Proposal Information</h3>
            
            <div className="space-y-md text-body">
              <div className="flex justify-between">
                <span className="text-neutral-medium">Proposal ID</span>
                <span className="font-medium">{proposal.id.slice(0, 8)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-neutral-medium">Proposer</span>
                <a 
                  href={`https://etherscan.io/address/${proposal.proposer}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                </a>
              </div>
              
              <div className="flex justify-between">
                <span className="text-neutral-medium">Created</span>
                <span className="font-medium">
                  {proposal.createdAt.toLocaleDateString()}
                </span>
              </div>
              
              {proposal.votingEnds && (
                <div className="flex justify-between">
                  <span className="text-neutral-medium">Voting Ends</span>
                  <span className="font-medium">
                    {proposal.votingEnds.toLocaleDateString()}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-neutral-medium">Status</span>
                <span className={`font-medium ${
                  proposal.status === 'passed' ? 'text-accent-green' :
                  proposal.status === 'rejected' ? 'text-accent-red' :
                  proposal.status === 'active' ? 'text-primary' :
                  'text-accent-gold'
                }`}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetail;