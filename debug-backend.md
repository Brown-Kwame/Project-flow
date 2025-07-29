# Backend 500 Error Debugging Guide

## Issue Description
You're getting a 500 error when trying to fetch goal progress data from the `/goals/{goalId}/progress-data` endpoint.

## Possible Causes and Solutions

### 1. Backend Not Running
**Check if the backend is running:**
```bash
# Check if port 8080 is in use
netstat -an | findstr :8080

# Or try to connect to the backend
curl http://192.168.244.88:8080/api/goals
```

**Start the backend if not running:**
```bash
cd asana-backend-unified
./mvnw spring-boot:run
```

### 2. Database Connection Issues
**Check if PostgreSQL is running:**
```bash
# On Windows
net start postgresql-x64-15

# Check if database exists
psql -U postgres -c "\l" | grep asana_db
```

**Create database and user if needed:**
```bash
# Run the setup script
psql -U postgres -f setup-database.sql
```

### 3. Database Configuration Mismatch
The application.properties has been updated to use:
- Username: `asanauser`
- Password: `asanapassword`
- Database: `asana_db`

Make sure these match your PostgreSQL setup.

### 4. Missing Data
The endpoint might fail if:
- The goal with the specified ID doesn't exist
- The database tables are empty
- There are null values in required fields

### 5. Authentication Issues
The endpoint requires authentication. Make sure:
- You're logged in to the mobile app
- The auth token is being sent with requests
- The token is valid

## Testing Steps

### Step 1: Test Backend Connectivity
```bash
node test-backend-connection.js
```

### Step 2: Check Database
```bash
# Connect to database
psql -U asanauser -d asana_db

# Check if tables exist
\dt

# Check if goals exist
SELECT * FROM goals LIMIT 5;

# Check if tasks exist
SELECT * FROM tasks LIMIT 5;

# Check if projects exist
SELECT * FROM projects LIMIT 5;
```

### Step 3: Test with Authentication
```bash
# First login to get a token
curl -X POST http://192.168.244.88:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'

# Then test the endpoint with the token
curl -X GET http://192.168.244.88:8080/api/goals/1/progress-data \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Mobile App Improvements Made

1. **Enhanced Error Handling**: Added detailed error logging and user-friendly error messages
2. **Error Display**: Added error UI with retry functionality
3. **Better Debugging**: Added console logs to track the request flow

## Next Steps

1. Run the backend connection test
2. Check if the backend is running
3. Verify database connectivity
4. Test with authentication
5. Check the mobile app logs for detailed error information

## Common Solutions

### If backend is not running:
```bash
cd asana-backend-unified
./mvnw clean install
./mvnw spring-boot:run
```

### If database issues:
```bash
# Reset database
psql -U postgres -c "DROP DATABASE IF EXISTS asana_db;"
psql -U postgres -f setup-database.sql
```

### If authentication issues:
- Log out and log back in to the mobile app
- Check if the auth token is being stored correctly 