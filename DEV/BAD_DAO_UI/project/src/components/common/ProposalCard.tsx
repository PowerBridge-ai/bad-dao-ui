import { ArrowRight, Users, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProposalStatus } from '../../types/proposal';
import { formatDistanceToNow } from 'date-fns';

interface ProposalCardProps {
  id: string;
  title: string;
  description: string;
  proposer: string;
  createdAt: Date;
  status: ProposalStatus;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
}

const ProposalCard = ({
  id,
  title,
  description,
  proposer,
  createdAt,
  status,
  votesFor,
  votesAgainst,
  totalVotes,
}: ProposalCardProps) => {
  const getStatusBadgeClasses = () => {
    switch (status) {
      case 'active':
        return 'badge-info';
      case 'passed':
        return 'badge-success';
      case 'rejected':
        return 'badge-error';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'passed':
        return 'Passed';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const forPercentage = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (votesAgainst / totalVotes) * 100 : 0;
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-md">
        <span className={`${getStatusBadgeClasses()}`}>
          {getStatusLabel()}
        </span>
        <span className="text-caption text-neutral-medium">{timeAgo}</span>
      </div>
      
      <h3 className="text-h3 mb-sm">{title}</h3>
      
      <p className="text-body text-neutral-medium mb-md line-clamp-2">
        {description}
      </p>
      
      <div className="flex items-center text-body-sm text-neutral-medium mb-md">
        <Users size={16} className="mr-1" />
        <span>Proposed by {proposer.slice(0, 6)}...{proposer.slice(-4)}</span>
      </div>
      
      {totalVotes > 0 && (
        <div className="mb-md">
          <div className="flex justify-between text-body-sm mb-1">
            <div className="flex items-center">
              <CheckCircle size={14} className="text-accent-green mr-1" />
              <span>For ({Math.round(forPercentage)}%)</span>
            </div>
            <div className="flex items-center">
              <XCircle size={14} className="text-accent-red mr-1" />
              <span>Against ({Math.round(againstPercentage)}%)</span>
            </div>
          </div>
          
          <div className="h-2 bg-neutral-light rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent-green rounded-full"
              style={{ width: `${forPercentage}%` }}
            />
          </div>
        </div>
      )}
      
      <Link 
        to={`/proposals/${id}`}
        className="btn-tertiary mt-auto self-start"
      >
        View Details
        <ArrowRight size={16} className="ml-1" />
      </Link>
    </div>
  );
};

export default ProposalCard;