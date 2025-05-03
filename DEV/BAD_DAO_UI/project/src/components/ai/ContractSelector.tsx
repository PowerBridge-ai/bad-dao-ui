import { useState, useEffect } from 'react';
import { Search, Plus, History, Circle } from 'lucide-react';

interface Contract {
  address: string;
  name?: string;
  network: string;
  lastUsed: Date;
}

interface ContractSelectorProps {
  onSelectContract: (address: string) => void;
  selectedContract?: string;
}

const ContractSelector = ({ onSelectContract, selectedContract }: ContractSelectorProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [recentContracts, setRecentContracts] = useState<Contract[]>([
    {
      address: '0x1234567890abcdef1234567890abcdef12345678',
      name: 'Governance Contract',
      network: 'Ethereum',
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      name: 'Treasury',
      network: 'Ethereum',
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 48),
    },
    {
      address: '0x7890abcdef1234567890abcdef1234567890abcd',
      name: 'Token Contract',
      network: 'Ethereum',
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 72),
    },
  ]);
  const [isAddressValid, setIsAddressValid] = useState(false);

  // Validate Ethereum address
  useEffect(() => {
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(searchValue);
    setIsAddressValid(isValid);
  }, [searchValue]);

  const filteredContracts = recentContracts.filter(
    (contract) =>
      contract.address.toLowerCase().includes(searchValue.toLowerCase()) ||
      (contract.name && contract.name.toLowerCase().includes(searchValue.toLowerCase()))
  );

  const handleSelectContract = (address: string) => {
    onSelectContract(address);
    
    // Update recent contracts
    const updatedRecents = [...recentContracts];
    const existingIndex = updatedRecents.findIndex(c => c.address === address);
    
    if (existingIndex >= 0) {
      // Update last used time
      updatedRecents[existingIndex] = {
        ...updatedRecents[existingIndex],
        lastUsed: new Date(),
      };
    } else {
      // Add to recents
      updatedRecents.unshift({
        address,
        network: 'Ethereum',
        lastUsed: new Date(),
      });
    }
    
    setRecentContracts(updatedRecents);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddressValid) {
      handleSelectContract(searchValue);
    }
  };

  return (
    <div className="card">
      <h3 className="text-h3 mb-md">Contract Explorer</h3>
      
      <form onSubmit={handleSubmit} className="mb-lg">
        <div className="relative">
          <input
            type="text"
            className="input w-full pl-10"
            placeholder="Enter contract address"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-3.5 text-neutral-medium" />
        </div>
        
        <div className="flex gap-md mt-md">
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={!isAddressValid}
          >
            Connect Contract
          </button>
          
          <button
            type="button"
            className="btn-secondary"
            onClick={() => console.log('Add new contract')}
          >
            <Plus size={18} />
          </button>
        </div>
      </form>
      
      <div>
        <div className="flex items-center gap-2 mb-md">
          <History size={16} className="text-neutral-medium" />
          <h4 className="text-label">Recent Contracts</h4>
        </div>
        
        <div className="space-y-md">
          {filteredContracts.length > 0 ? (
            filteredContracts.map((contract) => (
              <button
                key={contract.address}
                className={`w-full text-left p-md rounded-lg border transition-colors ${
                  selectedContract === contract.address
                    ? 'border-primary bg-primary/5'
                    : 'border-neutral-light hover:border-primary/30 hover:bg-primary/5'
                }`}
                onClick={() => handleSelectContract(contract.address)}
              >
                <div className="flex items-center mb-1">
                  <Circle size={10} className="text-accent-green mr-2" />
                  <span className="text-body font-medium">
                    {contract.name || `Contract ${contract.address.slice(0, 6)}...${contract.address.slice(-4)}`}
                  </span>
                </div>
                <div className="flex justify-between text-body-sm text-neutral-medium">
                  <span>{contract.address.slice(0, 6)}...{contract.address.slice(-4)}</span>
                  <span>{contract.network}</span>
                </div>
              </button>
            ))
          ) : (
            <p className="text-body text-neutral-medium py-md">
              No matching contracts found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractSelector;