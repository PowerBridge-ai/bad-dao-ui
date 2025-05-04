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
      await connect({ wallet });
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
    <div className="min-h-screen flex flex-col justify-center items-center p-md">
      <div className="w-full max-w-md">
        <div className="text-center mb-xl flex justify-center">
          <Logo size="xlarge" />
        </div>
        
        <div className="bg-transparent backdrop-blur-sm rounded-xl p-xl">
          {(loginError || authError) && (
            <div className="mb-lg p-md rounded-lg bg-accent-red/10 flex items-start">
              <AlertCircle size={18} className="text-accent-red shrink-0 mt-0.5 mr-sm" />
              <p className="text-body text-accent-red">{loginError || authError}</p>
            </div>
          )}
          
          {showEmailForm ? (
            <form onSubmit={handleEmailLogin} className="space-y-md">
              <div>
                <label htmlFor="email" className="label block text-white font-medium mb-1">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="input w-full pl-10 bg-neutral-dark/50 border border-neutral-light rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-white"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail size={18} className="absolute left-3 top-3.5 text-neutral-light" />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="label block text-white font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    className="input w-full pl-10 bg-neutral-dark/50 border border-neutral-light rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-white"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Lock size={18} className="absolute left-3 top-3.5 text-neutral-light" />
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
                className="btn-secondary w-full flex items-center justify-center gap-md bg-neutral-dark/50 border border-neutral-light rounded-lg py-2.5 font-medium hover:bg-neutral-dark/70 transition-colors text-white"
                onClick={() => handleWalletConnect(metamask)}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 212 189" fill="none">
                  <path d="M196.818 0L115.958 57.1273L130.909 25.5045L196.818 0Z" fill="#E2761B" stroke="#E2761B" strokeWidth="0.0878845" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.0733 0L95.4061 57.6L81.0916 25.5045L15.0733 0Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.0878845" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M168.275 134.704L147.055 165.622L192.36 177.385L205.444 135.352L168.275 134.704Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.0878845" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.64404 135.352L19.6396 177.385L64.9451 165.622L43.7245 134.704L6.64404 135.352Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.0878845" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M62.3509 81.7455L49.6149 99.7964L94.6678 101.689L93.0619 53.3855L62.3509 81.7455Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.0878845" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M149.46 81.7455L118.375 52.89L117.244 101.689L162.208 99.7964L149.46 81.7455Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.0878845" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M64.9455 165.622L91.9145 153.036L68.4673 135.618L64.9455 165.622Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.0878845" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M119.896 153.036L147.055 165.622L143.355 135.618L119.896 153.036Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.0878845" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Connect with MetaMask
              </button>
              
              <button
                type="button"
                className="btn-secondary w-full flex items-center justify-center gap-md bg-neutral-dark/50 border border-neutral-light rounded-lg py-2.5 font-medium hover:bg-neutral-dark/70 transition-colors text-white"
                onClick={() => handleWalletConnect(walletConnectV2)}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" fill="none">
                  <path d="M256 86.4C155.396 86.4 73.6 168.196 73.6 268.8C73.6 369.404 155.396 451.2 256 451.2C356.604 451.2 438.4 369.404 438.4 268.8C438.4 168.196 356.604 86.4 256 86.4ZM143.118 247.177C143.118 241.003 148.124 236 154.294 236H197.835C204.006 236 209.012 241.003 209.012 247.177V276.118C209.012 282.292 204.006 287.294 197.835 287.294H154.294C148.124 287.294 143.118 282.292 143.118 276.118V247.177ZM302.988 247.177C302.988 241.003 307.994 236 314.165 236H357.706C363.876 236 368.882 241.003 368.882 247.177V276.118C368.882 282.292 363.876 287.294 357.706 287.294H314.165C307.994 287.294 302.988 282.292 302.988 276.118V247.177Z" fill="#3B99FC"/>
                </svg>
                Connect with WalletConnect
              </button>
              
              <button
                type="button"
                className="btn-secondary w-full flex items-center justify-center gap-md bg-neutral-dark/50 border border-neutral-light rounded-lg py-2.5 font-medium hover:bg-neutral-dark/70 transition-colors text-white"
                onClick={() => handleWalletConnect(coinbase)}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024" fill="none">
                  <rect width="1024" height="1024" rx="512" fill="#0052FF"/>
                  <path d="M512 724C629.8 724 725 628.8 725 511C725 393.2 629.8 298 512 298C394.2 298 299 393.2 299 511C299 628.8 394.2 724 512 724Z" fill="white"/>
                  <path d="M512.153 335C439.622 335 381.652 393.025 381.652 465.5C381.652 538.05 439.622 596 512.153 596C584.683 596 642.652 538.05 642.652 465.5C642.652 393.025 584.683 335 512.153 335ZM512.153 561.338C458.674 561.338 416.267 518.975 416.267 465.5C416.267 412.1 458.674 369.663 512.153 369.663C565.631 369.663 608.038 412.025 608.038 465.5C608.038 518.975 565.631 561.338 512.153 561.338Z" fill="#0052FF"/>
                </svg>
                Connect with Coinbase Wallet
              </button>
              
              <div className="relative flex items-center py-md">
                <div className="flex-grow border-t border-neutral-light/30"></div>
                <span className="flex-shrink mx-md text-white text-body-sm">or continue with</span>
                <div className="flex-grow border-t border-neutral-light/30"></div>
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
                className="btn-secondary w-full flex items-center justify-center gap-md bg-neutral-dark/50 border border-neutral-light rounded-lg py-2.5 font-medium hover:bg-neutral-dark/70 transition-colors text-white"
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
                className="btn-secondary w-full bg-neutral-dark/50 border border-neutral-light rounded-lg py-2.5 font-medium hover:bg-neutral-dark/70 transition-colors text-white"
                onClick={() => setShowEmailForm(true)}
                disabled={isLoading}
              >
                Sign in with Email
              </button>
            </div>
          )}
        </div>
        
        <p className="text-center text-body-sm text-white/70 mt-lg">
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