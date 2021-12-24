CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    url TEXT,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX cards_url_index ON cards(url);