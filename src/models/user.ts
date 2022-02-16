import * as pg from 'pg';

import DataModel from './model';
import { Table } from '../database';
import { encryptPassword } from '../utils/user';

type User = {
    id?: number;
    first_name: string;
    last_name: string;
    password: string;
};

class UserStore extends DataModel<User> {
    constructor(db: pg.Pool) {
        super(db, Table.USERS);
    }

    async create(user: User): Promise<User> {
        try {
            const pass_digest = await encryptPassword(user.password);

            const result = await this.executeQuery(
                `INSERT INTO ${Table.USERS} (first_name, last_name, password) 
                 VALUES ('${user.first_name}', '${user.last_name}', '${pass_digest}')
                 RETURNING *`
            );
            return result.rows[0];
        } catch (err) {
            const error = err as Error;
            throw new Error(`Creating New User -- ${error.message}`);
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
            throw new Error(`Updating user first name -- ${error.message}`);
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
            throw new Error(`Updating user last name -- ${error.message}`);
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
            throw new Error(`Updating user first name -- ${error.message}`);
        }
    }
}

export { User, UserStore };
