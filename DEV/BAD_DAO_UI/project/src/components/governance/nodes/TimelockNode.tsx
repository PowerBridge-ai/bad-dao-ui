import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Clock } from 'lucide-react';

interface TimelockNodeData {
  name: string;
  delay: string;
}

const TimelockNode: React.FC<NodeProps<TimelockNodeData>> = ({ data }) => {
  return (
    <div className="node timelock-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        <div className="node-header">
          <div className="node-icon">
            <Clock size={18} />
          </div>
          <div className="node-title">{data.name || 'Timelock'}</div>
        </div>
        <div className="node-body">
          <div className="node-row">
            <div className="node-label">Delay:</div>
            <div className="node-value">{data.delay || '24 hours'}</div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(TimelockNode); 