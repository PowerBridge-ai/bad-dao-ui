export type ProposalStatus = 'active' | 'pending' | 'passed' | 'rejected';

export interface ProposalType {
  id: string;
  title: string;
  description: string;
  proposer: string;
  createdAt: Date;
  votingEnds?: Date;
  status: ProposalStatus;
  votesFor: number;
  votesAgainst: number;
  abstainVotes: number;
  totalVotes: number;
}