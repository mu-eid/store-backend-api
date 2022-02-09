import * as httpTest from 'supertest';
import * as bcrypt from 'bcrypt';

import { app } from '../../index';
import { User } from '../../models/user';
import { userMock } from '../models/mocks';
import { initTestDB } from '../../utils/db_migrator';

describe('User API Endpoints', () => {
    const httpClient = httpTest.default(app);

    let expectedResultRow: User;

    beforeAll(async () => {
        expectedResultRow = {
            ...userMock,
            id: 1,
            password: await bcrypt.hash(
                userMock.password,
                process.env.SALT_HASH as string
            ),
        };

        await initTestDB();
    });

    /*  beforeEach(async () => {
  });
 */
    describe('GET /users', () => {
        it('should return an empty response, when DB table is empty', async () => {
            const resp = await httpClient.get('/users');
            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual([]);
        });
    });

    describe('POST /users', () => {
        it('should create a new user, given well formed data', async () => {
            const resp = await httpClient
                .post('/users')
                .set('Accept', 'application/json')
                .send(userMock);

            expect(resp.statusCode).toBe(201);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(expectedResultRow);
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete a user, given a user ID that exists in DB table', async () => {
            const resp = await httpClient
                .delete('/users/1')
                .set('Accept', 'application/json');

            expect(resp.statusCode).toBe(200);
            expect(resp.get('Content-Type')).toMatch(/json/);
            expect(resp.body).toEqual(expectedResultRow);
        });
    });
});
