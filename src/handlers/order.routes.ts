import { Application, Request, Response } from 'express';

import dbClient from '../database';
import { Order, OrderStore } from '../models/order';
import { checkID } from './middleware/id-checker';
import { checkOrderEntity } from './middleware/order';

const model = new OrderStore(dbClient);

const index = async (req: Request, resp: Response): Promise<void> => {
    try {
        const result = await model.index();
        resp.json(result);
    } catch (err) {
        resp.status(500).json({
            error: {
                When: 'While requesting GET /orders',
                Reason: (err as Error).message,
            },
        });
    }
};

const indexOrdersByUserID = async (
    req: Request,
    resp: Response
): Promise<void> => {
    try {
        const param = req.params['id'];
        const id = parseInt(param, 10);
        const result = await model.indexOrdersByUser(id);

        result
            ? resp.json(result)
            : resp.status(404).json({
                  error: 'No such order',
                  reason: `Order with ID: ${id} does not exist in database`,
              });
    } catch (err) {
        resp.status(500).json({
            error: {
                When: `While requesting GET /orders/:id`,
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
                  error: 'No such order',
                  reason: `Order with ID: ${id} does not exist in database`,
              });
    } catch (err) {
        resp.status(500).json({
            error: {
                When: `While requesting GET /orders/:id`,
                Reason: (err as Error).message,
            },
        });
    }
};

const create = async (req: Request, resp: Response): Promise<void> => {
    const { user_id, complete } = req.body as Order;

    try {
        const order = await model.create({
            user_id: user_id,
            complete: complete,
        });

        resp.status(201).json(order);
    } catch (err) {
        const error = err as Error;
        resp.status(500).json({
            error: {
                When: `While requesting POST /orders`,
                Reason: error.message.includes('user_id_fkey')
                    ? 'No user with that ID found in database'
                    : error.message,
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
            : resp.status(404).json({ message: 'No such order in database' });
    } catch (err) {
        resp.status(500).json({
            error: {
                When: `While requesting DELETE /orders/:id`,
                Reason: (err as Error).message,
            },
        });
    }
};

const orderRoutes = (app: Application) => {
    app.get('/orders', index);
    app.get('/orders/users/:id', checkID, indexOrdersByUserID);
    app.get('/orders/:id', checkID, show);
    app.post('/orders', checkOrderEntity, create);
    app.delete('/orders/:id', checkID, destroy);
};

export default orderRoutes;
