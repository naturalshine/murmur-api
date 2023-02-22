import MurmurModel from "../models/murmur.model";
import { createColValArr, createColString, createQueryString } from "../utils/queryHelper"
import { uploadToWeb3Storage } from "../utils/storeMedia";
import { 
  connectTableland, 
  createTable, 
  insertTable, 
  readTable, 
  updateTable } from '../utils/tableland';
import { tablelandPackChain, tablelandPackName } from '../settings';


const packModel = new MurmurModel('packs');

export const createPack = async (metadata) => {
    try {
        const files = [
          metadata.path + metadata.file + ".png", 
          metadata.path + metadata.file + ".mp4", 
          metadata.path + metadata.file + ".wav", 
        ]
    
        // TODO TESTING --> REMOVE THIS (Timeout)
        const packCid = {
          message: "bafybeidwmcqtldhqfx6d42cokrwzl32nmqfslqa6hju7ovsn3nmjssyzdi"
        }
        //const packCid = await uploadToWeb3Storage(files);
        /*if(!packCid.status){
          console.log(packCid.message);
          throw new Error('Web3 Storage Failed: ' + packCid.message);
        }*/
    
        metadata.image = packCid.message + "/" + metadata.file + ".png";
    

        const tablelandData = await createPackMetadata(metadata);
        const [tColString, tValString, tValArr] = await createColValArr(tablelandData);
        
        const query = {
            name: tablelandData.name, 
            image: tablelandData.image
        }
        
        const [queryString, valArr] = await createQueryString(query);
        console.log("QUERY STRING =>", queryString);

        const createPackReturn = await createTablelandPack(tColString, tValArr);
        console.log("CREATE TABLELAND =>", createPackReturn.message);

        const readPackReturn = await readTablelandPack(queryString, valArr);
        console.log("READ MESSAGE =>", readPackReturn.message);
        
        //TODO: store token id from tableland return
        metadata.tablelandId = readPackReturn.message[0].id

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
        const data = await packModel.insertWithReturn(colString, valString);
        console.log("PACK NFT");
        console.log(data.rows);
    
        // TODO: MINT
        
    
        // TODO: Store TokenId 

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


// CREATE tableland pack table
export const createPackTable = async(prefix, data) => {
  try{
        let colString = await createColString(data);
        const signer = await connectTableland(tablelandPackChain);
        const createTablelandPackTable = await createTable(signer, prefix, colString);
        if(!createTablelandPackTable.status){
            throw new Error("Creating table failed: ", createTablelandPackTable.message)
        }
        return{
            status: true,
            message: createTablelandPackTable.message
        }
  } catch(err){
        console.log(err);

        return{
            status: false, 
            message: err
        }
  }


}

// READ tableland pack
export const readTablelandPack = async(query, valArr) => {
  try{
      const { status, message } = await readTable(tablelandPackChain, tablelandPackName, query, valArr);
      if(!status){
          throw new Error("Reading tableland pack table failed: ", message);
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

// UPDATE tableland pack
export const updateTablelandPack = async(insertCol, insertVal, query) => {
  try{
      const signer = await connectTableland(tablelandPackChain);
      const updateTablelandPack = await updateTable(signer, tablelandPackName, signer, insertCol, insertVal, query);
      if(!updateTablelandPack.status){
          throw new Error("Updating Tableland Pack failed: ", updateTablelandPack.message);
      }
  
      return{
          status: true,
          message: updateTablelandPack.message
      }
  } catch(err){
      console.log(err);

      return {
          status: false, 
          message: err
      }
  }


}

// CREATE tableland pack
export const createTablelandPack = async(colString, valArr) => {
  try{
    
      const { status, message } = await insertTable(tablelandPackChain, tablelandPackName, colString, valArr);
      if(!status){
          throw new Error("Tableland Create Pack Failed: ", message);
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

export const createPackMetadata = async (metadata) => {
  const newMetadata = {};
  newMetadata.name = metadata.title;
  newMetadata.description = metadata.description;
  newMetadata.image = metadata.image;

  const attributes = [
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

  newMetadata.attributes = JSON.stringify(attributes);

  return newMetadata;

}

