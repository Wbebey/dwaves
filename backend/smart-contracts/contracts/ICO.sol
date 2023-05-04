// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {DwavesToken} from "./DwavesToken.sol";

contract ICO {
    using SafeMath for uint256;

    DwavesToken token;
    uint256 rate;
    address payable wallet;
    uint256 weiRaised;

    event TokenPurchase(
        address indexed purchaser,
        address indexed investor,
        uint256 value,
        uint256 amount
    );

    constructor(
        uint256 _rate,
        address payable _wallet,
        DwavesToken _token
    ) {
        require(_rate > 0);
        require(_wallet != address(0));

        rate = _rate;
        wallet = _wallet;
        token = _token;
    }

    receive() external payable {
        buyTokens(msg.sender);
    }

    function buyTokens(address _investor) public payable {
        uint256 weiAmount = msg.value;

        require(_investor != address(0));
        require(weiAmount != 0);

        uint256 tokens = weiAmount.mul(rate);
        weiRaised = weiRaised.add(weiAmount);

        token.transfer(_investor, tokens);
        emit TokenPurchase(msg.sender, _investor, weiAmount, tokens);
        wallet.transfer(weiAmount);
    }
}
