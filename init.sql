CREATE USER adonis_user WITH PASSWORD 'adonis_password';
ALTER USER adonis_user WITH SUPERUSER;
CREATE DATABASE adonis_db;
GRANT ALL PRIVILEGES ON DATABASE adonis_db TO adonis_user;