# Frontend Integration Guidelines

This document provides beginner-friendly guidelines for integrating the frontend with backend services, YouTube recommendations, and best practices for working with this project.

---

## 📺 Recommended YouTube Video Guides
- **React Native Mobile App:**
  - [React Native Crash Course](https://www.youtube.com/watch?v=0-S5a0eXPoc)
- **REST API Design:**
  - [REST API Concepts and Examples](https://www.youtube.com/watch?v=Q-BpqyOT3a8)
- **Microservices Architecture:**
  - [Microservices Explained in 7 Minutes](https://www.youtube.com/watch?v=rv4LlmLmVWk)
- **YouTube Data API Integration:**
  - [YouTube Data API v3 Tutorial](https://www.youtube.com/watch?v=th5_9woFJmk)

---

## 1. Connecting to Backend APIs
- Use `fetch` or `axios` to call backend REST endpoints.
- Always handle errors and display user-friendly messages.
- Store API URLs in environment variables (e.g., `.env`).
- Use async/await for cleaner code.

## 2. Integrating YouTube Recommendations
- Use the backend to proxy YouTube Data API requests for security.
- Display video recommendations in a user-friendly UI.
- Handle loading and error states gracefully.

## 3. State Management
- Use React Context, Redux, or Zustand for global state.
- Keep UI state and server state separate.

## 4. UI/UX Best Practices
- Follow Asana’s design patterns for navigation and usability.
- Use consistent colors, fonts, and spacing (see `constants/Colors.ts`).
- Test on both iOS and Android devices/emulators.

## 5. General Tips
- Comment your code, especially for API calls and complex logic.
- Never commit secrets or credentials.
- Write tests for components and API logic.
- Use logging for debugging (e.g., `console.log`, but remove before production).
- Keep the README up to date for onboarding new team members.

---

*Add any frontend-specific notes below as needed.*
