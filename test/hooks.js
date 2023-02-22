import {
    dropTables,
    createTables,
    insertIntoTables,
    dropVideosTableCmd,
    createVideosTableCmd,
    insertVideosCmd,
    dropSamplesTableCmd, 
    createSamplesTableCmd, 
    insertSamplesTableCmd, 
    insertPacksTableCmd, 
    createPacksTableCmd, 
    dropPacksTableCmd
  } from '../src/utils/queryFunctions';
  
  before(async () => {
    console.log("creating tables")
    await createTables();
    await insertIntoTables();
    console.log("creating video tables")
    await createVideosTableCmd();
    await insertVideosCmd();
    console.log("creating packs table")
    await createPacksTableCmd();
    await insertPacksTableCmd();
    console.log("creation samples table")
    await createSamplesTableCmd();
    await insertSamplesTableCmd();
    console.log("done with creating tables");
  });
  
  after(async () => {
    await dropTables();
    await dropSamplesTableCmd();
    await dropVideosTableCmd();
    await dropPacksTableCmd();
  });