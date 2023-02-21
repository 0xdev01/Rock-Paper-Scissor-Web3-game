// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.3/contracts/security/ReentrancyGuard.sol";

contract rockPaperScissors is ReentrancyGuard{
    mapping (address => uint) public playerBalances;
    
    event Received(address, uint);

    //deposit to the Contract
    function depositContract() external payable {
        emit Received(msg.sender, msg.value);
    }
    
    //deposit to a Player
    function depositPlayer() external payable {
        playerBalances[msg.sender] += msg.value;
    }
    
    //withdraw a player's funds and prevent reentrancy
    function withdraw() external nonReentrant {
        uint playerBalance = playerBalances[msg.sender];
        require(playerBalance > 0);
        
        playerBalances[msg.sender] = 0;
        (bool success, ) = address(msg.sender).call{ value: playerBalance }("");
        require(success, "Withdraw failed!");
    }

    function getContractBalance() external view returns(uint contractBalance) {
        return address(this).balance;
    }

    function contractChoice(uint _i) internal pure returns (string memory) {
            if(_i == 0){ return "rock";} else if(_i == 1){ return "paper";} else {return "scissors";}
    }

    
    function play(string calldata _playerChoice, uint _gameBet) external returns(string memory gameOutcome) {
        require(_gameBet >= 0.1 ether, "Bet amount has to be minimum 0.1 BNB");
        require(playerBalances[msg.sender] >= _gameBet, "Not enough funds to place bet - please deposit more BNB.");
        
        //calculate pseudo randomness
        uint randomness = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender)))% 3;
        

        bytes memory choices = bytes.concat(bytes(_playerChoice), bytes(contractChoice(randomness)));
        
        string memory outcome;
        
        if(keccak256(choices) == keccak256(bytes("rockrock"))
            || keccak256(choices) == keccak256(bytes("paperpaper"))
            || keccak256(choices) == keccak256(bytes("scissorsscissors")))
        {
            //this is a draw
            outcome = "DRAW";
        } else if(keccak256(choices) == keccak256(bytes("scissorspaper"))
            || keccak256(choices) == keccak256(bytes("rockscissors"))
            || keccak256(choices) == keccak256(bytes("paperrock")))
        {
            //a player wins
            playerBalances[msg.sender] += _gameBet;
            outcome = "WON";
        } else if(keccak256(choices) == keccak256(bytes("paperscissors"))
            || keccak256(choices) == keccak256(bytes("scissorsrock"))
            || keccak256(choices) == keccak256(bytes("rockpaper")))
        {
            //the contract wins 
            playerBalances[msg.sender] -= _gameBet;
            outcome = "LOST";
        }
        else {
            //there was a problem with this game...
            outcome = "FAIL";
        }
        return outcome;
        
    }
}