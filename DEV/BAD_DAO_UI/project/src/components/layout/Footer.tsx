import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-dark border-t border-neutral-dark/30 py-md">
      <div className="max-w-7xl mx-auto px-md flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-md md:mb-0">
          <p className="text-body-sm text-neutral-light/70">
            &copy; {currentYear} BAD DAO. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center space-x-md">
          <a 
            href="https://github.com/baddao" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-body-sm text-neutral-light/70 hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <a 
            href="https://docs.baddao.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-body-sm text-neutral-light/70 hover:text-primary transition-colors"
          >
            Documentation
          </a>
          <a 
            href="https://discord.gg/baddao" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-body-sm text-neutral-light/70 hover:text-primary transition-colors"
          >
            Discord
          </a>
          <a 
            href="https://twitter.com/baddao" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-body-sm text-neutral-light/70 hover:text-primary transition-colors"
          >
            Twitter
          </a>
        </div>
        
        <div className="hidden md:flex items-center space-x-xs mt-md md:mt-0">
          <span className="text-body-sm text-neutral-light/70">Made with</span>
          <Heart size={12} className="text-accent-red" />
          <span className="text-body-sm text-neutral-light/70">by the BAD DAO team</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;