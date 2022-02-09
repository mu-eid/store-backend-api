import dbClient from '../../database';
import { initTestDB } from '../../utils/db_migrator';
import { ItemStore } from '../../models/order_item';
import { orderMock, productMock, userMock, itemMock } from './mocks';
import { UserStore } from '../../models/user';
import { ProductStore } from '../../models/product';
import { OrderStore } from '../../models/order';

describe('Order Items Actions', () => {
    // DB Tables
    const usersTable = new UserStore(dbClient);
    const productsTable = new ProductStore(dbClient);
    const ordersTable = new OrderStore(dbClient);

    // Test subject
    const model = new ItemStore(dbClient);

    beforeAll(async () => {
        await initTestDB();
        await usersTable.create(userMock);
        await productsTable.create(productMock);
        await ordersTable.create(orderMock);
    });

    describe('Creating new order items', () => {
        it('should insert a new item into table, given a well-formed item entity.', async () => {
            const result = await model.create(itemMock);
            expect(result).toEqual(itemMock);
        });
    });

    describe('Indexing items', () => {
        describe('By ORDER_ID', () => {
            it('should retrieve all items in a specific order, given its id.', async () => {
                const result = await model.indexByOrder(1);
                expect(result).toEqual(Array.of(itemMock));
            });
        });

        describe('By PRODUCT_ID', () => {
            it('should retrieve all items represents a specific product, given the product id.', async () => {
                const result = await model.indexByProduct(1);
                expect(result).toEqual(Array.of(itemMock));
            });
        });
    });

    describe('Deleting Items', () => {
        it('should delete all items in an order, given an order id.', async () => {
            const result = await model.deleteByOrder(1);
            expect(result).toEqual(Array.of(itemMock));
        });
    });
});
