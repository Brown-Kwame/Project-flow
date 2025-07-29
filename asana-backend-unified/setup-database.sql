-- Setup script for Asana database
-- Run this as the postgres superuser

-- Create the database
CREATE DATABASE asana_db;

-- Create the user
CREATE USER asanauser WITH PASSWORD 'asanapassword';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE asana_db TO asanauser;

-- Connect to the asana_db database
\c asana_db;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO asanauser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO asanauser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO asanauser;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO asanauser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO asanauser; 