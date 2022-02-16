import * as dotenv from 'dotenv';
import * as pg from 'pg';

import { ENV_PATH } from './utils/path';

// SIDE EFFECT: Loading env variables into process.env
dotenv.config({ path: ENV_PATH });

const { HOST, PG_USER, PG_PASS, DB_DEV, DB_TEST } = process.env;

const dbClient = new pg.Pool({
    user: PG_USER,
    password: PG_PASS,
    host: HOST,
    database: process.env.NODE_ENV === 'dev' ? DB_DEV : DB_TEST,
});

// Table names constants
export enum Table {
    USERS = 'users',
    PRODUCTS = 'products',
    ORDERS = 'orders',
    ORDER_ITEMS = 'order_items',
}

export default dbClient;
