# Authentication Service Integration Guidelines

This document provides beginner-friendly guidelines for integrating and developing the authentication microservice as part of the Asana-like app backend.

---

## 📺 Recommended YouTube Video Guides
- [Spring Boot Microservices Full Course](https://www.youtube.com/watch?v=KxqlJblhzfI)
- [REST API Concepts and Examples](https://www.youtube.com/watch?v=Q-BpqyOT3a8)
- [OAuth 2.0 and JWT](https://www.youtube.com/watch?v=7Q17ubqLfaM)

---

## 1. Service Responsibilities
- Handle user registration, login, and authentication.
- Issue and validate JWT tokens for secure API access.
- Expose REST endpoints for auth flows.

## 2. API Guidelines
- Use JSON for all requests and responses.
- Document endpoints with Swagger/OpenAPI.
- Example (Java Spring):
  ```java
  @PostMapping("/api/auth/login")
  public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
      // ...
      return ResponseEntity.ok(response);
  }
  ```

## 3. Security
- Store secrets in environment variables.
- Hash passwords using bcrypt or similar.
- Validate JWTs on protected endpoints.

## 4. Best Practices
- Comment code, especially for security logic.
- Write tests for all auth flows.
- Log authentication events and errors.

---

*Add authentication-specific notes below as needed.*
