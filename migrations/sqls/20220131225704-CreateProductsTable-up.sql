CREATE TABLE
    IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(64) NOT NULL,
        price NUMERIC(6, 2) NOT NULL
    );