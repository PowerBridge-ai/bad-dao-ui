import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import dbService, { Space } from '../services/database';
import { ArrowLeft, ArrowRight, Check, Info } from 'lucide-react';

// Define step types
type OnboardingStep = 'welcome' | 'name' | 'description' | 'category' | 'visibility' | 'summary';

// Main component
const CreateSpace = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [userName, setUserName] = useState('');
  const [spaceName, setSpaceName] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize database on component mount
  useEffect(() => {
    const initDb = async () => {
      try {
        await dbService.initDatabase();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    
    initDb();
  }, []);
  
  // Dynamic assistant messages based on current step
  const getAssistantMessage = () => {
    switch(currentStep) {
      case 'welcome':
        return userName ? 
          `Hey ${userName}! Ready to create your own community space? Let's build something amazing together!` : 
          "Welcome! I'm your AI assistant. What should I call you?";
      case 'name':
        return "Choose a memorable name for your space. This will be the first thing people see!";
      case 'description':
        return "Great name! Now, tell everyone what your space is about. Be descriptive and passionate!";
      case 'category':
        return "Let's categorize your space so others can find it. Choose categories that best represent your community.";
      case 'visibility':
        return "Almost done! Decide if your space should be public for everyone, or private for invited members only.";
      case 'summary':
        return `Awesome job, ${userName}! Your space "${spaceName}" is ready to launch. Let's make it live!`;
      default:
        return "Let's create something amazing together!";
    }
  };
  
  // Handle step navigation
  const nextStep = () => {
    switch(currentStep) {
      case 'welcome':
        if (!userName.trim()) {
          setError("Please enter your name to continue");
          return;
        }
        setCurrentStep('name');
        break;
      case 'name':
        if (!spaceName.trim()) {
          setError("Please enter a name for your space");
          return;
        }
        setCurrentStep('description');
        break;
      case 'description':
        if (!spaceDescription.trim()) {
          setError("Please enter a description for your space");
          return;
        }
        setCurrentStep('category');
        break;
      case 'category':
        if (selectedCategories.length === 0) {
          setError("Please select at least one category");
          return;
        }
        setCurrentStep('visibility');
        break;
      case 'visibility':
        setCurrentStep('summary');
        break;
      case 'summary':
        // Complete space creation by saving to database
        createNewSpace();
        break;
    }
    
    // Clear any error when successfully moving to next step
    setError(null);
  };
  
  const prevStep = () => {
    switch(currentStep) {
      case 'name':
        setCurrentStep('welcome');
        break;
      case 'description':
        setCurrentStep('name');
        break;
      case 'category':
        setCurrentStep('description');
        break;
      case 'visibility':
        setCurrentStep('category');
        break;
      case 'summary':
        setCurrentStep('visibility');
        break;
    }
    
    // Clear any error when navigating back
    setError(null);
  };
  
  // Category options
  const categories = [
    { id: 'defi', name: 'DeFi' },
    { id: 'nft', name: 'NFT' },
    { id: 'dao', name: 'DAO' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'metaverse', name: 'Metaverse' },
    { id: 'social', name: 'Social' }
  ];
  
  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };
  
  // Function to create a new space in the database
  const createNewSpace = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create space object
      const newSpace: Space = {
        name: spaceName,
        creator: userName,
        description: spaceDescription,
        categories: selectedCategories,
        isPublic: isPublic,
        logo: `/mock/${spaceName.toLowerCase().replace(/\s+/g, '-')}-logo.png`, // Placeholder logo
      };
      
      // Save to database
      const result = await dbService.createSpace(newSpace);
      
      if (result) {
        // Success - navigate to spaces list
        navigate('/spaces/my');
      } else {
        // Something went wrong
        setError('Failed to create space. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error creating space:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Get the button text for the current step
  const getNextButtonText = () => {
    if (currentStep === 'summary') return "Create Space";
    return "Next";
  };
  
  return (
    <div className="w-full min-h-screen py-16 flex flex-col relative">
      <div className="flex-1 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-neutral-dark rounded-xl p-8 w-full max-w-2xl shadow-xl border border-neutral-dark/80"
          >
            {/* Step indicator */}
            <div className="flex justify-between mb-8">
              {['welcome', 'name', 'description', 'category', 'visibility', 'summary'].map((step, index) => (
                <div 
                  key={step} 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step ? 'bg-primary text-white' : 
                    index <= ['welcome', 'name', 'description', 'category', 'visibility', 'summary'].indexOf(currentStep) 
                      ? 'bg-primary/30 text-primary' 
                      : 'bg-neutral-dark/50 text-neutral-light border border-neutral-light/30'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 flex items-center">
                <Info size={18} className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Step content */}
            {currentStep === 'welcome' && (
              <div className="space-y-6">
                <h2 className="text-h2 text-white text-center">Welcome to Space Creation</h2>
                <p className="text-neutral-light text-center">Let's create your DAO community space together</p>
                <div className="space-y-4">
                  <label className="block text-white text-lg mb-2">What's your name?</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-dark/70 border border-neutral-light/30 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    autoFocus
                  />
                </div>
                <div className="tooltip bg-primary/10 text-primary p-3 rounded-lg">
                  <p className="text-sm">Tip: Your name will be used to personalize your experience</p>
                </div>
              </div>
            )}
            
            {currentStep === 'name' && (
              <div className="space-y-6">
                <h2 className="text-h2 text-white text-center">Name Your Space</h2>
                <p className="text-neutral-light text-center">Choose a memorable name that reflects your community</p>
                <div className="space-y-4">
                  <label className="block text-white text-lg mb-2">Space Name</label>
                  <input
                    type="text"
                    value={spaceName}
                    onChange={(e) => setSpaceName(e.target.value)}
                    placeholder="Enter space name"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-dark/70 border border-neutral-light/30 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    autoFocus
                  />
                </div>
                <div className="tooltip bg-primary/10 text-primary p-3 rounded-lg">
                  <p className="text-sm">Tip: Keep it short, unique, and easy to remember</p>
                </div>
              </div>
            )}
            
            {currentStep === 'description' && (
              <div className="space-y-6">
                <h2 className="text-h2 text-white text-center">Describe Your Space</h2>
                <p className="text-neutral-light text-center">Tell everyone what your space is about</p>
                <div className="space-y-4">
                  <label className="block text-white text-lg mb-2">Description</label>
                  <textarea
                    value={spaceDescription}
                    onChange={(e) => setSpaceDescription(e.target.value)}
                    placeholder="What is your community all about?"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-dark/70 border border-neutral-light/30 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-32 resize-none"
                    autoFocus
                  />
                </div>
                <div className="tooltip bg-primary/10 text-primary p-3 rounded-lg">
                  <p className="text-sm">Tip: Be specific about your community's purpose, values, and goals</p>
                </div>
              </div>
            )}
            
            {currentStep === 'category' && (
              <div className="space-y-6">
                <h2 className="text-h2 text-white text-center">Choose Categories</h2>
                <p className="text-neutral-light text-center">Select categories that represent your space</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedCategories.includes(category.id)
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'bg-neutral-dark/50 border-neutral-light/30 text-white hover:bg-neutral-dark/70'
                        }`}
                        onClick={() => toggleCategory(category.id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="tooltip bg-primary/10 text-primary p-3 rounded-lg">
                  <p className="text-sm">Tip: Choose up to 3 categories that best describe your space</p>
                </div>
              </div>
            )}
            
            {currentStep === 'visibility' && (
              <div className="space-y-6">
                <h2 className="text-h2 text-white text-center">Space Visibility</h2>
                <p className="text-neutral-light text-center">Choose who can see your space</p>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <button
                      className={`flex-1 p-4 rounded-lg border transition-all flex flex-col items-center ${
                        isPublic
                          ? 'bg-primary/20 border-primary text-primary'
                          : 'bg-neutral-dark/50 border-neutral-light/30 text-white hover:bg-neutral-dark/70'
                      }`}
                      onClick={() => setIsPublic(true)}
                    >
                      <span className="text-lg font-semibold">Public</span>
                      <span className="text-sm mt-2">Anyone can find and join</span>
                    </button>
                    <button
                      className={`flex-1 p-4 rounded-lg border transition-all flex flex-col items-center ${
                        !isPublic
                          ? 'bg-primary/20 border-primary text-primary'
                          : 'bg-neutral-dark/50 border-neutral-light/30 text-white hover:bg-neutral-dark/70'
                      }`}
                      onClick={() => setIsPublic(false)}
                    >
                      <span className="text-lg font-semibold">Private</span>
                      <span className="text-sm mt-2">By invitation only</span>
                    </button>
                  </div>
                </div>
                <div className="tooltip bg-primary/10 text-primary p-3 rounded-lg">
                  <p className="text-sm">Tip: Public spaces get more visibility, but private spaces offer more control</p>
                </div>
              </div>
            )}

            {currentStep === 'summary' && (
              <div className="space-y-6">
                <h2 className="text-h2 text-white text-center">Ready to Launch</h2>
                <p className="text-neutral-light text-center">Review your space details before creation</p>
                <div className="bg-neutral-darker rounded-lg p-4 space-y-4">
                  <div>
                    <h3 className="text-white font-medium">Space Name</h3>
                    <p className="text-neutral-light">{spaceName}</p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Description</h3>
                    <p className="text-neutral-light">{spaceDescription}</p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Categories</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedCategories.map(catId => (
                        <span key={catId} className="bg-primary/20 text-primary px-2 py-1 rounded-full text-sm">
                          {categories.find(c => c.id === catId)?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Visibility</h3>
                    <p className="text-neutral-light">{isPublic ? 'Public' : 'Private'}</p>
                  </div>
                </div>
                <div className="tooltip bg-primary/10 text-primary p-3 rounded-lg">
                  <p className="text-sm">Tip: You can customize your space further after creation</p>
                </div>
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              {currentStep !== 'welcome' && (
                <button
                  className="px-6 py-3 rounded-lg bg-neutral-dark/50 text-white border border-neutral-light/30 hover:bg-neutral-dark/70 transition-colors flex items-center"
                  onClick={prevStep}
                  disabled={isLoading}
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Back
                </button>
              )}
              {currentStep === 'welcome' && <div></div>} {/* Empty div to maintain flex layout */}
              
              <button
                className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors flex items-center"
                onClick={nextStep}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    {getNextButtonText()}
                    {currentStep === 'summary' ? (
                      <Check size={18} className="ml-2" />
                    ) : (
                      <ArrowRight size={18} className="ml-2" />
                    )}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateSpace;