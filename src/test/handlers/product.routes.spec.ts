import * as httpTest from 'supertest';
import { app } from '../../index';
import { Product } from '../../models/product';
import { initTestDB } from '../../utils/db_migrator';
import { productMock } from '../models/mocks';

describe('Products API Endpoints', () => {
  const httpClient = httpTest.default(app);
  let expectedResultRow: Product;

  beforeAll(async () => {
    expectedResultRow = {
      id: 1,
      ...productMock,
    };

    await initTestDB();
  });

  describe('POST /products', () => {
    it('should create a new product in database.', async () => {
      const resp = await httpClient
        .post('/products')
        .set('Accept', 'application/json')
        .send(productMock);

      expect(resp.statusCode).toBe(201);
      expect(resp.get('Content-Type')).toMatch(/json/);
      expect(resp.body).toEqual(expectedResultRow);
    });
  });

  describe('GET /products', () => {
    it('should retrive a list of products found in database.', async () => {
      const resp = await httpClient.get('/products');
      expect(resp.statusCode).toBe(200);
      expect(resp.get('Content-Type')).toMatch(/json/);
      expect(resp.body).toEqual(Array.of(expectedResultRow));
    });
  });

  describe('GET /products/:id', () => {
    it('should retrieve a product, given a product ID that exists in database.', async () => {
      const resp = await httpClient
        .get('/products/1')
        .set('Accept', 'application/json');

      expect(resp.statusCode).toBe(200);
      expect(resp.get('Content-Type')).toMatch(/json/);
      expect(resp.body).toEqual(expectedResultRow);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete a product, given a product ID that exists in database.', async () => {
      const resp = await httpClient
        .delete('/products/1')
        .set('Accept', 'application/json');

      expect(resp.statusCode).toBe(200);
      expect(resp.get('Content-Type')).toMatch(/json/);
      expect(resp.body).toEqual(expectedResultRow);
    });
  });

  describe('GET /products', () => {
    it('should retrive an empty list of products, when table is empty.', async () => {
      const resp = await httpClient.get('/products');
      expect(resp.statusCode).toBe(200);
      expect(resp.get('Content-Type')).toMatch(/json/);
      expect(resp.body).toEqual([]);
    });
  });

});
