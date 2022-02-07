import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
// import * as bcrypt from 'bcrypt';
import { ENV_PATH } from './utils/path';
import dbClient from './database';
import { initDevDB } from './utils/db_migrator';
import userRoutes from './handlers/user.routes';
import productRoutes from './handlers/product.routes';
import { orderRoutes } from './handlers/order.routes';
import { itemRoutes } from './handlers/order_item.routes';

const ENV_VARS = dotenv.config({ path: ENV_PATH });
const { APP_HOST, APP_PORT } = process.env;

process.on('uncaughtException', (err) => console.error(err));

// Start clean DB migrations
initDevDB();

export const app = express();

// Use JSON body parser and attach API endpoints
app.use(express.json());
userRoutes(app);
productRoutes(app);
orderRoutes(app);
itemRoutes(app);

app.get('/hallo', async (req: Request, resp: Response): Promise<void> => {
  try {
    const conn = await dbClient.connect();
    const sqlQuery = `SELECT $1 AS greeting;`;
    const result = await conn.query(sqlQuery, ['Leute!']);
    conn.release();
    resp.json({ hallo: result.rows[0]['greeting'] });
  } catch (err) {
    resp.status(500).json({
      error: {
        When: 'While requesting GET /hallo',
        Reason: (err as Error).message,
      },
    });
  }
});

app.listen(APP_PORT, async (): Promise<void> => {
  console.log(`Server is listening at http://${APP_HOST}:${APP_PORT}`);

  if (ENV_VARS.error) console.log(ENV_VARS.error);

  console.log(ENV_VARS.parsed);
});
