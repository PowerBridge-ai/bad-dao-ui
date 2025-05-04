import React, { useState } from 'react';
import { 
  Save, 
  X, 
  ChevronDown, 
  Tag, 
  User, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  BarChart2, 
  Shield, 
  CheckCircle 
} from 'lucide-react';

interface TemplateSection {
  title: string;
  type: 'text' | 'markdown' | 'checklist';
  placeholder: string;
  required?: boolean;
  icon?: React.ReactNode;
}

interface TaskTemplateProps {
  onSave: (taskData: any) => void;
  onCancel: () => void;
  templateType?: 'feature' | 'bug' | 'documentation' | 'custom';
}

const TaskTemplate: React.FC<TaskTemplateProps> = ({
  onSave,
  onCancel,
  templateType = 'feature'
}) => {
  // Default template sections based on type
  const getTemplateSections = (): TemplateSection[] => {
    switch (templateType) {
      case 'feature':
        return [
          { 
            title: 'Feature Description', 
            type: 'markdown', 
            placeholder: 'Provide a detailed description of the feature...', 
            required: true,
            icon: <FileText size={16} />
          },
          { 
            title: 'Requirements', 
            type: 'checklist', 
            placeholder: 'Add requirement...', 
            required: true,
            icon: <CheckCircle size={16} />
          },
          { 
            title: 'Implementation Steps', 
            type: 'checklist', 
            placeholder: 'Add implementation step...', 
            required: true,
            icon: <CheckCircle size={16} />
          },
          { 
            title: 'Technical Specifications', 
            type: 'markdown', 
            placeholder: 'Outline technical details, architecture, etc...', 
            required: false,
            icon: <FileText size={16} />
          },
          { 
            title: 'Testing Requirements', 
            type: 'checklist', 
            placeholder: 'Add testing requirement...', 
            required: false,
            icon: <AlertTriangle size={16} />
          },
          { 
            title: 'Documentation Requirements', 
            type: 'checklist', 
            placeholder: 'Add documentation requirement...', 
            required: false,
            icon: <FileText size={16} />
          },
          { 
            title: 'Performance Requirements', 
            type: 'markdown', 
            placeholder: 'Describe performance expectations...', 
            required: false,
            icon: <BarChart2 size={16} />
          },
          { 
            title: 'Security Considerations', 
            type: 'markdown', 
            placeholder: 'Note any security requirements or considerations...', 
            required: false,
            icon: <Shield size={16} />
          },
          { 
            title: 'Acceptance Criteria', 
            type: 'checklist', 
            placeholder: 'Add acceptance criterion...', 
            required: true,
            icon: <CheckCircle size={16} />
          }
        ];
      case 'bug':
        return [
          { 
            title: 'Bug Description', 
            type: 'markdown', 
            placeholder: 'Describe the bug in detail...', 
            required: true,
            icon: <FileText size={16} />
          },
          { 
            title: 'Steps to Reproduce', 
            type: 'checklist', 
            placeholder: 'Add reproduction step...', 
            required: true,
            icon: <CheckCircle size={16} />
          },
          { 
            title: 'Expected Behavior', 
            type: 'markdown', 
            placeholder: 'What should happen?', 
            required: true,
            icon: <FileText size={16} />
          },
          { 
            title: 'Actual Behavior', 
            type: 'markdown', 
            placeholder: 'What happens instead?', 
            required: true,
            icon: <FileText size={16} />
          },
          { 
            title: 'Environment', 
            type: 'markdown', 
            placeholder: 'Browser, OS, etc...', 
            required: false,
            icon: <FileText size={16} />
          },
          { 
            title: 'Possible Fix', 
            type: 'markdown', 
            placeholder: 'If you can, suggest a fix...', 
            required: false,
            icon: <FileText size={16} />
          }
        ];
      case 'documentation':
        return [
          { 
            title: 'Document Title', 
            type: 'text', 
            placeholder: 'Document title...', 
            required: true,
            icon: <FileText size={16} />
          },
          { 
            title: 'Document Purpose', 
            type: 'markdown', 
            placeholder: 'What does this document explain or cover?', 
            required: true,
            icon: <FileText size={16} />
          },
          { 
            title: 'Required Sections', 
            type: 'checklist', 
            placeholder: 'Add section...', 
            required: true,
            icon: <CheckCircle size={16} />
          },
          { 
            title: 'Target Audience', 
            type: 'text', 
            placeholder: 'Who is this document for?', 
            required: true,
            icon: <User size={16} />
          },
          { 
            title: 'Related Documents', 
            type: 'checklist', 
            placeholder: 'Add related document...', 
            required: false,
            icon: <FileText size={16} />
          }
        ];
      case 'custom':
      default:
        return [
          { 
            title: 'Description', 
            type: 'markdown', 
            placeholder: 'Provide a detailed description...', 
            required: true,
            icon: <FileText size={16} />
          },
          { 
            title: 'Checklist', 
            type: 'checklist', 
            placeholder: 'Add item...', 
            required: false,
            icon: <CheckCircle size={16} />
          }
        ];
    }
  };

  // State initialization
  const [title, setTitle] = useState('');
  const [taskNumber, setTaskNumber] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [labels, setLabels] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<string>('');
  const [assignee, setAssignee] = useState<string>('');
  const [sections, setSections] = useState<Record<string, any>>({});
  const templateSections = getTemplateSections();

  // Initialize sections state
  React.useEffect(() => {
    const initialSections: Record<string, any> = {};
    templateSections.forEach(section => {
      if (section.type === 'markdown' || section.type === 'text') {
        initialSections[section.title] = '';
      } else if (section.type === 'checklist') {
        initialSections[section.title] = [{ id: '1', text: '', completed: false }];
      }
    });
    setSections(initialSections);
  }, [templateType]);

  // Handle section content change
  const handleSectionChange = (sectionTitle: string, value: any) => {
    setSections(prev => ({
      ...prev,
      [sectionTitle]: value
    }));
  };

  // Add checklist item
  const addChecklistItem = (sectionTitle: string) => {
    setSections(prev => {
      const newItems = [...prev[sectionTitle], {
        id: Date.now().toString(),
        text: '',
        completed: false
      }];
      return {
        ...prev,
        [sectionTitle]: newItems
      };
    });
  };

  // Update checklist item
  const updateChecklistItem = (sectionTitle: string, itemId: string, text: string) => {
    setSections(prev => {
      const updatedItems = prev[sectionTitle].map((item: any) => 
        item.id === itemId ? { ...item, text } : item
      );
      return {
        ...prev,
        [sectionTitle]: updatedItems
      };
    });
  };

  // Remove checklist item
  const removeChecklistItem = (sectionTitle: string, itemId: string) => {
    setSections(prev => {
      const updatedItems = prev[sectionTitle].filter((item: any) => item.id !== itemId);
      return {
        ...prev,
        [sectionTitle]: updatedItems
      };
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredSections = templateSections.filter(section => section.required);
    const invalidSections = requiredSections.filter(section => {
      if (section.type === 'markdown' || section.type === 'text') {
        return !sections[section.title]?.trim();
      } else if (section.type === 'checklist') {
        return !sections[section.title]?.length || 
          !sections[section.title].some((item: any) => item.text.trim());
      }
      return false;
    });

    if (!title.trim() || invalidSections.length > 0) {
      alert('Please fill in all required fields.');
      return;
    }

    // Prepare task data
    const taskData = {
      title,
      taskNumber: taskNumber || `BAD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      priority,
      labels,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      assignee: assignee || undefined,
      description: sections['Feature Description'] || sections['Bug Description'] || sections['Description'] || '',
      requirements: sections['Requirements'] || [],
      implementationSteps: sections['Implementation Steps'] || [],
      technicalSpecification: sections['Technical Specifications'] || '',
      testingRequirements: sections['Testing Requirements'] || [],
      documentationRequirements: sections['Documentation Requirements'] || [],
      performanceRequirements: sections['Performance Requirements'] || '',
      securityConsiderations: sections['Security Considerations'] || '',
      acceptanceCriteria: sections['Acceptance Criteria'] || [],
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onSave(taskData);
  };

  const renderTextInput = (section: TemplateSection) => (
    <input
      type="text"
      placeholder={section.placeholder}
      value={sections[section.title] || ''}
      onChange={e => handleSectionChange(section.title, e.target.value)}
      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
    />
  );

  const renderMarkdownInput = (section: TemplateSection) => (
    <textarea
      placeholder={section.placeholder}
      value={sections[section.title] || ''}
      onChange={e => handleSectionChange(section.title, e.target.value)}
      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px]"
      rows={5}
    />
  );

  const renderChecklistInput = (section: TemplateSection) => (
    <div className="space-y-2">
      {sections[section.title]?.map((item: any, index: number) => (
        <div key={item.id} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder={`${index + 1}. ${section.placeholder}`}
            value={item.text}
            onChange={e => updateChecklistItem(section.title, item.id, e.target.value)}
            className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => removeChecklistItem(section.title, item.id)}
            className="p-2 text-neutral-400 hover:text-red-400"
          >
            <X size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addChecklistItem(section.title)}
        className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-md text-sm flex items-center hover:bg-neutral-700"
      >
        + Add item
      </button>
    </div>
  );

  const renderSectionInput = (section: TemplateSection) => {
    switch (section.type) {
      case 'text':
        return renderTextInput(section);
      case 'markdown':
        return renderMarkdownInput(section);
      case 'checklist':
        return renderChecklistInput(section);
      default:
        return null;
    }
  };

  return (
    <div className="bg-neutral-900 text-white rounded-lg border border-neutral-800 overflow-hidden max-w-5xl mx-auto">
      <div className="bg-neutral-800/50 px-6 py-4 border-b border-neutral-800">
        <h2 className="text-xl font-semibold">
          New {templateType.charAt(0).toUpperCase() + templateType.slice(1)} Task
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Title and task number */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Task Number
              </label>
              <input
                type="text"
                placeholder="BAD-XXX"
                value={taskNumber}
                onChange={e => setTaskNumber(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <span className="text-xs text-neutral-500 mt-1 block">
                Leave blank for auto-generation
              </span>
            </div>
          </div>
          
          {/* Task metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Assignee
              </label>
              <input
                type="text"
                placeholder="Select assignee"
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Labels */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Labels
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {labels.map((label, index) => (
                <span 
                  key={index} 
                  className="bg-neutral-800 text-neutral-300 px-2 py-1 rounded-md text-xs flex items-center"
                >
                  {label}
                  <button 
                    type="button"
                    onClick={() => setLabels(labels.filter((_, i) => i !== index))}
                    className="ml-1 text-neutral-500 hover:text-red-400"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add label"
                id="new-label"
                className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim()) {
                      setLabels([...labels, input.value.trim()]);
                      input.value = '';
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('new-label') as HTMLInputElement;
                  if (input.value.trim()) {
                    setLabels([...labels, input.value.trim()]);
                    input.value = '';
                  }
                }}
                className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-md text-sm flex items-center hover:bg-neutral-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        
        {/* Template sections */}
        <div className="space-y-6">
          {templateSections.map((section) => (
            <div key={section.title} className="border border-neutral-800 rounded-lg overflow-hidden">
              <div className="bg-neutral-800/30 px-4 py-3 flex items-center">
                <div className="text-primary mr-2">
                  {section.icon}
                </div>
                <h3 className="text-md font-medium">
                  {section.title}
                  {section.required && <span className="text-red-400 ml-1">*</span>}
                </h3>
              </div>
              <div className="p-4">
                {renderSectionInput(section)}
              </div>
            </div>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-neutral-800 text-white rounded-md text-sm font-medium hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md text-sm font-medium flex items-center"
          >
            <Save size={16} className="mr-2" />
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskTemplate; 