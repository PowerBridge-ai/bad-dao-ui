import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Footer from './Footer';
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
    const path = location.pathname.split('/')[1];
    switch (path) {
      case 'dashboard':
        return 'Dashboard';
      case 'proposals':
        return location.pathname.includes('/proposals/') ? 'Proposal Details' : 'Proposals';
      case 'treasury':
        return 'Treasury Management';
      case 'smart-contract':
        return 'Smart Contract AI';
      case 'profile':
        return 'My Profile';
      default:
        return 'BAD DAO';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-white">
      <Header 
        title={getPageTitle()}
        onMenuClick={() => setSidebarOpen(true)} 
      />
      
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
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
              className="absolute inset-0 bg-neutral-dark opacity-50" 
              onClick={() => setSidebarOpen(false)}
            />
            <div className={`absolute top-0 left-0 w-64 h-full bg-white transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 p-md md:p-lg">
          <div className="max-w-7xl mx-auto animate-enter">
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