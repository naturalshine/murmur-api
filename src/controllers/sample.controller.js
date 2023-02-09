// ./src/controllers/sample.controller.js

import MurmurModel from "../models/murmur.model";
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
      const columns = req.body.columns;
      const values = req.body.values;
      const data = await sampleModel.insertWithReturn(columns, values);
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
      const columns = req.body.columns;
      const values = req.body.values;
      const data = await sampleModel.update(columns, values, req.params.id);
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

