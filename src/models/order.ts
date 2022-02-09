import * as pg from 'pg';
import { Table } from '../database';
import DataModel from './model';

type Order = {
    id?: number;
    user_id: number;
    complete?: boolean;
};

class OrderStore extends DataModel<Order> {
    constructor(db: pg.Pool) {
        super(db, Table.ORDERS);
    }

    async create(order: Order): Promise<Order> {
        try {
            const result = await this.executeQuery(
                `INSERT INTO orders (user_id, complete) VALUES` +
                    `(${order.user_id}, ${order.complete}) RETURNING *`
            );
            return result.rows[0];
        } catch (err) {
            const error = err as Error;
            throw new Error(`Creating New Order -- ${error.message}`);
        }
    }

    async indexOrdersByUser(id: number): Promise<Order[]> {
        try {
            const result = await this.executeQuery(
                `SELECT * FROM orders WHERE user_id = ${id};`
            );
            return result.rows;
        } catch (err) {
            const error = err as Error;
            throw new Error(
                `Fetching Orders List by User_ID: ${id} -- ${error.message}`
            );
        }
    }

    async indexCompleteByUser(id: number): Promise<Order[]> {
        try {
            const result = await this.executeQuery(
                `SELECT * FROM orders WHERE user_id = ${id} AND complete = true;`
            );
            return result.rows;
        } catch (err) {
            const error = err as Error;
            throw new Error(
                `Fetching Completed Orders List by User_ID: ${id} -- ${error.message}`
            );
        }
    }
}

export { Order, OrderStore };
