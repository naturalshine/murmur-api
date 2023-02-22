import MurmurModel from "../models/murmur.model";
import { createColValArr, createColString, createQueryString } from "../utils/queryHelper"
import { uploadToWeb3Storage } from "../utils/storeMedia";
import { 
  connectTableland, 
  createTable, 
  insertTable, 
  readTable, 
  updateTable } from '../utils/tableland';
import { tablelandVideoChain, tablelandVideoName } from '../settings';


const videoModel = new MurmurModel('videos');

export const createVideo = async (metadata) => {
    try {
        const files = [
          metadata.path + metadata.file + ".png", 
          metadata.path + metadata.file + ".mp4", 
          metadata.path + metadata.file + ".wav", 
        ]
    
        // TODO TESTING --> REMOVE THIS (Timeout)
        const videoCid = {
          message: "bafybeidwmcqtldhqfx6d42cokrwzl32nmqfslqa6hju7ovsn3nmjssyzdi"
        }
        //const videoCid = await uploadToWeb3Storage(files);
        /*if(!videoCid.status){
          console.log(videoCid.message);
          throw new Error('Web3 Storage Failed: ' + videoCid.message);
        }*/
    
        metadata.image = videoCid.message + "/" + metadata.file + ".png";
        metadata.video = videoCid.message + "/" + metadata.file + ".mp4";
        metadata.audio = videoCid.message + "/" + metadata.file + ".wav";
    

        const tablelandData = await createVideoMetadata(metadata);
        const [tColString, tValString, tValArr] = await createColValArr(tablelandData);
        
        const query = {
            name: tablelandData.name, 
            image: tablelandData.image
        }
        
        const [queryString, valArr] = await createQueryString(query);
        console.log("QUERY STRING =>", queryString);

        const createVideoReturn = await createTablelandVideo(tColString, tValArr);
        
        console.log("CREATE TABLELAND =>", createVideoReturn.message);

        const readVideoReturn = await readTablelandVideo(queryString, valArr);
        console.log("READ =>", readVideoReturn.status);
        console.log("READ MESSAGE =>", readVideoReturn.message);
        
        //metadata.tablelandId = createTableland.id
        // local db storage
        if (metadata.authorship){
          metadata.authorship = JSON.stringify(metadata.authorship[0]);
        }
        if(metadata.asmr_sounds){
          metadata.asmr_sounds = JSON.stringify(metadata.asmr_sounds[0]);
        }
        if(metadata.keywords){
          metadata.keywords = JSON.stringify(metadata.keywords[0]);
        }
        let [colString, valString] = await createColValArr(metadata);
        const data = await videoModel.insertWithReturn(colString, valString);
        console.log("VIDEO NFT");
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


// CREATE tableland video table
export const createTablelandVideoTable = async(prefix, data) => {
  try{
        let colString = await createColString(data);
        const signer = await connectTableland(tablelandVideoChain);
        const createTablelandVideoTable = await createTable(signer, prefix, colString);
        if(!createTablelandVideoTable.status){
            throw new Error("Creating table failed: ", createTablelandVideoTable.message)
        }
        return{
            status: true,
            message: createTablelandVideoTable.message
        }
  } catch(err){
        console.log(err);

        return{
            status: false, 
            message: err
        }
  }


}

// READ tableland video
export const readTablelandVideo = async(query, valArr) => {
  try{
      const { status, message } = await readTable(tablelandVideoChain, tablelandVideoName, query, valArr);
      if(!status){
          throw new Error("Reading tableland video table failed: ", message);
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

// UPDATE tableland video
export const updateTablelandVideo = async(insertCol, insertVal, query) => {
  try{
      const signer = await connectTableland(tablelandVideoChain);
      const updateVideoTable = await updateTable(signer, tablelandVideoName, signer, insertCol, insertVal, query);
      if(!updateTablelandVideo.status){
          throw new Error("Updating Tableland Video failed: ", updateTablelandVideo.message);
      }
  
      return{
          status: true,
          message: updateVideoTable.message
      }
  } catch(err){
      console.log(err);

      return {
          status: false, 
          message: err
      }
  }


}

// CREATE tableland video
export const createTablelandVideo = async(colString, valString) => {
  try{
    
      const { status, message } = await insertTable(tablelandVideoChain, tablelandVideoName, colString, valString);
      if(!status){
          throw new Error("Tableland Create Video Failed: ", message);
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

export const createVideoMetadata = async (metadata) => {
  const newMetadata = {};
  newMetadata.name = metadata.title;
  newMetadata.description = metadata.description;
  newMetadata.image = metadata.image;
  newMetadata.audio = metadata.audio;
  newMetadata.video = metadata.video;

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

