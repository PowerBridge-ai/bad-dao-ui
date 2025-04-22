// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract BADTimelock is TimelockController {
    // minDelay: 2 days in seconds for execution delay
    // proposers: initial array of addresses that can propose
    // executors: initial array of addresses that can execute
    // admin: optional admin address for setup
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
} 