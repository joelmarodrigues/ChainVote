const { expect } = require("chai");
const Election = artifacts.require("Election");
const VoterRegistration = artifacts.require("VoterRegistration");
const CandidateManagement = artifacts.require("CandidateManagement");

contract("Election", accounts => {
    let election, voterRegistration, candidateManagement;
    const owner = accounts[0];

    beforeEach(async () => {
        voterRegistration = await VoterRegistration.new();
        candidateManagement = await CandidateManagement.new();
        election = await Election.new();
        await election.initialize(voterRegistration.address, candidateManagement.address);
    });
    //Test 1: Initialize correctly
    it("Test 1 : initialize correctly", async () => {
        assert.equal(await election.voterRegistration(), voterRegistration.address);
        assert.equal(await election.candidateManagement(), candidateManagement.address);
    });
    //Test 2: Create an election
    it("Test 2: create an election", async () => {
    const electionName = "Presidential Election";
    const startTime = Math.floor(Date.now() / 1000) + 60; // 60 seconds from now
    const endTime = startTime + 60 * 60; // 1 hour from now

    await election.createElection(electionName, startTime, endTime, {from: owner});

    const electionDetails = await election.electionDetails();

    assert.equal(electionDetails.electionName, electionName, "Election name is incorrect");
    assert.equal(electionDetails.startTime, startTime, "Start time is incorrect");
    assert.equal(electionDetails.endTime, endTime, "End time is incorrect");
    });

    //Test 3: During the election, voters can cast their votes.
    it("Test 3: cast a vote", async () => {
        it("Test 3: cast a vote", async () => {
            const voter = accounts[0];
            const candidate = accounts[1];
            await voterRegistration.registerVoter("Anna", 22, true, false, {from: voter});
            await candidateManagement.addCandidate("John Doe", "Independent", {from: owner});
            const startTime = Math.floor(Date.now() / 1000) - 60; // 1 minute ago
            const endTime = startTime + 60 * 60; // 1 hour from start time
            await election.createElection("Count Council Election", startTime, endTime, {from: owner});
            await election.vote(candidate, {from: voter});
            const candidateInfo = await candidateManagement.candidates(candidate);
            assert.equal(candidateInfo.voteCount, 1);
        });
    });
});