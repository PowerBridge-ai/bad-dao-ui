import { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Wallet, 
  Database, 
  User, 
  X, 
  Settings, 
  Compass, 
  Bot,
  KanbanSquare, 
  Users, 
  Award, 
  UserPlus,
  BookOpen
} from 'lucide-react';
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
      name: 'Spaces',
      path: '/spaces',
      icon: <Compass size={20} />,
    },
    {
      name: 'Project Management',
      path: '/project-management',
      icon: <KanbanSquare size={20} />,
    },
    {
      name: 'DAOs & Communities',
      path: '/project-management/daos',
      icon: <Users size={20} />,
    },
    {
      name: 'Contributors',
      path: '/project-management/contributors',
      icon: <UserPlus size={20} />,
    },
    {
      name: 'Bounties',
      path: '/project-management/bounties',
      icon: <Award size={20} />,
    },
    {
      name: 'Academy',
      path: '/academy',
      icon: <BookOpen size={20} />,
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
      path: '/ai-assistant',
      icon: <Bot size={20} />,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <User size={20} />,
    },
    {
      name: 'Admin',
      path: '/admin',
      icon: <Settings size={20} />,
    },
  ], []);

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className="w-64 h-screen bg-neutral-dark border-r border-neutral-dark/30 flex flex-col">
      <div className="p-lg flex items-center justify-between">
        <Logo />
        {onClose && (
          <button
            type="button"
            className="text-white hover:text-primary p-1 rounded-lg"
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
                    : 'text-white hover:bg-neutral-light/10'}
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
      
      <div className="p-lg border-t border-neutral-dark/30">
        <div className="bg-primary/10 rounded-lg p-md">
          <h4 className="text-h4 text-primary font-medium mb-2">Need Help?</h4>
          <p className="text-body text-white/80 mb-md">
            Check our documentation or contact support for assistance.
          </p>
          <a 
            href="https://docs.baddao.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-primary/20 text-primary border border-primary/20 rounded-lg py-2 font-medium hover:bg-primary/30 flex justify-center items-center"
          >
            View Docs
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;