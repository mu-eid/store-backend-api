import dbClient from '../../database';
import { UserStore, User } from '../../models/user';
import { initTestDB } from '../../utils/db_migrator';

describe('User Data Model Actions', () => {
    const model = new UserStore(dbClient);

    const user: User = {
        first_name: 'Alan',
        last_name: 'Turing',
        password:
            '$2b$10$A8MGAjVIQJYfqpbIdPd4D.UwQdk6UzOjj7kTHjC/dilCFK8eeCk/i',
    };

    beforeAll(async () => {
        await initTestDB();
    });

    describe('Index Users', () => {
        describe('When users table is Empty', () => {
            it('should return an empty result.', async () => {
                const result = await model.index();
                expect(result).toEqual([]);
            });
        });
    });

    describe('Creating a new user', () => {
        it('should insert a new user, given a user object.', async () => {
            const result = await model.create(user);
            expect(result).toEqual(user);
        });
    });

    describe('Showing a user by ID', () => {
        it('should return a result that contains a user with specified ID', async () => {
            const result = await model.show(1);
            expect(result).toEqual({ id: 1, ...user });
        });
    });

    describe('Deleting a user by ID', () => {
        it('should delete a user, given a user id', async () => {
            const result = await model.delete(1);
            expect(result).toEqual({ id: 1, ...user });
        });
    });
});
