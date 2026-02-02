const hre = require("hardhat");

async function main() {
  console.log("Verifying contracts on BaseScan...\n");

  const contracts = [
    {
      name: "MaintainrRegistry",
      address: "0xfAfcca14E7b0c68463E12f826EB2320F0bf72382",
      constructorArgs: []
    },
    {
      name: "MaintainrDonate", 
      address: "0x513E82DE40C9d735398015747bB947ffBc2243eD",
      constructorArgs: [
        "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC
        "0xfAfcca14E7b0c68463E12f826EB2320F0bf72382"  // Registry
      ]
    },
    {
      name: "MaintainrTreasury",
      address: "0x07964B4E077315b4BB87d0998A7713af5b054F75", 
      constructorArgs: [
        "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC
        "0xfAfcca14E7b0c68463E12f826EB2320F0bf72382"  // Registry
      ]
    },
    {
      name: "MaintainrYellowSettlement",
      address: "0x433C9F7bc9F7efEe6dfC884D33F05ECE12328737",
      constructorArgs: [
        "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC
        "0xfAfcca14E7b0c68463E12f826EB2320F0bf72382", // Registry
        "0x07964B4E077315b4BB87d0998A7713af5b054F75"  // Treasury
      ]
    }
  ];

  for (const contract of contracts) {
    try {
      console.log(`Verifying ${contract.name} at ${contract.address}...`);
      
      await hre.run("verify:verify", {
        address: contract.address,
        constructorArguments: contract.constructorArgs,
        network: "baseSepolia"
      });
      
      console.log(`✅ ${contract.name} verified successfully!\n`);
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log(`✅ ${contract.name} already verified!\n`);
      } else {
        console.log(`❌ ${contract.name} verification failed: ${error.message}\n`);
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
