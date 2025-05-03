import { useState } from 'react';
import { Save, RefreshCw, AlertCircle, Info } from 'lucide-react';

type ApiKeyType = {
  id: string;
  label: string;
  value: string;
  isSecret: boolean;
  info?: string;
};

type TabType = 'google-signin' | 'google-drive' | 'github' | 'web3' | 'general';

const Admin = () => {
  const [activeTab, setActiveTab] = useState<TabType>('google-signin');
  
  // Group API keys by provider for better organization
  const [thirdwebConfig, setThirdwebConfig] = useState<ApiKeyType[]>([
    { id: 'thirdweb_client_id', label: 'Client ID', value: '', isSecret: false, info: 'Your Thirdweb Client ID from the dashboard' },
    { id: 'thirdweb_secret_key', label: 'Secret Key', value: '', isSecret: true, info: 'Your Thirdweb Secret Key from the dashboard' },
    { id: 'thirdweb_nebula_api_key', label: 'Nebula API Key', value: '', isSecret: true, info: 'API Key for Nebula AI services' },
  ]);
  
  const [googleSignInConfig, setGoogleSignInConfig] = useState<ApiKeyType[]>([
    { id: 'google_client_id', label: 'Client ID', value: '', isSecret: false },
    { id: 'google_client_secret', label: 'Client Secret', value: '', isSecret: true },
    { id: 'google_project_id', label: 'Project ID', value: '', isSecret: false },
    { id: 'google_redirect_uri', label: 'Redirect URI', value: 'http://localhost:3039/auth/google/callback', isSecret: false },
  ]);
  
  const [githubConfig, setGithubConfig] = useState<ApiKeyType[]>([
    { id: 'github_client_id', label: 'GitHub Client ID', value: '', isSecret: false },
    { id: 'github_client_secret', label: 'GitHub Client Secret', value: '', isSecret: true },
  ]);
  
  const [googleDriveConfig, setGoogleDriveConfig] = useState<ApiKeyType[]>([
    { id: 'google_drive_client_id', label: 'Client ID', value: '', isSecret: false },
    { id: 'google_drive_client_secret', label: 'Client Secret', value: '', isSecret: true },
  ]);
  
  const [otherConfig, setOtherConfig] = useState<ApiKeyType[]>([
    { id: 'default_rpc_url', label: 'Default RPC URL', value: 'https://mainnet.base.org', isSecret: false },
    { id: 'ipfs_gateway', label: 'IPFS Gateway URL', value: 'https://ipfs.thirdwebcdn.com/ipfs/', isSecret: false },
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const updateApiKeyValue = (
    keyId: string, 
    value: string, 
    group: 'thirdweb' | 'google-signin' | 'google-drive' | 'github' | 'general'
  ) => {
    switch (group) {
      case 'thirdweb':
        setThirdwebConfig(thirdwebConfig.map(key => 
          key.id === keyId ? { ...key, value } : key
        ));
        break;
      case 'google-signin':
        setGoogleSignInConfig(googleSignInConfig.map(key =>
          key.id === keyId ? { ...key, value } : key
        ));
        break;
      case 'google-drive':
        setGoogleDriveConfig(googleDriveConfig.map(key =>
          key.id === keyId ? { ...key, value } : key
        ));
        break;
      case 'github':
        setGithubConfig(githubConfig.map(key =>
          key.id === keyId ? { ...key, value } : key
        ));
        break;
      case 'general':
        setOtherConfig(otherConfig.map(key =>
          key.id === keyId ? { ...key, value } : key
        ));
        break;
    }
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      // In a real implementation, this would call an API endpoint
      // to save the configuration securely
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful save
      setSaveStatus('success');
      setStatusMessage('Configuration saved successfully.');
    } catch (error) {
      setSaveStatus('error');
      setStatusMessage('Failed to save configuration. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
      
      // Clear status after delay
      setTimeout(() => {
        setSaveStatus('idle');
      }, 5000);
    }
  };

  const renderApiKey = (key: ApiKeyType, group: 'thirdweb' | 'google-signin' | 'google-drive' | 'github' | 'general') => (
    <div key={key.id} className="mb-lg">
      <div className="flex items-start justify-between mb-sm">
        <label htmlFor={key.id} className="text-white text-sm font-medium mb-1 flex items-center">
          {key.label}
          {key.info && (
            <div className="relative group ml-sm">
              <Info size={16} className="text-neutral-light/60 cursor-help" />
              <div className="absolute left-0 bottom-full mb-sm w-64 bg-neutral-dark border border-neutral-light/20 rounded-lg p-sm invisible group-hover:visible text-xs text-neutral-light/80">
                {key.info}
              </div>
            </div>
          )}
        </label>
      </div>
      <div className="relative">
        <input
          type={key.isSecret ? "password" : "text"}
          id={key.id}
          value={key.value}
          onChange={(e) => updateApiKeyValue(key.id, e.target.value, group)}
          className="w-full bg-neutral-dark/50 border border-neutral-light/20 rounded-lg px-md py-sm text-white 
                    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          placeholder={`Enter ${key.label}`}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-xl pb-xl">
      <div>
        <h1 className="text-h1 mb-sm">Admin Settings</h1>
        <p className="text-body-lg text-neutral-medium">
          Configure API keys, authentication providers, and platform settings
        </p>
      </div>

      {saveStatus === 'success' && (
        <div className="p-md rounded-lg bg-emerald-500/10 flex items-start mb-lg">
          <div className="shrink-0 mr-sm mt-0.5 bg-emerald-500/20 p-1 rounded-full">
            <RefreshCw size={16} className="text-emerald-500" />
          </div>
          <p className="text-body text-emerald-500">{statusMessage}</p>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="p-md rounded-lg bg-accent-red/10 flex items-start mb-lg">
          <AlertCircle size={18} className="text-accent-red shrink-0 mt-0.5 mr-sm" />
          <p className="text-body text-accent-red">{statusMessage}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-black rounded-lg p-sm">
        <div className="flex border-b border-neutral-dark/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('google-signin')}
            className={`flex items-center px-md py-md font-medium ${
              activeTab === 'google-signin' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-white hover:text-primary/80'
            }`}
          >
            <svg className="w-6 h-6 mr-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6C13.1046 6 14 6.89543 14 8H10C10 6.89543 10.8954 6 12 6Z" fill={activeTab === 'google-signin' ? '#1AB759' : '#9CA3AF'} />
              <path d="M14.5 11.5C14.5 12.8807 13.3807 14 12 14C10.6193 14 9.5 12.8807 9.5 11.5C9.5 10.1193 10.6193 9 12 9C13.3807 9 14.5 10.1193 14.5 11.5Z" fill={activeTab === 'google-signin' ? '#1AB759' : '#9CA3AF'} />
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" fill={activeTab === 'google-signin' ? '#1AB759' : '#9CA3AF'} />
            </svg>
            Google Sign-In
          </button>
          <button
            onClick={() => setActiveTab('google-drive')}
            className={`flex items-center px-md py-md font-medium ${
              activeTab === 'google-drive' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-white hover:text-primary/80'
            }`}
          >
            <svg className="w-6 h-6 mr-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 13L7 5H17L12 13Z" fill={activeTab === 'google-drive' ? '#1AB759' : '#9CA3AF'} />
              <path d="M17 19L12 11L19 5" stroke={activeTab === 'google-drive' ? '#1AB759' : '#9CA3AF'} strokeWidth="2" />
              <path d="M17 19H7L12 11" stroke={activeTab === 'google-drive' ? '#1AB759' : '#9CA3AF'} strokeWidth="2" />
              <path d="M7 19L5 15L7 5" stroke={activeTab === 'google-drive' ? '#1AB759' : '#9CA3AF'} strokeWidth="2" />
            </svg>
            Google Drive
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center px-md py-md font-medium ${
              activeTab === 'github' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-white hover:text-primary/80'
            }`}
          >
            <svg className="w-6 h-6 mr-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.839 21.489C9.339 21.579 9.5 21.266 9.5 20.999C9.5 20.751 9.492 20.043 9.488 19.191C6.727 19.79 6.139 17.726 6.139 17.726C5.685 16.566 5.028 16.254 5.028 16.254C4.122 15.621 5.093 15.633 5.093 15.633C6.094 15.696 6.626 16.669 6.626 16.669C7.521 18.123 8.969 17.767 9.517 17.508C9.606 16.85 9.859 16.395 10.137 16.152C7.953 15.907 5.662 15.088 5.662 11.371C5.662 10.316 6.054 9.451 6.643 8.781C6.534 8.525 6.189 7.53 6.737 6.153C6.737 6.153 7.581 5.881 9.471 7.173C10.285 6.94 11.145 6.823 12 6.819C12.855 6.823 13.716 6.94 14.532 7.173C16.415 5.881 17.26 6.153 17.26 6.153C17.811 7.53 17.465 8.525 17.359 8.781C17.951 9.451 18.337 10.316 18.337 11.371C18.337 15.099 16.043 15.903 13.849 16.142C14.204 16.445 14.519 17.036 14.519 17.939C14.519 19.229 14.507 20.656 14.507 20.996C14.507 21.258 14.661 21.575 15.172 21.478C19.138 20.161 22 16.415 22 12C22 6.477 17.523 2 12 2Z" fill={activeTab === 'github' ? '#1AB759' : '#9CA3AF'} />
            </svg>
            GitHub
          </button>
          <button
            onClick={() => setActiveTab('web3')}
            className={`flex items-center px-md py-md font-medium ${
              activeTab === 'web3' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-white hover:text-primary/80'
            }`}
          >
            <svg className="w-6 h-6 mr-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 14C21.2091 14 23 12.2091 23 10C23 7.79086 21.2091 6 19 6" stroke={activeTab === 'web3' ? '#1AB759' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" />
              <path d="M5 10C5 12.2091 3.20914 14 1 14L1 6C3.20914 6 5 7.79086 5 10Z" stroke={activeTab === 'web3' ? '#1AB759' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 10H19" stroke={activeTab === 'web3' ? '#1AB759' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" />
              <path d="M14.5 18H9.5M12 6V22" stroke={activeTab === 'web3' ? '#1AB759' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" />
            </svg>
            Web3
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center px-md py-md font-medium ${
              activeTab === 'general' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-white hover:text-primary/80'
            }`}
          >
            <svg className="w-6 h-6 mr-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke={activeTab === 'general' ? '#1AB759' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9" stroke={activeTab === 'general' ? '#1AB759' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            General
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-lg">
          {activeTab === 'google-signin' && (
            <div>
              <h2 className="text-h2 text-white mb-md">Google Sign-In OAuth Settings</h2>
              <p className="text-neutral-light/70 mb-lg">
                Configure Google OAuth for user authentication.
              </p>
              <div className="space-y-md">
                {googleSignInConfig.map(key => renderApiKey(key, 'google-signin'))}
              </div>
            </div>
          )}
          
          {activeTab === 'google-drive' && (
            <div>
              <h2 className="text-h2 text-white mb-md">Google Drive Integration</h2>
              <p className="text-neutral-light/70 mb-lg">
                Configure Google Drive integration settings.
              </p>
              <div className="space-y-md">
                {googleDriveConfig.map(key => renderApiKey(key, 'google-drive'))}
              </div>
            </div>
          )}
          
          {activeTab === 'github' && (
            <div>
              <h2 className="text-h2 text-white mb-md">GitHub Authentication</h2>
              <p className="text-neutral-light/70 mb-lg">
                Configure GitHub OAuth authentication.
              </p>
              <div className="space-y-md">
                {githubConfig.map(key => renderApiKey(key, 'github'))}
              </div>
            </div>
          )}
          
          {activeTab === 'web3' && (
            <div>
              <h2 className="text-h2 text-white mb-md">Thirdweb & Nebula Integration</h2>
              <p className="text-neutral-light/70 mb-lg">
                Configure your Thirdweb and Nebula API credentials. These are required for the Smart Contract AI to function.
              </p>
              <div className="space-y-md">
                {thirdwebConfig.map(key => renderApiKey(key, 'thirdweb'))}
              </div>
            </div>
          )}
          
          {activeTab === 'general' && (
            <div>
              <h2 className="text-h2 text-white mb-md">General Settings</h2>
              <p className="text-neutral-light/70 mb-lg">
                Configure additional platform settings.
              </p>
              <div className="space-y-md">
                {otherConfig.map(key => renderApiKey(key, 'general'))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSaveConfig}
          disabled={isSaving}
          className="btn-primary bg-primary hover:bg-primary-dark text-white px-lg py-md rounded-lg flex items-center gap-sm transition-colors"
        >
          {isSaving ? (
            <>
              <RefreshCw size={20} className="animate-spin" /> 
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Configuration
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Admin; 