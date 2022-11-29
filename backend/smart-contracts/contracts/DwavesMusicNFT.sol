// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DwavesMusicNFT is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    AccessControl
{
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string private constant _NAME = "Dwaves Authentic Music NFT";
    string private constant _SYMBOL = "DAMN";

    Counters.Counter private _tokenIds;

    constructor() ERC721(_NAME, _SYMBOL) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mint(address artistAddress, string calldata musicCID)
        external
        onlyRole(MINTER_ROLE)
        returns (uint256)
    {
        _tokenIds.increment(); // NFT IDs start at 1

        uint256 tokenId = _tokenIds.current();
        _safeMint(artistAddress, tokenId);
        _setTokenURI(tokenId, musicCID);

        return tokenId;
    }

    function getAllTokens() external view returns (uint256[] memory) {
        uint256 NFTCount = totalSupply();
        uint256[] memory NFTList = new uint256[](NFTCount);

        for (uint256 i = 0; i < NFTCount; i++) {
            NFTList[i] = tokenByIndex(i);
        }

        return NFTList;
    }

    function getMyTokens() external view returns (uint256[] memory) {
        return getTokensByAddress(msg.sender);
    }

    function getTokensByAddress(address user)
        public
        view
        returns (uint256[] memory)
    {
        uint256 NFTCount = balanceOf(user);
        uint256[] memory NFTList = new uint256[](NFTCount);

        for (uint256 i = 0; i < NFTCount; i++) {
            NFTList[i] = tokenOfOwnerByIndex(user, i);
        }

        return NFTList;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }
}
