export enum TaskType {
  FEATURE = 'Feature',
  BUG = 'Bug',
  DOCUMENTATION = 'Documentation',
  ENHANCEMENT = 'Enhancement',
  REFACTOR = 'Refactor',
  TASK = 'Task',
  EPIC = 'Epic',
  STORY = 'Story'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  status: 'open' | 'in-progress' | 'review' | 'completed';
  priority: Priority;
  assigneeId?: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  labels: string[];
  taskNumber: string;
  subtasks?: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  parentTaskId: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  content: string;
  userId: string;
  taskId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  taskId: string;
  uploadedAt: Date;
  uploadedById: string;
}

export interface TaskFilter {
  status?: string[];
  assignee?: string[];
  priority?: Priority[];
  type?: TaskType[];
  label?: string[];
  search?: string;
}

export interface TaskSortOption {
  field: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title';
  direction: 'asc' | 'desc';
} 