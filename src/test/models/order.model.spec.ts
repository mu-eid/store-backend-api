import dbClient from '../../database';
import { OrderStore } from '../../models/order';
import { createProductInDB, createUserInDB } from '../../utils/data';
import { initTestDB } from '../../utils/db_migrator';
import { orderMock } from './mocks';


describe('ORDER DATA MODEL:', () => {
    const model = new OrderStore(dbClient);

    const expectedResult = {
        id: 1,
        ...orderMock,
    };

    beforeAll(async () => {
        await initTestDB();
        await createUserInDB();
        await createProductInDB();
    });

    describe('Creating a new order', () => {
        it('should insert a new created order into orders table.', async () => {
            const result = await model.create(orderMock);
            expect(result.id).toBe(1);
            expect(result.user_id).toBe(1);
            expect(result.complete).toBeFalse();
        });
    });

    describe('Indexing orders by USER_ID', () => {
        it('should retrieve all orders made by a specific USER_ID', async () => {
            const result = await model.indexOrdersByUser(1);
            expect(result).toEqual(Array.of(expectedResult));
        });
    });

    describe('Showing an order by ID', () => {
        it('should retrieve an order, given a specific order ID', async () => {
            const result = await model.show(1);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('Deleting an order by ID', () => {
        it('should delete an order, given an order id that exists in table.', async () => {
            const result = await model.delete(1);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('Indexing orders', () => {
        it('should return an empty result, when orders table is empty.', async () => {
            const result = await model.index();
            expect(result).toEqual([]);
        });
    });
});
