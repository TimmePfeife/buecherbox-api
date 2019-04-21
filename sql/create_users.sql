CREATE TABLE Users
(
    id       SERIAL PRIMARY KEY,
    username VARCHAR(20)  NOT NULL,
    email    VARCHAR(255) NOT NULL,
    password TEXT NOT NULL
)

-- INSERT INTO users (email, password) VALUES (
--   'johndoe@mail.com',
--   crypt('johnspassword', gen_salt('bf'))
-- );

-- SELECT id
--   FROM users
--  WHERE email = 'johndoe@mail.com'
--    AND password = crypt('johnspassword', password);
