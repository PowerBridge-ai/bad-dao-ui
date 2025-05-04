import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { mockDAOs } from '../mock/daos';

const CreateBountyPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    daoId: '',
    amount: '',
    tokenSymbol: 'USDC',
    dueDate: '',
    difficulty: 'intermediate',
    skills: [] as string[],
    currentSkill: ''
  });
  
  // Common skills for the dropdown
  const suggestedSkills = [
    'Solidity', 'React', 'TypeScript', 'Smart Contracts', 'DeFi', 
    'GraphQL', 'The Graph', 'EVM', 'Gas Optimization', 'Web3.js',
    'Ethers.js', 'Rust', 'Go', 'Python', 'Frontend', 'Backend'
  ];
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Add a skill
  const addSkill = () => {
    if (formData.currentSkill && !formData.skills.includes(formData.currentSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.currentSkill],
        currentSkill: ''
      }));
    }
  };
  
  // Remove a skill
  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  // Handle skill selection from dropdown
  const handleSkillSelect = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill],
        currentSkill: ''
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.daoId || !formData.amount || !formData.dueDate || formData.skills.length === 0) {
      alert('Please fill in all required fields');
      return;
    }
    
    // In a real app, would send to API and create a new bounty
    // For this example, just show success and navigate back
    alert('Bounty created successfully!');
    navigate('/project-management/bounties');
  };
  
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/project-management/bounties')}
          className="flex items-center text-primary hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to bounties
        </button>
        <h1 className="text-3xl font-bold text-white mt-4">Create New Bounty</h1>
        <p className="text-neutral-400 mt-1">Post a bounty to find contributors for your project</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="mb-5">
                <label htmlFor="title" className="block text-white font-medium mb-2">
                  Bounty Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-3 text-white"
                  placeholder="E.g., Implement Staking Smart Contract"
                  required
                />
              </div>
              
              <div className="mb-5">
                <label htmlFor="description" className="block text-white font-medium mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-3 text-white h-40"
                  placeholder="Describe the bounty in detail. Include requirements, deliverables, and any other important information."
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label htmlFor="daoId" className="block text-white font-medium mb-2">
                    DAO / Organization *
                  </label>
                  <select
                    id="daoId"
                    name="daoId"
                    value={formData.daoId}
                    onChange={handleChange}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-3 text-white"
                    required
                  >
                    <option value="" disabled>Select a DAO</option>
                    {mockDAOs.map(dao => (
                      <option key={dao.id} value={dao.id}>{dao.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="difficulty" className="block text-white font-medium mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-3 text-white"
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label htmlFor="amount" className="block text-white font-medium mb-2">
                    Reward Amount *
                  </label>
                  <div className="flex">
                    <span className="bg-neutral-600 text-white px-3 flex items-center rounded-l-md border border-neutral-600">$</span>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full bg-neutral-700 border border-neutral-600 border-l-0 rounded-r-md p-3 text-white"
                      placeholder="1000"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="tokenSymbol" className="block text-white font-medium mb-2">
                    Token Symbol *
                  </label>
                  <select
                    id="tokenSymbol"
                    name="tokenSymbol"
                    value={formData.tokenSymbol}
                    onChange={handleChange}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-3 text-white"
                    required
                  >
                    <option value="USDC">USDC</option>
                    <option value="ETH">ETH</option>
                    <option value="USDT">USDT</option>
                    <option value="DAI">DAI</option>
                    {/* Add the DAO tokens */}
                    <option value="PEAQ">PEAQ</option>
                    <option value="MKR">MKR</option>
                    <option value="ANT">ANT</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-5">
                <label htmlFor="dueDate" className="block text-white font-medium mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-3 text-white"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="mb-5">
                <label htmlFor="skills" className="block text-white font-medium mb-2">
                  Required Skills *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    id="currentSkill"
                    name="currentSkill"
                    value={formData.currentSkill}
                    onChange={handleChange}
                    placeholder="Add a skill"
                    className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-3 text-white"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                {/* Suggested skills */}
                <div className="mb-3">
                  <p className="text-sm text-neutral-400 mb-1">Suggested skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSkills
                      .filter(skill => !formData.skills.includes(skill))
                      .slice(0, 8)
                      .map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSkillSelect(skill)}
                          className="text-xs bg-neutral-700 text-neutral-300 py-1 px-2 rounded hover:bg-neutral-600 transition-colors"
                        >
                          + {skill}
                        </button>
                      ))}
                  </div>
                </div>
                
                {/* Selected skills */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.skills.map(skill => (
                    <div 
                      key={skill} 
                      className="flex items-center bg-neutral-700/40 text-neutral-200 py-1 px-3 rounded-full"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-neutral-400 hover:text-neutral-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {formData.skills.length === 0 && (
                    <p className="text-sm text-neutral-500 italic">No skills added yet</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => navigate('/project-management/bounties')}
                  className="bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-2.5 px-5 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-5 rounded-md transition-colors"
                >
                  Create Bounty
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Sidebar */}
        <div>
          <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg overflow-hidden sticky top-6">
            <div className="p-5 border-b border-neutral-700/50">
              <h2 className="text-lg font-semibold text-white">Tips for Creating Bounties</h2>
            </div>
            
            <div className="p-5">
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-1">Clear Requirements</h3>
                  <p className="text-sm text-neutral-400">Be specific about what you need. Include detailed requirements, acceptance criteria, and any technical specifications.</p>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-1">Fair Compensation</h3>
                  <p className="text-sm text-neutral-400">Set a reward that matches the complexity and time requirements of the task. Fair pay attracts better contributors.</p>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-1">Realistic Deadlines</h3>
                  <p className="text-sm text-neutral-400">Give contributors enough time to deliver quality work. Rushed deadlines often lead to poor results.</p>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-1">Accurate Skills</h3>
                  <p className="text-sm text-neutral-400">List only the skills that are truly needed for the bounty. This helps match it with the right contributors.</p>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-1">Communication</h3>
                  <p className="text-sm text-neutral-400">Be available to answer questions and provide feedback during the bounty's lifecycle.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBountyPage; 