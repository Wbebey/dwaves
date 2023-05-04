// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {DwavesToken} from "./DwavesToken.sol";

contract ConcertTicketNFT is
    ERC721,
    ERC721Burnable,
    ERC721Enumerable,
    AccessControl
{
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string private constant _NAME = "Dwaves Concert Ticket NFT";
    string private constant _SYMBOL = "DCTN";

    Counters.Counter private _tokenIds;
    Counters.Counter private _eventIds;

    struct Ticket {
        uint256 ticketId;
        uint256 eventId;
        string eventName;
        uint256 eventDate;
        string eventLocation;
        string genre;
        string artistName;
        uint256 eventTotalTickets;
        uint256 price;
        bool isSold;
    }

    struct Event {
        string name;
        uint256 date;
        string location;
        string genre;
        string artistName;
        uint256 ticketCount;
        uint256 ticketPrice;
    }

    mapping(uint256 => Ticket) private ticketInfos;

    DwavesToken public token;

    event TicketSold(address buyer, uint256 ticketId, uint256 eventId);

    constructor(DwavesToken token_) ERC721(_NAME, _SYMBOL) {
        require(
            address(token_) != address(0),
            "ConcertTicketNFT: token is zero address"
        );

        token = token_;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createEvent(
        address artistAddress,
        Event memory eventInfo
    ) external onlyRole(MINTER_ROLE) returns (uint256[] memory) {
        _eventIds.increment();

        uint256 eventId = _eventIds.current();

        uint256[] memory tokenIds = new uint256[](eventInfo.ticketCount);
        for (uint256 i = 0; i < eventInfo.ticketCount; i++) {
            tokenIds[i] = _createTicket(artistAddress, eventId, eventInfo);
        }

        return tokenIds;
    }

    function getAllTickets() external view returns (Ticket[] memory) {
        uint256 ticketCount = totalSupply();
        Ticket[] memory ticketList = new Ticket[](ticketCount);

        for (uint256 i = 0; i < ticketCount; i++) {
            ticketList[i] = ticketInfos[tokenByIndex(i)];
        }

        return ticketList;
    }

    function getTicketInfo(
        uint256 ticketId
    ) external view returns (Ticket memory) {
        return ticketInfos[ticketId];
    }

    function getEventTickets(
        uint256 eventId
    ) external view returns (Ticket[] memory) {
        uint256 ticketCount = totalSupply();
        Ticket[] memory ticketList = new Ticket[](ticketCount);

        for (uint256 i = 0; i < ticketCount; i++) {
            Ticket memory ticket = ticketInfos[tokenByIndex(i)];
            if (ticket.eventId == eventId) {
                ticketList[i] = ticket;
            }
        }

        return ticketList;
    }

    function getMyTickets() external view returns (Ticket[] memory) {
        return getTicketsByAddress(msg.sender);
    }

    function getTicketsByAddress(
        address user
    ) public view returns (Ticket[] memory) {
        uint256 ticketCount = balanceOf(user);
        Ticket[] memory ticketList = new Ticket[](ticketCount);

        for (uint256 i = 0; i < ticketCount; i++) {
            ticketList[i] = ticketInfos[tokenOfOwnerByIndex(user, i)];
        }

        return ticketList;
    }

    function buyTicket(
        address buyer,
        uint256 ticketId
    ) external onlyRole(MINTER_ROLE) {
        address artist = ownerOf(ticketId);

        _prevalidatePurchase(buyer, artist, ticketId);

        Ticket memory ticket = ticketInfos[ticketId];
        ticket.isSold = true;

        _processPurchase(buyer, artist, ticketId, ticket.price);
        emit TicketSold(buyer, ticketId, ticket.eventId);

        _setTicketInfo(ticketId, ticket);
    }

    function _createTicket(
        address artistAddress,
        uint256 eventId,
        Event memory eventInfo
    ) internal onlyRole(MINTER_ROLE) returns (uint256) {
        _tokenIds.increment();

        uint256 ticketId = _tokenIds.current();
        _safeMint(artistAddress, ticketId);

        Ticket memory newTicket = Ticket(
            ticketId,
            eventId,
            eventInfo.name,
            eventInfo.date,
            eventInfo.location,
            eventInfo.genre,
            eventInfo.artistName,
            eventInfo.ticketCount,
            eventInfo.ticketPrice,
            false
        );
        _setTicketInfo(ticketId, newTicket);

        return ticketId;
    }

    function _setTicketInfo(uint256 ticketId, Ticket memory ticket) internal {
        ticketInfos[ticketId] = ticket;
    }

    function _prevalidatePurchase(
        address buyer,
        address artist,
        uint256 ticketId
    ) internal view {
        require(
            !ticketInfos[ticketId].isSold,
            "ConcertTicketNFT: ticket is already sold"
        );
        require(
            buyer != artist,
            "ConcertTicketNFT: buyer cannot be the artist"
        );
        require(
            token.balanceOf(buyer) >= ticketInfos[ticketId].price,
            "ConcertTicketNFT: buyer does not have enough tokens"
        );
    }

    function _processPurchase(
        address buyer,
        address artist,
        uint256 ticketId,
        uint256 tokenAmount
    ) internal {
        token.transferFrom(buyer, artist, tokenAmount);
        _safeTransfer(artist, buyer, ticketId, "");
    }

    function supportsInterface(
        bytes4 interfaceId
    )
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
}
