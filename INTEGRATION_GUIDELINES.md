# Service Integration Guidelines

This document provides guidelines for integrating backend services with the frontend, YouTube recommendations, and PostgreSQL. Please read carefully before starting development.

## 1. Frontend Integration
- Use RESTful APIs with clear endpoints.
- Enable CORS for frontend communication.
- Always use JSON for data exchange.
- Document your API endpoints (Swagger/OpenAPI recommended).
- Handle errors with proper HTTP status codes and messages.

## 2. YouTube Recommendation Integration
- Use the YouTube Data API v3 for recommendations.
- Store API keys securely (never hardcode).
- Example (Java):
  ```java
  String url = "https://www.googleapis.com/youtube/v3/search?...";
  // Use RestTemplate/WebClient to call YouTube API
  ```
- Respect YouTube API rate limits and handle errors gracefully.

## 3. PostgreSQL Database Communication
- Use JDBC or an ORM (Hibernate/JPA) for database access.
- Store credentials in environment variables or config files (not in code).
- Example (Spring Boot):
  ```properties
  spring.datasource.url=jdbc:postgresql://localhost:5432/yourdb
  spring.datasource.username=youruser
  spring.datasource.password=yourpassword
  ```
- Use migration tools (Flyway/Liquibase) for schema changes.
- Log and handle SQL exceptions.

## 4. General Tips
- Comment your code, especially for integrations.
- Never commit secrets or credentials.
- Write tests for APIs and DB logic.
- Use logging for debugging and monitoring.

## 5. Helpful Resources & Team Practices
- **YouTube Video Guides:**
  - [Microservices Explained in 7 Minutes](https://www.youtube.com/watch?v=rv4LlmLmVWk)
  - [Spring Boot Microservices Full Course](https://www.youtube.com/watch?v=KxqlJblhzfI)
  - [PostgreSQL Tutorial for Beginners](https://www.youtube.com/watch?v=qw--VYLpxG4)
  - [REST API Concepts and Examples](https://www.youtube.com/watch?v=Q-BpqyOT3a8)
  - [YouTube Data API v3 Tutorial](https://www.youtube.com/watch?v=th5_9woFJmk)
  - [React Native Crash Course](https://www.youtube.com/watch?v=0-S5a0eXPoc)
  - [Docker Tutorial for Beginners](https://www.youtube.com/watch?v=fqMOX6JJhGo)
- **Version Control:** Use Git branches and pull requests for all changes. Review code before merging.
- **Onboarding:** Keep this guideline and a project README up to date for new team members.
- **API Mocking:** Use tools like Postman or Mockoon to test APIs before frontend/backend are fully ready.
- **Environment Management:** Use `.env` files or a secrets manager for local development.
- **Issue Tracking:** Use a project board (GitHub Projects, Jira, etc.) to track tasks and bugs.
- **Regular Syncs:** Hold short team meetings to discuss blockers and share progress.

---

*Add any service-specific notes below.*
