import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import dbClient from '../../database';
import { UserStore } from '../../models/user';

const authorize = async (
    req: Request,
    resp: Response,
    next: NextFunction
): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];

    // Handle JWT is missing from request
    if (!token) {
        resp.status(400).json({
            error: {
                reason: 'Access token was missing from request.',
            },
        });
        return;
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.SIGN_HASH as string
        ) as jwt.JwtPayload;

        /**
         *  Payload structure
         *  {
         *    sub: number,
         *    first_name: string,
         *    last_name: string
         *  }
         */
        const id = payload.sub as unknown as number; // user id
        const user = await new UserStore(dbClient).show(id);

        if (!user) {
            // We don't know such user
            resp.status(401).json({
                error: {
                    message: 'User is forbidden from accessing such resource.',
                    reason: 'No such user in our database.',
                },
            });
            return;
        }
    } catch (err) {
        const error = err as Error;

        if (error instanceof jwt.TokenExpiredError) {
            // Code 403 -- We know the user but can not authorize them.
            resp.status(403).json({
                error: {
                    message: 'Can not authorize a user with an expired token.',
                    reason: error.message,
                },
            });
            return;
        }

        resp.status(500).json({
            error: {
                message: 'Could not verify the provided token.',
                reason: error.message,
            },
        });
        return;
    }
    next();
};

export default authorize;
