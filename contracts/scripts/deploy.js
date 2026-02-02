const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const usdcAddress = process.env.USDC_ADDRESS || "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  console.log("Using USDC at:", usdcAddress);

  console.log("\n1. Deploying MaintainrRegistry...");
  const Registry = await hre.ethers.getContractFactory("MaintainrRegistry");
  const registry = await Registry.connect(deployer).deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("MaintainrRegistry deployed to:", registryAddress);

  console.log("\n2. Deploying MaintainrDonate...");
  const Donate = await hre.ethers.getContractFactory("MaintainrDonate");
  const donate = await Donate.connect(deployer).deploy(usdcAddress, registryAddress);
  await donate.waitForDeployment();
  const donateAddress = await donate.getAddress();
  console.log("MaintainrDonate deployed to:", donateAddress);

  console.log("\n3. Deploying MaintainrTreasury...");
  const Treasury = await hre.ethers.getContractFactory("MaintainrTreasury");
  const treasury = await Treasury.connect(deployer).deploy(usdcAddress, registryAddress);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("MaintainrTreasury deployed to:", treasuryAddress);

  console.log("\n4. Deploying MaintainrYellowSettlement...");
  const YellowSettlement = await hre.ethers.getContractFactory("MaintainrYellowSettlement");
  const yellowSettlement = await YellowSettlement.connect(deployer).deploy(usdcAddress, registryAddress, treasuryAddress);
  await yellowSettlement.waitForDeployment();
  const yellowSettlementAddress = await yellowSettlement.getAddress();
  console.log("MaintainrYellowSettlement deployed to:", yellowSettlementAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("USDC:", usdcAddress);
  console.log("MaintainrRegistry:", registryAddress);
  console.log("MaintainrDonate:", donateAddress);
  console.log("MaintainrTreasury:", treasuryAddress);
  console.log("MaintainrYellowSettlement:", yellowSettlementAddress);

  console.log("\n=== Save these addresses to your .env ===");
  console.log(`REGISTRY_ADDRESS=${registryAddress}`);
  console.log(`DONATE_ADDRESS=${donateAddress}`);
  console.log(`TREASURY_ADDRESS=${treasuryAddress}`);
  console.log(`YELLOW_SETTLEMENT_ADDRESS=${yellowSettlementAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
