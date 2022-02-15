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

// Disable logs of applied migrations
// to reduce info noise while developing or testing
dev_migrator.silence(true);
test_migrator.silence(true);

function initDevDB() {
    console.info(
        '[INFO]: ----------------- Setting up Development Database ------------------'
    );
    return dev_migrator.reset().then(() => dev_migrator.up());
}

function resetDevDB() {
    console.info(
        '[INFO]: ----------------- Resetting Development Database -------------------'
    );
    return dev_migrator.reset();
}

function initTestDB() {
    console.info(
        '[INFO]: ----------------- Setting up Testing Database ----------------------'
    );
    return test_migrator.reset().then(() => test_migrator.up());
}

function resetTestDB() {
    console.info(
        '[INFO]: ----------------- Resetting Testing Database -----------------------'
    );
    return test_migrator.reset();
}

export { initDevDB, initTestDB };
