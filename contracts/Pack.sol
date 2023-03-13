// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @dev Implementation of a simple NFT, using Tableland to host metadata in a two table setup.
 */
contract Pack is ERC721, ERC721URIStorage {
    // For demonstration purposes, some of these storage variables are set as `public`
    // This is not necessarily a best practice but makes it easy to call public getters

    /// A URI used to reference off-chain metadata.
    // This will use the Tableland gateway and query: https://testnets.tableland.network/query?mode=list&s=
    // See the `query?mode=list&s=` appended -- a SQL query `s` and mode to format to ERC721 standard
    string public baseURIString;
    /// The name of the main metadata table in Tableland
    // Schema: id int primary key, name text, description text, image text
    string public mainTable;
    /// The name of the attributes table in Tableland
    // Schema: main_id int not null, trait_type text not null, value text
    //string public attributesTable;
    /// A token counter, to track NFT tokenIds
    uint256 private _tokenIdCounter;
    /// A max number of tokens
    uint256 private _maxTokens;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    /**
     * @dev Initialize TableNFT
     * baseURI - Set the contract's base URI to the Tableland gateway
     * _mainTable - The name of the 'main' table for NFT metadata
     * _attributesTable - The corresponding 'attributes' table
     */
    constructor(
        string memory baseURI,
        string memory _mainTable
        //string memory _attributesTable
    ) ERC721("PackNFT", "PNFT") {
        // Initialize with token counter at zero
        _tokenIdCounter = 0;
        // The max number of NFTs in this tutorial
        _maxTokens = 100;
        // Set the baseURI to the Tableland gateway
        baseURIString = baseURI;
        // Set the table names
        mainTable = _mainTable;
        //attributesTable = _attributesTable;
    }

    /**
     *  @dev Must override the default implementation, which returns an empty string.
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURIString;
    }

    /**
     *  @dev Returns the total number of tokens in existence.
     */
    function totalSupply() public view returns (uint256) {
        return _maxTokens;
    }


    /**
     *  @dev Overrides both tokenURI functions in 721/URI Storage. 
     * Looks up URI via _tokenURIs * map created in ERC721URIStorage.
     * 
     *  @param tokenId - The id of the NFT token that is being requested
     */
    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory storedTokenURI = _tokenURIs[tokenId];

        // Return the baseURI with a query string, which looks up the token id in a row.
        // `&mode=list` formats into the proper JSON object expected by metadata standards.
        return storedTokenURI;
    }

    /**
     * 
     * @param tokenId unique id of the NFT
     * @param tablelandId id of the tableland row corresponding to the token metadata
     * 
     * @dev sets the token URI to Tableland-compliant SQL string
     * 
     */

    function _setTokenURI(uint256 tokenId, uint256 tablelandId) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        
        string memory baseURI = _baseURI();

        string memory query = string(
            abi.encodePacked(
                'SELECT%20json_object%28%27id%27%2Cid%2C%27name%27%2Cname%2C%27description%27%2Cdescription%2C%27image%27%2Cimage%29%20FROM%20',
                mainTable,
                '%20WHERE%20id%20%3D%20',
                tablelandId        
            )
        
        );

        string memory tokenString = string(
                                        abi.encodePacked(
                                            baseURI,
                                            query                                        
                                        )
                                    );



        _tokenURIs[tokenId] = tokenString;
    }


    /**
     * @param tablelandId id of the tableland row corresponding to the token metadata
     * 
     * @dev Mint an NFT, incrementing the `_tokenIdCounter` upon each call.
     * Create stored tokenURI using incoming tablelandId for lookup
     * 
     */
    function mint(uint256 tablelandId) public {
        require(
            _tokenIdCounter < _maxTokens,
            "Maximum number of tokens have been minted"
        );
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tablelandId);
    }

    /**
     * @dev See {ERC721-_burn}. This override additionally checks to see if a
     * token-specific URI was set for the token, and if so, it deletes the token URI from
     * the storage mapping.
     */
    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }
}