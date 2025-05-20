import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Scan, ChevronDown, Filter, Check, X } from 'lucide-react';
import { createAdvancedLogger } from '../utils/logger';
import axios from 'axios';

// Create an advanced logger for this component
const logger = createAdvancedLogger('SCAN_PAGE');

// Create API client
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const ScanPage: React.FC = () => {
  const [scanStarted, setScanStarted] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'GitHub', 'GitLab', 'Twitter', 'LinkedIn'
  ]);
  const [scanId, setScanId] = useState<string | null>(null);
  const [currentPlatform, setCurrentPlatform] = useState<string>('');
  const [currentEmail, setCurrentEmail] = useState<string>('');
  const [platformsScanned, setPlatformsScanned] = useState(0);
  const [emailsProcessed, setEmailsProcessed] = useState(0);
  const [emailsCount, setEmailsCount] = useState(0);
  const [accountsFound, setAccountsFound] = useState(0);
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState('');
  const emailsInputRef = useRef<HTMLTextAreaElement>(null);
  const pollIntervalRef = useRef<number | null>(null);
  
  // Config settings with default values
  const [config, setConfig] = useState({
    retryAttempts: 3,
    stealthMode: true,
    useProxies: false
  });
  
  // Clean up poll interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);
  
  // Start scan with real backend integration
  const startScan = async () => {
    // Log the beginning of the scan process
    logger.info('🔄', 'Scan initiated by user');
    logger.data('📦', `Selected platforms: ${selectedPlatforms.join(', ')}`);
    
    // Start performance timer
    logger.startTimer('scanOperation');
    
    // Get emails from textarea
    const emails = emailsInputRef.current?.value.split('\n').filter((e: string) => e.trim()) || [];
    setEmailsCount(emails.length);
    
    logger.data('📨', `Email count: ${emails.length}`);
    
    if (emails.length === 0) {
      logger.warn('⚠️', 'No emails provided for scan');
      return;
    }
    
    // Set scan started state
    setScanStarted(true);
    setScanProgress(0);
    
    try {
      // Get config settings from UI
      const retryAttemptsSelect = document.querySelector('select') as HTMLSelectElement;
      const retryAttempts = retryAttemptsSelect ? parseInt(retryAttemptsSelect.value) : config.retryAttempts;
      
      // Prepare scan data
      const scanData = {
        emails,
        platformIds: selectedPlatforms.map(p => p.toLowerCase()),
        config: {
          retryAttempts,
          stealthMode: config.stealthMode,
          useProxies: config.useProxies
        }
      };
      
      logger.api('📤', `Sending API request to create scan`);
      logger.inspectData('🔍', 'Scan request data', scanData);
      
      // Call the real API to start the scan
      const response = await api.post('/scans', scanData);
      const newScanId = response.data.id;
      
      logger.success('✅', `Scan created with ID: ${newScanId}`);
      setScanId(newScanId);
      
      // Start polling for scan progress
      pollScanProgress(newScanId);
    } catch (error: any) {
      logger.error('❌', `Failed to create scan: ${error.message}`);
      if (error.response) {
        logger.error('❌', `Status: ${error.response.status}`);
        logger.inspectData('❌', 'Error response data', error.response.data);
      }
      setScanStarted(false);
      setScanProgress(0);
    }
  };
  
  // Poll for scan progress from real backend
  const pollScanProgress = (scanId: string) => {
    logger.info('🔄', `Starting progress polling for scan ${scanId}`);
    
    // Clear any existing poll interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    // Set up new polling interval
    const intervalId = window.setInterval(async () => {
      try {
        // Get progress from real API
        const response = await api.get(`/scans/${scanId}/progress`);
        const progress = response.data;
        
        logger.info('📊', `Received progress update: ${progress.percentComplete}%`);
        
        // Update progress state
        setScanProgress(progress.percentComplete);
        setCurrentPlatform(progress.currentPlatform || '');
        setCurrentEmail(progress.currentEmail || '');
        setPlatformsScanned(progress.platformsScanned || 0);
        setEmailsProcessed(progress.emailsProcessed || 0);
        setAccountsFound(progress.accountsFound || 0);
        setEstimatedTimeLeft(progress.estimatedTimeLeft || '');
        
        // If scan is complete, stop polling
        if (progress.percentComplete >= 100 || progress.status === 'completed') {
          logger.success('✅', 'Scan completed');
          logger.endTimer('scanOperation');
          clearInterval(intervalId);
          pollIntervalRef.current = null;
        }
      } catch (error: any) {
        logger.error('❌', `Error polling scan progress: ${error.message}`);
        if (error.response?.status === 404) {
          // Scan not found or deleted
          logger.error('❌', 'Scan not found, stopping polling');
          clearInterval(intervalId);
          pollIntervalRef.current = null;
          setScanStarted(false);
        }
      }
    }, 2000); // Poll every 2 seconds
    
    pollIntervalRef.current = intervalId;
  };
  
  // Toggle scan configuration options
  const toggleStealthMode = () => {
    setConfig(prev => ({
      ...prev,
      stealthMode: !prev.stealthMode
    }));
  };
  
  const toggleUseProxies = () => {
    setConfig(prev => ({
      ...prev,
      useProxies: !prev.useProxies
    }));
  };
  
  // Cancel ongoing scan
  const cancelScan = async () => {
    if (!scanId) return;
    
    logger.warn('⚠️', `Cancelling scan ${scanId}`);
    
    try {
      // Call real API to cancel the scan
      await api.post(`/scans/${scanId}/cancel`);
      logger.success('✅', 'Scan cancelled successfully');
      
      // Clear polling interval
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      
      setScanStarted(false);
      setScanProgress(0);
    } catch (error: any) {
      logger.error('❌', `Error cancelling scan: ${error.message}`);
    }
  };
  
  const platforms = [
    { id: 'github', name: 'GitHub', category: 'Development' },
    { id: 'gitlab', name: 'GitLab', category: 'Development' },
    { id: 'bitbucket', name: 'Bitbucket', category: 'Development' },
    { id: 'twitter', name: 'Twitter', category: 'Social Media' },
    { id: 'linkedin', name: 'LinkedIn', category: 'Social Media' },
    { id: 'facebook', name: 'Facebook', category: 'Social Media' },
    { id: 'instagram', name: 'Instagram', category: 'Social Media' },
    { id: 'aws', name: 'AWS', category: 'Web Infrastructure' },
    { id: 'gcp', name: 'Google Cloud', category: 'Web Infrastructure' },
    { id: 'azure', name: 'Azure', category: 'Web Infrastructure' },
    { id: 'discord', name: 'Discord', category: 'Communication' },
    { id: 'slack', name: 'Slack', category: 'Communication' },
  ];
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="bg-bg-secondary rounded-lg p-6 border border-neon-green/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-display mb-6">New Platform Scan</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="emails" className="block text-text-muted text-sm mb-2">
                Organization Emails (one per line)
              </label>
              <textarea 
                id="emails" 
                rows={6}
                ref={emailsInputRef}
                className="w-full rounded-md bg-bg-tertiary border border-neon-green/10 p-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-neon-green transition-all"
                placeholder="user@example.com&#10;admin@example.com&#10;dev@example.com"
              ></textarea>
              <p className="text-xs text-text-muted mt-1">
                Up to 50 emails can be scanned at once
              </p>
            </div>
            
            <div>
              <label className="block text-text-muted text-sm mb-2">
                Platform Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {['Development', 'Social Media', 'Web Infrastructure', 'Communication', 'Business'].map((category) => (
                  <button 
                    key={category}
                    className="px-3 py-1 rounded-full text-sm bg-neon-green/10 text-neon-green hover:bg-neon-green/20 transition-colors"
                  >
                    {category}
                  </button>
                ))}
                <button className="px-3 py-1 rounded-full text-sm bg-bg-tertiary text-text-muted hover:bg-bg-tertiary/80 transition-colors flex items-center">
                  <Filter size={14} className="mr-1" /> More
                </button>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-text-muted text-sm">
                  Scan Configuration
                </label>
                <button className="text-xs text-neon-green hover:underline">
                  Advanced Settings
                </button>
              </div>
              <div className="space-y-3 bg-bg-tertiary rounded-md p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Retry Attempts</span>
                  <select 
                    className="bg-bg-secondary border border-neon-green/10 rounded px-2 py-1 text-sm"
                    onChange={(e) => setConfig(prev => ({ ...prev, retryAttempts: parseInt(e.target.value) }))}
                    value={config.retryAttempts}
                  >
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Stealth Mode</span>
                  <button 
                    className={`relative inline-flex items-center h-5 rounded-full w-10 ${config.stealthMode ? 'bg-neon-green/30' : 'bg-bg-secondary'}`}
                    onClick={toggleStealthMode}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${config.stealthMode ? 'translate-x-5 bg-neon-green' : 'translate-x-1 bg-text-muted'}`}></span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Use Proxies</span>
                  <button 
                    className={`relative inline-flex items-center h-5 rounded-full w-10 ${config.useProxies ? 'bg-neon-green/30' : 'bg-bg-secondary'}`}
                    onClick={toggleUseProxies}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${config.useProxies ? 'translate-x-5 bg-neon-green' : 'translate-x-1 bg-text-muted'}`}></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-text-muted text-sm">
                  Selected Platforms ({selectedPlatforms.length})
                </label>
                <div className="flex gap-2">
                  <button className="text-xs text-neon-blue hover:underline flex items-center">
                    <Check size={12} className="mr-1" /> Select All
                  </button>
                  <button className="text-xs text-neon-red hover:underline flex items-center">
                    <X size={12} className="mr-1" /> Clear
                  </button>
                </div>
              </div>
              <div className="h-[290px] overflow-y-auto bg-bg-tertiary rounded-md p-2">
                <div className="space-y-1">
                  {platforms.map((platform) => (
                    <div 
                      key={platform.id}
                      className="flex items-center justify-between p-2 hover:bg-bg-secondary rounded transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded bg-neon-green/10 flex items-center justify-center text-neon-green mr-2">
                          <Check size={12} />
                        </div>
                        <span className="text-sm">{platform.name}</span>
                      </div>
                      <span className="text-xs text-text-muted">{platform.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {scanStarted ? (
              <div className="space-y-3">
                <div className="bg-bg-tertiary rounded-md p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neon-green">Scan in Progress</span>
                    <span className="text-sm text-neon-green">{scanProgress}%</span>
                  </div>
                  <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-neon-green rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${scanProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-text-muted">
                      Scanning platforms: <span className="text-text-primary">{currentPlatform || 'Initializing...'}</span>
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      Current email: <span className="text-text-primary">{currentEmail || 'Preparing...'}</span>
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Platforms scanned: <span className="text-text-primary">{platformsScanned}/{selectedPlatforms.length}</span></span>
                    <span className="text-text-muted">Emails processed: <span className="text-text-primary">{emailsProcessed}/{emailsCount}</span></span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Accounts found: <span className="text-neon-green">{accountsFound}</span></span>
                    <span className="text-text-muted">Estimated time left: <span className="text-text-primary">{estimatedTimeLeft || 'Calculating...'}</span></span>
                  </div>
                </div>
                
                <button 
                  onClick={cancelScan}
                  className="w-full py-3 mt-4 bg-neon-red/10 text-neon-red rounded-md hover:bg-neon-red/20 transition-colors flex items-center justify-center font-display"
                >
                  <X size={16} className="mr-2" /> Cancel Scan
                </button>
              </div>
            ) : (
              <button 
                onClick={startScan}
                className="w-full py-3 mt-4 bg-neon-green/10 text-neon-green rounded-md hover:bg-neon-green/20 transition-colors flex items-center justify-center font-display"
              >
                <Scan size={18} className="mr-2" /> Start Scan
              </button>
            )}
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-bg-secondary rounded-lg p-6 border border-neon-green/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-display">Scan History</h2>
          <button className="text-sm text-neon-green hover:underline">View All</button>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="p-3 rounded-md border border-neon-green/5 hover:bg-bg-tertiary transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">
                    Organization Scan #{i}
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green">
                      Completed
                    </span>
                  </h3>
                  <p className="text-xs text-text-muted mt-1">
                    April {i}, 2025 • 12 platforms • {10 + i} emails
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 text-xs rounded bg-bg-tertiary text-text-primary hover:bg-neon-blue/10 hover:text-neon-blue transition-colors">
                    View Results
                  </button>
                  <button className="px-2 py-1 text-xs rounded bg-bg-tertiary text-text-primary hover:bg-neon-green/10 hover:text-neon-green transition-colors">
                    Copy Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ScanPage;