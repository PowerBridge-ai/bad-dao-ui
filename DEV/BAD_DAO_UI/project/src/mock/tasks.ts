// Mock data for Tasks
export const mockTasks = [
  {
    id: '1',
    title: 'Implement Token Vesting Contract',
    description: 'Create a smart contract for token vesting with cliff, linear release, and emergency unlock features.',
    assignee: {
      id: '1',
      name: 'Alex Johnson',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    priority: 'high',
    status: 'in-progress',
    tags: ['Solidity', 'Smart Contracts', 'Vesting']
  },
  {
    id: '2',
    title: 'Create API Documentation',
    description: 'Update the API documentation with the new endpoints and examples for the v2 API.',
    assignee: {
      id: '2',
      name: 'Sarah Chen',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    priority: 'medium',
    status: 'in-progress',
    tags: ['Documentation', 'API', 'Technical Writing']
  },
  {
    id: '3',
    title: 'Design Governance Dashboard',
    description: 'Create design mockups for the new governance dashboard including proposal view, voting interface, and analytics.',
    assignee: {
      id: '3',
      name: 'Miguel Rodriguez',
      avatarUrl: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    priority: 'medium',
    status: 'review',
    tags: ['UI/UX', 'Design', 'Governance', 'Figma']
  },
  {
    id: '4',
    title: 'Fix Transaction History Bug',
    description: 'Debug and fix the issue causing transaction history to display incorrect timestamps for certain transaction types.',
    assignee: {
      id: '1',
      name: 'Alex Johnson',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    priority: 'critical',
    status: 'todo',
    tags: ['Bug Fix', 'Debugging', 'Transactions']
  },
  {
    id: '5',
    title: 'Research Optimistic Rollups',
    description: 'Conduct research on optimistic rollups and their potential implementation for scaling our DAO operations.',
    assignee: {
      id: '2',
      name: 'Sarah Chen',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    priority: 'low',
    status: 'backlog',
    tags: ['Research', 'Layer 2', 'Scaling', 'Optimistic Rollups']
  }
];
