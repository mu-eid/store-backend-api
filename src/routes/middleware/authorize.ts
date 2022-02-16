import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import dbClient from '../../database';
import { UserStore } from '../../models/user';
import { UserPayload } from '../../utils/user';

type TokenError = 'missing' | 'expired' | 'no-access' | 'unverified';

type AuthError = {
    tokenErrorType: TokenError;
    body?: Error;
};

const reportTokenError = (err: AuthError, resp: Response): void => {
    let message: string;
    let statusCode: number;

    switch (err.tokenErrorType) {
        case 'missing':
            message = 'Access token was missing from request.';
            statusCode = 400;
            break;
        case 'no-access':
            message = 'Access denied for this resource.';
            statusCode = 401;
            break;
        case 'expired':
            message = 'Can not authorize a user with an expired token.';
            statusCode = 403;
            break;
        default:
            message = 'Could not verify the user token.';
            statusCode = 500;
    }

    resp.status(statusCode).json({
        message: message,
        reason: err.body?.message,
    });
};

const authorize = async (
    req: Request,
    resp: Response,
    next: NextFunction
): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];

    // Handle JWT is missing from request
    if (!token) {
        reportTokenError({ tokenErrorType: 'missing' }, resp);
        return;
    }

    try {
        const payload = jwt.verify(
            token as string,
            process.env.SIGN_HASH as string
        );

        /**
         *  Expected payload structure
         *  {
         *    sub: number,
         *    first_name: string,
         *    last_name: string
         *  }
         */
        const { sub, first_name, last_name } =
            payload as unknown as UserPayload;

        const result = await new UserStore(dbClient).show(sub);

        if (
            !result ||
            result.first_name !== first_name ||
            result.last_name !== last_name
        ) {
            // Code 401 -- We don't know such user
            reportTokenError({ tokenErrorType: 'no-access' }, resp);
            return;
        }
    } catch (err) {
        const error = err as Error;

        if (error instanceof jwt.TokenExpiredError) {
            // Code 403 -- We know the user but can not authorize them.
            reportTokenError({ tokenErrorType: 'expired', body: error }, resp);
            return;
        }

        // Code 500 -- Unverifiable token
        reportTokenError({ tokenErrorType: 'unverified', body: error }, resp);
        return;
    }
    next();
};

export default authorize;
