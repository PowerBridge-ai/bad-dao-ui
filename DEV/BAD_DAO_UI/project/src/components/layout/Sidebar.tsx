import { useMemo, useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  BookOpen,
  ChevronRight,
  ChevronDown,
  Home,
  PlusCircle,
  Globe,
  Shield
} from 'lucide-react';
import Logo from '../common/Logo';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  
  // Helper to check if a path is active or one of its children is active
  const isActiveOrChildActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  
  // Toggle menu expansion
  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId) 
        : [...prev, menuId]
    );
  };
  
  // Check if in a particular context based on URL
  const isInSpaceContext = useMemo(() => location.pathname.includes('/spaces/'), [location]);
  const isInProjectContext = useMemo(() => location.pathname.includes('/project-management/'), [location]);
  const isInDAOContext = useMemo(() => location.pathname.includes('/dao/'), [location]);
  
  // Auto-expand menus based on current path
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    if (pathSegments.includes('spaces') && pathSegments.length > 1) {
      setExpandedMenus(prev => prev.includes('spaces') ? prev : [...prev, 'spaces']);
    }
    
    if (pathSegments.includes('project-management')) {
      setExpandedMenus(prev => prev.includes('projects') ? prev : [...prev, 'projects']);
    }
    
    if (['proposals', 'treasury', 'ai-assistant', 'governance'].some(p => pathSegments.includes(p))) {
      setExpandedMenus(prev => prev.includes('daos') ? prev : [...prev, 'daos']);
    }
  }, [location]);

  // Core navigation items that are always shown
  const primaryNavItems = useMemo(() => [
    {
      name: 'Profile',
      path: '/profile',
      icon: <User size={20} />,
    },
    {
      name: 'Spaces',
      id: 'spaces',
      path: '/spaces',
      icon: <Compass size={20} />,
      expandable: true,
      children: isInSpaceContext ? [
        {
          name: 'Space Dashboard',
          path: '/spaces/dashboard',
          icon: <LayoutDashboard size={18} />,
        },
        {
          name: 'DAOs',
          id: 'daos',
          path: '/spaces/daos',
          icon: <Users size={18} />,
          expandable: true,
          children: [
            {
              name: 'Proposals',
              path: '/proposals',
              icon: <FileText size={16} />,
            },
            {
              name: 'Treasury',
              path: '/treasury',
              icon: <Wallet size={16} />,
            },
            {
              name: 'Governance',
              path: '/governance',
              icon: <Shield size={16} />,
            },
            {
              name: 'Smart Contract AI',
              path: '/ai-assistant',
              icon: <Bot size={16} />,
            },
          ]
        },
        {
          name: 'Projects',
          id: 'projects',
          path: '/project-management',
          icon: <KanbanSquare size={18} />,
          expandable: true,
          children: [
            {
              name: 'Tasks',
              path: '/project-management/tasks',
              icon: <KanbanSquare size={16} />,
            },
            {
              name: 'Bounties',
              path: '/project-management/bounties',
              icon: <Award size={16} />,
            },
            {
              name: 'Contributors',
              path: '/project-management/contributors',
              icon: <UserPlus size={16} />,
            },
          ]
        }
      ] : []
    },
    {
      name: 'Academy',
      path: '/academy',
      icon: <BookOpen size={20} />,
    },
  ], [isInSpaceContext]);
  
  // Secondary menu items (shown at bottom of sidebar)
  const secondaryNavItems = useMemo(() => [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Home size={20} />,
    },
    {
      name: 'Admin',
      path: '/admin',
      icon: <Settings size={20} />,
    },
  ], []);

  // When not in a specific context, show simplified navigation
  const simplifiedNavItems = useMemo(() => [
    {
      name: 'Explore',
      path: '/spaces',
      icon: <Globe size={20} />,
      isDivider: true,
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <User size={20} />,
    },
    {
      name: 'My Spaces',
      id: 'spaces',
      path: '/spaces/my',
      icon: <Compass size={20} />,
      expandable: true,
      children: [
        {
          name: 'Create Space',
          path: '/create-space',
          icon: <PlusCircle size={16} />,
        },
        {
          name: 'DAOs',
          id: 'daos',
          path: '/spaces/daos',
          icon: <Users size={16} />,
          expandable: true,
          children: [
            {
              name: 'Proposals',
              path: '/proposals',
              icon: <FileText size={14} />,
            },
            {
              name: 'Treasury',
              path: '/treasury',
              icon: <Wallet size={14} />,
            },
            {
              name: 'Governance',
              path: '/governance',
              icon: <Shield size={14} />,
            },
            {
              name: 'Smart Contract AI',
              path: '/ai-assistant',
              icon: <Bot size={14} />,
            },
          ]
        },
        {
          name: 'Projects',
          id: 'projects',
          path: '/project-management',
          icon: <KanbanSquare size={16} />,
          expandable: true,
          children: [
            {
              name: 'Tasks',
              path: '/project-management/tasks',
              icon: <KanbanSquare size={14} />,
            },
            {
              name: 'Bounties',
              path: '/bounties',
              icon: <Award size={14} />,
            },
            {
              name: 'Contributors',
              path: '/project-management/contributors',
              icon: <UserPlus size={14} />,
            },
          ]
        },
      ]
    },
    {
      name: 'Academy',
      path: '/academy',
      icon: <BookOpen size={20} />,
    },
    {
      name: 'Admin',
      path: '/admin',
      icon: <Settings size={20} />,
    },
  ], []);

  // Use the navigation items depending on the context
  const navItems = useMemo(() => {
    // For now, use simplified navigation until we have proper context routing
    return simplifiedNavItems;
    
    // Eventually, this will be the context-aware navigation:
    // if (isInSpaceContext || isInProjectContext || isInDAOContext) {
    //   return primaryNavItems;
    // } else {
    //   return simplifiedNavItems;
    // }
  }, [simplifiedNavItems, isInSpaceContext, isInProjectContext, isInDAOContext]);

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  // Render a nav item and its children if expandable
  const renderNavItem = (item: any, depth = 0) => {
    // If this is a divider item
    if (item.isDivider) {
      return (
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
          <div className="border-t border-neutral-700/50 my-2 mx-3"></div>
        </li>
      );
    }
    
    // Base classes for all nav items
    const baseClasses = `
      flex items-center gap-3 px-3 py-2 rounded-lg text-body font-medium transition-colors
      ${isActiveOrChildActive(item.path) 
        ? 'bg-primary text-white' 
        : 'text-white hover:bg-neutral-light/10'}
    `;
    
    // Extra padding for nested items
    const paddingLeft = depth > 0 ? `pl-${depth * 4 + 3}` : '';

    // If item has no children or is not expandable
    if (!item.expandable || !item.children?.length) {
      return (
        <li key={item.path} className={depth > 0 ? 'ml-3' : ''}>
          <NavLink
            to={item.path}
            className={({ isActive }) => `
              ${baseClasses} ${paddingLeft}
            `}
            onClick={() => handleNavClick(item.path)}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        </li>
      );
    }
    
    // If item is expandable and has children
    const isExpanded = expandedMenus.includes(item.id);
    
    return (
      <li key={item.id || item.path} className={depth > 0 ? 'ml-3' : ''}>
        <button
          className={`${baseClasses} w-full justify-between ${paddingLeft}`}
          onClick={() => toggleMenu(item.id)}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span>{item.name}</span>
          </div>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        
        {/* Children */}
        {isExpanded && (
          <ul className="mt-1 space-y-1">
            {item.children.map((child: any) => renderNavItem(child, depth + 1))}
          </ul>
        )}
      </li>
    );
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
          {navItems.map(item => renderNavItem(item))}
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