const VoterRegistration = artifacts.require("VoterRegistration");

module.exports = function(deployer) {
  deployer.deploy(VoterRegistration);
  // Repeat the pattern below for additional contracts
  // deployer.deploy(OtherContract);
};
