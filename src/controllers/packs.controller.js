// ./src/controllers/packs.controller.js

import MurmurModel from "../models/murmur.model";
const packModel = new MurmurModel('packs');

/**
 * Return all samplePacks with id, name, and description
 */

export const getSamplePacks = async (req, res) => {
    try {
      const data = await packModel.select('id, name, description');
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
      const data = await packModel.select(`id,name,description`, req.params.id);
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
 * insert a sample pack 
 */

export const insertSamplePack = async (req, res) => {
    try {
      console.log(req.body)
      const columns = req.body.columns;
      const values = req.body.values;
      const data = await packModel.insertWithReturn(columns, values);
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

export const updateSamplePack = async (req, res) => {
    try {
      const columns = req.body.columns;
      const values = req.body.values;
      const data = await packModel.update(columns, values, req.params.id);
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
 * delete a sample pack by id
 */

export const deleteSamplePack = async (req, res) => {
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
 * delete all sample packs
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

