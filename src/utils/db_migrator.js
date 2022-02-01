'use strict';

import * as path from 'path';
import * as db_migrate from 'db-migrate';

const configPath = path.resolve(
    __dirname,
    '..',
    '..',
    'config',
    'database.json'
);

const migrator = db_migrate.getInstance(true, { config: configPath });

function init_db() {
    migrator.reset().then(() => migrator.up());
}

export { init_db };
