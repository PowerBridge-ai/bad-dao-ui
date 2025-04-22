const { run } = require("hardhat");

async function main() {
  console.log("Verifying contracts...");

  // Load deployed contract addresses from deployments.json
  let deployments;
  try {
    deployments = require("../deployments.json");
  } catch (e) {
    console.error("Deployment file not found. Please run deploy.js first.");
    return;
  }

  const {
    badToken,
    badTimelock,
    badGovernor,
    badTokenVesting,
    badTreasury,
    badMultisig,
    network: deployNetwork,
    parameters
  } = deployments;

  if (!badToken || !badTimelock || !badGovernor) {
    console.error("Missing core contract addresses in deployment file");
    return;
  }

  const {
    MIN_DELAY,
    VOTING_DELAY,
    VOTING_PERIOD,
    PROPOSAL_THRESHOLD,
    QUORUM_PERCENTAGE,
    MULTISIG_OWNERS,
    MULTISIG_REQUIRED,
    MULTISIG_TIMELOCK,
    TREASURY_ADMINS,
    TREASURY_EXECUTORS,
    TREASURY_MIN_APPROVALS
  } = parameters;

  console.log("Verifying BADToken...");
  try {
    await run("verify:verify", {
      address: badToken,
      constructorArguments: []
    });
    console.log("BADToken verified successfully");
  } catch (e) {
    console.log("BADToken verification failed:", e.message);
  }

  console.log("Verifying BADTimelock...");
  try {
    await run("verify:verify", {
      address: badTimelock,
      constructorArguments: [
        MIN_DELAY,
        deployments.proposers || [], // From deployment
        deployments.executors || [], // From deployment
        deployments.admin || "0x0000000000000000000000000000000000000000" // From deployment
      ]
    });
    console.log("BADTimelock verified successfully");
  } catch (e) {
    console.log("BADTimelock verification failed:", e.message);
  }

  console.log("Verifying BADGovernor...");
  try {
    await run("verify:verify", {
      address: badGovernor,
      constructorArguments: [
        badToken,
        badTimelock,
        VOTING_DELAY,
        VOTING_PERIOD,
        PROPOSAL_THRESHOLD,
        QUORUM_PERCENTAGE
      ]
    });
    console.log("BADGovernor verified successfully");
  } catch (e) {
    console.log("BADGovernor verification failed:", e.message);
  }

  console.log("Verifying BADTokenVesting...");
  try {
    await run("verify:verify", {
      address: badTokenVesting,
      constructorArguments: [badToken]
    });
    console.log("BADTokenVesting verified successfully");
  } catch (e) {
    console.log("BADTokenVesting verification failed:", e.message);
  }

  console.log("Verifying BADTreasury...");
  try {
    await run("verify:verify", {
      address: badTreasury,
      constructorArguments: [
        TREASURY_ADMINS,
        TREASURY_EXECUTORS,
        TREASURY_MIN_APPROVALS
      ]
    });
    console.log("BADTreasury verified successfully");
  } catch (e) {
    console.log("BADTreasury verification failed:", e.message);
  }

  console.log("Verifying BADMultisig...");
  try {
    await run("verify:verify", {
      address: badMultisig,
      constructorArguments: [
        MULTISIG_OWNERS,
        MULTISIG_REQUIRED,
        MULTISIG_TIMELOCK
      ]
    });
    console.log("BADMultisig verified successfully");
  } catch (e) {
    console.log("BADMultisig verification failed:", e.message);
  }

  console.log("Verification completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 