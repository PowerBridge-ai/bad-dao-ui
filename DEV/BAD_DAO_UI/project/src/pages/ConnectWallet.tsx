import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  useConnect, 
  metamaskWallet, 
  coinbaseWallet, 
  walletConnect 
} from "@thirdweb-dev/react";
import { Mail, Lock, AlertCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

const ConnectWallet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
  const { connect } = useConnect();
  const { loginWithGoogle, loginWithEmail, error: authError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const metamask = metamaskWallet();
  const coinbase = coinbaseWallet();
  const walletConnectV2 = walletConnect();
  
  const handleWalletConnect = async (wallet: any) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      await connect(wallet);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Wallet connection error:', error);
      setLoginError('Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Google login error:', error);
      setLoginError('Failed to login with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    
    try {
      await loginWithEmail(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Email login error:', error);
      setLoginError('Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      await loginWithEmail('demo@baddao.io', 'demo123');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Demo login error:', error);
      setLoginError('Failed to login with demo account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light/20 flex flex-col justify-center items-center p-md">
      <div className="w-full max-w-md">
        <div className="text-center mb-xl">
          <Logo size="large" />
          <h1 className="text-h1 mt-md font-bold text-primary">Welcome to BAD DAO</h1>
          <p className="text-body-lg text-neutral-medium mt-sm">
            Connect your wallet or sign in to access the governance platform
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-xl">
          {(loginError || authError) && (
            <div className="mb-lg p-md rounded-lg bg-accent-red/10 flex items-start">
              <AlertCircle size={18} className="text-accent-red shrink-0 mt-0.5 mr-sm" />
              <p className="text-body text-accent-red">{loginError || authError}</p>
            </div>
          )}
          
          {showEmailForm ? (
            <form onSubmit={handleEmailLogin} className="space-y-md">
              <div>
                <label htmlFor="email" className="label block text-neutral-dark font-medium mb-1">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="input w-full pl-10 bg-neutral-light/20 border border-neutral-light rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail size={18} className="absolute left-3 top-3.5 text-neutral-medium" />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="label block text-neutral-dark font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    className="input w-full pl-10 bg-neutral-light/20 border border-neutral-light rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Lock size={18} className="absolute left-3 top-3.5 text-neutral-medium" />
                </div>
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full bg-primary text-white rounded-lg py-2.5 font-medium hover:bg-primary-dark transition-colors"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? 'Signing in...' : 'Sign in with Email'}
              </button>
              
              <button
                type="button"
                className="btn-tertiary w-full text-primary bg-transparent py-2.5 font-medium hover:bg-primary/5 transition-colors"
                onClick={() => setShowEmailForm(false)}
              >
                Back to connection options
              </button>
            </form>
          ) : (
            <div className="space-y-md">
              <button
                type="button"
                className="btn-secondary w-full flex items-center justify-center gap-md bg-neutral-light/30 border border-neutral-light rounded-lg py-2.5 font-medium hover:bg-neutral-light/50 transition-colors"
                onClick={() => handleWalletConnect(metamask)}
                disabled={isLoading}
              >
                <img src="https://raw.githubusercontent.com/thirdweb-dev/typescript-sdk/main/docs/images/metamask-fox.svg" alt="MetaMask" className="w-6 h-6" />
                Connect with MetaMask
              </button>
              
              <button
                type="button"
                className="btn-secondary w-full flex items-center justify-center gap-md bg-neutral-light/30 border border-neutral-light rounded-lg py-2.5 font-medium hover:bg-neutral-light/50 transition-colors"
                onClick={() => handleWalletConnect(walletConnectV2)}
                disabled={isLoading}
              >
                <img src="https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Icon/Blue%20(Default)/Icon.svg" alt="WalletConnect" className="w-6 h-6" />
                Connect with WalletConnect
              </button>
              
              <button
                type="button"
                className="btn-secondary w-full flex items-center justify-center gap-md bg-neutral-light/30 border border-neutral-light rounded-lg py-2.5 font-medium hover:bg-neutral-light/50 transition-colors"
                onClick={() => handleWalletConnect(coinbase)}
                disabled={isLoading}
              >
                <img src="https://raw.githubusercontent.com/thirdweb-dev/typescript-sdk/main/docs/images/coinbase-wallet-logo.svg" alt="Coinbase Wallet" className="w-6 h-6" />
                Connect with Coinbase Wallet
              </button>
              
              <div className="relative flex items-center py-md">
                <div className="flex-grow border-t border-neutral-light"></div>
                <span className="flex-shrink mx-md text-neutral-medium text-body-sm">or continue with</span>
                <div className="flex-grow border-t border-neutral-light"></div>
              </div>
              
              <button
                type="button"
                className="btn-accent w-full flex items-center justify-center gap-md bg-accent-green text-white rounded-lg py-2.5 font-medium hover:bg-accent-green/80 transition-colors"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                <UserPlus size={18} />
                Try Demo Account
              </button>
              
              <button
                type="button"
                className="btn-secondary w-full flex items-center justify-center gap-md bg-neutral-light/30 border border-neutral-light rounded-lg py-2.5 font-medium hover:bg-neutral-light/50 transition-colors"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
              
              <button
                type="button"
                className="btn-secondary w-full bg-neutral-light/30 border border-neutral-light rounded-lg py-2.5 font-medium hover:bg-neutral-light/50 transition-colors"
                onClick={() => setShowEmailForm(true)}
                disabled={isLoading}
              >
                Sign in with Email
              </button>
            </div>
          )}
        </div>
        
        <p className="text-center text-body-sm text-neutral-medium mt-lg">
          By connecting, you agree to the{' '}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default ConnectWallet;