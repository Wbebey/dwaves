// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {DwavesToken} from "./DwavesToken.sol";

contract ArtistPayer {
    uint256 tokens_per_listening;
    DwavesToken token;

    constructor(DwavesToken _token) {
        token = _token;
        tokens_per_listening = (6 * token.decimals()) / 10**2;
    }

    function payArtists(
        address[] calldata artistAddresses,
        uint256[] calldata listenings
    ) external {
        require(artistAddresses.length == listenings.length);

        uint256[] memory amounts;
        for (uint256 i = 0; i < artistAddresses.length; i++) {
            amounts[i] = listenings[i] * tokens_per_listening;
        }

        token.batchMint(artistAddresses, amounts);
    }
}
