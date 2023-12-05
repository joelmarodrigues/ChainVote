//Reference: https://trufflesuite.com/docs/truffle/how-to/debug-test/write-tests-in-javascript/

const { assert } = require('chai');

const VoterRegistration = artifacts.require("VoterRegistration");

//Test 1: Register a voter
contract("VoterRegistration", accounts => {
    it("Test 1: Should register a voter", async () => {
        const voterRegistrationInstance = await VoterRegistration.deployed();
        const name = "Catrionna";
        const age = 51;
        const isEligible = true;
        const hasVoted = false;

        await voterRegistrationInstance.registerVoter(name, age, isEligible, hasVoted, {from: accounts[0]});

        const voter = await voterRegistrationInstance.voters(accounts[0]);
        assert.strictEqual(voter.name, name, "The voter was not registered.");
        assert.strictEqual(voter.age.toNumber(), age, "The voter was not registered.");
        assert.strictEqual(voter.isEligible, isEligible, "The voter was not registered.");
        assert.strictEqual(voter.hasVoted, hasVoted, "The voter was not registered.");

    });

 // Test 2: Prevent a voter from registering twice
    it("Test 2: Should prevent a voter from registering twice", async () => {
        const voterRegistrationInstance = await VoterRegistration.deployed();
        const name = "Catrionna";
        const age = 51;
        const isEligible = true;
        const hasVoted = false;

        try {
            await voterRegistrationInstance.registerVoter(name, age, isEligible, hasVoted, {from: accounts[0]});
            assert.fail("The contract did not throw as expected.");
        } catch (err) {
            assert.include(err.message, "revert", "The error message should contain 'revert'.");
        }
    });

    // Test 3: Prevent a voter from registering if they are not eligible
    it("Test 3: Should prevent a voter from registering if they are not eligible", async () => {
        const voterRegistrationInstance = await VoterRegistration.deployed();
        const name = "Anna";
        const age = 17;
        const isEligible = false;
        const hasVoted = false;

        try {
            await voterRegistrationInstance.registerVoter(name, age, isEligible, hasVoted, {from: accounts[1]});
            assert.fail("The contract did not throw as expected.");
        } catch (err) {
            assert.include(err.message, "revert", "The error message should contain 'revert'.");
        }
    });
});