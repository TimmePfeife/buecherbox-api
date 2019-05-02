CREATE TABLE Users
(
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(20) UNIQUE NOT NULL,
    password   TEXT               NOT NULL,
    deleted    BOOLEAN            NOT NULL DEFAULT FALSE,
    created    date                        DEFAULT current_date,
    updated    date,
    last_login date
)

-- INSERT INTO users (email, password) VALUES (
--   'johndoe@mail.com',
--   crypt('johnspassword', gen_salt('bf'))
-- );

-- SELECT id
--   FROM users
--  WHERE email = 'johndoe@mail.com'
--    AND password = crypt('johnspassword', password);
