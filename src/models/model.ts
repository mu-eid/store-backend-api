import * as pg from 'pg';

/**
 * DataModel can be extended by other model classes to
 * facilitate the process of connecting to the DB server.
 *
 * NOTE: The purpose of this class is to reduce
 * the boilerplate code that handles connecting,
 * querying then releasing connection to the DB server.
 */

class DataModel<T> {
    constructor(private db: pg.Pool) {}

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
}

export default DataModel;
