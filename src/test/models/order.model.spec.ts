import dbClient from '../../database';
import { Order, OrderStore } from '../../models/order';
import { Product, ProductStore } from '../../models/product';
import { User, UserStore } from '../../models/user';
import { initTestDB } from '../../utils/db_migrator';

describe('Order Data Model Actions', () => {
    // Data models
    const orderModel = new OrderStore(dbClient);
    const userModel = new UserStore(dbClient);
    const productModel = new ProductStore(dbClient);

    // Mock objects
    const userMock: User = {
        first_name: 'Martin',
        last_name: 'Odersky',
        password:
            '$2b$10$A8MGAjVIQJYfqpbIdPd4D.UwQdk6UzOjj7kTHjC/dilCFK8eeCk/i',
    };

    const productMock: Product = {
        name: 'Programming Scala, 5th Edition',
        price: 59.99,
    };

    const orderMock: Order = {
        user_id: 1,
        complete: false,
    };

    // Test suites
    beforeAll(async () => {
        await initTestDB();
        await userModel.create(userMock);
        await productModel.create(productMock);
    });

    describe('Indexing orders', () => {
        it('should return an empty result, when orders table is empty.', async () => {
            expect(await orderModel.index()).toEqual([]);
        });
    });

    describe('Creating a new order', () => {
        it('should insert a new created order into orders table.', async () => {
            const result = await orderModel.create(orderMock);
            expect(result.id).toBe(1);
            expect(result.user_id).toBe(1);
            expect(result.complete).toBeFalse();
        });
    });

    describe('Indexing orders by USER_ID', () => {
        it('should retrieve all orders made by a specific USER_ID', async () => {
            const result = await orderModel.indexOrdersByUser(1);
            expect(result).toEqual(Array.of({ id: 1, ...orderMock }));
        });
    });

    describe('Showing an order by ID', () => {
        it('should retrieve an order, given a specific order ID', async () => {
            const result = await orderModel.show(1);
            expect(result).toEqual({ id: 1, ...orderMock });
        });
    });

    describe('Deleting an order by ID', () => {
        it('should delete an order, given its ID and it exists in order table.', async () => {
            const result = await orderModel.delete(1);
            expect(result).toEqual({ id: 1, ...orderMock });
        });
    });

    
});
