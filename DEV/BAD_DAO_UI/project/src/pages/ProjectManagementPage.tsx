import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import { 
  KanbanSquare, 
  Users, 
  Award, 
  UserPlus, 
  PlusCircle,
  Calendar,
  BarChart2,
  List,
  X
} from 'lucide-react';
import DAODirectory from '../components/project-management/DAODirectory';
import BountyMarketplace from '../components/project-management/BountyMarketplace';
import ContributorDirectory from '../components/project-management/ContributorDirectory';
import KanbanBoard from '../components/project-management/KanbanBoard';
import TaskDetail from '../components/project-management/TaskDetail';
import TaskTemplate from '../components/project-management/TaskTemplate';
import { Task } from '../components/project-management/KanbanBoard';
import { TaskStatus } from '../components/project-management/TaskCard';
import { BountyStatus, BountyDifficulty } from '../components/project-management/BountyCard';

// Mock data for the demo
import { mockDAOs } from '../mock/daos.js';
import { mockBounties } from '../mock/bounties.js';
import { mockContributors } from '../mock/contributors.js';
import { mockTasks } from '../mock/tasks.js';

const ProjectManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskTemplate, setShowTaskTemplate] = useState(false);
  const [templateType, setTemplateType] = useState<'feature' | 'bug' | 'documentation' | 'custom'>('feature');
  
  useEffect(() => {
    // Convert mock tasks to our Task interface
    const convertedTasks: Task[] = mockTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      // Ensure priority is one of the allowed values
      priority: ['low', 'medium', 'high', 'critical'].includes(task.priority) 
        ? task.priority as any 
        : 'medium',
      // Ensure status is one of the allowed values  
      status: ['backlog', 'todo', 'in-progress', 'review', 'done'].includes(task.status) 
        ? task.status as any 
        : 'todo',
      tags: task.tags,
      taskNumber: `BAD-${task.id.padStart(3, '0')}`
    }));
    
    setTasks(convertedTasks);
  }, []);
  
  useEffect(() => {
    // Set active tab based on URL
    const path = location.pathname;
    if (path.includes('/daos')) {
      setActiveTab('daos');
    } else if (path.includes('/bounties')) {
      setActiveTab('bounties');
    } else if (path.includes('/contributors')) {
      setActiveTab('contributors');
    } else {
      setActiveTab('tasks');
    }
  }, [location.pathname]);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    switch (tab) {
      case 'tasks':
        navigate('/project-management');
        break;
      case 'daos':
        navigate('/project-management/daos');
        break;
      case 'bounties':
        navigate('/project-management/bounties');
        break;
      case 'contributors':
        navigate('/project-management/contributors');
        break;
    }
  };
  
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };
  
  const handleCreateTask = () => {
    setShowTaskTemplate(true);
    setTemplateType('feature');
  };
  
  const handleCreateBug = () => {
    setShowTaskTemplate(true);
    setTemplateType('bug');
  };
  
  const handleCreateDocumentation = () => {
    setShowTaskTemplate(true);
    setTemplateType('documentation');
  };
  
  const handleSaveTask = (taskData: any) => {
    // Generate a simple ID for new task
    const newId = (tasks.length + 1).toString();
    
    // Create a new task from the template data
    const newTask: Task = {
      id: newId,
      title: taskData.title,
      description: taskData.description,
      assignee: taskData.assignee ? {
        id: '1', // In a real app, this would be a real user ID
        name: taskData.assignee,
      } : undefined,
      dueDate: taskData.dueDate,
      createdAt: new Date(),
      priority: taskData.priority,
      status: 'todo',
      tags: taskData.labels || [],
      taskNumber: taskData.taskNumber,
    };
    
    // Add to tasks list
    setTasks(prev => [...prev, newTask]);
    
    // Close template and navigate to tasks
    setShowTaskTemplate(false);
    navigate('/project-management');
  };
  
  // Render the correct component based on the route
  const renderRouteContent = () => {
    // If we're showing the task template, render it
    if (showTaskTemplate) {
      return (
        <div className="px-4 py-10">
          <TaskTemplate 
            templateType={templateType}
            onSave={handleSaveTask}
            onCancel={() => setShowTaskTemplate(false)}
          />
        </div>
      );
    }
    
    // Check if we're on a task detail route
    const taskDetailMatch = location.pathname.match(/\/project-management\/task\/(.+)/);
    if (taskDetailMatch) {
      const taskId = taskDetailMatch[1];
      const task = tasks.find(t => t.id === taskId);
      
      if (task) {
        return (
          <TaskDetail
            id={task.id}
            title={task.title}
            description={task.description}
            labels={task.tags.map(tag => ({ name: tag, color: 'blue' }))}
            status={task.status === 'done' ? 'completed' : 
                   task.status === 'review' ? 'review' : 
                   task.status === 'in-progress' ? 'in-progress' : 'open'}
            assignee={task.assignee}
            createdBy={{
              id: 'system',
              name: 'System',
            }}
            createdAt={task.createdAt}
            updatedAt={task.createdAt}
            dueDate={task.dueDate}
            priority={task.priority}
            taskNumber={task.taskNumber || `BAD-${task.id.padStart(3, '0')}`}
            requirements={[
              { id: 'req1', text: 'Sample requirement 1', completed: true },
              { id: 'req2', text: 'Sample requirement 2', completed: false },
            ]}
            implementationSteps={[
              { id: 'step1', text: 'Sample step 1', completed: true },
              { id: 'step2', text: 'Sample step 2', completed: false },
              { id: 'step3', text: 'Sample step 3', completed: false },
            ]}
            technicalSpecification="## Technical Details\n\nThis is a sample technical specification for this task."
            testingRequirements={[
              { id: 'test1', text: 'Test requirement 1', completed: false },
            ]}
            documentationRequirements={[
              { id: 'doc1', text: 'Document feature in wiki', completed: false },
            ]}
            performanceRequirements="Should handle at least 1000 concurrent users."
            securityConsiderations="Ensure all user inputs are properly sanitized."
            acceptanceCriteria={[
              { id: 'ac1', text: 'Feature should work as expected', completed: false },
              { id: 'ac2', text: 'All tests should pass', completed: false },
            ]}
            comments={[
              {
                id: 'comment1',
                user: {
                  id: 'user1',
                  name: 'John Doe',
                  avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
                },
                content: 'This looks good. Let\'s implement it.',
                createdAt: new Date(Date.now() - 86400000),
              },
            ]}
          />
        );
      }
      
      return <div>Task not found</div>;
    }
    
    // Otherwise render the tabs content
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Project Management</h1>
          <div className="flex space-x-2">
            <button 
              onClick={handleCreateTask}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <PlusCircle size={16} className="mr-2" />
              New Task
            </button>
            <button 
              onClick={handleCreateBug}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <PlusCircle size={16} className="mr-2" />
              Report Bug
            </button>
          </div>
        </div>
        
        <div className="flex border-b border-neutral-800 mb-6">
          <button
            className={`px-6 py-3 font-medium text-sm border-b-2 ${
              activeTab === 'tasks' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
            onClick={() => handleTabChange('tasks')}
          >
            <div className="flex items-center">
              <KanbanSquare size={18} className="mr-2" />
              Tasks
            </div>
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm border-b-2 ${
              activeTab === 'daos' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
            onClick={() => handleTabChange('daos')}
          >
            <div className="flex items-center">
              <Users size={18} className="mr-2" />
              DAOs
            </div>
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm border-b-2 ${
              activeTab === 'bounties' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
            onClick={() => handleTabChange('bounties')}
          >
            <div className="flex items-center">
              <Award size={18} className="mr-2" />
              Bounties
            </div>
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm border-b-2 ${
              activeTab === 'contributors' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
            onClick={() => handleTabChange('contributors')}
          >
            <div className="flex items-center">
              <UserPlus size={18} className="mr-2" />
              Contributors
            </div>
          </button>
        </div>
        
        {activeTab === "tasks" && (
          <KanbanBoard 
            tasks={tasks} 
            onTaskStatusChange={handleTaskStatusChange}
            onCreateTask={handleCreateTask}
          />
        )}
        
        {activeTab === "daos" && (
          <DAODirectory 
            daos={mockDAOs}
          />
        )}
        
        {activeTab === "bounties" && (
          <BountyMarketplace 
            bounties={mockBounties.map(bounty => ({
              ...bounty,
              // Ensure correct typing for status and difficulty
              status: (bounty.status as BountyStatus),
              difficulty: (bounty.difficulty as BountyDifficulty)
            }))}
            onCreateBounty={() => console.log('Create bounty')}
            currentUserCanCreate={true}
          />
        )}
        
        {activeTab === "contributors" && (
          <ContributorDirectory 
            contributors={mockContributors}
          />
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-neutral-900 min-h-screen text-white">
      {renderRouteContent()}
    </div>
  );
};

export default ProjectManagementPage; 