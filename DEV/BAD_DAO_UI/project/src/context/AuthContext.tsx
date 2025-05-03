import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useThirdwebWallet } from '../hooks/useThirdwebWallet';

interface User {
  id: string;
  address?: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected } = useThirdwebWallet();

  // Check for existing session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If wallet is connected, use that for authentication
        if (isConnected && address) {
          setUser({
            id: address,
            address: address,
            // In a real app, fetch additional user details from your database
            displayName: `User ${address.slice(0, 6)}`,
          });
        } else {
          // Check local storage for session
          const userData = localStorage.getItem('badDao_user');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError('Authentication failed');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [address, isConnected]);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock Google login - in a real app, this would use Google OAuth
      setTimeout(() => {
        const mockUser = {
          id: 'google_123456',
          displayName: 'Google User',
          email: 'googleuser@example.com',
          avatarUrl: 'https://via.placeholder.com/150',
        };
        
        setUser(mockUser);
        localStorage.setItem('badDao_user', JSON.stringify(mockUser));
      }, 1000);
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock email login - in a real app, this would verify credentials
      if (email && password) {
        setTimeout(() => {
          const mockUser = {
            id: 'email_123456',
            displayName: email.split('@')[0],
            email: email,
          };
          
          setUser(mockUser);
          localStorage.setItem('badDao_user', JSON.stringify(mockUser));
        }, 1000);
      } else {
        throw new Error('Email and password required');
      }
    } catch (err) {
      console.error('Email login error:', err);
      setError('Email login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('badDao_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};