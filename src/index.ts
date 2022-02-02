import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { ENV_PATH } from './utils/path';
import dbClient from './database';
import { init_db } from './utils/db_migrator';

const ENV_VARS = dotenv.config({ path: ENV_PATH });
const { APP_HOST, APP_PORT, NODE_ENV } = process.env;

init_db();

const app = express();

app.get('/hallo', async (req: Request, resp: Response): Promise<void> => {
    try {
        const conn = await dbClient.connect();
        const sqlQuery = `SELECT $1 AS greeting;`;
        const result = await conn.query(sqlQuery, ['Leute!']);
        conn.release();
        resp.json({ hallo: result.rows[0]['greeting'] });
    } catch (err) {
        resp.status(500).json({
            error: {
                When: 'While requesting GET /hallo',
                Reason: (err as Error).message,
            },
        });
    }
});

app.listen(APP_PORT, (): void => {
    console.log(`Server is listening at http://${APP_HOST}:${APP_PORT}`);

    if (ENV_VARS.error) console.log(ENV_VARS.error);
    else if (NODE_ENV === 'dev') console.log(ENV_VARS.parsed);
});
