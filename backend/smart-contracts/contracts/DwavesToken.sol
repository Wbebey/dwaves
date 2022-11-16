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

    constructor(address _DwavesBank) ERC20(NAME, SYMBOL) {
        _mint(_DwavesBank, INITIAL_SUPPLY);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function batchMint(address[] calldata _to_list, uint256[] calldata _amounts)
        external
    {
        _preValidateBatchMint(_to_list, _amounts);
        _batchMint(_to_list, _amounts);
    }

    function _preValidateBatchMint(
        address[] calldata _to_list,
        uint256[] calldata _amounts
    ) internal view onlyRole(MINTER_ROLE) {
        require(
            _to_list.length == _amounts.length,
            "DwavesToken: addresses and amounts do not have same length"
        );
    }

    function _batchMint(
        address[] calldata _to_list,
        uint256[] calldata _amounts
    ) internal {
        for (uint256 i = 0; i < _to_list.length; i++) {
            _mint(_to_list[i], _amounts[i]);
        }
    }
}
