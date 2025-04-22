// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title BADTreasury
 * @dev Contract to manage treasury funds for BAD DAO
 */
contract BADTreasury is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

    // Events
    event FundsDeposited(address indexed token, address indexed sender, uint256 amount);
    event FundsWithdrawn(address indexed token, address indexed recipient, uint256 amount);
    event NativeReceived(address indexed sender, uint256 amount);
    event SpendingApproved(uint256 indexed requestId, address indexed recipient, uint256 amount);
    event SpendingExecuted(uint256 indexed requestId, address indexed executor);

    // Spending request struct
    struct SpendingRequest {
        address token;          // Address of token to spend (address(0) for native tokens)
        address recipient;      // Recipient of funds
        uint256 amount;         // Amount to spend
        string description;     // Description of the spending
        bool executed;          // Whether it's been executed
        uint256 approvalCount;  // Number of approvals received
        mapping(address => bool) approvals; // Mapping of admin approvals
    }

    // Minimum approvals needed for spending
    uint256 public minApprovals;
    
    // Spending requests
    mapping(uint256 => SpendingRequest) public spendingRequests;
    uint256 public nextRequestId;

    /**
     * @dev Constructor sets up the admin role and minimum approvals
     * @param _admins Initial list of admins
     * @param _executors Initial list of executors
     * @param _minApprovals Minimum number of approvals required
     */
    constructor(
        address[] memory _admins,
        address[] memory _executors,
        uint256 _minApprovals
    ) {
        require(_minApprovals > 0, "BADTreasury: min approvals must be > 0");
        require(_minApprovals <= _admins.length, "BADTreasury: min approvals exceeds admin count");

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        
        for (uint256 i = 0; i < _admins.length; i++) {
            _grantRole(ADMIN_ROLE, _admins[i]);
        }
        
        for (uint256 i = 0; i < _executors.length; i++) {
            _grantRole(EXECUTOR_ROLE, _executors[i]);
        }
        
        minApprovals = _minApprovals;
        nextRequestId = 1;
    }

    /**
     * @dev Deposit ERC20 tokens to the treasury
     * @param _token Address of the token
     * @param _amount Amount to deposit
     */
    function depositTokens(address _token, uint256 _amount) external {
        require(_token != address(0), "BADTreasury: invalid token address");
        require(_amount > 0, "BADTreasury: amount must be > 0");
        
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        
        emit FundsDeposited(_token, msg.sender, _amount);
    }

    /**
     * @dev Create a new spending request
     * @param _token Address of the token (address(0) for native)
     * @param _recipient Recipient address
     * @param _amount Amount to spend
     * @param _description Description of the spending
     * @return requestId ID of the created request
     */
    function createSpendingRequest(
        address _token,
        address _recipient,
        uint256 _amount,
        string memory _description
    ) 
        external 
        onlyRole(ADMIN_ROLE) 
        returns (uint256) 
    {
        require(_recipient != address(0), "BADTreasury: invalid recipient");
        require(_amount > 0, "BADTreasury: amount must be > 0");
        
        uint256 requestId = nextRequestId++;
        
        SpendingRequest storage request = spendingRequests[requestId];
        request.token = _token;
        request.recipient = _recipient;
        request.amount = _amount;
        request.description = _description;
        request.executed = false;
        request.approvalCount = 0;
        
        return requestId;
    }

    /**
     * @dev Approve a spending request
     * @param _requestId ID of the request to approve
     */
    function approveSpending(uint256 _requestId) external onlyRole(ADMIN_ROLE) {
        SpendingRequest storage request = spendingRequests[_requestId];
        require(!request.executed, "BADTreasury: request already executed");
        require(!request.approvals[msg.sender], "BADTreasury: already approved");
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
        
        emit SpendingApproved(_requestId, request.recipient, request.amount);
    }

    /**
     * @dev Execute a spending request
     * @param _requestId ID of the request to execute
     */
    function executeSpending(uint256 _requestId) external onlyRole(EXECUTOR_ROLE) nonReentrant {
        SpendingRequest storage request = spendingRequests[_requestId];
        require(!request.executed, "BADTreasury: request already executed");
        require(request.approvalCount >= minApprovals, "BADTreasury: not enough approvals");
        
        request.executed = true;
        
        if (request.token == address(0)) {
            // Native token transfer
            require(address(this).balance >= request.amount, "BADTreasury: insufficient balance");
            (bool success, ) = request.recipient.call{value: request.amount}("");
            require(success, "BADTreasury: native transfer failed");
        } else {
            // ERC20 token transfer
            IERC20(request.token).safeTransfer(request.recipient, request.amount);
        }
        
        emit SpendingExecuted(_requestId, msg.sender);
    }

    /**
     * @dev Update minimum approvals required
     * @param _minApprovals New minimum approvals
     */
    function updateMinApprovals(uint256 _minApprovals) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_minApprovals > 0, "BADTreasury: min approvals must be > 0");
        uint256 adminCount = getRoleMemberCount(ADMIN_ROLE);
        require(_minApprovals <= adminCount, "BADTreasury: min approvals exceeds admin count");
        
        minApprovals = _minApprovals;
    }

    /**
     * @dev Check if a request has been approved by a specific admin
     * @param _requestId Request ID
     * @param _admin Admin address
     * @return Approval status
     */
    function hasApproved(uint256 _requestId, address _admin) external view returns (bool) {
        return spendingRequests[_requestId].approvals[_admin];
    }

    /**
     * @dev Get token balance
     * @param _token Token address
     * @return Token balance
     */
    function getTokenBalance(address _token) external view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }

    /**
     * @dev Get native token balance
     * @return Native token balance
     */
    function getNativeBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Receive native tokens
     */
    receive() external payable {
        emit NativeReceived(msg.sender, msg.value);
    }
} 