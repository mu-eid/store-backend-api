import { Request, Response, NextFunction } from 'express';

const checkUserPayload = (
    req: Request,
    resp: Response,
    next: NextFunction
): void => {
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
    next();
};

export { checkUserPayload };
