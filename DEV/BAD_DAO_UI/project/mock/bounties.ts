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
    description: 'Develop a subgraph to index our protocol data for easier access and analysis. Should include key metrics and events from our core contracts.',
    dao: {
      id: '2',
      name: 'MakerDAO',
      logo: 'https://cryptologos.cc/logos/makerdao-mkr-logo.png'
    },
    amount: 1800,
    tokenSymbol: 'DAI',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    status: 'open',
    applicants: 3,
    difficulty: 'intermediate',
    skills: ['The Graph', 'GraphQL', 'JavaScript']
  },
  {
    id: '3',
    title: 'Improve Frontend UX for Mobile',
    description: 'Optimize our dApp for mobile devices, focusing on responsive design and touch interactions. Should work seamlessly on iOS and Android devices.',
    dao: {
      id: '3',
      name: 'Aragon',
      logo: 'https://cryptologos.cc/logos/aragon-ant-logo.png'
    },
    amount: 1200,
    tokenSymbol: 'ANT',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'in-progress',
    applicants: 5,
    difficulty: 'intermediate',
    skills: ['React', 'UI/UX', 'Responsive Design']
  },
  {
    id: '4',
    title: 'Audit Smart Contract Security',
    description: 'Perform a comprehensive security audit of our core protocol contracts, identifying vulnerabilities and proposing fixes.',
    dao: {
      id: '4',
      name: 'Aave',
      logo: 'https://cryptologos.cc/logos/aave-aave-logo.png'
    },
    amount: 5000,
    tokenSymbol: 'AAVE',
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    status: 'open',
    applicants: 2,
    difficulty: 'expert',
    skills: ['Solidity', 'Security', 'Auditing']
  },
  {
    id: '5',
    title: 'Create Educational Content',
    description: 'Develop educational content (articles, videos) explaining how to use our protocol for beginners. Should cover key concepts and provide step-by-step guides.',
    dao: {
      id: '5',
      name: 'Balancer',
      logo: 'https://cryptologos.cc/logos/balancer-bal-logo.png'
    },
    amount: 800,
    tokenSymbol: 'BAL',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    status: 'review',
    applicants: 9,
    difficulty: 'beginner',
    skills: ['Content Creation', 'Technical Writing', 'Video Production']
  },
  {
    id: '6',
    title: 'Implement Multi-Chain Support',
    description: 'Extend our protocol to support additional EVM-compatible chains including Polygon, Arbitrum, and Optimism. Ensure consistent functionality across chains.',
    dao: {
      id: '6',
      name: 'Compound',
      logo: 'https://cryptologos.cc/logos/compound-comp-logo.png'
    },
    amount: 3500,
    tokenSymbol: 'COMP',
    dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    status: 'open',
    applicants: 4,
    difficulty: 'advanced',
    skills: ['Solidity', 'Cross-chain', 'Bridges']
  },
  {
    id: '7',
    title: 'Create Analytics Dashboard',
    description: 'Build an analytics dashboard showcasing key protocol metrics. Should include charts, graphs, and exportable data.',
    dao: {
      id: '1',
      name: 'Peaq Network',
      logo: 'https://avatars.githubusercontent.com/u/76402479'
    },
    amount: 1700,
    tokenSymbol: 'PEAQ',
    dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: 'open',
    applicants: 6,
    difficulty: 'intermediate',
    skills: ['React', 'D3.js', 'Data Visualization']
  },
  {
    id: '8',
    title: 'Improve Documentation',
    description: 'Enhance and expand our developer documentation. Focus on API references, examples, and troubleshooting guides.',
    dao: {
      id: '2',
      name: 'MakerDAO',
      logo: 'https://cryptologos.cc/logos/makerdao-mkr-logo.png'
    },
    amount: 1000,
    tokenSymbol: 'DAI',
    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    status: 'completed',
    applicants: 11,
    difficulty: 'beginner',
    skills: ['Technical Writing', 'Documentation', 'Markdown']
  }
]; 