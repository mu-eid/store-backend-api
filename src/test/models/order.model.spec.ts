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

  // Test suites
  beforeAll(async () => {
    await initTestDB();
    await usersTable.create(userMock);
    await productsTable.create(productMock);
  });

  describe('Indexing orders', () => {
    it('should return an empty result, when orders table is empty.', async () => {
      expect(await ordersTable.index()).toEqual([]);
    });
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
      expect(result).toEqual(Array.of({ id: 1, ...orderMock }));
    });
  });

  describe('Showing an order by ID', () => {
    it('should retrieve an order, given a specific order ID', async () => {
      const result = await ordersTable.show(1);
      expect(result).toEqual({ id: 1, ...orderMock });
    });
  });

  describe('Deleting an order by ID', () => {
    it('should delete an order, given its ID and it exists in order table.', async () => {
      const result = await ordersTable.delete(1);
      expect(result).toEqual({ id: 1, ...orderMock });
    });
  });
});
