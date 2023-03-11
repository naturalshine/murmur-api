import express from 'express';

import {
    getSamples,
    getSingleSample,
    updateSample,
    deleteSample,
    insertSample,
    deleteAllSamples,
    createSampleNft,
    tablelandSampleTable,
    createSample,
    getPackSamples
  } from "../controllers/sample.controller";

import { authenticateToken } from "../middleware/auth";


const sampleRouter = express.Router();

sampleRouter.get("/samples", authenticateToken, getSamples);

sampleRouter.get("/samples/pack", authenticateToken, getPackSamples);

sampleRouter.get("/samples/:id", authenticateToken, getSingleSample);

sampleRouter.post("/samples/create", authenticateToken, createSample);

sampleRouter.post("/samples/nft", authenticateToken, createSampleNft);

sampleRouter.post("/samples/tableland/create", authenticateToken, tablelandSampleTable)

sampleRouter.post("/samples", authenticateToken, insertSample);

sampleRouter.patch("/samples/:id", authenticateToken, updateSample);

sampleRouter.delete("/samples", authenticateToken, deleteAllSamples);

sampleRouter.delete("/samples/:id", authenticateToken, deleteSample);

export default sampleRouter;