import { useState } from 'react';
import { Check, X, HelpCircle } from 'lucide-react';
import { ProposalStatus } from '../../types/proposal';

interface VotingInterfaceProps {
  proposalId: string;
  proposalStatus: ProposalStatus;
  votingEnds?: Date;
  userVote?: 'for' | 'against' | 'abstain' | null;
  onVote: (vote: 'for' | 'against' | 'abstain') => Promise<void>;
}

const VotingInterface = ({
  proposalId,
  proposalStatus,
  votingEnds,
  userVote,
  onVote,
}: VotingInterfaceProps) => {
  const [selectedVote, setSelectedVote] = useState<'for' | 'against' | 'abstain' | null>(userVote || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canVote = proposalStatus === 'active' && !userVote;

  const getTimeRemainingText = () => {
    if (!votingEnds) return 'Voting period ended';
    
    const now = new Date();
    if (now > votingEnds) return 'Voting period ended';
    
    const diffInMs = votingEnds.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ${diffInHours} hour${diffInHours !== 1 ? 's' : ''} remaining`;
    } else {
      const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} remaining`;
    }
  };
  
  const handleVote = async () => {
    if (!selectedVote) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onVote(selectedVote);
    } catch (err) {
      setError('Failed to submit vote. Please try again.');
      console.error('Vote error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-h3 mb-md">Vote on this proposal</h3>
      
      {!canVote && userVote && (
        <div className="rounded-lg bg-neutral-light/50 p-md mb-lg">
          <p className="text-body">
            You voted <span className="font-semibold">{userVote.toUpperCase()}</span> on this proposal.
          </p>
        </div>
      )}
      
      {proposalStatus !== 'active' && (
        <div className="rounded-lg bg-neutral-light/50 p-md mb-lg">
          <p className="text-body">
            Voting for this proposal is {proposalStatus === 'pending' ? 'not yet open' : 'now closed'}.
          </p>
        </div>
      )}
      
      {votingEnds && proposalStatus === 'active' && (
        <div className="mb-lg">
          <p className="text-body-sm text-neutral-medium">
            {getTimeRemainingText()}
          </p>
        </div>
      )}
      
      <div className="space-y-md mb-lg">
        <button
          type="button"
          className={`w-full flex items-center p-md border rounded-lg transition-colors ${
            selectedVote === 'for'
              ? 'border-accent-green bg-accent-green/10'
              : 'border-neutral-light hover:border-accent-green/30 hover:bg-accent-green/5'
          }`}
          onClick={() => setSelectedVote('for')}
          disabled={!canVote || isSubmitting}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-md ${
            selectedVote === 'for'
              ? 'bg-accent-green text-white'
              : 'border border-neutral-light'
          }`}>
            {selectedVote === 'for' && <Check size={16} />}
          </div>
          <div className="flex-1 text-left">
            <p className="text-body font-medium">Vote For</p>
            <p className="text-body-sm text-neutral-medium">Support this proposal</p>
          </div>
        </button>
        
        <button
          type="button"
          className={`w-full flex items-center p-md border rounded-lg transition-colors ${
            selectedVote === 'against'
              ? 'border-accent-red bg-accent-red/10'
              : 'border-neutral-light hover:border-accent-red/30 hover:bg-accent-red/5'
          }`}
          onClick={() => setSelectedVote('against')}
          disabled={!canVote || isSubmitting}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-md ${
            selectedVote === 'against'
              ? 'bg-accent-red text-white'
              : 'border border-neutral-light'
          }`}>
            {selectedVote === 'against' && <X size={16} />}
          </div>
          <div className="flex-1 text-left">
            <p className="text-body font-medium">Vote Against</p>
            <p className="text-body-sm text-neutral-medium">Oppose this proposal</p>
          </div>
        </button>
        
        <button
          type="button"
          className={`w-full flex items-center p-md border rounded-lg transition-colors ${
            selectedVote === 'abstain'
              ? 'border-primary-light bg-primary-light/10'
              : 'border-neutral-light hover:border-primary-light/30 hover:bg-primary-light/5'
          }`}
          onClick={() => setSelectedVote('abstain')}
          disabled={!canVote || isSubmitting}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-md ${
            selectedVote === 'abstain'
              ? 'bg-primary-light text-white'
              : 'border border-neutral-light'
          }`}>
            {selectedVote === 'abstain' && <HelpCircle size={16} />}
          </div>
          <div className="flex-1 text-left">
            <p className="text-body font-medium">Abstain</p>
            <p className="text-body-sm text-neutral-medium">Participate without taking a side</p>
          </div>
        </button>
      </div>
      
      {error && (
        <div className="mb-md p-sm rounded-lg bg-accent-red/10 text-accent-red text-body-sm">
          {error}
        </div>
      )}
      
      <button
        type="button"
        className="btn-primary w-full"
        disabled={!selectedVote || !canVote || isSubmitting}
        onClick={handleVote}
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin mr-2">⚙️</span>
            Submitting Vote...
          </>
        ) : (
          'Submit Vote'
        )}
      </button>
    </div>
  );
};

export default VotingInterface;