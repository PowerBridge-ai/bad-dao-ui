# 🚀 BAD DAO UI - Developer Setup Guide

## 🔍 Overview

This document provides comprehensive instructions for setting up the BAD DAO UI development environment. Following these steps will ensure you have all the necessary tools, dependencies, and configurations to start developing and contributing to the project.

## 📋 Prerequisites

Before beginning setup, ensure you have the following installed:

- **Node.js**: v18.17.0 or higher
- **npm**: v9.6.0 or higher (comes with Node.js)
- **Git**: v2.30.0 or higher
- **Visual Studio Code** (recommended): Latest version
- **MetaMask Extension**: Latest version

## 🔧 Environment Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/PowerBridge-ai/bad-dao-ui.git

# Navigate to the project directory
cd bad-dao-ui
```

### Step 2: Install Dependencies

```bash
# Install project dependencies
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Basic Configuration
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Thirdweb Configuration
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
NEXT_PUBLIC_THIRDWEB_SECRET_KEY=your_thirdweb_secret_key

# Network Configuration
NEXT_PUBLIC_NETWORK=mumbai
NEXT_PUBLIC_RPC_URL=https://mumbai.rpc.thirdweb.com

# AI Configuration
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key

# Database Configuration (if using local database)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=bad_dao_ui
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

> 🔐 **Security Note**: Never commit `.env.local` to the repository. It's already included in `.gitignore`.

### Step 4: Start Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🗄️ Database Setup

### Option 1: Docker (Recommended)

```bash
# Start PostgreSQL with Docker
docker run --name bad-dao-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=bad_dao_ui -p 5432:5432 -d postgres:14

# Verify the container is running
docker ps
```

### Option 2: Local PostgreSQL

If you prefer to use a local PostgreSQL installation:

1. Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
2. Create a database:

```bash
# Access PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE bad_dao_ui;

# Verify database creation
\l
```

### Run Migrations

```bash
# Run database migrations
npm run migrate
```

## 🔌 Thirdweb Setup

### Step 1: Create a Thirdweb Account

1. Visit [thirdweb.com](https://thirdweb.com/) and sign up for an account
2. Create a new API key from the dashboard
3. Add the client ID and secret key to your `.env.local` file

### Step 2: Configure Local Network

For local development, you can use the Mumbai testnet:

1. Configure MetaMask to use the Mumbai network:
   - Network Name: Mumbai Testnet
   - RPC URL: https://mumbai.rpc.thirdweb.com
   - Chain ID: 80001
   - Currency Symbol: MATIC
   - Block Explorer URL: https://mumbai.polygonscan.com

2. Get testnet MATIC from [faucet.polygon.technology](https://faucet.polygon.technology/)

## 🤖 AI Integration Setup

### OpenAI API Setup

1. Create an account at [openai.com](https://openai.com/)
2. Generate an API key from the dashboard
3. Add the API key to your `.env.local` file

### Voice Recognition Setup

No additional setup is required for voice recognition. The Web Speech API is used directly in the browser.

## 🧪 Testing Setup

### Configure Testing Environment

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Smart Contract Testing

For testing smart contracts:

```bash
# Install Hardhat globally
npm install -g hardhat

# Run contract tests
npm run test:contracts
```

## 🛠️ Recommended Extensions

### Visual Studio Code Extensions

- **ESLint**: Static code analysis
- **Prettier**: Code formatting
- **Tailwind CSS IntelliSense**: Tailwind class suggestions
- **Solidity**: Syntax highlighting for Solidity
- **Error Lens**: Enhanced error highlighting
- **GitHub Copilot**: AI-assisted coding (optional)

### Browser Extensions

- **React Developer Tools**: React debugging
- **Redux DevTools**: Redux state inspection
- **MetaMask**: Wallet connectivity and testing

## 📁 Project Structure

The project follows this structure:

```
bad-dao-ui/
├── .github/            # GitHub workflows and templates
├── components/         # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── governance/     # Governance-specific components
│   ├── treasury/       # Treasury-specific components
│   ├── vesting/        # Vesting-specific components
│   └── delegation/     # Delegation-specific components
├── context/            # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Next.js pages
├── public/             # Static assets
├── styles/             # Global styles
├── types/              # TypeScript types
└── utils/              # Helper utilities
```

## 🔄 Development Workflow

### Branch Naming Convention

- `feature/`: For new features (e.g., `feature/governance-dashboard`)
- `bugfix/`: For bug fixes (e.g., `bugfix/wallet-connection`)
- `chore/`: For maintenance tasks (e.g., `chore/update-dependencies`)
- `docs/`: For documentation changes (e.g., `docs/update-readme`)

### Commit Message Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

Where `<type>` is one of:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat(governance): add proposal creation form

Implement form for creating new governance proposals with validation.

Closes #123
```

### Pull Request Process

1. Create a feature branch from `main`
2. Implement your changes
3. Ensure tests pass
4. Submit a pull request to `main`
5. Address review comments
6. Squash and merge when approved

## 📊 Local Testing

### Running Tests

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Contract Testing

```bash
# Run contract tests
npm run test:contracts
```

## 💾 Data Management

### Seeding Test Data

```bash
# Seed the database with test data
npm run seed
```

### Database Reset

```bash
# Reset the database (caution: this will delete all data)
npm run db:reset
```

## 🔄 Common Issues and Solutions

### Issue: MetaMask Connection Failing

**Solution**: Ensure MetaMask is unlocked and connected to the correct network (Mumbai for development).

### Issue: Missing Environment Variables

**Solution**: Verify all required variables are set in your `.env.local` file.

### Issue: Dependency Conflicts

**Solution**: Run `npm clean-install` to ensure clean dependency installation.

### Issue: Database Connection Errors

**Solution**: Verify PostgreSQL is running and credentials are correct in `.env.local`.

## 🔍 Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check types
npm run type-check
```

## 🤝 Getting Help

If you encounter issues not covered in this guide:

1. Check the [project documentation](../README.md)
2. Search for issues in the [GitHub repository](https://github.com/PowerBridge-ai/bad-dao-ui/issues)
3. Ask in the #dev-support channel in our Discord
4. Create a new issue with relevant details

## 🚀 Next Steps

After setting up your development environment:

1. Review the [project architecture](../technical/architecture.md)
2. Understand the [component library](../design/component-library.md)
3. Learn about [smart contract specifications](../blockchain/contract-specs.md)
4. Check the [current tasks](../task-log.md) for contribution opportunities

## 🔄 Cross-References

- See [technical/architecture.md](../technical/architecture.md) for system architecture details
- See [development/code-standards.md](./code-standards.md) for coding standards
- See [development/git-workflow.md](./git-workflow.md) for detailed Git workflow guidelines
- See [blockchain/deployment-guide.md](../blockchain/deployment-guide.md) for contract deployment

---

**Last Updated:** 2025-05-02  
**Maintained By:** PowerBridge.AI Team

---

Made with Power, Love, and AI •  ⚡️❤️🤖 •  POWERBRIDGE.AI 