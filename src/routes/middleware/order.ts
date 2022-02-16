import { Request, Response, NextFunction } from 'express';
import { Order } from '../../models/order';

const checkOrderEntity = (
    req: Request,
    resp: Response,
    next: NextFunction
): void => {
    const { user_id, complete } = req.body as Order;

    let reason: string = '';

    if (!user_id) {
        reason = 'User ID was not provided.';
    }

    if (complete === undefined) {
        reason = 'Order status was not provided.';
    }

    if (typeof complete !== 'boolean') {
        reason = 'Order status need to be a boolean value';
    }

    if (reason) {
        resp.status(422).json({
            error: {
                reason: reason,
                recieved: {
                    user_id: user_id,
                    complete: complete,
                },
            },
        });
        return;
    }
    next();
};

export { checkOrderEntity };
