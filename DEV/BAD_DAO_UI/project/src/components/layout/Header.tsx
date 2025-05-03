import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Sun, Moon, ChevronDown } from 'lucide-react';
import { useThirdwebWallet } from '../../hooks/useThirdwebWallet';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { truncateAddress } from '../../utils/address';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

const Header = ({ title, onMenuClick }: HeaderProps) => {
  const { disconnect, address } = useThirdwebWallet();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await disconnect();
    logout();
    navigate('/connect');
  };

  return (
    <header className="bg-white border-b border-neutral-light sticky top-0 z-30 transition-shadow">
      <div className="max-w-7xl mx-auto px-md py-3 flex items-center justify-between">
        <div className="flex items-center gap-md">
          <button 
            type="button"
            className="lg:hidden text-neutral-dark hover:text-primary p-2 rounded-lg"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          
          <h1 className="text-h3 lg:text-h2 font-bold">{title}</h1>
        </div>
        
        <div className="flex items-center gap-md">
          <button
            type="button"
            className="text-neutral-dark hover:text-primary p-2 rounded-lg relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full"></span>
          </button>
          
          <button
            type="button"
            className="text-neutral-dark hover:text-primary p-2 rounded-lg hidden md:flex"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-sm font-medium hover:bg-neutral-light/30 py-2 px-3 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                {user?.displayName?.charAt(0) || 'U'}
              </div>
              <span className="hidden md:block">
                {user?.displayName || truncateAddress(address || '')}
              </span>
              <ChevronDown size={16} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-dropdown py-1 animate-enter">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-body hover:bg-neutral-light/30"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-body text-accent-red hover:bg-neutral-light/30"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;