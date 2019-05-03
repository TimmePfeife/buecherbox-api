INSERT INTO Users (username, password)
VALUES ('TEST_USER',
        crypt('123456', gen_salt('bf')));

INSERT INTO Users (username, password, deleted)
VALUES ('DELETED_USER',
        crypt('123456', gen_salt('bf')),
        TRUE);



