# VoxSynq - Real-time Communication App

A modern real-time communication application built with React Native (Expo) frontend and Spring Boot backend, featuring instant messaging, voice/video calls, and file sharing.

## 🚀 Features

- **Real-time Messaging**: Private and group chats with WebSocket support
- **Voice & Video Calls**: Integrated calling functionality
- **File Sharing**: Image and audio message support
- **User Management**: Profile management, authentication, and authorization
- **Group Management**: Create, manage, and participate in group conversations
- **Read Receipts**: Track message read status
- **Push Notifications**: Real-time notifications for new messages and calls

## 🏗️ Architecture

- **Frontend**: React Native with Expo, TypeScript
- **Backend**: Spring Boot 3.5.0, Java 17
- **Database**: PostgreSQL
- **Real-time**: WebSocket (STOMP)
- **File Storage**: Local file system with Docker volume mounting
- **Authentication**: JWT tokens

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Java 17 or higher
- Docker and Docker Compose
- PostgreSQL (or use Docker)
- Expo CLI (`npm install -g @expo/cli`)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/VOXSYNQ-Labs/voxsynq-app-functional.git
cd voxsynq-app-functional
```

### 2. Backend Setup

```bash
cd backend

# Clean up any existing Docker images (if needed)
docker rmi backend-skype_backend

# Build the application (skip tests to avoid errors)
./mvnw.cmd clean package -DskipTests

# Start with Docker Compose (rebuild if needed)
docker-compose up --build

# Or run locally (requires PostgreSQL running)
./mvnw spring-boot:run
```

The backend will be available at `http://localhost:8080`

### 3. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Start the development server (clear cache if needed)
npm start -- --clear
```

### 4. Environment Configuration

#### Backend Configuration

Update `backend/src/main/resources/application.properties`:

```properties
# Update the base URL to match your setup
app.baseUrl=http://your-ip-address:8080
```

#### Frontend Configuration

Update `Frontend/src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://your-ip-address:8080',  // ← Change this ONE line!
  API_BASE_URL: 'http://your-ip-address:8080/api',
  WEBSOCKET_URL: 'http://your-ip-address:8080/ws'
};
```

**Note**: The frontend now uses a centralized configuration file. You only need to update the IP address in one place!

### 5. Quick Start Commands

```bash
# Backend (from backend directory)
docker rmi backend-skype_backend
./mvnw.cmd clean package -DskipTests
docker-compose up --build

# Frontend (from Frontend directory)  
npm start -- --clear

# Database access (if needed)
docker exec -it skype_clone_postgres psql -U skypeuser -d skype_clone_db
```

### 6. Database Setup

The application uses PostgreSQL. With Docker Compose, the database is automatically created. 

#### Access Database (if needed)
```bash
# Connect to PostgreSQL container
docker exec -it skype_clone_postgres psql -U skypeuser -d skype_clone_db
```

#### Local Development Setup
For local development without Docker:

```sql
CREATE DATABASE skype_clone_db;
CREATE USER skypeuser WITH PASSWORD 'skypepassword';
GRANT ALL PRIVILEGES ON DATABASE skype_clone_db TO skypeuser;
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_BASE_URL` | Base URL for the application | `http://192.168.0.151:8080` |
| `APP_JWT_SECRET` | JWT signing secret | Generated secret |
| `SPRING_DATASOURCE_URL` | Database connection URL | `jdbc:postgresql://localhost:5432/skype_clone_db` |

### IP Address Configuration

The application uses centralized IP address configuration to make network changes easier:

#### Backend Configuration
- **File**: `backend/src/main/resources/application.properties`
- **Property**: `app.baseUrl=http://192.168.0.151:8080`
- **Override**: Set `APP_BASE_URL` environment variable

#### Frontend Configuration  
- **File**: `Frontend/src/config/api.ts`
- **Property**: `BASE_URL: 'http://192.168.0.151:8080'`
- **Usage**: All frontend services automatically import from this config

### File Storage

Uploaded files are stored in the `uploads/` directory and served statically. The directory is mounted as a Docker volume for persistence.

## 📱 API Endpoints & Testing Guide

### Base URL
```
http://192.168.0.151:8080/api
```

### Authentication Endpoints

#### 1. User Registration
- **Endpoint**: `POST /api/auth/signup`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User"
}
```
- **Expected Response**: 200 OK with JWT token
- **Postman Test**: Create new request → POST → `http://192.168.0.151:8080/api/auth/signup`

#### 2. User Login
- **Endpoint**: `POST /api/auth/signin`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "username": "testuser",
  "password": "password123"
}
```
- **Expected Response**: 200 OK with JWT token
- **Postman Test**: Create new request → POST → `http://192.168.0.151:8080/api/auth/signin`

### User Management Endpoints

#### 3. Get All Users
- **Endpoint**: `GET /api/users`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Expected Response**: 200 OK with user list
- **Postman Test**: Create new request → GET → `http://192.168.0.151:8080/api/users`

#### 4. Get Current User
- **Endpoint**: `GET /api/users/me`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Expected Response**: 200 OK with current user data
- **Postman Test**: Create new request → GET → `http://192.168.0.151:8080/api/users/me`

#### 5. Update Current User
- **Endpoint**: `PUT /api/users/me`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
- **Body**:
```json
{
  "fullName": "Updated Name",
  "profilePictureUrl": "http://192.168.0.151:8080/uploads/image.jpg"
}
```
- **Expected Response**: 200 OK with updated user data
- **Postman Test**: Create new request → PUT → `http://192.168.0.151:8080/api/users/me`

#### 6. Change Password
- **Endpoint**: `PUT /api/users/me/password`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
- **Body**:
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```
- **Expected Response**: 200 OK
- **Postman Test**: Create new request → PUT → `http://192.168.0.151:8080/api/users/me/password`

### Message Endpoints

#### 7. Get Conversations
- **Endpoint**: `GET /api/messages/conversations`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Expected Response**: 200 OK with conversation list
- **Postman Test**: Create new request → GET → `http://192.168.0.151:8080/api/messages/conversations`

#### 8. Get Chat History
- **Endpoint**: `GET /api/messages/history/{userId}`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Expected Response**: 200 OK with message history
- **Postman Test**: Create new request → GET → `http://192.168.0.151:8080/api/messages/history/2`

#### 9. Send Private Message
- **Endpoint**: `POST /api/messages/send`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
- **Body**:
```json
{
  "recipientId": 2,
  "content": "Hello, this is a test message!"
}
```
- **Expected Response**: 200 OK with sent message
- **Postman Test**: Create new request → POST → `http://192.168.0.151:8080/api/messages/send`

#### 10. Get Group Messages
- **Endpoint**: `GET /api/messages/group/{groupId}`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Expected Response**: 200 OK with group messages
- **Postman Test**: Create new request → GET → `http://192.168.0.151:8080/api/messages/group/1`

#### 11. Send Group Message
- **Endpoint**: `POST /api/messages/group/{groupId}`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
- **Body**:
```json
{
  "content": "Hello group!",
  "senderId": 1
}
```
- **Expected Response**: 200 OK with sent message
- **Postman Test**: Create new request → POST → `http://192.168.0.151:8080/api/messages/group/1`

### Group Management Endpoints

#### 12. Create Group
- **Endpoint**: `POST /api/groups/create`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Test Group",
  "memberIds": [2, 3],
  "imageUrl": "http://192.168.0.151:8080/uploads/group-image.jpg"
}
```
- **Expected Response**: 200 OK with created group
- **Postman Test**: Create new request → POST → `http://192.168.0.151:8080/api/groups/create`

#### 13. Get User's Groups
- **Endpoint**: `GET /api/groups`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Expected Response**: 200 OK with user's groups
- **Postman Test**: Create new request → GET → `http://192.168.0.151:8080/api/groups`

#### 14. Get Group Details
- **Endpoint**: `GET /api/groups/{groupId}`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Expected Response**: 200 OK with group details
- **Postman Test**: Create new request → GET → `http://192.168.0.151:8080/api/groups/1`

#### 15. Update Group
- **Endpoint**: `PUT /api/groups/{groupId}`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Updated Group Name",
  "imageUrl": "http://192.168.0.151:8080/uploads/new-group-image.jpg"
}
```
- **Expected Response**: 200 OK with updated group
- **Postman Test**: Create new request → PUT → `http://192.168.0.151:8080/api/groups/1`

#### 16. Add Member to Group
- **Endpoint**: `POST /api/groups/{groupId}/add-member/{userId}`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Expected Response**: 200 OK
- **Postman Test**: Create new request → POST → `http://192.168.0.151:8080/api/groups/1/add-member/3`

#### 17. Remove Member from Group
- **Endpoint**: `DELETE /api/groups/{groupId}/remove-member/{userId}`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Expected Response**: 200 OK
- **Postman Test**: Create new request → DELETE → `http://192.168.0.151:8080/api/groups/1/remove-member/3`

### File Management Endpoints

#### 18. Upload File
- **Endpoint**: `POST /api/files/upload`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: multipart/form-data`
- **Body**: Form data with file field
- **Expected Response**: 200 OK with file URL
- **Postman Test**: 
  1. Create new request → POST → `http://192.168.0.151:8080/api/files/upload`
  2. Go to Body tab → Select "form-data"
  3. Add key: "file" (type: File) → Select a file
  4. Send request

#### 19. Download File
- **Endpoint**: `GET /uploads/{filename}`
- **Headers**: None required
- **Expected Response**: 200 OK with file content
- **Postman Test**: Create new request → GET → `http://192.168.0.151:8080/uploads/image.jpg`

### Call Management Endpoints

#### 20. Start Call
- **Endpoint**: `POST /api/calls/start`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
- **Body**:
```json
{
  "callerId": 1,
  "calleeId": 2,
  "type": "VOICE"
}
```
- **Expected Response**: 200 OK with call details
- **Postman Test**: Create new request → POST → `http://192.168.0.151:8080/api/calls/start`

#### 21. End Call
- **Endpoint**: `POST /api/calls/end`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
- **Body**:
```json
{
  "callId": 1,
  "status": "COMPLETED"
}
```
- **Expected Response**: 200 OK with updated call
- **Postman Test**: Create new request → POST → `http://192.168.0.151:8080/api/calls/end`

#### 22. Get Call History
- **Endpoint**: `GET /api/calls/history?userId={userId}`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Expected Response**: 200 OK with call history
- **Postman Test**: Create new request → GET → `http://192.168.0.151:8080/api/calls/history?userId=1`

### Read Status Endpoints

#### 23. Mark Private Messages as Read
- **Endpoint**: `PUT /api/messages/private/{otherUserId}/read?timestamp={timestamp}`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Expected Response**: 200 OK
- **Postman Test**: Create new request → PUT → `http://192.168.0.151:8080/api/messages/private/2/read?timestamp=1640995200000`

#### 24. Mark Group Messages as Read
- **Endpoint**: `PUT /api/groups/{groupId}/read?timestamp={timestamp}`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Expected Response**: 200 OK
- **Postman Test**: Create new request → PUT → `http://192.168.0.151:8080/api/groups/1/read?timestamp=1640995200000`

#### 25. Get Private Unread Count
- **Endpoint**: `GET /api/messages/private/{otherUserId}/unread-count`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Expected Response**: 200 OK with count
- **Postman Test**: Create new request → GET → `http://192.168.0.151:8080/api/messages/private/2/unread-count`

#### 26. Get Group Unread Count
- **Endpoint**: `GET /api/groups/{groupId}/unread-count`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Expected Response**: 200 OK with count
- **Postman Test**: Create new request → GET → `http://192.168.0.151:8080/api/groups/1/unread-count`

### Postman Collection Setup

1. **Create Environment Variables**:
   - `base_url`: `http://192.168.0.151:8080`
   - `jwt_token`: (will be set after login)

2. **Authentication Flow**:
   1. Run signup request
   2. Run signin request
   3. Copy JWT token from response
   4. Set `jwt_token` environment variable
   5. Use `{{jwt_token}}` in Authorization headers

3. **Test Sequence**:
   1. Authentication (signup/signin)
   2. User management
   3. File upload
   4. Group creation
   5. Message sending
   6. Call management

## 🔒 Security

- JWT-based authentication
- Password encryption with BCrypt
- Input validation and sanitization
- CORS configuration
- File upload validation

## 🐛 Troubleshooting

### Common Issues

1. **Docker disk space error**
   ```bash
   # Clean up Docker
   docker system prune -a --volumes
   ```

2. **Port conflicts**
   - Backend: Change port in `application.properties`
   - Frontend: Use different port with `expo start --port 19001`

3. **Database connection issues**
   - Ensure PostgreSQL is running
   - Check credentials in `application.properties`
   - Verify Docker container is healthy

4. **File upload issues**
   - Check `uploads/` directory permissions
   - Verify Docker volume mounting
   - Check file size limits

5. **WebSocket connection issues**
   - Verify WebSocket URL configuration
   - Check firewall settings
   - Ensure backend is running

6. **IP Address changes**
   - **Backend**: Update `app.baseUrl` in `application.properties`
   - **Frontend**: Update `BASE_URL` in `Frontend/src/config/api.ts`
   - **Docker**: Set `APP_BASE_URL` environment variable in `docker-compose.yml`

### Logs

- Backend logs: `docker-compose logs skype_backend`
- Database logs: `docker-compose logs postgres_db`
- Frontend logs: Check Expo development server console

## 🧪 Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd Frontend
npm test
```

## 📦 Deployment

### Production Considerations

1. **Environment Variables**: Use proper secrets management
2. **Database**: Use managed PostgreSQL service
3. **File Storage**: Use cloud storage (AWS S3, Google Cloud Storage)
4. **SSL/TLS**: Enable HTTPS
5. **Monitoring**: Add application monitoring
6. **Backup**: Implement database backups

### Network Configuration

When deploying to different environments, update the IP addresses:

#### Development
```bash
# Backend
echo "app.baseUrl=http://dev-server-ip:8080" >> application.properties

# Frontend  
# Update Frontend/src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'http://dev-server-ip:8080',
  // ...
};
```

#### Production
```bash
# Backend - Set environment variable
export APP_BASE_URL=http://production-server-ip:8080

# Frontend - Update config before building
export const API_CONFIG = {
  BASE_URL: 'http://production-server-ip:8080',
  // ...
};
```

### Docker Production Build

```bash
# Backend
cd backend
docker build -t voxsynq-backend .

# Frontend
cd Frontend
expo build:android  # or expo build:ios
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: support@voxsynq.com

## 🔄 Changelog

### v1.0.0
- Initial release
- Real-time messaging
- Voice and video calls
- File sharing
- Group management
- User authentication 