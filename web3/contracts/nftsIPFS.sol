
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract NFTsIPFS {

    address payable public contractOwner = payable(0x39eb3aAd2a0551cAA773ef2dC03fafBFbdFE6608);
    uint public listingPrice = 0.025 ether;

    struct NFT {
        string title;
        string description;
        string email;
        string category;
        uint256 fundraised;
        address creator;
        string image;
        uint256 timestamp;
        uint256 id;
    }

    mapping(uint256 => NFT) public nftImages;
    uint256 public imagesCount = 0;

    function uploadIPFS(
        address _creator,
        string memory _image,
        string memory _title,
        string memory _description,
        string memory _email,
        string memory _category
    ) public payable returns (
        string memory,
        string memory,
        string memory,
        address,
        string memory
    ) {
        require(msg.value >= listingPrice, "Insufficient listing price");

        imagesCount++;

        NFT storage nft = nftImages[imagesCount];
        nft.title = _title;
        nft.creator = _creator;
        nft.description = _description;
        nft.email = _email;
        nft.category = _category;
        nft.image = _image;
        nft.timestamp = block.timestamp;
        nft.id = imagesCount;

        return (
            _title,
            _description,
            _category,
            _creator,
            _image
        );
    }

    function getAllNFTs() public view returns (NFT[] memory) {
        uint256 itemCount = imagesCount;
        NFT[] memory items = new NFT[](itemCount);

        for (uint256 i = 0; i < itemCount; i++) {
            uint256 currentId = i + 1; // Mapping keys are 1-based
            NFT storage currentItem = nftImages[currentId];
            items[i] = currentItem;
        }

        return items;
    }

    function getImage(uint256 id) 
        external 
        view 
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            address,
            string memory,
            uint256
        ) {
        NFT memory nft = nftImages[id];
        return (
            nft.title,
            nft.description,
            nft.email,
            nft.category,
            nft.fundraised,
            nft.creator,
            nft.image,
            nft.timestamp
        );
    }

    function updateListingPrice(uint _listingPrice) external {
        require(msg.sender == contractOwner, "Only contract owner can update listing price");
        listingPrice = _listingPrice;
    }

    function donateToImage(uint256 _id) public payable {
        uint256 amount = msg.value;
        NFT storage nft = nftImages[_id];
        require(amount > 0, "Donation amount must be greater than zero");

        (bool sent, ) = payable(nft.creator).call{value: amount}("");
        require(sent, "Failed to send Ether");

        nft.fundraised += amount;
    }

    function withdraw() external {
        require(msg.sender == contractOwner, "Only owner can withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available");

        (bool sent, ) = contractOwner.call{value: balance}("");
        require(sent, "Failed to withdraw funds");
    }
}
