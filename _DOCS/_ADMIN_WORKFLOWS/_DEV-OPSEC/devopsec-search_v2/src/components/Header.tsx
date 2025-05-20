import React from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-neon-green/10 bg-bg-secondary flex items-center justify-between px-6">
      <div className="flex items-center">
        <h1 className="text-xl font-display text-neon-green">Platform Discovery</h1>
        <div className="hidden md:flex items-center ml-8 bg-bg-tertiary rounded-md">
          <Search size={18} className="ml-3 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search platforms..." 
            className="w-64 p-2 bg-transparent text-sm border-none focus:outline-none text-text-primary"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Bell size={20} className="text-text-muted hover:text-neon-green cursor-pointer transition-colors" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-red text-[10px] flex items-center justify-center rounded-full">3</span>
        </div>
        <div className="flex items-center cursor-pointer hover:bg-bg-tertiary p-1 rounded-md transition-colors">
          <div className="w-8 h-8 rounded-full bg-neon-green/10 flex items-center justify-center text-neon-green">
            <User size={16} />
          </div>
          <div className="ml-2 mr-1 hidden md:block">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-text-muted">Administrator</p>
          </div>
          <ChevronDown size={14} className="text-text-muted ml-1 hidden md:block" />
        </div>
      </div>
    </header>
  );
};

export default Header;