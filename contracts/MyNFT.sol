// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public maxSupply;
    mapping(uint256 => string) private _tokenImages;

    constructor(uint256 _maxSupply) ERC721("MyNFT", "MNFT") {
        maxSupply = _maxSupply;
    }

    function mintNFT(address recipient, string memory tokenURI, string memory imageURI)
        public
        onlyOwner
        returns (uint256)
    {
        require(_tokenIds.current() < maxSupply, "Max supply reached");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _tokenImages[newItemId] = imageURI;

        return newItemId;
    }

    function changeImage(uint256 tokenId, string memory newImageURI) public onlyOwner {
        require(tokenId <= _tokenIds.current(), "Token ID does not exist");
        _tokenImages[tokenId] = newImageURI;
    }

    function getTokenImage(uint256 tokenId) public view returns (string memory) {
        require(tokenId <= _tokenIds.current(), "Token ID does not exist");
        return _tokenImages[tokenId];
    }
}
