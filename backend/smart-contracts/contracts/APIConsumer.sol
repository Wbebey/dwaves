// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract APIConsumer is ChainlinkClient, ConfirmedOwner {
    bytes32 private getUint256JobId;
    uint256 private getUint256Fee;

    uint256 public totalListenings;

    constructor(
        address oracleAddress,
        address linkAddress,
        bytes32 _getUint256JobId,
        uint256 _getUint256Fee
    ) ConfirmedOwner(msg.sender) {
        setChainlinkOracle(oracleAddress);
        setChainlinkToken(linkAddress);
        getUint256JobId = _getUint256JobId;
        getUint256Fee = _getUint256Fee;
    }

    function getMusicLikes() public view {
        Chainlink.Request memory req = buildChainlinkRequest(
            getUint256JobId,
            address(this),
            this.fulfill.selector
        );
    }

    function fulfill(bytes32 _requestId, uint256 _totalListenings)
        public
        recordChainlinkFulfillment(_requestId)
    {
        totalListenings = _totalListenings;
    }
}
