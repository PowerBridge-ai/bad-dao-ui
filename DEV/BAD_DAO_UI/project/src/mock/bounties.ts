// Mock data for Bounties
export const mockBounties = [
  {
    id: '1',
    title: 'Implement Staking Smart Contract',
    description: 'Develop a staking smart contract that allows users to stake tokens and earn rewards. The contract should include timelock functionality and different reward tiers.',
    dao: {
      id: '1',
      name: 'Peaq Network',
      logo: 'https://avatars.githubusercontent.com/u/76402479'
    },
    amount: 2500,
    tokenSymbol: 'PEAQ',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'open',
    applicants: 7,
    difficulty: 'advanced',
    skills: ['Solidity', 'Smart Contracts', 'DeFi']
  },
  {
    id: '2',
    title: 'Create Subgraph for Protocol Data',
    description: 'Develop a subgraph using The Graph protocol to index and query protocol events and metrics for our dashboard and analytics.',
    dao: {
      id: '2',
      name: 'MakerDAO',
      logo: 'https://cryptologos.cc/logos/makerdao-mkr-logo.png'
    },
    amount: 1800,
    tokenSymbol: 'MKR',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    status: 'open',
    applicants: 4,
    difficulty: 'intermediate',
    skills: ['GraphQL', 'The Graph', 'TypeScript']
  },
  {
    id: '3',
    title: 'Optimize Gas for Core Functions',
    description: 'Optimize gas consumption for our core protocol functions. Identify opportunities for reducing gas costs and implement improvements.',
    dao: {
      id: '3',
      name: 'Aragon',
      logo: 'https://cryptologos.cc/logos/aragon-ant-logo.png'
    },
    amount: 3200,
    tokenSymbol: 'ANT',
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'open',
    applicants: 3,
    difficulty: 'expert',
    skills: ['Solidity', 'Gas Optimization', 'EVM']
  }
];
