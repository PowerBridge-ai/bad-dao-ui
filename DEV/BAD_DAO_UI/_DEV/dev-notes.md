# 📝 BAD DAO UI - Project Management Component Development Notes

## 📋 Table of Contents
- [🏗️ Component Architecture](#component-architecture)
- [💾 Data Models](#data-models)
- [🔌 Integration Points](#integration-points)
- [🛠️ Technical Implementation Details](#technical-implementation-details)
  - [Core Project Management](#core-project-management)
  - [DAO/Community System](#daocommunity-system)
  - [Bounty System](#bounty-system) 
  - [Contributor System](#contributor-system)
- [🧪 Testing Strategy](#testing-strategy)
- [📊 Performance Considerations](#performance-considerations)
- [🚀 Deployment Notes](#deployment-notes)

## 🏗️ Component Architecture

### Overview
The Project Management component of the BAD DAO UI provides comprehensive task and project management functionality for DAOs. Based on analysis of the UI screenshots, it follows a Kanban-style board approach with additional features specific to decentralized organizations.

### Core Components

#### 1. Project Dashboard
- **Main Board View**: Similar to the "AI Treasury System" board shown in screenshots
- **Task Cards**: Individual task components with metadata
- **Column Organization**: Tasks organized by status (Backlog, To Do, In Progress, In Review, Done)
- **Filtering System**: Filter tasks by various properties
- **Sorting Options**: Sort by priority, date, etc.

#### 2. Task Management
- **Task Creation**: Interface for creating new tasks
- **Task Detail View**: Expanded view of task information
- **Status Transitions**: Movement of tasks between columns
- **Tagging System**: Support for custom tags/labels

#### 3. Project Templates
- **Template Selection**: Choose from predefined project types
- **Template Customization**: Modify templates for specific needs
- **Space/Project Creation**: "Create" modal as seen in screenshots

#### 4. User Assignment
- **Member Selection**: Assign members to tasks
- **Role Management**: Track roles within a project
- **Notification System**: Alert users of assignments

#### 5. Timeline/Milestone Tracking
- **Gantt Chart**: Visualize project timeline
- **Milestone Markers**: Highlight important dates
- **Progress Tracking**: Visual indicators of completion

#### 6. DAO Integration
- **Governance Connection**: Link tasks to governance proposals
- **Treasury Connection**: Link tasks to treasury activities
- **Voting Integration**: Allow voting on task priorities

### DAO/Community Components

#### 1. DAO Directory
- **DAO Listing**: Grid-based view of all available DAOs
- **Search & Filtering**: Find DAOs by name, type, or tags
- **DAO Card**: Individual card component showing DAO preview
- **Tab Navigation**: Navigation between platform sections
- **Member Counter**: Visual display of community size

#### 2. DAO Profile
- **DAO Header**: Banner with logo, name, and tagline
- **Metrics Display**: Key metrics like payment terms, total paid
- **Category Tabs**: Tabs for different sections of DAO activities
- **Bounty Cards**: Cards for bounties grouped by category
- **About Section**: Details about the DAO's purpose and structure
- **Member Preview**: Preview of DAO contributors

#### 3. Bounty Marketplace
- **Bounty Listing**: Comprehensive view of available tasks
- **Filter Sidebar**: Controls for finding specific tasks
- **Bounty Card**: Preview of individual tasks with rewards
- **Skill Tagging**: Visual tags for required skills
- **Reward Display**: Clear presentation of compensation

#### 4. Bounty Detail
- **Task Information**: Complete details about specific task
- **Activity Stream**: Chronological list of interactions
- **Participant List**: People involved in the task
- **Role Reservation**: Controls for role-based assignments
- **Status Indicators**: Visual status of the task

#### 5. Contributor Directory
- **Contributor Listing**: Grid view of community members
- **Revenue Controls**: Settings for revenue sharing
- **Contributor Card**: Preview of member skills and reputation
- **Pagination**: Controls for browsing large directories
- **Skill Categorization**: Organization by capability

#### 6. Contributor Profile
- **Profile Header**: User information and avatar
- **Reputation Display**: Metrics for reliability
- **Work Examples**: Portfolio of previous projects
- **Organization Links**: Affiliated DAOs/organizations
- **Review System**: Ratings and feedback
- **Activity History**: Record of platform contributions

## 💾 Data Models

Based on the screenshots and existing codebase, the following data models will be required:

### Project
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  type: 'Space' | 'Project';  // As seen in "Create" modal
  owner: string; // Owner address/ID
  members: ProjectMember[];
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
  startDate?: Date;
  endDate?: Date;
  visibility: 'public' | 'private';
  status: 'active' | 'completed' | 'archived';
}
```

### Task
```typescript
interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignees: string[]; // User IDs/addresses
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  tags: string[];
  points?: number;
  subtasks: Subtask[];
  comments: Comment[];
  attachments: Attachment[];
  linkedProposals?: string[]; // IDs of linked governance proposals
  linkedTreasuryTx?: string[]; // IDs of linked treasury transactions
}
```

### ProjectMember
```typescript
interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canAssign: boolean;
    canChangeStatus: boolean;
  };
}
```

### Subtask
```typescript
interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  assignee?: string;
  dueDate?: Date;
}
```

### Comment
```typescript
interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  attachments?: Attachment[];
}
```

### Attachment
```typescript
interface Attachment {
  id: string;
  name: string;
  fileType: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  size: number; // in bytes
}
```

### ProjectTemplate
```typescript
interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  type: 'Space' | 'Project';
  defaultTasks: TemplateTask[];
  defaultLabels: string[];
  defaultStatuses?: string[];
}
```

### DAO/Space
```typescript
interface DAO {
  id: string;
  name: string;
  description: string;
  logo: string;
  tagline: string;
  memberCount: number;
  treasury?: {
    totalPaid: number;
    currency: string;
    timeToPayment: number; // in days
  };
  categories: Category[];
  createdAt: Date;
  updatedAt: Date;
  website?: string;
  socialLinks?: {
    twitter?: string;
    discord?: string;
    github?: string;
    telegram?: string;
  };
  tags: string[];
  featuredProjects?: string[]; // IDs of featured projects
}
```

### Category
```typescript
interface Category {
  id: string;
  daoId: string;
  name: string;
  description?: string;
  bounties: Bounty[];
  openTaskCount: number;
  contributorCount: number;
}
```

### Bounty
```typescript
interface Bounty {
  id: string;
  daoId: string;
  categoryId?: string;
  title: string;
  description: string;
  reward: {
    amount: number;
    currency: string; // "USDC", etc.
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  skills: string[];
  status: 'open' | 'in_progress' | 'in_review' | 'completed' | 'cancelled';
  applicants?: string[]; // User IDs
  assignedTo?: string[]; // User IDs
  reservedRole?: string;
  activityStream: ActivityItem[];
  language?: string[];
}
```

### ActivityItem
```typescript
interface ActivityItem {
  id: string;
  bountyId: string;
  userId: string;
  action: 'created' | 'updated' | 'commented' | 'assigned' | 'completed' | 'reviewed';
  timestamp: Date;
  content?: string; // For comments
}
```

### Contributor
```typescript
interface Contributor {
  id: string;
  username: string;
  profilePicture?: string;
  bio?: string;
  reputation: number;
  skills: string[];
  languages: string[];
  specialization?: string;
  joinedAt: Date;
  earnings?: {
    total: number;
    currency: string;
  };
  revenueShare?: number; // Percentage
  featuredWork?: FeaturedProject[];
  organizations: {
    id: string;
    name: string;
    role: string;
  }[];
  reviews: Review[];
  contributions: Contribution[];
  socialLinks?: {
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  walletAddress: string;
}
```

### FeaturedProject
```typescript
interface FeaturedProject {
  id: string;
  contributorId: string;
  title: string;
  description?: string;
  imageUrl: string;
  projectUrl?: string;
  projectType: string;
}
```

### Review
```typescript
interface Review {
  id: string;
  contributorId: string;
  reviewerId: string;
  reviewerName: string;
  organization: string;
  rating: number; // 1-5
  content?: string;
  date: Date;
  bountyId?: string; // Associated task if applicable
}
```

### Contribution
```typescript
interface Contribution {
  id: string;
  contributorId: string;
  daoId: string;
  bountyId?: string;
  title: string;
  description?: string;
  date: Date;
  reward?: {
    amount: number;
    currency: string;
  };
  skills: string[];
}
```

## 🔌 Integration Points

### Governance Integration
- Tasks can be linked to governance proposals
- Proposal creation can trigger task creation
- Task completion can trigger proposal creation

### Treasury Integration
- Tasks can request treasury funds
- Treasury transactions can be linked to tasks
- Budget tracking tied to task completion

### Wallet Integration
- User authentication/identification via wallet
- Permission management based on wallet holdings
- Task rewards paid via wallet

### Database Integration
- Extend the current database service to include PM data models
- Utilize existing Space model as foundation for Project model
- Add relationships between PM entities and existing entities

## 🛠️ Technical Implementation Details

### Core Project Management
- Use React context for project/task state
- Implement optimistic updates for better UX
- Cache task data for faster loading

### UI Components
- Reuse existing UI components where possible
- Implement drag-and-drop for task status changes
- Create modal components for task creation/editing

### API Structure
- Extend database service with PM-specific methods
- Create hooks for data fetching/manipulation
- Implement pagination for large task lists

### Routing
- Add routes for:
  - Project dashboard: `/projects`
  - Project detail: `/projects/:id`
  - Task detail: `/projects/:id/tasks/:taskId`
  - Project settings: `/projects/:id/settings`
  - Project templates: `/templates`

### DAO/Community System

#### State Management
- Use React context for DAO directory state
- Implement filtering and search functionality
- Cache DAO data for faster loading
- Track selected DAO in URL parameters

#### UI Components
- Create reusable DAO card component
- Implement responsive grid for DAO listing
- Build tabbed interface for DAO profile
- Develop category organizational components
- Create member preview components

#### API Structure
- Extend database service with DAO-specific methods:
  ```typescript
  // DAO methods
  getAllDAOs(): Promise<DAO[]>
  getDAOById(id: string): Promise<DAO | null>
  getDAOCategories(daoId: string): Promise<Category[]>
  getDAOMembers(daoId: string, limit?: number): Promise<Contributor[]>
  searchDAOs(query: string): Promise<DAO[]>
  ```

#### Routing
- Add routes for:
  - DAO directory: `/daos`
  - DAO detail: `/daos/:id`
  - DAO settings: `/daos/:id/settings`
  - DAO categories: `/daos/:id/categories`
  - DAO members: `/daos/:id/members`

### Bounty System

#### State Management
- Use React context for bounty marketplace state
- Implement filter persistence using URL parameters
- Track bounty detail state with route parameters
- Cache bounty data by category and status

#### UI Components
- Create bounty card component with reward display
- Build advanced filtering sidebar with skill checkboxes
- Implement activity stream component
- Develop role reservation controls
- Create skill tag visualization

#### API Structure
- Extend database service with bounty-specific methods:
  ```typescript
  // Bounty methods
  getAllBounties(filters?: BountyFilter): Promise<Bounty[]>
  getBountyById(id: string): Promise<Bounty | null>
  getBountiesByDAO(daoId: string): Promise<Bounty[]>
  getBountiesByCategory(categoryId: string): Promise<Bounty[]>
  getBountyActivity(bountyId: string): Promise<ActivityItem[]>
  searchBounties(query: string, filters?: BountyFilter): Promise<Bounty[]>
  applyToBounty(bountyId: string, userId: string): Promise<boolean>
  addBountyActivity(bountyId: string, activity: Partial<ActivityItem>): Promise<ActivityItem>
  ```

#### Routing
- Add routes for:
  - Bounty marketplace: `/bounties`
  - Bounty detail: `/bounties/:id`
  - DAO bounties: `/daos/:id/bounties`
  - Category bounties: `/daos/:id/categories/:categoryId/bounties`

### Contributor System

#### State Management
- Use React context for contributor directory state
- Implement pagination state management
- Track selected contributor profile in URL parameters
- Cache contributor data for faster loading

#### UI Components
- Create contributor card component
- Build reputation display component with tooltip
- Implement review and rating system components
- Develop portfolio showcase component
- Create revenue sharing controls

#### API Structure
- Extend database service with contributor-specific methods:
  ```typescript
  // Contributor methods
  getAllContributors(page?: number, limit?: number): Promise<Contributor[]>
  getContributorById(id: string): Promise<Contributor | null>
  getContributorsByDAO(daoId: string): Promise<Contributor[]>
  getContributorReviews(contributorId: string): Promise<Review[]>
  getContributorContributions(contributorId: string): Promise<Contribution[]>
  searchContributors(query: string): Promise<Contributor[]>
  updateContributorProfile(id: string, profile: Partial<Contributor>): Promise<Contributor | null>
  addContributorReview(contributorId: string, review: Partial<Review>): Promise<Review>
  ```

#### Routing
- Add routes for:
  - Contributor directory: `/contributors`
  - Contributor profile: `/contributors/:id`
  - Contributor settings: `/contributors/:id/settings`
  - Contributor portfolio: `/contributors/:id/portfolio`
  - DAO contributors: `/daos/:id/contributors`

## �� Testing Strategy

### Unit Tests
- Test each component in isolation
- Test state management functions
- Test utility functions

### Integration Tests
- Test interaction between components
- Test data flow between contexts
- Test API integration

### E2E Tests
- Test complete user workflows
- Test cross-component interactions
- Test integration with other system components

## 📊 Performance Considerations

### Data Loading
- Implement pagination for task lists
- Use virtual scrolling for large lists
- Lazy load task details

### Rendering Optimization
- Memoize expensive components
- Optimize re-renders with React.memo
- Use windowing techniques for long lists

### Caching Strategy
- Cache project and task data
- Implement optimistic UI updates
- Use browser storage for offline functionality

## 🚀 Deployment Notes

### Build Process
- Ensure PM components are tree-shakable
- Optimize bundle size
- Generate PM-specific types

### Feature Flags
- Implement feature flags for gradual rollout
- Allow disabling specific PM features
- Create admin toggles for experimental features

### Monitoring
- Track PM component performance metrics
- Monitor error rates for specific interactions
- Collect usage analytics

---

## 📝 Technical Decisions

### Kanban vs. Linear Views
The PM component will prioritize a Kanban-style board view (as seen in screenshots) as the primary interface, with optional list and calendar views as alternative visualizations.

### Task Relationships
Tasks can have parent-child relationships (via subtasks) and can be linked to other system entities (proposals, treasury transactions).

### Permission Model
Project permissions will follow a role-based system (owner, admin, member, viewer) with granular permissions per role.

### Template System
The template system will allow for complete project blueprint creation, including predefined tasks, roles, and settings.

### Integration Strategy
The PM component will integrate with Governance and Treasury via specific integration points, maintaining loose coupling between systems.

### DAO Directory Implementation
The DAO directory will use a card-based grid layout with server-side filtering and pagination to handle large numbers of communities efficiently. Search functionality will implement debouncing to avoid excessive API calls.

### Bounty System Design
The bounty system will use a combination of filters and tags to make task discovery efficient. Activity streams will be paginated and loaded incrementally to improve performance for tasks with high engagement.

### Contributor Profile Strategy
Contributor profiles will leverage a modular approach with lazy-loaded sections for portfolio items, reviews, and contribution history to optimize initial load time while providing comprehensive data when needed. 