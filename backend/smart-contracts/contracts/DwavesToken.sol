// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DwavesToken is ERC20, ERC20Burnable, AccessControl {
    string constant NAME = "Dwaves";
    string constant SYMBOL = "VIBES";
    uint8 constant DECIMALS = 18;
    uint256 constant INITIAL_SUPPLY = 300_000_000 * 10**DECIMALS;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20(NAME, SYMBOL) {
        _mint(msg.sender, INITIAL_SUPPLY);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function batchMint(address[] calldata to_list, uint256[] calldata amounts)
        external
    {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        require(to_list.length == amounts.length);

        for (uint256 i = 0; i < to_list.length; i++) {
            _mint(to_list[i], amounts[i]);
        }
    }
}
