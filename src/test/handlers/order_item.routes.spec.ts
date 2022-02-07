import * as httpTest from 'supertest';

import dbClient from '../../database';
import { initTestDB } from '../../utils/db_migrator';
import { app } from '../../index';
import { UserStore } from '../../models/user';
import { ProductStore } from '../../models/product';
import { OrderStore } from '../../models/order';

import { orderMock, userMock, productMock, itemMock } from '../models/mocks';

describe('items API Endpoints', () => {
  const httpClient = httpTest.default(app);

  beforeAll(async () => {
    await initTestDB();
    await new UserStore(dbClient).create(userMock); // for obtaining user_id
    await new ProductStore(dbClient).create(productMock); // obtaining product_id
    await new OrderStore(dbClient).create(orderMock); // obtaining order_id
  });

  describe('POST /items', () => {
    it('should create a new item in database, given an order and product IDs that exist in database.', async () => {
      const resp = await httpClient
        .post('/items')
        .set('Accept', 'application/json')
        .send(itemMock);

      expect(resp.statusCode).toBe(201);
      expect(resp.get('Content-Type')).toMatch(/json/);
      expect(resp.body).toEqual(itemMock);
    });
  });

  describe('GET /items', () => {
    it('should retrive a list of items found in database.', async () => {
      const resp = await httpClient.get('/items');
      expect(resp.statusCode).toBe(200);
      expect(resp.get('Content-Type')).toMatch(/json/);
      expect(resp.body).toEqual(Array.of(itemMock));
    });
  });

  describe('GET /items/order/:id', () => {
    it('should retrieve an item list, given an order ID that exists in database.', async () => {
      const resp = await httpClient
        .get('/items/order/1')
        .set('Accept', 'application/json');

      expect(resp.statusCode).toBe(200);
      expect(resp.get('Content-Type')).toMatch(/json/);
      expect(resp.body).toEqual(Array.of(itemMock));
    });
  });

  describe('GET /items/product/:id', () => {
    it('should retrieve a list of items, given product ID that exists in database.', async () => {
      const resp = await httpClient
        .get('/items/product/1')
        .set('Accept', 'application/json');

      expect(resp.statusCode).toBe(200);
      expect(resp.get('Content-Type')).toMatch(/json/);
      expect(resp.body).toEqual(Array.of(itemMock));
    });
  });

  describe('DELETE /items/order/:id', () => {
    it('should delete an order, given an ID that exists in database.', async () => {
      const resp = await httpClient
        .delete('/items/order/1')
        .set('Accept', 'application/json');

      expect(resp.statusCode).toBe(200);
      expect(resp.get('Content-Type')).toMatch(/json/);
      expect(resp.body).toEqual(Array.of(itemMock));
    });
  });

  describe('GET /items', () => {
    it('should retrive an empty list of items, when items table is empty.', async () => {
      const resp = await httpClient.get('/items');
      expect(resp.statusCode).toBe(200);
      expect(resp.get('Content-Type')).toMatch(/json/);
      expect(resp.body).toEqual([]);
    });
  });
});
