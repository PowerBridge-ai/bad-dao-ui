import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-bg-primary text-text-primary font-body">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
        <footer className="px-6 py-2 bg-bg-secondary border-t border-neon-green/10 text-xs text-text-muted">
          <div className="flex justify-between items-center">
            <span>© 2025 DevOpSec Platform Discovery</span>
            <span>v1.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;