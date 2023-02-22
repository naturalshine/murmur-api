// ./src/controllers/sample.controller.js

import MurmurModel from "../models/murmur.model";
import { createQueryString, createColValArr } from "../utils/queryHelper"
import { 
          createSample, 
          createSampleTable,
       } from "../services/samples";
import { tablelandSamplePrefix } from '../settings';

const sampleModel = new MurmurModel('samples');

/**
 * Return all samples with id, name, and description
 */

export const getSamples = async (req, res) => {
    try {
      const data = await sampleModel.select('id, name, description');
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
export const getSingleSample = async (req, res) => {
    try {
      const data = await sampleModel.select(`id,name,description`, req.params.id);
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

export const insertSample = async (req, res) => {
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
      const data = await videoModel.insertWithReturn(colString, valString);

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

export const updateSample = async (req, res) => {
    try {

      let queryString = await createQueryString(req.data);
      const data = await sampleModel.update(queryString, req.params.id);

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

export const deleteSample = async (req, res) => {
    try {
      const data = await sampleModel.delete(req.params.id);
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

export const deleteAllSamples = async (req, res) => {
  try {
    const data = await sampleModel.deleteAll();
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
export const createSampleNft = async (req, res) => {
  try {

    const data = await createSample(req.body);
    
    if(!data.status){
      throw new Error("Sample failed : " + data.message);
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
export const tablelandSampleTable = async (req, res) => {
  try {

    const data = await createSampleTable(tablelandSamplePrefix, req.body);
    
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


