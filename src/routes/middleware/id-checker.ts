import { Request, Response, NextFunction } from 'express';

const checkID = (req: Request, resp: Response, next: NextFunction): void => {
    const param = req.params['id'];
    const id = parseInt(param, 10);

    if (!id) {
        resp.status(400).json({
            error: {
                reason: `ID in ${req.path} needs to be a positive integer greater than 0`,
                recieved: `${param}`,
            },
        });
        return;
    }
    next();
};

export { checkID };
