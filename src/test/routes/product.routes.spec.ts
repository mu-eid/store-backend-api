import * as httpTest from 'supertest';

import { app } from '../../index';
import { createUserInDB } from '../../utils/data';
import { initTestDB } from '../../utils/db_migrator';
import { genUserToken, toUserPayload } from '../../utils/user';
import { productMock } from '../models/mocks';

describe('PRODUCTS API ROUTES', () => {
    const httpClient = httpTest.default(app);

    const expectedResult = {
        id: 1,
        ...productMock,
    };

    let token: string;

    beforeAll(async () => {
        await initTestDB();
        const user = await createUserInDB();
        token = genUserToken(toUserPayload(user));
    });

    describe('Given a valid admin or user token', () => {
        describe('POST /products -- [Token Required]', () => {
            it('should create a new product in table, given a well-formed product entity.', async () => {
                const resp = await httpClient
                    .post('/products')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Beare ${token}`)
                    .send(productMock);

                expect(resp.statusCode).toBe(201);
                expect(resp.get('Content-Type')).toMatch(/json/);
                expect(resp.body).toEqual(expectedResult);
            });
        });
    });

    describe('GET /products', () => {
        it('should retrive a list of products found in database.', async () => {
            const resp = await httpClient.get('/products');
            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(Array.of(expectedResult));
        });
    });

    describe('GET /products/:id', () => {
        it('should retrieve a product, given a product id that exists in database.', async () => {
            const resp = await httpClient
                .get('/products/1')
                .set('Accept', 'application/json');

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(expectedResult);
        });
    });

    describe('Given a valid admin or user token', () => {
        describe('DELETE /products/:id -- [Token Required]', () => {
            it('should delete a product, given a product id that exists in database.', async () => {
                const resp = await httpClient
                    .delete('/products/1')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`);

                expect(resp.statusCode).toBe(200);
                expect(resp.get('Content-Type')).toMatch(/json/);
                expect(resp.body).toEqual(expectedResult);
            });
        });
    });

    describe('GET /products', () => {
        it('should retrive an empty list of products, when table is empty.', async () => {
            const resp = await httpClient.get('/products');
            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual([]);
        });
    });
});
