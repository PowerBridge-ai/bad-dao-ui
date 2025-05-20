import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Users } from 'lucide-react';

interface DelegationNodeData {
  name: string;
  minDelegation: string;
  maxDelegates: string;
}

const DelegationNode: React.FC<NodeProps<DelegationNodeData>> = ({ data }) => {
  return (
    <div className="node delegation-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        <div className="node-header">
          <div className="node-icon">
            <Users size={18} />
          </div>
          <div className="node-title">{data.name || 'Delegation'}</div>
        </div>
        <div className="node-body">
          <div className="node-row">
            <div className="node-label">Min Delegation:</div>
            <div className="node-value">{data.minDelegation || '1000'}</div>
          </div>
          <div className="node-row">
            <div className="node-label">Max Delegates:</div>
            <div className="node-value">{data.maxDelegates || '10'}</div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(DelegationNode); 