const hre = require("hardhat");

async function main() {
  const CharityContract = await hre.ethers.getContractFactory("CharityContract");
  const charityContract = await CharityContract.deploy();

  await charityContract.deployed();

  console.log("CharityContract deployed to:", charityContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
