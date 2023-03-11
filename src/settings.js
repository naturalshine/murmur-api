import dotenv from 'dotenv';

dotenv.config();

// general 
export const nodeEnv = process.env.NODE_ENV;
export const baseUrl = process.env.BASE_URL;
export const staticPath = process.env.STATIC_PATH;
export const samplePath = process.env.SAMPLE_PATH;

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
export const tablelandChain = process.env.TABLELAND_SAMPLE_CHAIN

//VIDEO
export const tablelandVideoName = process.env.TABLELAND_VIDEO_NAME
export const tablelandVideoPrefix = process.env.VIDEO_PREFIX

//PACKS
export const tablelandPackName = process.env.TABLELAND_PACK_NAME
export const tablelandPackPrefix = process.env.TABLELAND_PACK_PREFIX

//SAMPLES
export const tablelandSampleName = process.env.TABLELAND_SAMPLE_NAME
export const tablelandSamplePrefix = process.env.TABLELAND_SAMPLE_PREFIX

// CHAINS
export const polygonKey = process.env.POLYGON_KEY
export const ethKey = process.env.ETH_KEY
export const infuraKey = process.env.INFURA_KEY
export const ethChain = process.env.ETH_CHAIN
export const polygonChain = process.env.POLYGON_CHAIN
export const polygonContract = process.env.POLYGON_CONTRACT
export const ethContract = process.env.ETH_CONTRACT
export const mintingWallet = process.env.MINTING_WALLET

// contracts & abis
export const videoContract = process.env.VIDEO_CONTRACT
export const videoAbi = process.env.VIDEO_ABI
export const packContract = process.env.PACK_CONTRACT
export const packAbi = process.env.PACK_ABI
export const sampleContract = process.env.SAMPLE_CONTRACT
export const sampleAbi = process.env.SAMPLE_ABI