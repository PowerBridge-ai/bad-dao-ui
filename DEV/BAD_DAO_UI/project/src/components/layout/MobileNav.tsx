import { NavLink, useNavigate } from 'react-router-dom';
import { User, Compass, BookOpen, LayoutDashboard, Globe, Users } from 'lucide-react';
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

  // Primary mobile navigation items based on new structure
  const mobileNavItems = [
    {
      name: 'Explore',
      path: '/spaces',
      icon: <Globe size={20} />
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />
    },
    {
      name: 'My Spaces',
      path: '/spaces/my',
      icon: <Compass size={20} />
    },
    {
      name: 'DAOs',
      path: '/spaces/daos',
      icon: <Users size={20} />
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <User size={20} />
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-neutral-dark border-t border-neutral-dark/30">
      <div className="flex justify-around items-center">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.path + item.name} // Add name to key since Explore and My Spaces share the same path
            to={item.path}
            onClick={(e) => handleNavClick(e, item.path)}
            className={({ isActive }) => `
              flex flex-col items-center py-3 px-2 ${isActive ? 'text-primary' : 'text-white hover:text-primary'}
            `}
          >
            {item.icon}
            <span className="text-caption mt-1">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;