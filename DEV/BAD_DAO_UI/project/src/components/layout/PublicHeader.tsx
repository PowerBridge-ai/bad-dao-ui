import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Wallet, Database, User } from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

const PublicHeader = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/connect');
    } else {
      navigate(path);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-md py-3 flex items-center justify-between">
        <Logo />
        
        <nav className="hidden md:flex items-center space-x-md">
          <NavLink
            to="/dashboard"
            onClick={(e) => handleNavClick(e, '/dashboard')}
            className={({ isActive }) => `
              flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
              ${isActive ? 'text-primary bg-primary/10' : 'text-white hover:text-primary'}
            `}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink
            to="/proposals"
            onClick={(e) => handleNavClick(e, '/proposals')}
            className={({ isActive }) => `
              flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
              ${isActive ? 'text-primary bg-primary/10' : 'text-white hover:text-primary'}
            `}
          >
            <FileText size={20} />
            <span>Proposals</span>
          </NavLink>
          
          <NavLink
            to="/treasury"
            onClick={(e) => handleNavClick(e, '/treasury')}
            className={({ isActive }) => `
              flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
              ${isActive ? 'text-primary bg-primary/10' : 'text-white hover:text-primary'}
            `}
          >
            <Wallet size={20} />
            <span>Treasury</span>
          </NavLink>
          
          <NavLink
            to="/smart-contract"
            onClick={(e) => handleNavClick(e, '/smart-contract')}
            className={({ isActive }) => `
              flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
              ${isActive ? 'text-primary bg-primary/10' : 'text-white hover:text-primary'}
            `}
          >
            <Database size={20} />
            <span>Smart Contract AI</span>
          </NavLink>
          
          <NavLink
            to="/profile"
            onClick={(e) => handleNavClick(e, '/profile')}
            className={({ isActive }) => `
              flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
              ${isActive ? 'text-primary bg-primary/10' : 'text-white hover:text-primary'}
            `}
          >
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default PublicHeader;