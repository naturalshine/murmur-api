// web3.storage helper functions

import { Web3Storage, getFilesFromPath } from 'web3.storage';
import { web3StorageToken } from '../settings';
import axios from 'axios';

export const retrieveHash = async(cId, file) =>{
    console.log("CID ", cId.message);
    const fileList = await axios.get("https://dweb.link/api/v0/ls?arg=" + cId.message);

    let fileMap = fileList.data.Objects[0].Links.find(o => o.Name === file);
    return fileMap.Hash
}


export const uploadToWeb3Storage = async(uploadedFiles) => {
    try{
        const onRootCidReady = cid => {
            console.log('uploading files with cid:', cid)
        }

        if (!web3StorageToken) {
            throw new Error("NO TOKEN");
        }

        console.log(web3StorageToken);
    
        const storage = new Web3Storage({ token: web3StorageToken})
        const files = []
    
        for (const file of uploadedFiles) {
            const pathFiles = await getFilesFromPath(file)
            files.push(...pathFiles)
        }
    
        console.log(`Uploading ${files.length} files`)
        const cid = await storage.put(files, { onRootCidReady });
        console.log('Content added with CID:', cid);


        return{
            success: true,
            message: cid
        }


    } catch(error){
        return{
            success: false,
            message: error
        }
    }

}
