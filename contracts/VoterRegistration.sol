// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract VoterRegistration {
    //Information about each voter
    struct Voter { uint256 id; string name; uint256 age; bool isEligible; bool hasVoted; }

    //Associating voter addresses with Voter data
    mapping(address => Voter) public voters;
    address[] public votersAddresses;

    //Event to emit when a new voter is registered
    event VoterRegistered(address indexed votersAddresses, uint256 voterId, string name, uint256 age, bool isEligible);

    function registerVoter(
        string memory _name,  uint256 _age, bool _isEligible, bool _hasVoted) public {
        require(_age >= 18, "Age must be greater than 18");
        require(voters[msg.sender].id == 0, "Voter with this address already exists");
        voters[msg.sender] = Voter(votersAddresses.length + 1, _name, _age, _isEligible, _hasVoted);
        votersAddresses.push(msg.sender);

        //Emit the event after the voter has been added
        emit VoterRegistered(msg.sender, votersAddresses.length, _name, _age, _isEligible);
    }

    function getVotersCount() public view returns (uint256) {
        return votersAddresses.length;
    }

    //Checking eligibility
    function isVoterRegistered(address _votersAddresses) public view returns (bool) {
        return voters[_votersAddresses].isEligible;
    }

    //Checking if has voted
    function hasVoted(address _voterAddress) public view returns (bool) {
        return voters[_voterAddress].hasVoted;
    }
}