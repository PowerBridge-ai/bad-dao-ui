import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Footer from './Footer';
import Breadcrumb from '../common/Breadcrumb';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 1023px)');

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile, sidebarOpen]);

  // Get page title based on current route
  const getPageTitle = () => {
    const pathParts = location.pathname.split('/');
    const path = pathParts[1];
    
    // Handle special space dashboard case
    if (pathParts.length >= 4 && path === 'spaces' && pathParts[3] === 'dashboard') {
      return 'Space Dashboard';
    }
    
    switch (path) {
      case 'dashboard':
        return 'Dashboard';
      case 'spaces':
        return pathParts.length >= 3 && pathParts[2] === 'my' 
          ? 'My Spaces'
          : 'Spaces Explorer';
      case 'create-space':
        return 'Create Space';
      case 'proposals':
        return location.pathname.includes('/proposals/') ? 'Proposal Details' : 'Proposals';
      case 'treasury':
        return 'Treasury Management';
      case 'smart-contract':
        return 'Smart Contract AI';
      case 'governance':
        return 'Governance';
      case 'dao':
        if (pathParts.length >= 4 && pathParts[3] === 'governance') {
          return pathParts.length >= 6 && pathParts[4] === 'contract' ? 'Edit Contract' : 'Governance';
        }
        return 'DAO Management';
      case 'profile':
        return 'My Profile';
      case 'admin':
        return 'Admin Panel';
      case 'project-management':
        return 'Project Management';
      case 'academy':
        return 'Academy';
      default:
        return 'BAD DAO';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header 
        title={getPageTitle()}
        onMenuClick={() => setSidebarOpen(true)} 
      />
      
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block bg-neutral-dark">
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar */}
        {isMobile && (
          <div 
            className={`fixed inset-0 z-40 transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div 
              className="absolute inset-0 bg-black opacity-50" 
              onClick={() => setSidebarOpen(false)}
            />
            <div className={`absolute top-0 left-0 w-64 h-full bg-neutral-dark transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 p-md md:p-lg">
          <div className="max-w-7xl mx-auto animate-enter">
            <Breadcrumb />
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;