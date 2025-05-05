import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Proposals from './pages/Proposals';
import ProposalDetail from './pages/ProposalDetail';
import Treasury from './pages/Treasury';
import AiAssistant from './pages/AiAssistant';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import Spaces from './pages/Spaces';
import SpaceDetail from './pages/SpaceDetail';
import SpaceDashboard from './pages/SpaceDashboard';
import CreateSpace from './pages/CreateSpace';
import ProjectManagementPage from './pages/ProjectManagementPage';
import ContributorProfilePage from './pages/ContributorProfilePage';
import AcademyPage from './pages/AcademyPage';
import BountyPage from './pages/BountyPage';
import BountyDetailPage from './pages/BountyDetailPage';
import CreateBountyPage from './pages/CreateBountyPage';
import SpacesExplorer from './pages/SpacesExplorer';
import MySpaces from './pages/MySpaces';
import Governance from './pages/Governance';
import ContractEdit from './pages/ContractEdit';

// Auth Components
import AuthGuard from './components/auth/AuthGuard';
import ConnectWallet from './pages/ConnectWallet';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import CourseViewer from './components/academy/CourseViewer';

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
        <Routes>
          <Route path="/connect" element={<ConnectWallet />} />
          
          <Route element={<AuthGuard><Layout /></AuthGuard>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/proposals" element={<Proposals />} />
            <Route path="/proposals/:id" element={<ProposalDetail />} />
            <Route path="/treasury" element={<Treasury />} />
            <Route path="/ai-assistant" element={<AiAssistant />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/spaces" element={<SpacesExplorer />} />
            <Route path="/spaces/my" element={<MySpaces />} />
            <Route path="/spaces/:id" element={<SpaceDetail />} />
            <Route path="/spaces/:id/dashboard" element={<SpaceDashboard />} />
            <Route path="/create-space" element={<CreateSpace />} />
            
            {/* Project Management Routes */}
            <Route path="/project-management" element={<ProjectManagementPage />} />
            <Route path="/project-management/tasks" element={<ProjectManagementPage />} />
            <Route path="/project-management/tasks/:id" element={<ProjectManagementPage />} />
            <Route path="/project-management/contributors" element={<ProjectManagementPage />} />
            <Route path="/project-management/contributors/:id" element={<ContributorProfilePage />} />
            
            {/* DAO Routes */}
            <Route path="/spaces/daos" element={<Spaces />} />
            
            {/* Governance Routes */}
            <Route path="/governance" element={<Governance />} />
            <Route path="/dao/:daoId/governance" element={<Governance />} />
            <Route path="/dao/:daoId/governance/contract/:contractId" element={<ContractEdit />} />
            
            {/* Bounty Routes */}
            <Route path="/bounties" element={<BountyPage />} />
            <Route path="/bounties/create" element={<CreateBountyPage />} />
            <Route path="/bounties/:id" element={<BountyDetailPage />} />
            
            {/* Academy Routes */}
            <Route path="/academy" element={<AcademyPage />} />
            <Route path="/academy/path/:id" element={<AcademyPage />} />
            <Route path="/academy/course/:id" element={<CourseViewer />} />
            <Route path="/academy/badge/:id" element={<AcademyPage />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;