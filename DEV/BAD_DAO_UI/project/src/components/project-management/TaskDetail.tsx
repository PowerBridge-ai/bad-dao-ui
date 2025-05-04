import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Calendar,
  Tag,
  User,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Edit,
  Clock,
  Star,
  AlertTriangle,
  Shield,
  CheckCircle,
  BarChart2,
  FileText,
  Terminal,
  MoreHorizontal,
  Users
} from 'lucide-react';
import MarkdownRenderer from '../ai/MarkdownRenderer';
import Avatar from '../common/Avatar';
import { TaskType, Priority } from '../../types/tasks';
import Tabs from '../common/Tabs';

export interface TaskDetailProps {
  id: string;
  title: string;
  description: string;
  labels: {
    name: string;
    color: string;
  }[];
  status: 'open' | 'in-progress' | 'review' | 'completed';
  assignee?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  createdBy: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  requirements?: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  implementationSteps?: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  technicalSpecification?: string;
  testingRequirements?: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  documentationRequirements?: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  performanceRequirements?: string;
  securityConsiderations?: string;
  acceptanceCriteria?: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  comments?: {
    id: string;
    user: {
      id: string;
      name: string;
      avatarUrl?: string;
    };
    content: string;
    createdAt: Date;
  }[];
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  references?: {
    id: string;
    name: string;
    url: string;
  }[];
  taskNumber: string;
  type: TaskType;
  reporter: {
    id: string;
    name: string;
    avatar: string;
  };
  subtasks: { id: string; title: string; completed: boolean }[];
  linkedPullRequests: { id: string; number: string; title: string; status: string }[];
  watchers: number;
  techSpecs: string;
  testingNotes: string;
}

const TaskDetail: React.FC<TaskDetailProps> = ({
  id,
  title,
  description,
  labels,
  status,
  assignee,
  createdBy,
  createdAt,
  updatedAt,
  dueDate,
  priority,
  requirements = [],
  implementationSteps = [],
  technicalSpecification,
  testingRequirements = [],
  documentationRequirements = [],
  performanceRequirements,
  securityConsiderations,
  acceptanceCriteria = [],
  comments = [],
  attachments = [],
  references = [],
  taskNumber,
  type,
  reporter,
  subtasks,
  linkedPullRequests,
  watchers,
  techSpecs,
  testingNotes
}) => {
  const { taskId } = useParams<{taskId: string}>();
  const [activeTab, setActiveTab] = useState('description');
  const [newComment, setNewComment] = useState('');
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getStatusBadgeClasses = () => {
    switch (status) {
      case 'open':
        return 'bg-blue-800/20 text-blue-300';
      case 'in-progress':
        return 'bg-yellow-800/20 text-yellow-300';
      case 'review':
        return 'bg-purple-800/20 text-purple-300';
      case 'completed':
        return 'bg-green-800/20 text-green-300';
      default:
        return 'bg-neutral-800/40 text-neutral-300';
    }
  };
  
  const getPriorityBadgeClasses = () => {
    switch (priority) {
      case 'low':
        return 'bg-blue-800/20 text-blue-300';
      case 'medium':
        return 'bg-yellow-800/20 text-yellow-300';
      case 'high':
        return 'bg-orange-800/20 text-orange-300';
      case 'critical':
        return 'bg-red-800/20 text-red-300';
      default:
        return 'bg-blue-800/20 text-blue-300';
    }
  };
  
  const renderChecklistItem = (item: { id: string; text: string; completed: boolean }, onChange?: () => void) => (
    <div key={item.id} className="flex items-start mb-2">
      <div className="flex items-center h-5 mt-1">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={onChange}
          className="border-2 rounded border-neutral-600 bg-neutral-800 h-4 w-4 text-primary focus:ring-primary"
        />
      </div>
      <div className="ml-3 text-sm">
        <label className={`font-medium ${item.completed ? 'text-neutral-500 line-through' : 'text-neutral-300'}`}>
          {item.text}
        </label>
      </div>
    </div>
  );
  
  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'techSpecs', label: 'Technical Specs' },
    { id: 'testingNotes', label: 'Testing' },
    { id: 'comments', label: `Comments (${comments.length})` }
  ];
  
  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    
    console.log('Adding comment:', newComment);
    
    setNewComment('');
  };
  
  return (
    <div className="bg-neutral-900 text-white min-h-screen flex flex-col">
      <div className="border-b border-neutral-800 p-4">
        <div className="flex items-center">
          <Link to="/project-management" className="flex items-center text-neutral-400 hover:text-white mr-4">
            <ArrowLeft size={18} className="mr-1" />
            <span>Back to Tasks</span>
          </Link>
        </div>
      </div>
      
      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold flex items-center">
              <span className="text-neutral-400 mr-2">[{taskNumber}]</span> {title}
            </h1>
            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium">
              Edit
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`${getStatusBadgeClasses()} py-1 px-2 rounded-md text-xs font-medium`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            <span className={`${getPriorityBadgeClasses()} py-1 px-2 rounded-md text-xs font-medium`}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
            {labels.map((label, index) => (
              <span
                key={index}
                className={`bg-${label.color}-800/20 text-${label.color}-300 py-1 px-2 rounded-md text-xs font-medium`}
              >
                {label.name}
              </span>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-neutral-400">
            <div className="flex items-center">
              <User size={14} className="mr-1.5" />
              <span>Created by: </span>
              <span className="ml-1 text-white">
                {createdBy.name}
              </span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1.5" />
              <span>Created: </span>
              <span className="ml-1 text-white">
                {formatDate(createdAt)}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar size={14} className="mr-1.5" />
              <span>Updated: </span>
              <span className="ml-1 text-white">
                {formatDate(updatedAt)}
              </span>
            </div>
            {dueDate && (
              <div className="flex items-center">
                <Calendar size={14} className="mr-1.5" />
                <span>Due: </span>
                <span className={`ml-1 ${new Date() > dueDate ? 'text-red-400' : 'text-white'}`}>
                  {formatDate(dueDate)}
                </span>
              </div>
            )}
            {assignee && (
              <div className="flex items-center">
                <User size={14} className="mr-1.5" />
                <span>Assigned to: </span>
                <span className="ml-1 text-white">
                  {assignee.name}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <div className="border border-neutral-800 rounded-lg overflow-hidden">
                <div className="bg-neutral-800/50 px-4 py-3 flex items-center justify-between">
                  <h2 className="text-md font-semibold flex items-center">
                    <FileText size={16} className="mr-2 text-primary" />
                    Feature Description
                  </h2>
                </div>
                <div className="p-4 bg-neutral-900/50">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <MarkdownRenderer content={description} />
                  </div>
                </div>
              </div>
              
              {requirements.length > 0 && (
                <div className="border border-neutral-800 rounded-lg overflow-hidden">
                  <div className="bg-neutral-800/50 px-4 py-3 flex items-center justify-between">
                    <h2 className="text-md font-semibold flex items-center">
                      <CheckSquare size={16} className="mr-2 text-primary" />
                      Requirements
                    </h2>
                    <span className="text-xs text-neutral-400">
                      {requirements.filter(req => req.completed).length} / {requirements.length} completed
                    </span>
                  </div>
                  <div className="p-4 bg-neutral-900/50">
                    {requirements.map(req => renderChecklistItem(req))}
                  </div>
                </div>
              )}
              
              {implementationSteps.length > 0 && (
                <div className="border border-neutral-800 rounded-lg overflow-hidden">
                  <div className="bg-neutral-800/50 px-4 py-3 flex items-center justify-between">
                    <h2 className="text-md font-semibold flex items-center">
                      <CheckSquare size={16} className="mr-2 text-primary" />
                      Implementation Steps
                    </h2>
                    <span className="text-xs text-neutral-400">
                      {implementationSteps.filter(step => step.completed).length} / {implementationSteps.length} completed
                    </span>
                  </div>
                  <div className="p-4 bg-neutral-900/50">
                    {implementationSteps.map((step, index) => (
                      <div key={step.id} className="mb-2">
                        <div className="flex items-start">
                          <div className="flex items-center h-5 mt-1">
                            <input
                              type="checkbox"
                              checked={step.completed}
                              className="border-2 rounded border-neutral-600 bg-neutral-800 h-4 w-4 text-primary focus:ring-primary"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label className={`font-medium ${step.completed ? 'text-neutral-500 line-through' : 'text-neutral-300'}`}>
                              {index + 1}. {step.text}
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {technicalSpecification && (
                <div className="border border-neutral-800 rounded-lg overflow-hidden">
                  <div className="bg-neutral-800/50 px-4 py-3">
                    <h2 className="text-md font-semibold flex items-center">
                      <Terminal size={16} className="mr-2 text-primary" />
                      Technical Specifications
                    </h2>
                  </div>
                  <div className="p-4 bg-neutral-900/50">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <MarkdownRenderer content={technicalSpecification} />
                    </div>
                  </div>
                </div>
              )}
              
              {testingRequirements.length > 0 && (
                <div className="border border-neutral-800 rounded-lg overflow-hidden">
                  <div className="bg-neutral-800/50 px-4 py-3">
                    <h2 className="text-md font-semibold flex items-center">
                      <AlertTriangle size={16} className="mr-2 text-primary" />
                      Testing Requirements
                    </h2>
                  </div>
                  <div className="p-4 bg-neutral-900/50">
                    {testingRequirements.map(req => renderChecklistItem(req))}
                  </div>
                </div>
              )}
              
              {documentationRequirements.length > 0 && (
                <div className="border border-neutral-800 rounded-lg overflow-hidden">
                  <div className="bg-neutral-800/50 px-4 py-3">
                    <h2 className="text-md font-semibold flex items-center">
                      <FileText size={16} className="mr-2 text-primary" />
                      Documentation Requirements
                    </h2>
                  </div>
                  <div className="p-4 bg-neutral-900/50">
                    {documentationRequirements.map(req => renderChecklistItem(req))}
                  </div>
                </div>
              )}
              
              {performanceRequirements && (
                <div className="border border-neutral-800 rounded-lg overflow-hidden">
                  <div className="bg-neutral-800/50 px-4 py-3">
                    <h2 className="text-md font-semibold flex items-center">
                      <BarChart2 size={16} className="mr-2 text-primary" />
                      Performance Requirements
                    </h2>
                  </div>
                  <div className="p-4 bg-neutral-900/50">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <MarkdownRenderer content={performanceRequirements} />
                    </div>
                  </div>
                </div>
              )}
              
              {securityConsiderations && (
                <div className="border border-neutral-800 rounded-lg overflow-hidden">
                  <div className="bg-neutral-800/50 px-4 py-3">
                    <h2 className="text-md font-semibold flex items-center">
                      <Shield size={16} className="mr-2 text-primary" />
                      Security Considerations
                    </h2>
                  </div>
                  <div className="p-4 bg-neutral-900/50">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <MarkdownRenderer content={securityConsiderations} />
                    </div>
                  </div>
                </div>
              )}
              
              {acceptanceCriteria.length > 0 && (
                <div className="border border-neutral-800 rounded-lg overflow-hidden">
                  <div className="bg-neutral-800/50 px-4 py-3">
                    <h2 className="text-md font-semibold flex items-center">
                      <CheckCircle size={16} className="mr-2 text-primary" />
                      Acceptance Criteria
                    </h2>
                  </div>
                  <div className="p-4 bg-neutral-900/50">
                    {acceptanceCriteria.map(req => renderChecklistItem(req))}
                  </div>
                </div>
              )}
              
              <div className="border border-neutral-800 rounded-lg overflow-hidden">
                <div className="bg-neutral-800/50 px-4 py-3">
                  <h2 className="text-md font-semibold flex items-center">
                    <MessageSquare size={16} className="mr-2 text-primary" />
                    Comments
                    <span className="ml-2 bg-neutral-700 text-neutral-300 text-xs px-2 py-0.5 rounded-full">
                      {comments.length}
                    </span>
                  </h2>
                </div>
                
                {comments.length > 0 ? (
                  <div className="divide-y divide-neutral-800">
                    {comments.map(comment => (
                      <div key={comment.id} className="p-4 bg-neutral-900/50">
                        <div className="flex items-start space-x-3">
                          {comment.user.avatarUrl ? (
                            <img 
                              src={comment.user.avatarUrl} 
                              alt={comment.user.name} 
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                              <User size={14} />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="font-medium text-white">{comment.user.name}</span>
                              <span className="mx-2 text-neutral-500">•</span>
                              <span className="text-xs text-neutral-500">{formatDate(comment.createdAt)}</span>
                            </div>
                            <div className="mt-2 text-sm text-neutral-300">
                              <MarkdownRenderer content={comment.content} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-neutral-500 bg-neutral-900/50">
                    No comments yet
                  </div>
                )}
                
                <div className="p-4 bg-neutral-800/30">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                      <User size={14} />
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        rows={3}
                      ></textarea>
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={handleAddComment}
                          disabled={newComment.trim() === ''}
                          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div className="border border-neutral-800 rounded-lg overflow-hidden">
                <div className="bg-neutral-800/50 px-4 py-3">
                  <h3 className="text-sm font-semibold">Assignees</h3>
                </div>
                <div className="p-4 bg-neutral-900/50">
                  {assignee ? (
                    <div className="flex items-center space-x-2">
                      {assignee.avatarUrl ? (
                        <img 
                          src={assignee.avatarUrl} 
                          alt={assignee.name} 
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center">
                          <User size={12} />
                        </div>
                      )}
                      <span className="text-sm text-white">{assignee.name}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-neutral-500">No assignees</div>
                  )}
                  <button className="mt-2 w-full text-xs text-primary hover:text-primary/80 flex items-center justify-center py-1">
                    <User size={12} className="mr-1" />
                    Assign
                  </button>
                </div>
              </div>
              
              <div className="border border-neutral-800 rounded-lg overflow-hidden">
                <div className="bg-neutral-800/50 px-4 py-3">
                  <h3 className="text-sm font-semibold">Labels</h3>
                </div>
                <div className="p-4 bg-neutral-900/50">
                  {labels.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {labels.map((label, index) => (
                        <span
                          key={index}
                          className={`bg-${label.color}-800/20 text-${label.color}-300 py-1 px-2 rounded-md text-xs font-medium`}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-neutral-500">No labels</div>
                  )}
                  <button className="mt-2 w-full text-xs text-primary hover:text-primary/80 flex items-center justify-center py-1">
                    <Tag size={12} className="mr-1" />
                    Add Labels
                  </button>
                </div>
              </div>
              
              {references.length > 0 && (
                <div className="border border-neutral-800 rounded-lg overflow-hidden">
                  <div className="bg-neutral-800/50 px-4 py-3">
                    <h3 className="text-sm font-semibold">References</h3>
                  </div>
                  <div className="p-4 bg-neutral-900/50">
                    <ul className="space-y-2">
                      {references.map(ref => (
                        <li key={ref.id}>
                          <a 
                            href={ref.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {ref.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {attachments.length > 0 && (
                <div className="border border-neutral-800 rounded-lg overflow-hidden">
                  <div className="bg-neutral-800/50 px-4 py-3">
                    <h3 className="text-sm font-semibold">Attachments</h3>
                  </div>
                  <div className="p-4 bg-neutral-900/50">
                    <ul className="space-y-2">
                      {attachments.map(attachment => (
                        <li key={attachment.id} className="flex items-center">
                          <Paperclip size={14} className="mr-2 text-neutral-500" />
                          <a 
                            href={attachment.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {attachment.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <Tabs 
            tabs={tabs} 
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          
          <div className="bg-neutral-light/5 p-4 rounded-lg mt-4">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={description} />
              </div>
            )}
            
            {activeTab === 'requirements' && (
              <div className="prose prose-invert max-w-none">
                {requirements.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium text-neutral-300 mb-1">
                      <CheckCircle size={16} className="mr-1.5" /> 
                      <span>Requirements ({requirements.filter(req => req.completed).length}/{requirements.length})</span>
                    </div>
                    
                    {requirements.map(req => (
                      <div key={req.id} className="flex items-center pl-5">
                        <input 
                          type="checkbox" 
                          checked={req.completed} 
                          onChange={() => {}}
                          className="form-checkbox h-4 w-4 text-primary rounded border-neutral-600 focus:ring-0 focus:ring-offset-0 bg-transparent"
                        />
                        <span className={`ml-2 text-sm ${req.completed ? 'line-through text-neutral-500' : 'text-neutral-300'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-neutral-500">No requirements</div>
                )}
              </div>
            )}
            
            {activeTab === 'implementation' && (
              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={implementationSteps.map(step => step.text).join('\n')} />
              </div>
            )}
            
            {activeTab === 'techSpecs' && (
              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={techSpecs} />
              </div>
            )}
            
            {activeTab === 'testingNotes' && (
              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={testingNotes} />
              </div>
            )}
            
            {activeTab === 'comments' && (
              <div>
                <div className="space-y-6 mb-6">
                  {comments.map((comment, index) => (
                    <div key={comment.id} className="flex items-start">
                      <Avatar src={comment.user.avatarUrl} alt={comment.user.name} size="sm" className="mr-3 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium">{comment.user.name}</span>
                          <span className="mx-2 text-neutral-500">•</span>
                          <span className="text-neutral-400 text-sm">{formatDate(comment.createdAt)}</span>
                        </div>
                        <div className="mt-1 text-neutral-300">{comment.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-start">
                  <Avatar 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Current User" 
                    size="sm" 
                    className="mr-3 mt-1" 
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full bg-neutral-dark border border-neutral-600 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAddComment}
                        disabled={newComment.trim() === ''}
                        className="bg-primary hover:bg-primary/90 disabled:bg-neutral-700 disabled:text-neutral-500 text-white px-4 py-2 rounded-md font-medium"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail; 