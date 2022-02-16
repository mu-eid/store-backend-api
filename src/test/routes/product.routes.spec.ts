import * as httpTest from 'supertest';

import { app } from '../../index';
import { initTestDB } from '../../utils/db_migrator';
import { productMock } from '../models/mocks';
import { getAdminToken } from '../../utils/user';

describe('PRODUCTS API ROUTES', () => {
    const httpClient = httpTest.default(app);

    const expectedResult = {
        id: 1,
        ...productMock,
    };

    const adminToken = getAdminToken();

    beforeAll(async () => {
        // Set up test database
        await initTestDB();
    });

    describe('Given a valid admin or user token', () => {
        describe('POST /products -- [Token Required]', () => {
            it('should create a new product in table, given a well-formed product entity.', async () => {
                const resp = await httpClient
                    .post('/products')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Beare ${adminToken}`)
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
                    .set('Authorization', `Bearer ${adminToken}`);

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
