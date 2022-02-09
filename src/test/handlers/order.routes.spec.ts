import * as httpTest from 'supertest';
import dbClient from '../../database';
import { app } from '../../index';
import { Order } from '../../models/order';
import { UserStore } from '../../models/user';
import { initTestDB } from '../../utils/db_migrator';
import { orderMock, userMock } from '../models/mocks';

describe('Orders API Endpoints', () => {
    const httpClient = httpTest.default(app);
    let expectedResultRow: Order;

    beforeAll(async () => {
        expectedResultRow = {
            id: 1,
            ...orderMock,
        };

        await initTestDB();
        await new UserStore(dbClient).create(userMock); // for obtaining user_id
    });

    describe('POST /orders', () => {
        it('should create a new order in database.', async () => {
            const resp = await httpClient
                .post('/orders')
                .set('Accept', 'application/json')
                .send(orderMock);

            expect(resp.statusCode).toBe(201);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(expectedResultRow);
        });
    });

    describe('GET /orders', () => {
        it('should retrive a list of orders found in database.', async () => {
            const resp = await httpClient.get('/orders');
            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(Array.of(expectedResultRow));
        });
    });

    describe('GET /orders/:id', () => {
        it('should retrieve an order, given an ID that exists in database.', async () => {
            const resp = await httpClient
                .get('/orders/1')
                .set('Accept', 'application/json');

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(expectedResultRow);
        });
    });

    describe('GET /orders/users/:id', () => {
        it('should retrieve a list of orders, made by a user ID that exists in database.', async () => {
            const resp = await httpClient
                .get('/orders/users/1')
                .set('Accept', 'application/json');

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(Array.of(expectedResultRow));
        });
    });

    describe('DELETE /orders/:id', () => {
        it('should delete an order, given an ID that exists in database.', async () => {
            const resp = await httpClient
                .delete('/orders/1')
                .set('Accept', 'application/json');

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(expectedResultRow);
        });
    });

    describe('GET /orders', () => {
        it('should retrive an empty list of orders, when orders table is empty.', async () => {
            const resp = await httpClient.get('/orders');
            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual([]);
        });
    });
});
