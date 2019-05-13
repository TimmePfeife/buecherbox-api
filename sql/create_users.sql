CREATE TABLE Users
(
    id         SERIAL PRIMARY KEY,
    username   CITEXT UNIQUE NOT NULL,
    password   TEXT          NOT NULL,
    deleted    BOOLEAN       NOT NULL DEFAULT FALSE,
    created    TIMESTAMP              DEFAULT current_timestamp,
    updated    TIMESTAMP,
    last_login TIMESTAMP
);
