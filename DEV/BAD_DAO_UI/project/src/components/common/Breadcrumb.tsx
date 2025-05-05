import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItemProps {
  label: string;
  path: string;
  isLast: boolean;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ label, path, isLast }) => {
  if (isLast) {
    return (
      <span className="text-white font-medium">
        {label}
      </span>
    );
  }
  
  return (
    <>
      <Link 
        to={path} 
        className="text-neutral-400 hover:text-primary transition-colors"
      >
        {label}
      </Link>
      <ChevronRight size={16} className="text-neutral-500" />
    </>
  );
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  
  const breadcrumbItems = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    // Create base items array with Home
    const items = [{ label: 'Home', path: '/' }];
    
    // Build up the breadcrumb based on path segments
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Format the label (capitalize and replace hyphens with spaces)
      let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      
      // Handle special cases
      switch(segment) {
        case 'ai-assistant':
          label = 'Smart Contract AI';
          break;
        case 'project-management':
          label = 'Projects';
          break;
        case 'academy':
          label = 'Academy';
          break;
        case 'dashboard':
          // If preceded by a space ID, this is a space dashboard
          const prevSegment = pathSegments[index - 1];
          if (prevSegment && (prevSegment.match(/^[0-9a-f]{24}$/) || prevSegment.match(/^\d+$/)) && pathSegments[index - 2] === 'spaces') {
            label = 'Space Dashboard';
          }
          break;
      }
      
      // Handle dynamic segments (IDs)
      if (segment.match(/^[0-9a-f]{24}$/) || segment.match(/^\d+$/)) {
        // If it's an ID, use a more descriptive label based on the previous segment
        const prevSegment = pathSegments[index - 1];
        if (prevSegment === 'spaces') label = 'Space Details';
        else if (prevSegment === 'daos') label = 'DAO Details';
        else if (prevSegment === 'projects') label = 'Project Details';
        else if (prevSegment === 'bounties') label = 'Bounty Details';
        else if (prevSegment === 'contributors') label = 'Contributor Profile';
        else if (prevSegment === 'tasks') label = 'Task Details';
        else if (prevSegment === 'proposals') label = 'Proposal Details';
        else if (prevSegment === 'course') label = 'Course Details';
        else label = 'Details';
      }
      
      items.push({ label, path: currentPath });
    });
    
    return items;
  }, [location.pathname]);
  
  // Don't render if we're just at the home page
  if (breadcrumbItems.length <= 1) {
    return null;
  }
  
  return (
    <nav className="mb-6">
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        {breadcrumbItems.map((item, index) => (
          <li key={item.path} className="flex items-center">
            <BreadcrumbItem 
              label={item.label} 
              path={item.path} 
              isLast={index === breadcrumbItems.length - 1} 
            />
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb; 