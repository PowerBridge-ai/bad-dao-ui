import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Float, 
  Text3D, 
  MeshDistortMaterial, 
  Environment, 
  ContactShadows,
  Html
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import dbService, { Space } from '../services/database';

// Define step types
type OnboardingStep = 'welcome' | 'name' | 'description' | 'category' | 'visibility' | 'summary';

// Simple AI assistant animation
const AIAssistant = ({ position = [0, 0, 0], text }: { position?: [number, number, number], text: string }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
      mesh.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.1 + position[1];
    }
  });
  
  return (
    <group position={position}>
      {/* AI Assistant "head" */}
      <mesh ref={mesh}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <MeshDistortMaterial 
          color="#1AB759" 
          speed={2} 
          distort={0.3} 
          radius={1} 
        />
      </mesh>
      
      {/* Speech bubble */}
      <Html position={[1.2, 0.4, 0]} transform>
        <div className="bg-neutral-dark p-4 rounded-xl w-64 border border-primary shadow-lg">
          <p className="text-white text-sm">{text}</p>
        </div>
      </Html>
    </group>
  );
};

// Floating 3D text with distortion effect
const FloatingTitle = ({ text, position = [0, 3, 0], color = "#1AB759" }: { text: string, position?: [number, number, number], color?: string }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
      mesh.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1 + position[1];
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text3D
        ref={mesh}
        font="/fonts/Inter_Bold.json"
        position={new THREE.Vector3(...position)}
        scale={0.5}
        letterSpacing={0.05}
      >
        {text}
        <MeshDistortMaterial 
          color={color} 
          speed={1.5} 
          distort={0.2} 
          envMapIntensity={1} 
        />
      </Text3D>
    </Float>
  );
};

// Interactive hovering space model
const SpaceModel = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const mesh = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.005;
      mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    }
  });
  
  return (
    <group 
      ref={mesh}
      position={new THREE.Vector3(...position)}
      rotation={new THREE.Euler(...rotation)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      {/* Core center sphere */}
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial 
          color="#1AB759" 
          emissive="#1AB759"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Orbiting spheres */}
      {[1, 2, 3].map((i) => (
        <mesh key={i} position={[
          Math.sin(i * (Math.PI * 2 / 3)) * 1.2,
          Math.cos(i * (Math.PI * 2 / 3)) * 0.2,
          Math.cos(i * (Math.PI * 2 / 3)) * 1.2
        ]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      
      {/* Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.02, 16, 100]} />
        <meshStandardMaterial 
          color="#1AB759"
          transparent={true}
          opacity={0.7}
        />
      </mesh>
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[1.4, 0.02, 16, 100]} />
        <meshStandardMaterial 
          color="#ffffff"
          transparent={true}
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

// Animated geometric shapes in background
const AnimatedBackgroundShapes = () => {
  const shapes = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (shapes.current) {
      shapes.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      shapes.current.rotation.x = state.clock.getElapsedTime() * 0.01;
    }
  });
  
  return (
    <group ref={shapes}>
      {Array.from({ length: 20 }).map((_, i) => {
        const position: [number, number, number] = [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        ];
        const rotation: [number, number, number] = [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ];
        const size = Math.random() * 0.3 + 0.1;
        
        // Randomly choose shape type
        const shapeType = Math.floor(Math.random() * 3);
        
        return (
          <mesh key={i} position={position} rotation={rotation}>
            {shapeType === 0 && <boxGeometry args={[size, size, size]} />}
            {shapeType === 1 && <octahedronGeometry args={[size, 0]} />}
            {shapeType === 2 && <dodecahedronGeometry args={[size, 0]} />}
            <meshStandardMaterial 
              color="#1AB759" 
              transparent
              opacity={0.2}
              envMapIntensity={1}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Main 3D scene
const Scene = ({ step, assistantMessage }: { step: OnboardingStep, assistantMessage: string }) => {
  const { camera } = useThree();
  
  // Position camera based on step
  useEffect(() => {
    switch(step) {
      case 'welcome':
        camera.position.set(0, 0, 5);
        break;
      case 'name':
        camera.position.set(-3, 0, 5);
        break;
      case 'description':
        camera.position.set(3, 0, 5);
        break;
      default:
        camera.position.set(0, 0, 5);
    }
  }, [step, camera]);
  
  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <FloatingTitle 
        text={step === 'welcome' ? "Create Your Space" : 
             step === 'name' ? "Name Your Space" :
             step === 'description' ? "Describe Your Vision" :
             step === 'category' ? "Choose Categories" :
             step === 'visibility' ? "Set Visibility" : "Ready to Launch"}
        position={[-2, 2, 0]}
      />
      
      <SpaceModel position={[0, 0, 0]} />
      
      <AIAssistant 
        position={[-2.5, -1.5, 0]} 
        text={assistantMessage}
      />
      
      <AnimatedBackgroundShapes />
      
      <Environment preset="city" />
      <ContactShadows 
        position={[0, -2, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={1.5} 
      />
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        rotateSpeed={0.1}
        dampingFactor={0.7}
        enableDamping={true}
      />
    </>
  );
};

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
        setCurrentStep('name');
        break;
      case 'name':
        setCurrentStep('description');
        break;
      case 'description':
        setCurrentStep('category');
        break;
      case 'category':
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
        navigate('/spaces');
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
  
  return (
    <div className="w-full h-screen flex flex-col relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Suspense fallback={null}>
            <Scene 
              step={currentStep}
              assistantMessage={getAssistantMessage()}
            />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Overlay Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="bg-neutral-dark/80 backdrop-blur-xl rounded-xl p-8 w-full max-w-2xl shadow-xl border border-primary/30"
          >
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateSpace;