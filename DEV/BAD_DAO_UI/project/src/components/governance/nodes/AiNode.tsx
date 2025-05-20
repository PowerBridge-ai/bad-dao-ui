import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Bot } from 'lucide-react';

interface AiNodeData {
  name: string;
  model: string;
  purpose: string;
}

const AiNode: React.FC<NodeProps<AiNodeData>> = ({ data }) => {
  return (
    <div className="node ai-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        <div className="node-header">
          <div className="node-icon">
            <Bot size={18} />
          </div>
          <div className="node-title">{data.name || 'AI Integration'}</div>
        </div>
        <div className="node-body">
          <div className="node-row">
            <div className="node-label">Model:</div>
            <div className="node-value">{data.model || 'GPT-4'}</div>
          </div>
          <div className="node-row">
            <div className="node-label">Purpose:</div>
            <div className="node-value">{data.purpose || 'Voting analysis'}</div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(AiNode); 