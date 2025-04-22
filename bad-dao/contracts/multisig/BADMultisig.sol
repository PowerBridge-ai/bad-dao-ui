// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title BADMultisig
 * @dev A multisignature wallet for BAD DAO with time locks and access controls
 */
contract BADMultisig is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Events
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event OwnerAdded(address indexed owner);
    event OwnerRemoved(address indexed owner);
    event TransactionSubmitted(uint256 indexed txIndex, address indexed submitter);
    event TransactionConfirmed(uint256 indexed txIndex, address indexed confirmer);
    event TransactionRevoked(uint256 indexed txIndex, address indexed revoker);
    event TransactionExecuted(uint256 indexed txIndex, address indexed executor);
    event RequirementChanged(uint256 indexed required);
    event Received(address indexed sender, uint256 amount);

    // Transaction struct
    struct Transaction {
        address to;           // Destination address
        uint256 value;        // ETH value
        bytes data;           // Call data
        bool executed;        // Execution status
        uint256 numConfirmations; // Number of confirmations
        uint256 submitTime;   // Timestamp of submission
    }

    // State variables
    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public required;
    uint256 public transactionCount;
    uint256 public timelock;  // Time delay before a transaction can be executed (in seconds)

    // Transactions storage
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;

    // Modifiers
    modifier onlyOwner() {
        require(isOwner[msg.sender], "BADMultisig: caller is not owner");
        _;
    }

    modifier ownerDoesNotExist(address owner) {
        require(!isOwner[owner], "BADMultisig: owner already exists");
        _;
    }

    modifier ownerExists(address owner) {
        require(isOwner[owner], "BADMultisig: owner does not exist");
        _;
    }

    modifier transactionExists(uint256 txIndex) {
        require(txIndex < transactionCount, "BADMultisig: transaction does not exist");
        _;
    }

    modifier notExecuted(uint256 txIndex) {
        require(!transactions[txIndex].executed, "BADMultisig: transaction already executed");
        _;
    }

    modifier notConfirmed(uint256 txIndex) {
        require(!confirmations[txIndex][msg.sender], "BADMultisig: transaction already confirmed");
        _;
    }

    modifier pastTimelock(uint256 txIndex) {
        require(
            block.timestamp >= transactions[txIndex].submitTime + timelock,
            "BADMultisig: timelock period not passed"
        );
        _;
    }

    /**
     * @dev Constructor sets the owners and required confirmations
     * @param _owners Array of initial owners
     * @param _required Number of required confirmations
     * @param _timelock Time delay in seconds before a confirmed transaction can be executed
     */
    constructor(
        address[] memory _owners,
        uint256 _required,
        uint256 _timelock
    ) {
        require(_owners.length > 0, "BADMultisig: owners required");
        require(
            _required > 0 && _required <= _owners.length,
            "BADMultisig: invalid number of required confirmations"
        );

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "BADMultisig: invalid owner");
            require(!isOwner[owner], "BADMultisig: duplicate owner");

            isOwner[owner] = true;
            owners.push(owner);
        }

        required = _required;
        timelock = _timelock;
    }

    /**
     * @dev Add a new owner
     * @param owner Address of new owner
     */
    function addOwner(address owner) 
        external 
        onlyOwner 
        ownerDoesNotExist(owner) 
    {
        require(owner != address(0), "BADMultisig: invalid owner");
        isOwner[owner] = true;
        owners.push(owner);
        emit OwnerAdded(owner);
    }

    /**
     * @dev Remove an existing owner
     * @param owner Address of owner to remove
     */
    function removeOwner(address owner) 
        external 
        onlyOwner 
        ownerExists(owner) 
    {
        require(owners.length > required, "BADMultisig: cannot remove owner, minimum required");
        isOwner[owner] = false;
        
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == owner) {
                owners[i] = owners[owners.length - 1];
                owners.pop();
                break;
            }
        }
        
        if (owners.length < required) {
            changeRequirement(owners.length);
        }
        
        emit OwnerRemoved(owner);
    }

    /**
     * @dev Change requirement of confirmations
     * @param _required New required confirmations
     */
    function changeRequirement(uint256 _required) 
        public 
        onlyOwner 
    {
        require(_required > 0 && _required <= owners.length, "BADMultisig: invalid requirement");
        required = _required;
        emit RequirementChanged(_required);
    }

    /**
     * @dev Change timelock period
     * @param _timelock New timelock in seconds
     */
    function changeTimelock(uint256 _timelock) 
        external 
        onlyOwner 
    {
        timelock = _timelock;
    }

    /**
     * @dev Submit a new transaction
     * @param to Destination address
     * @param value ETH value
     * @param data Call data
     * @return txIndex Transaction ID
     */
    function submitTransaction(
        address to,
        uint256 value,
        bytes memory data
    ) 
        public 
        onlyOwner 
        returns (uint256 txIndex) 
    {
        require(to != address(0), "BADMultisig: invalid destination");
        
        txIndex = transactionCount;
        
        transactions[txIndex] = Transaction({
            to: to,
            value: value,
            data: data,
            executed: false,
            numConfirmations: 0,
            submitTime: block.timestamp
        });
        
        transactionCount++;
        
        emit TransactionSubmitted(txIndex, msg.sender);
        
        confirmTransaction(txIndex);
        
        return txIndex;
    }

    /**
     * @dev Confirm an existing transaction
     * @param txIndex Transaction ID
     */
    function confirmTransaction(uint256 txIndex)
        public
        onlyOwner
        transactionExists(txIndex)
        notExecuted(txIndex)
        notConfirmed(txIndex)
    {
        Transaction storage transaction = transactions[txIndex];
        transaction.numConfirmations++;
        confirmations[txIndex][msg.sender] = true;
        
        emit TransactionConfirmed(txIndex, msg.sender);
    }

    /**
     * @dev Revoke a confirmation
     * @param txIndex Transaction ID
     */
    function revokeConfirmation(uint256 txIndex)
        public
        onlyOwner
        transactionExists(txIndex)
        notExecuted(txIndex)
    {
        require(confirmations[txIndex][msg.sender], "BADMultisig: not confirmed");
        
        Transaction storage transaction = transactions[txIndex];
        transaction.numConfirmations--;
        confirmations[txIndex][msg.sender] = false;
        
        emit TransactionRevoked(txIndex, msg.sender);
    }

    /**
     * @dev Execute a confirmed transaction
     * @param txIndex Transaction ID
     */
    function executeTransaction(uint256 txIndex)
        public
        onlyOwner
        transactionExists(txIndex)
        notExecuted(txIndex)
        pastTimelock(txIndex)
        nonReentrant
    {
        Transaction storage transaction = transactions[txIndex];
        
        require(
            transaction.numConfirmations >= required,
            "BADMultisig: insufficient confirmations"
        );
        
        transaction.executed = true;
        
        (bool success, ) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "BADMultisig: transaction execution failed");
        
        emit TransactionExecuted(txIndex, msg.sender);
    }

    /**
     * @dev Get list of owners
     * @return List of owner addresses
     */
    function getOwners() external view returns (address[] memory) {
        return owners;
    }

    /**
     * @dev Get transaction details
     * @param txIndex Transaction ID
     * @return to Destination address
     * @return value ETH value
     * @return data Call data
     * @return executed Execution status
     * @return numConfirmations Number of confirmations
     * @return submitTime Submission timestamp
     */
    function getTransaction(uint256 txIndex)
        public
        view
        returns (
            address to,
            uint256 value,
            bytes memory data,
            bool executed,
            uint256 numConfirmations,
            uint256 submitTime
        )
    {
        Transaction storage transaction = transactions[txIndex];
        
        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations,
            transaction.submitTime
        );
    }

    /**
     * @dev Check if the transaction is confirmed by an owner
     * @param txIndex Transaction ID
     * @param owner Owner address
     * @return Confirmation status
     */
    function isConfirmed(uint256 txIndex, address owner)
        public
        view
        returns (bool)
    {
        return confirmations[txIndex][owner];
    }

    /**
     * @dev Get the total number of transactions
     * @return Transaction count
     */
    function getTransactionCount() external view returns (uint256) {
        return transactionCount;
    }

    /**
     * @dev Get the pending transaction count
     * @return Pending transaction count
     */
    function getPendingTransactionCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < transactionCount; i++) {
            if (!transactions[i].executed) {
                count++;
            }
        }
        return count;
    }

    /**
     * @dev Get the number of confirmations required
     * @return Required confirmations
     */
    function getRequired() external view returns (uint256) {
        return required;
    }

    /**
     * @dev Get the timelock period
     * @return Timelock period in seconds
     */
    function getTimelock() external view returns (uint256) {
        return timelock;
    }

    /**
     * @dev Withdraw ERC20 tokens
     * @param token Token address
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function withdrawERC20(
        address token,
        address to,
        uint256 amount
    ) 
        external 
        onlyOwner 
    {
        // This creates and confirms a transaction in one step
        bytes memory data = abi.encodeWithSelector(
            IERC20.transfer.selector,
            to,
            amount
        );
        
        submitTransaction(token, 0, data);
    }

    /**
     * @dev Receive ETH
     */
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
} 