CREATE TABLE Users
(
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(20) UNIQUE NOT NULL,
    password   TEXT               NOT NULL,
    deleted    BOOLEAN            NOT NULL DEFAULT FALSE,
    created    date                        DEFAULT current_date,
    updated    date,
    last_login date
);
