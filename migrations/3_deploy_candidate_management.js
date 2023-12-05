const CandidateManagement = artifacts.require("CandidateManagement");

module.exports = function(deployer) {
  deployer.deploy(CandidateManagement);
};
