import dbClient from '../../database';
import { ProductStore } from '../../models/product';
import { initTestDB } from '../../utils/db_migrator';
import { productMock } from './mocks';

describe('Product Data Model Actions', () => {
    const model = new ProductStore(dbClient);

    const expectedResult = {
        id: 1,
        ...productMock,
    };

    beforeAll(async () => {
        await initTestDB();
    });

    describe('Creating a new product', () => {
        it('should insert a product into table, given a well-formed product entity.', async () => {
            const result = await model.create(productMock);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('Showing a product by ID', () => {
        it('should return a product, given a product id that exists in table.', async () => {
            const result = await model.show(1);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('Indexing products', () => {
        it('should return a list of one product at least when table is non-empty.', async () => {
            const result = await model.index();
            expect(result).toEqual(Array.of(expectedResult));
        });
    });

    describe('Deleting a product by ID', () => {
        it('should delete a product, given a product id that exists in table.', async () => {
            const result = await model.delete(1);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('Indexing products', () => {
        it('should return an empty list when table is empty.', async () => {
            const result = await model.index();
            expect(result).toEqual([]);
        });
    });
});
