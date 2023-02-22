import express from 'express';

import { authenticateToken } from "../middleware/auth";

import { doClipAudio } from '../services/doClipAudio';

const murmurRouter = express.Router();

/* Creating the routes for the murmur controller. */

murmurRouter.get("/clip", doClipAudio);

export default murmurRouter;
