const Purchase = artifacts.require('Purchase')

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Purchase, {
    from: accounts[1],
    value: 1e18,
    overwrite: false,
  })
}
