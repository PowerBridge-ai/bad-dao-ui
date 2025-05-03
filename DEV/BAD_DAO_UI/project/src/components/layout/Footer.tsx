import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-neutral-light py-md">
      <div className="max-w-7xl mx-auto px-md flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-md md:mb-0">
          <p className="text-body-sm text-neutral-medium">
            &copy; {currentYear} BAD DAO. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center space-x-md">
          <a 
            href="https://github.com/baddao" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-body-sm text-neutral-medium hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <a 
            href="https://docs.baddao.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-body-sm text-neutral-medium hover:text-primary transition-colors"
          >
            Documentation
          </a>
          <a 
            href="https://discord.gg/baddao" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-body-sm text-neutral-medium hover:text-primary transition-colors"
          >
            Discord
          </a>
          <a 
            href="https://twitter.com/baddao" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-body-sm text-neutral-medium hover:text-primary transition-colors"
          >
            Twitter
          </a>
        </div>
        
        <div className="hidden md:flex items-center space-x-xs mt-md md:mt-0">
          <span className="text-body-sm text-neutral-medium">Made with</span>
          <Heart size={12} className="text-accent-red" />
          <span className="text-body-sm text-neutral-medium">by the BAD DAO team</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;