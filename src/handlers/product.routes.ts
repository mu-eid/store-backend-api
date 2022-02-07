import { Application, Request, Response } from 'express';

import { checkProductPayload } from './middleware/product';
import { checkID } from './middleware/id-checker';
import dbClient from '../database';
import { ProductStore } from '../models/product';

const model = new ProductStore(dbClient);

const index = async (req: Request, resp: Response): Promise<void> => {
  try {
    const result = await model.index();
    resp.json(result);
  } catch (err) {
    resp.status(500).json({
      error: {
        When: 'While requesting GET /products',
        Reason: (err as Error).message,
      },
    });
  }
};

const show = async (req: Request, resp: Response): Promise<void> => {
  try {
    const param = req.params['id'];
    const id = parseInt(param, 10);
    const result = await model.show(id);

    result
      ? resp.json(result)
      : resp.status(404).json({
          error: 'No such product',
          reason: `Product with ID: ${id} does not exist in database`,
        });
  } catch (err) {
    resp.status(500).json({
      error: {
        When: `While requesting GET /products`,
        Reason: (err as Error).message,
      },
    });
  }
};

const create = async (req: Request, resp: Response): Promise<void> => {
  const { name, price } = req.body;
  try {
    const product = await model.create({
      name: name,
      price: price,
    });

    resp.status(201).json(product);
  } catch (err) {
    resp.status(500).json({
      error: {
        When: `While requesting POST /product`,
        Reason: (err as Error).message,
      },
    });
  }
};

const destroy = async (req: Request, resp: Response): Promise<void> => {
  try {
    const param = req.params['id'];
    const id = parseInt(param, 10);
    const result = await model.delete(id);

    result
      ? resp.json(result)
      : resp.status(404).json({ message: 'No such product in database' });
  } catch (err) {
    resp.status(500).json({
      error: {
        When: `While requesting DELETE /products/:id`,
        Reason: (err as Error).message,
      },
    });
  }
};

function productRoutes(app: Application): void {
  app.get('/products', index);
  app.get('/products/:id', checkID, show);
  app.post('/products', checkProductPayload, create);
  app.delete('/products/:id', checkID, destroy);
}

export default productRoutes;
