import * as dotenv from 'dotenv';
import { ENV_PATH } from './utils/path';
dotenv.config({ path: ENV_PATH });

import express, { Request, Response } from 'express';
import { initDevDB } from './utils/db_migrator';
import userRoutes from './handlers/user.routes';
import productRoutes from './handlers/product.routes';
import orderRoutes from './handlers/order.routes';
import itemRoutes from './handlers/order_item.routes';

// Start DB migrations
initDevDB();

export const app = express();

// Use JSON body parser
app.use(express.json());

// Attach API endpoints
userRoutes(app);
productRoutes(app);
orderRoutes(app);
itemRoutes(app);

app.get('/status', async (req: Request, resp: Response): Promise<void> => {
    resp.json({ api: { service: 'up' } });
});

const { HOST, PORT } = process.env;

app.listen(PORT, async (): Promise<void> => {
    console.log(`Server is listening at http://${HOST}:${PORT}`);
});
