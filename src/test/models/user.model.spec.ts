import * as bcrypt from 'bcrypt';

import dbClient from '../../database';
import { User, UserStore } from '../../models/user';
import { initTestDB } from '../../utils/db_migrator';
import { userMock } from './mocks';

describe('User Data Model Actions', () => {
  const model = new UserStore(dbClient);

  let expectedUserResult: User;

  beforeAll(async () => {
    expectedUserResult = {
      ...userMock,
      id: 1,
      password: await bcrypt.hash(
        userMock.password,
        process.env.SALT_HASH as string
      ),
    };

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
      const result = await model.create(userMock);
      expect(result).toEqual(expectedUserResult);
    });
  });

  describe('Showing a user by ID', () => {
    it('should return a result that contains a user with specified ID', async () => {
      const result = await model.show(1);
      expect(result).toEqual(expectedUserResult);
    });
  });

  describe('Deleting a user by ID', () => {
    it('should delete a user, given a user id', async () => {
      const result = await model.delete(1);
      expect(result).toEqual(expectedUserResult);
    });
  });
});
