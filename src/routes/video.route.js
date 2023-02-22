import express from 'express';

import {
    getSingleVideo,
    getVideos,
    updateVideo,
    deleteVideo,
    insertVideo,
    deleteAllVideos,
    createVideoNFT, 
    tablelandVideoTable
  } from "../controllers/video.controller";

import { authenticateToken } from "../middleware/auth";
import { readTablelandVideo } from '../services/videos';

const videoRouter = express.Router();

videoRouter.get("/videos", authenticateToken, getVideos);

videoRouter.get("/videos/:id", authenticateToken, getSingleVideo);

videoRouter.post("/videos/nft", authenticateToken, createVideoNFT);

videoRouter.post("/videos/tableland/create", authenticateToken, tablelandVideoTable)

videoRouter.post("/videos", authenticateToken, insertVideo);

videoRouter.patch("/videos/:id", authenticateToken, updateVideo);

videoRouter.delete("/videos", authenticateToken, deleteAllVideos);

videoRouter.delete("/videos/:id", authenticateToken, deleteVideo);



export default videoRouter;