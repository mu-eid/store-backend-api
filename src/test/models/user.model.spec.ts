import * as bcrypt from 'bcrypt';

import dbClient from '../../database';
import { User, UserStore } from '../../models/user';
import { initTestDB } from '../../utils/db_migrator';
import { userMock } from './mocks';

describe('User Data Model Actions', () => {
    const model = new UserStore(dbClient);

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

    describe('Creating a new user', () => {
        it('should insert a new user into table, given a user well-formed entity.', async () => {
            const result = await model.create(userMock);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('Showing a user by ID', () => {
        it('should return a result that contains a user with that id from table.', async () => {
            const result = await model.show(1);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('Indexing Users', () => {
        describe('When users table is non-empty', () => {
            it('should return a list of one entity at least.', async () => {
                const result = await model.index();
                expect(result).toEqual(Array.of(expectedResult));
            });
        });
    });

    describe('Deleting a user by ID', () => {
        it('should delete a user, given a user id that exists in table', async () => {
            const result = await model.delete(1);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('Indexing Users', () => {
        describe('When users table is Empty', () => {
            it('should return an empty list.', async () => {
                const result = await model.index();
                expect(result).toEqual([]);
            });
        });
    });
});
