import dotenv from 'dotenv';

dotenv.config();

export const testEnvironmentVariable = 
process.env.TEST_ENV_VARIABLE;

export const nodeEnv = process.env.NODE_ENV;
export const baseUrl = process.env.BASE_URL;
export const staticPath = process.env.STATIC_PATH;

//postgres
export const connectionString = process.env.CONNECTION_STRING;

// jwt
export const jwtUser = process.env.JWT_USER;
export const jwtPw = process.env.JWT_PW;
export const jwtSecret = process.env.JWT_SECRET;
export const jwtAlgo = process.env.JWT_ALGO;
export const jwtExpireTime = process.env.JWT_EXPIRE_TIME;

//web3 storage
export const web3StorageToken = process.env.WEB3_STORAGE;

// tableland
export const tablelandVideoChain = process.env.TABLELAND_VIDEO_CHAIN
export const tablelandVideoName = process.env.TABLELAND_VIDEO_NAME
export const polygonKey = process.env.POLYGON_KEY
export const ethKey = process.env.ETH_KEY
export const infuraKey = process.env.INFURA_KEY
export const ethChain = process.env.ETH_CHAIN
export const polygonChain = process.env.POLYGON_CHAIN
export const tablelandVideoPrefix = process.env.VIDEO_PREFIX
