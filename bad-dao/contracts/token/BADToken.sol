// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BADToken is ERC20Votes, Ownable {
    // Initial supply of 1,000,000 tokens with 18 decimals
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18;
    
    constructor() 
        ERC20("BAD Token", "BAD") 
        ERC20Permit("BAD Token")
        Ownable(msg.sender) 
    {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    // Mint function restricted to owner for future supply adjustments if needed
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    // Override required function for ERC20Votes compatibility
    function _update(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._update(from, to, amount);
    }
    
    // Override required function for ERC20Votes compatibility  
    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
} 