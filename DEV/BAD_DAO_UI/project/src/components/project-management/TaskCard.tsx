import { Calendar, Clock, Tag, User, ArrowRight, BarChart3, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

interface TaskCardProps {
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
  onClick?: () => void;
}

const TaskCard = ({
  id,
  title,
  description,
  assignee,
  dueDate,
  createdAt,
  priority,
  status,
  tags,
  bountyAmount,
  bountyToken,
  taskNumber,
  onClick
}: TaskCardProps) => {
  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case 'critical':
        return {
          label: 'Critical',
          className: 'bg-red-800/20 text-red-300'
        };
      case 'high':
        return {
          label: 'High',
          className: 'bg-orange-800/20 text-orange-300'
        };
      case 'medium':
        return {
          label: 'Medium',
          className: 'bg-yellow-800/20 text-yellow-300'
        };
      case 'low':
        return {
          label: 'Low',
          className: 'bg-blue-800/20 text-blue-300'
        };
      default:
        return {
          label: 'Medium',
          className: 'bg-yellow-800/20 text-yellow-300'
        };
    }
  };

  const priorityInfo = getPriorityLabel(priority);
  
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };
  
  const formattedDescription = truncateText(description, 120);

  return (
    <Link
      to={`/project-management/task/${id}`}
      onClick={onClick}
      className="block"
    >
      <div className="bg-neutral-800/40 hover:bg-neutral-800/70 border border-neutral-700/50 rounded-lg overflow-hidden transition-colors">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white font-medium line-clamp-2">
              {taskNumber && <span className="text-neutral-400 mr-1">[{taskNumber}]</span>}
              {title}
            </h3>
          </div>
          
          <p className="text-neutral-400 text-sm mb-3 line-clamp-2">{formattedDescription}</p>
          
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityInfo.className}`}>
              {priorityInfo.label}
            </span>
            {tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="bg-neutral-700/50 text-neutral-300 px-2 py-0.5 rounded text-xs">
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="bg-neutral-700/50 text-neutral-300 px-2 py-0.5 rounded text-xs">
                +{tags.length - 2}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center space-x-3">
              {assignee && (
                <div className="flex items-center">
                  <User size={12} className="mr-1.5" />
                  <span>{assignee.name}</span>
                </div>
              )}
              {dueDate && (
                <div className="flex items-center">
                  <Calendar size={12} className="mr-1.5" />
                  <span className={new Date() > dueDate ? 'text-red-400' : ''}>
                    {formatDistanceToNow(dueDate, { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>
            
            {bountyAmount && (
              <div className="flex items-center">
                <span className="font-medium text-primary">
                  {bountyAmount} {bountyToken || 'BAD'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between border-t border-neutral-700/50 px-4 py-2 bg-neutral-800/40">
          <div className="flex items-center space-x-2 text-xs text-neutral-400">
            <div className="flex items-center">
              <Clock size={12} className="mr-1.5" />
              <span>Created {formatDistanceToNow(createdAt, { addSuffix: true })}</span>
            </div>
          </div>
          <div className="text-primary">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TaskCard; 