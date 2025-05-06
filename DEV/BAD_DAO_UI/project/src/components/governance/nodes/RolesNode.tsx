import React from 'react';
import { Handle, Position } from 'reactflow';
import { Users } from 'lucide-react';

interface Role {
  name: string;
  percentage: number;
}

interface RolesNodeData {
  name: string;
  roles: Role[];
}

interface RolesNodeProps {
  data: RolesNodeData;
}

const RolesNode: React.FC<RolesNodeProps> = ({ data }) => {
  return (
    <div className="node-item roles-node bg-neutral-dark border border-purple-500/20 rounded-lg p-3 min-w-[220px]">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-light/10">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
            <Users size={16} className="text-purple-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{data.name}</h3>
            <div className="text-xs text-neutral-light">Role Distribution</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-1 text-sm max-h-24 overflow-y-auto">
        {data.roles && data.roles.map((role, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-neutral-light">{role.name}:</span>
            <span className="text-white">{role.percentage}%</span>
          </div>
        ))}
      </div>
      
      {/* Output handle - right side */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="roles" 
        className="w-3 h-3 bg-purple-500"
      />
    </div>
  );
};

export default RolesNode; 