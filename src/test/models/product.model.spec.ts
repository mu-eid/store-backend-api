import dbClient from '../../database';
import { Product, ProductStore } from '../../models/product';
import { initTestDB } from '../../utils/db_migrator';

describe('Product Data Model Actions', () => {
    const model = new ProductStore(dbClient);

    const product: Product = {
        name: 'The Algorithm Design Manual',
        price: 69.17,
    };

    beforeAll(async () => {
        await initTestDB();
    });

    describe('Indexing products', () => {
        it('should return an empty result when table is empty.', async () => {
            const result = await model.index();
            expect(result).toEqual([]);
        });
    });

    describe('Creating a new product', () => {
        it('should insert a product into table, given a product object.', async () => {
            const result = await model.create(product);
            expect(result).toEqual({ id: 1, ...product });
        });
    });

    describe('Showing a product by ID', () => {
        it('should return a product, given an ID and that product exists.', async () => {
            const result = await model.show(1);
            expect(result).toEqual({ id: 1, ...product });
        });
    });

    describe('Deleting a product by ID', () => {
        it('should delete a product, given an ID and that product exists.', async () => {
            const result = await model.delete(1);
            expect(result).toEqual({ id: 1, ...product });
        });
    });
});
