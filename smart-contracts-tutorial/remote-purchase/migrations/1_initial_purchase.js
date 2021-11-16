const Purchase = artifacts.require('Purchase')

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Purchase)
}
