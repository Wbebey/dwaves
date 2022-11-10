// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Library for logging
import "hardhat/console.sol";
// Library for incrementation
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMusic is ERC721URIStorage {

    using Counters for Counters.Counter;

    uint public count;

    // Latest minted tokenId
    Counters.Counter private _tokenIds;

    // Track number of items sold on the marketplace
    Counters.Counter private _itemsSold;

    // "owner" is the contract address that created the smart contract
    address payable owner;

    // Fee charged by the marketplace
    uint256 listPrice = 0.01 ether;

    // Structure to store information about a listed token
    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        bool currentlyListed;
    }

    // Event emitted when a token is successfully listed
    event TokenListedSuccess(
        uint256 indexed tokenId,
        address owner,
        bool currentlyListed
    );

    // Mapping tokenId to token info & retrieve details about a tokenId
    mapping(uint256 => ListedToken) private idToListedToken;

    constructor() ERC721("NFTMusic", "NFTM") {
        owner = payable(msg.sender);
    }

    // Function to get the current count
    function get() public view returns (uint) {
        return count;
    }

    // Function to increment count by 1
    function inc() public {
        count += 1;
    }


    function getLatestIdToListedToken()
    public
    view
    returns (ListedToken memory)
    {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    function getListedTokenForId(uint256 tokenId)
    public
    view
    returns (ListedToken memory)
    {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    // First time a token is created, it is listed here
    function createToken(string memory tokenURI)
    public
    payable
    returns (uint256)
    {
        // Increment the tokenId counter, which track number of minted NFTs
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        // Mint the NFT with tokenId newTokenId to the address who called createToken
        _safeMint(msg.sender, newTokenId);

        // Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(newTokenId, tokenURI);

        // Helper function to update Global variables and emit an event
        createListedToken(newTokenId);

        return newTokenId;
    }

    function createListedToken(uint256 tokenId) private {
        // Update the mapping of tokenId's to token details
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(address(this)),
            true
        );

        _transfer(msg.sender, address(this), tokenId);

        // Emit event for successful transfer
        emit TokenListedSuccess(
            tokenId,
            address(this),
            true
        );
    }

    // Return all the NFTs currently listed to be sold on the marketplace
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint256 nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint256 currentIndex = 0;
        uint256 currentId;

        for (uint256 i = 0; i < nftCount; i++) {
            currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }

        // 'tokens' has the list of all NFTs in the marketplace
        return tokens;
    }

    // Return all NFTs that the current user is owner or seller in
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;
        uint256 currentId;

        // Get a count of all NFTs that belong to the user
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender
            ) {
                itemCount += 1;
            }
        }

        // Create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender
            ) {
                currentId = i + 1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

}
