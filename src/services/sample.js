import MurmurModel from "../models/murmur.model";
import { createColValArr, createColString, createQueryString } from "../utils/queryHelper"
import { uploadToWeb3Storage } from "../utils/storeMedia";
import { 
  connectTableland, 
  createTable, 
  insertTable, 
  readTable, 
  updateTable } from '../utils/tableland';
import { tablelandSampleChain, tablelandSampleChain, tablelandSampleName } from '../settings';


const sampleModel = new MurmurModel('samples');

export const createSample = async (metadata) => {
    try {
        const files = [
          metadata.path + metadata.file + ".png", 
          metadata.path + metadata.file + ".wav", 
        ]
    
        // TODO TESTING --> REMOVE THIS (Timeout)
        const sampleCid = {
          message: "bafybeidwmcqtldhqfx6d42cokrwzl32nmqfslqa6hju7ovsn3nmjssyzdi"
        }
        //const sampleCid = await uploadToWeb3Storage(files);
        /*if(!sampleCid.status){
          console.log(sampleCid.message);
          throw new Error('Web3 Storage Failed: ' + sampleCid.message);
        }*/
    
        metadata.image = sampleCid.message + "/" + metadata.file + ".png";
        metadata.audio = sampleCid.message + "/" + metadata.file + ".wav";
    

        const tablelandData = await createSampleMetadata(metadata);
        const [tColString, tValString, tValArr] = await createColValArr(tablelandData);
        
        const query = {
            name: tablelandData.name, 
            image: tablelandData.image
        }
        
        const [queryString, valArr] = await createQueryString(query);
        console.log("QUERY STRING =>", queryString);

        const createSampleReturn = await createTablelandSample(tColString, tValArr);
        console.log("CREATE TABLELAND =>", createSampleReturn.message);

        const readSampleReturn = await readTablelandSample(queryString, valArr);
        console.log("READ MESSAGE =>", readSampleReturn.message);
        
        //TODO: store token id from tableland return
        metadata.tablelandId = readSampleReturn.message[0].id

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
        const data = await sampleModel.insertWithReturn(colString, valString);
        console.log("SAMPLE NFT");
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


// CREATE tableland sample table
export const createSampleTable = async(prefix, data) => {
  try{
        let colString = await createColString(data);
        const signer = await connectTableland(tablelandSampleChain);
        const createTablelandSampleTable = await createTable(signer, prefix, colString);
        if(!createTablelandSampleTable.status){
            throw new Error("Creating table failed: ", createTablelandSampleTable.message)
        }
        return{
            status: true,
            message: createTablelandSampleTable.message
        }
  } catch(err){
        console.log(err);

        return{
            status: false, 
            message: err
        }
  }


}

// READ tableland sample
export const readTablelandSample = async(query, valArr) => {
  try{
      const { status, message } = await readTable(tablelandSampleChain, tablelandSampleName, query, valArr);
      if(!status){
          throw new Error("Reading tableland sample table failed: ", message);
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

// UPDATE tableland sample
export const updateTablelandSample = async(insertCol, insertVal, query) => {
  try{
      const signer = await connectTableland(tablelandSampleChain);
      const updateSampleTable = await updateTable(signer, tablelandSampleName, signer, insertCol, insertVal, query);
      if(!updateSampleTable.status){
          throw new Error("Updating Tableland Sample failed: ", updateSampleTable.message);
      }
  
      return{
          status: true,
          message: updateSampleTable.message
      }
  } catch(err){
      console.log(err);

      return {
          status: false, 
          message: err
      }
  }


}

// CREATE tableland sample
export const createTablelandSample = async(colString, valArr) => {
  try{
    
      const { status, message } = await insertTable(tablelandSampleChain, tablelandSampleName, colString, valArr);
      if(!status){
          throw new Error("Tableland Create Sample Failed: ", message);
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

export const createSampleMetadata = async (metadata) => {
  const newMetadata = {};
  newMetadata.name = metadata.title;
  newMetadata.description = metadata.description;
  newMetadata.image = metadata.image;
  newMetadata.audio = metadata.audio;

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

