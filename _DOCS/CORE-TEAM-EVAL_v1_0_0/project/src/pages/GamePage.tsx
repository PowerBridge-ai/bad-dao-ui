import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Calendar, Users, ChevronRight, Award, HelpCircle } from 'lucide-react';
import { GameProvider, useGameState } from '../context/GameContext';
import Board2D from '../components/game/Board2D';
import PlayerHUD from '../components/game/PlayerHUD';
import ScenarioCard from '../components/game/ScenarioCard';
import CalendarView from '../components/game/CalendarView';
import MiniGameModal from '../components/game/MiniGameModal';
import Button from '../components/common/Button';

const GamePageContent: React.FC = () => {
  const { 
    gameState, 
    currentPlayer, 
    startGame, 
    nextDay, 
    selectScenarioOption 
  } = useGameState();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showTeamView, setShowTeamView] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [difficultyChoice, setDifficultyChoice] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  
  // Handle scenario option selection
  const handleSelectOption = (optionId: string) => {
    if (gameState.currentScenario && currentPlayer) {
      selectScenarioOption(currentPlayer.id, gameState.currentScenario.id, optionId);
    }
  };
  
  // Handle next day action
  const handleNextDay = () => {
    if (gameState.currentTurn === currentPlayer?.id) {
      nextDay();
    }
  };
  
  // Daily event notification
  const getDailyEventNotification = () => {
    // Check if there's a special event today
    const todayEvent = gameState.calendar.specialEvents.find(
      event => event.day === gameState.currentDay
    );
    
    // Check if it's a weekend
    const isWeekend = gameState.calendar.weekends.includes(gameState.currentDay);
    
    if (todayEvent) {
      return {
        title: todayEvent.title,
        description: todayEvent.description,
        type: 'special'
      };
    } else if (isWeekend) {
      return {
        title: 'Weekend',
        description: 'Time to recharge! Team resources regenerate slightly during weekends.',
        type: 'weekend'
      };
    }
    
    return null;
  };
  
  // Daily notification display
  const dailyEvent = getDailyEventNotification();
  
  return (
    <div className="relative h-screen overflow-hidden bg-gray-900">
      {/* Game board container */}
      <div className="absolute inset-0">
        {/* <GameBoard /> */}
        <Board2D />
      </div>
      
      {/* Header toolbar */}
      <div className="absolute top-0 left-0 right-0 bg-gray-900/70 backdrop-blur-sm text-white p-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Team Theory</h1>
          <div className="px-3 py-1 bg-blue-500/30 text-blue-300 rounded-full text-sm">
            Level {gameState.level}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCalendar(true)}
            className="text-white/70 hover:text-white"
          >
            <Calendar size={18} className="mr-1" />
            Day {gameState.currentDay}/{gameState.totalDays}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTeamView(true)}
            className="text-white/70 hover:text-white"
          >
            <Users size={18} className="mr-1" />
            Team
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHelp(true)}
            className="text-white/70 hover:text-white"
          >
            <HelpCircle size={18} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="text-white/70 hover:text-white"
          >
            <Settings size={18} />
          </Button>
        </div>
      </div>
      
      {/* Resources counter */}
      <div className="absolute top-16 right-4 bg-gray-800/80 backdrop-blur-sm text-white p-3 rounded-lg">
        <div className="text-center mb-2">
          <div className="text-gray-400 text-xs uppercase">Team Resources</div>
          <div className="text-2xl font-bold text-amber-400">{gameState.teamResources}</div>
        </div>
        
        <div className="h-px bg-gray-700 my-2"></div>
        
        {currentPlayer && (
          <div className="text-center">
            <div className="text-gray-400 text-xs uppercase">Your Resources</div>
            <div className="text-xl font-bold text-blue-400">{currentPlayer.resources}</div>
          </div>
        )}
      </div>
      
      {/* Player HUD */}
      <PlayerHUD 
        onOpenSettings={() => setShowSettings(true)}
        onViewTeam={() => setShowTeamView(true)}
        onNextDay={handleNextDay}
      />
      
      {/* Daily event notification */}
      <AnimatePresence>
        {dailyEvent && gameState.gameStarted && (
          <motion.div 
            className={`absolute top-16 left-4 bg-opacity-90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-md ${
              dailyEvent.type === 'special' ? 'bg-indigo-900' : 'bg-gray-800'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3 className={`font-bold text-lg ${
              dailyEvent.type === 'special' ? 'text-indigo-300' : 'text-gray-200'
            }`}>
              {dailyEvent.title}
            </h3>
            <p className="text-gray-300 mt-1 text-sm">{dailyEvent.description}</p>
            
            {dailyEvent.type === 'special' && (
              <div className="mt-3 bg-indigo-800/50 p-2 rounded text-sm text-indigo-200">
                Special events often trigger team mini-games that can earn resources!
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Game Starting Overlay */}
      {!gameState.gameStarted && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <motion.div 
            className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full text-white shadow-2xl border border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2 text-blue-300">Level 1: Team Theory</h1>
            <p className="text-gray-300 mb-6">
              Welcome to the Core Team Evaluation System. In this level, you'll explore 
              how your team aligns on key organizational values through a calendar-based 
              project simulation. Navigate the game board, respond to scenarios, and 
              collaborate in mini-games to discover your team's strengths.
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-gray-100">Select Difficulty:</h3>
              <div className="grid grid-cols-4 gap-3">
                <button 
                  className={`p-3 rounded-lg text-center transition ${
                    difficultyChoice === 'easy' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => setDifficultyChoice('easy')}
                >
                  <div className="font-medium">Easy</div>
                  <div className="text-xs mt-1">10,000 Resources</div>
                </button>
                <button 
                  className={`p-3 rounded-lg text-center transition ${
                    difficultyChoice === 'medium' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => setDifficultyChoice('medium')}
                >
                  <div className="font-medium">Medium</div>
                  <div className="text-xs mt-1">5,000 Resources</div>
                </button>
                <button 
                  className={`p-3 rounded-lg text-center transition ${
                    difficultyChoice === 'hard' 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => setDifficultyChoice('hard')}
                >
                  <div className="font-medium">Hard</div>
                  <div className="text-xs mt-1">2,000 Resources</div>
                </button>
                <button 
                  className={`p-3 rounded-lg text-center transition ${
                    difficultyChoice === 'expert' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => setDifficultyChoice('expert')}
                >
                  <div className="font-medium">Expert</div>
                  <div className="text-xs mt-1">0 Resources</div>
                </button>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              size="lg" 
              onClick={startGame}
              className="mx-auto w-full bg-gradient-to-r from-blue-500 to-indigo-600"
            >
              Start Game
            </Button>
          </motion.div>
        </div>
      )}
      
      {/* Game End Overlay */}
      {gameState.gameEnded && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30">
          <motion.div 
            className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full text-white shadow-2xl border border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <Award size={80} className="text-yellow-400" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2 text-center text-blue-300">Project Complete!</h1>
            <p className="text-gray-300 mb-6 text-center">
              Congratulations! Your team has completed the 30-day project. Here's how you performed:
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-center text-blue-300">Team Resources</h3>
                <div className="text-4xl font-bold text-center text-amber-400">{gameState.teamResources}</div>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-center text-blue-300">Project Days</h3>
                <div className="text-4xl font-bold text-center text-green-400">{gameState.currentDay}</div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-gray-100">Team Performance:</h3>
              <div className="space-y-3">
                {gameState.players.map((player) => (
                  <div 
                    key={player.id} 
                    className="p-3 rounded-lg bg-gray-700/50 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: player.color }}
                      >
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-gray-400">Resources: {player.resources}</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-amber-400">{player.score}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => window.location.reload()}
              className="mx-auto w-full bg-gradient-to-r from-blue-500 to-indigo-600"
            >
              Play Again
            </Button>
          </motion.div>
        </div>
      )}
      
      {/* Active scenario card */}
      <AnimatePresence>
        {gameState.currentScenario && (
          <ScenarioCard
            title={gameState.currentScenario.title}
            description={gameState.currentScenario.description}
            options={gameState.currentScenario.options.map(opt => ({
              ...opt,
              values: {
                innovation: opt.valueEffect.find(v => v.type === 'innovation')?.amount || 0,
                integrity: opt.valueEffect.find(v => v.type === 'integrity')?.amount || 0,
                collaboration: opt.valueEffect.find(v => v.type === 'collaboration')?.amount || 0,
                excellence: opt.valueEffect.find(v => v.type === 'excellence')?.amount || 0,
                userFocus: opt.valueEffect.find(v => v.type === 'userFocus')?.amount || 0
              }
            }))}
            onSelectOption={handleSelectOption}
            onClose={() => {}}
          />
        )}
      </AnimatePresence>
      
      {/* Active mini-game */}
      <AnimatePresence>
        {gameState.activeMiniGame && gameState.activeMiniGame.status === 'active' && (
          <MiniGameModal
            miniGame={gameState.activeMiniGame}
            onClose={() => {}}
          />
        )}
      </AnimatePresence>
      
      {/* Calendar View */}
      <AnimatePresence>
        {showCalendar && (
          <CalendarView
            calendar={{
              ...gameState.calendar,
              startDate: new Date() // Adding required startDate prop
            }}
            currentDay={gameState.currentDay}
            totalDays={gameState.totalDays}
            onClose={() => setShowCalendar(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-700"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center text-white">
                  <Settings size={24} className="mr-2 text-blue-400" />
                  Settings
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSettings(false)}
                  className="text-gray-300 hover:text-white"
                >
                  Close
                </Button>
              </div>
              
              <div className="space-y-4 text-gray-200">
                <div>
                  <h3 className="font-medium mb-2 text-blue-300">Game Controls</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Sound Effects</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Music</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600">
                        <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Animations</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-blue-300">Display</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Camera Speed
                      </label>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        defaultValue="5" 
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <Button variant="primary" fullWidth onClick={() => setShowSettings(false)}>
                    Save Settings
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Team View */}
      <AnimatePresence>
        {showTeamView && (
          <motion.div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 max-w-xl w-full shadow-2xl border border-gray-700"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Team Overview</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowTeamView(false)}
                  className="text-gray-300 hover:text-white"
                >
                  Close
                </Button>
              </div>
              
              <div className="space-y-4">
                {gameState.players.map((player) => (
                  <div 
                    key={player.id} 
                    className="p-4 rounded-lg border border-gray-700 bg-gray-900/50 flex items-center space-x-4"
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: player.color }}
                    >
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{player.name}</h3>
                      <div className="text-sm text-gray-400">Score: {player.score} | Day: {player.currentDay}</div>
                      
                      {/* Value meters */}
                      <div className="mt-2 grid grid-cols-5 gap-1">
                        {Object.entries(player.values).map(([key, value]) => (
                          <div key={key} className="flex flex-col items-center">
                            <div className="h-20 w-4 bg-gray-700 rounded-full overflow-hidden relative">
                              <div 
                                className="absolute bottom-0 w-full transition-all duration-500 ease-out rounded-full"
                                style={{ 
                                  height: `${Math.min(100, value)}%`,
                                  backgroundColor: 
                                    key === 'innovation' ? '#9F7AEA' : 
                                    key === 'integrity' ? '#3E64FF' : 
                                    key === 'collaboration' ? '#38B2AC' : 
                                    key === 'excellence' ? '#FFD166' : 
                                    '#FF6B6B'
                                }}
                              />
                            </div>
                            <div className="text-xs mt-1 text-gray-400 capitalize">{key.slice(0,4)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {gameState.currentTurn === player.id ? (
                          <span className="text-green-400">Current Turn</span>
                        ) : (
                          <span className="text-gray-400">Waiting</span>
                        )}
                      </div>
                      <div className="text-xl font-bold text-blue-400 mt-1">{player.resources}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Help Panel */}
      <AnimatePresence>
        {showHelp && (
          <motion.div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full shadow-2xl border border-gray-700 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center text-white">
                  <HelpCircle size={24} className="mr-2 text-blue-400" />
                  How to Play
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowHelp(false)}
                  className="text-gray-300 hover:text-white"
                >
                  Close
                </Button>
              </div>
              
              <div className="space-y-6 text-gray-200">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-blue-300">Game Overview</h3>
                  <p>
                    "Team Theory" is a 30-day project simulation that assesses how your team aligns on key
                    organizational values. Navigate the game board, make decisions, and participate in
                    team mini-games to demonstrate your value priorities.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 text-blue-300">Game Mechanics</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="text-white font-medium">Calendar Progression:</span> Each turn represents one business day in the project timeline.
                    </li>
                    <li>
                      <span className="text-white font-medium">Path Selection:</span> Choose which paths to take on the board, representing different value priorities.
                    </li>
                    <li>
                      <span className="text-white font-medium">Decision Points:</span> Respond to workplace scenarios that test your alignment with organizational values.
                    </li>
                    <li>
                      <span className="text-white font-medium">Mini-Games:</span> Collaborate in team challenges that appear during special events.
                    </li>
                    <li>
                      <span className="text-white font-medium">Resources:</span> Manage both individual and team resources throughout the project.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 text-blue-300">Organizational Values</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                      <span>Innovation: Creating new solutions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      <span>Integrity: Ethical decision-making</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-teal-500"></div>
                      <span>Collaboration: Working together</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                      <span>Excellence: Highest quality</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <span>User Focus: Customer-centered</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 text-blue-300">Controls</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Click on path nodes to move your avatar</li>
                    <li>Use the "Next Day" button to progress through the project timeline</li>
                    <li>The Calendar icon shows your project schedule and upcoming events</li>
                    <li>View your team's progress through the Team Overview panel</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GamePage: React.FC = () => {
  return (
    <GameProvider>
      <GamePageContent />
    </GameProvider>
  );
};

export default GamePage;