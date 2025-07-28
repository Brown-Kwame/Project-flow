# Migration Guide: From Microservices to Unified Backend

This guide helps you transition from the existing Asana microservices architecture to the new unified backend.

## Overview

The new unified backend consolidates all microservices into a single, well-structured Spring Boot application while maintaining API compatibility with the existing frontend.

## What's Changed

### Architecture Changes
- **Before**: Multiple microservices (auth, project, task, user, etc.)
- **After**: Single unified backend with clean architecture

### API Endpoint Changes
- **Before**: Various endpoints across different services
- **After**: Standardized REST endpoints under `/api/*`

### Authentication Changes
- **Before**: Custom authentication in auth service
- **After**: JWT-based authentication with Spring Security

## Migration Steps

### 1. Database Migration

#### Create New Database
```sql
CREATE DATABASE asana_db;
CREATE USER asanauser WITH PASSWORD 'asanapassword';
GRANT ALL PRIVILEGES ON DATABASE asana_db TO asanauser;
```

#### Data Migration (if needed)
If you have existing data, you can migrate it using the following approach:

1. Export data from existing services
2. Transform data to match new schema
3. Import into new unified database

### 2. Frontend Updates

#### Update API Base URLs
Change your frontend API calls from:
```javascript
// Old
const authUrl = 'http://localhost:8081/auth';
const projectUrl = 'http://localhost:8082/projects';
const taskUrl = 'http://localhost:8083/tasks';
```

To:
```javascript
// New
const apiBaseUrl = 'http://localhost:8080/api';
const authUrl = `${apiBaseUrl}/auth`;
const projectUrl = `${apiBaseUrl}/projects`;
```

#### Update Authentication
The new backend uses JWT tokens. Update your authentication logic:

```javascript
// Old authentication
const login = async (email, password) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

// New authentication
const login = async (username, password) => {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  
  // Store JWT token
  localStorage.setItem('token', data.token);
  return data;
};
```

#### Update API Calls
Add JWT token to all authenticated requests:

```javascript
// Helper function for authenticated requests
const authenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

// Example API calls
const getProjects = async () => {
  const response = await authenticatedRequest('/api/projects');
  return response.json();
};

const createProject = async (projectData) => {
  const response = await authenticatedRequest('/api/projects', {
    method: 'POST',
    body: JSON.stringify(projectData)
  });
  return response.json();
};
```

### 3. Environment Configuration

#### Update Environment Variables
```bash
# Old microservices
AUTH_SERVICE_URL=http://localhost:8081
PROJECT_SERVICE_URL=http://localhost:8082
TASK_SERVICE_URL=http://localhost:8083

# New unified backend
API_BASE_URL=http://localhost:8080/api
```

#### Update Docker Configuration
Replace multiple service configurations with single unified setup:

```yaml
# Old docker-compose.yml (multiple services)
services:
  auth-service:
    # ...
  project-service:
    # ...
  task-service:
    # ...

# New docker-compose.yml (single service)
services:
  asana-backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/asana_db
      # ...
```

### 4. Testing Migration

#### 1. Start the New Backend
```bash
cd Backend/asana-backend-unified
docker-compose up -d
```

#### 2. Test Authentication
```bash
# Test user registration
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'

# Test user login
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

#### 3. Test Project API
```bash
# Get JWT token from login response
TOKEN="your-jwt-token-here"

# Create project
curl -X POST http://localhost:8080/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "Test project description",
    "ownerUserId": 1,
    "workspaceId": 1,
    "portfolioId": 1
  }'

# Get projects
curl -X GET http://localhost:8080/api/projects \
  -H "Authorization: Bearer $TOKEN"
```

## API Endpoint Mapping

### Authentication
| Old Endpoint | New Endpoint | Method |
|--------------|---------------|---------|
| `/auth/login` | `/api/auth/signin` | POST |
| `/auth/register` | `/api/auth/signup` | POST |

### Projects
| Old Endpoint | New Endpoint | Method |
|--------------|---------------|---------|
| `/projects` | `/api/projects` | GET/POST |
| `/projects/{id}` | `/api/projects/{id}` | GET/PUT/DELETE |
| `/projects/workspace/{id}` | `/api/projects/workspace/{id}` | GET |
| `/projects/owner/{id}` | `/api/projects/owner/{id}` | GET |

## Benefits of Migration

### 1. **Simplified Deployment**
- Single application to deploy and manage
- Reduced infrastructure complexity
- Easier monitoring and logging

### 2. **Better Performance**
- No inter-service communication overhead
- Reduced network latency
- Optimized database queries

### 3. **Improved Development Experience**
- Single codebase to maintain
- Consistent patterns and conventions
- Easier debugging and testing

### 4. **Enhanced Security**
- Centralized authentication
- Consistent security policies
- Better token management

## Rollback Plan

If you need to rollback to the microservices architecture:

1. **Keep Old Services Running**: Don't immediately shut down old services
2. **Gradual Migration**: Migrate one feature at a time
3. **Feature Flags**: Use feature flags to switch between old and new implementations
4. **Monitoring**: Monitor both systems during transition
5. **Data Backup**: Ensure data is backed up before migration

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS is properly configured in the new backend
   - Check that frontend is making requests to the correct URL

2. **Authentication Issues**
   - Verify JWT token format
   - Check token expiration
   - Ensure Authorization header is properly set

3. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database schema is created

### Debug Commands

```bash
# Check if backend is running
curl http://localhost:8080/actuator/health

# Check database connection
docker exec -it asana-postgres psql -U asanauser -d asana_db

# View application logs
docker logs asana-backend

# Check network connectivity
docker network ls
docker network inspect asana-network
```

## Support

If you encounter issues during migration:

1. Check the application logs for detailed error messages
2. Verify all configuration parameters are correct
3. Ensure all dependencies are properly installed
4. Test with a fresh database to isolate issues
5. Review the README.md for detailed setup instructions 