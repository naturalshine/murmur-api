import express from 'express';

import {
    getSamplePacks,
    getSinglePack,
    updateSamplePack,
    deleteSamplePack,
    insertSamplePack,
    deleteAllPacks
  } from "../controllers/packs.controller";
  
import { authenticateToken } from "../middleware/auth";

const packRouter = express.Router();

packRouter.get("/packs", authenticateToken, getSamplePacks);

packRouter.get("/packs/:id", authenticateToken, getSinglePack);

packRouter.post("/packs", authenticateToken, insertSamplePack);

packRouter.patch("/packs/:id", authenticateToken, updateSamplePack);

packRouter.delete("/packs", authenticateToken, deleteAllPacks);

packRouter.delete("/packs/:id", authenticateToken, deleteSamplePack);

export default packRouter;
