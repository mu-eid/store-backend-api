'use strict';

import * as path from 'path';
import { DB_MIGRATE_CONFIG_PATH as configPath } from './config-path';
import * as db_migrate from 'db-migrate';

const dev_migrator = db_migrate.getInstance(true, {
    config: configPath,
    env: 'dev',
});

const test_migrator = db_migrate.getInstance(true, {
    config: configPath,
    env: 'test',
});

// Disable logs, less info noise
dev_migrator.silence(true);
test_migrator.silence(true);

function initDevDB() {
    console.info(
        '[INFO]: ====================== DEV DATABASE SET UP ======================'
    );
    return dev_migrator
        .reset()
        .then(() => dev_migrator.up())
        .catch(console.error);
}

function resetDevDB() {
    console.info(
        '[INFO]: ====================== DEV DATABASE RESET ======================='
    );
    return dev_migrator.reset().catch(console.error);
}

function initTestDB() {
    console.info(
        '[INFO]: ====================== TEST DATABASE SET UP ======================'
    );
    return test_migrator
        .reset()
        .then(() => test_migrator.up())
        .catch(console.error);
}

function resetTestDB() {
    console.info(
        '[INFO]: ====================== TEST DATABASE RESET ======================='
    );
    return test_migrator.reset().catch(console.error);
}

export { initDevDB, initTestDB };
