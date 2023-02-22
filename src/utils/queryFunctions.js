import { pool } from '../models/pool';
import {
  insertMessages,
  dropMessagesTable,
  createMessageTable,
  insertVideos,
  dropVideosTable,
  createVideosTable,
  insertSamples,
  dropSamplesTable,
  createSamplesTable,
  insertPacks,
  dropPacksTable,
  createPacksTable
} from './queries';

export const executeQueryArray = async arr => new Promise(resolve => {
  const stop = arr.length;
  arr.forEach(async (q, index) => {
    await pool.query(q);
    if (index + 1 === stop) resolve();
  });
});

export const dropTables = () => executeQueryArray([ dropMessagesTable ]);
export const createTables = () => executeQueryArray([ createMessageTable ]);
export const insertIntoTables = () => executeQueryArray([ insertMessages ]);

export const dropVideosTableCmd = () => executeQueryArray([ dropVideosTable ]);
export const createVideosTableCmd = () => executeQueryArray([ createVideosTable ]);
export const insertVideosCmd = () => executeQueryArray([ insertVideos ]);

export const dropSamplesTableCmd = () => executeQueryArray([ dropSamplesTable ]);
export const createSamplesTableCmd = () => executeQueryArray([ createSamplesTable ]);
export const insertSamplesTableCmd = () => executeQueryArray([ insertSamples ]);

export const dropPacksTableCmd = () => executeQueryArray([ dropPacksTable ]);
export const createPacksTableCmd = () => executeQueryArray([ createPacksTable ]);
export const insertPacksTableCmd = () => executeQueryArray([ insertPacks ]);