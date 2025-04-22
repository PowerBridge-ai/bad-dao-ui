const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Network:", network.name);

  // Get contract factories
  const BADToken = await ethers.getContractFactory("BADToken");
  const BADTimelock = await ethers.getContractFactory("BADTimelock");
  const BADGovernor = await ethers.getContractFactory("BADGovernor");
  const BADTokenVesting = await ethers.getContractFactory("BADTokenVesting");
  const BADTreasury = await ethers.getContractFactory("BADTreasury");
  const BADMultisig = await ethers.getContractFactory("BADMultisig");

  // Define governance parameters
  const MIN_DELAY = 172800; // 2 days in seconds
  const VOTING_DELAY = 7200; // 1 day in blocks (assuming ~12 sec block time)
  const VOTING_PERIOD = 36000; // 5 days in blocks
  const PROPOSAL_THRESHOLD = ethers.parseEther("10000"); // 1% of total supply (1,000,000)
  const QUORUM_PERCENTAGE = 4; // 4% of total supply
  const MULTISIG_OWNERS = [deployer.address]; // Add more owner addresses as needed
  const MULTISIG_REQUIRED = 1; // Number of required signatures
  const MULTISIG_TIMELOCK = 86400; // 1 day in seconds
  const TREASURY_ADMINS = [deployer.address]; // Admin addresses for treasury
  const TREASURY_EXECUTORS = [deployer.address]; // Executor addresses for treasury
  const TREASURY_MIN_APPROVALS = 1; // Min approvals for treasury spending

  console.log("Deployment started...");

  // 1. Deploy BADToken
  console.log("Deploying BADToken...");
  const badToken = await BADToken.deploy();
  await badToken.waitForDeployment();
  const badTokenAddress = await badToken.getAddress();
  console.log("BADToken deployed to:", badTokenAddress);

  // 2. Deploy BADTimelock
  console.log("Deploying BADTimelock...");
  // Initially, the deployer is the proposer and executor
  // These roles will be transferred to the governor after setup
  const proposers = [deployer.address];
  const executors = [deployer.address];
  const admin = deployer.address;
  
  const badTimelock = await BADTimelock.deploy(
    MIN_DELAY,
    proposers,
    executors,
    admin
  );
  await badTimelock.waitForDeployment();
  const badTimelockAddress = await badTimelock.getAddress();
  console.log("BADTimelock deployed to:", badTimelockAddress);

  // 3. Deploy BADGovernor
  console.log("Deploying BADGovernor...");
  const badGovernor = await BADGovernor.deploy(
    badTokenAddress,
    badTimelockAddress,
    VOTING_DELAY,
    VOTING_PERIOD,
    PROPOSAL_THRESHOLD,
    QUORUM_PERCENTAGE
  );
  await badGovernor.waitForDeployment();
  const badGovernorAddress = await badGovernor.getAddress();
  console.log("BADGovernor deployed to:", badGovernorAddress);

  // 4. Deploy BADTokenVesting
  console.log("Deploying BADTokenVesting...");
  const badTokenVesting = await BADTokenVesting.deploy(badTokenAddress);
  await badTokenVesting.waitForDeployment();
  const badTokenVestingAddress = await badTokenVesting.getAddress();
  console.log("BADTokenVesting deployed to:", badTokenVestingAddress);

  // 5. Deploy BADTreasury
  console.log("Deploying BADTreasury...");
  const badTreasury = await BADTreasury.deploy(
    TREASURY_ADMINS,
    TREASURY_EXECUTORS,
    TREASURY_MIN_APPROVALS
  );
  await badTreasury.waitForDeployment();
  const badTreasuryAddress = await badTreasury.getAddress();
  console.log("BADTreasury deployed to:", badTreasuryAddress);

  // 6. Deploy BADMultisig
  console.log("Deploying BADMultisig...");
  const badMultisig = await BADMultisig.deploy(
    MULTISIG_OWNERS,
    MULTISIG_REQUIRED,
    MULTISIG_TIMELOCK
  );
  await badMultisig.waitForDeployment();
  const badMultisigAddress = await badMultisig.getAddress();
  console.log("BADMultisig deployed to:", badMultisigAddress);

  // Setup governance roles
  console.log("Setting up governance roles...");
  
  // Get TimelockController role constants
  const timelock = await ethers.getContractAt("TimelockController", badTimelockAddress);
  const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
  const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
  const CANCELLER_ROLE = await timelock.CANCELLER_ROLE();
  const TIMELOCK_ADMIN_ROLE = await timelock.TIMELOCK_ADMIN_ROLE();

  // Grant PROPOSER_ROLE to the governor
  await timelock.grantRole(PROPOSER_ROLE, badGovernorAddress);
  console.log("PROPOSER_ROLE granted to Governor");

  // Grant EXECUTOR_ROLE to address zero (allows anyone to execute)
  await timelock.grantRole(EXECUTOR_ROLE, ethers.ZeroAddress);
  console.log("EXECUTOR_ROLE granted to anyone (address zero)");

  // Grant CANCELLER_ROLE to the governor
  await timelock.grantRole(CANCELLER_ROLE, badGovernorAddress);
  console.log("CANCELLER_ROLE granted to Governor");

  // Revoke TIMELOCK_ADMIN_ROLE from deployer
  // This makes the timelock self-governed through proposals
  await timelock.revokeRole(TIMELOCK_ADMIN_ROLE, deployer.address);
  console.log("TIMELOCK_ADMIN_ROLE revoked from deployer");

  // Transfer tokens to vesting contract (to be used for team allocation)
  console.log("Setting up token distribution...");
  
  // Approve tokens for the vesting contract (40% of supply for team)
  const teamAllocation = ethers.parseEther("400000");
  await badToken.approve(badTokenVestingAddress, teamAllocation);
  console.log("Approved tokens for vesting contract");

  // Transfer tokens to treasury (20% of supply)
  const treasuryAllocation = ethers.parseEther("200000");
  await badToken.transfer(badTreasuryAddress, treasuryAllocation);
  console.log("Transferred tokens to treasury contract");

  // Setup community allocation via multisig (30% of supply)
  const communityAllocation = ethers.parseEther("300000");
  await badToken.transfer(badMultisigAddress, communityAllocation);
  console.log("Transferred tokens to multisig wallet for community");

  // Save deployment information
  const deploymentInfo = {
    network: network.name,
    deployer: deployer.address,
    badToken: badTokenAddress,
    badTimelock: badTimelockAddress,
    badGovernor: badGovernorAddress,
    badTokenVesting: badTokenVestingAddress,
    badTreasury: badTreasuryAddress,
    badMultisig: badMultisigAddress,
    proposers,
    executors,
    admin,
    parameters: {
      MIN_DELAY,
      VOTING_DELAY,
      VOTING_PERIOD,
      PROPOSAL_THRESHOLD: PROPOSAL_THRESHOLD.toString(),
      QUORUM_PERCENTAGE,
      MULTISIG_OWNERS,
      MULTISIG_REQUIRED,
      MULTISIG_TIMELOCK,
      TREASURY_ADMINS,
      TREASURY_EXECUTORS,
      TREASURY_MIN_APPROVALS,
      teamAllocation: teamAllocation.toString(),
      treasuryAllocation: treasuryAllocation.toString(),
      communityAllocation: communityAllocation.toString()
    },
    timestamp: new Date().toISOString()
  };

  // Save deployment info to file
  const deploymentPath = path.join(__dirname, "..", "deployments.json");
  fs.writeFileSync(
    deploymentPath,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`Deployment information saved to ${deploymentPath}`);

  // Print summary
  console.log("\nDeployment completed!");
  console.log("======================");
  console.log("BADToken:", badTokenAddress);
  console.log("BADTimelock:", badTimelockAddress);
  console.log("BADGovernor:", badGovernorAddress);
  console.log("BADTokenVesting:", badTokenVestingAddress);
  console.log("BADTreasury:", badTreasuryAddress);
  console.log("BADMultisig:", badMultisigAddress);
  console.log("======================");

  // Return the deployed contract addresses
  return {
    badToken: badTokenAddress,
    badTimelock: badTimelockAddress,
    badGovernor: badGovernorAddress,
    badTokenVesting: badTokenVestingAddress,
    badTreasury: badTreasuryAddress,
    badMultisig: badMultisigAddress
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 