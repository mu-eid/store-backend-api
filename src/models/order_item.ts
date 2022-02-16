import * as pg from 'pg';
import { Table } from '../database';
import DataModel from './model';

type Item = {
    order_id: number;
    product_id: number;
    quantity: number;
};

class ItemStore extends DataModel<Item> {
    constructor(dbPool: pg.Pool) {
        super(dbPool, Table.ORDER_ITEMS);
    }

    async indexByOrder(id: number): Promise<Item[]> {
        try {
            const result = await this.executeQuery(
                `SELECT * FROM ${Table.ORDER_ITEMS} WHERE order_id = ${id};`
            );
            return result.rows;
        } catch (err) {
            const error = err as Error;
            throw new Error(
                `Fetching Items in Order ID: ${id} -- ${error.message}`
            );
        }
    }

    /**
     * Fetch a list of order items representing that product.
     * @param id product id needed to be indexed
     * @returns list of order items.
     */
    async indexByProduct(id: number): Promise<Item[]> {
        try {
            const result = await this.executeQuery(
                `SELECT * FROM ${Table.ORDER_ITEMS} WHERE product_id = ${id};`
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
                `INSERT INTO ${Table.ORDER_ITEMS} (order_id, product_id, quantity) 
                 VALUES (${item.order_id}, ${item.product_id}, ${item.quantity}) 
                 RETURNING *`
            );
            return result.rows[0];
        } catch (err) {
            const error = err as Error;
            throw new Error(`Creating New Item -- ${error.message}`);
        }
    }

    async deleteByOrder(id: number): Promise<Item[]> {
        try {
            const result = await this.executeQuery(
                `DELETE FROM ${Table.ORDER_ITEMS} WHERE order_id = ${id} RETURNING *`
            );
            return result.rows;
        } catch (err) {
            const error = err as Error;
            throw new Error(
                `Deleting Items in Order with ID: ${id} -- ${error.message}`
            );
        }
    }
}

export { Item, ItemStore };
