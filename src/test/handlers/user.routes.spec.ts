import * as httpTest from 'supertest';
import * as bcrypt from 'bcrypt';

import { app } from '../../index';
import { User } from '../../models/user';
import { userMock } from '../models/mocks';
import { initTestDB } from '../../utils/db_migrator';

describe('User API Endpoints', () => {
    const httpClient = httpTest.default(app);

    let expectedResult: User;

    beforeAll(async () => {
        expectedResult = {
            ...userMock,
            id: 1,
            password: await bcrypt.hash(
                userMock.password,
                process.env.SALT_HASH as string
            ),
        };

        await initTestDB();
    });

    describe('POST /users', () => {
        it('should create a new user, given a well-formed user entity.', async () => {
            const resp = await httpClient
                .post('/users')
                .set('Accept', 'application/json')
                .send(userMock);

            expect(resp.statusCode).toBe(201);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(expectedResult);
        });
    });

    describe('GET /users', () => {
        it('should return non-empty list, when table is non-empty.', async () => {
            const resp = await httpClient.get('/users');
            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(Array.of(expectedResult));
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete a user, given a user id that exists in table.', async () => {
            const resp = await httpClient
                .delete('/users/1')
                .set('Accept', 'application/json');

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(expectedResult);
        });
    });

    describe('GET /users', () => {
        it('should return an empty list, when table is empty.', async () => {
            const resp = await httpClient.get('/users');
            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual([]);
        });
    });
});
