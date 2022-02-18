import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/user';

const checkUserPayload = (
    req: Request,
    resp: Response,
    next: NextFunction
): void => {
    const { username, first_name, last_name, password } = req.body as User;

    let reasons: string[] = [];

    if (!username) {
        reasons.push('Username');
    }
    if (!password) {
        reasons.push('Password');
    }

    if (req.path === 'users/signup') {
        if (!first_name) {
            reasons.push('First name');
        }
        if (!last_name) {
            reasons.push('Last name');
        }
    }

    if (reasons.length > 0) {
        resp.status(422).json({
            error: {
                message: 'Invalid user entity',
                reasons: reasons.map((reason) => reason + ' is missing.'),
                recieved: req.body,
            },
        });
        return;
    }
    next();
};

export { checkUserPayload };
