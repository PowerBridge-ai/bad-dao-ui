import { BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo = ({ size = 'medium' }: LogoProps) => {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
  };

  const iconSizes = {
    small: 18,
    medium: 24,
    large: 32,
  };

  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="bg-primary rounded-lg p-1 text-white">
        <BarChart2 size={iconSizes[size]} />
      </div>
      <span className={`font-bold ${sizeClasses[size]}`}>
        <span className="text-primary">BAD</span>
        <span className="text-neutral-dark">DAO</span>
      </span>
    </Link>
  );
};

export default Logo;