// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IBADToken {
    function balanceOf(address account) external view returns (uint256);
}

contract GovernanceVoting {
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 voteStart;
        uint256 voteEnd;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        bool passed;
    }

    uint256 public constant CREATION_THRESHOLD = 5_000 * 10 ** 18;
    uint256 public constant MIN_PARTICIPATION = 10_000 * 10 ** 18;
    uint256 public constant VOTING_DURATION = 3 days;

    IBADToken public badToken;
    uint256 public proposalCount;

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed id, address proposer, string description);
    event Voted(uint256 indexed id, address voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed id, bool passed);

    constructor(address _badToken) {
        badToken = IBADToken(_badToken);
    }

    function createProposal(string calldata description) external returns (uint256) {
        require(badToken.balanceOf(msg.sender) >= CREATION_THRESHOLD, "Not enough BAD to create proposal");

        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            proposer: msg.sender,
            description: description,
            voteStart: block.timestamp,
            voteEnd: block.timestamp + VOTING_DURATION,
            forVotes: 0,
            againstVotes: 0,
            executed: false,
            passed: false
        });

        emit ProposalCreated(proposalCount, msg.sender, description);
        return proposalCount;
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage prop = proposals[proposalId];
        require(block.timestamp >= prop.voteStart && block.timestamp <= prop.voteEnd, "Voting closed");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        uint256 weight = badToken.balanceOf(msg.sender);
        require(weight > 0, "No voting power");

        if (support) {
            prop.forVotes += weight;
        } else {
            prop.againstVotes += weight;
        }

        hasVoted[proposalId][msg.sender] = true;
        emit Voted(proposalId, msg.sender, support, weight);
    }

    function executeProposal(uint256 proposalId) external {
        Proposal storage prop = proposals[proposalId];
        require(block.timestamp > prop.voteEnd, "Voting not ended");
        require(!prop.executed, "Already executed");

        uint256 totalVotes = prop.forVotes + prop.againstVotes;
        require(totalVotes >= MIN_PARTICIPATION, "Not enough participation");

        prop.passed = prop.forVotes > prop.againstVotes;
        prop.executed = true;

        emit ProposalExecuted(proposalId, prop.passed);
    }

    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        string memory description,
        uint256 forVotes,
        uint256 againstVotes,
        bool executed,
        bool passed
    ) {
        Proposal storage prop = proposals[proposalId];
        return (prop.proposer, prop.description, prop.forVotes, prop.againstVotes, prop.executed, prop.passed);
    }
}
