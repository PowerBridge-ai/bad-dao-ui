import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Wallet } from 'lucide-react';

interface TreasuryNodeData {
  name: string;
  multiSig: boolean;
  threshold: number;
}

const TreasuryNode: React.FC<NodeProps<TreasuryNodeData>> = ({ data }) => {
  return (
    <div className="node treasury-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        <div className="node-header">
          <div className="node-icon">
            <Wallet size={18} />
          </div>
          <div className="node-title">{data.name || 'Treasury'}</div>
        </div>
        <div className="node-body">
          <div className="node-row">
            <div className="node-label">Multi-Sig:</div>
            <div className="node-value">{data.multiSig ? 'Yes' : 'No'}</div>
          </div>
          <div className="node-row">
            <div className="node-label">Threshold:</div>
            <div className="node-value">{data.threshold || 1}</div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(TreasuryNode); 