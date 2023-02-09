// ./src/controllers/sample.controller.js

import MurmurModel from "../models/murmur.model";
import { createQueryString, createColValArr } from "../utils/queryHelper"
const videoModel = new MurmurModel('videos');

/**
 * Return all videos with id, name, and description
 */

export const getVideos = async (req, res) => {
    try {
      const data = await videoModel.select('id, name, description');
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
 * Return single video pack by id
*/
export const getSingleVideo = async (req, res) => {
    try {
      const data = await videoModel.select(`id,name,description`, req.params.id);
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
      console.log(req.body)
      let columns, values = await createColValArr(req.body)
      const data = await videoModel.insertWithReturn(columns, values);
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

