CREATE TABLE
    IF NOT EXISTS order_items (
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER DEFAULT 1 CONSTRAINT min_max_quantity CHECK (
            quantity > 0 AND
            quantity <= 50
        ),
        CONSTRAINT item_id_pk PRIMARY KEY (order_id, product_id)
    );