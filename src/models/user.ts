import * as pg from 'pg';
import * as bcrypt from 'bcrypt';
import DataModel from './model';

type User = {
  id?: number;
  first_name: string;
  last_name: string;
  password: string;
};

class UserStore extends DataModel<User> {
  constructor(db: pg.Pool) {
    super(db);
  }

  async index(): Promise<User[]> {
    try {
      const result = await this.executeQuery(`SELECT * FROM users;`);
      return result.rows;
    } catch (err) {
      const error = err as Error;
      throw new Error(`Fetching User List -- ${error.message}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const result = await this.executeQuery(
        `SELECT * FROM users WHERE id = ${id};`
      );
      return result.rows[0];
    } catch (err) {
      const error = err as Error;
      throw new Error(`Fetching User with ID: ${id} -- ${error.message}`);
    }
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

  async delete(id: number): Promise<User> {
    try {
      const result = await this.executeQuery(
        `DELETE FROM users WHERE id = ${id} RETURNING *`
      );
      return result.rows[0];
    } catch (err) {
      const error = err as Error;
      throw new Error(`Deleting User with ID: ${id} -- ${error.message}`);
    }
  }
}

export { User, UserStore };
