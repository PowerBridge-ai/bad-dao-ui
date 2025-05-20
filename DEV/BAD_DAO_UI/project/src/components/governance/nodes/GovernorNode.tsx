import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Shield } from 'lucide-react';

interface GovernorNodeData {
  name: string;
  votingPeriod: string;
  quorum: string;
  proposalThreshold: string;
}

const GovernorNode: React.FC<NodeProps<GovernorNodeData>> = ({ data }) => {
  return (
    <div className="node governance-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        <div className="node-header">
          <div className="node-icon">
            <Shield size={18} />
          </div>
          <div className="node-title">{data.name || 'Governance'}</div>
        </div>
        <div className="node-body">
          <div className="node-row">
            <div className="node-label">Voting Period:</div>
            <div className="node-value">{data.votingPeriod || '3 days'}</div>
          </div>
          <div className="node-row">
            <div className="node-label">Quorum:</div>
            <div className="node-value">{data.quorum || '20%'}</div>
          </div>
          <div className="node-row">
            <div className="node-label">Proposal Threshold:</div>
            <div className="node-value">{data.proposalThreshold || '1%'}</div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(GovernorNode); 