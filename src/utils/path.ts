import * as path from 'path';

const ENV_PATH = path.resolve(__dirname, '..', '..', 'config', '.env');

const DB_MIGRATE_CONFIG_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  'config',
  'database.json'
);

export { ENV_PATH, DB_MIGRATE_CONFIG_PATH };
