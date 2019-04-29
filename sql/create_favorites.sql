CREATE TABLE Favorites
(
    id     SERIAL PRIMARY KEY,
    userId INTEGER REFERENCES Users (id) NOT NULL,
    bookboxId INTEGER REFERENCES BookBoxes (id) NOT NULL
);
