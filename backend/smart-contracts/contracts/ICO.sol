// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {DwavesToken} from "./DwavesToken.sol";

contract ICO {
    using SafeMath for uint256;

    DwavesToken token;
    address payable wallet;
    uint256 rate;
    uint256 cap;
    uint256 weiRaised;

    event TokenPurchase(
        address indexed purchaser,
        address indexed investor,
        uint256 value,
        uint256 amount
    );

    constructor(
        DwavesToken _token,
        address payable _wallet,
        uint256 _rate,
        uint256 _cap
    ) {
        require(_wallet != address(0));
        require(_rate > 0);
        require(_cap > 0);

        token = _token;
        wallet = _wallet;
        rate = _rate;
        cap = _cap;
    }

    receive() external payable {
        buyTokens(msg.sender);
    }

    function buyTokens(address _investor) public payable {
        uint256 weiAmount = msg.value;

        require(_investor != address(0));
        require(weiAmount != 0);
        require(weiRaised.add(weiAmount) <= cap);

        uint256 tokens = weiAmount.mul(rate);
        weiRaised = weiRaised.add(weiAmount);

        token.transfer(_investor, tokens);
        emit TokenPurchase(msg.sender, _investor, weiAmount, tokens);
        wallet.transfer(weiAmount);
    }

    function capReached() external view returns (bool) {
        return weiRaised >= cap;
    }
}
