# ❓ Frequently Asked Questions

## 📋 Table of Contents
- [🔍 General Questions](#general-questions)
- [👤 Account & Authentication](#account--authentication)
- [🗳️ Governance & Voting](#governance--voting)
- [💰 Treasury Management](#treasury-management)
- [🪙 Tokens & Delegation](#tokens--delegation)
- [🔒 Security](#security)
- [💻 Technical Support](#technical-support)
- [📱 Mobile & Devices](#mobile--devices)
- [🔄 Updates & Roadmap](#updates--roadmap)

## 🔍 General Questions

### What is BAD DAO?

BAD DAO is a decentralized autonomous organization platform that enables community governance through blockchain technology. It provides tools for proposal creation, voting, treasury management, and community collaboration.

### How does BAD DAO work?

BAD DAO uses blockchain technology to enable transparent, secure community governance. Users can connect their wallet, participate in proposal voting, delegate voting power, and manage community treasury funds. All actions are recorded on the blockchain, ensuring transparency and immutability.

### Who can use BAD DAO?

Anyone with a compatible blockchain wallet can participate in BAD DAO. The platform is designed to be accessible to both crypto-native users and newcomers to the blockchain space.

### Is BAD DAO open source?

Yes, BAD DAO is an open-source platform. The source code is available on GitHub, allowing for community contributions, audits, and transparency.

### Where can I get help if I have a problem?

You can get support through various channels:
- Community Discord server
- Support documentation
- GitHub issues for technical problems
- Community forum
- Direct support email for urgent issues

## 👤 Account & Authentication

### How do I create an account?

BAD DAO doesn't require traditional account creation. Instead, you connect your blockchain wallet (such as MetaMask, WalletConnect, or Coinbase Wallet) to authenticate and interact with the platform.

### Which wallets are supported?

BAD DAO currently supports the following wallets:
- MetaMask
- WalletConnect
- Coinbase Wallet
- Trust Wallet
- Ledger (via MetaMask or WalletConnect)
- Trezor (via MetaMask or WalletConnect)

### How do I connect my wallet?

1. Click the "Connect Wallet" button in the top-right corner of the interface
2. Select your preferred wallet from the options provided
3. Approve the connection request in your wallet
4. Once connected, your wallet address will appear in the header

### Can I use multiple wallets?

Yes, you can connect multiple wallets to BAD DAO, but only one can be active at a time. To switch wallets:
1. Click your currently connected wallet address in the header
2. Select "Switch Wallet"
3. Choose a different wallet to connect

### What networks are supported?

BAD DAO currently supports the following networks:
- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism
- Binance Smart Chain

### What if I'm on the wrong network?

If you're connected to an unsupported network, BAD DAO will display a network warning. You can either:
1. Click the "Switch Network" button to automatically change to the correct network
2. Manually change the network in your wallet and refresh the page

### How do I disconnect my wallet?

To disconnect your wallet:
1. Click your wallet address in the header
2. Select "Disconnect Wallet" from the dropdown menu
3. Your wallet will be disconnected, and you'll return to the logged-out state

## 🗳️ Governance & Voting

### How does voting work in BAD DAO?

Voting in BAD DAO works through on-chain governance. Each proposal undergoes a specific lifecycle:
1. **Creation**: A proposal is created with a specific action
2. **Active**: The proposal enters the voting period
3. **Counting**: Votes are tallied after the voting period ends
4. **Queued**: Successful proposals are queued for execution
5. **Executed**: The proposal actions are executed on-chain

### How is voting power calculated?

Voting power is determined by the number of governance tokens you hold or have been delegated to you. Each token typically represents one vote, though some DAOs may implement different voting schemes like quadratic voting.

### How do I create a proposal?

To create a proposal:
1. Navigate to the "Governance" section
2. Click the "Create Proposal" button
3. Fill in the proposal details (title, description, actions)
4. Set the voting period
5. Review and submit your proposal
6. Sign the transaction with your wallet

Note: Most DAOs require you to hold a minimum number of tokens to create a proposal.

### What types of proposals can I create?

BAD DAO supports various proposal types:
- **Text Proposals**: Simple signaling votes without on-chain actions
- **Treasury Proposals**: Actions that involve treasury fund management
- **Parameter Change**: Modify DAO parameters
- **Smart Contract Upgrade**: Upgrade the underlying contracts
- **Custom Transactions**: Execute arbitrary smart contract calls

### How do I vote on a proposal?

To vote on an active proposal:
1. Navigate to the "Governance" section
2. Find and click on the proposal you want to vote on
3. Choose your voting option (For, Against, or Abstain)
4. Confirm your vote
5. Sign the transaction with your wallet

### Can I change my vote?

Yes, you can change your vote on an active proposal before the voting period ends. To change your vote:
1. Navigate to the proposal you previously voted on
2. Click "Change Vote"
3. Select your new voting option
4. Confirm and sign the transaction

### What is the quorum requirement?

Quorum is the minimum participation threshold required for a vote to be valid. The specific quorum requirement depends on your DAO's configuration, but it's typically a percentage of the total token supply (e.g., 4% of all tokens must participate).

### What happens after a proposal passes?

After a proposal passes:
1. It enters a "Queued" state for a timelock period
2. After the timelock period, it becomes eligible for execution
3. Any member can execute the proposal
4. Once executed, the proposed actions take effect on-chain

## 💰 Treasury Management

### How does the treasury work?

The BAD DAO treasury is a smart contract-controlled collection of assets (tokens, NFTs, etc.) owned by the DAO. The treasury can only be managed through governance proposals that pass a vote.

### What assets can the treasury hold?

The treasury can hold various assets:
- ETH and other native blockchain tokens
- ERC-20 tokens
- NFTs (ERC-721 and ERC-1155)
- LP tokens from DeFi protocols
- Other financial positions

### How can I view treasury assets?

To view treasury assets:
1. Navigate to the "Treasury" section
2. View the dashboard showing all assets
3. See detailed breakdowns by asset type
4. Access historical transaction information

### How are treasury funds allocated?

Treasury funds can only be allocated through governance proposals. The process typically involves:
1. Creating a proposal with specific treasury actions
2. Community voting on the proposal
3. If approved, the proposal is queued and then executed
4. The treasury transaction is executed on-chain

### Can I propose a treasury transaction?

Yes, if you meet the minimum token requirement for creating proposals, you can propose treasury transactions:
1. Navigate to "Governance" > "Create Proposal"
2. Select "Treasury Action" as the proposal type
3. Specify the transaction details (recipient, amount, token, etc.)
4. Submit the proposal for voting

## 🪙 Tokens & Delegation

### What is the BAD token?

The BAD token is the governance token of the BAD DAO. It grants voting rights and allows holders to participate in governance decisions.

### How do I get BAD tokens?

BAD tokens can be acquired through various methods:
- Purchase on decentralized exchanges
- Participate in DAO activities that earn rewards
- Receive token grants for contributions
- Liquidity provision in DeFi protocols

### What is token delegation?

Token delegation allows you to assign your voting power to another address without transferring your tokens. This enables you to participate in governance without having to vote directly.

### How do I delegate my tokens?

To delegate your tokens:
1. Navigate to the "Tokens" section
2. Click on "Delegate"
3. Enter the address you want to delegate to (or choose from popular delegates)
4. Confirm and sign the transaction

### Can I delegate to multiple addresses?

No, you can only delegate your entire voting power to a single address at any given time. However, you can change your delegation at any time.

### How do I change my delegation?

To change your delegation:
1. Navigate to the "Tokens" section
2. Click on "Change Delegation"
3. Enter the new delegate address
4. Confirm and sign the transaction

### If I delegate my tokens, can I still transfer them?

Yes, delegation only assigns your voting power but doesn't lock your tokens. You can still transfer or sell your tokens at any time. However, when you transfer tokens, the voting power associated with those tokens will move with them.

## 🔒 Security

### How secure is BAD DAO?

BAD DAO prioritizes security through several measures:
- Smart contract audits by reputable firms
- Bug bounty programs
- Open-source code for transparency
- Multi-signature requirements for critical functions
- Timelock delays on governance actions
- Regular security updates

### Have the smart contracts been audited?

Yes, all BAD DAO smart contracts have undergone thorough security audits by leading blockchain security firms. Audit reports are available on the GitHub repository and the documentation site.

### Is my wallet safe when connecting to BAD DAO?

Connecting your wallet to BAD DAO is safe as long as you:
- Verify you're on the correct website (always check the URL)
- Only approve the specific permissions requested
- Review all transaction details before signing
- Use hardware wallets for additional security when possible

### What permissions does BAD DAO request from my wallet?

BAD DAO typically requests:
- Permission to view your account address
- Permission to request transaction signatures
- Specific token approvals when interacting with governance or treasury functions

The platform never requests unlimited token approvals or private key access.

### How can I report a security vulnerability?

If you discover a security vulnerability, please report it through:
- The responsible disclosure program at security@baddao.io
- The security issue template on GitHub
- The private security channel in Discord

Please do not disclose security vulnerabilities publicly until the team has had a chance to address them.

## 💻 Technical Support

### The site isn't loading correctly. What should I do?

If you encounter loading issues:
1. Refresh your browser
2. Clear your browser cache
3. Try a different browser
4. Check if there are service announcements on Discord or Twitter
5. Ensure your internet connection is stable

### My transaction is pending for a long time. What should I do?

Long-pending transactions can occur due to:
- Network congestion
- Low gas price
- Wallet issues

To resolve:
1. Check the transaction status on a block explorer
2. For stuck transactions, you can try to speed it up or cancel it from your wallet
3. If using MetaMask, use the "Speed Up" or "Cancel" options
4. For other wallets, consult their documentation for handling pending transactions

### I can't vote on a proposal. Why?

If you can't vote on a proposal, check:
1. If you held tokens before the proposal's snapshot
2. If the voting period is still active
3. If you have sufficient gas in your wallet
4. If you have already voted (check your transaction history)
5. If your wallet is connected to the correct network

### How do I report a bug?

To report a bug:
1. Check if the issue is already reported in the GitHub repository
2. If not, create a new issue with:
   - A clear description of the problem
   - Steps to reproduce
   - Screenshots if applicable
   - Browser and wallet information
3. For urgent issues, also report it in the Discord support channel

## 📱 Mobile & Devices

### Does BAD DAO work on mobile devices?

Yes, BAD DAO is fully responsive and works on mobile devices. You can access it through:
- Your mobile browser (Chrome, Safari, etc.)
- Mobile wallet browsers (MetaMask, Trust Wallet, etc.)

### How do I connect my wallet on mobile?

To connect your wallet on mobile:
1. If using a mobile browser, you'll need to use WalletConnect
2. If using a wallet app with a built-in browser (like MetaMask), simply navigate to the BAD DAO website within the wallet browser
3. Follow the same connection steps as on desktop

### Which mobile browsers are supported?

BAD DAO supports all major mobile browsers, including:
- Chrome
- Safari
- Firefox
- Brave
- Opera
- Samsung Internet
- Edge

### Are there any mobile apps for BAD DAO?

Currently, BAD DAO does not have a dedicated mobile app. The platform is optimized as a web application that works across all devices. You can add the website to your home screen for an app-like experience.

## 🔄 Updates & Roadmap

### How often is BAD DAO updated?

BAD DAO follows a regular update schedule:
- Bug fixes and minor improvements: Bi-weekly
- Feature updates: Monthly
- Major releases: Quarterly
- Security patches: As needed (immediate deployment)

### Where can I find the latest updates?

You can find information about the latest updates through:
- The "Announcements" section in the app
- The official Discord server
- The GitHub repository releases page
- The official Twitter account
- The monthly newsletter

### How do I suggest new features?

To suggest new features:
1. Create a feature request on GitHub
2. Share your idea in the "suggestions" channel on Discord
3. Create a forum post detailing your suggestion
4. Submit it as a governance proposal for community voting

### What's coming in the next update?

The upcoming features are outlined in the public roadmap (available on the website and GitHub). The current focus areas include:
- Enhanced treasury management tools
- Multi-chain governance expansion
- Improved analytics dashboard
- Mobile experience optimizations
- Integration with additional wallet providers

### How are update priorities determined?

Update priorities are determined through:
- Community feedback and voting
- Core team assessment of strategic value
- Security and infrastructure needs
- Integration opportunities with the broader ecosystem
- Technical dependencies and development efficiency

---

Made with Power, Love, and AI •  ⚡️❤️🤖 •  POWERBRIDGE.AI 