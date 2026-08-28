# Tasks: Basic Todo Application

**Input**: Design documents from `/specs/001-basic-todo/`  
**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/todos-api.yaml](contracts/todos-api.yaml)  

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`, `US4`)
- Descriptions include exact file paths

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base build configurations

- [ ] T001 Initialize backend Spring Boot project structure with Maven in `backend/pom.xml`
- [ ] T002 Initialize frontend React project structure with Vite in `frontend/package.json` and `frontend/vite.config.js`
- [ ] T003 [P] Configure Spring Boot application properties and H2 datasource in `backend/src/main/resources/application.yml`
- [ ] T004 [P] Configure CORS and WebMvc settings for frontend integration in `backend/src/main/java/com/example/todo/config/WebConfig.java`
- [ ] T005 [P] Setup global design system, CSS variables, typography, and modern aesthetics in `frontend/src/index.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data layer, error handling, and API client that MUST be complete before user stories

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete

- [ ] T006 Create JPA `Todo` entity and table mapping in `backend/src/main/java/com/example/todo/model/Todo.java`
- [ ] T007 [P] Create Spring Data JPA `TodoRepository` interface in `backend/src/main/java/com/example/todo/repository/TodoRepository.java`
- [ ] T008 [P] Create global API exception handler and error response DTO in `backend/src/main/java/com/example/todo/exception/GlobalExceptionHandler.java` and `backend/src/main/java/com/example/todo/dto/ErrorResponse.java`
- [ ] T009 [P] Create API client module with base HTTP request handling and error parsing in `frontend/src/services/api.js`
- [ ] T010 Create root application container and responsive layout skeleton in `frontend/src/App.jsx` and `frontend/src/components/Header.jsx`

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - Create and View Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable users to add new tasks via an input field and view the full list of active/existing tasks.

**Independent Test**: Enter a task title, submit, verify that the task appears in the list and the input resets. Verify empty/whitespace input is prevented.

- [ ] T011 [P] [US1] Create `CreateTodoRequest` and `TodoResponse` DTOs in `backend/src/main/java/com/example/todo/dto/CreateTodoRequest.java` and `backend/src/main/java/com/example/todo/dto/TodoResponse.java`
- [ ] T012 [US1] Implement `TodoService` methods for creating and listing tasks with validation in `backend/src/main/java/com/example/todo/service/TodoService.java`
- [ ] T013 [US1] Implement `GET /api/todos` and `POST /api/todos` endpoints in `backend/src/main/java/com/example/todo/controller/TodoController.java`
- [ ] T014 [P] [US1] Create `TodoInput` component with input validation and keyboard submit handling in `frontend/src/components/TodoInput.jsx`
- [ ] T015 [P] [US1] Create `TodoList` and `TodoItem` view components in `frontend/src/components/TodoList.jsx` and `frontend/src/components/TodoItem.jsx`
- [ ] T016 [US1] Integrate task creation and fetching into `frontend/src/App.jsx` with optimistic updates and error handling

**Checkpoint**: User Story 1 (MVP) is fully functional and testable independently.

---

## Phase 4: User Story 2 - Toggle Task Completion (Priority: P2)

**Goal**: Allow users to toggle task completion status with visual distinction and updated remaining active counts.

**Independent Test**: Click a task completion checkbox/toggle to verify the visual strikethrough updates immediately and the active counter adjusts.

- [ ] T017 [US2] Implement toggle completion service logic and `PATCH /api/todos/{id}/toggle` endpoint in `backend/src/main/java/com/example/todo/service/TodoService.java` and `backend/src/main/java/com/example/todo/controller/TodoController.java`
- [ ] T018 [P] [US2] Add completion checkbox interaction, animated checkmarks, and strikethrough styling in `frontend/src/components/TodoItem.jsx`
- [ ] T019 [US2] Create `TodoStats` component displaying remaining active tasks count in `frontend/src/components/TodoStats.jsx` and wire state in `frontend/src/App.jsx`

**Checkpoint**: User Stories 1 and 2 work independently and together.

---

## Phase 5: User Story 3 - Delete and Edit Tasks (Priority: P3)

**Goal**: Allow users to update existing task titles in place or delete tasks from the list.

**Independent Test**: Double-click or click edit on a task to modify text and save; click delete icon to permanently remove the item from the list.

- [ ] T020 [P] [US3] Create `UpdateTodoRequest` DTO in `backend/src/main/java/com/example/todo/dto/UpdateTodoRequest.java`
- [ ] T021 [US3] Implement update and delete service logic and `PUT /api/todos/{id}` & `DELETE /api/todos/{id}` endpoints in `backend/src/main/java/com/example/todo/service/TodoService.java` and `backend/src/main/java/com/example/todo/controller/TodoController.java`
- [ ] T022 [US3] Implement in-place editing mode with Save/Cancel/Escape/Enter handlers in `frontend/src/components/TodoItem.jsx`
- [ ] T023 [US3] Implement delete button action with micro-animation and API call in `frontend/src/components/TodoItem.jsx` and `frontend/src/App.jsx`

**Checkpoint**: Full CRUD operations functional on tasks.

---

## Phase 6: User Story 4 - Filter Tasks and Batch Actions (Priority: P4)

**Goal**: Filter tasks by All / Active / Completed, show empty states, and clear all completed tasks in one click.

**Independent Test**: Switch between filter tabs to verify only matching items show; click "Clear Completed" to remove all finished tasks.

- [ ] T024 [US4] Implement bulk delete of completed tasks in `backend/src/main/java/com/example/todo/service/TodoService.java` and `DELETE /api/todos/completed` in `backend/src/main/java/com/example/todo/controller/TodoController.java`
- [ ] T025 [P] [US4] Create `TodoFilter` tabs component (`All`, `Active`, `Completed`) with active tab indicators in `frontend/src/components/TodoFilter.jsx`
- [ ] T026 [US4] Implement client-side filtering logic, empty state UI when no matching tasks exist, and "Clear Completed" button in `frontend/src/App.jsx` and `frontend/src/components/TodoStats.jsx`

**Checkpoint**: All user stories (P1 through P4) complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification, testing, and UI polish across the entire application

- [ ] T027 [P] Implement controller integration test suite with MockMvc in `backend/src/test/java/com/example/todo/controller/TodoControllerTest.java`
- [ ] T028 [P] Polish UI with glassmorphic cards, gradient accents, focus rings, hover micro-interactions, and dark/light contrast in `frontend/src/index.css`
- [ ] T029 Validate full user flow end-to-end against `specs/001-basic-todo/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories.
- **User Stories (Phases 3–6)**: Depend on Phase 2 completion.
  - US1 (P1) is the MVP foundation.
  - US2 (P2), US3 (P3), US4 (P4) build incrementally upon the task list.
- **Polish (Phase 7)**: Depends on all user stories being complete.

### Parallel Opportunities

- Phase 1: `T003`, `T004`, `T005` can run in parallel.
- Phase 2: `T007`, `T008`, `T009` can run in parallel.
- Phase 3 (US1): `T011`, `T014`, `T015` can run in parallel.
- Phase 5 (US3): `T020` can run in parallel with UI prep.
- Phase 6 (US4): `T025` can run in parallel with backend endpoint work.
- Phase 7: `T027` and `T028` can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (User Story 1 - Create & View).
3. Validate MVP: Users can create and view todo tasks stored in H2 via REST API.

### Incremental Delivery
1. **MVP (US1)**: Create + View Tasks.
2. **Increment 2 (US2)**: Toggle Complete + Active Task Counter.
3. **Increment 3 (US3)**: In-Place Editing + Task Deletion.
4. **Increment 4 (US4)**: Filtering (All/Active/Completed) + Clear Completed.
5. **Final Polish**: Integration testing & UI animation enhancements.
