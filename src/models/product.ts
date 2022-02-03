import * as pg from 'pg';
import DataModel from './model';

type Product = {
    id?: number;
    name: string;
    price: number;
};

class ProductStore extends DataModel<Product> {
    constructor(dbPool: pg.Pool) {
        super(dbPool);
    }

    async index(): Promise<Product[]> {
        try {
            const result = await this.executeQuery(`SELECT * FROM products;`);
            return result.rows;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Fetching Product List -- ${error.message}`);
        }
    }

    async show(id: number): Promise<Product> {
        try {
            const result = await this.executeQuery(
                `SELECT * FROM products WHERE id = ${id}`
            );
            return result.rows[0];
        } catch (err) {
            const error = err as Error;
            throw new Error(
                `Fetching Product with ID: ${id} -- ${error.message}`
            );
        }
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
    async delete(id: number): Promise<Product> {
        try {
            const result = await this.executeQuery(
                `DELETE FROM products WHERE id = ${id} RETURNING *`
            );
            return result.rows[0];
        } catch (err) {
            const error = err as Error;
            throw new Error(
                `Deleting Product with ID: ${id} -- ${error.message}`
            );
        }
    }
}

export { Product, ProductStore };
