import * as pg from 'pg';

import DataModel from './model';
import { Table } from '../database';
import { encryptPassword } from '../utils/user';

type User = {
    id?: number;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
};

class UserNotFoundError extends Error {}

class UserStore extends DataModel<User> {
    constructor(db: pg.Pool) {
        super(db, Table.USERS);
    }

    async create(user: User): Promise<User> {
        try {
            const pass_digest = await encryptPassword(user.password);

            const result = await this.executeQuery(
                `INSERT INTO ${Table.USERS} (username, first_name, last_name, password) 
                 VALUES (
                     '${user.username}',
                     '${user.first_name}', 
                     '${user.last_name}', 
                     '${pass_digest}'
                    )
                 RETURNING *`
            );
            return result.rows[0];
        } catch (err) {
            const error = err as Error;
            throw new Error(`Creating new user -- ${error.message}`);
        }
    }

    async updateFirstName(id: number, name: string): Promise<User> {
        try {
            const result = await this.executeQuery(
                `UPDATE ${Table.USERS}
                 SET first_name = '${name}'
                 WHERE id = ${id}
                 RETURNING *`
            );
            return result.rows[0];
        } catch (err) {
            const error = err as Error;
            throw new Error(`Updating user's first name -- ${error.message}`);
        }
    }

    async updateLastName(id: number, name: string): Promise<User> {
        try {
            const result = await this.executeQuery(
                `UPDATE ${Table.USERS}
                 SET last_name = '${name}'
                 WHERE id = ${id}
                 RETURNING *`
            );
            return result.rows[0];
        } catch (err) {
            const error = err as Error;
            throw new Error(`Updating user's last name -- ${error.message}`);
        }
    }

    async updatePassword(id: number, password: string): Promise<User> {
        try {
            const digest = await encryptPassword(password);

            const result = await this.executeQuery(
                `UPDATE ${Table.USERS}
                 SET password = '${digest}'
                 WHERE id = ${id}
                 RETURNING *`
            );
            return result.rows[0];
        } catch (err) {
            const error = err as Error;
            throw new Error(`Updating user's password -- ${error.message}`);
        }
    }

    async fetchByUserName(username: string): Promise<User> {
        try {
            const result = await this.executeQuery(
                `SELECT * FROM ${Table.USERS} WHERE username = '${username}';`
            );

            if (result.rowCount === 0)
                throw new UserNotFoundError(
                    `No such user with username ${username} found in database.`
                );

            return result.rows[0];
        } catch (err) {
            const error = err as Error;
            if (error instanceof UserNotFoundError) throw error;
            throw new Error(`Fetching user by username -- ${error.message}`);
        }
    }
}

export { User, UserStore, UserNotFoundError };
