import * as bcrypt from 'bcrypt';

import dbClient, { Table } from '../../database';
import { User, UserStore } from '../../models/user';
import { initTestDB } from '../../utils/db_migrator';
import { firstUserMock } from './mocks';

describe('USER DATA MODEL:', () => {
    const model = new UserStore(dbClient);

    const userID = 1;
    let expectedResult: User;

    beforeAll(async () => {
        expectedResult = {
            ...firstUserMock,
            id: userID,
            password: await bcrypt.hash(
                firstUserMock.password,
                process.env.SALT_HASH as string
            ),
        };

        await initTestDB();
    });

    describe('Creating a new user:', () => {
        it('should insert a new user into table, given a user well-formed entity.', async () => {
            const result = await model.create(firstUserMock);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('Showing a user by ID:', () => {
        it('should return a result that contains a user with that id from table.', async () => {
            const result = await model.show(userID);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('Indexing Users:', () => {
        describe('When users table is non-empty', () => {
            it('should return a list of one entity at least.', async () => {
                const result = await model.index();
                expect(result.length).toBe(1);
                expect(result[0]).toEqual(expectedResult);
            });
        });
    });

    describe('Deleting a user by ID:', () => {
        it('should delete a user, given a user id that exists in table', async () => {
            const result = await model.delete(userID);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('Indexing Users:', () => {
        describe('When users table is Empty', () => {
            it('should return an empty result.', async () => {
                await model.executeQuery(`DELETE FROM ${Table.USERS};`); // Delete all rows
                const result = await model.index();
                expect(result).toEqual([]);
            });
        });
    });

    describe('Updating user data:', () => {
        const update = {
            first_name: 'FirstNameUpdated',
            last_name: 'LastNameUpdated',
            password: 'PasswordUdated',
        };

        let id: number;

        beforeAll(async () => {
            const result = await model.create(firstUserMock);
            id = result.id as number;
        });

        describe('Updating first name:', () => {
            it("should update the user's first name, given a name value.", async () => {
                const result = await model.updateFirstName(
                    id,
                    update.first_name
                );
                expect(result.first_name).toBe(update.first_name);
            });
        });

        describe('Updating last name:', () => {
            it("should update the user's last name, given a name value.", async () => {
                const result = await model.updateLastName(id, update.last_name);
                expect(result.last_name).toBe(update.last_name);
            });
        });

        describe('Updating password:', () => {
            it("should update the user's first name, given a name value.", async () => {
                const result = await model.updatePassword(id, update.password);
                expect(result.password).toBeDefined();
                expect(result.password.length).toBe(60);
            });
        });
    });
});
