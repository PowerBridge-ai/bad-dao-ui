import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Edit, Save, Plus, Trash2, Key, Globe, Power, FileCog, Users, Shield, Box } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('api');
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="bg-bg-secondary rounded-lg p-6 border border-neon-green/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-xl font-display flex items-center">
              <Settings size={20} className="mr-2 text-neon-green" /> Admin Dashboard
            </h2>
            <p className="text-sm text-text-muted mt-1">Configure system settings and manage platforms</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="border-b border-neon-green/10">
            <nav className="-mb-px flex space-x-6">
              <button
                className={`py-2 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'api'
                    ? 'border-neon-green text-neon-green'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
                onClick={() => setActiveTab('api')}
              >
                <Key size={16} className="inline mr-1" /> API Configuration
              </button>
              <button
                className={`py-2 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'platforms'
                    ? 'border-neon-green text-neon-green'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
                onClick={() => setActiveTab('platforms')}
              >
                <Globe size={16} className="inline mr-1" /> Platform Registry
              </button>
              <button
                className={`py-2 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'users'
                    ? 'border-neon-green text-neon-green'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
                onClick={() => setActiveTab('users')}
              >
                <Users size={16} className="inline mr-1" /> User Management
              </button>
              <button
                className={`py-2 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'system'
                    ? 'border-neon-green text-neon-green'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
                onClick={() => setActiveTab('system')}
              >
                <Power size={16} className="inline mr-1" /> System Settings
              </button>
            </nav>
          </div>
        </div>
        
        {activeTab === 'api' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-md border border-neon-green/10 bg-bg-tertiary">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium flex items-center">
                      <Key size={16} className="mr-1 text-neon-green" /> API Keys
                    </h3>
                    <button className="p-1 text-xs rounded bg-neon-green/10 text-neon-green">
                      <Edit size={12} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs text-text-muted">Google API Key</label>
                      <div className="flex">
                        <input 
                          type="password" 
                          value="●●●●●●●●●●●●●●●●●●●●"
                          disabled
                          className="flex-1 p-2 text-sm bg-bg-secondary rounded-l-md border border-neon-green/10 focus:outline-none"
                        />
                        <button className="px-2 py-1 bg-bg-secondary border border-l-0 border-neon-green/10 rounded-r-md text-text-muted hover:text-neon-green">
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-text-muted">GitHub OAuth Token</label>
                      <div className="flex">
                        <input 
                          type="password" 
                          value="●●●●●●●●●●●●●●●●●●●●"
                          disabled
                          className="flex-1 p-2 text-sm bg-bg-secondary rounded-l-md border border-neon-green/10 focus:outline-none"
                        />
                        <button className="px-2 py-1 bg-bg-secondary border border-l-0 border-neon-green/10 rounded-r-md text-text-muted hover:text-neon-green">
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-text-muted">Proxy Service API Key</label>
                      <div className="flex">
                        <input 
                          type="password" 
                          value="●●●●●●●●●●●●●●●●●●●●"
                          disabled
                          className="flex-1 p-2 text-sm bg-bg-secondary rounded-l-md border border-neon-green/10 focus:outline-none"
                        />
                        <button className="px-2 py-1 bg-bg-secondary border border-l-0 border-neon-green/10 rounded-r-md text-text-muted hover:text-neon-green">
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-3 py-2 text-xs bg-neon-green/10 text-neon-green rounded-md hover:bg-neon-green/20 transition-colors">
                    <Save size={12} className="inline mr-1" /> Save Changes
                  </button>
                </div>
                
                <div className="p-4 rounded-md border border-neon-green/10 bg-bg-tertiary">
                  <h3 className="font-medium flex items-center mb-3">
                    <FileCog size={16} className="mr-1 text-neon-green" /> Export Settings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Default Export Format</span>
                      <select className="bg-bg-secondary border border-neon-green/10 rounded px-2 py-1 text-sm">
                        <option>Excel (.xlsx)</option>
                        <option>CSV (.csv)</option>
                        <option>Markdown (.md)</option>
                        <option>JSON (.json)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-export Results</span>
                      <button className="relative inline-flex items-center h-5 rounded-full w-10 bg-neon-green/30">
                        <span className="inline-block h-4 w-4 transform translate-x-5 rounded-full bg-neon-green transition-transform"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Include Timestamps</span>
                      <button className="relative inline-flex items-center h-5 rounded-full w-10 bg-neon-green/30">
                        <span className="inline-block h-4 w-4 transform translate-x-5 rounded-full bg-neon-green transition-transform"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-md border border-neon-green/10 bg-bg-tertiary">
                  <h3 className="font-medium flex items-center mb-3">
                    <Shield size={16} className="mr-1 text-neon-green" /> Security Settings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">2FA Authentication</span>
                      <button className="relative inline-flex items-center h-5 rounded-full w-10 bg-neon-green/30">
                        <span className="inline-block h-4 w-4 transform translate-x-5 rounded-full bg-neon-green transition-transform"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Key Rotation (30 days)</span>
                      <button className="relative inline-flex items-center h-5 rounded-full w-10 bg-neon-green/30">
                        <span className="inline-block h-4 w-4 transform translate-x-5 rounded-full bg-neon-green transition-transform"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Activity Logging</span>
                      <button className="relative inline-flex items-center h-5 rounded-full w-10 bg-neon-green/30">
                        <span className="inline-block h-4 w-4 transform translate-x-5 rounded-full bg-neon-green transition-transform"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">TypingDNA Verification</span>
                      <button className="relative inline-flex items-center h-5 rounded-full w-10 bg-bg-secondary">
                        <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-text-muted transition-transform"></span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-md border border-neon-green/10 bg-bg-tertiary">
                  <h3 className="font-medium flex items-center mb-3">
                    <Box size={16} className="mr-1 text-neon-green" /> Storage Configuration
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs text-text-muted">Google Sheets ID</label>
                      <input 
                        type="text" 
                        value="1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r"
                        className="w-full p-2 text-sm bg-bg-secondary rounded-md border border-neon-green/10 focus:outline-none focus:ring-1 focus:ring-neon-green"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Create New Sheet Per Scan</span>
                      <button className="relative inline-flex items-center h-5 rounded-full w-10 bg-neon-green/30">
                        <span className="inline-block h-4 w-4 transform translate-x-5 rounded-full bg-neon-green transition-transform"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-backup Results</span>
                      <button className="relative inline-flex items-center h-5 rounded-full w-10 bg-neon-green/30">
                        <span className="inline-block h-4 w-4 transform translate-x-5 rounded-full bg-neon-green transition-transform"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Retention (days)</span>
                      <select className="bg-bg-secondary border border-neon-green/10 rounded px-2 py-1 text-sm">
                        <option>30</option>
                        <option>60</option>
                        <option>90</option>
                        <option>Unlimited</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'platforms' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Platform Registry</h3>
              <button className="p-2 rounded-md bg-neon-green/10 text-neon-green hover:bg-neon-green/20 text-sm flex items-center">
                <Plus size={14} className="mr-1" /> Add Platform
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-neon-green/10">
                    <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Platform</th>
                    <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Category</th>
                    <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Login URL</th>
                    <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Reset URL</th>
                    <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Status</th>
                    <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'GitHub', category: 'Development', loginUrl: 'https://github.com/login', resetUrl: 'https://github.com/password_reset', status: 'Active' },
                    { name: 'Twitter', category: 'Social Media', loginUrl: 'https://twitter.com/login', resetUrl: 'https://twitter.com/account/begin_password_reset', status: 'Active' },
                    { name: 'LinkedIn', category: 'Social Media', loginUrl: 'https://www.linkedin.com/login', resetUrl: 'https://www.linkedin.com/checkpoint/rp/request-password-reset', status: 'Active' },
                    { name: 'AWS', category: 'Web Infrastructure', loginUrl: 'https://aws.amazon.com/console', resetUrl: 'https://aws.amazon.com/password/recovery', status: 'Active' },
                    { name: 'Slack', category: 'Communication', loginUrl: 'https://slack.com/signin', resetUrl: 'https://slack.com/forgot', status: 'Active' },
                  ].map((platform, i) => (
                    <tr key={i} className="border-b border-neon-green/5 hover:bg-bg-tertiary transition-colors">
                      <td className="py-3 text-sm whitespace-nowrap">{platform.name}</td>
                      <td className="py-3 text-sm whitespace-nowrap">{platform.category}</td>
                      <td className="py-3 text-sm whitespace-nowrap">{platform.loginUrl}</td>
                      <td className="py-3 text-sm whitespace-nowrap">{platform.resetUrl}</td>
                      <td className="py-3 text-sm whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-neon-green/10 text-neon-green">
                          {platform.status}
                        </span>
                      </td>
                      <td className="py-3 text-sm whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="p-1 rounded text-neon-blue hover:bg-neon-blue/10 transition-colors">
                            <Edit size={14} />
                          </button>
                          <button className="p-1 rounded text-neon-red hover:bg-neon-red/10 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-sm">
              <span className="text-text-muted">Showing 5 of 22 platforms</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 rounded bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 rounded bg-neon-green/10 text-neon-green">
                  1
                </button>
                <button className="px-3 py-1 rounded bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors">
                  2
                </button>
                <button className="px-3 py-1 rounded bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors">
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {(activeTab === 'users' || activeTab === 'system') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-10"
          >
            <div className="bg-neon-green/5 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Settings size={32} className="text-neon-green" />
            </div>
            <h3 className="text-lg font-display mb-2">Configuration Coming Soon</h3>
            <p className="text-text-muted text-center max-w-md">
              This section is under development. Additional administrative settings will be available in a future update.
            </p>
            <button className="mt-4 px-4 py-2 bg-neon-green/10 text-neon-green rounded-md hover:bg-neon-green/20 transition-colors">
              Request Early Access
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Define the Eye component that was used in the AdminPage
const Eye: React.FC<{ size: number }> = ({ size }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
};

export default AdminPage;