import React from 'react';
import { Handle, Position } from 'reactflow';
import { Coins } from 'lucide-react';

interface TokenNodeData {
  name: string;
  symbol: string;
  decimals: string;
  supply: string;
}

interface TokenNodeProps {
  data: TokenNodeData;
}

const TokenNode: React.FC<TokenNodeProps> = ({ data }) => {
  return (
    <div className="node-item token-node bg-neutral-dark border border-emerald-500/20 rounded-lg p-3 min-w-[220px]">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-light/10">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-2">
            <Coins size={16} className="text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{data.name}</h3>
            <div className="text-xs text-neutral-light">{data.symbol}</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-light">Supply:</span>
          <span className="text-white">{data.supply}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-light">Decimals:</span>
          <span className="text-white">{data.decimals}</span>
        </div>
      </div>
      
      {/* Output handle - right side */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="token" 
        className="w-3 h-3 bg-emerald-500"
      />
    </div>
  );
};

export default TokenNode; 