import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Logo from '../components/common/Logo';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-neutral-white flex flex-col items-center justify-center p-md">
      <div className="text-center max-w-md">
        <div className="mb-lg flex justify-center">
          <Logo size="large" />
        </div>
        
        <h1 className="text-h1 mb-md">404 - Page Not Found</h1>
        
        <p className="text-body-lg text-neutral-medium mb-xl">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/" className="btn-primary inline-flex items-center">
          <Home size={18} className="mr-sm" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;