import { useState } from 'react';
import SmartContractAssistant from '../components/ai/SmartContractAssistant';

const AiAssistantPage = () => {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [showAssistant, setShowAssistant] = useState(false);

  const handleConnectContract = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAssistant(true);
  };

  return (
    <div className="container mx-auto p-lg">
      <div className="mb-xl">
        <h1 className="text-h1 mb-md">Smart Contract AI Assistant</h1>
        <p className="text-body-lg mb-lg">
          Connect to any smart contract and get AI-powered assistance for interacting with it.
          The assistant can help you understand contract functions, analyze on-chain data, and prepare transactions.
        </p>
        
        {!showAssistant ? (
          <div className="max-w-lg mx-auto">
            <div className="card p-lg">
              <h2 className="text-h3 mb-md">Connect to a Smart Contract</h2>
              
              <form onSubmit={handleConnectContract}>
                <div className="mb-md">
                  <label className="block text-body-sm font-medium mb-xs">
                    Contract Address
                  </label>
                  <input 
                    type="text" 
                    className="input w-full"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    placeholder="0x..."
                  />
                </div>
                
                <div className="text-right">
                  <button 
                    type="submit"
                    className="btn-primary"
                    disabled={!contractAddress}
                  >
                    Connect
                  </button>
                </div>
              </form>
              
              <div className="mt-lg text-caption text-center text-neutral-medium">
                Or connect without an address to get general blockchain assistance
              </div>
              
              <div className="mt-md text-center">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowAssistant(true)}
                >
                  Continue without Contract
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[75vh] border border-neutral-light rounded-lg shadow-lg overflow-hidden">
            <SmartContractAssistant 
              initialContractAddress={contractAddress || undefined}
              adminMode={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AiAssistantPage; 