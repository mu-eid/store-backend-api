import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, resp: Response, next: NextFunction): void => {
    if (process.env.NODE_ENV === 'dev') logRequest(req);
    next();
};

const logRequest = (req: Request): void => {
    const date = new Date().toUTCString();
    console.log(`[LOG]: ${req.method} ${req.path} -- TIMESTAMP: ${date}`);
};

export { logger };
