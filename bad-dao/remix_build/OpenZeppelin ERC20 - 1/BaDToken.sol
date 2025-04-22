contract BADToken is ERC20("BAD Token", "BAD"), Ownable {
    constructor() {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(amount > 0, "Mint amount must be > 0");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        require(balanceOf(from) >= amount, "Not enough balance");
        _burn(from, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
