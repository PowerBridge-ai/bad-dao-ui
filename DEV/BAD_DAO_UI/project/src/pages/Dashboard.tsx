import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SummaryMetrics from '../components/dashboard/SummaryMetrics';
import ProposalCard from '../components/common/ProposalCard';
import TreasuryCard from '../components/common/TreasuryCard';
import { getMockProposals } from '../utils/mockData';
import { ProposalType } from '../types/proposal';

const Dashboard = () => {
  const [activeProposals, setActiveProposals] = useState<ProposalType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would fetch data from API/blockchain
        const proposals = getMockProposals();
        setActiveProposals(proposals.filter(p => p.status === 'active').slice(0, 2));
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-lg">
        <div className="h-32 bg-neutral-light/50 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="h-64 bg-neutral-light/50 rounded-lg"></div>
          <div className="h-64 bg-neutral-light/50 rounded-lg"></div>
        </div>
        <div className="h-48 bg-neutral-light/50 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-xl pb-lg">
      <SummaryMetrics
        activeProposals={5}
        totalVotingPower={1250000}
        treasuryBalance="$3.2M"
        memberCount={872}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <div>
          <div className="flex items-center justify-between mb-md">
            <h2 className="text-h2">Active Proposals</h2>
            <Link to="/proposals" className="btn-tertiary">
              View All
              <ArrowRight size={16} className="ml-sm" />
            </Link>
          </div>
          
          <div className="space-y-md">
            {activeProposals.length > 0 ? (
              activeProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  id={proposal.id}
                  title={proposal.title}
                  description={proposal.description}
                  proposer={proposal.proposer}
                  createdAt={proposal.createdAt}
                  status={proposal.status}
                  votesFor={proposal.votesFor}
                  votesAgainst={proposal.votesAgainst}
                  totalVotes={proposal.votesFor + proposal.votesAgainst}
                />
              ))
            ) : (
              <div className="card">
                <p className="text-body text-neutral-medium">No active proposals.</p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-md">
            <h2 className="text-h2">Treasury Overview</h2>
            <Link to="/treasury" className="btn-tertiary">
              View Details
              <ArrowRight size={16} className="ml-sm" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <TreasuryCard
              title="Total Value"
              value="$3,241,590"
              changePercent={2.4}
              change="$78,245"
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="#6E8EFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#6E8EFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>}
            />
            
            <TreasuryCard
              title="ETH Balance"
              value="876.24 ETH"
              changePercent={-1.3}
              change="-11.54 ETH"
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.9982 2L11.8564 2.54343V16.0846L11.9982 16.2281L18.2667 12.357L11.9982 2Z" fill="#6E8EFA"/>
                <path d="M11.9966 2L5.72656 12.357L11.9966 16.2281V9.66243V2Z" fill="#6E8EFA" fillOpacity="0.6"/>
                <path d="M11.9982 17.455L11.918 17.5542V22.7463L11.9982 22.9999L18.2735 13.5876L11.9982 17.455Z" fill="#6E8EFA"/>
                <path d="M11.9966 22.9999V17.455L5.72656 13.5876L11.9966 22.9999Z" fill="#6E8EFA" fillOpacity="0.6"/>
                <path d="M11.9971 16.2281L18.2656 12.357L11.9971 9.66243V16.2281Z" fill="#6E8EFA" fillOpacity="0.8"/>
                <path d="M5.72656 12.357L11.9966 16.2281V9.66243L5.72656 12.357Z" fill="#6E8EFA" fillOpacity="0.8"/>
              </svg>}
            />
            
            <TreasuryCard
              title="USDC Balance"
              value="1,245,000 USDC"
              changePercent={0}
              change="0 USDC"
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#6E8EFA" fillOpacity="0.2"/>
                <path d="M12.9167 15.3583C12.9167 15.95 12.5667 16.3 11.975 16.3H10.8333V17.5H9.66667V16.3H8.75V15.1333H9.66667H11.975C12.5667 15.1333 12.9167 14.7833 12.9167 14.1917C12.9167 13.6 12.5667 13.25 11.975 13.25H10.025C9.08333 13.25 8.58333 12.5583 8.58333 11.6167C8.58333 10.675 9.08333 9.98333 10.025 9.98333H10.8333V8.75H11.9917V9.98333H12.9167V11.15H11.9917H10.025C9.43333 11.15 9.08333 11.5 9.08333 12.0917C9.08333 12.6833 9.43333 13.0333 10.025 13.0333H11.975C12.9167 13.0333 13.4167 13.725 13.4167 14.6667C13.4167 15.6083 12.9167 16.3 11.975 16.3" fill="#6E8EFA"/>
                <path d="M12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5Z" stroke="#6E8EFA" strokeWidth="1.5" strokeMiterlimit="10"/>
              </svg>}
            />
            
            <TreasuryCard
              title="Token Price"
              value="$1.24"
              changePercent={5.1}
              change="$0.06"
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3V6M12 18V21M5.63604 5.63604L7.75736 7.75736M16.2426 16.2426L18.364 18.364M3 12H6M18 12H21M5.63604 18.364L7.75736 16.2426M16.2426 7.75736L18.364 5.63604" stroke="#6E8EFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#6E8EFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>}
            />
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-md">
          <h2 className="text-h2">Recent Transactions</h2>
          <Link to="/treasury" className="btn-tertiary">
            View All
            <ArrowRight size={16} className="ml-sm" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-light">
                <th className="px-md py-sm text-label text-neutral-medium font-semibold">Transaction</th>
                <th className="px-md py-sm text-label text-neutral-medium font-semibold">Amount</th>
                <th className="px-md py-sm text-label text-neutral-medium font-semibold">Date</th>
                <th className="px-md py-sm text-label text-neutral-medium font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-light">
                <td className="px-md py-md">
                  <div>
                    <p className="text-body font-medium">Treasury Withdrawal</p>
                    <p className="text-body-sm text-neutral-medium">0x3ab...12cd</p>
                  </div>
                </td>
                <td className="px-md py-md">
                  <p className="text-body">45.5 ETH</p>
                </td>
                <td className="px-md py-md">
                  <p className="text-body-sm">April 15, 2025</p>
                </td>
                <td className="px-md py-md">
                  <span className="badge badge-success">Completed</span>
                </td>
              </tr>
              <tr className="border-b border-neutral-light">
                <td className="px-md py-md">
                  <div>
                    <p className="text-body font-medium">Token Purchase</p>
                    <p className="text-body-sm text-neutral-medium">0xabc...78ef</p>
                  </div>
                </td>
                <td className="px-md py-md">
                  <p className="text-body">250,000 USDC</p>
                </td>
                <td className="px-md py-md">
                  <p className="text-body-sm">April 12, 2025</p>
                </td>
                <td className="px-md py-md">
                  <span className="badge badge-success">Completed</span>
                </td>
              </tr>
              <tr className="border-b border-neutral-light">
                <td className="px-md py-md">
                  <div>
                    <p className="text-body font-medium">Developer Grant</p>
                    <p className="text-body-sm text-neutral-medium">0xdef...45ab</p>
                  </div>
                </td>
                <td className="px-md py-md">
                  <p className="text-body">15.75 ETH</p>
                </td>
                <td className="px-md py-md">
                  <p className="text-body-sm">April 8, 2025</p>
                </td>
                <td className="px-md py-md">
                  <span className="badge badge-info">Pending</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;