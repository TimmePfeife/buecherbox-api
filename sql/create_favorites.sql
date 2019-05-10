CREATE TABLE Favorites
(
    id        SERIAL PRIMARY KEY,
    userid    INTEGER REFERENCES Users (id)     NOT NULL,
    bookboxid INTEGER REFERENCES BookBoxes (id) NOT NULL,
    created   TIMESTAMP DEFAULT current_timestamp
);
