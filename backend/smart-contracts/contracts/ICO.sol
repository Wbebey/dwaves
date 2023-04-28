// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {DwavesToken} from "./DwavesToken.sol";

contract ICO is AccessControl {
    using SafeMath for uint256;

    // TARGET: 1 VIBES ~= 1$
    // X VIBES = X ETH * RATE
    // RATE = ETH IN $ * (1 - DISCOUNT)
    // DICSOUNT = 30%
    // => RATE ~= 1300 / 0.7 ~= 1860
    uint256 public constant RATE = 1860;
    bytes32 public constant LIMITER_ROLE = keccak256("LIMITER_ROLE");

    uint256 public immutable cap;
    uint256 public immutable individual_cap;

    mapping(address => uint256) public contributions;
    mapping(address => uint256) public caps;

    DwavesToken public token;
    address payable public dwavesBank;
    uint256 public weiRaised;
    uint256 public openingTime;
    uint256 public closingTime;

    event TokenPurchase(
        address indexed purchaser,
        address indexed investor,
        uint256 value,
        uint256 amount
    );

    modifier onlyWhileOpen() {
        require(isOpen(), "ICO: not open");
        _;
    }

    constructor(
        DwavesToken token_,
        address payable dwavesBank_,
        uint256 openingTime_,
        uint256 closingTime_
    ) {
        require(address(token_) != address(0), "ICO: token is zero address");
        require(dwavesBank_ != address(0), "ICO: dwavesBank is zero address");
        require(
            openingTime_ >= block.timestamp,
            "ICO: opening time is before current time"
        );
        require(
            closingTime_ >= openingTime_,
            "ICO: opening time is not before closing time"
        );

        token = token_;
        dwavesBank = dwavesBank_;
        openingTime = openingTime_;
        closingTime = closingTime_;

        uint8 decimals = token_.decimals();
        // cap = 25% * VIBES_cap = 0.25 * 1e9 = 2.5e8 (* decimals)
        cap = 2.5e8 * 10**decimals;
        // individual_cap = 0.1% * VIBES_cap = 1e-3 * 1e9 = 1e6 (* decimals)
        individual_cap = 1e6 * 10**decimals;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    receive() external payable {
        buyTokens(msg.sender);
    }

    function capReached() external view returns (bool) {
        return weiRaised >= cap;
    }

    function hasClosed() external view returns (bool) {
        return block.timestamp > closingTime;
    }

    function setGroupCap(address[] calldata investors)
        external
        onlyRole(LIMITER_ROLE)
    {
        for (uint256 i = 0; i < investors.length; i++) {
            caps[investors[i]] = individual_cap;
        }
    }

    function remainingTokens() external view returns (uint256) {
        return
            Math.min(
                token.balanceOf(dwavesBank),
                token.allowance(dwavesBank, address(this))
            );
    }

    function isOpen() public view returns (bool) {
        return block.timestamp >= openingTime && block.timestamp <= closingTime;
    }

    function buyTokens(address investor) public payable {
        uint256 weiAmount = msg.value;

        _preValidatePurchase(investor, weiAmount);

        uint256 tokenAmount = _getTokenAmount(weiAmount);
        weiRaised = weiRaised.add(weiAmount);

        _processPurchase(investor, tokenAmount);
        emit TokenPurchase(msg.sender, investor, weiAmount, tokenAmount);

        _updatePurchasingState(investor, weiAmount);

        _forwardFunds();
    }

    function _setUserCap(address investor) internal {
        caps[investor] = individual_cap;
    }

    function _getTokenAmount(uint256 weiAmount)
        internal
        pure
        returns (uint256)
    {
        return weiAmount.mul(RATE);
    }

    function _preValidatePurchase(address investor, uint256 weiAmount)
        internal
        onlyWhileOpen
    {
        require(investor != address(0), "ICO: investor is the zero address");
        require(weiAmount != 0, "ICO: wei amount is 0");
        require(weiRaised.add(weiAmount) <= cap, "ICO: cap exceeded");

        if (caps[investor] == 0) {
            _setUserCap(investor);
        }

        require(
            contributions[investor].add(weiAmount) <= caps[investor],
            "ICO: investor's cap exceeded"
        );
    }

    function _processPurchase(address investor, uint256 tokenAmount) internal {
        token.transferFrom(dwavesBank, investor, tokenAmount);
    }

    function _updatePurchasingState(address investor, uint256 weiAmount)
        internal
    {
        contributions[investor] = contributions[investor].add(weiAmount);
    }

    function _forwardFunds() internal {
        dwavesBank.transfer(msg.value);
    }
}
