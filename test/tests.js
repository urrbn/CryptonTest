const { expect } = require("chai");
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("CharityContract", function () {
  
  beforeEach(async function () {
    this.signers = await ethers.getSigners()
    this.owner = this.signers[0]
    this.alice = this.signers[1]
    this.bob = this.signers[2]
  
    const CharityContract = await ethers.getContractFactory("CharityContract");
    this.charityContract = await CharityContract.deploy();
    await this.charityContract.deployed();
    
  })
  
  it("Should handle deposits correctly", async function () {
    await this.charityContract.connect(this.alice).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})
    await this.charityContract.connect(this.alice).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})

    let donations = await this.charityContract.getAllDonationsForAddress(this.alice.address)
    console.log(donations)

    await expect(donations).to.equal(ethers.utils.parseEther("20"))
  })

  it("Should return the amount of deposited donations for address correctly", async function () {
    await this.charityContract.connect(this.alice).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})
    await this.charityContract.connect(this.alice).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})

    let donations = await this.charityContract.getAllDonationsForAddress(this.alice.address)
    console.log(donations)

    await expect(donations).to.equal(ethers.utils.parseEther("20"))
  })

  it("Should return the right number of contributors in the array without duplications", async function () {
    await this.charityContract.donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})
    await this.charityContract.connect(this.alice).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})
    await this.charityContract.connect(this.bob).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})
    await this.charityContract.connect(this.alice).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})
    await this.charityContract.connect(this.alice).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})
    await this.charityContract.connect(this.bob).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})

    let contributors = await this.charityContract.getAllContributors()
    console.log(contributors.length)

    await expect(contributors.length).to.equal(3)
  })

  it("Should withdraw funds", async function () {
    await this.charityContract.connect(this.bob).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})
    await this.charityContract.connect(this.bob).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})
    
    let InitialAliceBal = await this.alice.getBalance()
    let InitialAliceBalInt = await ethers.utils.formatEther(InitialAliceBal)
    console.log(parseInt(InitialAliceBalInt), "Balance b4 withdrowal")

    await this.charityContract.withdraw(ethers.utils.parseEther("20"), this.alice.address);
    let aliceBal = await this.alice.getBalance()
    let aliceBalInt = ethers.utils.formatEther(aliceBal)
    console.log(parseInt(aliceBalInt), "Balance after withdrowal")

                
    await expect(parseInt(InitialAliceBalInt)).to.equal(parseInt(aliceBalInt) - 20)
  })

  it("Should throw an error when msg.value is lower than desired amount", async function (){
    
    await expect(this.charityContract.connect(this.alice).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("9")})).to.throw

  })

  it("Should throw an error when msg.sender balance is lower than the amount", async function (){
    
    await expect(this.charityContract.connect(this.alice).donate(ethers.utils.parseEther("10000"), {value : ethers.utils.parseEther("10001")})).to.throw

  })

  it("Should push msg.sender in the contributors array if deposits for the first time", async function (){
    
    await this.charityContract.donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})
    await this.charityContract.connect(this.alice).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})
    await this.charityContract.connect(this.bob).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})
    
    let contributors = await this.charityContract.getAllContributors()

    await expect(contributors[0]).to.equal(this.owner.address)
    await expect(contributors[1]).to.equal(this.alice.address)
    await expect(contributors[2]).to.equal(this.bob.address)
   
  })

  it("Only owner should be able to withdraw funds", async function () {
    await this.charityContract.connect(this.alice).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})
    
    await expect(this.charityContract.connect(this.alice).withdraw(ethers.utils.parseEther("10"), this.alice.address)).to.be.revertedWith('You are not the owner')
  })

  it("Should throw an error if the contract balance is lower than the amount", async function () {
    await this.charityContract.connect(this.alice).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})
    
    await expect(this.charityContract.withdraw(ethers.utils.parseEther("20"), this.alice.address)).to.throw
  })

  it("Should return the right amount of total donations", async function () {
    await this.charityContract.connect(this.alice).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})
    await this.charityContract.connect(this.bob).donate(ethers.utils.parseEther("10"), {value : ethers.utils.parseEther("10")})
    
    let totalDonations = await this.charityContract.getTotalDonations()

    await expect(totalDonations).to.equal(ethers.utils.parseEther("20"))
  })

  it("Shouldn't revert when msg.value is greater or equal than desired amount", async function (){
    
    await expect(this.charityContract.connect(this.alice).donate(ethers.utils.parseEther("1000"), {value : ethers.utils.parseEther("1000")})).to.be.not.revertedWith("Not enough eth sent")

  })

  it("Shouldn't throw an error when msg.sender balance isn't lower than amount", async function (){

    await expect(this.charityContract.connect(this.alice).donate(ethers.utils.parseEther("1000"), {value : ethers.utils.parseEther("1000")})).not.to.Throw
    
  })

});

