// generic minting function for polygon nfts
const { ethers } = require('ethers')

import { 
        polygonKey, 
        infuraKey, 
        tablelandChain
     } from '../settings'

const sampleAbi = require('../abis/sample-abi.json');
const packAbi = require('../abis/pack-abi.json');
const videoAbi = require('../abis/video-abi.json');

export const mintPolygonToken = async(tablelandId, contract, modelName) => {
    try{
        console.log("POLYGON CHAIN =>", tablelandChain);
        console.log("TABLELAND ID =>", tablelandId);
        console.log("CONTRACT =>", contract);

        let abi;
        if(modelName == 'samples'){
            abi = sampleAbi;
        }else if (modelName == 'packs'){
            abi = packAbi;
        } else{
            abi = videoAbi;
        }
        const polygonWallet = new ethers.Wallet(polygonKey);
        console.log("WALLET =>", polygonWallet)
        const polygonProvider = new ethers.providers.InfuraProvider(tablelandChain, infuraKey)
        console.log("PROVIDER =>", polygonProvider);

        //polygonWallet.provider = polygonProvider;

        console.log("POST WALLET PROVIDER")
        
        const polygonSigner = polygonWallet.connect(polygonProvider);
        
        console.log("SIGNER =>", polygonSigner);

        const nft = new ethers.Contract(
            contract,
            abi,
            polygonSigner
        );

        console.log("NFT CONTRACT =>", nft)

        let tokenId;

        await nft
            .mint(tablelandId)
            .then((tx) => tx.wait(5))
            .then((receipt) => {
                console.log(`Confirmed! Your transaction receipt is: ${receipt.transactionHash}`)
                tokenId = parseInt(receipt.logs[0].topics[3], 16)
            })
            .catch((error) => {
                console.log("Something went wrong", error)
                return {
                    success: false,
                    message: error
                }
            });

            return {
                success:true,
                message: tokenId
            }

    } catch(error){
        return {
            success: false, 
            message: error
        }
    }
}       
