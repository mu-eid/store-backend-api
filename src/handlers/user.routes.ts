import { Application, Request, Response } from 'express';

import dbClient from '../database';
import { UserStore } from '../models/user';

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

    if (id) {
      const result = await model.show(id);

      result
        ? resp.json(result)
        : resp
            .status(404)
            .json({ message: `No such user with ID: ${id} found in database` });
    } else {
      resp.status(400).json({
        error: {
          reason: `User ID needs to be a positive integer greater than 0`,
          recieved: `${param}`,
        },
      });
    }
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

  let reason: string = '';

  if (!first_name) {
    reason = 'First name was not provided.';
  }

  if (!last_name) {
    reason = 'Last name was not provided.';
  }

  if (!password) {
    reason = 'Password was not provided.';
  }

  if (reason) {
    resp.status(422).json({
      error: {
        reason: reason,
        recieved: {
          first_name: first_name,
          last_name: last_name,
          password: password,
        },
      },
    });
    return;
  }

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

    if (id) {
      const result = await model.delete(id);

      result
        ? resp.json(result)
        : resp.status(404).json({ message: 'No such user in database' });
    } else {
      resp.status(400).json({
        error: {
          reason: `User ID needs to be a positive integer greater than 0`,
          recieved: `${param}`,
        },
      });
    }
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
  app.get('/users/:id', show);
  app.post('/users', create);
  app.delete('/users/:id', destroy);
}

export default userRoutes;
