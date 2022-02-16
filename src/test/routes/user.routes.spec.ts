import * as httpTest from 'supertest';

import { app } from '../../index';
import { userMock } from '../models/mocks';
import { initTestDB } from '../../utils/db_migrator';
import {
    getAdminToken,
    stripUserPassword,
    UserCredentials,
} from '../../utils/user';

describe('USERS API ROUTES', () => {
    const httpClient = httpTest.default(app);

    const expectedPayload = {
        ...stripUserPassword(userMock),
        id: 2,
    };

    // Expected response sturcture
    const expectedEntityResp = {
        user: expectedPayload,
    };

    const adminToken = getAdminToken();

    beforeAll(async () => {
        await initTestDB();
    });

    describe('Given a valid admin or user token:', () => {
        describe('POST /users -- [Token Required]', () => {
            it('should create a new user entity in database, given a well-formed user entity.', async () => {
                const resp = await httpClient
                    .post('/users')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send(userMock);

                const { created, token } = resp.body as {
                    created: UserCredentials;
                    token: string;
                };

                const expectedEntityResp = {
                    created: expectedPayload,
                };

                expect(resp.statusCode).toBe(201);
                expect(resp.get('Content-Type')).toMatch(/json/);
                expect(token).toBeDefined();
                expect(created).toEqual(expectedEntityResp.created);
            });
        });

        describe('GET /users/:id -- [Token Required]', () => {
            it('should return a user entity, given a user id that exists in database.', async () => {
                const resp = await httpClient
                    .get('/users/2')
                    .set('Authorization', `Bearer ${adminToken}`);

                expect(resp.statusCode).toBe(200);
                expect(resp.get('Content-Type')).toMatch(/json/);
                expect(resp.body).toEqual(expectedEntityResp);
            });
        });
    });

    describe('GET /users -- [Token Required]', () => {
        it('should return non-empty list, when table is non-empty.', async () => {
            const resp = await httpClient
                .get('/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(Array.isArray(resp.body)).toBeTrue();

            // At this state, it should be the case that
            // there are 2 users in users table one mock admin
            // and another newly created user.
            expect(resp.body.length).toBe(2);
            expect(resp.body[1]).toEqual(expectedEntityResp);
        });
    });

    describe('DELETE /users/:id -- [Token Required]', () => {
        it('should delete a user, given a user id that exists in table.', async () => {
            const resp = await httpClient
                .delete('/users/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${adminToken}`);

            // Expected response sturcture
            const expectedDeleteResp = {
                deleted: expectedEntityResp,
            };

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(expectedDeleteResp);
        });
    });
});
