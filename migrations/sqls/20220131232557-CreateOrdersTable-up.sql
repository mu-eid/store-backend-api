CREATE TABLE
    IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        complete BOOLEAN DEFAULT FALSE,
        user_id INTEGER REFERENCES users(id)
    );