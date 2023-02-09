import dotenv from 'dotenv';

dotenv.config();

export const testEnvironmentVariable = 
process.env.TEST_ENV_VARIABLE;

export const nodeEnv = process.env.NODE_ENV;

//postgres
export const connectionString = process.env.CONNECTION_STRING;

// jwt
export const jwtUser = process.env.JWT_USER;
export const jwtPw = process.env.JWT_PW;
export const jwtSecret = process.env.JWT_SECRET;
export const jwtAlgo = process.env.JWT_ALGO;
export const jwtExpireTime = process.env.JWT_EXPIRE_TIME;