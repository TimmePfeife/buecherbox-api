CREATE TABLE Tokens
(
    id      VARCHAR(32) PRIMARY KEY,
    userid  INTEGER REFERENCES Users (id) ON DELETE CASCADE NOT NULL,
    expires TIMESTAMP                                       NOT NULL,
    revoked BOOLEAN   DEFAULT false                         NOT NULL,
    created TIMESTAMP DEFAULT current_timestamp
);

CREATE INDEX tokens_userid_index ON Tokens(userid);
