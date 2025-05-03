# 🏗️ Smart Contract Architecture & Relationships

## 📋 Table of Contents
- [🔍 Overview](#overview)
- [🎯 Purpose](#purpose)
- [🏗️ Contract Architecture](#contract-architecture)
- [🧩 Core Contract Components](#core-contract-components)
- [🔄 Contract Interactions](#contract-interactions)
- [⚙️ Upgrade Mechanisms](#upgrade-mechanisms)
- [🔐 Access Control System](#access-control-system)
- [💾 Data Storage Patterns](#data-storage-patterns)
- [🔄 Event System](#event-system)
- [📊 Implementation Status](#implementation-status)

## 🔍 Overview

This document provides a comprehensive description of the BAD DAO smart contract architecture, detailing the relationships between contracts, upgrade patterns, access control mechanisms, and data flow within the system.

## 🎯 Purpose

The contract architecture documentation aims to:
- Define the overall structure of the smart contract system
- Explain the purpose and interactions of each contract
- Document the upgrade mechanisms and governance controls
- Establish security boundaries and access control patterns
- Provide a reference for developers and auditors

## 🏗️ Contract Architecture

### System Architecture Diagram

```mermaid
graph TD
    A[BAD DAO Contract System] --> B[Governance Module]
    A --> C[Token Module]
    A --> D[Treasury Module]
    A --> E[Voting Module]
    
    B --> B1[Governor]
    B --> B2[Timelock]
    B --> B3[ProposalManager]
    
    C --> C1[BadToken]
    C --> C2[TokenVesting]
    C --> C3[VotingPowerTracker]
    
    D --> D1[Treasury]
    D --> D2[AssetManager]
    D --> D3[ExecutionManager]
    
    E --> E1[Voting]
    E --> E2[Delegation]
    E --> E3[VotingStrategyManager]
    
    style A fill:#f96,stroke:#333,stroke-width:2px
    style B,C,D,E fill:#9cf,stroke:#333,stroke-width:2px
    style B1,B2,B3,C1,C2,C3,D1,D2,D3,E1,E2,E3 fill:#9f9,stroke:#333,stroke-width:2px
```

### Architecture Design Principles

1. **Modularity**: Contracts are designed as specialized components with clear responsibilities
2. **Upgradability**: Strategic use of proxy patterns for upgradable components
3. **Access Control**: Fine-grained permission system for contract functions
4. **Security First**: Defense in depth with multiple security layers
5. **Gas Efficiency**: Optimized data structures and operations
6. **Governance-Driven**: Changes controlled through DAO governance

### Contract Dependency Graph

```mermaid
graph LR
    A[Governor] --> B[Timelock]
    C[BadToken] --> D[VotingPowerTracker]
    A --> D
    E[Voting] --> D
    F[Treasury] --> B
    G[ProposalManager] --> A
    A --> E
    B --> F
    H[AssetManager] --> F
    I[TokenVesting] --> C
    J[Delegation] --> D
    G --> B
    E --> J
    K[VotingStrategyManager] --> E
    L[ExecutionManager] --> F
    
    style A,B fill:#f96,stroke:#333,stroke-width:2px
    style C,D,E fill:#9cf,stroke:#333,stroke-width:2px
    style F,G,H fill:#ff9,stroke:#333,stroke-width:2px
    style I,J,K,L fill:#9f9,stroke:#333,stroke-width:2px
```

## 🧩 Core Contract Components

### Governance Module

| Contract | Purpose | Upgradable | Dependencies |
|----------|---------|------------|--------------|
| Governor | Primary governance contract that processes proposals | Yes | Timelock, VotingPowerTracker, Voting |
| Timelock | Time-delayed execution of governance decisions | No | None |
| ProposalManager | Handles proposal creation, cancellation, and metadata | Yes | Governor, Timelock |

#### Governor Contract

The Governor contract serves as the main governance mechanism, handling proposal lifecycle and voting:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorSettingsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorTimelockControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract BADGovernor is 
    Initializable, 
    GovernorUpgradeable, 
    GovernorSettingsUpgradeable,
    GovernorTimelockControlUpgradeable,
    UUPSUpgradeable 
{
    // Contract implementation
    
    function initialize(
        IVotingPowerTracker _token,
        TimelockControllerUpgradeable _timelock
    ) public initializer {
        __Governor_init("BADGovernor");
        __GovernorSettings_init(
            1 days,    // Voting delay
            7 days,    // Voting period
            100e18     // Proposal threshold
        );
        __GovernorTimelockControl_init(_timelock);
        __UUPSUpgradeable_init();
    }
    
    function _authorizeUpgrade(address newImplementation) internal override onlyGovernance {}
    
    // Additional governance functionality
}
```

### Token Module

| Contract | Purpose | Upgradable | Dependencies |
|----------|---------|------------|--------------|
| BadToken | ERC20 governance token | No | None |
| TokenVesting | Manages token vesting schedules | Yes | BadToken |
| VotingPowerTracker | Tracks voting power including delegations | Yes | BadToken |

#### BadToken Contract

The BadToken implements the ERC20 standard with voting and delegation capabilities:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract BadToken is ERC20Votes, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address initialHolder
    ) ERC20(name, symbol) ERC20Permit(name) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        
        _mint(initialHolder, initialSupply);
    }
    
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
    
    // Additional token functionality
}
```

### Treasury Module

| Contract | Purpose | Upgradable | Dependencies |
|----------|---------|------------|--------------|
| Treasury | Stores and manages DAO assets | Yes | Timelock |
| AssetManager | Handles asset allocation and investment strategies | Yes | Treasury |
| ExecutionManager | Executes financial transactions after approval | Yes | Treasury, Timelock |

#### Treasury Contract

The Treasury contract manages all DAO assets and provides secure transaction execution:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

contract Treasury is 
    Initializable, 
    AccessControlUpgradeable, 
    UUPSUpgradeable 
{
    using SafeERC20Upgradeable for IERC20Upgradeable;
    
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    
    function initialize(address _governance, address _executor) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        
        _setupRole(GOVERNANCE_ROLE, _governance);
        _setupRole(EXECUTOR_ROLE, _executor);
        _setupRole(DEFAULT_ADMIN_ROLE, _governance);
    }
    
    function executeTransaction(
        address to,
        uint256 value,
        bytes memory data
    ) external onlyRole(EXECUTOR_ROLE) returns (bool success, bytes memory result) {
        // Transaction execution logic
        (success, result) = to.call{value: value}(data);
        require(success, "Transaction execution failed");
    }
    
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(GOVERNANCE_ROLE) {}
    
    // Additional treasury functionality
}
```

### Voting Module

| Contract | Purpose | Upgradable | Dependencies |
|----------|---------|------------|--------------|
| Voting | Manages the voting process | Yes | VotingPowerTracker |
| Delegation | Handles vote delegation | Yes | VotingPowerTracker |
| VotingStrategyManager | Pluggable voting strategies | Yes | Voting |

#### Voting Contract

The Voting contract implements the core voting functionality:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract Voting is 
    Initializable, 
    AccessControlUpgradeable, 
    UUPSUpgradeable 
{
    bytes32 public constant GOVERNOR_ROLE = keccak256("GOVERNOR_ROLE");
    
    IVotingPowerTracker public votingPowerTracker;
    
    struct Vote {
        uint8 support; // 0 = against, 1 = for, 2 = abstain
        uint256 votingPower;
        address voter;
        uint256 timestamp;
    }
    
    mapping(uint256 => mapping(address => Vote)) private _proposalVotes;
    
    function initialize(address _governor, address _votingPowerTracker) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        
        _setupRole(GOVERNOR_ROLE, _governor);
        _setupRole(DEFAULT_ADMIN_ROLE, _governor);
        
        votingPowerTracker = IVotingPowerTracker(_votingPowerTracker);
    }
    
    function castVote(
        uint256 proposalId,
        address voter,
        uint8 support
    ) external onlyRole(GOVERNOR_ROLE) returns (uint256) {
        // Voting logic implementation
    }
    
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(GOVERNOR_ROLE) {}
    
    // Additional voting functionality
}
```

## 🔄 Contract Interactions

### Proposal Flow Sequence

```mermaid
sequenceDiagram
    participant User
    participant Governor
    participant VotingPowerTracker
    participant Voting
    participant Timelock
    participant Treasury
    
    User->>Governor: propose(targets, values, calldatas, description)
    Governor->>VotingPowerTracker: getPriorVotes(user, blockNumber)
    VotingPowerTracker-->>Governor: votingPower
    Governor->>Governor: Create Proposal
    
    Note over Governor: Voting Delay Period
    
    User->>Governor: castVote(proposalId, support)
    Governor->>Voting: castVote(proposalId, user, support)
    Voting->>VotingPowerTracker: getPriorVotes(user, snapshot)
    VotingPowerTracker-->>Voting: votingPower
    Voting-->>Governor: votingPower
    
    Note over Governor: Voting Period
    
    User->>Governor: queue(proposalId)
    Governor->>Timelock: schedule(targets, values, calldatas, predecessor, salt, delay)
    
    Note over Timelock: Timelock Delay Period
    
    User->>Governor: execute(proposalId)
    Governor->>Timelock: execute(targets, values, calldatas, predecessor, salt)
    Timelock->>Treasury: executeTransaction(target, value, data)
```

### Token Delegation Flow

```mermaid
sequenceDiagram
    participant User1
    participant User2
    participant BadToken
    participant VotingPowerTracker
    
    User1->>BadToken: delegate(User2)
    BadToken->>BadToken: _delegate(User1, User2)
    BadToken->>BadToken: _moveDelegates(oldDelegate, newDelegate, amount)
    BadToken->>VotingPowerTracker: updateVotingPower(User1, oldPower)
    BadToken->>VotingPowerTracker: updateVotingPower(User2, newPower)
    VotingPowerTracker->>VotingPowerTracker: Update checkpoints
```

### Treasury Operation Flow

```mermaid
sequenceDiagram
    participant Governor
    participant Timelock
    participant Treasury
    participant AssetManager
    participant ExternalContract
    
    Governor->>Timelock: Schedule treasury operation
    Note over Timelock: Timelock Delay
    Timelock->>Treasury: executeTransaction()
    Treasury->>AssetManager: performAssetOperation()
    AssetManager->>ExternalContract: Interact with external protocol
    ExternalContract-->>AssetManager: Return result
    AssetManager-->>Treasury: Operation result
    Treasury-->>Timelock: Execution completed
```

## ⚙️ Upgrade Mechanisms

### Upgrade Pattern Architecture

```mermaid
graph TD
    A[Upgrade Mechanisms] --> B[Transparent Proxy Pattern]
    A --> C[UUPS Proxy Pattern]
    A --> D[Diamond/Multi-Facet Proxy]
    
    B --> B1[AdminUpgradeabilityProxy]
    B --> B2[ProxyAdmin]
    
    C --> C1[ERC1967Proxy]
    C --> C2[UUPSUpgradeable]
    
    D --> D1[DiamondProxy]
    D --> D2[DiamondCut]
    D --> D3[DiamondLoupe]
    
    style A fill:#f96,stroke:#333,stroke-width:2px
    style B,C,D fill:#9cf,stroke:#333,stroke-width:2px
    style B1,B2,C1,C2,D1,D2,D3 fill:#9f9,stroke:#333,stroke-width:2px
```

### Upgrade Control Flow

The BAD DAO system uses the UUPS (Universal Upgradeable Proxy Standard) pattern for most upgradeable contracts:

```solidity
// Upgrade control example
function _authorizeUpgrade(address newImplementation) internal override {
    // Ensure only governance can upgrade
    require(msg.sender == address(timelock), "Only governance can upgrade");
    
    // Optional: Additional validation of the new implementation
    // IUpgradeValidation(newImplementation).validateUpgrade();
}
```

### Upgrade Security

1. **Timelock Protection**: All upgrades must pass through the timelock
2. **Governance Approval**: Upgrades require a successful governance vote
3. **Implementation Validation**: New implementations can be validated before upgrade
4. **Emergency Recovery**: Guardian role can pause but not upgrade contracts
5. **Transparent Announcements**: All upgrade proposals are publicly announced and discussed

## 🔐 Access Control System

### Role-Based Access Control

The contract system implements a role-based access control system using OpenZeppelin's AccessControl:

```solidity
// Role definitions
bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");
bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
```

### Permission Structure

```mermaid
graph TD
    A[Access Control Roles] --> B[Default Admin]
    A --> C[Governance]
    A --> D[Guardian]
    A --> E[Executor]
    A --> F[Upgrader]
    A --> G[Pauser]
    
    B --> B1[Manage all roles]
    
    C --> C1[Propose/execute governance actions]
    C --> C2[Modify governance parameters]
    C --> C3[Upgrade authorization]
    
    D --> D1[Emergency pause]
    D --> D2[Cancel malicious proposals]
    
    E --> E1[Execute treasury transactions]
    E --> E2[Execute approved operations]
    
    F --> F1[Authorized for upgrades]
    
    G --> G1[Pause contract functions]
    
    style A fill:#f96,stroke:#333,stroke-width:2px
    style B,C,D,E,F,G fill:#9cf,stroke:#333,stroke-width:2px
    style B1,C1,C2,C3,D1,D2,E1,E2,F1,G1 fill:#9f9,stroke:#333,stroke-width:2px
```

### Privilege Delegation

In the normal operating flow, privileges flow from governance to execution:

1. **Governance (DAO)** → Controls all system parameters and upgrades
2. **Timelock** → Schedules and executes governance-approved actions
3. **Executor** → Has permission to call specific functions after governance approval
4. **Module-Specific Roles** → Limited to specific domains of functionality

## 💾 Data Storage Patterns

### Storage Layout

The system uses careful storage management to facilitate upgrades:

```solidity
// Storage layout example for upgradeable contract
contract TreasuryStorage {
    // Storage slot 0
    address private _admin;
    
    // Storage slot 1
    mapping(address => bool) private _authorized;
    
    // Storage slot 2
    uint256 private _totalAssets;
    
    // Storage slot 3
    mapping(address => uint256) private _assetBalances;
    
    // Gap for future storage variables
    uint256[50] private __gap;
}
```

### Eternal Storage Pattern

For critical data that must persist across upgrades, the system uses the eternal storage pattern:

```solidity
contract EternalStorage {
    mapping(bytes32 => uint256) private uintStorage;
    mapping(bytes32 => string) private stringStorage;
    mapping(bytes32 => address) private addressStorage;
    mapping(bytes32 => bytes) private bytesStorage;
    mapping(bytes32 => bool) private boolStorage;
    mapping(bytes32 => int256) private intStorage;
    
    // Getters and setters for each type
    function getUint(bytes32 key) external view returns (uint256) {
        return uintStorage[key];
    }
    
    function setUint(bytes32 key, uint256 value) external onlyAuthorized {
        uintStorage[key] = value;
    }
    
    // Additional getters and setters
}
```

### Proxy Storage Patterns

For proxied contracts, the system carefully manages storage to avoid collisions:

1. **Unstructured Storage**: Uses ERC-1967 storage slots for proxy-specific data
2. **Namespaced Storage**: Uses hashed keys to prevent storage collisions
3. **Storage Gaps**: Reserves space for future variable additions

## 🔄 Event System

### Core Events

Each contract emits events to facilitate off-chain tracking and UI updates:

```solidity
// Governor events
event ProposalCreated(
    uint256 proposalId,
    address proposer,
    address[] targets,
    uint256[] values,
    string[] signatures,
    bytes[] calldatas,
    uint256 startBlock,
    uint256 endBlock,
    string description
);

event ProposalExecuted(uint256 proposalId);
event ProposalQueued(uint256 proposalId, uint256 eta);
event ProposalCanceled(uint256 proposalId);
event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight);

// Treasury events
event TransactionExecuted(address indexed target, uint256 value, bytes data, bytes result);
event FundsReceived(address indexed sender, uint256 amount);
event AssetTransferred(address indexed token, address indexed recipient, uint256 amount);

// Token events
event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);
event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance);
```

### Event-Based Indexing

The event system is designed to enable comprehensive off-chain indexing:

1. **Indexed Parameters**: Key parameters are indexed for efficient filtering
2. **Comprehensive Data**: Events contain all necessary data for off-chain reconstruction
3. **Chronological Tracking**: Events follow the lifecycle of system objects
4. **Relationship Tracking**: Events include IDs to track relationships between actions

## 📊 Implementation Status

| Contract | Development | Testing | Audit | Documentation |
|----------|-------------|---------|-------|---------------|
| Governor | 🟢 Complete | 🟢 Complete | 🟢 Complete | 🟢 Complete |
| Timelock | 🟢 Complete | 🟢 Complete | 🟢 Complete | 🟢 Complete |
| ProposalManager | 🟢 Complete | 🟡 In Progress | 🔴 Not Started | 🟢 Complete |
| BadToken | 🟢 Complete | 🟢 Complete | 🟢 Complete | 🟢 Complete |
| TokenVesting | 🟢 Complete | 🟢 Complete | 🟡 In Progress | 🟢 Complete |
| VotingPowerTracker | 🟢 Complete | 🟡 In Progress | 🔴 Not Started | 🟢 Complete |
| Treasury | 🟢 Complete | 🟡 In Progress | 🟡 In Progress | 🟢 Complete |
| AssetManager | 🟡 In Progress | 🔴 Not Started | 🔴 Not Started | 🟢 Complete |
| ExecutionManager | 🟡 In Progress | 🔴 Not Started | 🔴 Not Started | 🟡 In Progress |
| Voting | 🟢 Complete | 🟡 In Progress | 🔴 Not Started | 🟢 Complete |
| Delegation | 🟢 Complete | 🟡 In Progress | 🔴 Not Started | 🟢 Complete |
| VotingStrategyManager | 🟡 In Progress | 🔴 Not Started | 🔴 Not Started | 🟡 In Progress |

### 🔄 Next Implementation Steps

1. Complete the AssetManager implementation
2. Finalize ExecutionManager development
3. Complete VotingStrategyManager implementation
4. Finish testing of Voting and Delegation contracts
5. Schedule audits for remaining contracts

---

Made with Power, Love, and AI •  ⚡️❤️🤖 •  POWERBRIDGE.AI 