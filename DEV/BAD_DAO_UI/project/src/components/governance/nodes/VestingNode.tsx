import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Clock } from 'lucide-react';

interface VestingNodeData {
  name: string;
  period: string;
  cliff: string;
}

const VestingNode: React.FC<NodeProps<VestingNodeData>> = ({ data }) => {
  return (
    <div className="node vesting-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        <div className="node-header">
          <div className="node-icon">
            <Clock size={18} />
          </div>
          <div className="node-title">{data.name || 'Vesting'}</div>
        </div>
        <div className="node-body">
          <div className="node-row">
            <div className="node-label">Period:</div>
            <div className="node-value">{data.period || '12 months'}</div>
          </div>
          <div className="node-row">
            <div className="node-label">Cliff:</div>
            <div className="node-value">{data.cliff || '3 months'}</div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(VestingNode); 