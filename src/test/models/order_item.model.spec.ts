import dbClient from '../../database';
import { initTestDB } from '../../utils/db_migrator';
import { ItemStore } from '../../models/order_item';
import { itemMock } from './mocks';
import {
    createOrderInDB,
    createProductInDB,
    createUserInDB,
} from '../../utils/data';

describe('ORDER ITEMS DATA MODEL:', () => {
    const model = new ItemStore(dbClient);

    beforeAll(async () => {
        await initTestDB();
        await createUserInDB();
        await createProductInDB();
        await createOrderInDB();
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
