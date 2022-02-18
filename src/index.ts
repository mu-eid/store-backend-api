import * as dotenv from 'dotenv';
import { ENV_PATH } from './utils/path';
dotenv.config({ path: ENV_PATH });

import express, { Request, Response } from 'express';

import { initDevDB } from './utils/db_migrator';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import itemRoutes from './routes/order_item.routes';
import { logger } from './routes/middleware/logger';

// Start database migrations
process.nextTick(async () => {
    if (process.env.NODE_ENV === 'dev') {
        await initDevDB();
    }
});

export const app = express();

// Use JSON body parser
app.use(express.json());
app.use(logger);

// Attach API endpoints
userRoutes(app);
productRoutes(app);
orderRoutes(app);
itemRoutes(app);

app.get('/status', async (req: Request, resp: Response): Promise<void> => {
    resp.json({ api: { status: 'up' } });
});

const { HOST, PORT } = process.env;

app.listen(PORT, (): void => {
    console.log(`Server is listening at http://${HOST}:${PORT}/status`);
});
