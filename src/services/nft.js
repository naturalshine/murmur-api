import MurmurModel from "../models/murmur.model";
import { createColValArr, 
        createTablelandVars, 
        createColString, 
        createQueryString } from "../utils/queryHelper"
import { uploadToWeb3Storage, retrieveHash } from "../utils/storeMedia";
import { 
  connectTableland, 
  createTable, 
  insertTable, 
  readTable, 
  updateTable } from '../utils/tableland';
import { mintEthToken } from '../utils/mintEth';
import { mintPolygonToken } from '../utils/mintPolygon'
import {
        staticPath, 
        samplePath,
        tablelandSampleName, 
        tablelandVideoName, 
        tablelandPackName } from '../settings';

const delay = ms => new Promise(res => setTimeout(res, ms));


export const createNft = async (metadata, modelName) => {

    try {
        const nftModel = new MurmurModel(modelName);

        metadata.file = metadata.file.split('.')[0];

        let files = []
        let tableName;

        if(modelName === 'packs'){
          files.push(staticPath + metadata.file + ".png")
          tableName = tablelandPackName;
        } else if (modelName === 'samples'){
          files.push(staticPath + metadata.file + ".png")
          files.push(samplePath + metadata.file + ".mp3")
          tableName = tablelandSampleName;
        } else {
          files.push(staticPath + metadata.file + ".png")
          files.push(staticPath + metadata.file + ".mp3")
          files.push(staticPath + metadata.file + ".mp4")
          tableName = tablelandVideoName;
        }
   
    
        // TODO TESTING --> REMOVE THIS (Timeout)
        
        /*const nftCid = {
          message: "bafybeihs2kflvvetotocyguobltz2ogquawfntvxr3sjwmxf66kf2wahfu"
        }*/
        
        const nftCid = await uploadToWeb3Storage(files);
        if(!nftCid.success){
          console.log(nftCid.message);
          throw new Error('Web3 Storage Failed: ' + nftCid.message);
        }

        console.log("NFT CID", nftCid);

        
        //metadata.image = nftCid.message + "/" + metadata.file + ".png";
        metadata.image = await retrieveHash(nftCid, metadata.file + ".png")

        if(files.length > 1){
          //metadata.audio = nftCid.message + "/" + metadata.file + ".wav";
          metadata.audio = await retrieveHash(nftCid, metadata.file + ".mp3")

        }
        if (files.length > 2){
          //metadata.video = nftCid.message + "/" + metadata.file + ".mp4";
          metadata.video = await retrieveHash(nftCid, metadata.file + ".mp4");
        }

        const tablelandData = await createMetadata(metadata, modelName);
        
        const query = {
            name: tablelandData.name, 
            image: tablelandData.image
        }
        
        const [queryString, valArr] = await createQueryString(query);

        const [tColString, tValString] = await createTablelandVars(tablelandData);
        
        const createTablelandReturn = await createTablelandEntry(tColString, tValString, tableName);
        console.log("CREATE TABLELAND =>", createTablelandReturn.message);
        
        console.log("Waiting 20s after Tableland...");
        await delay(20000)

        const readTablelandReturn = await readTablelandTable(queryString, valArr, tableName);
        console.log("READ MESSAGE =>", readTablelandReturn.message);
        
        //TODO: store token id from tableland return
        metadata.tablelandId = readTablelandReturn.message[0].id
        
        // local db storage data transformation
        if (metadata.authorship){
          metadata.authorship = JSON.stringify(metadata.authorship[0]);
        }
        if(metadata.asmr_sounds){
          metadata.asmr_sounds = JSON.stringify(metadata.asmr_sounds[0]);
        }
        if(metadata.keywords){
          metadata.keywords = JSON.stringify(metadata.keywords[0]);
        }

        // store in local db
        let [colString, valString] = await createColValArr(metadata);
        const data = await nftModel.insertWithReturn(colString, valString);
        console.log("NFT");
        console.log(data.rows);
        
        const nftUri = `SELECT * FROM ${tableName} WHERE id = ${metadata.tablelandId}`;
        /*
        let tokenId 
        if(modelName == 'videos'){
          tokenId = await mintEthToken(nftUri)
        } else {
          tokenId = await mintPolygonToken(nftUri)
        }
        
        // Store TokenId 
        const tokenString = "tokenId = '" + tokenId.message + "'";
        const tokenInsert = await nftModel.update(tokenString, data.rows[0].id);
        */
        return{
            status: true,
            //message: tokenInsert.rows
            message: data.rows
        };
      } catch (err) {
        console.log(err);
        return{
            status: false,
            message: err.stack
        }
          
      }

}


// CREATE tableland table
export const createTableTableland = async(prefix, data, tablelandChain) => {
  try{
        let colString = await createColString(data);
        const signer = await connectTableland(tablelandChain);
        const createTablelandTable = await createTable(signer, prefix, colString);
        if(!createTablelandTable.status){
            throw new Error("Creating table failed: ", createTablelandTable.message)
        }
        return{
            status: true,
            message: createTablelandTable.message
        }
  } catch(err){
        console.log(err);

        return{
            status: false, 
            message: err
        }
  }


}

// READ tableland table
export const readTablelandTable = async(query, valArr, tablelandName) => {
  try{
      const { status, message } = await readTable(tablelandName, query, valArr);
      if(!status){
          throw new Error("Reading tableland table failed: ", message);
      }

      return {
          status: true,
          message: message
      }

  } catch(err){
      console.log(err)

      return{
          status: false,
          message: err
      }
  }

}

// UPDATE tableland entry
export const updateTablelandTable = async(insertCol, insertVal, query, tablelandChain, tablelandName) => {
  try{
      const signer = await connectTableland(tablelandChain);
      const updateTableland = await updateTable(signer, tablelandName, signer, insertCol, insertVal, query);
      if(!updateTableland.status){
          throw new Error("Updating Tableland failed: ", updateTableland.message);
      }
  
      return{
          status: true,
          message: updateTableland.message
      }
  } catch(err){
      console.log(err);

      return {
          status: false, 
          message: err
      }
  }


}

// CREATE tableland entry
export const createTablelandEntry = async(colString, valString, tablelandName) => {
  try{
      const { status, message } = await insertTable(tablelandName, colString, valString);
      if(!status){
          throw new Error("Tableland Create Entry Failed: ", message);
      }

      return{
          status: true, 
          message: message
      }
  
  } catch(err){
      console.log(err)
      
      return{
          status: false,
          message: err
      }
  }



}



export const createMetadata = async (metadata, tableName) => {
  const newMetadata = {};
  let attributes = [];
  newMetadata.name = metadata.title;
  newMetadata.description = metadata.description;
  newMetadata.image = metadata.image;
  
  if(tableName === 'videos') {
    newMetadata.video = metadata.video;
    newMetadata.audio = metadata.audio;

    attributes = [
        {
            "trait_type": "authorship", 
            "value": metadata.authorship
        },
        {
            "trait_type": "published",
            "value": metadata.published
        },
        {
            "trait_type": "duration",
            "value": metadata.duration
        },
        {
            "trait_type": "play_count",
            "value": metadata.play_count
        },
        {
            "trait_type": "keywords",
            "value": metadata.keywords
        },
        {
            "trait_type": "asmr_sounds",
            "value": metadata.asmr_sounds
        },
        {
            "trait_type": "lyrics",
            "value": metadata.lyrics
        }
    ];
  } else if (tableName === 'samples'){
    newMetadata.audio = metadata.audio;

    attributes = [
        {
            "trait_type": "authorship", 
            "value": metadata.authorship
        },
        {
            "trait_type": "published",
            "value": metadata.published
        },
        {
            "trait_type": "duration",
            "value": metadata.duration
        },
        {
            "trait_type": "start_time",
            "value": metadata.start_time
        },
        {
          "trait_type": "end_time",
          "value": metadata.end_time
        },
        {
          "trait_type": "loop",
          "value": metadata.loop
        },
        {
            "trait_type": "keywords",
            "value": metadata.keywords
        },
        {
            "trait_type": "asmr_sounds",
            "value": metadata.asmr_sounds
        },
        {
            "trait_type": "lyrics",
            "value": metadata.lyrics
        }
    ];

  } else {
    attributes = [
      {
          "trait_type": "authorship", 
          "value": metadata.authorship
      },
      {
          "trait_type": "published",
          "value": metadata.published
      },
      {
        "trait_type": "edition_size",
        "value": metadata.edition_size
      },
      {
          "trait_type": "keywords",
          "value": metadata.keywords
      },
      {
          "trait_type": "asmr_sounds",
          "value": metadata.asmr_sounds
      }
    ];

  }


  newMetadata.attributes = JSON.stringify(attributes);


  return newMetadata;

}

