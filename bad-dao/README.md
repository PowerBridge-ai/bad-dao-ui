# BAD DAO

BAD DAO is a decentralized autonomous organization built on the Base network, featuring governance, token distribution, and treasury management capabilities.

## Features

- **BADToken**: ERC20 governance token with voting capabilities
- **Governance System**: On-chain proposal creation, voting, and execution
- **Treasury Management**: Secure multi-signature fund management
- **Token Vesting**: Scheduled token release for team and advisors
- **Multisig Wallet**: Secure transaction execution with multiple approvals

## Project Structure

- `contracts/`: Smart contract source files
  - `token/`: Token-related contracts
  - `governance/`: Governance contracts
  - `revenue/`: Treasury management contracts
  - `multisig/`: Multisig wallet contracts
- `scripts/`: Deployment and verification scripts
- `test/`: Contract test files
- `frontend/`: Web interface for DAO interaction

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bad-dao.git
cd bad-dao
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from template:

```bash
cp .env.example .env
```

4. Edit the `.env` file with your private key and API keys.

## Development

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Local Development Network

```bash
npx hardhat node
```

## Deployment

### Deploy to Base Goerli Testnet

```bash
npx hardhat run scripts/deploy.js --network base_goerli
```

### Verify Contracts on Base Goerli

```bash
npx hardhat run scripts/verify.js --network base_goerli
```

### Deploy to Base Mainnet

```bash
npx hardhat run scripts/deploy.js --network base
```

### Verify Contracts on Base Mainnet

```bash
npx hardhat run scripts/verify.js --network base
```

## Contract Addresses

After deployment, contract addresses are saved in `deployments.json`. This file is used for verification and frontend configuration.

## Token Distribution

The initial token distribution is as follows:

- **40%** - Core team (vested over 24 months with 6-month cliff)
- **30%** - Community (for governance participation)
- **20%** - Treasury (for operations and incentives)
- **10%** - Initial advisors and partners

## Governance Parameters

- **Voting Delay**: 1 day (7,200 blocks)
- **Voting Period**: 5 days (36,000 blocks)
- **Proposal Threshold**: 1% of total supply
- **Quorum**: 4% of total supply
- **Timelock Delay**: 2 days (172,800 seconds)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 