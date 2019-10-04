CREATE TABLE Roles
(
    id   SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

INSERT INTO Roles (id, name)
VALUES (1, 'user'),
       (2, 'admin');
