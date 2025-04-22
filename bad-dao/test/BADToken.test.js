const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BADToken", function () {
  let BADToken;
  let badToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    BADToken = await ethers.getContractFactory("BADToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new BADToken contract before each test
    badToken = await BADToken.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await badToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await badToken.balanceOf(owner.address);
      expect(await badToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct initial supply", async function () {
      const expectedSupply = ethers.parseEther("1000000"); // 1,000,000 tokens with 18 decimals
      expect(await badToken.totalSupply()).to.equal(expectedSupply);
    });

    it("Should have correct name and symbol", async function () {
      expect(await badToken.name()).to.equal("BAD Token");
      expect(await badToken.symbol()).to.equal("BAD");
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await badToken.transfer(addr1.address, 50);
      const addr1Balance = await badToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      await badToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await badToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await badToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner
      await expect(
        badToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed
      expect(await badToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await badToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1
      await badToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2
      await badToken.transfer(addr2.address, 50);

      // Check balances
      const finalOwnerBalance = await badToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150n);

      const addr1Balance = await badToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await badToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });

  describe("Voting Power", function () {
    it("Should allow delegation of voting power", async function () {
      // Check initial voting power is 0 before delegation
      expect(await badToken.getVotes(addr1.address)).to.equal(0);

      // Transfer some tokens to addr1
      const amount = ethers.parseEther("1000");
      await badToken.transfer(addr1.address, amount);

      // Self-delegate to activate voting power
      await badToken.connect(addr1).delegate(addr1.address);

      // Check voting power after delegation
      expect(await badToken.getVotes(addr1.address)).to.equal(amount);
    });

    it("Should allow delegation to another account", async function () {
      // Transfer tokens to addr1
      const amount = ethers.parseEther("1000");
      await badToken.transfer(addr1.address, amount);

      // addr1 delegates to addr2
      await badToken.connect(addr1).delegate(addr2.address);

      // Check voting power
      expect(await badToken.getVotes(addr1.address)).to.equal(0);
      expect(await badToken.getVotes(addr2.address)).to.equal(amount);
    });

    it("Should track voting power history with checkpoints", async function () {
      // Transfer tokens to addr1
      const amount = ethers.parseEther("1000");
      await badToken.transfer(addr1.address, amount);

      // Self-delegate to activate voting power
      await badToken.connect(addr1).delegate(addr1.address);

      // Get the current block number
      const blockNumber = await ethers.provider.getBlockNumber();

      // Check past voting power
      expect(await badToken.getPastVotes(addr1.address, blockNumber - 1)).to.equal(0);
      
      // Check current voting power
      expect(await badToken.getVotes(addr1.address)).to.equal(amount);
    });
  });

  describe("Owner Functions", function () {
    it("Should allow only owner to mint new tokens", async function () {
      const initialSupply = await badToken.totalSupply();
      const mintAmount = ethers.parseEther("10000");

      // Mint new tokens
      await badToken.mint(owner.address, mintAmount);

      // Check new total supply
      expect(await badToken.totalSupply()).to.equal(initialSupply + mintAmount);

      // Non-owner should not be able to mint
      await expect(
        badToken.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.revertedWithCustomError(badToken, "OwnableUnauthorizedAccount");
    });

    it("Should allow ownership transfer", async function () {
      // Transfer ownership to addr1
      await badToken.transferOwnership(addr1.address);
      
      // Check new owner
      expect(await badToken.owner()).to.equal(addr1.address);
      
      // New owner should be able to mint
      const mintAmount = ethers.parseEther("10000");
      await badToken.connect(addr1).mint(addr1.address, mintAmount);
      
      // Old owner should not be able to mint
      await expect(
        badToken.mint(owner.address, mintAmount)
      ).to.be.revertedWithCustomError(badToken, "OwnableUnauthorizedAccount");
    });
  });
}); 