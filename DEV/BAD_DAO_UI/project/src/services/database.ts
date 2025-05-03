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
}

// Mock database using localStorage
const STORAGE_KEY = 'bad_dao_spaces';

// Initialize database
export const initDatabase = async (): Promise<boolean> => {
  try {
    // Check if storage is already initialized
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
    console.log('Mock database initialized successfully');
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
      voteCount: 0
    };
    
    // Add to storage
    spaces.push(newSpace);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spaces));
    
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
    
    return true;
  } catch (error) {
    console.error('Error deleting space from mock database:', error);
    return false;
  }
};

export default {
  initDatabase,
  createSpace,
  getAllSpaces,
  getSpaceById,
  updateSpace,
  deleteSpace
}; 