# 🔨 Aragon BAD DAO: Step-by-Step Setup Guide

## 📋 Table of Contents
- [🚀 Getting Started](#getting-started)
- [🪙 Token Creation](#token-creation)
- [📦 DAO Creation](#dao-creation)
- [🏦 Treasury Setup](#treasury-setup)
- [🗳️ Governance Configuration](#governance-configuration)
- [🔌 Integration Setup](#integration-setup)
- [🧪 Testing Procedures](#testing-procedures)
- [📜 Contract Verification](#contract-verification)

## 🚀 Getting Started

### Prerequisites
- MetaMask wallet with ETH for gas fees
- Basic understanding of Ethereum transactions
- Access to the Aragon client and dashboard

### Initial Setup

1. **Install MetaMask**
   - Download and install MetaMask browser extension
   - Create a new wallet or import existing wallet
   - Secure your seed phrase in a safe location

2. **Connect to Appropriate Network**
   - For testing: Select Sepolia Testnet
   - For production: Select Ethereum Mainnet
   - Ensure you have sufficient ETH for gas fees

3. **Access Aragon App**
   - Navigate to [Aragon App](https://app.aragon.org/)
   - Connect your wallet when prompted
   - Select "Create an organization"

## 🪙 Token Creation

### Step 1: Deploy the BAD Token

1. **Access Token Creation**
   - Go to the Aragon dashboard
   - Select "Create a new token"
   - Choose "ERC-20 Governance Token"

2. **Configure Token Parameters**
   ```
   Name: BAD Token
   Symbol: BAD
   Decimals: 18
   Initial Supply: 1000000
   ```

3. **Set Token Distribution**
   - Core Team: 400,000 BAD (40%)
   - Community: 300,000 BAD (30%)
   - Treasury: 200,000 BAD (20%)
   - Advisors & Partners: 100,000 BAD (10%)

4. **Configure Vesting Schedules**
   - For Core Team:
     ```
     Cliff: 6 months
     Vesting Period: 24 months
     Vesting Frequency: Monthly
     ```
   - For Advisors:
     ```
     Cliff: 3 months
     Vesting Period: 12 months
     Vesting Frequency: Monthly
     ```

5. **Finalize Token Creation**
   - Review all parameters
   - Confirm transaction in MetaMask
   - Save the token contract address for future reference

## 📦 DAO Creation

### Step 1: Initialize DAO Structure

1. **Start DAO Creation**
   - From Aragon dashboard, select "Create an organization"
   - Choose "Company" template for most flexibility

2. **Set Organization Details**
   ```
   Organization Name: Build a DAO
   Organization Description: A bootstrap-ready DAO for revenue generation and project incubation
   ```

3. **Configure Initial Members**
   - Add founding team wallet addresses
   - Assign roles (Admin, Finance, etc.)

4. **Select Support Apps**
   - Tokens (select the BAD token created earlier)
   - Voting
   - Finance
   - Agent (for interacting with external contracts)
   - Permissions

5. **Review and Deploy**
   - Verify all settings
   - Confirm transaction in MetaMask
   - Wait for deployment to complete

### Step 2: Configure DAO Permissions

1. **Access Permissions Panel**
   - Navigate to the "Permissions" tab in your organization
   - Review the default permission structure

2. **Set up Role-Based Access**
   - Create the following roles:
     - Admin: Full control over DAO settings
     - Treasury: Access to financial operations
     - Proposal Manager: Can create and manage proposals
     - Community: Basic voting rights

3. **Define Permission Parameters**
   ```
   CREATE_PROPOSALS_ROLE: Minimum 1,000 BAD tokens required
   EXECUTE_PAYMENT_ROLE: Requires multi-sig approval
   CHANGE_SETTINGS_ROLE: Restricted to Admin
   ```

4. **Create Permission Groups**
   - Define permission groups for different wallet categories
   - Assign appropriate roles to each group

## 🏦 Treasury Setup

### Step 1: Create the Wallet Structure

1. **Access Finance App**
   - Navigate to the "Finance" tab in your organization
   - Select "New Transfer"

2. **Create Operating Wallet**
   - Deploy a new multi-signature wallet:
     ```
     Wallet Name: BAD-Operating
     Required Signatures: 3
     Total Signers: 5
     Daily Limit: 5% of total treasury
     ```
   - Add 5 trusted team members as signers

3. **Create Growth Wallet**
   - Deploy a new multi-signature wallet:
     ```
     Wallet Name: BAD-Growth
     Required Signatures: 3
     Total Signers: 5
     Daily Limit: 10% of total treasury
     ```
   - Configure 7-day timelock for transactions >$5,000

4. **Create Reserve Wallet**
   - Deploy a new multi-signature wallet:
     ```
     Wallet Name: BAD-Reserve
     Required Signatures: 4
     Total Signers: 5
     Daily Limit: None (all transactions require approval)
     ```
   - Configure 30-day timelock for all transactions

### Step 2: Configure Fund Allocation

1. **Initial Fund Transfer**
   - Transfer 40% of funds to Operating Wallet
   - Transfer 40% of funds to Growth Wallet
   - Transfer 20% of funds to Reserve Wallet

2. **Set Up Allocation Smart Contract**
   - Deploy the revenue allocation contract:
     ```solidity
     // Basic structure - full implementation will need development
     contract RevenueAllocator {
         address public operatingWallet;
         address public growthWallet;
         address public reserveWallet;
         
         mapping(string => AllocationStructure) public allocationStructures;
         
         struct AllocationStructure {
             uint8 operatingPercentage;
             uint8 growthPercentage;
             uint8 reservePercentage;
         }
         
         constructor(
             address _operatingWallet,
             address _growthWallet,
             address _reserveWallet
         ) {
             operatingWallet = _operatingWallet;
             growthWallet = _growthWallet;
             reserveWallet = _reserveWallet;
             
             // Configure allocation structures
             allocationStructures["grantFees"] = AllocationStructure(60, 30, 10);
             allocationStructures["hackathonFees"] = AllocationStructure(50, 40, 10);
             allocationStructures["serviceRevenue"] = AllocationStructure(70, 20, 10);
         }
         
         function allocateRevenue(string memory revenueType, uint256 amount) external {
             AllocationStructure memory allocation = allocationStructures[revenueType];
             
             uint256 operatingAmount = (amount * allocation.operatingPercentage) / 100;
             uint256 growthAmount = (amount * allocation.growthPercentage) / 100;
             uint256 reserveAmount = (amount * allocation.reservePercentage) / 100;
             
             // Transfer funds to respective wallets
             // Implementation details omitted
         }
     }
     ```

3. **Connect Allocation Contract to DAO**
   - Add the contract address to the Agent app
   - Configure permissions for contract interaction

## 🗳️ Governance Configuration

### Step 1: Set Up Voting Parameters

1. **Access Voting App**
   - Navigate to the "Voting" tab in your organization
   - Select "Voting Settings"

2. **Create Treasury Allocation Voting**
   ```
   Name: Treasury Allocation Votes
   Support Required: 75%
   Minimum Approval: 25%
   Vote Duration: 72 hours
   Early Execution: Yes
   ```

3. **Create Grant Approval Voting**
   ```
   Name: Grant Approval Votes
   Support Required: 60%
   Minimum Approval: 15%
   Vote Duration: 48 hours
   Early Execution: Yes
   ```

4. **Create Operational Decision Voting**
   ```
   Name: Operational Votes
   Support Required: 51%
   Minimum Approval: 10%
   Vote Duration: 48 hours
   Early Execution: Yes
   ```

5. **Create Emergency Action Voting**
   ```
   Name: Emergency Votes
   Support Required: 80%
   Minimum Approval: 30%
   Vote Duration: 24 hours
   Early Execution: Yes
   ```

### Step 2: Create Proposal Templates

1. **Access the Template Editor**
   - Go to the "Settings" tab
   - Select "Proposal Templates"

2. **Create Treasury Allocation Template**
   ```
   Title: Treasury Allocation Request
   Fields:
   - Amount (number)
   - Destination (text)
   - Purpose (text area)
   - Expected ROI (text area)
   - Budget Breakdown (file upload)
   - Timeline for Use (date range)
   ```

3. **Create Grant Approval Template**
   ```
   Title: Grant Approval Request
   Fields:
   - Grant Amount (number)
   - Project Name (text)
   - Team Information (text area)
   - Success Metrics (text area)
   - Project Proposal (file upload)
   ```

4. **Create Operational Decision Template**
   ```
   Title: Operational Decision
   Fields:
   - Decision Title (text)
   - Description (text area)
   - Implementation Plan (text area)
   - Resource Requirements (text area)
   - Impact Assessment (text area)
   ```

5. **Create Emergency Action Template**
   ```
   Title: Emergency Action
   Fields:
   - Issue Description (text area)
   - Urgency Level (dropdown: High, Critical)
   - Proposed Solution (text area)
   - Risk Assessment (text area)
   - Alternative Options (text area)
   ```

## 🔌 Integration Setup

### Step 1: AI Grant Studio Integration

1. **Deploy Integration Webhooks**
   - Create webhook endpoints for the Grant Studio system
   - Configure authentication keys for secure communication
   - Set up event listeners for grant status updates

2. **Implement Grant Proposal Automation**
   ```javascript
   // Example webhook handler for grant opportunities
   app.post('/webhooks/grant-opportunity', async (req, res) => {
     try {
       const { 
         grantTitle, 
         amount, 
         description, 
         deadline,
         requiredDocuments
       } = req.body;
       
       // Validate the opportunity
       const validationResult = await validateGrantOpportunity(req.body);
       
       if (validationResult.valid) {
         // Create a proposal in the DAO
         const proposalId = await createDAOProposal({
           type: 'grant',
           title: `Grant Opportunity: ${grantTitle}`,
           description,
           amount,
           deadline,
           documents: requiredDocuments
         });
         
         res.json({ success: true, proposalId });
       } else {
         res.json({ success: false, reason: validationResult.reason });
       }
     } catch (error) {
       res.status(500).json({ success: false, error: error.message });
     }
   });
   ```

3. **Configure Success Fee Collection**
   - Deploy the fee collection contract
   - Connect to the revenue allocation system
   - Set up monitoring for successful grants

### Step 2: Hackathon Discovery Integration

1. **Set Up Hackathon Opportunity Pipeline**
   - Create API endpoints for the Hackathon Discovery system
   - Configure filters for hackathon qualification
   - Implement notification system for DAO members

2. **Configure Team Formation System**
   ```javascript
   // Example of team formation API endpoint
   app.post('/api/teams/create', async (req, res) => {
     try {
       const { 
         hackathonId, 
         teamName, 
         members,
         requiredSkills
       } = req.body;
       
       // Validate the hackathon exists
       const hackathon = await getHackathonById(hackathonId);
       if (!hackathon) {
         return res.status(404).json({ success: false, error: 'Hackathon not found' });
       }
       
       // Create the team
       const team = await createTeam({
         hackathonId,
         name: teamName,
         members,
         requiredSkills
       });
       
       // Set up team vault
       const vaultAddress = await createTeamVault(team.id, members);
       
       res.json({ 
         success: true, 
         teamId: team.id,
         vaultAddress
       });
     } catch (error) {
       res.status(500).json({ success: false, error: error.message });
     }
   });
   ```

3. **Deploy Prize Fund Management**
   - Create dedicated vaults for hackathon prize funds
   - Set up multi-sig requirements for fund release
   - Configure monitoring for prize distribution

## 🧪 Testing Procedures

### Step 1: Governance System Testing

1. **Create Test Proposals**
   - Submit test proposals for each proposal type
   - Verify correct voting parameters are applied
   - Test early execution functionality

2. **Verify Voting Mechanics**
   - Test with different token holder distributions
   - Verify minimum participation requirements
   - Test vote delegation functionality

3. **Test Permission Restrictions**
   - Attempt to create proposals with insufficient tokens
   - Verify permission boundaries for each role
   - Test multi-signature approval processes

### Step 2: Revenue Flow Testing

1. **Test Grant Fee Collection**
   - Simulate successful grant funding
   - Verify fee collection accuracy
   - Check proper allocation to treasury wallets

2. **Test Hackathon Revenue Flow**
   - Simulate hackathon participation and winnings
   - Verify platform fee collection
   - Check proper allocation to treasury wallets

3. **Test Service Revenue Distribution**
   - Simulate service revenue payments
   - Verify proper split between wallets
   - Test transaction execution and approval flow

## 📜 Contract Verification

### Step 1: Verify All Deployed Contracts

1. **Token Contract Verification**
   - Go to Etherscan
   - Navigate to the BAD token contract address
   - Select "Verify & Publish" contract
   - Upload source code and verification details

2. **DAO Contract Verification**
   - Verify all Aragon DAO contracts on Etherscan
   - Document contract addresses in secure location
   - Verify proper ownership and permissions

3. **Integration Contract Verification**
   - Verify all custom integration contracts
   - Document API endpoints and access control
   - Test integration contract functionalities 