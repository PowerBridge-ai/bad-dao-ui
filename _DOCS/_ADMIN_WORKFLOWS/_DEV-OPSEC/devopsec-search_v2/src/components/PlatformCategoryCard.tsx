import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface PlatformCategoryCardProps {
  name: string;
  count: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  icon: LucideIcon;
}

const PlatformCategoryCard: React.FC<PlatformCategoryCardProps> = ({ 
  name, 
  count, 
  priority,
  icon: Icon
}) => {
  const priorityColors = {
    Critical: 'text-neon-red',
    High: 'text-neon-yellow',
    Medium: 'text-neon-green',
    Low: 'text-neon-blue',
  };

  return (
    <div className="p-2 rounded-md hover:bg-bg-tertiary transition-colors cursor-pointer flex items-center">
      <div className="w-8 h-8 rounded-full bg-neon-green/10 flex items-center justify-center text-neon-green mr-3">
        <Icon size={16} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">{name}</p>
          <span className="text-xs font-semibold bg-neon-green/10 text-neon-green px-2 py-0.5 rounded-full">
            {count}
          </span>
        </div>
        <p className={`text-xs ${priorityColors[priority]}`}>
          {priority} Priority
        </p>
      </div>
    </div>
  );
};

export default PlatformCategoryCard;