import { Application, Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

import dbClient from '../database';
import { User, UserNotFoundError, UserStore } from '../models/user';
import { httpError } from '../utils/http';
import { genUserToken, stripPassword, toUserPayload } from '../utils/user';
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
                return { user: stripPassword(u) };
            })
        );
    } catch (err) {
        resp.status(500).json(httpError('GET /users', err as Error));
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
                  user: stripPassword(result),
              })
            : resp.status(404).json({
                  message: `No such user with id: ${id} in database`,
              });
    } catch (err) {
        resp.status(500).json(httpError('GET /users/:id', err as Error));
    }
};

// POST /users
const create = async (req: Request, resp: Response): Promise<void> => {
    const { username, first_name, last_name, password } = req.body as User;

    try {
        // Insert user credentials into database
        const entity = await model.create({
            username: username,
            first_name: first_name,
            last_name: last_name,
            password: password,
        });

        // Create authorization token
        const token = genUserToken(toUserPayload(entity));

        resp.status(201).json({
            created: {
                user: stripPassword(entity),
            },
            token: token,
        });
    } catch (err) {
        resp.status(500).json(httpError('POST /users', err as Error));
    }
};

// DELETE /users/:id
const destroy = async (req: Request, resp: Response): Promise<void> => {
    try {
        const param = req.params['id'];
        const id = parseInt(param, 10);
        const result = await model.delete(id);

        result
            ? resp.json({ deleted: { user: stripPassword(result) } })
            : resp.status(404).json({ message: 'No such user in database' });
    } catch (err) {
        const error = err as Error;
        resp.status(500).json(httpError('DELETE /users/:id', error));
    }
};

const login = async (req: Request, resp: Response): Promise<void> => {
    const { username, password } = req.body as Partial<User>;

    try {
        const result = await model.fetchByUserName(username as string);
        const match = await bcrypt.compare(password as string, result.password);

        match
            ? resp.status(200).json({
                  logged_in: result.username,
                  token: genUserToken(toUserPayload(result)),
              })
            : resp
                  .status(403)
                  .json(
                      httpError(
                          'POST /users/login',
                          new Error('Wrong password')
                      )
                  );
    } catch (err) {
        const error = err as Error;
        const code = error instanceof UserNotFoundError ? 404 : 500;
        resp.status(code).json(httpError('POST /users/login', error));
    }
};

function userRoutes(app: Application): void {
    app.post('/users/signup', checkUserPayload, create);
    app.post('/users/login', checkUserPayload, login);
    app.post('/users', authorize, checkUserPayload, create);
    app.get('/users', authorize, index);
    app.get('/users/:id', authorize, checkID, show);
    app.delete('/users/:id', authorize, checkID, destroy);
}

export default userRoutes;
