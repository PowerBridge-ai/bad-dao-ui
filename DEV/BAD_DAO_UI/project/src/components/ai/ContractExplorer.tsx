import { useState } from 'react';
import { Search, Plus, Wallet } from 'lucide-react';

interface ContractExplorerProps {
  onSelectContract: (address: string) => void;
}

interface Contract {
  id: string;
  name: string;
  address: string;
  network: string;
}

const ContractExplorer = ({ onSelectContract }: ContractExplorerProps) => {
  const [contractAddress, setContractAddress] = useState('');
  
  // Mock recent contracts data - in a real app, this would come from storage or API
  const [recentContracts, setRecentContracts] = useState<Contract[]>([
    { id: '1', name: 'Governance Contract', address: '0x1234...5678', network: 'Ethereum' },
    { id: '2', name: 'Treasury', address: '0xabcd...ef12', network: 'Ethereum' },
    { id: '3', name: 'Token Contract', address: '0x7890...abcd', network: 'Ethereum' },
  ]);

  const handleConnectContract = () => {
    if (contractAddress) {
      onSelectContract(contractAddress);
      setContractAddress('');
    }
  };

  return (
    <div className="border-t border-neutral-light/20 pt-md px-md h-full flex flex-col">
      <h3 className="text-h3 mb-md">Contract Explorer</h3>
      
      <div className="relative mb-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-medium" size={16} />
        <input
          type="text"
          className="input w-full pl-10 bg-neutral-dark/50 border-neutral-light/30 text-white"
          placeholder="Enter contract address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
      </div>
      
      <button
        className="btn-primary w-full mb-md flex items-center justify-center"
        onClick={handleConnectContract}
        disabled={!contractAddress}
      >
        Connect Contract
      </button>
      
      <div className="flex-1 overflow-hidden">
        <h4 className="text-body-sm text-neutral-medium mb-sm">Recent Contracts</h4>
        <div className="space-y-sm overflow-auto max-h-full pr-1">
          {recentContracts.map(contract => (
            <div
              key={contract.id}
              className="p-sm border border-neutral-light/20 rounded-lg bg-neutral-dark/40 hover:bg-neutral-dark/60 cursor-pointer transition-colors"
              onClick={() => onSelectContract(contract.address)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-body-sm font-medium">{contract.name}</div>
                  <div className="text-caption text-neutral-medium">{contract.address}</div>
                </div>
                <div className="flex items-center text-caption text-neutral-medium">
                  <Wallet size={14} className="mr-1" />
                  {contract.network}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button className="absolute bottom-6 right-6 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors">
        <Plus size={20} />
      </button>
    </div>
  );
};

export default ContractExplorer; 