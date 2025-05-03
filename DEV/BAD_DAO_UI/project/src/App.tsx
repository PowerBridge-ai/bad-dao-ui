import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Layout from './components/layout/Layout';
import PublicHeader from './components/layout/PublicHeader';

// Pages
import Dashboard from './pages/Dashboard';
import Proposals from './pages/Proposals';
import ProposalDetail from './pages/ProposalDetail';
import Treasury from './pages/Treasury';
import SmartContractAI from './pages/SmartContractAI';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Auth Components
import AuthGuard from './components/auth/AuthGuard';
import ConnectWallet from './pages/ConnectWallet';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-dark">
        <div className="w-16 h-16 border-4 border-primary-light rounded-full border-t-primary animate-spin"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <PublicHeader />
        <div className="pt-16"> {/* Add padding to account for fixed header */}
          <Routes>
            <Route path="/connect" element={<ConnectWallet />} />
            
            <Route element={<AuthGuard><Layout /></AuthGuard>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/proposals" element={<Proposals />} />
              <Route path="/proposals/:id" element={<ProposalDetail />} />
              <Route path="/treasury" element={<Treasury />} />
              <Route path="/smart-contract" element={<SmartContractAI />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;