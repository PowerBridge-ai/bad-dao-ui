import React from 'react';
import { Users, TrendingUp, ArrowRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DAOCardProps {
  id: string;
  name: string;
  description: string;
  logo: string;
  memberCount: number;
  category: string;
  tvl?: number; // Total Value Locked (optional)
  currency?: string;
  website?: string;
  tags: string[];
}

const DAOCard: React.FC<DAOCardProps> = ({
  id,
  name,
  description,
  logo,
  memberCount,
  category,
  tvl,
  currency = 'USD',
  website,
  tags,
}) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <img 
          src={logo} 
          alt={`${name} logo`} 
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-h3 mb-1">{name}</h3>
            <span className="badge bg-neutral-100 text-neutral-800 text-xs px-2 py-1 rounded-md">
              {category}
            </span>
          </div>
          <p className="text-body-sm text-neutral-medium line-clamp-2">
            {description}
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-4">
        {tags.map((tag, index) => (
          <span 
            key={index}
            className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-body-sm">
          <Users size={16} className="text-neutral-medium mr-2" />
          <span>
            <span className="font-medium">{memberCount.toLocaleString()}</span>
            <span className="text-neutral-medium ml-1">members</span>
          </span>
        </div>
        
        {tvl !== undefined && (
          <div className="flex items-center text-body-sm">
            <TrendingUp size={16} className="text-neutral-medium mr-2" />
            <span>
              <span className="font-medium">
                {tvl.toLocaleString(undefined, {
                  style: 'currency',
                  currency: currency,
                  maximumFractionDigits: 0,
                })}
              </span>
              <span className="text-neutral-medium ml-1">TVL</span>
            </span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-auto">
        {website && (
          <a 
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-body-sm text-neutral-medium hover:text-primary-600 transition-colors"
          >
            <Globe size={14} className="mr-1" />
            Website
          </a>
        )}
        
        <Link
          to={`/daos/${id}`}
          className="btn-tertiary self-end ml-auto"
        >
          View Details
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default DAOCard; 