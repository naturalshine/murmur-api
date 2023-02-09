import { Pool } from 'pg';
import { connectionString } from '../settings';

export const pool = new Pool({ connectionString });