import dbService, { Space, SpaceMember, SpaceActivity, TreasuryAsset } from '../services/database';

// Sample mock data for spaces
const sampleSpaces: Space[] = [
  {
    name: 'Stargate DAO',
    creator: '0x1234567890abcdef1234567890abcdef12345678',
    description: 'Stargate is a fully composable liquidity transport protocol that lives at the heart of Omnichain DeFi.',
    categories: ['DeFi', 'Bridge'],
    isPublic: true,
    logo: '/mock/stargate-logo.png',
  },
  {
    name: 'Arbitrum DAO',
    creator: '0xabcdef1234567890abcdef1234567890abcdef12',
    description: 'The official snapshot space for the Arbitrum DAO',
    categories: ['L2', 'Ethereum'],
    isPublic: true,
    logo: '/mock/arbitrum-logo.png',
  },
  {
    name: 'Aave DAO',
    creator: '0x90abcdef1234567890abcdef1234567890abcdef',
    description: 'Aave is an Open Source Protocol to create Non-Custodial Liquidity Markets.',
    categories: ['DeFi', 'Lending'],
    isPublic: true,
    logo: '/mock/aave-logo.png',
  },
  {
    name: 'Aavegotchi',
    creator: '0x7890abcdef1234567890abcdef1234567890abcd',
    description: 'A decentralized community building the future of gaming.',
    categories: ['Gaming', 'NFT'],
    isPublic: true,
    logo: '/mock/aavegotchi-logo.png',
  },
  {
    name: 'Uniswap',
    creator: '0x567890abcdef1234567890abcdef1234567890ab',
    description: 'Only delegated UNI may be used to vote on proposals. You can delegate to yourself or others.',
    categories: ['DeFi', 'Exchange'],
    isPublic: true,
    logo: '/mock/uniswap-logo.png',
  }
];

// Sample members for each space
const generateMembersForSpace = (spaceId: string): SpaceMember[] => {
  const members: SpaceMember[] = [
    {
      spaceId,
      address: '0x1234567890abcdef1234567890abcdef12345678',
      displayName: 'Alex',
      role: 'admin',
      joinedAt: new Date(2023, 5, 15)
    },
    {
      spaceId,
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      displayName: 'Taylor',
      role: 'moderator',
      joinedAt: new Date(2023, 6, 20)
    },
    {
      spaceId,
      address: '0x7890abcdef1234567890abcdef1234567890abcd',
      role: 'member',
      joinedAt: new Date(2023, 7, 10)
    },
    {
      spaceId,
      address: '0x567890abcdef1234567890abcdef1234567890ab',
      displayName: 'Jordan',
      role: 'member',
      joinedAt: new Date(2023, 8, 5)
    },
    {
      spaceId,
      address: '0x90abcdef1234567890abcdef1234567890abcdef',
      role: 'member',
      joinedAt: new Date(2023, 9, 12)
    }
  ];
  
  return members;
};

// Sample activities for each space
const generateActivitiesForSpace = (spaceId: string): SpaceActivity[] => {
  const activities: SpaceActivity[] = [
    {
      spaceId,
      type: 'proposal_created',
      timestamp: new Date(2023, 10, 15, 14, 30),
      actorAddress: '0x1234567890abcdef1234567890abcdef12345678',
      actorDisplayName: 'Alex',
      data: {
        title: 'Treasury fund allocation for Q1',
        proposalId: `${spaceId}-prop1`
      }
    },
    {
      spaceId,
      type: 'proposal_vote',
      timestamp: new Date(2023, 10, 16, 9, 45),
      actorAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      actorDisplayName: 'Taylor',
      data: {
        proposalId: `${spaceId}-prop1`,
        vote: 'for'
      }
    },
    {
      spaceId,
      type: 'member_joined',
      timestamp: new Date(2023, 10, 17, 11, 20),
      actorAddress: '0x567890abcdef1234567890abcdef1234567890ab',
      actorDisplayName: 'Jordan',
      data: {}
    },
    {
      spaceId,
      type: 'proposal_vote',
      timestamp: new Date(2023, 10, 18, 16, 10),
      actorAddress: '0x90abcdef1234567890abcdef1234567890abcdef',
      data: {
        proposalId: `${spaceId}-prop1`,
        vote: 'against'
      }
    },
    {
      spaceId,
      type: 'proposal_created',
      timestamp: new Date(2023, 10, 20, 13, 25),
      actorAddress: '0x1234567890abcdef1234567890abcdef12345678',
      actorDisplayName: 'Alex',
      data: {
        title: 'Community development initiatives',
        proposalId: `${spaceId}-prop2`
      }
    }
  ];
  
  return activities;
};

// Sample treasury assets for each space
const generateTreasuryForSpace = (spaceId: string): TreasuryAsset[] => {
  const assets: TreasuryAsset[] = [
    {
      spaceId,
      token: 'Ethereum',
      symbol: 'ETH',
      amount: 24.5,
      value: 73500
    },
    {
      spaceId,
      token: 'USD Coin',
      symbol: 'USDC',
      amount: 50000,
      value: 50000
    },
    {
      spaceId,
      token: 'Space Token',
      symbol: 'SPACE',
      amount: 1000000,
      value: 30000
    }
  ];
  
  return assets;
};

// Seed the database with sample data
export const seedDatabase = async (): Promise<void> => {
  console.log('Seeding database with sample data...');
  
  // Initialize database
  await dbService.initDatabase();
  
  // Clear local storage (for testing)
  localStorage.removeItem('bad_dao_spaces');
  localStorage.removeItem('bad_dao_members');
  localStorage.removeItem('bad_dao_activities');
  localStorage.removeItem('bad_dao_treasury');
  
  // Re-initialize
  await dbService.initDatabase();
  
  // Create spaces and related data
  for (const spaceData of sampleSpaces) {
    try {
      // Create space
      const space = await dbService.createSpace(spaceData);
      
      if (space && space.id) {
        const spaceId = space.id;
        
        // Generate random proposal and vote counts
        const proposalCount = Math.floor(Math.random() * 100) + 10;
        const voteCount = proposalCount * (Math.floor(Math.random() * 500) + 100);
        
        // Update space with counts
        await dbService.updateSpace(spaceId, { 
          proposalCount, 
          voteCount 
        });
        
        // Add members
        const members = generateMembersForSpace(spaceId);
        for (const member of members) {
          await dbService.addSpaceMember(member);
        }
        
        // Add activities
        const activities = generateActivitiesForSpace(spaceId);
        for (const activity of activities) {
          await dbService.addSpaceActivity(activity);
        }
        
        // Add treasury assets
        const assets = generateTreasuryForSpace(spaceId);
        await dbService.updateSpaceTreasury(spaceId, assets);
        
        console.log(`Created space: ${space.name} with ID: ${spaceId}`);
      }
    } catch (error) {
      console.error(`Error creating space ${spaceData.name}:`, error);
    }
  }
  
  console.log('Database seeding completed!');
};

export default seedDatabase; 