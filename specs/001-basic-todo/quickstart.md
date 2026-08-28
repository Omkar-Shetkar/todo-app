# Quickstart Guide: Basic Todo Application

This guide covers running the Spring Boot backend and React frontend locally.

---

## Prerequisites

- **Java JDK 21+** (e.g. Java 21 or Java 25)
- **Apache Maven 3.8+**
- **Node.js 18+** & **npm 9+**

---

## 1. Running the Spring Boot Backend

The backend runs on port `8080` with an embedded H2 database and in-memory JPA store.

```bash
cd backend
mvn spring-boot:run
```

- Backend API Base URL: `http://localhost:8080/api/todos`
- H2 Database Console: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:tododb`
  - User: `sa`
  - Password: *(empty)*

---

## 2. Running the React Frontend

The frontend runs on port `5173` via Vite with hot reloading.

```bash
cd frontend
npm install
npm run dev
```

- Frontend App URL: `http://localhost:5173`

---

## 3. Verifying the Full Stack

1. Open `http://localhost:5173` in your browser.
2. Type a task (e.g., "Complete Spec Kit plan") and click **Add** or press **Enter**.
3. Toggle the checkbox to mark the task as completed.
4. Filter by **Active** and **Completed** tabs.
5. Click **Clear Completed** to remove completed tasks.
