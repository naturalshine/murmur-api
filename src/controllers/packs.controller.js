// ./src/controllers/sample.controller.js

import MurmurModel from "../models/murmur.model";
import { createQueryString, createColValArr } from "../utils/queryHelper"
import { 
          createNft, 
          createTableTableland,
       } from "../services/nft";
import { tablelandPackPrefix, tablelandPackChain } from '../settings';

const packModel = new MurmurModel('packs');

/**
 * Return all packs with id, name, and description
 */

export const getPacks = async (req, res) => {
    try {
      const data = await packModel.select('id, title, description');
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
 * Return single sample pack by id
*/
export const getSinglePack = async (req, res) => {
    try {
      const data = await packModel.select(`id,title,description`, req.params.id);
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

export const insertPack = async (req, res) => {
    try {
      console.log(req.body)
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
      const data = await packModel.insertWithReturn(colString, valString);

      res.status(201).json({
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

export const updatePack = async (req, res) => {
    try {

      let queryString = await createQueryString(req.data);
      const data = await packModel.update(queryString, req.params.id);

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
 * delete a pack by id
 */

export const deletePack = async (req, res) => {
    try {
      const data = await packModel.delete(req.params.id);
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
 * delete all packs
 */

export const deleteAllPacks = async (req, res) => {
  try {
    const data = await packModel.deleteAll();
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
export const createPackNft = async (req, res) => {
  try {

    const data = await createNft(req.body, 'packs');
    
    if(!data.status){
      throw new Error("Pack failed : " + data.message);
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
 * Create tableland table for sample packs
 */
export const tablelandPackTable = async (req, res) => {
  try {

    const data = await createTableTableland(tablelandPackPrefix, req.body, tablelandPackChain);
    
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


