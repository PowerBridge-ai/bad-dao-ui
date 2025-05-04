import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

const Logo = ({ size = 'medium' }: LogoProps) => {
  const sizeClasses = {
    small: 'h-6',
    medium: 'h-8',
    large: 'h-12',
    xlarge: 'h-24',
  };

  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/bad-white-logo.png" 
        alt="BAD DAO Logo" 
        className={`${sizeClasses[size]}`} 
      />
    </Link>
  );
};

export default Logo;