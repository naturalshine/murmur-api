import express from "express";

import { authenticateToken } from "../middleware/auth";
import { 
    uploadFile, 
    getListFiles, 
    retrieveFileHash 
} from "../controllers/file.controller";


const fileRouter = express.Router();

fileRouter.post("/hash", authenticateToken, retrieveFileHash);
fileRouter.post("/upload", authenticateToken, uploadFile);
fileRouter.get("/files", authenticateToken, getListFiles);

export default fileRouter;
