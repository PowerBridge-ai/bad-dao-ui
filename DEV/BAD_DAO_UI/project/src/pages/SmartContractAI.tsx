import { useState } from 'react';
import ChatInterface from '../components/ai/ChatInterface';
import ContractSelector from '../components/ai/ContractSelector';

const SmartContractAI = () => {
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock AI response generation
  const handleSendMessage = async (message: string): Promise<string> => {
    setIsLoading(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    
    // Generate mock response based on user message
    if (message.toLowerCase().includes('explain')) {
      return `
This smart contract is a governance contract for the BAD DAO. It has the following key functions:

1. propose(string memory title, string memory description, address target, uint value, bytes memory data) - Creates a new proposal
2. vote(uint256 proposalId, uint8 support) - Allows token holders to vote on proposals
3. execute(uint256 proposalId) - Executes a proposal after it has passed

The contract implements a timelock mechanism, meaning proposals need to wait for a predefined period before they can be executed. This gives DAO members time to review and potentially exit if they disagree with a decision.

Would you like me to explain any specific function in more detail?`;
    } else if (message.toLowerCase().includes('balance') || message.toLowerCase().includes('funds')) {
      return `
The contract currently holds:
- 876.24 ETH (≈ $2,100,000)
- 1,245,000 USDC
- 150,000 USDT
- 113,783 BAD tokens (≈ $141,590 at current price)

The total treasury value is approximately $3,241,590.

Would you like to see recent transactions or generate a withdrawal transaction?`;
    } else if (message.toLowerCase().includes('create') || message.toLowerCase().includes('proposal')) {
      return `
To create a new proposal, you'll need to:

1. Define the proposal title and description
2. Specify the target contract address for the proposal action
3. Define the ETH value to send with the proposal (0 if none)
4. Generate the calldata for the function you want to call

Here's an example of creating a proposal to update the voting period:

\`\`\`solidity
// Create a proposal to update the voting period to 7 days
bytes memory callData = abi.encodeWithSignature("setVotingPeriod(uint256)", 604800);
string memory title = "Update Voting Period";
string memory description = "Change the voting period from 3 days to 7 days to allow more time for consideration";
address target = 0x1234567890abcdef1234567890abcdef12345678; // The governance contract itself
uint value = 0; // No ETH to send

// Then call the propose function
governance.propose(title, description, target, value, callData);
\`\`\`

Would you like me to help you create a specific proposal?`;
    } else {
      return `
I understand you're asking about "${message}" related to this smart contract.

This appears to be a standard ERC-20 governance token contract with voting capabilities. As an AI assistant, I can help you:

1. Analyze the contract functions and security
2. Generate transactions to interact with the contract
3. Explain how different features work
4. Provide code examples for integration

Could you please specify what you'd like to know about this particular aspect of the contract?`;
    }
  };

  return (
    <div className="space-y-xl pb-lg">
      <div>
        <h1 className="text-h1 mb-sm">Smart Contract AI</h1>
        <p className="text-body-lg text-neutral-medium">
          Interact with blockchain contracts through natural language
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-1">
          <ContractSelector 
            onSelectContract={(address) => setSelectedContract(address)}
            selectedContract={selectedContract || undefined}
          />
        </div>
        
        <div className="lg:col-span-2">
          <ChatInterface 
            contractAddress={selectedContract || undefined}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default SmartContractAI;