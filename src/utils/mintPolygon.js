// generic minting function for polygon nfts
const { ethers } = require('ethers')

import { 
        polygonKey, 
        polygonChain, 
        infuraKey, 
        mintingWallet } from '../settings'

export const mintPolygonToken = async(tablelandId, contract, abiPath) => {
    try{
        const wallet = new ethers.Wallet(polygonKey);
        const provider = new ethers.providers.InfuraProvider(polygonChain, infuraKey)

        wallet.provider = provider;
        const signer = wallet.connect(provider);
    
        const nft = new ethers.Contract(
            contract,
            abiPath,
            signer
        );

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
