import * as pg from 'pg';
import DataModel from './model';

type Item = {
    order_id: number;
    product_id: number;
    quantity: number;
};

class ItemStore extends DataModel<Item> {
    constructor(dbPool: pg.Pool) {
        super(dbPool);
    }

    async index(): Promise<Item[]> {
        try {
            const result = await this.executeQuery(
                `SELECT * FROM order_items;`
            );
            return result.rows;
        } catch (err) {
            const error = err as Error;
            throw new Error(
                `Fetching Entire Ordered Items List -- ${error.message}`
            );
        }
    }

    async indexByOrder(id: number): Promise<Item[]> {
        try {
            const result = await this.executeQuery(
                `SELECT * FROM order_items WHERE order_id = ${id};`
            );
            return result.rows;
        } catch (err) {
            const error = err as Error;
            throw new Error(
                `Fetching Items in Order ID: ${id} -- ${error.message}`
            );
        }
    }

    async indexByProduct(id: number): Promise<Item[]> {
        try {
            const result = await this.executeQuery(
                `SELECT * FROM order_items WHERE product_id = ${id};`
            );
            return result.rows;
        } catch (err) {
            const error = err as Error;
            throw new Error(
                `Fetching Items with Product ID: ${id} -- ${error.message}`
            );
        }
    }

    async create(item: Item): Promise<Item> {
        try {
            const result = await this.executeQuery(
                `INSERT INTO order_items (order_id, product_id, quantity) VALUES` +
                    `(${item.order_id}, ${item.product_id}, ${item.quantity}) RETURNING *`
            );
            return result.rows[0];
        } catch (err) {
            const error = err as Error;
            throw new Error(`Creating New Item -- ${error.message}`);
        }
    }

    async deleteByOrder(id: number): Promise<number> {
        try {
            const result = await this.executeQuery(
                `DELETE FROM order_items WHERE order_id = ${id} RETURNING *`
            );
            return result.rowCount;
        } catch (err) {
            const error = err as Error;
            throw new Error(
                `Deleting Items in Order with ID: ${id} -- ${error.message}`
            );
        }
    }
}

export { Item, ItemStore };
