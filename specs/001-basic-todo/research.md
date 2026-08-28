# Research & Architecture Decisions: Basic Todo Application

**Feature**: Basic Todo Application  
**Branch**: `001-basic-todo`  
**Date**: 2026-08-29  

## 1. Backend Architecture: Spring Boot & Data Persistence

### Decision
- Use **Spring Boot** (Spring Web, Spring Data JPA, H2 Database, Jakarta Validation) for the backend REST API.
- Use **Java 21/25** with standard Maven build (`pom.xml`).
- Use **H2 In-Memory / File-based Database** with Spring Data JPA `JpaRepository` for rapid development, zero-config startup, and straightforward schema management (`ddl-auto: update`).
- Expose RESTful endpoints under `/api/todos` with cross-origin resource sharing (CORS) enabled for local frontend access (`http://localhost:5173`).

### Rationale
- Spring Boot provides enterprise-grade structure, robust validation, out-of-the-box JPA repository semantics, and seamless H2 console debugging.
- Spring Data JPA decouples business logic from persistence, making future migration from H2 to PostgreSQL/MySQL a single dependency and configuration change.
- Standardized REST controller architecture with clear service and repository layers ensures maintainability and adherence to best practices.

### Alternatives Considered
- **Spring Boot with In-Memory ConcurrentHashMap**: Simpler, but lacks JPA query capabilities, transactional boundaries, and easy migration to relational production databases.
- **Node.js/Express**: Rejected in favor of the requested Spring Boot ecosystem.
- **SQLite**: Requires custom dialect and driver configuration in Spring Boot compared to first-class H2 starter support.

---

## 2. Frontend Architecture: React & Modern Client Experience

### Decision
- Use **React 18/19 with Vite** for fast build tooling, hot module replacement (HMR), and clean project structure.
- Use **Vanilla CSS** with design tokens, CSS variables, smooth transitions, and a modern aesthetic (as per design guidelines).
- Use native `fetch` / simple API client module with typed request/response handling.
- Client-side state managed via React hooks (`useState`, `useEffect`, `useCallback`) with optimistic UI updates and backend synchronization.

### Rationale
- Vite provides instant server start and lightning-fast HMR.
- Vanilla CSS delivers maximum control over animations, glassmorphic styling, responsive layout, and dark/light themes without extra bundle overhead.
- Modular component hierarchy (`TodoList`, `TodoItem`, `TodoInput`, `TodoFilter`, `TodoStats`) guarantees separation of concerns and independent testability.

### Alternatives Considered
- **Next.js / SSR**: Overkill for a single-page reactive todo dashboard with an independent Spring Boot backend.
- **Tailwind CSS**: Vanilla CSS preferred for custom design tokens and dynamic animations without extra toolchain complexity.

---

## 3. API Contract & Communication Design

### Decision
- Standard RESTful JSON conventions:
  - `GET /api/todos`: Retrieve all todos (optional query param `?completed=true|false`).
  - `POST /api/todos`: Create a new todo (`{"title": "..."}`).
  - `GET /api/todos/{id}`: Retrieve a specific todo by ID.
  - `PUT /api/todos/{id}`: Update todo title and/or completed status.
  - `PATCH /api/todos/{id}/toggle`: Toggle completion status directly.
  - `DELETE /api/todos/{id}`: Delete a specific todo.
  - `DELETE /api/todos/completed`: Bulk delete completed todos.
- HTTP status codes: `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request` (validation errors), `404 Not Found`.

### Rationale
- Conforms to standard REST principles.
- Provides fine-grained actions (like toggle and bulk clear) to minimize client-side orchestration and network round trips.

---

## 4. Testing & Verification Strategy

### Decision
- **Backend Testing**:
  - `JUnit 5` + `MockMvc` / `@SpringBootTest` for API contract and controller integration testing.
  - Unit tests for service layer validation and repository queries.
- **Frontend Testing & Verification**:
  - Component validation and end-to-end browser walkthrough using browser automation subagents.
