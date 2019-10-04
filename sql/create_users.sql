CREATE TABLE Users
(
    id         SERIAL PRIMARY KEY,
    email      TEXT UNIQUE                                         NOT NULL,
    username   CITEXT UNIQUE                                       NOT NULL,
    password   TEXT                                                NOT NULL,
    roleid     INTEGER REFERENCES Roles (id) ON DELETE SET DEFAULT NOT NULL DEFAULT 1,
    deleted    BOOLEAN                                             NOT NULL DEFAULT FALSE,
    created    TIMESTAMP                                                    DEFAULT current_timestamp,
    updated    TIMESTAMP,
    last_login TIMESTAMP
);
