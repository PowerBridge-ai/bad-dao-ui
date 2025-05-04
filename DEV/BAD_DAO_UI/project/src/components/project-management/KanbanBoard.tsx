import React, { useState } from 'react';
import { PlusCircle, Filter, ArrowDownUp, Search, MoreHorizontal } from 'lucide-react';
import TaskCard, { TaskPriority, TaskStatus } from './TaskCard';

// For a real implementation, you'd want to use react-beautiful-dnd or @dnd-kit/core
// This is a simplified version without actual drag and drop functionality

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  dueDate?: Date;
  createdAt: Date;
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[];
  bountyAmount?: number;
  bountyToken?: string;
  taskNumber?: string;
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onCreateTask: () => void;
  isLoading?: boolean;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskStatusChange,
  onCreateTask,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  
  const columns: { id: TaskStatus; label: string }[] = [
    { id: 'backlog', label: 'Backlog' },
    { id: 'todo', label: 'To Do' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'review', label: 'Review' },
    { id: 'done', label: 'Done' }
  ];
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesPriority;
  });
  
  const getColumnTasks = (columnId: TaskStatus) => {
    return filteredTasks.filter(task => task.status === columnId);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center text-neutral-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading tasks...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative md:w-1/3">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md py-2 pl-9 pr-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-neutral-500" />
        </div>
        
        <div className="flex space-x-2">
          <div className="relative">
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value as any)}
              className="bg-neutral-800 border border-neutral-700 rounded-md py-2 pl-9 pr-3 text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
            >
              <option value="all">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <Filter size={16} className="absolute left-3 top-2.5 text-neutral-500" />
          </div>
          
          <button 
            onClick={onCreateTask}
            className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center"
          >
            <PlusCircle size={16} className="mr-2" />
            New Task
          </button>
        </div>
      </div>
      
      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map(column => (
          <div key={column.id} className="bg-neutral-800/40 rounded-lg">
            <div className="p-3 border-b border-neutral-700/50 flex items-center justify-between">
              <h3 className="text-white font-medium">{column.label}</h3>
              <span className="bg-neutral-700/50 text-neutral-400 rounded-full px-2 py-0.5 text-xs">
                {getColumnTasks(column.id).length}
              </span>
            </div>
            
            <div className="p-2 h-[calc(100vh-250px)] overflow-y-auto">
              <div className="space-y-2">
                {getColumnTasks(column.id).length > 0 ? (
                  getColumnTasks(column.id).map(task => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      assignee={task.assignee}
                      dueDate={task.dueDate}
                      createdAt={task.createdAt}
                      priority={task.priority}
                      status={task.status}
                      tags={task.tags}
                      bountyAmount={task.bountyAmount}
                      bountyToken={task.bountyToken}
                      taskNumber={task.taskNumber}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-neutral-500 text-sm bg-neutral-800/30 rounded-lg border border-dashed border-neutral-700">
                    <p>No tasks</p>
                    <button 
                      className="mt-2 text-primary hover:underline text-xs flex items-center justify-center mx-auto"
                      onClick={onCreateTask}
                    >
                      <PlusCircle size={12} className="mr-1" />
                      Add task
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard; 