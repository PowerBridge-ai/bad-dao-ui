import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Wallet, Bot, User, Settings, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MobileNav = () => {
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
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-neutral-dark border-t border-neutral-dark/30">
      <div className="flex justify-around items-center">
        <NavLink
          to="/dashboard"
          onClick={(e) => handleNavClick(e, '/dashboard')}
          className={({ isActive }) => `
            flex flex-col items-center py-3 px-2 ${isActive ? 'text-primary' : 'text-white hover:text-primary'}
          `}
        >
          <LayoutDashboard size={20} />
          <span className="text-caption mt-1">Dashboard</span>
        </NavLink>
        
        <NavLink
          to="/spaces"
          onClick={(e) => handleNavClick(e, '/spaces')}
          className={({ isActive }) => `
            flex flex-col items-center py-3 px-2 ${isActive ? 'text-primary' : 'text-white hover:text-primary'}
          `}
        >
          <Compass size={20} />
          <span className="text-caption mt-1">Spaces</span>
        </NavLink>
        
        <NavLink
          to="/proposals"
          onClick={(e) => handleNavClick(e, '/proposals')}
          className={({ isActive }) => `
            flex flex-col items-center py-3 px-2 ${isActive ? 'text-primary' : 'text-white hover:text-primary'}
          `}
        >
          <FileText size={20} />
          <span className="text-caption mt-1">Proposals</span>
        </NavLink>
        
        <NavLink
          to="/treasury"
          onClick={(e) => handleNavClick(e, '/treasury')}
          className={({ isActive }) => `
            flex flex-col items-center py-3 px-2 ${isActive ? 'text-primary' : 'text-white hover:text-primary'}
          `}
        >
          <Wallet size={20} />
          <span className="text-caption mt-1">Treasury</span>
        </NavLink>
        
        <NavLink
          to="/ai-assistant"
          onClick={(e) => handleNavClick(e, '/ai-assistant')}
          className={({ isActive }) => `
            flex flex-col items-center py-3 px-2 ${isActive ? 'text-primary' : 'text-white hover:text-primary'}
          `}
        >
          <Bot size={20} />
          <span className="text-caption mt-1">AI</span>
        </NavLink>
        
        <NavLink
          to="/profile"
          onClick={(e) => handleNavClick(e, '/profile')}
          className={({ isActive }) => `
            flex flex-col items-center py-3 px-2 ${isActive ? 'text-primary' : 'text-white hover:text-primary'}
          `}
        >
          <User size={20} />
          <span className="text-caption mt-1">Profile</span>
        </NavLink>
        
        <NavLink
          to="/admin"
          onClick={(e) => handleNavClick(e, '/admin')}
          className={({ isActive }) => `
            flex flex-col items-center py-3 px-2 ${isActive ? 'text-primary' : 'text-white hover:text-primary'}
          `}
        >
          <Settings size={20} />
          <span className="text-caption mt-1">Admin</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default MobileNav;