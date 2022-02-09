import dbClient from '../../database';
import { OrderStore } from '../../models/order';
import { ProductStore } from '../../models/product';
import { UserStore } from '../../models/user';
import { initTestDB } from '../../utils/db_migrator';
import { orderMock, productMock, userMock } from './mocks';

describe('Order Data Model Actions', () => {
    // DB Tables
    const usersTable = new UserStore(dbClient);
    const productsTable = new ProductStore(dbClient);
    const ordersTable = new OrderStore(dbClient);

    const expectedResult = {
        id: 1,
        ...orderMock,
    };

    // Test suites
    beforeAll(async () => {
        await initTestDB();
        await usersTable.create(userMock);
        await productsTable.create(productMock);
    });

    describe('Creating a new order', () => {
        it('should insert a new created order into orders table.', async () => {
            const result = await ordersTable.create(orderMock);
            expect(result.id).toBe(1);
            expect(result.user_id).toBe(1);
            expect(result.complete).toBeFalse();
        });
    });

    describe('Indexing orders by USER_ID', () => {
        it('should retrieve all orders made by a specific USER_ID', async () => {
            const result = await ordersTable.indexOrdersByUser(1);
            expect(result).toEqual(Array.of(expectedResult));
        });
    });

    describe('Showing an order by ID', () => {
        it('should retrieve an order, given a specific order ID', async () => {
            const result = await ordersTable.show(1);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('Deleting an order by ID', () => {
        it('should delete an order, given an order id that exists in table.', async () => {
            const result = await ordersTable.delete(1);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('Indexing orders', () => {
        it('should return an empty result, when orders table is empty.', async () => {
            const result = await ordersTable.index();
            expect(result).toEqual([]);
        });
    });
});
