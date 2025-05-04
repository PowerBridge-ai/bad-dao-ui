import React from 'react';
import { Calendar, Clock, ArrowRight, Users, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export type BountyStatus = 'open' | 'in-progress' | 'review' | 'completed' | 'expired';
export type BountyDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

interface BountyCardProps {
  id: string;
  title: string;
  description: string;
  dao: {
    id: string;
    name: string;
    logo: string;
  };
  amount: number;
  tokenSymbol: string;
  dueDate?: Date;
  createdAt: Date;
  status: BountyStatus;
  applicants: number;
  difficulty: BountyDifficulty;
  skills: string[];
}

const BountyCard: React.FC<BountyCardProps> = ({
  id,
  title,
  description,
  dao,
  amount,
  tokenSymbol,
  dueDate,
  createdAt,
  status,
  applicants,
  difficulty,
  skills,
}) => {
  const getStatusBadgeClasses = () => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'in-progress':
        return 'In Progress';
      case 'review':
        return 'In Review';
      case 'completed':
        return 'Completed';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  const getDifficultyBadgeClasses = () => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-orange-100 text-orange-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });
  const dueIn = dueDate ? formatDistanceToNow(dueDate, { addSuffix: true }) : null;

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <img
            src={dao.logo}
            alt={`${dao.name} logo`}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-body-sm font-medium">{dao.name}</span>
        </div>
        <span className={`badge ${getStatusBadgeClasses()} py-1 px-2 rounded-md text-xs font-medium`}>
          {getStatusLabel()}
        </span>
      </div>
      
      <h3 className="text-h3 mb-2">{title}</h3>
      
      <p className="text-body text-neutral-medium mb-4 line-clamp-2">
        {description}
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-body-sm">
          <Clock size={16} className="text-neutral-medium mr-2" />
          <span>
            <span className="text-neutral-medium">Posted</span>
            <span className="ml-1">{timeAgo}</span>
          </span>
        </div>
        
        {dueDate && (
          <div className="flex items-center text-body-sm">
            <Calendar size={16} className="text-neutral-medium mr-2" />
            <span>
              <span className="text-neutral-medium">Due</span>
              <span className="ml-1">{dueIn}</span>
            </span>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1 mb-4">
        <span className={`${getDifficultyBadgeClasses()} text-xs px-2 py-1 rounded-md`}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
        
        {skills.map((skill, index) => (
          <span 
            key={index}
            className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-md"
          >
            {skill}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-neutral-200">
        <div className="flex items-center">
          <span className="text-h3 font-semibold">{amount}</span>
          <span className="text-body-sm text-neutral-medium ml-1">{tokenSymbol}</span>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center text-body-sm text-neutral-medium">
            <Users size={16} className="mr-1" />
            <span>{applicants} applicants</span>
          </div>
          
          <Link
            to={`/bounties/${id}`}
            className="btn-primary"
          >
            View Bounty
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BountyCard; 