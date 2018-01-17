var ProxyICOMigrations = artifacts.require("./ProxyICO.sol");

module.exports = function(deployer) {
  deployer.deploy(ProxyICOMigrations);
};
