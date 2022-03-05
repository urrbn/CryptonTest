pragma solidity ^0.8.4;

contract CharityContract {

   address[] public contributors;
   address private owner;
   uint256 public totalDonations;

   mapping(address => uint256) addressToDonations; 
   mapping(address => bool) isContributor;
   

   event Donated(address donator, uint256 amount);
   event Withdrawal(address to, uint256 amount);

   constructor(){
      owner = msg.sender;
      totalDonations = 0;
   }
    
   function donate(uint amount) external payable {
      require(msg.value >= amount, "Not enough eth sent");
      require(msg.sender.balance >= amount, "Insuficcient funds");
      
      if (isContributor[msg.sender]){
          addressToDonations[msg.sender] += amount;
          totalDonations += amount;
       }

      if(!isContributor[msg.sender]){
         isContributor[msg.sender] = true; 
         contributors.push(msg.sender);
         addressToDonations[msg.sender] += amount;
         totalDonations += amount;
       } 

      emit Donated(msg.sender, amount);

   }

   function getAllDonationsForAddress(address account) public view returns(uint256){
      return addressToDonations[account];
   }

   function getAllContributors() public view returns(address[] memory){ 
      return (contributors);
   }

   function getTotalDonations() public view returns(uint256){ 
      return (totalDonations);
   }

   function withdraw(uint256 amount, address account) external {
      require(address(this).balance >= amount, "Insufficient funds");
      require(msg.sender == owner, "You are not the owner");
      

      payable(account).transfer(amount);
      emit Withdrawal(account, amount);
   }
}

