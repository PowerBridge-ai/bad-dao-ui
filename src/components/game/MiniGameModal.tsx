import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Award, ChevronRight, BarChart2, Users, Circle } from 'lucide-react';
import { useGameState, MiniGame } from '../../context/GameContext';
import Button from '../common/Button';

interface MiniGameModalProps {
  miniGame: MiniGame;
  onClose: () => void;
}

const MiniGameModal: React.FC<MiniGameModalProps> = ({ miniGame, onClose }) => {
  const { completeMiniGame } = useGameState();
  const [step, setStep] = useState<'intro' | 'game' | 'results'>('intro');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [completionResults, setCompletionResults] = useState<{
    teamResourceGain: number;
    teamValueGains: { [key: string]: number };
  } | null>(null);
  
  // Handle mini-game completion
  const handleComplete = () => {
    // Calculate results based on mini-game type and selected options
    const results = calculateResults();
    setCompletionResults(results);
    completeMiniGame(results);
    setStep('results');
  };
  
  // Calculate mini-game results based on game type and selected options
  const calculateResults = () => {
    let teamResourceGain = 0;
    let teamValueGains: { [key: string]: number } = {};
    
    switch (miniGame.type) {
      case 'value-alignment':
        teamResourceGain = 500;
        teamValueGains = {
          innovation: 5,
          integrity: 5,
          collaboration: 15
        };
        break;
      case 'resource-allocation':
        teamResourceGain = 800;
        teamValueGains = {
          excellence: 10,
          userFocus: 5,
          integrity: 10
        };
        break;
      case 'crisis-response':
        teamResourceGain = 1000;
        teamValueGains = {
          excellence: 15,
          collaboration: 10,
          integrity: 5
        };
        break;
      case 'innovation':
        teamResourceGain = 700;
        teamValueGains = {
          innovation: 20,
          userFocus: 10,
          collaboration: 5
        };
        break;
      case 'communication':
        teamResourceGain = 600;
        teamValueGains = {
          collaboration: 15,
          integrity: 10,
          excellence: 5
        };
        break;
      default:
        teamResourceGain = 500;
        teamValueGains = {
          collaboration: 10,
          integrity: 5,
          innovation: 5
        };
    }
    
    return { teamResourceGain, teamValueGains };
  };
  
  // Handle option selection in mini-games
  const handleOptionSelect = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };
  
  // Render mini-game content based on type
  const renderGameContent = () => {
    switch (miniGame.type) {
      case 'value-alignment':
        return (
          <div className="space-y-6">
            <p className="text-gray-300">
              Drag and drop the organizational values in order of priority for your team.
              Consider how these values guide your team's daily decisions and communication.
            </p>
            
            <div className="space-y-3">
              {['innovation', 'integrity', 'collaboration', 'excellence', 'userFocus'].map((value, index) => (
                <div 
                  key={value}
                  className="p-3 bg-gray-700 rounded-lg flex items-center cursor-pointer hover:bg-gray-600 transition"
                  onClick={() => handleOptionSelect(value)}
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                      ${selectedOptions.includes(value) ? 'bg-blue-500' : 'bg-gray-600'}`}
                  >
                    {selectedOptions.indexOf(value) > -1 ? (
                      <span className="text-sm font-medium">{selectedOptions.indexOf(value) + 1}</span>
                    ) : (
                      <Circle size={16} className="text-gray-400" />
                    )}
                  </div>
                  <div className="text-white capitalize">{value === 'userFocus' ? 'User Focus' : value}</div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="primary" 
              fullWidth 
              onClick={handleComplete}
              disabled={selectedOptions.length < 5}
            >
              Submit Team Ranking
            </Button>
          </div>
        );
        
      case 'resource-allocation':
        return (
          <div className="space-y-6">
            <p className="text-gray-300">
              Decide how to allocate your limited resources across different projects. 
              Balance short-term gains with long-term strategic investments.
            </p>
            
            <div className="space-y-3">
              {[
                { id: 'project1', name: 'Internal Tools', description: 'Improve team productivity' },
                { id: 'project2', name: 'Customer Features', description: 'Direct user value' },
                { id: 'project3', name: 'Infrastructure', description: 'Long-term foundation' },
                { id: 'project4', name: 'Innovation Research', description: 'Future opportunities' }
              ].map(project => (
                <div key={project.id} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium text-white">{project.name}</h4>
                      <p className="text-sm text-gray-400">{project.description}</p>
                    </div>
                    <div className="text-blue-300 font-medium">
                      {selectedOptions.includes(project.id) ? '✓ Selected' : ''}
                    </div>
                  </div>
                  
                  <Button 
                    variant={selectedOptions.includes(project.id) ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => handleOptionSelect(project.id)}
                    className="w-full"
                  >
                    {selectedOptions.includes(project.id) ? 'Unselect' : 'Select'}
                  </Button>
                </div>
              ))}
            </div>
            
            <Button 
              variant="primary" 
              fullWidth 
              onClick={handleComplete}
              disabled={selectedOptions.length < 2}
            >
              Allocate Resources
            </Button>
          </div>
        );
        
      case 'crisis-response':
        return (
          <div className="space-y-6">
            <p className="text-gray-300">
              Your team must respond to a sudden project crisis. Select the actions 
              you would take to address the situation most effectively.
            </p>
            
            <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg mb-6">
              <h4 className="text-lg font-medium text-red-300 mb-1">Crisis Alert</h4>
              <p className="text-gray-300">
                A critical security vulnerability has been discovered in your system. 
                Customers are at risk, and you have limited time to respond.
              </p>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 'action1', text: 'Immediately notify all customers' },
                { id: 'action2', text: 'Deploy temporary fix while developing complete solution' },
                { id: 'action3', text: 'Pull in resources from other projects' },
                { id: 'action4', text: 'Conduct root cause analysis while fixing' },
                { id: 'action5', text: 'Create crisis communication plan' }
              ].map(action => (
                <div 
                  key={action.id}
                  className={`p-3 rounded-lg flex items-center cursor-pointer transition ${
                    selectedOptions.includes(action.id) 
                      ? 'bg-blue-700 text-white' 
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }`}
                  onClick={() => handleOptionSelect(action.id)}
                >
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 border ${
                      selectedOptions.includes(action.id) ? 'border-white bg-blue-500' : 'border-gray-400'
                    }`}
                  >
                    {selectedOptions.includes(action.id) && (
                      <span className="text-xs">✓</span>
                    )}
                  </div>
                  <div>{action.text}</div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg text-white">
              <div className="text-sm">Select actions (choose 3):</div>
              <div className="font-medium">{selectedOptions.length}/3</div>
            </div>
            
            <Button 
              variant="primary" 
              fullWidth 
              onClick={handleComplete}
              disabled={selectedOptions.length !== 3}
            >
              Execute Crisis Response
            </Button>
          </div>
        );
        
      case 'innovation':
        return (
          <div className="space-y-6">
            <p className="text-gray-300">
              Contribute your most innovative ideas to solve a challenging problem.
              Your team will collaborate to build on each other's creativity.
            </p>
            
            <div className="p-4 bg-purple-900/30 border border-purple-700 rounded-lg mb-6">
              <h4 className="text-lg font-medium text-purple-300 mb-1">Innovation Challenge</h4>
              <p className="text-gray-300">
                How might we improve remote collaboration to maintain team cohesion and creativity?
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-gray-700 rounded-lg">
                <textarea 
                  className="w-full bg-gray-800 text-white border border-gray-600 rounded p-3 h-24"
                  placeholder="Share your innovative solution here..."
                  onChange={(e) => setSelectedOptions([e.target.value])}
                />
              </div>
              
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Team Ideas</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-800 rounded text-sm text-gray-300 border-l-2 border-blue-500">
                    "Virtual team spaces with persistent video connections that people can drop in and out of."
                  </div>
                  <div className="p-2 bg-gray-800 rounded text-sm text-gray-300 border-l-2 border-green-500">
                    "Daily team energizers with rotating facilitators to maintain human connection."
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              fullWidth 
              onClick={handleComplete}
              disabled={selectedOptions.length === 0 || selectedOptions[0] === ''}
            >
              Submit Innovation
            </Button>
          </div>
        );
        
      case 'communication':
        return (
          <div className="space-y-6">
            <p className="text-gray-300">
              Successfully relay critical information across your team by selecting
              the most effective communication methods for different scenarios.
            </p>
            
            <div className="space-y-4">
              {[
                { 
                  id: 'comm1', 
                  scenario: 'Technical documentation update', 
                  options: ['Email', 'Wiki/Documentation', 'Instant Message', 'Meeting']
                },
                { 
                  id: 'comm2', 
                  scenario: 'Urgent production issue', 
                  options: ['Email', 'Phone Call', 'Instant Message', 'Task Tracker']
                },
                { 
                  id: 'comm3', 
                  scenario: 'Project status update', 
                  options: ['Email', 'Dashboard', 'Meeting', 'Project Management Tool']
                }
              ].map((scenario, index) => (
                <div key={scenario.id} className="p-4 bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-white mb-2">{index + 1}. {scenario.scenario}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {scenario.options.map(option => (
                      <button
                        key={`${scenario.id}-${option}`}
                        className={`p-2 rounded text-sm border ${
                          selectedOptions.includes(`${scenario.id}-${option}`) 
                            ? 'bg-blue-600 border-blue-400 text-white' 
                            : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                        }`}
                        onClick={() => {
                          // Remove any previous selection for this scenario
                          const filtered = selectedOptions.filter(sel => !sel.startsWith(scenario.id));
                          setSelectedOptions([...filtered, `${scenario.id}-${option}`]);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="primary" 
              fullWidth 
              onClick={handleComplete}
              disabled={selectedOptions.length < 3}
            >
              Submit Communication Plan
            </Button>
          </div>
        );
        
      default:
        return (
          <div className="space-y-6">
            <p className="text-gray-300">
              Complete this team challenge to earn resources and value points.
            </p>
            
            <Button 
              variant="primary" 
              fullWidth 
              onClick={handleComplete}
            >
              Complete Challenge
            </Button>
          </div>
        );
    }
  };
  
  return (
    <motion.div 
      className="absolute inset-0 bg-black/70 flex items-center justify-center z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full shadow-2xl border border-gray-700"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex justify-between items-center mb-4">
          <motion.h2 
            className="text-2xl font-bold flex items-center text-white"
            key={`title-${step}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {step === 'intro' && (
              <>
                <Users size={24} className="mr-2 text-indigo-400" />
                Team Challenge
              </>
            )}
            {step === 'game' && (
              <>
                <BarChart2 size={24} className="mr-2 text-indigo-400" />
                {miniGame.title}
              </>
            )}
            {step === 'results' && (
              <>
                <Award size={24} className="mr-2 text-yellow-400" />
                Challenge Complete!
              </>
            )}
          </motion.h2>
          
          {step !== 'results' && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-gray-300 hover:text-white"
            >
              <X size={20} />
            </Button>
          )}
        </div>
        
        {/* Intro Step */}
        {step === 'intro' && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-4 bg-indigo-900/30 border border-indigo-700 rounded-lg">
              <h3 className="text-xl font-medium text-indigo-300 mb-2">{miniGame.title}</h3>
              <p className="text-gray-300">{miniGame.description}</p>
            </div>
            
            <div className="flex items-center justify-between bg-gray-700/50 p-4 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-300 uppercase">Mini-Game Type</h4>
                <div className="text-white capitalize">{miniGame.type.replace('-', ' ')}</div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300 uppercase">Rewards</h4>
                <div className="text-amber-400">Team Resources & Value Points</div>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              size="lg"
              fullWidth 
              onClick={() => setStep('game')}
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              Start Team Challenge
              <ChevronRight size={18} className="ml-1" />
            </Button>
          </motion.div>
        )}
        
        {/* Game Step */}
        {step === 'game' && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {renderGameContent()}
          </motion.div>
        )}
        
        {/* Results Step */}
        {step === 'results' && completionResults && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex justify-center my-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.5 }}
              >
                <Award size={80} className="text-yellow-400" />
              </motion.div>
            </div>
            
            <h3 className="text-center text-xl font-medium text-white">
              {miniGame.title} Completed!
            </h3>
            
            <p className="text-center text-gray-300">
              Your team has successfully completed the challenge and earned rewards.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                <h4 className="text-sm font-medium text-gray-300 uppercase mb-2">Team Resources</h4>
                <div className="text-3xl font-bold text-amber-400">+{completionResults.teamResourceGain}</div>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                <h4 className="text-sm font-medium text-gray-300 uppercase mb-2">Value Points</h4>
                <div className="flex justify-center space-x-3">
                  {Object.entries(completionResults.teamValueGains).map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center">
                      <div className="text-lg font-bold text-blue-400">+{value}</div>
                      <div className="text-xs text-gray-400 capitalize">{key.slice(0, 4)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              fullWidth 
              onClick={onClose}
              className="bg-gradient-to-r from-green-500 to-emerald-600 mt-4"
            >
              Continue
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MiniGameModal; 