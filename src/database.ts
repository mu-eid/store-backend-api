import * as dotenv from 'dotenv';
import * as pg from 'pg';

import { ENV_PATH } from './utils/path';

// SIDE EFFECT: Loading env variables into process.env
dotenv.config({ path: ENV_PATH });

const { PG_HOST, PG_USER, PG_PASS, DB_DEV, DB_TEST } = process.env;

const dbClient = new pg.Pool({
  user: PG_USER,
  password: PG_PASS,
  host: PG_HOST,
  database: process.env.NODE_ENV === 'dev' ? DB_DEV : DB_TEST,
});

export default dbClient;
