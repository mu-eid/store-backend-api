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

function initDevDB() {
    const migrator = db_migrate.getInstance(true, {
        config: configPath,
        env: 'dev',
    });
    migrator.reset().then(() => migrator.up());
}

function initTestDB() {
    const migrator = db_migrate.getInstance(true, {
        config: configPath,
        env: 'test',
    });
    migrator.reset().then(() => migrator.up());
}

export { initDevDB, initTestDB };
