// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Date is Ownable, ERC721 {

    struct Metadata {
        uint16 year;
        uint8 month;
        uint8 day;
        uint8 color;
        string title;
    }

    mapping(uint256 => Metadata) id_to_date;

    string private _currentBaseURI;

    constructor() ERC721("Date", "DATE") {
        setBaseURI("https://date.kie.codes/token/");

        mint(1, 1, 1, 4, "ORIGIN");
        (uint16 now_year, uint8 now_month, uint8 now_day) = timestampToDate(block.timestamp);
        mint(now_year, now_month, now_day, 4, "Date Token Start");
        mint(2015, 7, 30, 6, "ETH GENESIS");
        mint(1452, 4, 15, 5, "Art is never finished, only abandoned.");
        mint(1605, 11, 5, 1, "Remember, remember, the 5th of November.");
        mint(1564, 4, 23, 2, "To be, or not to be");
        mint(1969, 7, 20, 3, "One small step for man");
        mint(1986, 6, 12, 0, "CBD");
        mint(1971, 6, 28, 7, "Elon's Birthday");
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _currentBaseURI = baseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _currentBaseURI;
    }

    function mint(uint16 year, uint8 month, uint8 day, uint8 color, string memory title) internal {
        uint256 tokenId = id(year, month, day);
        
        id_to_date[tokenId] = Metadata(year, month, day, color, title);
        _safeMint(msg.sender, tokenId);
    }

    function claim(uint16 year, uint8 month, uint8 day, string calldata title) external payable {
        require(msg.value == 0.01 ether, "claiming a date costs 10 finney");

        (uint16 now_year, uint8 now_month, uint8 now_day) = timestampToDate(block.timestamp);
        if ((year > now_year) || 
            (year == now_year && month > now_month) || 
            (year == now_year && month == now_month && day > now_day)) {
            revert("a date from the future can't be claimed");
        }

        uint8 color;
        uint256 r = pseudoRNG(year, month, day, title) % 1000000;
        if (r < 1000) {
            color = 7;
        } else if (r < 6000) {
            color = 6;
        } else if (r < 16000) {
            color = 5;
        } else if (r < 66000) {
            color = 4;
        } else if (r < 166000) {
            color = 3;
        } else if (r < 366000) {
            color = 2;
        } else if (r < 666000) {
            color = 1;
        } else {
            color = 0;
        }

        mint(year, month, day, color, title);
        payable(owner()).transfer(0.01 ether);
    }

    function ownerOf(uint16 year, uint8 month, uint8 day) public view returns(address) {
        return ownerOf(id(year, month, day));
    }

    function id(uint16 year, uint8 month, uint8 day) pure internal returns(uint256) {
        require(1 <= day && day <= numDaysInMonth(month, year));
        return (uint256(year)-1)*372 + (uint256(month)-1)*31 + uint256(day)-1;
    }

    function get(uint256 tokenId) external view returns (uint16 year, uint8 month, uint8 day, uint8 color, string memory title) {
        require(_exists(tokenId), "token not minted");
        Metadata memory date = id_to_date[tokenId];
        year = date.year;
        month = date.month;
        day = date.day;
        color = date.color;
        title = date.title;
    }

    function titleOf(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "token not minted");
        Metadata memory date = id_to_date[tokenId];
        return date.title;
    }

    function titleOf(uint16 year, uint8 month, uint8 day) external view returns (string memory) {
        require(_exists(id(year, month, day)), "token not minted");
        Metadata memory date = id_to_date[id(year, month, day)];
        return date.title;
    }

    function changeTitleOf(uint16 year, uint8 month, uint8 day, string memory title) external {
        require(_exists(id(year, month, day)), "token not minted");
        changeTitleOf(id(year, month, day), title);
    }

    function changeTitleOf(uint256 tokenId, string memory title) public {
        require(_exists(tokenId), "token not minted");
        require(ownerOf(tokenId) == msg.sender, "only the owner of this date can change its title");
        id_to_date[tokenId].title = title;
    }

    function isLeapYear(uint16 year) public pure returns (bool) {
        require(1 <= year, "year must be bigger or equal 1");
        return (year % 4 == 0) 
            && (year % 100 == 0)
            && (year % 400 == 0);
    }

    function numDaysInMonth(uint8 month, uint16 year) public pure returns (uint8) {
        require(1 <= month && month <= 12, "month must be between 1 and 12");
        require(1 <= year, "year must be bigger or equal 1");

        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
            return 31;
        }
        else if (month == 2) {
            return isLeapYear(year) ? 29 : 28;
        }
        else {
            return 30;
        }
    }

    function timestampToDate(uint timestamp) public pure returns (uint16 year, uint8 month, uint8 day) {
        uint z = timestamp / 86400 + 719468;
        uint era = (z >= 0 ? z : z - 146096) / 146097;
        uint doe = z - era * 146097;
        uint yoe = (doe - doe/1460 + doe/36524 - doe/146096) / 365;
        uint doy = doe - (365*yoe + yoe/4 - yoe/100);
        uint mp = (5*doy + 2)/153;

        day = uint8(doy - (153*mp+2)/5 + 1);
        month = mp < 10 ? uint8(mp + 3) : uint8(mp - 9);
        year = uint16(yoe + era * 400 + (month <= 2 ? 1 : 0));
    }

    function pseudoRNG(uint16 year, uint8 month, uint8 day, string memory title) internal view returns (uint256) {
        return uint256(keccak256(abi.encode(block.timestamp, block.difficulty, year, month, day, title)));
    }
}