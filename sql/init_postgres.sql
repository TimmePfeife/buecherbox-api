CREATE DATABASE buecherbox_db;
CREATE DATABASE buecherbox_test_db;

CREATE USER buecherbox with PASSWORD '1234567890';

GRANT ALL PRIVILEGES ON DATABASE buecherbox_db TO buecherbox;
GRANT ALL PRIVILEGES ON DATABASE buecherbox_test_db TO buecherbox;

-- needs to be enabled for buecherbox_db and buecherbox_test_db
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

