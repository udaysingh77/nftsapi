// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract nftsIPFS {

    address payable contractOwner = payable(0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97);
    uint public listingPrice = 0.025 ether;

    struct NFTs{
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

    mapping(uint256 => NFTs) public nftImages;
    uint256 public imagesCount = 0;

    function uploadIPFS(address _creator, string memory _image, string memory _title,string memory _description, string memory _email, string memory _category) public payable returns (string memory,string memory,string memory,address,string memory){
        imagesCount++;

        NFTs storage nft = nftImages[imagesCount];

        nft.title = _title;
        nft.creator = _creator;
        nft.description = _description;
        nft.email = _email;
        nft.category = _category;
        nft.image = _image;
        nft.timestamp = block.timestamp;
        nft.id = imagesCount;

        return(
            _title,
            _description,
            _category,
            _creator,
            _image
        );
    }

    function getAllNFTs() public view returns (NFTs[] memory){
        uint256 itemCount = imagesCount;
        uint256 currentIndex = 0;

        NFTs[] memory items = new NFTs[](itemCount);
        for(uint256 i =0; i<itemsCount; i++){
            uint256 currentId = i + 1;
            NFTs storage currentItems = nftImages[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }

    function getImages(uint256 id) external view returns(
        string memory,
        string memory,
        string memory,
        string memory,
        uint256,
        address,
        string memory,
        uint256
    ){
        NFTs memory nfts = nftImages[id];
        return (
            nfts.title,
            nfts.description,
            nfts.email,
            nfts.category,
            nfts.fundraised,
            nfts.creator,
            nfts.image,
            nfts.timestamp,
            nfts.id
            )
    }

    function updateListingPrice(uint256 _listingPrice,address owner) public payable{
        require(contractOwner == owner,"only contract owner can update listing price");
        listingPrice = _listingPrice;
    }

    function donateToImage(uin256 _id) public payable {
        uint256 amount = msg.value ;
        NFTs storage nfs = nftImages[_id];
        (bool,sent,) = payable(nft.creator).call{value:amount}("");
        if(sent){
            nft.fundraised = nft.fundraised + amount;
        }
    }

    function withdraw(address _owner) external {
        require(_owner == contractOwner,"Only Ower can widthdraw");
        uint256 balance = address(this).balance;
        require(balance>0,"No funds available");
        contractOwner.transfer(balance)
    }


}