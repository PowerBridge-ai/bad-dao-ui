import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  positive: boolean;
  hideArrow?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon,
  positive,
  hideArrow = false
}) => {
  return (
    <motion.div 
      className="bg-bg-secondary p-4 rounded-lg border border-neon-green/10 transition-all hover:shadow-neon-sm"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-text-muted text-sm">{title}</p>
          <h3 className="text-2xl font-display mt-2 text-text-primary">{value}</h3>
        </div>
        <div className="w-10 h-10 rounded-full bg-neon-green/10 flex items-center justify-center text-neon-green">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {!hideArrow && (
          positive ? 
          <TrendingUp size={16} className="text-neon-green mr-1" /> : 
          <TrendingDown size={16} className="text-neon-red mr-1" />
        )}
        <span className={`text-sm ${positive ? 'text-neon-green' : hideArrow ? 'text-text-muted' : 'text-neon-red'}`}>
          {change}
        </span>
      </div>
    </motion.div>
  );
};

export default StatCard;