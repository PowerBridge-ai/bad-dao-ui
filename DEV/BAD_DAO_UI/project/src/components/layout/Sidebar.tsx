import { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Wallet, Database, User, X } from 'lucide-react';
import Logo from '../common/Logo';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const navigate = useNavigate();

  const navItems = useMemo(() => [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Proposals',
      path: '/proposals',
      icon: <FileText size={20} />,
    },
    {
      name: 'Treasury',
      path: '/treasury',
      icon: <Wallet size={20} />,
    },
    {
      name: 'Smart Contract AI',
      path: '/smart-contract',
      icon: <Database size={20} />,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <User size={20} />,
    },
  ], []);

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-neutral-light flex flex-col">
      <div className="p-lg flex items-center justify-between">
        <Logo />
        {onClose && (
          <button
            type="button"
            className="text-neutral-dark hover:text-primary p-1 rounded-lg"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto py-md">
        <ul className="space-y-1 px-md">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded-lg text-body font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary text-white' 
                    : 'text-neutral-dark hover:bg-neutral-light/30'}
                `}
                onClick={() => handleNavClick(item.path)}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-lg border-t border-neutral-light">
        <div className="bg-primary/5 rounded-lg p-md">
          <h4 className="text-h4 text-primary font-medium mb-2">Need Help?</h4>
          <p className="text-body text-neutral-dark mb-md">
            Check our documentation or contact support for assistance.
          </p>
          <a 
            href="https://docs.baddao.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-secondary w-full bg-white text-primary border border-primary/20 rounded-lg py-2 font-medium hover:bg-primary/5 flex justify-center items-center"
          >
            View Docs
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;