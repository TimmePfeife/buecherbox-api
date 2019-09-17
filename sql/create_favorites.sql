CREATE TABLE Favorites
(
    id        SERIAL PRIMARY KEY,
    userid    INTEGER REFERENCES Users (id) ON DELETE CASCADE     NOT NULL,
    bookboxid INTEGER REFERENCES BookBoxes (id) ON DELETE CASCADE NOT NULL,
    created   TIMESTAMP DEFAULT current_timestamp
);

CREATE INDEX favorites_userid_index ON Favorites(userid);
