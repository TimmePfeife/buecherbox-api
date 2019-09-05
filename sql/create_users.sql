CREATE TABLE Users
(
    id         SERIAL PRIMARY KEY,
    username   CITEXT UNIQUE                                       NOT NULL,
    password   TEXT                                                NOT NULL,
    roleid     INTEGER REFERENCES Roles (id) ON DELETE SET DEFAULT NOT NULL DEFAULT 1,
    deleted    BOOLEAN                                             NOT NULL DEFAULT FALSE,
    created    TIMESTAMP                                                    DEFAULT current_timestamp,
    updated    TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE Roles
(
    id   SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

INSERT INTO Roles (id, name)
VALUES (1, 'user'),
       (2, 'admin');
