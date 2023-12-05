// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//import contract interacting with Voting
import "./VoterRegistration.sol";
import "./CandidateManagement.sol";

contract Voting {
    VoterRegistration voterRegistration;
    CandidateManagement candidateManagement;

    //Keeping track of wether an address (voter) has voted or not
    mapping(address => bool) public hasVoted;

    //Casting vote event
    event VoteCast(address voter, uint256 candidateId);

    function initialize(
        address _voterRegistrationAddress,
        address _candidateManagementAddress
    ) public {
        require(
            _voterRegistrationAddress != address(0) &&
                _candidateManagementAddress != address(0),
            "Contract addresses cannot be 0."
        );
        //Contract addresses
        voterRegistration = VoterRegistration(_voterRegistrationAddress);
        candidateManagement = CandidateManagement(_candidateManagementAddress);
    }

    function vote(uint256 _candidateId) public {
        //Check: Is registered? Has voted yet?
        require(
            address(voterRegistration) != address(0),
            "Contract already initialized."
        );
        require(
            voterRegistration.isVoterRegistered(msg.sender),
            "Voter is not registered."
        );
        require(!hasVoted[msg.sender], "Voter has already voted.");

        //Record vote in Voter
        hasVoted[msg.sender] = true;

        //Record vote in CandidateManagement
        candidateManagement.recordVote(_candidateId);

        //Successfull vote
        emit VoteCast(msg.sender, _candidateId);
    }
}