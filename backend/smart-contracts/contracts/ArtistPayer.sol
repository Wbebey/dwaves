// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./DwavesToken.sol";

contract ArtistPayer is AccessControl {
    using SafeMath for uint256;

    bytes32 public constant PAYER_ROLE = keccak256("PAYER_ROLE");
    uint256 public immutable rate;
    DwavesToken public token;

    event TokenPayments(address[] addresses, uint256[] amounts);

    constructor(DwavesToken token_) {
        require(
            address(token_) != address(0),
            "ArtistPayer: token is zero address"
        );

        // 0.06 * token decimals
        rate = 6 * 10**(token_.decimals() - 2);
        token = token_;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function payArtists(
        address[] calldata artistAddresses,
        uint256[] calldata listenings
    ) external {
        _preValidatePayments(artistAddresses, listenings);

        uint256[] memory amounts = _calculateAmounts(
            artistAddresses,
            listenings
        );

        _processPayments(artistAddresses, amounts);
        emit TokenPayments(artistAddresses, amounts);
    }

    function _preValidatePayments(
        address[] calldata artistAddresses,
        uint256[] calldata listenings
    ) internal view onlyRole(PAYER_ROLE) {
        require(
            artistAddresses.length == listenings.length,
            "ArtistPayer: addresses and listenings have different lengths"
        );
    }

    function _calculateAmounts(
        address[] calldata artistAddresses,
        uint256[] calldata listenings
    ) internal view returns (uint256[] memory) {
        uint256[] memory amounts = new uint256[](listenings.length);
        for (uint256 i = 0; i < artistAddresses.length; i++) {
            amounts[i] = _getTokenAmount(listenings[i]);
        }

        return amounts;
    }

    function _getTokenAmount(uint256 listenings)
        internal
        view
        returns (uint256)
    {
        return listenings.mul(rate);
    }

    function _processPayments(
        address[] calldata artistAddresses,
        uint256[] memory amounts
    ) internal {
        token.batchMint(artistAddresses, amounts);
    }
}
