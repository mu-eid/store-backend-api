import * as pg from 'pg';
import * as bcrypt from 'bcrypt';
import DataModel from './model';
import { Table } from '../database';

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
      const pass_digest = await bcrypt.hash(
        user.password,
        process.env.SALT_HASH as string
      );
      const result = await this.executeQuery(
        `INSERT INTO users (first_name, last_name, password) VALUES` +
          ` ('${user.first_name}', '${user.last_name}', '${pass_digest}')` +
          ` RETURNING *`
      );
      return result.rows[0];
    } catch (err) {
      const error = err as Error;
      throw new Error(`Creating New User -- ${error.message}`);
    }
  }
}

export { User, UserStore };
