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
        address artistAddress;
        string name;
        uint256 date;
        string location;
        string genre;
        string artistName;
        uint256 ticketCount;
        uint256 ticketPrice;
        uint256 ticketSold;
    }

    mapping(uint256 => Ticket) private _ticketInfos;
    mapping(uint256 => Event) private _eventInfos;
    mapping(address => uint256) private _artistEventCount;

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
        Event memory eventInfo
    ) external onlyRole(MINTER_ROLE) returns (uint256[] memory) {
        _eventIds.increment();

        uint256 eventId = _eventIds.current();

        uint256[] memory tokenIds = new uint256[](eventInfo.ticketCount);
        for (uint256 i = 0; i < eventInfo.ticketCount; i++) {
            tokenIds[i] = _createTicket(eventId, eventInfo);
        }

        _setEventInfo(eventId, eventInfo);
        _artistEventCount[eventInfo.artistAddress]++;

        return tokenIds;
    }

    function getAllTickets() external view returns (Ticket[] memory) {
        uint256 ticketCount = totalSupply();
        Ticket[] memory ticketList = new Ticket[](ticketCount);

        for (uint256 i = 0; i < ticketCount; i++) {
            ticketList[i] = _ticketInfos[tokenByIndex(i)];
        }

        return ticketList;
    }

    function getTicketInfo(
        uint256 ticketId
    ) external view returns (Ticket memory) {
        return _ticketInfos[ticketId];
    }

    function getEventInfo(
        uint256 eventId
    ) external view returns (Event memory) {
        return _eventInfos[eventId];
    }

    function getMyEvents() external view returns (Event[] memory) {
        return getEventsByAddress(msg.sender);
    }

    function getEventsByAddress(
        address artistAddress
    ) public view returns (Event[] memory) {
        uint256 i = 0;
        uint256 eventCount = _eventIds.current();
        Event[] memory eventList = new Event[](
            _artistEventCount[artistAddress]
        );

        for (uint256 j = 0; j < eventCount; j++) {
            Event memory event_ = _eventInfos[j + 1];
            if (event_.artistAddress == artistAddress) {
                eventList[i] = event_;
                i++;
            }
        }

        return eventList;
    }

    function getEventTickets(
        uint256 eventId
    ) external view returns (Ticket[] memory) {
        uint256 ticketCount = totalSupply();
        Ticket[] memory ticketList = new Ticket[](ticketCount);

        for (uint256 i = 0; i < ticketCount; i++) {
            Ticket memory ticket = _ticketInfos[tokenByIndex(i)];
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
            ticketList[i] = _ticketInfos[tokenOfOwnerByIndex(user, i)];
        }

        return ticketList;
    }

    function buyTicket(
        address buyer,
        uint256 ticketId
    ) external onlyRole(MINTER_ROLE) {
        address artist = ownerOf(ticketId);

        _prevalidatePurchase(buyer, artist, ticketId);

        Ticket memory ticket = _ticketInfos[ticketId];

        _processPurchase(buyer, artist, ticketId, ticket.price);
        emit TicketSold(buyer, ticketId, ticket.eventId);

        _updatePurchasingState(ticket);
    }

    function _createTicket(
        uint256 eventId,
        Event memory eventInfo
    ) internal onlyRole(MINTER_ROLE) returns (uint256) {
        _tokenIds.increment();

        uint256 ticketId = _tokenIds.current();
        _safeMint(eventInfo.artistAddress, ticketId);

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

    function _setEventInfo(uint256 eventId, Event memory event_) internal {
        _eventInfos[eventId] = event_;
    }

    function _setTicketInfo(uint256 ticketId, Ticket memory ticket) internal {
        _ticketInfos[ticketId] = ticket;
    }

    function _prevalidatePurchase(
        address buyer,
        address artist,
        uint256 ticketId
    ) internal view {
        require(
            !_ticketInfos[ticketId].isSold,
            "ConcertTicketNFT: ticket is already sold"
        );
        require(
            buyer != artist,
            "ConcertTicketNFT: buyer cannot be the artist"
        );
        require(
            token.balanceOf(buyer) >= _ticketInfos[ticketId].price,
            "ConcertTicketNFT: buyer does not have enough tokens"
        );
    }

    function _updatePurchasingState(Ticket memory ticket) internal {
        Event memory event_ = _eventInfos[ticket.eventId];

        ticket.isSold = true;
        event_.ticketSold += 1;

        _setTicketInfo(ticket.ticketId, ticket);
        _setEventInfo(ticket.eventId, event_);
    }

    function _processPurchase(
        address buyer,
        address artist,
        uint256 ticketId,
        uint256 tokenAmount
    ) internal {
        token.transferFrom(buyer, artist, tokenAmount * 10**token.decimals());
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
