// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import {DwavesToken} from "./DwavesToken.sol";

contract ArtistPayer is AccessControl {
    uint256 public tokens_per_listening;
    DwavesToken token;
    bytes32 public constant PAYER_ROLE = keccak256("PAYER_ROLE");

    constructor(DwavesToken _token) {
        token = _token;
        tokens_per_listening = (6 * 10**token.decimals()) / 10**2;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function payArtists(
        address[] calldata artistAddresses,
        uint256[] calldata listenings
    ) external {
        require(hasRole(PAYER_ROLE, msg.sender), "Caller is not a payer");
        require(artistAddresses.length == listenings.length);

        uint256[] memory amounts = new uint256[](listenings.length);
        for (uint256 i = 0; i < artistAddresses.length; i++) {
            amounts[i] = listenings[i] * tokens_per_listening;
        }

        token.batchMint(artistAddresses, amounts);
    }
}
