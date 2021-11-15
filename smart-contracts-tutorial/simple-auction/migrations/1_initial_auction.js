const SimpleAuction = artifacts.require('SimpleAuction')
const AuctionBid = artifacts.require('AuctionBid')

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(
    SimpleAuction,
    36000,
    '0x29713b2938526A53c1f0c2db39EE7E1D1A9F36c2',
  )
  const a = await SimpleAuction.deployed()
  await deployer.deploy(AuctionBid, a.address)
}
