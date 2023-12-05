const { expect } = require("chai");

const CandidateManagement = artifacts.require("CandidateManagement");


contract("CandidateManagement", accounts => {
    let candidateManagementInstance;
    const owner = accounts[0];
    const notOwner = accounts[1];

    beforeEach(async () => {
        candidateManagementInstance = await CandidateManagement.new();
    });

    // Test 1: Add a candidate

    it("Test 1: Should add a candidate", async () => {
        const name = "John Doe";
        const party = "Independent";

        await candidateManagementInstance.addCandidate(name, party, {from: owner});
        const candidate = await candidateManagementInstance.candidates(1);
        expect(candidate.name).to.equal(name, "The name of the candidate is not correct");
        expect(candidate.party).to.equal(party, "The party of the candidate is not correct");
    });

    // Test 2: Update a candidate
    it("Test 2: Should update a candidate", async () => {
        const name = "John Doe";
        const party = "Independent";

        await candidateManagementInstance.addCandidate(name, party, {from: owner});//add the candidate

        //Update the candidate ID 
        let newName = "Michael D Higgins";
        let newParty = "Labour";

        await candidateManagementInstance.updateCandidate(1, newName, newParty, {from: owner});
        const candidate = await candidateManagementInstance.candidates(1);
        expect(candidate.name).to.equal(newName, "The name of the candidate is not correct");
        expect(candidate.party).to.equal(newParty, "The party of the candidate is not correct");
    });

    // Test 3: Prevent a candidate from being added by a non-owner
    it("Test 3: Should prevent a candidate from being added by a non-owner", async () => {
        const name = "Michael D Higgins";
        const party = "Labour";

        try {
            await candidateManagementInstance.addCandidate(name, party, {from: notOwner});
            assert.fail("The contract did not throw as expected.");
        } catch (err) {
            assert.include(err.message, "revert", "The error message should contain 'revert'.");
        }
    });

    // Test 4: Get a candidate
    it("Test 4: Should get a candidate", async () => {
        const name = "Michael D Higgins";
        const party = "Labour";

        await candidateManagementInstance.addCandidate(name, party, {from: owner});
        const candidate = await candidateManagementInstance.getCandidate(1);
        expect(candidate.name).to.equal(name, "The name of the candidate is not correct");
        expect(candidate.party).to.equal(party, "The party of the candidate is not correct");
    });

    // Test 5: Record a vote for a candidate
    it("Test 5: Should record a vote for a candidate", async () => {
        const name = "Michael D Higgins";
        const party = "Labour";

        await candidateManagementInstance.addCandidate(name, party, {from: owner});
        await candidateManagementInstance.recordVote(1, {from: owner});
        const candidate = await candidateManagementInstance.candidates(1);
        expect(candidate.voteCount.toNumber()).to.equal(1, "The vote count for the candidate is not correct");
    });

    // Test 6: List all candidates
    it("Test 6: Should list all candidates", async () => {
        const name = "Michael D Higgins";
        const party = "Labour";

        await candidateManagementInstance.addCandidate(name, party, {from: owner});
        const candidate = await candidateManagementInstance.candidates(1);
        expect(candidate.name).to.equal(name, "The name of the candidate is not correct");
        expect(candidate.party).to.equal(party, "The party of the candidate is not correct");
    });
    // Test 7: Remove a candidate
    it("Test 7: Should remove a candidate", async () => {
        const name = "Michael D Higgins";
        const party = "Labour";

        await candidateManagementInstance.addCandidate(name, party, {from: owner}); //add the candidate
        await candidateManagementInstance.removeCandidate(1, {from: owner}); //remove the candidate
        const candidate = await candidateManagementInstance.candidates(1); // get the candidate
        expect(candidate.isActive).to.equal(false, "The candidate is still active"); //check the candidate
    });

    // Test 8: Only the owner can remove, add or update a candidate
    it("Test 8: Should prevent a candidate from being removed by a non-owner", async () => {
        const name = "Michael D Higgins";
        const party = "Labour";

        //call the addCandidate function
        await candidateManagementInstance.addCandidate(name, party, {from: owner});

        try {
            await candidateManagementInstance.removeCandidate(1, {from: notOwner});
            assert.fail("The contract did not throw as expected.");
        } catch (err) {
            assert.include(err.message, "revert", "The error message should contain 'revert'.");
        }
    });

    // Test 9: Get candidates count
    it("Test 9: Should get candidates count", async () => {
        const name = "Michael D Higgins";
        const party = "Labour";

        await candidateManagementInstance.addCandidate(name, party, {from: owner});// add the candidate
        const count = await candidateManagementInstance.getCandidateCount(); //get the count
        expect(count.toNumber()).to.equal(1, "The count of the candidates is not correct"); //check the candidate
    });

});