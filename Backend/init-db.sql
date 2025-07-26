-- Database initialization script for FullStack application
-- This script creates all the required databases for the microservices

-- Create databases for each service
CREATE DATABASE auth_db;
CREATE DATABASE user_db;
CREATE DATABASE portfolio_db;
CREATE DATABASE project_db;
CREATE DATABASE task_db;
CREATE DATABASE goals_db;
CREATE DATABASE notification_db;
CREATE DATABASE chat_db;
CREATE DATABASE team_db;

-- Create users for each service (optional - using postgres user for simplicity)
-- CREATE USER auth_user WITH PASSWORD 'auth_password';
-- CREATE USER user_user WITH PASSWORD 'user_password';
-- CREATE USER portfolio_user WITH PASSWORD 'portfolio_password';
-- CREATE USER project_user WITH PASSWORD 'project_password';
-- CREATE USER task_user WITH PASSWORD 'task_password';
-- CREATE USER goals_user WITH PASSWORD 'goals_password';
-- CREATE USER notification_user WITH PASSWORD 'notification_password';
-- CREATE USER chat_user WITH PASSWORD 'chat_password';
-- CREATE USER team_user WITH PASSWORD 'team_password';

-- Grant privileges (if using separate users)
-- GRANT ALL PRIVILEGES ON DATABASE auth_db TO auth_user;
-- GRANT ALL PRIVILEGES ON DATABASE user_db TO user_user;
-- GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
-- GRANT ALL PRIVILEGES ON DATABASE project_db TO project_user;
-- GRANT ALL PRIVILEGES ON DATABASE task_db TO task_user;
-- GRANT ALL PRIVILEGES ON DATABASE goals_db TO goals_user;
-- GRANT ALL PRIVILEGES ON DATABASE notification_db TO notification_user;
-- GRANT ALL PRIVILEGES ON DATABASE chat_db TO chat_user;
-- GRANT ALL PRIVILEGES ON DATABASE team_db TO team_user; 