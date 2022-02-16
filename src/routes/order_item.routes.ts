import { Application, Request, Response } from 'express';

import dbClient from '../database';
import { Item, ItemStore } from '../models/order_item';
import authorize from './middleware/authorize';

import { checkID } from './middleware/id-checker';
import { checkItemEntity } from './middleware/item';

const model = new ItemStore(dbClient);

const create = async (req: Request, resp: Response): Promise<void> => {
    const { order_id, product_id, quantity } = req.body as Item;

    try {
        const order = await model.create({
            order_id: order_id,
            product_id: product_id,
            quantity: quantity,
        });

        resp.status(201).json(order);
    } catch (err) {
        const error = err as Error;
        resp.status(500).json({
            error: {
                When: `While requesting POST /items`,
                Reason: error.message.includes('product_id_fkey')
                    ? 'No product with such ID found in database'
                    : error.message,
            },
        });
    }
};

const index = async (req: Request, resp: Response): Promise<void> => {
    try {
        const model = new ItemStore(dbClient);
        const result = await model.index();
        resp.json(result);
    } catch (err) {
        resp.status(500).json({
            error: {
                When: 'While requesting GET /items',
                Reason: (err as Error).message,
            },
        });
    }
};

const indexByOrder = async (req: Request, resp: Response): Promise<void> => {
    try {
        const param = req.params['id'];
        const id = parseInt(param, 10);
        const model = new ItemStore(dbClient);
        const result = await model.indexByOrder(id);
        resp.json(result);
    } catch (err) {
        resp.status(500).json({
            error: {
                When: 'While requesting GET /items/order/:id',
                Reason: (err as Error).message,
            },
        });
    }
};

const indexByProduct = async (req: Request, resp: Response): Promise<void> => {
    try {
        const param = req.params['id'];
        const id = parseInt(param, 10);
        const model = new ItemStore(dbClient);
        const result = await model.indexByProduct(id);
        resp.json(result);
    } catch (err) {
        resp.status(500).json({
            error: {
                When: 'While requesting GET /items/product/:id',
                Reason: (err as Error).message,
            },
        });
    }
};

const deleteByOrder = async (req: Request, resp: Response): Promise<void> => {
    try {
        const param = req.params['id'];
        const id = parseInt(param, 10);
        const result = await model.deleteByOrder(id);

        result
            ? resp.json(result)
            : resp.status(404).json({ message: 'No such order in database' });
    } catch (err) {
        resp.status(500).json({
            error: {
                When: `While requesting DELETE /items/order/:id`,
                Reason: (err as Error).message,
            },
        });
    }
};

const itemRoutes = (app: Application): void => {
    app.get('/items', authorize, index);
    app.get('/items/order/:id', authorize, checkID, indexByOrder);
    app.get('/items/product/:id', authorize, checkID, indexByProduct);
    app.post('/items', authorize, checkItemEntity, create);
    app.delete('/items/order/:id', authorize, checkID, deleteByOrder);
};

export default itemRoutes;
