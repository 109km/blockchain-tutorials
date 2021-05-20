pragma solidity >=0.4.25 <0.9.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Ballot.sol";

contract TestVoting {

  function testInitialChairpersonEqualsMsgSender() public {

    bytes32[] memory initProposals;
    initProposals = new bytes32[](3);
    initProposals[0] = "plan1";
    initProposals[1] = "plan2";
    initProposals[2] = "plan3";

    Ballot ballot = new Ballot(initProposals);

    uint expected = 3;

    Assert.equal(ballot.getProposalsNumber(), expected, "Proposals' number should be 3");
  }

  // function testInitialBalanceWithNewMetaCoin() public {
  //   MetaCoin meta = new MetaCoin();

  //   uint expected = 10000;

  //   Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 MetaCoin initially");
  // }

}
