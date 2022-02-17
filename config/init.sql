-- Drop objects if exists
DROP ROLE IF EXISTS store_user;

DROP DATABASE IF EXISTS store_dev_db;

DROP DATABASE IF EXISTS store_test_db;

-- Set up database
CREATE ROLE store_user
WITH
    LOGIN PASSWORD '2345';

CREATE DATABASE store_dev_db;

CREATE DATABASE store_test_db;