// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract CandidateManagement {

    // Candidate sctructure
    struct Candidate { uint id; string name; string party; uint voteCount; bool isActive;}

    //Mapping List of cadidates
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    address public owner; //Access control modifier - restrict admin functions

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Admin can peform this action!");
        _;
    }

    constructor() {
        owner = msg.sender;
        candidatesCount = 0; 
    }

    //Candidates function
    //New cadidate
    function addCandidate(string memory _name, string memory _party) public onlyOwner {
        candidatesCount++; // Increase candidate count
        candidates[candidatesCount] = Candidate({ id: candidatesCount, name: _name, party: _party, voteCount:0, isActive: true});
    }

    //Remove candidate
    function removeCandidate(uint _candidateId) public onlyOwner {
        require (_candidateId > 0 && _candidateId <= candidatesCount, "Remove function: Candidate does not exist.");
        candidates[_candidateId].isActive= false;  //isActive flag error
    }

    //Get candidate (public)
    function getCandidate(uint _candidateId) public view returns (Candidate memory){
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Get Function: Candidate does not exist.");
        return candidates[_candidateId];
    }

    //Record a vote for a cadidate
    function recordVote(uint _candidateId) public {
        require(_candidateId > 0 && _candidateId <=  candidatesCount, "Record function: Invalid candidate!");
        candidates[_candidateId].voteCount++; //Increse vote count - selected candidate
    }

    //Get number of votes of a candidate
    function getCandidateCount() public view returns (uint){
        return  candidatesCount;
    }

    //Extra functions
    //Update Candidate information
    function updateCandidate (
        uint _candidateId, 
        string memory _newName,
        string memory _newParty,
        bool _newIsActive ) public onlyOwner {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Update Function: Candidate does not exist.");
        Candidate storage candidate = candidates[_candidateId];
        candidate.name = _newName;
        candidate.party = _newParty;
        candidate.isActive = _newIsActive;
    }

    //List of all candidates
    function listAllCandidates() public view returns (Candidate[] memory){
        Candidate[] memory candidateList = new Candidate[](candidatesCount);
        for  (uint i = 1; i <= candidatesCount; i++) {
            candidateList[i - 1] = candidates[i];
        }
        return candidateList;
    }
}