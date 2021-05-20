const Ballot = artifacts.require('Ballot')

module.exports = function (deployer, network, accounts) {
  const proprosals = [
    web3.utils.asciiToHex('plan1'), // represents bytes32 in solidity
    web3.utils.asciiToHex('plan2'),
    web3.utils.asciiToHex('plan3'),
  ]
  deployer.deploy(Ballot, proprosals)
}
