// tableland helper functions

import { Wallet, providers } from "ethers";
import { NonceManager } from "@ethersproject/experimental";
import { Database, helpers } from "@tableland/sdk";

import { 
    polygonKey, 
    ethKey,
    infuraKey,
    tablelandChain
 } from '../settings';

// connection function
export const connectTableland = async(network) => {
    let privateKey;

    if(network === "maticum"){
        privateKey = `${polygonKey}`;
    } else {
        privateKey = `${polygonKey}`;
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
            message: err
        }
    }
}

export const insertTable = async(tableName, colString, valString, valArr) => {
    try{
        let privateKey;
        let network = tablelandChain;

        if(network === "maticmum"){
            privateKey = `${polygonKey}`;
        } else {
            privateKey = `${polygonKey}`;
        }

        const wallet = new Wallet(privateKey);

        const provider = new providers.InfuraProvider(network, infuraKey);

        const baseSigner = wallet.connect(provider);
        const signer = new NonceManager(baseSigner);

        const db = new Database({ signer });
        
        // Insert a row into the table
        const { meta: insert } = await db.prepare(`INSERT INTO ${tableName} (${colString}) VALUES (${valString});`)
        .run();
        
        //        .bind(valArr[0], valArr[1], valArr[2], valArr[3], valArr[4], valArr[5])


        console.log("duration =>", insert.duration)

        // Wait for transaction finality
        await insert.txn?.wait();

        return {
            status: true,
            message: "Insert complete"  
        }
    } catch (err){
        console.log(err);

        return{
            status: false, 
            message: err
        }
    }

}

export const readTable = async(tableName, query, valArr) => {
    try{

        let network = tablelandChain;

        const db = Database.readOnly(network);
        
        let readReturn;
        if(query === "all"){
           readReturn = await db
                .prepare(`SELECT * FROM ${tableName};`)
                .all();

        } else {
            readReturn = await db
                .prepare(`SELECT * FROM ${tableName} WHERE ${query};`)
                .bind(valArr[0], valArr[1])
                .all();    
        }

    
        return {
            status: true,
            message: readReturn.results
        }
    } catch(err){
        console.log(err);

        return{
            status: false,
            message: err
        }
    }

}

export const updateTable = async(tableName, insertCol, valString, valArr, query) =>{
    try{
        let privateKey;
        let network = tablelandChain;

        if(network === "maticmum"){
            privateKey = `${polygonKey}`;
        } else {
            privateKey = `${polygonKey}`;
        }

        const wallet = new Wallet(privateKey);

        const provider = new providers.InfuraProvider(network, infuraKey);

        const baseSigner = wallet.connect(provider);
        const signer = new NonceManager(baseSigner);

        // Insert a row into the table
        const { success, meta } = await db
        .prepare(`INSERT INTO ${tableName} (${insertCol}) VALUES (${valString}) WHERE ${query};`)
        .bind(valArr)
        .run();
        
        console.log("SUCCESS =>", success)
        console.log("META =>", meta);

        // Perform a read query, requesting all rows from the table
        const { results } = await db.prepare(`SELECT * FROM ${tableName} WHERE ${query};`).all();

        console.log("RESULTS => ", results);

        return {
            status: true, 
            message: results
        }
    } catch (err){
        console.log(err);

        return{
            status: false, 
            message: err
        }
    }

}