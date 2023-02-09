import express from "express";

import { authenticateToken } from "../middleware/auth";
import { 
    uploadFile, 
    getListFiles } from "../controllers/file.controller";

const fileRouter = express.Router();

fileRouter.post("/upload", authenticateToken, uploadFile);
fileRouter.get("/files", authenticateToken, getListFiles);
//fileRouter.get("/files/:name", authenticateToken, downloadFile);

export default fileRouter;
