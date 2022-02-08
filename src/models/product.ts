import * as pg from 'pg';
import { Table } from '../database';
import DataModel from './model';

type Product = {
  id?: number;
  name: string;
  price: number;
};

class ProductStore extends DataModel<Product> {
  constructor(db: pg.Pool) {
    super(db, Table.PRODUCTS);
  }

  async create(product: Product): Promise<Product> {
    try {
      const result = await this.executeQuery(
        `INSERT INTO products (name, price) VALUES` +
          ` ('${product.name}', ${product.price}) RETURNING *`
      );
      return result.rows[0];
    } catch (err) {
      const error = err as Error;
      throw new Error(`Creating New Product -- ${error.message}`);
    }
  }
}

export { Product, ProductStore };
