import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Scan, 
  List, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Shield 
} from 'lucide-react';
import { useState } from 'react';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside 
      className={`bg-bg-secondary border-r border-neon-green/10 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-neon-green/10">
        {!collapsed && (
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-neon-green" />
            <span className="ml-2 font-display text-sm font-semibold text-neon-green">DevOpSec</span>
          </div>
        )}
        {collapsed && (
          <Shield className="h-8 w-8 mx-auto text-neon-green" />
        )}
        <button 
          onClick={toggleSidebar} 
          className="p-1 rounded-full text-text-muted hover:text-neon-green transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      <nav className="pt-5">
        <ul className="space-y-2 px-2">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} text="Dashboard" collapsed={collapsed} />
          <NavItem to="/scan" icon={<Scan size={20} />} text="New Scan" collapsed={collapsed} />
          <NavItem to="/results" icon={<List size={20} />} text="Results" collapsed={collapsed} />
          <NavItem to="/admin" icon={<Settings size={20} />} text="Admin" collapsed={collapsed} />
        </ul>
        
        <div className="mt-10 px-4">
          <div className={`bg-bg-tertiary rounded-md p-3 ${collapsed ? 'text-center' : 'text-left'}`}>
            {!collapsed && (
              <>
                <h3 className="text-xs font-semibold text-neon-green flex items-center">
                  <Globe size={12} className="mr-1" /> PLATFORM STATUS
                </h3>
                <div className="mt-2 space-y-2 text-xs">
                  <StatusItem label="GitHub" status="online" />
                  <StatusItem label="Google" status="online" />
                  <StatusItem label="Twitter" status="issues" />
                  <StatusItem label="LinkedIn" status="offline" />
                </div>
              </>
            )}
            {collapsed && (
              <Globe size={20} className="mx-auto text-neon-green" />
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, text, collapsed }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) => 
          `flex items-center p-2 rounded-md transition-all ${
            isActive 
              ? 'bg-neon-green/10 text-neon-green' 
              : 'text-text-muted hover:text-text-primary hover:bg-bg-tertiary'
          } ${collapsed ? 'justify-center' : 'px-4'}`
        }
      >
        <span className="flex-shrink-0">{icon}</span>
        {!collapsed && <span className="ml-3 text-sm">{text}</span>}
      </NavLink>
    </li>
  );
};

interface StatusItemProps {
  label: string;
  status: 'online' | 'offline' | 'issues';
}

const StatusItem: React.FC<StatusItemProps> = ({ label, status }) => {
  const statusColors = {
    online: 'bg-neon-green',
    offline: 'bg-neon-red',
    issues: 'bg-neon-yellow',
  };
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-muted">{label}</span>
      <span className={`w-2 h-2 rounded-full ${statusColors[status]}`}></span>
    </div>
  );
};

export default Sidebar;