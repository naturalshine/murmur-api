require("dotenv").config();

const { ethers } = require('ethers')

const contractABI = require('../abis/polygon-contract-abi.json');

import { 
        polygonKey, 
        polygonChain, 
        infuraKey, 
        polygonContract, 
        mintingWallet } from '../settings'

export const mintPolygonToken = async(sqlString) => {
    try{
        const wallet = new ethers.Wallet(polygonKey);
        const provider = new ethers.providers.InfuraProvider(polygonChain, infuraKey)

        wallet.provider = provider;
        const signer = wallet.connect(provider);
    
        const nft = new ethers.Contract(
            polygonContract,
            contractABI,
            signer
        );

        let tokenId;

        await nft
            .mint(mintingWallet, sqlString)
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

module.exports = {
    mintToken,
}