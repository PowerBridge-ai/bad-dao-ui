import { TrendingUp, TrendingDown } from 'lucide-react';

interface TreasuryCardProps {
  title: string;
  value: string;
  changePercent: number;
  change: string;
  period?: string;
  icon?: React.ReactNode;
}

const TreasuryCard = ({
  title,
  value,
  changePercent,
  change,
  period = '24h',
  icon,
}: TreasuryCardProps) => {
  const isPositive = changePercent >= 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-md">
        <h3 className="text-label text-neutral-medium">{title}</h3>
        {icon && icon}
      </div>
      
      <div className="mb-md">
        <p className="text-h2 font-bold">{value}</p>
      </div>
      
      <div className="flex items-center">
        <div className={`flex items-center ${isPositive ? 'text-accent-green' : 'text-accent-red'} mr-2`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="ml-1 text-body-sm font-medium">
            {changePercent.toFixed(2)}%
          </span>
        </div>
        
        <span className="text-body-sm text-neutral-medium">
          {isPositive ? '+' : ''}{change} ({period})
        </span>
      </div>
    </div>
  );
};

export default TreasuryCard;