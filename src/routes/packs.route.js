import express from 'express';

import {
    getPacks,
    getSinglePack,
    updatePack,
    deletePack,
    insertPack,
    deleteAllPacks,
    createPackNft, 
    tablelandPackTable
  } from "../controllers/packs.controller";
  
import { authenticateToken } from "../middleware/auth";

const packRouter = express.Router();

packRouter.get("/packs", authenticateToken, getPacks);

packRouter.get("/packs/:id", authenticateToken, getSinglePack);

packRouter.post("/packs/nft", authenticateToken, createPackNft);

packRouter.post("/packs/tableland/create", authenticateToken, tablelandPackTable)

packRouter.post("/packs", authenticateToken, insertPack);

packRouter.patch("/packs/:id", authenticateToken, updatePack);

packRouter.delete("/packs", authenticateToken, deleteAllPacks);

packRouter.delete("/packs/:id", authenticateToken, deletePack);

export default packRouter;
