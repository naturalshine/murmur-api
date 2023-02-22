import { Wallet, providers } from "ethers";
import { NonceManager } from "@ethersproject/experimental";
import { Database, helpers } from "@tableland/sdk";

import { 
    polygonKey, 
    ethKey,
    infuraKey
 } from '../settings';

// connection function
export const connectTableland = async(network) => {
    let privateKey;

    if(network === "mumbai"){
        privateKey = `0x${polygonKey}`;
    } else {
        privateKey = `0x${ethKey}`;
    }

    const wallet = new Wallet(privateKey);

    const provider = new providers.InfuraProvider(network, infuraKey);

    const baseSigner = wallet.connect(provider);
    const signer = new NonceManager(baseSigner);

    return signer
}


// create table
export const createTable = async (signer, prefix, colString) => {
    try{
        console.log("PRE DB");
        const db = new Database({
          signer
        });
    
        const { meta: create } = await db
        .prepare(
          `CREATE TABLE ${prefix} (${colString});`
        )
        .run();
        
        console.log(create.txn.name);

        return {
            status: true, 
            message: create.txn.name         
        };
    } catch(err){
        console.log(err);

        return{
            status: false, 
            message: err.stack
        }
    }
}

export const insertTable = async(network, tableName, colString, valArr) => {
    try{
        let privateKey;

        if(network === "mumbai"){
            privateKey = `0x${polygonKey}`;
        } else {
            privateKey = `0x${ethKey}`;
        }

        const wallet = new Wallet(privateKey);

        const provider = new providers.InfuraProvider(network, infuraKey);

        const baseSigner = wallet.connect(provider);
        const signer = new NonceManager(baseSigner);

        const db = new Database({ signer });
        
        // Insert a row into the table
        const { success, meta } = await db.prepare(`INSERT INTO ${tableName} (${colString}) VALUES (?, ?, ?, ?, ?, ?);`)
        .bind(valArr[0], valArr[1], valArr[2], valArr[3], valArr[4], valArr[5])
        .run();

        console.log("success =>", success);

        console.log("meta =>", meta);
        
        return {
            status: success,
            message: "data inserted"    
        }
    } catch (err){
        console.log(err);

        return{
            status: false, 
            message: err
        }
    }

}

export const readTable = async(network, tableName, query, valArr) => {
    try{

        console.log("read only " + network);
        // "read only goerli"

        const db = Database.readOnly(5);
        // saw some ex with string network so tried this too with same
        // results: 
        //const db = Database.readOnly( network ); // "goerli"

        const { results, success, meta } = await db
        .prepare(`SELECT * FROM ${tableName};`)
        .all();

        console.log("RESULTS => ", results);
        console.log("STATUS => ", success);
        console.log("META => ", meta);

        /*
        if(query === "all"){
           const { results } = await db
                .prepare(`SELECT * FROM ${tableName};`)
                .all();

        } else {
            const { results } = await db
                .prepare(`SELECT * FROM ${tableName} WHERE ${query};`)
                .bind(valArr[0], valArr[1])
                .all();    
        }*/

        console.log(results)
    
        return {
            status: true,
            message: results
        }
    } catch(err){
        console.log(err);

        return{
            status: false,
            message: err.stack
        }
    }

}

export const updateTable = async(signer, tableName, insertCol, insertVal, query) =>{
    try{
        const db = new Database({ signer });

        // Insert a row into the table
        const { meta: insert } = await db
        .prepare(`INSERT INTO ${tableName} (${insertCol}) VALUES (${insertVal}) WHERE ${query};`)
        .run();
        
        await insert.txn.wait();

        // Perform a read query, requesting all rows from the table
        const { results } = await db.prepare(`SELECT * FROM ${tableName} WHERE ${query};`).all();

        return {
            status: true, 
            message: results
        }
    } catch (err){
        console.log(err);

        return{
            status: true, 
            message: err.stack
        }
    }

}