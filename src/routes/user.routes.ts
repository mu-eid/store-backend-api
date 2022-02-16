import { Application, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import dbClient from '../database';
import { User, UserStore } from '../models/user';
import { stripUserPassword, toUserPayload } from '../utils/user';
import authorize from './middleware/authorize';
import { checkID } from './middleware/id-checker';
import { checkUserPayload } from './middleware/user';

const model = new UserStore(dbClient);

// GET /users
const index = async (req: Request, resp: Response): Promise<void> => {
    try {
        const result = await model.index();
        resp.json(
            result.map((u) => {
                return { user: stripUserPassword(u) };
            })
        );
    } catch (err) {
        resp.status(500).json({
            error: {
                When: 'While requesting GET /users',
                Reason: (err as Error).message,
            },
        });
    }
};

// GET /users/:id
const show = async (req: Request, resp: Response): Promise<void> => {
    try {
        const param = req.params['id'];
        const id = parseInt(param, 10);
        const result = await model.show(id);

        result
            ? resp.json({
                  user: stripUserPassword(result),
              })
            : resp.status(404).json({
                  message: `No such user with id: ${id} in database`,
              });
    } catch (err) {
        resp.status(500).json({
            error: {
                When: `While requesting GET /users/:id`,
                Reason: (err as Error).message,
            },
        });
    }
};

// POST /users
const create = async (req: Request, resp: Response): Promise<void> => {
    const { first_name, last_name, password } = req.body as User;

    try {
        // Insert user credentials into database
        const entity = await model.create({
            first_name: first_name,
            last_name: last_name,
            password: password,
        });

        // Create authorization token
        const payload = toUserPayload(entity);
        const token = jwt.sign(payload, process.env.SIGN_HASH as string);

        resp.status(201).json({
            created: stripUserPassword(entity),
            token: token,
        });
    } catch (err) {
        resp.status(500).json({
            error: {
                When: `While requesting POST /users`,
                Reason: (err as Error).message,
            },
        });
    }
};

// DELETE /users/:id
const destroy = async (req: Request, resp: Response): Promise<void> => {
    try {
        const param = req.params['id'];
        const id = parseInt(param, 10);
        const result = await model.delete(id);

        result
            ? resp.json({ deleted: { user: stripUserPassword(result) } })
            : resp.status(404).json({ message: 'No such user in database' });
    } catch (err) {
        resp.status(500).json({
            error: {
                When: `While requesting DELETE /users/:id`,
                Reason: (err as Error).message,
            },
        });
    }
};

function userRoutes(app: Application): void {
    app.get('/users', authorize, index);
    app.get('/users/:id', authorize, checkID, show);
    app.post('/users', authorize, checkUserPayload, create);
    app.delete('/users/:id', authorize, checkID, destroy);
}

export default userRoutes;
