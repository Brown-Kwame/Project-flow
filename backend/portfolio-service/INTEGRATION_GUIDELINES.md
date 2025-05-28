# Portfolio Service Integration Guidelines

This document provides beginner-friendly guidelines for integrating and developing the portfolio microservice as part of the Asana-like app backend.

---

## 📺 Recommended YouTube Video Guides
- [Microservices Explained in 7 Minutes](https://www.youtube.com/watch?v=rv4LlmLmVWk)
- [Spring Boot Microservices Full Course](https://www.youtube.com/watch?v=KxqlJblhzfI)
- [REST API Concepts and Examples](https://www.youtube.com/watch?v=Q-BpqyOT3a8)

---

## 1. Service Responsibilities
- Manage user portfolios, projects, and related data.
- Expose REST endpoints for CRUD operations.
- Store portfolio data in a database (e.g., PostgreSQL).

## 2. API Guidelines
- Use JSON for all requests and responses.
- Document endpoints with Swagger/OpenAPI.
- Example (Java Spring):
  ```java
  @PostMapping("/api/portfolio")
  public ResponseEntity<Portfolio> createPortfolio(@RequestBody Portfolio req) {
      // ...
      return ResponseEntity.ok(portfolio);
  }
  ```

## 3. Data Handling
- Use JDBC/ORM for DB access.
- Store credentials in environment variables.
- Use migration tools for schema changes.

## 4. Best Practices
- Comment code, especially for business logic.
- Write tests for endpoints and data handling.
- Log important events and errors.

---

*Add portfolio-specific notes below as needed.*
