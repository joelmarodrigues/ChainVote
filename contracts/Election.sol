// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VoterRegistration.sol";
import "./CandidateManagement.sol";

contract Election {
    struct ElectionDetails { string electionName; uint256 startTime; uint256 endTime; bool finalized;}

    mapping(uint256 => ElectionDetails) public elections;

    VoterRegistration public voterRegistration;
    CandidateManagement public candidateManagement;
    ElectionDetails public electionDetails;

    //Events
    //msg when a new election is created and provides the details
    event ElectionCreated( string electionName, uint256 startTime, uint256 endTime); 
    event Vote(address indexed voter, uint256 cadidateId); //when vote is casted sends a msg with voter details
    event ElectionFinalized(uint256[] voteCounts); //msg when the election is over and the final votes count
    
    //Modifiers
    //Access control modifier: ensure only owner can call the function
    address public owner; 
    modifier onlyOwner() { 
        require(msg.sender == owner, "Only Admin can peform this action!"); 
    _; 
    }

    constructor() {owner = msg.sender;}

    //Restrictions:
    //Checks if the current time is in the election's start and end timeframe.
    modifier duringElection() {
        require(block.timestamp >= electionDetails.startTime && block.timestamp <= electionDetails.endTime,"Election is NOT active.");
        _;
    }
    //Checks if the current time is after the election's end time.
    modifier afterElection() {
        require(block.timestamp > electionDetails.endTime, "Election is STILL active.");
        _;
    }

    //Functions
    //Use initialize instead of constructors (cost related)
    function initialize(address _voterRegistrationAddress,address _candidateManagementAddress) public {
        require(_voterRegistrationAddress != address(0) &&
                _candidateManagementAddress != address(0),"Invalid Address.");
        require(address(voterRegistration) == address(0) &&
                address(candidateManagement) == address(0),"Contract already initialized.");

        voterRegistration = VoterRegistration(_voterRegistrationAddress);
        candidateManagement = CandidateManagement(_candidateManagementAddress);
        electionDetails.finalized = false;
    }

    //Configuration of the new election (name, star and end time)
    function createElection(
        string memory _electionName,
        uint256 _statTime,
        uint256 _endTime
    ) public onlyOwner {
        require(_statTime < _endTime, "Start time must be before end time.");
        require(_endTime > block.timestamp, "End time must be in the future");

        electionDetails.electionName = _electionName;
        electionDetails.startTime = _statTime;
        electionDetails.endTime = _endTime;

        emit ElectionCreated(_electionName, _statTime, _endTime); //Emit
    }

    //To handle the voting process (registered voter during active election)
    function vote(uint256 _candidateId) public duringElection {
        require(voterRegistration.isVoterRegistered(msg.sender),"Voter is not registered.");
        require(!voterRegistration.hasVoted(msg.sender),"Voter has already voted.");

        candidateManagement.recordVote(_candidateId); //Record the vote in CandidateManagment contract
        voterRegistration.isVoterRegistered(msg.sender); //Mark the  voter as hasVoted=true in VoterRegistration
    }

    //To finish the election and after tally votes
    function finalizeElection() public onlyOwner afterElection {
        require(!electionDetails.finalized, "Election has already been finalized.");
        uint256 candidatesCount = candidateManagement.getCandidateCount();
        uint256[] memory voteCounts = new uint256[](candidatesCount);

    //Get the vote count for each candidate
        for (uint256 i = 1; i < candidatesCount; i++) {
            CandidateManagement.Candidate memory candidate = candidateManagement.getCandidate(i);
            voteCounts[i - 1] = candidate.voteCount;
        }
        electionDetails.finalized = true;
        emit ElectionFinalized(voteCounts);
}

    //Returns the winner's ID
    //Only callable after the election has been finalized
    function getWinner() public view returns (uint256) {
        require(electionDetails.finalized, "Election has not been finalized.");

        uint256 candidatesCount = candidateManagement.getCandidateCount();
        uint256 winnerId = 1;
        uint256 winnerVoteCount = 0;

        //Loop through all candidates to find the winner
        for (uint256 i = 1; i <= candidatesCount; i++) {
            CandidateManagement.Candidate memory candidate = candidateManagement
                .getCandidate(i);
            if (candidate.voteCount > winnerVoteCount) {
                winnerId = candidate.id;
                winnerVoteCount = candidate.voteCount;
            }
        }
        return winnerId;
    }

    // Returns an array of vote counts for each candidate
    // Only callable after the election has been finalized
    function getResults() public view returns (uint256[] memory) {
        require(electionDetails.finalized, "Election has not been finalized.");

    uint256 candidatesCount = candidateManagement.getCandidateCount();
    uint256[] memory voteCounts = new uint256[](candidatesCount);

    // Loop through all candidates to get the vote counts
    for (uint256 i = 1; i <= candidatesCount; i++) {
        CandidateManagement.Candidate memory candidate = candidateManagement.getCandidate(i);
        voteCounts[i - 1] = candidate.voteCount;
    }

    return voteCounts;
    }
}