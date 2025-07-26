# FullStack Backend - Docker Setup

This document provides instructions for running the FullStack backend services using Docker and Docker Compose.

## Architecture Overview

The backend consists of the following microservices:

- **Eureka Server** (Port 8761) - Service discovery
- **API Gateway** (Port 8094) - Centralized routing and load balancing
- **Auth Service** (Port 8092) - Authentication and authorization
- **User Service** (Port 8086) - User management
- **Portfolio Service** (Port 8090) - Portfolio management
- **Project Service** (Port 8084) - Project management
- **Task Service** (Port 8083) - Task management
- **Goals Service** (Port 8085) - Goals management
- **Notification Service** (Port 8082) - Notification management
- **Chat Service** (Port 8087) - Real-time chat functionality
- **Team Service** (Port 8095) - Team management
- **PostgreSQL Database** (Port 5432) - Data persistence

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (usually included with Docker Desktop)
- At least 4GB of available RAM
- At least 10GB of available disk space

## Quick Start

### 1. Build and Start All Services

Navigate to the Backend directory and run:

```bash
docker-compose up --build
```

This command will:
- Build Docker images for all services
- Create and start all containers
- Set up the PostgreSQL database
- Initialize all required databases
- Start all microservices

### 2. Access Services

Once all services are running, you can access:

- **Eureka Dashboard**: http://localhost:8761
- **API Gateway**: http://localhost:8094
- **Individual Services**: Use their respective ports (e.g., http://localhost:8092 for Auth Service)

### 3. Stop All Services

```bash
docker-compose down
```

To also remove volumes (database data):

```bash
docker-compose down -v
```

## Individual Service Management

### Build a Single Service

```bash
docker-compose build <service-name>
```

Example:
```bash
docker-compose build auth-service
```

### Start a Single Service

```bash
docker-compose up <service-name>
```

Example:
```bash
docker-compose up auth-service
```

### View Logs

```bash
docker-compose logs <service-name>
```

Example:
```bash
docker-compose logs auth-service
```

### Follow Logs in Real-time

```bash
docker-compose logs -f <service-name>
```

## Service Names Reference

- `postgres` - PostgreSQL Database
- `eureka-server` - Eureka Server
- `api-gateway` - API Gateway
- `auth-service` - Auth Service
- `user-service` - User Service
- `portfolio-service` - Portfolio Service
- `project-service` - Project Service
- `task-service` - Task Service
- `goals-service` - Goals Service
- `notification-service` - Notification Service
- `chat-service` - Chat Service
- `team-service` - Team Service

## Database Configuration

The PostgreSQL database is automatically initialized with the following databases:

- `auth_db` - Authentication service database
- `user_db` - User service database
- `portfolio_db` - Portfolio service database
- `project_db` - Project service database
- `task_db` - Task service database
- `goals_db` - Goals service database
- `notification_db` - Notification service database
- `chat_db` - Chat service database
- `team_db` - Team service database

### Database Credentials

- **Host**: localhost (or postgres from within containers)
- **Port**: 5432
- **Username**: postgres
- **Password**: postgres

## Environment Variables

All services are configured with the following environment variables:

- `SPRING_PROFILES_ACTIVE=docker` - Activates Docker profile
- `SPRING_DATASOURCE_URL` - Database connection URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` - Eureka server URL

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Stop any existing services using the same ports
   - Check if PostgreSQL is already running on port 5432

2. **Memory Issues**
   - Increase Docker Desktop memory allocation
   - Start services individually to reduce memory usage

3. **Database Connection Issues**
   - Ensure PostgreSQL container is running: `docker-compose ps`
   - Check database logs: `docker-compose logs postgres`

4. **Service Discovery Issues**
   - Ensure Eureka Server is running first
   - Check Eureka dashboard at http://localhost:8761

### Useful Commands

```bash
# Check running containers
docker-compose ps

# Check container status
docker-compose ps -a

# Restart a service
docker-compose restart <service-name>

# Remove all containers and images
docker-compose down --rmi all

# Clean up everything including volumes
docker-compose down -v --rmi all

# View resource usage
docker stats
```

## Development Workflow

### Making Changes

1. Make your code changes
2. Rebuild the specific service: `docker-compose build <service-name>`
3. Restart the service: `docker-compose up <service-name>`

### Hot Reload (Development)

For development, you can mount source code volumes to enable hot reload:

```yaml
# Add to service configuration in docker-compose.yml
volumes:
  - ./<service-name>/src:/app/src
```

## Production Considerations

For production deployment:

1. Use environment-specific configuration files
2. Implement proper logging and monitoring
3. Set up health checks for all services
4. Configure proper resource limits
5. Use external database instances
6. Implement proper security measures
7. Set up CI/CD pipelines

## Monitoring and Logs

### Accessing Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs <service-name>

# Follow logs
docker-compose logs -f <service-name>
```

### Health Checks

Monitor service health through:
- Eureka Dashboard: http://localhost:8761
- Individual service health endpoints: `http://localhost:<port>/actuator/health`

## Network Configuration

All services are connected through a custom Docker network called `fullstack-network`. This ensures:

- Service-to-service communication
- Isolated network environment
- Proper DNS resolution between containers

## Security Notes

- Default passwords are used for development only
- Change default credentials for production
- Implement proper JWT secrets
- Use HTTPS in production
- Implement proper CORS configuration 