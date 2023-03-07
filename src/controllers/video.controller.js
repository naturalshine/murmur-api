// ./src/controllers/sample.controller.js

import MurmurModel from "../models/murmur.model";
import { createQueryString, createColValArr } from "../utils/queryHelper"
import {  
          createNft, 
          createTableTableland,
       } from "../services/nft";
import { tablelandVideoPrefix, tablelandVideoChain } from '../settings';

const videoModel = new MurmurModel('videos');

/**
 * Return all videos with id, name, and description
 */

export const getVideos = async (req, res) => {
    try {
      const data = await videoModel.select('id, title, description, image, video, audio');
      res.status(200).json({
        messages: data.rows
      });
    } catch (err) {
      res.status(500).json({
        messages: err.stack
      });
    }
};


/**
 * Return single video by id
*/
export const getSingleVideo = async (req, res) => {
    try {
      const data = await videoModel.select(`id,title,description`, req.params.id);
      res.status(200).json({
        message: data.rows
      });
    } catch (err) {
      res.status(500).json({
        message: err.stack
      });
    }
  };



/**
 * insert a sample  
 */

export const insertVideo = async (req, res) => {
    try {
      console.log(req.body);
      if (req.body.authorship){
        req.body.authorship = JSON.stringify(req.body.authorship[0]);
      }
      if(req.body.asmr_sounds){
        req.body.asmr_sounds = JSON.stringify(req.body.asmr_sounds[0]);
      }
      if(req.body.keywords){
        req.body.keywords = JSON.stringify(req.body.keywords[0]);
      }
      let [colString, valString] = await createColValArr(req.body)
      console.log(colString, valString);
      const data = await videoModel.insertWithReturn(colString, valString);
      res.status(200).json({
        message: data.rows
      });
    } catch (err) {
      res.status(500).json({
        message: err.stack
      });
    }
  };


/**
 * update a sample pack by id
 */

export const updateVideo = async (req, res) => {
    try {
      let queryString = await createQueryString(req.data);
      const data = await videoModel.update(queryString, req.params.id);
      res.status(200).json({
        message: data.rows
      });
    } catch (err) {
      res.status(500).json({
        message: err.stack
      });
    }
  };

/**
 * delete a sample by id
 */

export const deleteVideo = async (req, res) => {
    try {
      const data = await videoModel.delete(req.params.id);
      res.status(200).json({
        message: data.rows
      });
    } catch (err) {
      res.status(500).json({
        message: err.stack
      });
    }
  };

/**
 * delete all samples
 */

export const deleteAllVideos = async (req, res) => {
  try {
    const data = await videoModel.deleteAll();
    res.status(200).json({
      message: data
    });
  } catch (err) {
    res.status(500).json({
      message: err.stack
    });
  }
};

/**
 * create video on web3 storage
 */
export const createVideoNFT = async (req, res) => {
  try {

    const data = await createNft(req.body, 'videos');
    
    if(!data.status){
      throw new Error("Video failed : " + data.message);
    }

    console.log("DATA => ", data)


    res.status(200).json({
      message: data.message
    });

  } catch (err) {
    res.status(500).json({
      message: err
    });
  }
};

/**
 * Create tableland table
 */
export const tablelandVideoTable = async (req, res) => {
  try {

    const data = await createTableTableland(tablelandVideoPrefix, req.body, tablelandVideoChain);
    
    if(!data.status){
      throw new Error("tableland creation failed : " + data.message);
    }

    res.status(200).json({
      message: data.rows
    });

  } catch (err) {
    res.status(500).json({
      message: err
    });
  }
};



