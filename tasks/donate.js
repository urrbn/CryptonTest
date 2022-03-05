require("@nomiclabs/hardhat-ethers");
const { ethers } = require("ethers");
const contract = require("../artifacts/contracts/Donations.sol/CharityContract.json");

task("donate", "donates any amount to the contract")
  .addParam("amount" , "The amount you want to deposit")
  .setAction(async (taskArgs) => {
    const RINKEBY_URL = process.env.RINKEBY_URL;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const API_KEY = process.env.API_KEY;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;  

    const infuraProvider = new ethers.providers.InfuraProvider(network = "rinkeby", API_KEY);
    const signer = new ethers.Wallet(PRIVATE_KEY, infuraProvider);
    const CharityContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
    const tx = await CharityContract.donate(taskArgs.amount, {value : taskArgs.amount});
    
    console.log(tx);
  });

module.exports = {};