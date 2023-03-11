import { pool } from './pool';

class MurmurModel {
    constructor(table) {
        this.pool = pool;
        this.table = table;
        this.pool.on('error', (err, client) => `Error, ${err}, on idle client${client}`);
    }

    async select(columns, clause) {
        let query = `SELECT ${columns} FROM ${this.table}`;
        if (clause) query += `WHERE id = ${clause}`;
        return this.pool.query(query);
    }

    async selectByColumn(columns, clause, clauseColumn) {
        let query = `SELECT ${columns} FROM ${this.table}`;
        if (clause) query += `WHERE ${clauseColumn} = ${clause}`;
        return this.pool.query(query);
    }


    async insertWithReturn(columns, values) {

        const query = `
            INSERT INTO ${this.table}(${columns})
            VALUES (${values})
            RETURNING id, ${columns}
        `;
        return this.pool.query(query);
    }

    async update(queryString, clause){
        const query = `
            UPDATE ${this.table} 
            SET ${queryString} 
            WHERE id = ${clause}`;
        return this.pool.query(query);
    }

    async delete(clause){
        const query = `
            DELETE FROM ${this.table}
            WHERE id = ${clause}`;
        return this.pool.query(query);
    }

    async deleteAll(){
        const query = `
            DELETE FROM ${this.table}`;
        return this.pool.query(query);
    }
}

export default MurmurModel;