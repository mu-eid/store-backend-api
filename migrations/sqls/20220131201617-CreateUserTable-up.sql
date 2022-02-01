CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(32) NOT NULL,
        last_name VARCHAR(32) NOT NULL,
        password CHAR(60) NOT NULL
    );