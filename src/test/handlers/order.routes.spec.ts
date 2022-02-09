import * as httpTest from 'supertest';
import dbClient from '../../database';
import { app } from '../../index';
import { UserStore } from '../../models/user';
import { initTestDB } from '../../utils/db_migrator';
import { orderMock, userMock } from '../models/mocks';

describe('Orders API Endpoints', () => {
    const httpClient = httpTest.default(app);
    const userTable = new UserStore(dbClient);
    const expectedResult = {
        id: 1,
        ...orderMock,
    };

    beforeAll(async () => {
        await initTestDB();
        await userTable.create(userMock); // for obtaining user_id
    });

    describe('POST /orders', () => {
        it('should create a new order in orders table.', async () => {
            const resp = await httpClient
                .post('/orders')
                .set('Accept', 'application/json')
                .send(orderMock);

            expect(resp.statusCode).toBe(201);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(expectedResult);
        });
    });

    describe('GET /orders', () => {
        it('should retrive a list of orders found in database.', async () => {
            const resp = await httpClient.get('/orders');
            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(Array.of(expectedResult));
        });
    });

    describe('GET /orders/:id', () => {
        it('should retrieve an order, given an order id that exists in table.', async () => {
            const resp = await httpClient
                .get('/orders/1')
                .set('Accept', 'application/json');

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(expectedResult);
        });
    });

    describe('GET /orders/users/:id', () => {
        it('should retrieve a list of orders, made by a user ID that exists in table.', async () => {
            const resp = await httpClient
                .get('/orders/users/1')
                .set('Accept', 'application/json');

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(Array.of(expectedResult));
        });
    });

    describe('DELETE /orders/:id', () => {
        it('should delete an order, given an ID that exists in table.', async () => {
            const resp = await httpClient
                .delete('/orders/1')
                .set('Accept', 'application/json');

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(expectedResult);
        });
    });

    describe('GET /orders', () => {
        it('should retrive an empty list, when orders table is empty.', async () => {
            const resp = await httpClient.get('/orders');
            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual([]);
        });
    });
});
