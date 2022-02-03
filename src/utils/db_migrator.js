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

const dev_migrator = db_migrate.getInstance(true, {
    config: configPath,
    env: 'dev',
});

const test_migrator = db_migrate.getInstance(true, {
    config: configPath,
    env: 'test',
});

dev_migrator.silence(true);
test_migrator.silence(true);

function initDevDB() {
    console.info('------------ Init Dev Database -------------');
    return dev_migrator.reset().then(() => dev_migrator.up());
}

function resetDevDB() {
    console.info('------------ Reset Dev Database -------------');
    return dev_migrator.reset();
}

function initTestDB() {
    console.info('----------- Init Test Database -------------');
    return test_migrator.reset().then(() => test_migrator.up());
}

function resetTestDB() {
    console.info('----------- Reset Test Database -------------');
    return test_migrator.reset();
}

export { initDevDB, initTestDB };
