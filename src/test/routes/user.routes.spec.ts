import * as httpTest from 'supertest';

import { app } from '../../index';
import { secondUserMock } from '../models/mocks';
import { initTestDB } from '../../utils/db_migrator';
import { genUserToken, stripPassword, toUserPayload } from '../../utils/user';
import { createUserInDB } from '../../utils/data';

describe('USERS ROUTES:', () => {
    const httpClient = httpTest.default(app);

    const userID = 2;

    const payloadMock = {
        ...stripPassword(secondUserMock),
        id: userID,
    };

    const responseShape = {
        user: payloadMock,
    };

    let authorizedUserToken: string;

    beforeAll(async () => {
        await initTestDB();
        const firstUser = await createUserInDB();
        authorizedUserToken = genUserToken(toUserPayload(firstUser));
    });

    describe('POST /users', () => {
        it('should create a new user in database, given a well-formed user entity.', async () => {
            const resp = await httpClient
                .post('/users')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${authorizedUserToken}`)
                .send(secondUserMock);

            const { created, token } = resp.body;

            expect(resp.statusCode).toBe(201);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(token).toBeDefined();
            expect(created.user).toEqual(responseShape.user);
        });
    });

    describe('GET /users/:id -- [Token Required]', () => {
        it('should return a user entity, given a user id that exists in database.', async () => {
            const resp = await httpClient
                .get(`/users/${userID}`)
                .set('Authorization', `Bearer ${authorizedUserToken}`);

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(responseShape);
        });
    });

    describe('GET /users -- [Token Required]', () => {
        it('should return non-empty list, when table is non-empty.', async () => {
            const resp = await httpClient
                .get('/users')
                .set('Authorization', `Bearer ${authorizedUserToken}`);

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(Array.isArray(resp.body)).toBeTrue();

            // At this state, it should be the case that
            // there are 2 users in users table one mock admin
            // and another newly created user.
            expect(resp.body.length).toBe(2);
            expect(resp.body[1]).toEqual(responseShape);
        });
    });

    describe('DELETE /users/:id -- [Token Required]', () => {
        it('should delete a user, given a user id that exists in table.', async () => {
            const resp = await httpClient
                .delete('/users/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${authorizedUserToken}`);

            // Expected response sturcture
            const deleteResponseShape = {
                deleted: responseShape,
            };

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(deleteResponseShape);
        });
    });
});
