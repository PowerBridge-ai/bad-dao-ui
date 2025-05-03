import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useThirdwebWallet } from '../../hooks/useThirdwebWallet';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isConnected, isConnecting } = useThirdwebWallet();
  const location = useLocation();

  if (isLoading || isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-white">
        <div className="w-16 h-16 border-4 border-primary-light rounded-full border-t-primary animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated && !isConnected) {
    return <Navigate to="/connect" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;