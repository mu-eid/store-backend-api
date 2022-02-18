import * as httpTest from 'supertest';

import { initTestDB } from '../../utils/db_migrator';
import { app } from '../../index';

import { itemMock } from '../models/mocks';
import { genUserToken, toUserPayload } from '../../utils/user';
import {
    createOrderInDB,
    createProductInDB,
    createUserInDB,
} from '../../utils/data';

describe('items API Endpoints', () => {
    const httpClient = httpTest.default(app);

    let token: string;

    beforeAll(async () => {
        await initTestDB();
        const user = await createUserInDB();
        await createProductInDB();
        await createOrderInDB();
        token = genUserToken(toUserPayload(user));
    });

    describe('POST /items', () => {
        it('should create a new item in table, given an order and product IDs that exist in database.', async () => {
            const resp = await httpClient
                .post('/items')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(itemMock);

            expect(resp.statusCode).toBe(201);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(itemMock);
        });
    });

    describe('GET /items', () => {
        it('should retrive a list of items found in table.', async () => {
            const resp = await httpClient
                .get('/items')
                .set('Authorization', `Bearer ${token}`);

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(Array.of(itemMock));
        });
    });

    describe('GET /items/order/:id', () => {
        it('should retrieve an item list, given an order id that exists in database.', async () => {
            const resp = await httpClient
                .get('/items/order/1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(Array.of(itemMock));
        });
    });

    describe('GET /items/product/:id', () => {
        it('should retrieve a list of items, given product id that exists in database.', async () => {
            const resp = await httpClient
                .get('/items/product/1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(Array.of(itemMock));
        });
    });

    describe('DELETE /items/order/:id', () => {
        it('should delete an order, given an id that exists in database.', async () => {
            const resp = await httpClient
                .delete('/items/order/1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(Array.of(itemMock));
        });
    });

    describe('GET /items', () => {
        it('should retrive an empty list, when items table is empty.', async () => {
            const resp = await httpClient
                .get('/items')
                .set('Authorization', `Bearer ${token}`);

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual([]);
        });
    });
});
