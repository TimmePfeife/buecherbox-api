CREATE TABLE BookBoxes
(
    id          SERIAL PRIMARY KEY,
    userid      INTEGER REFERENCES Users (id) ON DELETE SET NULL,
    imgid       INTEGER REFERENCES images (id),
    description VARCHAR(255),
    location    VARCHAR(255),
    lat         DECIMAL(10, 8) NOT NULL,
    lng         DECIMAL(11, 8) NOT NULL,
    hint        TEXT,
    created     TIMESTAMP DEFAULT current_timestamp,
    updated     TIMESTAMP,
    CHECK (
            lat >= -90 AND lat <= 90 AND
            lng >= -180 AND lng <= 180
        )
);

CREATE INDEX bookboxes_userid_index ON BookBoxes(userid);
