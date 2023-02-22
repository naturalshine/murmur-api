import {
    dropTables,
    createTables,
    insertIntoTables,
    dropVideosTableCmd,
    createVideosTableCmd,
    insertVideosCmd
  } from '../src/utils/queryFunctions';
  
  before(async () => {
    await createTables();
    await insertIntoTables();
    await createVideosTableCmd();
    await insertVideosCmd();
  });
  
  after(async () => {
    await dropTables();
    await dropVideosTableCmd();
  });