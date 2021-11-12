const SimpleAuction = artifacts.require('SimpleAuction')
const AuctionBid = artifacts.require('AuctionBid')

module.exports = async function (deployer) {
  await deployer.deploy(
    SimpleAuction,
    10000,
    '0x29713b2938526A53c1f0c2db39EE7E1D1A9F36c2',
    { overwrite: true },
  )
  const a = await SimpleAuction.deployed()
  await deployer.deploy(AuctionBid, a.address, { overwrite: false })
}
