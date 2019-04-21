CREATE DATABASE buecherbox_db;

CREATE USER buecherbox with PASSWORD '1234567890';

GRANT ALL PRIVILEGES ON DATABASE buecherbox_db TO buecherbox;

-- needs to be enabled with buecherbox user
CREATE EXTENSION pgcrypto;

