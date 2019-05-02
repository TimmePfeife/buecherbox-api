CREATE TABLE Images
(
    id          SERIAL PRIMARY KEY,
    filename    VARCHAR(260)              NOT NULL,
    mimetype    VARCHAR(100)              NOT NULL,
    destination VARCHAR(260)              NOT NULL,
    path        VARCHAR(260)              NOT NULL,
    thumbnail   VARCHAR(260)              NOT NULL,
    size        INT                       NOT NULL,
    created     date DEFAULT current_date NOT NULL
)
