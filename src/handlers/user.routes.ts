import { Application, Request, Response } from 'express';

import dbClient from '../database';
import { UserStore } from '../models/user';
import { checkID } from './middleware/id-checker';
import { checkUserPayload } from './middleware/user';

const model = new UserStore(dbClient);

const index = async (req: Request, resp: Response): Promise<void> => {
  try {
    const result = await model.index();
    resp.json(result);
  } catch (err) {
    resp.status(500).json({
      error: {
        When: 'While requesting GET /users',
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
      : resp
          .status(404)
          .json({ message: `No such user with ID: ${id} found in database` });
  } catch (err) {
    resp.status(500).json({
      error: {
        When: `While requesting GET /users`,
        Reason: (err as Error).message,
      },
    });
  }
};

const create = async (req: Request, resp: Response): Promise<void> => {
  const { first_name, last_name, password } = req.body;

  try {
    const user = await model.create({
      first_name: first_name,
      last_name: last_name,
      password: password,
    });

    resp.status(201).json(user);
  } catch (err) {
    resp.status(500).json({
      error: {
        When: `While requesting POST /users`,
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
  app.get('/users', index);
  app.get('/users/:id', checkID, show);
  app.post('/users', checkUserPayload, create);
  app.delete('/users/:id', checkID, destroy);
}

export default userRoutes;
