import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Wallet, 
  Coins, 
  Clock, 
  Users, 
  Bot, 
  Save,
  Code,
  Play,
  AlertTriangle
} from 'lucide-react';

// Mock contract configurations based on type
const contractConfigOptions = {
  governance: [
    { name: 'votingPeriod', label: 'Voting Period', type: 'select', options: ['1 day', '3 days', '7 days', '14 days'] },
    { name: 'quorum', label: 'Quorum', type: 'select', options: ['5%', '10%', '20%', '33%', '51%'] },
    { name: 'proposalThreshold', label: 'Proposal Threshold', type: 'select', options: ['0.1%', '1%', '5%', '10%'] },
    { name: 'executionDelay', label: 'Execution Delay', type: 'select', options: ['24 hours', '48 hours', '72 hours'] }
  ],
  token: [
    { name: 'name', label: 'Token Name', type: 'text' },
    { name: 'symbol', label: 'Token Symbol', type: 'text' },
    { name: 'decimals', label: 'Decimals', type: 'select', options: ['6', '8', '18'] },
    { name: 'initialSupply', label: 'Initial Supply', type: 'text' },
    { name: 'maxSupply', label: 'Maximum Supply', type: 'text' },
    { name: 'isMintable', label: 'Mintable', type: 'checkbox' },
    { name: 'isBurnable', label: 'Burnable', type: 'checkbox' }
  ],
  vesting: [
    { name: 'cliffPeriod', label: 'Cliff Period', type: 'select', options: ['0', '6 months', '1 year'] },
    { name: 'vestingDuration', label: 'Vesting Duration', type: 'select', options: ['1 year', '2 years', '3 years', '4 years'] },
    { name: 'releaseInterval', label: 'Release Interval', type: 'select', options: ['Monthly', 'Quarterly', 'Yearly'] }
  ],
  delegation: [
    { name: 'canDelegatePartial', label: 'Partial Delegation', type: 'checkbox' },
    { name: 'minDelegationPeriod', label: 'Min Delegation Period', type: 'select', options: ['No minimum', '1 week', '1 month'] },
    { name: 'delegationFee', label: 'Delegation Fee', type: 'select', options: ['0%', '0.1%', '0.5%', '1%'] }
  ],
  ai: [
    { name: 'modelType', label: 'AI Model Type', type: 'select', options: ['Basic', 'Advanced', 'Premium'] },
    { name: 'automationLevel', label: 'Automation Level', type: 'select', options: ['Manual', 'Semi-automated', 'Fully automated'] },
    { name: 'aiValidation', label: 'AI Validation', type: 'checkbox' }
  ],
  treasury: [
    { name: 'approvalThreshold', label: 'Approval Threshold', type: 'select', options: ['1 signature', '2 signatures', '3 signatures'] },
    { name: 'dailyLimit', label: 'Daily Spending Limit', type: 'text' },
    { name: 'cooldownPeriod', label: 'Transaction Cooldown', type: 'select', options: ['None', '24 hours', '48 hours'] }
  ]
};

// Types
type ContractType = 'governance' | 'token' | 'vesting' | 'delegation' | 'ai' | 'treasury';

interface Contract {
  id: string;
  name: string;
  type: ContractType;
  description: string;
  deployedAddress?: string;
  isDeployed: boolean;
  configuration: Record<string, any>;
}

const ContractEdit = () => {
  const { daoId, contractId } = useParams<{ daoId: string; contractId: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [showDeployConfirm, setShowDeployConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real app, fetch the contract data from API
    const fetchContract = async () => {
      try {
        // Mock data for demonstration
        const mockContract: Contract = {
          id: contractId || 'contract-1',
          name: 'Main Governance',
          type: 'governance',
          description: 'Primary governance contract for the DAO',
          isDeployed: false,
          configuration: {
            votingPeriod: '3 days',
            quorum: '20%',
            proposalThreshold: '1%',
            executionDelay: '24 hours'
          }
        };
        
        setContract(mockContract);
        setFormData(mockContract.configuration);
      } catch (error) {
        console.error('Error fetching contract:', error);
        setError('Failed to load contract details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContract();
  }, [contractId, daoId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const renderConfigFields = () => {
    if (!contract) return null;
    
    const fields = contractConfigOptions[contract.type] || [];
    
    return fields.map(field => (
      <div key={field.name} className="mb-md">
        <label className="block text-white mb-xs">
          {field.label}
        </label>
        
        {field.type === 'text' && (
          <input
            type="text"
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2 text-white"
          />
        )}
        
        {field.type === 'select' && (
          <select
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2 text-white"
          >
            <option value="">Select {field.label}</option>
            {field.options && field.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
        
        {field.type === 'checkbox' && (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={field.name}
              checked={formData[field.name] || false}
              onChange={handleInputChange}
              className="mr-2 h-5 w-5"
            />
            <span className="text-white">Enable {field.label}</span>
          </div>
        )}
      </div>
    ));
  };
  
  const handleSave = async () => {
    if (!contract) return;
    
    try {
      // In a real app, this would be an API call
      // await contractService.updateContract(daoId, contractId, formData);
      
      // Mock successful save
      const updatedContract = {
        ...contract,
        configuration: formData
      };
      
      setContract(updatedContract);
      // Show success message
      alert('Contract configuration saved successfully');
    } catch (error) {
      console.error('Error saving contract:', error);
      setError('Failed to save contract configuration');
    }
  };
  
  const handleDeploy = async () => {
    if (!contract) return;
    
    try {
      // In a real app, this would be an API call to deploy the contract
      // await contractService.deployContract(daoId, contractId);
      
      // Mock successful deployment
      const deployedContract = {
        ...contract,
        isDeployed: true,
        deployedAddress: '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 10)
      };
      
      setContract(deployedContract);
      setShowDeployConfirm(false);
      // Show success message
      alert('Contract deployed successfully');
    } catch (error) {
      console.error('Error deploying contract:', error);
      setError('Failed to deploy contract');
      setShowDeployConfirm(false);
    }
  };
  
  const renderContractIcon = () => {
    if (!contract) return null;
    
    switch (contract.type) {
      case 'governance':
        return <Shield size={32} className="text-primary" />;
      case 'token':
        return <Coins size={32} className="text-primary" />;
      case 'vesting':
        return <Clock size={32} className="text-primary" />;
      case 'delegation':
        return <Users size={32} className="text-primary" />;
      case 'ai':
        return <Bot size={32} className="text-primary" />;
      case 'treasury':
        return <Wallet size={32} className="text-primary" />;
      default:
        return null;
    }
  };
  
  const renderContractPreview = () => {
    if (!contract) return null;
    
    // Generate a mock solidity contract based on the contract type and configuration
    let solidityCode = '';
    
    switch (contract.type) {
      case 'governance':
        solidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/compatibility/GovernorCompatibilityBravo.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract ${contract.name.replace(/\s+/g, '')} is Governor, GovernorCompatibilityBravo, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl {
    constructor(
        IVotes _token,
        TimelockController _timelock
    )
        Governor("${contract.name}")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(${(formData.quorum || '20%').replace('%', '') / 100})
        GovernorTimelockControl(_timelock)
    {}

    function votingDelay() public pure override returns (uint256) {
        return 1; // 1 block
    }

    function votingPeriod() public pure override returns (uint256) {
        // ${formData.votingPeriod || '3 days'}
        return ${formData.votingPeriod?.includes('day') ? formData.votingPeriod.split(' ')[0] * 7200 : 21600}; // blocks
    }

    function proposalThreshold() public pure override returns (uint256) {
        // ${formData.proposalThreshold || '1%'}
        return ${(formData.proposalThreshold || '1%').replace('%', '') * 1e16};
    }

    // The functions below are overrides required by Solidity.
    function state(uint256 proposalId) public view override(Governor, IGovernor, GovernorTimelockControl) returns (ProposalState) {
        return super.state(proposalId);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor, GovernorCompatibilityBravo, IGovernor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId) public view override(Governor, IERC165, GovernorTimelockControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}`;
        break;
        
      case 'token':
        solidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
${formData.isBurnable ? 'import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";' : ''}

contract ${formData.name || 'MyToken'} is ERC20, Ownable${formData.isBurnable ? ', ERC20Burnable' : ''} {
    uint8 private _decimals = ${formData.decimals || '18'};
    ${formData.maxSupply ? `uint256 public maxSupply = ${formData.maxSupply} * 10 ** decimals();` : ''}

    constructor() ERC20("${formData.name || 'MyToken'}", "${formData.symbol || 'MTK'}") {
        _mint(msg.sender, ${formData.initialSupply || '1000000'} * 10 ** decimals());
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    ${formData.isMintable ? `
    function mint(address to, uint256 amount) public onlyOwner {
        ${formData.maxSupply ? 'require(totalSupply() + amount <= maxSupply, "Exceeds max supply");' : ''}
        _mint(to, amount);
    }` : ''}
}`;
        break;
        
      case 'vesting':
        solidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TokenVesting is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct VestingSchedule {
        address beneficiary;
        uint256 cliff;
        uint256 start;
        uint256 duration;
        uint256 slicePeriodSeconds;
        uint256 amountTotal;
        uint256 released;
        bool revocable;
        bool revoked;
    }

    // Token to be vested
    IERC20 private immutable _token;

    // Vesting schedules
    bytes32[] private vestingSchedulesIds;
    mapping(bytes32 => VestingSchedule) private vestingSchedules;
    mapping(address => uint256) private holdersVestingCount;

    // Cliff period (${formData.cliffPeriod || '0'})
    uint256 private constant CLIFF_PERIOD = ${formData.cliffPeriod?.includes('month') ? formData.cliffPeriod.split(' ')[0] * 30 * 24 * 60 * 60 : formData.cliffPeriod?.includes('year') ? formData.cliffPeriod.split(' ')[0] * 365 * 24 * 60 * 60 : '0'};
    
    // Vesting duration (${formData.vestingDuration || '1 year'})
    uint256 private constant VESTING_DURATION = ${formData.vestingDuration?.includes('year') ? formData.vestingDuration.split(' ')[0] * 365 * 24 * 60 * 60 : '31536000'};
    
    // Release interval (${formData.releaseInterval || 'Monthly'})
    uint256 private constant RELEASE_INTERVAL = ${formData.releaseInterval === 'Monthly' ? '2592000' : formData.releaseInterval === 'Quarterly' ? '7776000' : '31536000'};

    constructor(address token_) {
        require(token_ != address(0), "TokenVesting: token cannot be zero address");
        _token = IERC20(token_);
    }

    // More complex vesting contract code would follow...
}`;
        break;
        
      default:
        solidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Sample contract for ${contract.type} type
// Full implementation would include all configured parameters:
${Object.entries(formData).map(([key, value]) => `// ${key}: ${value}`).join('\n')}`;
    }
    
    return (
      <div className="bg-[#1E1E2E] rounded-lg p-md overflow-auto max-h-[50vh]">
        <pre className="text-gray-300 text-sm whitespace-pre-wrap">
          <code>{solidityCode}</code>
        </pre>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="animate-pulse space-y-lg">
        <div className="h-48 bg-neutral-light/50 rounded-lg"></div>
        <div className="h-96 bg-neutral-light/50 rounded-lg"></div>
      </div>
    );
  }
  
  if (error || !contract) {
    return (
      <div className="bg-neutral-dark rounded-lg p-lg text-center">
        <AlertTriangle size={48} className="text-accent-red mx-auto mb-lg" />
        <h2 className="text-h3 mb-md text-accent-red">Error</h2>
        <p className="text-white mb-lg">{error || 'Contract not found'}</p>
        <button 
          className="btn-primary"
          onClick={() => navigate(`/dao/${daoId}/governance`)}
        >
          Back to Governance
        </button>
      </div>
    );
  }
  
  return (
    <div className="pb-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-lg">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(`/dao/${daoId}/governance`)}
            className="flex items-center text-white mr-md"
          >
            <ArrowLeft size={20} className="mr-xs" />
            <span>Back to Governance</span>
          </button>
          <h1 className="text-h2">Edit Contract</h1>
        </div>
        
        <div className="flex items-center gap-md">
          <button 
            className="btn-secondary flex items-center"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Code size={18} className="mr-xs" />
            <span>{showPreview ? 'Hide Code' : 'Preview Code'}</span>
          </button>
          
          <button 
            className="btn-primary flex items-center"
            onClick={handleSave}
          >
            <Save size={18} className="mr-xs" />
            <span>Save Configuration</span>
          </button>
          
          {!contract.isDeployed && (
            <button 
              className="btn-accent flex items-center"
              onClick={() => setShowDeployConfirm(true)}
            >
              <Play size={18} className="mr-xs" />
              <span>Deploy Contract</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Contract Overview */}
      <div className="bg-neutral-dark rounded-lg p-lg mb-lg">
        <div className="flex items-start">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mr-lg">
            {renderContractIcon()}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center">
              <h2 className="text-h3 mr-md">{contract.name}</h2>
              {contract.isDeployed && (
                <span className="badge bg-accent-green/20 text-accent-green">Deployed</span>
              )}
            </div>
            
            <p className="text-neutral-light mb-2">{contract.description}</p>
            
            {contract.deployedAddress && (
              <div className="text-sm text-neutral-light">
                <span className="font-medium">Contract Address:</span> {contract.deployedAddress}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Code Preview */}
      {showPreview && (
        <div className="mb-lg">
          <h2 className="text-h3 mb-md">Contract Code Preview</h2>
          {renderContractPreview()}
        </div>
      )}
      
      {/* Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <div>
          <h2 className="text-h3 mb-md">Contract Configuration</h2>
          <div className="bg-neutral-dark rounded-lg p-lg">
            {renderConfigFields()}
          </div>
        </div>
        
        <div>
          <h2 className="text-h3 mb-md">Advanced Settings</h2>
          <div className="bg-neutral-dark rounded-lg p-lg">
            <p className="text-neutral-light mb-lg">
              Configure advanced settings for your {contract.type} contract. These settings determine how
              your contract will behave on the blockchain.
            </p>
            
            <div className="space-y-md">
              <div className="mb-md">
                <label className="block text-white mb-xs">
                  Network
                </label>
                <select
                  className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2 text-white"
                  defaultValue="ethereum"
                >
                  <option value="ethereum">Ethereum Mainnet</option>
                  <option value="polygon">Polygon</option>
                  <option value="arbitrum">Arbitrum</option>
                  <option value="optimism">Optimism</option>
                  <option value="goerli">Goerli Testnet</option>
                </select>
              </div>
              
              <div className="mb-md">
                <label className="block text-white mb-xs">
                  Gas Optimization
                </label>
                <select
                  className="w-full bg-neutral-dark border border-neutral-light/30 rounded-lg p-2 text-white"
                  defaultValue="standard"
                >
                  <option value="minimal">Minimal (Lower Gas)</option>
                  <option value="standard">Standard</option>
                  <option value="full">Full (More Features)</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="upgradeableContract"
                  className="mr-2 h-5 w-5"
                  defaultChecked
                />
                <label htmlFor="upgradeableContract" className="text-white">
                  Make Contract Upgradeable
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verifyContract"
                  className="mr-2 h-5 w-5"
                  defaultChecked
                />
                <label htmlFor="verifyContract" className="text-white">
                  Verify Contract on Explorer
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Deploy Confirmation Modal */}
      {showDeployConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-md">
          <div className="bg-neutral-dark rounded-lg w-full max-w-lg">
            <div className="p-lg">
              <h2 className="text-h3 mb-md">Deploy Contract</h2>
              <p className="text-white mb-lg">
                You are about to deploy the "{contract.name}" contract to the blockchain. This action cannot be undone.
                Gas fees will apply.
              </p>
              
              <div className="bg-neutral p-md rounded-lg mb-lg">
                <div className="flex justify-between mb-xs">
                  <span className="text-neutral-light">Contract Type:</span>
                  <span className="text-white">{contract.type.charAt(0).toUpperCase() + contract.type.slice(1)}</span>
                </div>
                <div className="flex justify-between mb-xs">
                  <span className="text-neutral-light">Estimated Gas:</span>
                  <span className="text-white">0.05 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-light">Deployment Time:</span>
                  <span className="text-white">~2 minutes</span>
                </div>
              </div>
              
              <div className="flex justify-end gap-md">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowDeployConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-accent"
                  onClick={handleDeploy}
                >
                  Confirm Deployment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractEdit; 