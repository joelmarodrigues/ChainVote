//Reference: https://trufflesuite.com/docs/truffle/how-to/contracts/run-migrations/

// 1. Run truffle migrate --reset
const Migrations = artifacts.require("Migrations");
   
module.exports = function (deployer) {
  deployer.deploy(Migrations);
};