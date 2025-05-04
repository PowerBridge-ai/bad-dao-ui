import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Award, Users, Briefcase, ExternalLink } from 'lucide-react';

interface ContributorCardProps {
  id: string;
  name: string;
  avatar: string;
  title?: string;
  bio: string;
  skills: string[];
  rating: number; // out of 5
  completedTasks: number;
  availableForWork: boolean;
  daos?: Array<{
    id: string;
    name: string;
    logo: string;
  }>;
}

const ContributorCard: React.FC<ContributorCardProps> = ({
  id,
  name,
  avatar,
  title,
  bio,
  skills,
  rating,
  completedTasks,
  availableForWork,
  daos = [],
}) => {
  // Generate star rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Star key={i} size={14} className="text-yellow-400" style={{ fill: 'url(#half-star)' }} />
        );
      } else {
        stars.push(
          <Star key={i} size={14} className="text-neutral-600" />
        );
      }
    }
    
    return (
      <div className="flex">
        <svg width="0" height="0" className="hidden">
          <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="50%" stopColor="#4B5563" />
          </linearGradient>
        </svg>
        {stars}
      </div>
    );
  };

  return (
    <div className="bg-neutral-dark/60 border border-neutral-dark/50 rounded-lg p-5 hover:shadow-lg transition-all">
      <div className="flex items-start gap-4 mb-5">
        <img 
          src={avatar}
          alt={`${name}'s avatar`}
          className="w-16 h-16 rounded-full object-cover border-2 border-neutral-dark"
        />
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div>
              <h3 className="text-white text-lg font-medium mb-1">{name}</h3>
              {title && (
                <p className="text-neutral-400 text-sm">{title}</p>
              )}
            </div>
            
            {availableForWork && (
              <span className="bg-green-800/20 text-green-300 text-xs px-2 py-1 rounded-md inline-flex items-center mt-2 sm:mt-0">
                <Briefcase size={12} className="mr-1" />
                Available for Work
              </span>
            )}
          </div>
          
          <p className="text-neutral-400 text-sm line-clamp-2 mt-3">
            {bio}
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1.5 mb-5">
        {skills.slice(0, 5).map((skill, index) => (
          <span 
            key={index}
            className="bg-neutral-800/70 text-neutral-300 text-xs px-2 py-1 rounded-md"
          >
            {skill}
          </span>
        ))}
        {skills.length > 5 && (
          <span className="bg-neutral-800/70 text-neutral-300 text-xs px-2 py-1 rounded-md">
            +{skills.length - 5} more
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-5 border-t border-b border-neutral-dark/50 py-3">
        <div className="flex items-center">
          <Award size={16} className="text-primary mr-2" />
          <div className="flex flex-col">
            <span className="text-white font-medium">{completedTasks}</span>
            <span className="text-xs text-neutral-400">Tasks Completed</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <Star size={16} className="text-primary mr-2" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-medium">{rating.toFixed(1)}</span>
              {renderStars()}
            </div>
            <span className="text-xs text-neutral-400">Rating</span>
          </div>
        </div>
      </div>
      
      {daos.length > 0 && (
        <div className="mb-5">
          <div className="text-sm text-neutral-400 mb-2 flex items-center">
            <Users size={14} className="mr-1.5 text-primary" />
            <span>Member of</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {daos.map((dao) => (
              <Link 
                key={dao.id}
                to={`/daos/${dao.id}`}
                className="flex items-center bg-neutral-800/50 hover:bg-neutral-700/50 transition-colors rounded-full px-2.5 py-1.5"
              >
                <img 
                  src={dao.logo}
                  alt={`${dao.name} logo`}
                  className="w-5 h-5 rounded-full mr-1.5"
                />
                <span className="text-xs font-medium text-white">{dao.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-auto pt-1">
        <Link
          to={`/project-management/contributors/${id}`}
          className="text-primary text-sm font-medium hover:underline flex items-center"
        >
          View Profile
          <ArrowRight size={14} className="ml-1.5" />
        </Link>
        
        <button className="bg-neutral-800/70 hover:bg-neutral-700/70 text-neutral-300 rounded-md p-1.5 transition-colors">
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};

export default ContributorCard; 