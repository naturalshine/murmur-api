# MURMUR API

## Overview
The MURMUR API provides local storage, decentralised storage (via web3.storage interfacing), metadata handling (via interal scripts and Tableland) and minting functionality for samples and sample packs.

It is the API companion of the [MURMUR APP](https://github.com/naturalshine/murmur-app)

## Commands

### NODE
`npm run startdev` to run the dev sever
`npm test` to run full test suite

### HARDHAT
`npx hardhat compile` to compile the smart contracts
`npx hardhat run scripts/deployTlandPack.js --network polygonmumbai` and each corresponding script for videos and samples. 

## Storage
The postgres database controlled by the API mirrors all metadata stored in Tableland tables as well as additional contextual information about each sample, video, and sample pack. Tableland metadata is written during the minting process for videos, samples, and sample packs via the service at `src/services/nft.js` and, especially, the `src/utils/tableland.js`. 

## Services
Though endpoints (described in `src/controllers`) enable many CRUD functions related to the three media types, the most important service of the API is contained in `src/services/nft.js`. This is the script which -- given a media object -- sends the object(s) to web3.storage, formats the corresponding metadata, sends the metadata to Tableland, and then mints an appropriate NFT. It does the heavy lifting of the demo. 

Another important service, descirbed in `src/controllers/sample.js:createSample` chops a video at designated points in order to create the samples requested by the front-end app. 

## Contracts and Tableland Metadata
There are three contracts, `contracts/Video.sol`, `contracts/Sample.sol`, `contracts/Pack.sol`, which are respondible for creating each kind of media NFT. Each of the contracts creates an ERC-721 NFT with token URI that points to the correct tableland entry. 

`Video.sol` and `Pack.sol` simply lookup the appropriate row based on the tableland id, which is submitted with the mint function (`src/utils/mintPolygon.js`). 

`Sample.sol` is slightly more complicated, querying not just the sample row via tableland id, but also performing a dynamic join with the approprite rows from the associated Video and Sample pack. These are additional attributes submitted to `Sample.sol` during minting. 

## TODO
- Ideally, attributes would be stored in an additional Tableland table in order to create a simpler querying process, as in the Tableland [two tables demo](https://github.com/tablelandnetwork/tutorial-two-tables-nft-polygon).
- When I began this project, I had imagined the `Video.sol` being deployed to Goerli, creating a cross-chain project and necessitating a dynamic join across chains in `Sample.sol`. This was abandoned both due to time constraints and to the run on Goerli Eth, which has increased the overhead of working on the chain as of March 2022. 




