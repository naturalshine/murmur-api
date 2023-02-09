import express from 'express';

import { authenticateToken } from "../middleware/auth";

import { doClipAudio } from '../services/doClipAudio';
import { doMint } from '../services/doMint';

const murmurRouter = express.Router();

/* Creating the routes for the murmur controller. */

murmurRouter.get("/clip", doClipAudio);

murmurRouter.get("/mint", doMint);

export default murmurRouter;
