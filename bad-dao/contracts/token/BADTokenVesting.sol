// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title BADTokenVesting
 * @dev A contract for managing vesting schedules for BAD tokens
 * Beneficiaries can withdraw tokens gradually as they vest
 */
contract BADTokenVesting is Ownable {
    using SafeERC20 for IERC20;

    event TokensReleased(address token, uint256 amount);
    event VestingRevoked(address token);

    // Vesting schedule for each beneficiary
    struct VestingSchedule {
        bool revocable;           // Whether the vesting can be revoked
        uint256 cliffDuration;    // Duration in seconds of the cliff
        uint256 start;            // Start time of the vesting period
        uint256 duration;         // Duration in seconds of the vesting period
        uint256 releasedAmount;   // Amount of tokens already released
        uint256 totalAmount;      // Total amount of tokens to be vested
        bool revoked;             // Whether the vesting has been revoked
    }

    // Mapping of beneficiary to their vesting schedule
    mapping(address => VestingSchedule) public vestingSchedules;
    
    // The token being vested
    IERC20 public immutable token;

    /**
     * @dev Constructor
     * @param _token The address of the BAD token contract
     */
    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "BADTokenVesting: token is the zero address");
        token = IERC20(_token);
    }

    /**
     * @dev Creates a vesting schedule for a beneficiary
     * @param beneficiary Address of the beneficiary to whom vested tokens are transferred
     * @param startTime Start time of the vesting period
     * @param cliffDuration Duration in seconds of the cliff in which tokens will begin to vest
     * @param duration Duration in seconds of the period in which the tokens will vest
     * @param revocable Whether the vesting is revocable or not
     * @param amount Total amount of tokens to be released at the end of the vesting
     */
    function createVestingSchedule(
        address beneficiary,
        uint256 startTime,
        uint256 cliffDuration,
        uint256 duration,
        bool revocable,
        uint256 amount
    ) 
        external 
        onlyOwner 
    {
        require(beneficiary != address(0), "BADTokenVesting: beneficiary is the zero address");
        require(vestingSchedules[beneficiary].totalAmount == 0, "BADTokenVesting: vesting schedule already exists");
        require(duration > 0, "BADTokenVesting: duration must be > 0");
        require(amount > 0, "BADTokenVesting: amount must be > 0");
        require(cliffDuration <= duration, "BADTokenVesting: cliff must be <= duration");

        // Transfer tokens to contract
        token.safeTransferFrom(msg.sender, address(this), amount);

        // Create new vesting schedule
        vestingSchedules[beneficiary] = VestingSchedule({
            revocable: revocable,
            cliffDuration: cliffDuration,
            start: startTime,
            duration: duration,
            releasedAmount: 0,
            totalAmount: amount,
            revoked: false
        });
    }

    /**
     * @dev Release vested tokens to beneficiary
     * @param beneficiary The address that will receive the vested tokens
     */
    function release(address beneficiary) external {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        require(schedule.totalAmount > 0, "BADTokenVesting: no vesting schedule found");
        
        uint256 unreleased = releasableAmount(beneficiary);
        require(unreleased > 0, "BADTokenVesting: no tokens are due");
        
        schedule.releasedAmount += unreleased;
        token.safeTransfer(beneficiary, unreleased);
        
        emit TokensReleased(address(token), unreleased);
    }

    /**
     * @dev Revokes the vesting schedule for a beneficiary
     * @param beneficiary The address of the beneficiary
     */
    function revoke(address beneficiary) external onlyOwner {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        require(schedule.totalAmount > 0, "BADTokenVesting: no vesting schedule found");
        require(schedule.revocable, "BADTokenVesting: vesting is not revocable");
        require(!schedule.revoked, "BADTokenVesting: vesting already revoked");
        
        uint256 vested = vestedAmount(beneficiary);
        uint256 unreleased = vested - schedule.releasedAmount;
        uint256 refund = schedule.totalAmount - vested;
        
        schedule.revoked = true;
        
        if (unreleased > 0) {
            schedule.releasedAmount = vested;
            token.safeTransfer(beneficiary, unreleased);
            emit TokensReleased(address(token), unreleased);
        }
        
        if (refund > 0) {
            token.safeTransfer(owner(), refund);
        }
        
        emit VestingRevoked(address(token));
    }

    /**
     * @dev Calculates the amount of tokens that has already vested for a beneficiary
     * @param beneficiary The address of the beneficiary
     * @return The amount of tokens already vested
     */
    function vestedAmount(address beneficiary) public view returns (uint256) {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        if (schedule.totalAmount == 0) {
            return 0;
        }
        
        if (block.timestamp < schedule.start + schedule.cliffDuration) {
            return 0;
        }
        
        if (schedule.revoked) {
            return schedule.releasedAmount;
        }
        
        if (block.timestamp >= schedule.start + schedule.duration) {
            return schedule.totalAmount;
        }
        
        uint256 timeFromStart = block.timestamp - schedule.start;
        return schedule.totalAmount * timeFromStart / schedule.duration;
    }

    /**
     * @dev Calculates the amount of tokens that can be released for a beneficiary
     * @param beneficiary The address of the beneficiary
     * @return The amount of releasable tokens
     */
    function releasableAmount(address beneficiary) public view returns (uint256) {
        return vestedAmount(beneficiary) - vestingSchedules[beneficiary].releasedAmount;
    }

    /**
     * @dev Get vesting schedule information for a beneficiary
     * @param beneficiary The address of the beneficiary
     * @return revocable Whether the vesting is revocable
     * @return cliffDuration Cliff duration in seconds
     * @return start Start timestamp
     * @return duration Duration in seconds
     * @return releasedAmount Amount of tokens already released
     * @return totalAmount Total amount of tokens to be released
     * @return revoked Whether the vesting has been revoked
     */
    function getVestingSchedule(address beneficiary) 
        external 
        view 
        returns (
            bool revocable,
            uint256 cliffDuration,
            uint256 start,
            uint256 duration,
            uint256 releasedAmount,
            uint256 totalAmount,
            bool revoked
        ) 
    {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        return (
            schedule.revocable,
            schedule.cliffDuration,
            schedule.start,
            schedule.duration,
            schedule.releasedAmount,
            schedule.totalAmount,
            schedule.revoked
        );
    }
} 