// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DwavesToken is ERC20, ERC20Burnable, ERC20Capped, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 public immutable initial_supply = 4e8 * 10**super.decimals();

    string private constant _NAME = "Dwaves";
    string private constant _SYMBOL = "VIBES";
    uint256 private immutable _cap = 1e9 * 10**super.decimals();

    constructor(address dwavesBank) ERC20(_NAME, _SYMBOL) ERC20Capped(_cap) {
        _mint(dwavesBank, initial_supply);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function batchMint(address[] calldata to_list, uint256[] calldata amounts)
        external
    {
        _preValidateBatchMint(to_list, amounts);
        _batchMint(to_list, amounts);
    }

    function _mint(address account, uint256 amount)
        internal
        override(ERC20, ERC20Capped)
    {
        super._mint(account, amount);
    }

    function _preValidateBatchMint(
        address[] calldata to_list,
        uint256[] calldata amounts
    ) internal view onlyRole(MINTER_ROLE) {
        require(
            to_list.length == amounts.length,
            "DwavesToken: addresses and amounts do not have same length"
        );
    }

    function _batchMint(address[] calldata to_list, uint256[] calldata amounts)
        internal
    {
        for (uint256 i = 0; i < to_list.length; i++) {
            _mint(to_list[i], amounts[i]);
        }
    }
}
