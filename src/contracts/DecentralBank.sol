// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './Tether.sol';
import './RWD.sol';

contract DecentralBank {
    address public owner;
    string public name = "Decentral Bank";
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;


    constructor(Tether _tether,RWD _rwd) public{
        tether = _tether;
        rwd = _rwd;
        owner = msg.sender;
    }

    function depositTokens(uint _amount) public {
        require(_amount > 0,"amount cannot be zero or negative");
        //transfer Tether tokens to this contract address for staking
        tether.transferFrom(msg.sender,address(this),_amount);

        // Update staking balance
        stakingBalance[msg.sender] += _amount;

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaked[msg.sender] = true;

    }

    //issue tokens 
    function issueTokens() public {
        //only the owner can issue tokens
        require(msg.sender == owner,'caller must be the owner');

        for(uint i=0;i<stakers.length;i++){
            address recipient = stakers[i];
            uint rewardBalance = stakingBalance[recipient];

            if(rewardBalance > 0){
                rwd.transfer(recipient,rewardBalance);
            }
        }
    }

    //unstake tokens
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0,'staking balance should be greater than 0');

        //transfer the tokens back to the customer from our contract
        tether.transfer(msg.sender,balance);

        //update customer staking information
        stakingBalance[msg.sender] =  0;
        isStaked[msg.sender] = false;
    }
}