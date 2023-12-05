const ElectionSimulation = artifacts.require("ElectionSimulation");

module.exports = function(deployer) {
    deployer.deploy(ElectionSimulation);
    };