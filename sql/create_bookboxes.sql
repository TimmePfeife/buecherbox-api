CREATE TABLE BookBoxes
(
    id          SERIAL PRIMARY KEY,
    userId      INTEGER REFERENCES Users (id),
    description VARCHAR(255),
    location    VARCHAR(255),
    lat         DECIMAL(10, 8) NOT NULL,
    lng         DECIMAL(11, 8) NOT NULL,
    imgSrc      VARCHAR(255),
    hint        TEXT
)
