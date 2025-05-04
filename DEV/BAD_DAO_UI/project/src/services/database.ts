// Space type definition
export interface Space {
  id?: string;
  name: string;
  creator: string;
  description: string;
  categories: string[];
  isPublic: boolean;
  createdAt?: Date;
  logo?: string;
  proposalCount?: number;
  voteCount?: number;
  membersCount?: number;
  treasuryValue?: number;
  privacySettings?: {
    treasuryVisible: boolean;
    membersVisible: boolean;
    activitiesVisible: boolean;
  };
}

// Space Member type
export interface SpaceMember {
  id?: string;
  spaceId: string;
  address: string;
  displayName?: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
}

// Space Activity type
export interface SpaceActivity {
  id?: string;
  spaceId: string;
  type: 'proposal_created' | 'proposal_vote' | 'member_joined';
  timestamp: Date;
  actorAddress: string;
  actorDisplayName?: string;
  data: Record<string, any>;
}

// Space Treasury Asset
export interface TreasuryAsset {
  id?: string;
  spaceId: string;
  token: string;
  symbol: string;
  amount: number;
  value: number;
}

// Mock database using localStorage
const STORAGE_KEY = 'bad_dao_spaces';
const MEMBERS_KEY = 'bad_dao_members';
const ACTIVITIES_KEY = 'bad_dao_activities';
const TREASURY_KEY = 'bad_dao_treasury';

// Initialize database
export const initDatabase = async (): Promise<boolean> => {
  try {
    // Check if storage is already initialized and initialize if needed
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(MEMBERS_KEY)) {
      localStorage.setItem(MEMBERS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(ACTIVITIES_KEY)) {
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(TREASURY_KEY)) {
      localStorage.setItem(TREASURY_KEY, JSON.stringify([]));
    }
    
    console.log('Mock database initialized successfully');
    
    // Sample implementation for PostgreSQL client connection (commented out)
    /*
    // PostgreSQL implementation would look like this:
    import { Pool } from 'pg';
    
    const pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'bad_dao',
      password: 'ATI123#4567',
      port: 5432,
    });
    
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS spaces (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        creator VARCHAR(100) NOT NULL,
        description TEXT,
        categories TEXT[],
        is_public BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        logo VARCHAR(255),
        proposal_count INTEGER DEFAULT 0,
        vote_count INTEGER DEFAULT 0,
        members_count INTEGER DEFAULT 0,
        treasury_value NUMERIC(20,2) DEFAULT 0,
        privacy_settings JSONB DEFAULT '{"treasuryVisible": true, "membersVisible": true, "activitiesVisible": true}'
      );
      
      CREATE TABLE IF NOT EXISTS space_members (
        id SERIAL PRIMARY KEY,
        space_id INTEGER REFERENCES spaces(id) ON DELETE CASCADE,
        address VARCHAR(100) NOT NULL,
        display_name VARCHAR(100),
        role VARCHAR(20) NOT NULL,
        joined_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(space_id, address)
      );
      
      CREATE TABLE IF NOT EXISTS space_activities (
        id SERIAL PRIMARY KEY,
        space_id INTEGER REFERENCES spaces(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW(),
        actor_address VARCHAR(100) NOT NULL,
        actor_display_name VARCHAR(100),
        data JSONB
      );
      
      CREATE TABLE IF NOT EXISTS treasury_assets (
        id SERIAL PRIMARY KEY,
        space_id INTEGER REFERENCES spaces(id) ON DELETE CASCADE,
        token VARCHAR(100) NOT NULL,
        symbol VARCHAR(20) NOT NULL,
        amount NUMERIC(30,8) NOT NULL,
        value NUMERIC(20,2) NOT NULL
      );
    `);
    */
    
    return true;
  } catch (error) {
    console.error('Error initializing mock database:', error);
    return false;
  }
};

// Create a new space
export const createSpace = async (space: Space): Promise<Space | null> => {
  try {
    // Get existing spaces
    const spaces = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Generate a unique ID
    const newId = Date.now().toString();
    
    // Create new space with additional fields
    const newSpace = {
      ...space,
      id: newId,
      createdAt: new Date(),
      proposalCount: 0,
      voteCount: 0,
      membersCount: 1, // Creator is the first member
      treasuryValue: 0,
      privacySettings: {
        treasuryVisible: true,
        membersVisible: true,
        activitiesVisible: true
      }
    };
    
    // Add to storage
    spaces.push(newSpace);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spaces));
    
    // Create initial member (creator as admin)
    const members = JSON.parse(localStorage.getItem(MEMBERS_KEY) || '[]');
    members.push({
      id: Date.now().toString() + '1',
      spaceId: newId,
      address: space.creator,
      role: 'admin',
      joinedAt: new Date()
    });
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    
    // Log activity
    const activities = JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || '[]');
    activities.push({
      id: Date.now().toString() + '2',
      spaceId: newId,
      type: 'member_joined',
      timestamp: new Date(),
      actorAddress: space.creator,
      data: {}
    });
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
    
    return newSpace;
  } catch (error) {
    console.error('Error creating space in mock database:', error);
    return null;
  }
};

// Get all spaces
export const getAllSpaces = async (): Promise<Space[]> => {
  try {
    // Get spaces from storage
    const spaces = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Convert date strings back to Date objects
    return spaces.map((space: any) => ({
      ...space,
      createdAt: space.createdAt ? new Date(space.createdAt) : undefined
    }));
  } catch (error) {
    console.error('Error fetching spaces from mock database:', error);
    return [];
  }
};

// Get space by ID
export const getSpaceById = async (id: string): Promise<Space | null> => {
  try {
    // Get spaces from storage
    const spaces: Space[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Find space by ID
    const space = spaces.find(s => s.id === id);
    
    if (!space) {
      return null;
    }
    
    // Convert date string back to Date object
    return {
      ...space,
      createdAt: space.createdAt ? new Date(space.createdAt as unknown as string) : undefined
    };
  } catch (error) {
    console.error('Error fetching space from mock database:', error);
    return null;
  }
};

// Update space
export const updateSpace = async (id: string, space: Partial<Space>): Promise<Space | null> => {
  try {
    // Get spaces from storage
    const spaces: Space[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Find index of space to update
    const spaceIndex = spaces.findIndex(s => s.id === id);
    
    if (spaceIndex === -1) {
      return null;
    }
    
    // Update space
    const updatedSpace = {
      ...spaces[spaceIndex],
      ...space
    };
    
    spaces[spaceIndex] = updatedSpace;
    
    // Save updated spaces
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spaces));
    
    return updatedSpace;
  } catch (error) {
    console.error('Error updating space in mock database:', error);
    return null;
  }
};

// Delete space
export const deleteSpace = async (id: string): Promise<boolean> => {
  try {
    // Get spaces from storage
    const spaces: Space[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Filter out space to delete
    const filteredSpaces = spaces.filter(s => s.id !== id);
    
    // Check if a space was removed
    if (filteredSpaces.length === spaces.length) {
      return false;
    }
    
    // Save updated spaces
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSpaces));
    
    // Also remove related members, activities, and treasury assets
    const members = JSON.parse(localStorage.getItem(MEMBERS_KEY) || '[]');
    const filteredMembers = members.filter((m: SpaceMember) => m.spaceId !== id);
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(filteredMembers));
    
    const activities = JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || '[]');
    const filteredActivities = activities.filter((a: SpaceActivity) => a.spaceId !== id);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(filteredActivities));
    
    const treasuryAssets = JSON.parse(localStorage.getItem(TREASURY_KEY) || '[]');
    const filteredAssets = treasuryAssets.filter((t: TreasuryAsset) => t.spaceId !== id);
    localStorage.setItem(TREASURY_KEY, JSON.stringify(filteredAssets));
    
    return true;
  } catch (error) {
    console.error('Error deleting space from mock database:', error);
    return false;
  }
};

// Get members of a space
export const getSpaceMembers = async (spaceId: string): Promise<SpaceMember[]> => {
  try {
    const members: SpaceMember[] = JSON.parse(localStorage.getItem(MEMBERS_KEY) || '[]');
    return members
      .filter(m => m.spaceId === spaceId)
      .map(m => ({
        ...m,
        joinedAt: new Date(m.joinedAt as unknown as string)
      }));
  } catch (error) {
    console.error('Error fetching space members:', error);
    return [];
  }
};

// Add member to a space
export const addSpaceMember = async (member: SpaceMember): Promise<SpaceMember | null> => {
  try {
    const members: SpaceMember[] = JSON.parse(localStorage.getItem(MEMBERS_KEY) || '[]');
    
    // Check if member already exists
    if (members.some(m => m.spaceId === member.spaceId && m.address === member.address)) {
      return null;
    }
    
    // Generate ID
    const newMember = {
      ...member,
      id: Date.now().toString(),
      joinedAt: new Date()
    };
    
    // Add to storage
    members.push(newMember);
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    
    // Update space members count
    const spaces: Space[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const spaceIndex = spaces.findIndex(s => s.id === member.spaceId);
    
    if (spaceIndex !== -1) {
      spaces[spaceIndex].membersCount = (spaces[spaceIndex].membersCount || 0) + 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(spaces));
    }
    
    // Log activity
    const activities: SpaceActivity[] = JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || '[]');
    activities.push({
      id: Date.now().toString(),
      spaceId: member.spaceId,
      type: 'member_joined',
      timestamp: new Date(),
      actorAddress: member.address,
      actorDisplayName: member.displayName,
      data: {}
    });
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
    
    return newMember;
  } catch (error) {
    console.error('Error adding space member:', error);
    return null;
  }
};

// Get activities of a space
export const getSpaceActivities = async (spaceId: string): Promise<SpaceActivity[]> => {
  try {
    const activities: SpaceActivity[] = JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || '[]');
    return activities
      .filter(a => a.spaceId === spaceId)
      .map(a => ({
        ...a,
        timestamp: new Date(a.timestamp as unknown as string)
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Most recent first
  } catch (error) {
    console.error('Error fetching space activities:', error);
    return [];
  }
};

// Add activity to a space
export const addSpaceActivity = async (activity: SpaceActivity): Promise<SpaceActivity | null> => {
  try {
    const activities: SpaceActivity[] = JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || '[]');
    
    // Generate ID
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    // Add to storage
    activities.push(newActivity);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
    
    return newActivity;
  } catch (error) {
    console.error('Error adding space activity:', error);
    return null;
  }
};

// Get treasury assets of a space
export const getSpaceTreasury = async (spaceId: string): Promise<TreasuryAsset[]> => {
  try {
    const assets: TreasuryAsset[] = JSON.parse(localStorage.getItem(TREASURY_KEY) || '[]');
    return assets.filter(a => a.spaceId === spaceId);
  } catch (error) {
    console.error('Error fetching space treasury:', error);
    return [];
  }
};

// Update treasury assets
export const updateSpaceTreasury = async (
  spaceId: string, 
  assets: TreasuryAsset[]
): Promise<TreasuryAsset[] | null> => {
  try {
    const allAssets: TreasuryAsset[] = JSON.parse(localStorage.getItem(TREASURY_KEY) || '[]');
    
    // Remove existing assets for this space
    const filteredAssets = allAssets.filter(a => a.spaceId !== spaceId);
    
    // Add new assets with IDs
    const newAssets = assets.map(a => ({
      ...a,
      id: Date.now().toString() + Math.random().toString().slice(2, 8),
      spaceId
    }));
    
    // Combine and save
    const updatedAssets = [...filteredAssets, ...newAssets];
    localStorage.setItem(TREASURY_KEY, JSON.stringify(updatedAssets));
    
    // Update space treasury value
    const totalValue = newAssets.reduce((sum, asset) => sum + asset.value, 0);
    
    const spaces: Space[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const spaceIndex = spaces.findIndex(s => s.id === spaceId);
    
    if (spaceIndex !== -1) {
      spaces[spaceIndex].treasuryValue = totalValue;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(spaces));
    }
    
    return newAssets;
  } catch (error) {
    console.error('Error updating space treasury:', error);
    return null;
  }
};

// Update space privacy settings
export const updateSpacePrivacySettings = async (
  spaceId: string,
  settings: {
    treasuryVisible?: boolean;
    membersVisible?: boolean;
    activitiesVisible?: boolean;
  }
): Promise<Space | null> => {
  try {
    const spaces: Space[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const spaceIndex = spaces.findIndex(s => s.id === spaceId);
    
    if (spaceIndex === -1) {
      return null;
    }
    
    // Ensure we have the current settings or defaults
    const currentSettings = spaces[spaceIndex].privacySettings || {
      treasuryVisible: true,
      membersVisible: true,
      activitiesVisible: true
    };
    
    // Update settings with type safety
    spaces[spaceIndex].privacySettings = {
      treasuryVisible: settings.treasuryVisible !== undefined ? settings.treasuryVisible : currentSettings.treasuryVisible,
      membersVisible: settings.membersVisible !== undefined ? settings.membersVisible : currentSettings.membersVisible,
      activitiesVisible: settings.activitiesVisible !== undefined ? settings.activitiesVisible : currentSettings.activitiesVisible
    };
    
    // Save updated spaces
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spaces));
    
    return spaces[spaceIndex];
  } catch (error) {
    console.error('Error updating space privacy settings:', error);
    return null;
  }
};

// Search spaces by name or description
export const searchSpaces = async (query: string): Promise<Space[]> => {
  try {
    const spaces: Space[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    const lowerQuery = query.toLowerCase();
    return spaces.filter(space => 
      space.name.toLowerCase().includes(lowerQuery) || 
      space.description.toLowerCase().includes(lowerQuery) ||
      space.categories.some(cat => cat.toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    console.error('Error searching spaces:', error);
    return [];
  }
};

export default {
  initDatabase,
  createSpace,
  getAllSpaces,
  getSpaceById,
  updateSpace,
  deleteSpace,
  getSpaceMembers,
  addSpaceMember,
  getSpaceActivities,
  addSpaceActivity,
  getSpaceTreasury,
  updateSpaceTreasury,
  updateSpacePrivacySettings,
  searchSpaces
}; 