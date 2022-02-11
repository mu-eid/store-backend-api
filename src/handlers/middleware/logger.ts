import { Request, Response, NextFunction } from 'express';

function logger(req: Request, resp: Response, next: NextFunction): void {
    const date = new Date().toISOString();
    console.log(`[LOG]: ${req.method} ${req.path} -- TIME: ${date}`);
    next();
}

export { logger };
