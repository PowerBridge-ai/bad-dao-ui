import React from 'react';
import { Handle, Position } from 'reactflow';
import { Shield } from 'lucide-react';

interface GovernanceNodeData {
  name: string;
  votingPeriod: string;
  quorum: string;
  proposalThreshold: string;
}

interface GovernanceNodeProps {
  data: GovernanceNodeData;
}

const GovernanceNode: React.FC<GovernanceNodeProps> = ({ data }) => {
  return (
    <div className="node-item governance-node bg-neutral-dark border border-blue-500/20 rounded-lg p-3 min-w-[220px]">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-light/10">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
            <Shield size={16} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{data.name}</h3>
            <div className="text-xs text-neutral-light">Governance Contract</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-light">Voting Period:</span>
          <span className="text-white">{data.votingPeriod}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-light">Quorum:</span>
          <span className="text-white">{data.quorum}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-light">Threshold:</span>
          <span className="text-white">{data.proposalThreshold}</span>
        </div>
      </div>
      
      {/* Input handle - left side */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="token" 
        className="w-3 h-3 bg-blue-500"
      />
      
      {/* Output handle - right side */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="deploy" 
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
};

export default GovernanceNode; 