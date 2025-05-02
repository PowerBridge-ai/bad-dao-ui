# 📝 BAD DAO Technical Implementation Notes

## 🔧 System Overview

This document contains technical implementation notes, configuration details, and development decisions for the BAD DAO governance system implementation. It serves as a reference for developers working on the implementation of the proposals.

## 🛠️ Technical Stack

- **Frontend**: React.js, Next.js, Ethers.js
- **Backend**: Node.js, Express, PostgreSQL
- **Blockchain**: Base (Ethereum L2)
- **Smart Contracts**: Solidity
- **Contract Framework**: Hardhat
- **Testing**: Mocha, Chai, Waffle
- **Integration Tools**: Snapshot.org, Gnosis Safe, Thirdweb
- **CI/CD**: GitHub Actions
- **Documentation**: Markdown, Mermaid Diagrams

## 📊 Implementation Tasks

### BAD-PROP-20230515-0008-GOV: Snapshot Governance Implementation

#### Configuration Details

```yaml
# Snapshot Space Configuration
space_name: "BAD DAO"
ens_domain: "baddao.eth" # To be registered
strategies:
  - name: "erc20-balance-of"
    network: 8453 # Base chain ID
    params:
      address: "0x..." # BAD token address
      symbol: "BAD"
      decimals: 18
  - name: "delegation"
    network: 8453
    params:
      address: "0x..." # BAD token address
      symbol: "BAD"
      decimals: 18

# Voting Configuration
voting:
  delay: 0 # No delay
  period: 259200 # 72 hours in seconds
  type: "single-choice"
  quorum: 2 # 2% of total supply

# Proposal Validation
validation:
  name: "basic"
  params:
    minScore: 100000 # 100,000 BAD tokens to create proposal
```

#### Setup Commands

```bash
# Install Snapshot CLI (if available)
npm install -g @snapshot-labs/snapshot-cli

# Create and configure space (manual process through web UI)
# 1. Go to https://snapshot.org/#/setup
# 2. Connect wallet that will be the admin
# 3. Configure with the above parameters

# ENS Domain Registration
# 1. Go to app.ens.domains
# 2. Search for "baddao.eth"
# 3. Register domain (if available)
# 4. Link to Snapshot space
```

#### Implementation Notes

- Need to determine the exact BAD token address on Base network
- Must coordinate admin wallet access with core team members
- Consider implementing custom UI integration with Snapshot API
- Ensure voting power calculation includes token balances and delegation
- Test different proposal types before finalizing space settings

### BAD-PROP-20230515-0009-TREAS: Treasury Management Implementation

#### Gnosis Safe Configuration

```yaml
# Main Treasury Safe
name: "BAD DAO Treasury"
network: "Base"
owners:
  - "0x..." # Core Team Member 1
  - "0x..." # Core Team Member 2
  - "0x..." # Core Team Member 3
  - "0x..." # Core Team Member 4
  - "0x..." # Core Team Member 5
  - "0x..." # Core Team Member 6
threshold: 4
fallback_handler: "default"

# Operations Safe
name: "BAD DAO Operations"
network: "Base"
owners:
  - "0x..." # President
  - "0x..." # Head of Asset Ops
  - "0x..." # Head of CRC
  - "0x..." # AI Representative
threshold: 3
fallback_handler: "default"
```

#### Setup Commands

```bash
# Gnosis Safe Setup
# 1. Go to https://app.safe.global/
# 2. Connect wallet that will be an owner
# 3. Select Base network
# 4. Click "Create new Safe"
# 5. Configure with above parameters
# 6. Deploy Safe contract

# Safe Transaction Service API Access
# For treasury dashboard integration
API_URL="https://safe-transaction-base.safe.global/api"
```

### BAD-PROP-20230515-0010-TKN: Token Distribution Implementation

#### Token Contract Configuration

```solidity
// BAD Token Contract Parameters
string public constant name = "BAD Token";
string public constant symbol = "BAD";
uint8 public constant decimals = 18;
uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18; // 100 million tokens

// Vesting Contract Parameters
uint256 public constant CLIFF_DURATION = 365 days; // 1 year cliff for core team
uint256 public constant VESTING_DURATION = 1460 days; // 4 year vesting for core team
```

#### Vesting Schedule

```yaml
# Core Team Vesting
vesting_contract: "LinearVesting"
cliff_period: "365 days"
vesting_period: "1460 days"
release_frequency: "30 days"
total_allocation: "15000000 BAD"

# Early Contributors Vesting
vesting_contract: "LinearVesting"
cliff_period: "180 days"
vesting_period: "1095 days"
release_frequency: "30 days"
total_allocation: "10000000 BAD"

# Ecosystem Development Vesting
vesting_contract: "LinearVesting"
cliff_period: "0 days"
vesting_period: "730 days"
release_frequency: "30 days"
total_allocation: "15000000 BAD"
```

### BAD-PROP-20230515-0011-DEL: Delegation System Implementation

#### Delegation Configuration

```yaml
# Snapshot Delegation
delegation_type: "snapshot"
space_id: "baddao.eth"
delegation_api: "https://hub.snapshot.org/graphql"

# Delegation UI Parameters
min_token_requirement: 10000 # 10,000 BAD tokens to become delegate
```

#### Delegation Database Schema

```sql
-- Delegate profiles table
CREATE TABLE delegate_profiles (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) NOT NULL UNIQUE,
  name VARCHAR(255),
  profile_image VARCHAR(255),
  governance_philosophy TEXT,
  experience TEXT,
  social_links JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Delegation activity table
CREATE TABLE delegation_activity (
  id SERIAL PRIMARY KEY,
  delegator VARCHAR(42) NOT NULL,
  delegate VARCHAR(42) NOT NULL,
  amount NUMERIC,
  timestamp TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Delegate performance metrics
CREATE TABLE delegate_metrics (
  id SERIAL PRIMARY KEY,
  delegate VARCHAR(42) NOT NULL,
  participation_rate NUMERIC,
  proposal_engagement INTEGER,
  alignment_score NUMERIC,
  community_contribution_score NUMERIC,
  overall_rating NUMERIC,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 📡 API Endpoints

### Governance API

```
GET /api/proposals - Get all proposals
GET /api/proposals/:id - Get proposal by ID
GET /api/votes - Get all votes
GET /api/votes/:proposalId - Get votes for a proposal
POST /api/proposals - Create new proposal (authenticated)
```

### Delegation API

```
GET /api/delegates - Get all delegates
GET /api/delegates/:address - Get delegate profile
GET /api/delegations/:address - Get delegations for address
POST /api/delegates - Register as delegate (authenticated)
```

### Treasury API

```
GET /api/treasury/balance - Get treasury balance
GET /api/treasury/transactions - Get treasury transactions
GET /api/treasury/categories - Get spending by category
```

## 🔄 Integration Points

### Snapshot.org Integration

```javascript
// Example Snapshot API query
const getProposals = async () => {
  const query = `
    query {
      proposals (
        first: 20,
        skip: 0,
        where: {
          space: "baddao.eth"
        },
        orderBy: "created",
        orderDirection: desc
      ) {
        id
        title
        body
        choices
        start
        end
        snapshot
        state
        author
        space {
          id
          name
        }
      }
    }
  `;
  
  const response = await fetch('https://hub.snapshot.org/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  
  const data = await response.json();
  return data.data.proposals;
};
```

### Thirdweb Integration

```javascript
// Example code for connecting to the BAD token contract via Thirdweb
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const connectToContract = async () => {
  // Initialize the SDK on Base
  const sdk = new ThirdwebSDK("base");
  
  // Get BAD token contract
  const badTokenContract = await sdk.getContract("0x...", "token");
  
  // Get token data
  const totalSupply = await badTokenContract.erc20.totalSupply();
  const balance = await badTokenContract.erc20.balanceOf("0x...");
  
  return { totalSupply, balance };
};
```

## 🚨 Known Issues and Solutions

1. **Issue**: Snapshot space creation requires ENS domain
   **Solution**: Register ENS domain on Ethereum mainnet and link to Snapshot space

2. **Issue**: Base network not fully supported by all tools
   **Solution**: Use bridge interfaces where needed, consider alternative L2s if issues persist

3. **Issue**: Token balance verification across chains
   **Solution**: Implement subgraph to track token balances and transfers

## 📝 Development Log

### May 15, 2023
- Created GitHub issues for all BAD DAO proposals
- Set up project structure for implementation tracking
- Researched Snapshot.org integration requirements
- Drafted technical specifications for Gnosis Safe setup

### Next Steps
- Complete Snapshot.org space setup
- Implement token contract deployment on Base
- Develop initial version of governance dashboard
- Set up multisig wallets for treasury management

---

*Last updated: May 15, 2023* 