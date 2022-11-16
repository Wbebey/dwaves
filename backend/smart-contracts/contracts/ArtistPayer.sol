// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import {DwavesToken} from "./DwavesToken.sol";

contract ArtistPayer is AccessControl {
    DwavesToken token;
    bytes32 public constant PAYER_ROLE = keccak256("PAYER_ROLE");

    event TokenPayments(address[] addresses, uint256[] amounts);

    constructor(DwavesToken _token) {
        token = _token;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function payArtists(
        address[] calldata _artistAddresses,
        uint256[] calldata _listenings
    ) external {
        _preValidatePayments(_artistAddresses, _listenings);

        uint256[] memory amounts = _calculateAmounts(
            _artistAddresses,
            _listenings
        );

        _processPayments(_artistAddresses, amounts);
        emit TokenPayments(_artistAddresses, amounts);
    }

    function _preValidatePayments(
        address[] calldata _artistAddresses,
        uint256[] calldata _listenings
    ) internal view onlyRole(PAYER_ROLE) {
        require(
            _artistAddresses.length == _listenings.length,
            "ArtistPayer: addresses and listenings do not have same length"
        );
    }

    function _calculateAmounts(
        address[] calldata _artistAddresses,
        uint256[] calldata _listenings
    ) internal view returns (uint256[] memory) {
        uint256[] memory amounts = new uint256[](_listenings.length);
        for (uint256 i = 0; i < _artistAddresses.length; i++) {
            amounts[i] = _getTokenAmount(_listenings[i]);
        }

        return amounts;
    }

    function _getTokenAmount(uint256 _listenings)
        internal
        view
        returns (uint256)
    {
        // 0.06 * token decimals
        return _listenings * 6 * (10**token.decimals() / 10**2);
    }

    function _processPayments(
        address[] calldata _artistAddresses,
        uint256[] memory _amounts
    ) internal {
        token.batchMint(_artistAddresses, _amounts);
    }
}
