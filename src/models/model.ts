import * as pg from 'pg';
import { Table } from '../database';

/**
 * DataModel can be extended by other model classes to
 * facilitate the process of connecting to the DB server.
 *
 * NOTE: The purpose of this class is to reduce
 * the boilerplate code that handles connecting,
 * querying then releasing connection to the DB server.
 */

abstract class DataModel<T> {
    constructor(private db: pg.Pool, private table: Table) {}

    /**
     * Given a well formed SQL query, it will be executed
     * then returning the result.
     * @param sql a well formed SQL query.
     * @returns result of executing the query returned by DB server.
     */
    async executeQuery(sql: string): Promise<pg.QueryResult<T>> {
        try {
            const client = await this.db.connect();
            const result: pg.QueryResult<T> = await client.query(sql);
            client.release();
            return result;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Executing SQL Query: ${error.message}`);
        }
    }

    async index(): Promise<T[]> {
        try {
            const result = await this.executeQuery(
                `SELECT * FROM ${this.table};`
            );
            return result.rows;
        } catch (err) {
            const error = err as Error;
            throw new Error(
                `Fetching all ${this.table} list -- ${error.message}`
            );
        }
    }

    async show(id: number): Promise<T> {
        try {
            const result = await this.executeQuery(
                `SELECT * FROM ${this.table} WHERE id = ${id};`
            );
            return result.rows[0];
        } catch (err) {
            const error = err as Error;
            throw new Error(
                `Fetching entity from ${this.table} with ID: ${id} -- ${error.message}`
            );
        }
    }

    async delete(id: number): Promise<T> {
        try {
            const result = await this.executeQuery(
                `DELETE FROM ${this.table} WHERE id = ${id} RETURNING *`
            );
            return result.rows[0];
        } catch (err) {
            const error = err as Error;
            throw new Error(
                `Deleting entity from ${this.table} with ID: ${id} -- ${error.message}`
            );
        }
    }
}

export default DataModel;
