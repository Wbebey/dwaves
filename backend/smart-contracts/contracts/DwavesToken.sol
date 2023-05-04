// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DwavesToken is ERC20 {
    string constant NAME = "Dwaves";
    string constant SYMBOL = "VIBES";
    uint8 constant DECIMALS = 18;
    uint256 constant INITIAL_SUPPLY = 300_000_000 * 10**DECIMALS;

    constructor() ERC20(NAME, SYMBOL) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
