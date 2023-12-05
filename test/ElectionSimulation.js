// Import the necessary files
const Election = artifacts.require("Election");
const VoterRegistration = artifacts.require("VoterRegistration");
const CandidateManagement = artifacts.require("CandidateManagement");

contract( "Election Simulation", accounts => {
    let election, voterRegistration, candidateManagement; // Declare global variables

    before(async () => {
        //Deploy contracts
        voterRegistration = await VoterRegistration.new();
        candidateManagement = await CandidateManagement.new();
        election = await Election.new();

        //Initialize contracts
        await election.initialize(voterRegistration.address, candidateManagement.address);
    });

    // Test: Simulate an election
    it("Test 1: Simulate an election", async () => {
        // Declare variables
        const owner = accounts[0];
        const voter = accounts[2];
        const voter2 = accounts[3]; 

        //1. Add candidates
        console.log("1. Adding candidates");
        console.log();
        await candidateManagement.addCandidate("Michael D Higgins", "Labour", {from: owner});
        const candidateId1 = (await candidateManagement.candidatesCount()).toNumber(); // Get candidate 1 ID
        const addedCandidate1 = await candidateManagement.getCandidate(candidateId1);  //Validate candidate details
        await candidateManagement.addCandidate("Peter Casey", "Independent", {from: owner});
        const candidateId2 = (await candidateManagement.candidatesCount()).toNumber(); // Get candidate 2 ID
        const addedCandidate2 = await candidateManagement.getCandidate(candidateId2); //Validate candidate 2details
        console.log("Candidate Details");
        console.log("Added candidate 1:", addedCandidate1);
        console.log("Added candidate 2:", addedCandidate2);
        console.log();

        //2. Register voters
        console.log("2. Registering voters");
        console.log();
        await voterRegistration.registerVoter("Anna", 22, true, false, {from: voter});
        await voterRegistration.registerVoter("Catrionna", 51, true, false, {from: voter2});
        console.log("Voter Details");
        const voterDetails = await voterRegistration.voters(voter); // Get voter details
        const voterDetails2 = await voterRegistration.voters(voter2); // Get voter details
        console.log();

        //3. Create election
        console.log("3. Creating election");
        console.log();
        const currentBlockTime = (await web3.eth.getBlock("latest")).timestamp; // Get current block time (in seconds
        const startTime = currentBlockTime; // Current time
        const endTime = startTime + 60; // 1 minutes from now
        await election.createElection("2018 Irish Presidential Election", startTime, endTime, {from: owner});
        console.log("Election Details"); // Get election details
        const electionDetails = await election.electionDetails();
        console.log();

        /*Important: The voting contract must be deployed after the election contract when the start time is current time
         * Cast votes immediately*/
        // 4. Cast votes
        console.log("4. Casting votes");
        console.log();
        console.log("Vote casted by voter 1");
        await election.vote(candidateId1, {from: voter});
        console.log("Vote casted by voter 2");
        await election.vote(candidateId1, {from: voter2});
        console.log();

        // 5. Wait for election to end
        console.log("5. Waiting for election to end");
        console.log();
        await new Promise((resolve, reject) => {
            web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [61]}, (err, result) => {
                if (err) { return reject(err); }
                resolve(result);
            });
        });
        await new Promise((resolve, reject) => {
            web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0}, (err, result) => {
                if (err) { return reject(err); }
                resolve(result);
            });
        });
        console.log("Election ended"); // Election ended
        console.log();

    // 6. Finalize election
    console.log("6. Finalizing election");
    console.log();
    await election.finalizeElection({from: owner});
    console.log("Election finalized");
    console.log();

    // 7. Get results
    console.log("7. Getting results");
    console.log();
    const results = await election.getResults();
    console.log("Election results:", results);
    console.log();

    // 8. Get winner
    console.log("8. Getting winner");
    console.log();
    const winner = await election.getWinner();
    console.log("Election winner:", winner);
    console.log();
    });
});