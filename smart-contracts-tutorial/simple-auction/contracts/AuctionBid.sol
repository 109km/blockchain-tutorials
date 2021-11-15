// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4 <0.9.0;

import "./SimpleAuction.sol";

contract AuctionBid {

    SimpleAuction auctionInstance;
    /// Create a simple auction with `biddingTime`
    /// seconds bidding time on behalf of the
    /// beneficiary address `beneficiaryAddress`.
    constructor(
        address _address
    ) {
        auctionInstance = SimpleAuction(_address);
    }

    /// Bid on the auction.
    function bid() public {
        auctionInstance.bid();
    }
}