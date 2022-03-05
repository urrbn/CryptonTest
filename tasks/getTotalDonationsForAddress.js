require("@nomiclabs/hardhat-ethers");
const { ethers } = require("ethers");
const contract = require("../artifacts/contracts/Donations.sol/CharityContract.json");

task("Get-donations-amount-of-the-address", "returns total donations amount of the account")
  .addParam("account" , "The account")
  .setAction(async (taskArgs) => {
    const RINKEBY_URL = process.env.RINKEBY_URL;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const API_KEY = process.env.API_KEY;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;  

    const infuraProvider = new ethers.providers.InfuraProvider(network = "rinkeby", API_KEY);
    const signer = new ethers.Wallet(PRIVATE_KEY, infuraProvider);
    const CharityContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
    
    const donations = await CharityContract.getAllDonationsForAddress(taskArgs.account);
    
    console.log(ethers.utils.formatEther(donations));
  });

module.exports = {};