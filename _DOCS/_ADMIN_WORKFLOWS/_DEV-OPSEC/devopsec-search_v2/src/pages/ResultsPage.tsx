import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Download, ArrowRight, ChevronDown, ArrowDownToLine, Copy, Mail } from 'lucide-react';

const ResultsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Sample data
  const results = [
    { id: 1, email: 'admin@example.com', platform: 'GitHub', category: 'Development', status: 'Confirmed', method: 'Password Reset', timestamp: '2025-04-01 10:32', retries: 1, flags: [] },
    { id: 2, email: 'admin@example.com', platform: 'LinkedIn', category: 'Social Media', status: 'Confirmed', method: 'Password Reset', timestamp: '2025-04-01 10:33', retries: 1, flags: [] },
    { id: 3, email: 'admin@example.com', platform: 'Twitter', category: 'Social Media', status: 'Manual Check', method: '-', timestamp: '2025-04-01 10:35', retries: 5, flags: ['CAPTCHA'] },
    { id: 4, email: 'dev@example.com', platform: 'GitLab', category: 'Development', status: 'Confirmed', method: 'Password Reset', timestamp: '2025-04-01 10:36', retries: 2, flags: [] },
    { id: 5, email: 'dev@example.com', platform: 'AWS', category: 'Web Infrastructure', status: 'Not Found', method: 'Password Reset', timestamp: '2025-04-01 10:38', retries: 1, flags: [] },
    { id: 6, email: 'user@example.com', platform: 'Slack', category: 'Communication', status: 'Confirmed', method: 'Password Reset', timestamp: '2025-04-01 10:40', retries: 1, flags: [] },
    { id: 7, email: 'user@example.com', platform: 'Discord', category: 'Communication', status: 'Not Found', method: 'Password Reset', timestamp: '2025-04-01 10:42', retries: 1, flags: [] },
    { id: 8, email: 'user@example.com', platform: 'Facebook', category: 'Social Media', status: 'Manual Check', method: '-', timestamp: '2025-04-01 10:44', retries: 5, flags: ['Rate Limited'] },
  ];
  
  // Filter results based on active tab
  const filteredResults = results.filter(result => {
    if (activeTab === 'all') return true;
    if (activeTab === 'confirmed') return result.status === 'Confirmed';
    if (activeTab === 'notfound') return result.status === 'Not Found';
    if (activeTab === 'manual') return result.status === 'Manual Check';
    return true;
  });
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-neon-green/10 text-neon-green';
      case 'Not Found':
        return 'bg-neon-blue/10 text-neon-blue';
      case 'Manual Check':
        return 'bg-neon-yellow/10 text-neon-yellow';
      default:
        return 'bg-neon-red/10 text-neon-red';
    }
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="bg-bg-secondary rounded-lg p-6 border border-neon-green/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-xl font-display">Scan Results</h2>
            <p className="text-sm text-text-muted mt-1">Organization Scan #1 • April 1, 2025</p>
          </div>
          
          <div className="flex gap-2 mt-3 md:mt-0">
            <button className="px-3 py-1.5 rounded text-sm bg-bg-tertiary text-text-primary hover:bg-bg-tertiary/80 transition-colors flex items-center">
              <Filter size={14} className="mr-1" /> Filter
            </button>
            <button className="px-3 py-1.5 rounded text-sm bg-neon-green/10 text-neon-green hover:bg-neon-green/20 transition-colors flex items-center">
              <Download size={14} className="mr-1" /> Export
            </button>
          </div>
        </div>
        
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex bg-bg-tertiary rounded-md">
            <button 
              className={`px-4 py-2 text-sm rounded-md ${activeTab === 'all' ? 'bg-neon-green/10 text-neon-green' : 'text-text-muted'}`}
              onClick={() => setActiveTab('all')}
            >
              All ({results.length})
            </button>
            <button 
              className={`px-4 py-2 text-sm rounded-md ${activeTab === 'confirmed' ? 'bg-neon-green/10 text-neon-green' : 'text-text-muted'}`}
              onClick={() => setActiveTab('confirmed')}
            >
              Confirmed ({results.filter(r => r.status === 'Confirmed').length})
            </button>
            <button 
              className={`px-4 py-2 text-sm rounded-md ${activeTab === 'notfound' ? 'bg-neon-green/10 text-neon-green' : 'text-text-muted'}`}
              onClick={() => setActiveTab('notfound')}
            >
              Not Found ({results.filter(r => r.status === 'Not Found').length})
            </button>
            <button 
              className={`px-4 py-2 text-sm rounded-md ${activeTab === 'manual' ? 'bg-neon-green/10 text-neon-green' : 'text-text-muted'}`}
              onClick={() => setActiveTab('manual')}
            >
              Manual ({results.filter(r => r.status === 'Manual Check').length})
            </button>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search results..." 
              className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-md bg-bg-tertiary border border-neon-green/10 text-sm focus:outline-none focus:ring-1 focus:ring-neon-green"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-neon-green/10">
                <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Email</th>
                <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Platform</th>
                <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Category</th>
                <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Status</th>
                <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Method</th>
                <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Flags</th>
                <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => (
                <tr key={result.id} className="border-b border-neon-green/5 hover:bg-bg-tertiary transition-colors">
                  <td className="py-3 text-sm whitespace-nowrap">{result.email}</td>
                  <td className="py-3 text-sm whitespace-nowrap">{result.platform}</td>
                  <td className="py-3 text-sm whitespace-nowrap">{result.category}</td>
                  <td className="py-3 text-sm whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(result.status)}`}>
                      {result.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm whitespace-nowrap">{result.method}</td>
                  <td className="py-3 text-sm whitespace-nowrap">
                    {result.flags.length > 0 ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-neon-red/10 text-neon-red">
                        {result.flags.join(', ')}
                      </span>
                    ) : (
                      <span className="text-text-muted">-</span>
                    )}
                  </td>
                  <td className="py-3 text-sm whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="p-1 rounded text-neon-blue hover:bg-neon-blue/10 transition-colors">
                        <Mail size={14} />
                      </button>
                      <button className="p-1 rounded text-neon-green hover:bg-neon-green/10 transition-colors">
                        <Copy size={14} />
                      </button>
                      <button className="p-1 rounded text-text-muted hover:bg-bg-secondary transition-colors">
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center text-sm">
          <span className="text-text-muted">Showing {filteredResults.length} of {results.length} results</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-neon-green/10 text-neon-green">
              1
            </button>
            <button className="px-3 py-1 rounded bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors">
              Next
            </button>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          className="bg-bg-secondary rounded-lg p-4 border border-neon-green/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-display mb-3">Email Summary</h3>
          <div className="space-y-3">
            {['admin@example.com', 'dev@example.com', 'user@example.com'].map((email) => (
              <div 
                key={email}
                className="p-2 rounded-md hover:bg-bg-tertiary transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm">{email}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green">
                    {results.filter(r => r.email === email && r.status === 'Confirmed').length}
                  </span>
                </div>
                <div className="flex gap-1 mt-1">
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-neon-green/10 text-neon-green">
                    {results.filter(r => r.email === email && r.status === 'Confirmed').length} Confirmed
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-neon-blue/10 text-neon-blue">
                    {results.filter(r => r.email === email && r.status === 'Not Found').length} Not Found
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-neon-yellow/10 text-neon-yellow">
                    {results.filter(r => r.email === email && r.status === 'Manual Check').length} Manual
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2 text-sm bg-bg-tertiary rounded-md text-text-primary hover:bg-neon-green/10 hover:text-neon-green transition-colors flex items-center justify-center">
            <ArrowDownToLine size={14} className="mr-1" /> Export Email Report
          </button>
        </motion.div>
        
        <motion.div 
          className="bg-bg-secondary rounded-lg p-4 border border-neon-green/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-display mb-3">Platform Distribution</h3>
          <div className="space-y-2">
            {['Development', 'Social Media', 'Web Infrastructure', 'Communication'].map((category) => {
              const count = results.filter(r => r.category === category).length;
              const confirmedCount = results.filter(r => r.category === category && r.status === 'Confirmed').length;
              const percentage = Math.round((count / results.length) * 100);
              
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category}</span>
                    <span>{count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neon-green rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>{confirmedCount} confirmed</span>
                    <span>{count - confirmedCount} other</span>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-3 py-2 text-sm bg-bg-tertiary rounded-md text-text-primary hover:bg-neon-green/10 hover:text-neon-green transition-colors flex items-center justify-center">
            <ChevronDown size={14} className="mr-1" /> View All Categories
          </button>
        </motion.div>
        
        <motion.div 
          className="bg-bg-secondary rounded-lg p-4 border border-neon-green/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-display mb-3">Actions</h3>
          <div className="space-y-3">
            <button className="w-full py-2 text-sm bg-neon-green/10 text-neon-green rounded-md hover:bg-neon-green/20 transition-colors flex items-center justify-center">
              <Download size={14} className="mr-1" /> Export Full Report
            </button>
            <button className="w-full py-2 text-sm bg-bg-tertiary text-text-primary rounded-md hover:bg-bg-tertiary/80 transition-colors flex items-center justify-center">
              <Copy size={14} className="mr-1" /> Copy Results
            </button>
            <button className="w-full py-2 text-sm bg-bg-tertiary text-text-primary rounded-md hover:bg-bg-tertiary/80 transition-colors flex items-center justify-center">
              <Mail size={14} className="mr-1" /> Send Recovery Emails
            </button>
            <div className="pt-2 border-t border-neon-green/10 mt-2">
              <h4 className="text-sm font-medium mb-2">Scan Again</h4>
              <div className="flex flex-wrap gap-2">
                <button className="px-2 py-1 text-xs rounded-full bg-neon-green/10 text-neon-green hover:bg-neon-green/20 transition-colors">
                  Same Settings
                </button>
                <button className="px-2 py-1 text-xs rounded-full bg-bg-tertiary text-text-primary hover:bg-bg-tertiary/80 transition-colors">
                  Manual Checks Only
                </button>
                <button className="px-2 py-1 text-xs rounded-full bg-bg-tertiary text-text-primary hover:bg-bg-tertiary/80 transition-colors">
                  New Platforms
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage;