// main service: fomat metadata, send files to web3.storage, create tableland entry, 
// mint token & return id
// TODO: break into microservices

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

import { mintPolygonToken } from '../utils/mintPolygon'

import {
        staticPath, 
        samplePath,
        tablelandSampleName, 
        tablelandChain,
        tablelandVideoName, 
        tablelandPackName,
        videoContract,
        packContract,
        sampleContract,
      } from '../settings';

const delay = ms => new Promise(res => setTimeout(res, ms));


export const createNft = async (metadata, modelName) => {

    try {
        
        const nftModel = new MurmurModel(modelName);

        metadata.file = metadata.file.split('.')[0];

        let files = []
        let tableName, contract, abiString;

        // prepare different file array for web3.storage depending on 
        // nft being minted
        if(modelName === 'packs'){
          files.push(staticPath + metadata.file + ".png")
          tableName = tablelandPackName;
          contract = packContract;
        } else if (modelName === 'samples'){
          files.push(staticPath + metadata.file + ".png")
          files.push(samplePath + metadata.file + metadata.index + ".mp3")
          tableName = tablelandSampleName;
          contract = sampleContract;
        } else {
          files.push(staticPath + metadata.file + ".png")
          files.push(staticPath + metadata.file + ".wav")
          files.push(staticPath + metadata.file + ".mp4")
          tableName = tablelandVideoName;
          contract = videoContract;
        }
        
        let nftCid;


        // call to web3.storage to upload file arr
        nftCid = await uploadToWeb3Storage(files);
        if(!nftCid.success){
          console.log(nftCid.message);
          throw new Error('Web3 Storage Failed: ' + nftCid.message);
        }

        console.log("NFT CID", nftCid);
        

        // retrieve file-specific hashes from directory CID
        if (modelName == 'videos'){
          metadata.image = 'bafybeie7meaooj4jgigia4lduwfv56da2q4fe42u2rtkmfpzwwd3ogdjce'
        } else {
          metadata.image = await retrieveHash(nftCid, metadata.file + ".png")
        }

        if(files.length > 1){
          if(modelName == 'videos'){
            metadata.audio = 'bafybeihza4ulpznvwy6zm2v4pq5cxyi4jrij2ccwxnwvfpbhyi5mzez27i'
          } else{
            metadata.audio = await retrieveHash(nftCid, metadata.file + metadata.index + ".mp3")
          }
        }
        if (files.length > 2){
          //metadata.video = await retrieveHash(nftCid, metadata.file + ".mp4");
          metadata.video = 'bafybeid4dnrbedu3h6j2j7liawuwta3jchwqcq4oson2qfjmfrwkp6omsm'
        }

        // create tableland metadata
        const tablelandData = await createMetadata(metadata, modelName);
        
        // get correctly formatted sql strings for insert operation
        const [tColString, tValString] = await createTablelandVars(tablelandData);
        console.log("TABLELAND COLUMN =>", tColString);
        console.log("TABLELAND VALUES =>", tValString);
        
        // create tableland metadata entry
        const createTablelandReturn = await createTablelandEntry(tColString, tValString, tableName);
        console.log("CREATE TABLELAND =>", createTablelandReturn.message);
        
        // latency catch
        console.log("Waiting 20s after Tableland...");
        await delay(20000)

        // create read query for tableland
        // our insert function doesn't return an id so we 
        // have to query tableland with data we know is unique
        const query = {
          name: tablelandData.name, 
          image: tablelandData.image
        }
        
        const [queryString, valArr] = await createQueryString(query);

        // read tableland table and return id
        const readTablelandReturn = await readTablelandTable(queryString, valArr, tableName);
        console.log("READ MESSAGE =>", readTablelandReturn.message);
        
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
        
        // mint polygon token
        let tokenId 
        tokenId = await mintPolygonToken(metadata.tablelandId, contract, modelName)
        
        console.log("TOKEN ID =>", tokenId)

        // Store tokenId in database 
        const tokenString = "tokenId = '" + tokenId.message + "'";
        const tokenInsert = await nftModel.update(tokenString, data.rows[0].id);
        
        console.log("TOKEN INSERT =>", tokenInsert.rows);

        return{
            status: true,
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
        const createTablelandTable = await createTable(prefix, colString);
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
export const updateTablelandTable = async(insertCol, insertVal, valArr, query, tablelandName) => {
  try{
      const updateTableland = await updateTable(tablelandName, insertCol, insertVal, valArr, query);
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
    newMetadata.video_id = metadata.video_id;
    newMetadata.pack_id = metadata.pack_id;

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

