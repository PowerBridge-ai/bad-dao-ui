import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search } from 'lucide-react';
import ProposalCard from '../components/common/ProposalCard';
import { getMockProposals } from '../utils/mockData';
import { ProposalStatus, ProposalType } from '../types/proposal';

const Proposals = () => {
  const [proposals, setProposals] = useState<ProposalType[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<ProposalType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'all'>('all');

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        // In a real app, this would fetch data from API/blockchain
        const data = getMockProposals();
        setProposals(data);
        setFilteredProposals(data);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...proposals];
    
    if (statusFilter !== 'all') {
      result = result.filter(proposal => proposal.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        proposal =>
          proposal.title.toLowerCase().includes(query) ||
          proposal.description.toLowerCase().includes(query) ||
          proposal.proposer.toLowerCase().includes(query)
      );
    }
    
    setFilteredProposals(result);
  }, [proposals, statusFilter, searchQuery]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-lg">
        <div className="h-16 bg-neutral-light/50 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          <div className="h-64 bg-neutral-light/50 rounded-lg"></div>
          <div className="h-64 bg-neutral-light/50 rounded-lg"></div>
          <div className="h-64 bg-neutral-light/50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-xl pb-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h1 className="text-h1 mb-sm">Governance Proposals</h1>
          <p className="text-body-lg text-neutral-medium">
            View, vote, and create governance proposals for the DAO
          </p>
        </div>
        
        <Link to="/proposals/create" className="btn-primary self-start md:self-auto">
          <Plus size={18} className="mr-sm" />
          Create Proposal
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-md">
        <div className="relative flex-1">
          <input
            type="text"
            className="input w-full pl-10"
            placeholder="Search proposals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-3.5 text-neutral-medium" />
        </div>
        
        <div className="flex gap-md">
          <div className="relative">
            <button
              type="button"
              className="btn-secondary flex items-center gap-sm"
              onClick={() => {/* Toggle filter dropdown */}}
            >
              <Filter size={18} />
              Filter
            </button>
          </div>
          
          <select
            className="input bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProposalStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="passed">Passed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      {filteredProposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {filteredProposals.map((proposal) => (
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
          ))}
        </div>
      ) : (
        <div className="card text-center py-xl">
          <h3 className="text-h3 mb-md">No proposals found</h3>
          <p className="text-body text-neutral-medium mb-lg">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Be the first to create a proposal for the community'}
          </p>
          <Link to="/proposals/create" className="btn-primary">
            <Plus size={18} className="mr-sm" />
            Create Proposal
          </Link>
        </div>
      )}
    </div>
  );
};

export default Proposals;