import { ArrowUpRight, Users, FileText, Wallet } from 'lucide-react';

interface SummaryMetricsProps {
  activeProposals: number;
  totalVotingPower: number;
  treasuryBalance: string;
  memberCount: number;
}

const SummaryMetrics = ({
  activeProposals,
  totalVotingPower,
  treasuryBalance,
  memberCount,
}: SummaryMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
      <div className="card">
        <div className="flex items-center mb-md">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-md">
            <FileText size={20} className="text-primary" />
          </div>
          <h3 className="text-label text-neutral-medium">Active Proposals</h3>
        </div>
        <p className="text-h2 font-bold">{activeProposals}</p>
        <a href="/proposals" className="mt-sm text-primary text-body-sm font-medium flex items-center hover:underline">
          View all proposals
          <ArrowUpRight size={14} className="ml-1" />
        </a>
      </div>
      
      <div className="card">
        <div className="flex items-center mb-md">
          <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center mr-md">
            <Users size={20} className="text-accent-green" />
          </div>
          <h3 className="text-label text-neutral-medium">DAO Members</h3>
        </div>
        <p className="text-h2 font-bold">{memberCount}</p>
        <p className="mt-sm text-body-sm text-neutral-medium">
          With active participation
        </p>
      </div>
      
      <div className="card">
        <div className="flex items-center mb-md">
          <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center mr-md">
            <Wallet size={20} className="text-accent-gold" />
          </div>
          <h3 className="text-label text-neutral-medium">Treasury Balance</h3>
        </div>
        <p className="text-h2 font-bold">{treasuryBalance}</p>
        <a href="/treasury" className="mt-sm text-primary text-body-sm font-medium flex items-center hover:underline">
          View treasury
          <ArrowUpRight size={14} className="ml-1" />
        </a>
      </div>
      
      <div className="card">
        <div className="flex items-center mb-md">
          <div className="w-10 h-10 rounded-full bg-primary-light/10 flex items-center justify-center mr-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-light">
              <path d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-label text-neutral-medium">Voting Power</h3>
        </div>
        <p className="text-h2 font-bold">{totalVotingPower.toLocaleString()}</p>
        <p className="mt-sm text-body-sm text-neutral-medium">
          Total governance tokens
        </p>
      </div>
    </div>
  );
};

export default SummaryMetrics;