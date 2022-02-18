import * as httpTest from 'supertest';

import { app } from '../../index';
import { createUserInDB } from '../../utils/data';
import { initTestDB } from '../../utils/db_migrator';
import { genUserToken, toUserPayload } from '../../utils/user';
import { orderMock } from '../models/mocks';

describe('ORDERS API ROUTES:', () => {
    const httpClient = httpTest.default(app);

    const expectedResult = {
        id: 1,
        ...orderMock,
    };

    let token: string;

    beforeAll(async () => {
        await initTestDB();
        const user = await createUserInDB();
        token = genUserToken(toUserPayload(user));
    });

    describe('Given a valid admin or user token:', () => {
        describe('POST /orders', () => {
            it('should create a new order in database.', async () => {
                const resp = await httpClient
                    .post('/orders')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send(orderMock);

                expect(resp.statusCode).toBe(201);
                expect(resp.get('Content-Type')).toMatch(/json/);
                expect(resp.body).toEqual(expectedResult);
            });
        });

        describe('GET /orders', () => {
            it('should retrive a list of orders found in database.', async () => {
                const resp = await httpClient
                    .get('/orders')
                    .set('Authorization', `Bearer ${token}`);

                expect(resp.statusCode).toBe(200);
                expect(resp.get('Content-Type')).toMatch(/json/);
                expect(resp.body).toEqual(Array.of(expectedResult));
            });
        });

        describe('GET /orders/:id', () => {
            it('should retrieve an order, given an order id that exists in database.', async () => {
                const resp = await httpClient
                    .get('/orders/1')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`);

                expect(resp.statusCode).toBe(200);
                expect(resp.get('Content-Type')).toMatch(/json/);
                expect(resp.body).toEqual(expectedResult);
            });
        });

        describe('GET /orders/users/:id', () => {
            it('should retrieve a list of orders, made by a user id that exists in database.', async () => {
                const resp = await httpClient
                    .get('/orders/users/1')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`);

                expect(resp.statusCode).toBe(200);
                expect(resp.get('Content-Type')).toMatch(/json/);
                expect(resp.body).toEqual(Array.of(expectedResult));
            });
        });

        describe('DELETE /orders/:id', () => {
            it('should delete an order, given an id that exists in database.', async () => {
                const resp = await httpClient
                    .delete('/orders/1')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`);

                expect(resp.statusCode).toBe(200);
                expect(resp.get('Content-Type')).toMatch(/json/);
                expect(resp.body).toEqual(expectedResult);
            });
        });

        describe('GET /orders', () => {
            it('should retrive an empty list, when orders table is empty.', async () => {
                const resp = await httpClient
                    .get('/orders')
                    .set('Authorization', `Bearer ${token}`);

                expect(resp.statusCode).toBe(200);
                expect(resp.get('Content-Type')).toMatch(/json/);
                expect(resp.body).toEqual([]);
            });
        });
    });
});
