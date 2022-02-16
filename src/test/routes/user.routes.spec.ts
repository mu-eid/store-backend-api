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

    const expectedResult = {
        created: {
            ...stripUserPassword(userMock),
            id: 2,
        },
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

                expect(resp.statusCode).toBe(201);
                expect(resp.get('Content-Type')).toMatch(/json/);
                expect(token).toBeDefined();
                expect(created).toEqual(expectedResult.created);
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
                expect(resp.body.length).toBe(2);
                expect(resp.body[1]).toEqual(expectedResult.created);
            });
        });

        describe('DELETE /users/:id -- [Token Required]', () => {
            it('should delete a user, given a user id that exists in table.', async () => {
                const resp = await httpClient
                    .delete('/users/2')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${adminToken}`);

                expect(resp.statusCode).toBe(200);
                expect(resp.get('Content-Type')).toMatch(/json/);
                expect(resp.body).toEqual(expectedResult.created);
            });
        });

        xdescribe('GET /users -- [Token Required]', () => {
            it('should return an empty list, when table is empty.', async () => {
                const resp = await httpClient
                    .get('/users')
                    .set('Authorization', `Bearer ${adminToken}`);

                expect(resp.statusCode).toBe(200);
                expect(resp.get('Content-Type')).toMatch(/json/);
                expect(resp.body).toEqual([]);
            });
        });
    });
});
