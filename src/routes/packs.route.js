import express from 'express';

import {
    getSamplePacks,
    getSinglePack,
    updateSamplePack,
    deleteSamplePack,
    deleteAllPacks,
    insertSamplePack,
    deleteAllPacks,
    createPackNft, 
    tablelandPackTable
  } from "../controllers/packs.controller";
  
import { authenticateToken } from "../middleware/auth";

const packRouter = express.Router();

packRouter.get("/packs", authenticateToken, getSamplePacks);

packRouter.get("/packs/:id", authenticateToken, getSinglePack);

packRouter.post("/packs/nft", authenticateToken, createPackNft);

packRouter.post("/packs/tableland/create", authenticateToken, tablelandPackTable)

packRouter.post("/packs", authenticateToken, insertSamplePack);

packRouter.patch("/packs/:id", authenticateToken, updateSamplePack);

packRouter.delete("/packs", authenticateToken, deleteAllPacks);

packRouter.delete("/packs/:id", authenticateToken, deleteSamplePack);

export default packRouter;
