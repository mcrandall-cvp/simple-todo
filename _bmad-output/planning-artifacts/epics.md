---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - prd.md
  - architecture.md
  - ux-design-specification.md
---

# simple-todo - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for simple-todo, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**Task Management:**
- FR1: User can create a new task by entering text and pressing Enter
- FR2: User can view all incomplete tasks in a single list
- FR3: User can complete a task, removing it from the visible list
- FR4: User can reorder tasks via drag-and-drop to change priority
- FR5: System automatically saves task order when user completes a drag-and-drop action

**Data Persistence:**
- FR6: System persists all tasks to the database immediately upon creation
- FR7: System persists task completion status immediately upon user action
- FR8: System persists task order changes immediately upon reorder
- FR9: User can refresh the browser and see the same task list in the same order
- FR10: Tasks survive container restarts without data loss

**User Interface:**
- FR11: User can see an empty state when no tasks exist
- FR12: User can see visual feedback when a task is being dragged
- FR13: User can see the task input field is always visible and accessible
- FR14: User can interact with the application without creating an account

**Developer Experience:**
- FR15: Developer can start the complete application stack with a single command
- FR16: Developer can access the application at a predictable localhost URL
- FR17: System automatically initializes the database on first startup
- FR18: System runs without requiring manual environment variable configuration

**API (Internal):**
- FR19: Backend provides an endpoint to create a new task
- FR20: Backend provides an endpoint to retrieve all incomplete tasks
- FR21: Backend provides an endpoint to mark a task as complete
- FR22: Backend provides an endpoint to update task positions (reorder)

### NonFunctional Requirements

**Performance:**
- NFR1: Page Load < 1 second (time to interactive)
- NFR2: Task Creation < 100ms (UI response to Enter key)
- NFR3: Task Completion < 100ms (UI response to click)
- NFR4: Drag-and-Drop < 500ms (time from drop to persistence confirmation)
- NFR5: API Response < 200ms (server response time for all endpoints)

**Reliability:**
- NFR6: Data Persistence 100% (zero task loss under normal operation)
- NFR7: Uptime 99%+ (when containers are running)
- NFR8: Data Integrity 100% (task order maintained accurately)
- NFR9: Recovery Automatic (database recovers cleanly after container restart)

**Accessibility (Basic):**
- NFR10: Keyboard Navigation - Tab, Enter, Escape work for add/complete
- NFR11: Focus Indicators - Interactive elements show focus state
- NFR12: Color Contrast - Sufficient text readability
- NFR13: Semantic HTML - Valid heading structure, form elements

**Maintainability:**
- NFR14: Code Organization - Clean separation (frontend, backend, database)
- NFR15: Setup Simplicity - Zero config (no manual env vars or migrations)
- NFR16: Documentation - README with basic setup and usage instructions

### Additional Requirements

**From Architecture - Starter Template:**
- Project initialization using create-next-app and @nestjs/cli (Epic 1, Story 1)
- Frontend: `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack`
- Backend: `npx @nestjs/cli@latest new backend --strict --skip-git --package-manager npm`

**From Architecture - Infrastructure:**
- Docker Compose configuration with 3 containers (frontend, backend, postgres)
- PostgreSQL container with persistent named volume (pgdata)
- Auto-migration on startup via Prisma Migrate
- Internal Docker network for container communication
- Frontend exposed on localhost:3000, backend internal on port 3001

**From Architecture - Technical Decisions:**
- ORM: Prisma with auto-generated client
- Database: PostgreSQL 16+ with single `tasks` table
- State Management: React useState (no external library)
- Drag-and-Drop: @dnd-kit/core + @dnd-kit/sortable
- Styling: Tailwind CSS (no component library)
- API: REST with direct data responses (no wrapper objects)
- Error Handling: Silent retry, optimistic updates with rollback

**From Architecture - Data Model:**
```prisma
model Task {
  id        Int      @id @default(autoincrement())
  title     String
  position  Int
  createdAt DateTime @default(now()) @map("created_at")

  @@map("tasks")
}
```

**From Architecture - API Endpoints:**
- GET /tasks - Retrieve all incomplete tasks
- POST /tasks - Create a new task
- PATCH /tasks/:id/complete - Mark task as complete
- PATCH /tasks/reorder - Update task positions

**From UX Design - Visual Requirements:**
- Single-column layout, 512px max-width centered
- System font stack, 16px task text
- Color palette: #FFFFFF background, #1A1A1A text, #3B82F6 focus accent
- 8px base spacing unit, 48px input height
- 6px border radius for subtle softness

**From UX Design - Interaction Requirements:**
- Always-visible input field at bottom, auto-focused
- Single-click task completion with fade-out animation (150-200ms)
- Drag-and-drop with visual drop indicator
- Empty state: "No tasks yet" with "Add your first task below"
- All animations under 200ms, respect prefers-reduced-motion

**From UX Design - Accessibility Requirements:**
- WCAG 2.1 Level AA compliance
- 48px minimum touch targets
- Semantic HTML with ARIA labels
- Keyboard navigation: Tab, Enter, Escape, Space
- Screen reader announcements for task actions

**From UX Design - Components:**
- TaskList: Container with drag-drop context
- TaskItem: Task row with completion circle and drag handle
- TaskInput: Always-visible text input
- EmptyState: Friendly guidance message

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 2 | Create task by entering text and pressing Enter |
| FR2 | Epic 2 | View all incomplete tasks in a single list |
| FR3 | Epic 3 | Complete a task, removing it from visible list |
| FR4 | Epic 4 | Reorder tasks via drag-and-drop |
| FR5 | Epic 4 | Auto-save task order on drag-drop complete |
| FR6 | Epic 2 | Persist tasks to database immediately on creation |
| FR7 | Epic 3 | Persist task completion immediately |
| FR8 | Epic 4 | Persist task order changes immediately |
| FR9 | Epic 2 | Tasks persist across browser refresh |
| FR10 | Epic 3 | Tasks survive container restarts |
| FR11 | Epic 2 | Show empty state when no tasks exist |
| FR12 | Epic 4 | Visual feedback when task is being dragged |
| FR13 | Epic 2 | Task input field always visible and accessible |
| FR14 | Epic 1 | Interact without creating an account |
| FR15 | Epic 1 | Start complete stack with single command |
| FR16 | Epic 1 | Access app at predictable localhost URL |
| FR17 | Epic 1 | Auto-initialize database on first startup |
| FR18 | Epic 1 | Run without manual environment config |
| FR19 | Epic 2 | API endpoint to create a new task |
| FR20 | Epic 2 | API endpoint to retrieve all incomplete tasks |
| FR21 | Epic 3 | API endpoint to mark task as complete |
| FR22 | Epic 4 | API endpoint to update task positions |

## Epic List

### Epic 1: Infrastructure Foundation
Developer can run `docker compose up` and have a fully operational, empty application stack ready for development.

**FRs covered:** FR14, FR15, FR16, FR17, FR18

**Key deliverables:**
- Docker Compose configuration with 3 containers
- Next.js frontend (create-next-app with Tailwind)
- NestJS backend with Prisma setup
- PostgreSQL with auto-migration on startup
- Container networking (frontend → backend → postgres)
- Empty app shell loads at localhost:3000

---

### Epic 2: Task Capture & Display
User can add tasks and see them in a list - the core capture experience works.

**FRs covered:** FR1, FR2, FR6, FR9, FR11, FR13, FR19, FR20

**Key deliverables:**
- TaskInput component (always-visible, auto-focused)
- TaskList and TaskItem components
- EmptyState component
- POST /tasks endpoint
- GET /tasks endpoint
- Tasks persist across browser refresh

---

### Epic 3: Task Completion & Persistence
User can complete tasks and trust that their data survives browser refreshes and container restarts.

**FRs covered:** FR3, FR7, FR10, FR21

**Key deliverables:**
- Single-click task completion with fade-out animation
- PATCH /tasks/:id/complete endpoint
- Data persistence verification (container restart)
- Visual feedback on task completion

---

### Epic 4: Task Reordering & Priority Management
User can drag tasks to reorder priority, with changes auto-saved instantly.

**FRs covered:** FR4, FR5, FR8, FR12, FR22

**Key deliverables:**
- Drag-and-drop with @dnd-kit integration
- Visual feedback during drag
- PATCH /tasks/reorder endpoint
- Optimistic updates with background sync

---

## Epic 1: Infrastructure Foundation

Developer can run `docker compose up` and have a fully operational, empty application stack ready for development.

### Story 1.1: Initialize Frontend Project

As a **developer**,
I want **to initialize a Next.js frontend project with TypeScript, Tailwind, and ESLint**,
So that **I have a properly configured frontend foundation ready for component development**.

**Acceptance Criteria:**

**Given** the project root directory exists
**When** I run the initialization command `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack`
**Then** a `frontend/` directory is created with Next.js project structure
**And** TypeScript is configured with strict mode
**And** Tailwind CSS is configured and ready to use
**And** ESLint is configured for code quality
**And** The App Router is enabled with `src/` directory structure
**And** The `@/*` import alias is configured for clean imports

**Given** the frontend project is initialized
**When** I run `npm run dev` from the frontend directory
**Then** the development server starts on port 3000
**And** the default Next.js page loads in the browser

**Given** the frontend needs to communicate with the backend
**When** I configure the environment
**Then** I can set `NEXT_PUBLIC_API_URL` for API communication

---

### Story 1.2: Initialize Backend Project with Prisma

As a **developer**,
I want **to initialize a NestJS backend project with Prisma ORM and the tasks database schema**,
So that **I have a properly configured backend foundation with database access ready for API development**.

**Acceptance Criteria:**

**Given** the project root directory exists
**When** I run the initialization command `npx @nestjs/cli@latest new backend --strict --skip-git --package-manager npm`
**Then** a `backend/` directory is created with NestJS project structure
**And** TypeScript is configured with strict mode

**Given** the backend project is initialized
**When** I install and configure Prisma with `npm install prisma @prisma/client` and `npx prisma init`
**Then** a `prisma/schema.prisma` file is created
**And** the schema contains the Task model with id, title, position, and createdAt fields
**And** the database provider is configured for PostgreSQL

**Given** the Prisma schema is configured
**When** the schema is validated
**Then** it matches the Architecture specification:
```prisma
model Task {
  id        Int      @id @default(autoincrement())
  title     String
  position  Int
  createdAt DateTime @default(now()) @map("created_at")
  @@map("tasks")
}
```

**Given** the backend project is initialized
**When** I run `npm run start:dev` from the backend directory
**Then** the NestJS application starts on port 3001
**And** the default health check endpoint responds

---

### Story 1.3: Docker Compose Configuration

As a **developer**,
I want **to configure Docker Compose with frontend, backend, and PostgreSQL containers**,
So that **I can start the complete application stack with a single `docker compose up` command**.

**Acceptance Criteria:**

**Given** the frontend and backend projects are initialized
**When** I create a `docker-compose.yml` file in the project root
**Then** it defines three services: frontend, backend, and postgres

**Given** the Docker Compose file is configured
**When** the frontend service is defined
**Then** it builds from `./frontend/Dockerfile`
**And** it exposes port 3000 to localhost
**And** it sets `NEXT_PUBLIC_API_URL=http://backend:3001`
**And** it depends on the backend service

**Given** the Docker Compose file is configured
**When** the backend service is defined
**Then** it builds from `./backend/Dockerfile`
**And** it exposes port 3001 internally (not to host)
**And** it sets `DATABASE_URL=postgresql://postgres:postgres@postgres:5432/simple_todo`
**And** it depends on the postgres service
**And** it runs Prisma migrations on startup: `npx prisma migrate deploy && npm run start:prod`

**Given** the Docker Compose file is configured
**When** the postgres service is defined
**Then** it uses `postgres:16-alpine` image
**And** it sets POSTGRES_USER, POSTGRES_PASSWORD, and POSTGRES_DB
**And** it mounts a named volume `pgdata` to `/var/lib/postgresql/data`

**Given** the Docker Compose file is configured
**When** I create `frontend/Dockerfile` and `backend/Dockerfile`
**Then** each Dockerfile properly builds and runs its respective application

**Given** all Docker configuration is complete
**When** I run `docker compose up` from the project root
**Then** all three containers start successfully
**And** the frontend is accessible at `http://localhost:3000`
**And** the database is initialized with the tasks table
**And** no manual environment variables are required (FR18)

**Given** the containers are running
**When** I stop and restart with `docker compose down && docker compose up`
**Then** the database data persists due to the named volume

---

## Epic 2: Task Capture & Display

User can add tasks and see them in a list - the core capture experience works.

### Story 2.1: Create Task API Endpoint

As a **developer**,
I want **a POST /tasks endpoint that creates a new task in the database**,
So that **the frontend can persist new tasks**.

**Acceptance Criteria:**

**Given** the backend is running
**When** I send a POST request to `/tasks` with body `{ "title": "Buy groceries" }`
**Then** a new task is created in the database
**And** the response status is 201 Created
**And** the response body contains the created task with id, title, position, and createdAt

**Given** multiple tasks exist
**When** I create a new task
**Then** the new task's position is set to the next available position (max position + 1)
**And** new tasks appear at the bottom of the list

**Given** a request is made with an empty title
**When** the validation runs
**Then** the response status is 400 Bad Request
**And** an appropriate error message is returned

**Given** a task is created successfully
**When** I query the database
**Then** the task is immediately persisted (FR6)

---

### Story 2.2: Get Tasks API Endpoint

As a **developer**,
I want **a GET /tasks endpoint that retrieves all incomplete tasks ordered by position**,
So that **the frontend can display the current task list**.

**Acceptance Criteria:**

**Given** the backend is running
**When** I send a GET request to `/tasks`
**Then** the response status is 200 OK
**And** the response body is an array of tasks

**Given** tasks exist in the database
**When** I retrieve all tasks
**Then** they are ordered by position ascending (lowest position first)
**And** each task includes id, title, position, and createdAt fields

**Given** no tasks exist in the database
**When** I retrieve all tasks
**Then** the response is an empty array `[]`
**And** the response status is still 200 OK

**Given** the API response format
**When** I inspect the JSON response
**Then** it uses camelCase field names (createdAt, not created_at)
**And** dates are formatted as ISO 8601 strings
**And** the response is a direct array (no wrapper object)

---

### Story 2.3: TaskInput Component

As a **user**,
I want **an always-visible text input at the bottom of the screen**,
So that **I can quickly capture tasks by typing and pressing Enter**.

**Acceptance Criteria:**

**Given** I open the application
**When** the page loads
**Then** the TaskInput component is visible at the bottom of the content area
**And** it has placeholder text "Add a task..."
**And** the input is auto-focused and ready for typing (FR13)

**Given** the TaskInput is displayed
**When** I type task text and press Enter
**Then** the input value is submitted to the onSubmit callback
**And** the input is cleared
**And** the input remains focused for rapid task entry (FR1)

**Given** the TaskInput is displayed
**When** I press Enter with an empty input
**Then** nothing is submitted
**And** no error is displayed

**Given** the TaskInput is styled per UX specification
**When** I view the component
**Then** it has 48px height for comfortable touch targets
**And** it has a light border (#E5E7EB)
**And** it shows a blue focus ring (#3B82F6) when focused
**And** it uses 16px system font

**Given** accessibility requirements
**When** I inspect the component
**Then** it has `aria-label="Add a task"`
**And** it is keyboard accessible (Tab navigation works)

---

### Story 2.4: TaskList and TaskItem Components

As a **user**,
I want **to see my tasks displayed in a clean, single-column list**,
So that **I can view all my incomplete tasks at a glance** (FR2).

**Acceptance Criteria:**

**Given** tasks exist in the system
**When** I view the task list
**Then** all incomplete tasks are displayed in a single column
**And** tasks are ordered by position (priority order)
**And** the list is centered with 512px max-width

**Given** the TaskItem component is displayed
**When** I view a task
**Then** it shows the task title text
**And** it has a circle outline on the left (completion target for Epic 3)
**And** it has 16px vertical and horizontal padding
**And** it has a subtle bottom border (#E5E7EB) separating tasks

**Given** the TaskList container is styled
**When** I view the list
**Then** it uses the UX-specified layout (centered, max-width 512px)
**And** there is 8px gap between task items
**And** the background is white (#FFFFFF)

**Given** I hover over a TaskItem
**When** my mouse is over the task
**Then** the background changes to light gray (#F3F4F6)

**Given** accessibility requirements
**When** I inspect the TaskList
**Then** it has `role="list"` and `aria-label="Task list"`
**And** each TaskItem has `role="listitem"`

---

### Story 2.5: EmptyState Component

As a **user**,
I want **to see a friendly message when I have no tasks**,
So that **I understand how to get started** (FR11).

**Acceptance Criteria:**

**Given** the task list is empty
**When** I view the application
**Then** the EmptyState component is displayed instead of the TaskList
**And** the TaskInput remains visible below

**Given** the EmptyState is displayed
**When** I view the message
**Then** I see the heading "No tasks yet"
**And** I see the body text "Add your first task below"
**And** the message is centered in the available space

**Given** the EmptyState styling
**When** I inspect the component
**Then** the heading uses 18px medium weight (#1A1A1A)
**And** the body uses 16px regular weight (#6B7280)
**And** the text is vertically centered in the content area

**Given** accessibility requirements
**When** I inspect the EmptyState
**Then** it has `aria-live="polite"` for screen reader announcements

**Given** I add a task
**When** the task is created
**Then** the EmptyState disappears
**And** the TaskList with the new task is displayed

---

### Story 2.6: Full Stack Integration

As a **user**,
I want **to add tasks and see them persist across browser refreshes**,
So that **I can trust my tasks are saved and won't be lost** (FR6, FR9).

**Acceptance Criteria:**

**Given** the application is running via Docker Compose
**When** I open the application at localhost:3000
**Then** the frontend loads and fetches tasks from the backend API
**And** the page loads in under 1 second (NFR1)

**Given** the frontend needs to communicate with the backend
**When** I create the API client in `lib/api.ts`
**Then** it exports `fetchTasks()` and `createTask(title)` functions
**And** it uses the `NEXT_PUBLIC_API_URL` environment variable
**And** API responses are under 200ms (NFR5)

**Given** I type a task and press Enter
**When** the task is submitted
**Then** the UI updates immediately (optimistic update)
**And** the task appears at the bottom of the list
**And** the API call persists the task to the database (FR6)

**Given** I have added tasks
**When** I refresh the browser
**Then** all my tasks are still displayed (FR9)
**And** they appear in the same order

**Given** the main page component
**When** it renders
**Then** it uses React useState for task state management
**And** it fetches tasks on mount with useEffect
**And** it passes appropriate callbacks to child components

**Given** an API call fails
**When** the error occurs
**Then** the UI silently retries in the background
**And** no error message is shown to the user (per UX spec)

---

## Epic 3: Task Completion & Persistence

User can complete tasks and trust that their data survives browser refreshes and container restarts.

### Story 3.1: Complete Task API Endpoint

As a **developer**,
I want **a PATCH /tasks/:id/complete endpoint that marks a task as complete**,
So that **the frontend can remove completed tasks from the list**.

**Acceptance Criteria:**

**Given** a task exists in the database
**When** I send a PATCH request to `/tasks/123/complete`
**Then** the task is deleted from the database
**And** the response status is 204 No Content

**Given** the task is marked complete
**When** I query the database
**Then** the task no longer exists (permanently deleted, not soft-deleted)
**And** the deletion is immediate (FR7)

**Given** I try to complete a non-existent task
**When** I send PATCH to `/tasks/999/complete`
**Then** the response status is 404 Not Found

**Given** the task is deleted
**When** I call GET /tasks
**Then** the completed task is not in the response

---

### Story 3.2: Task Completion UI

As a **user**,
I want **to complete a task with a single click and see it fade away**,
So that **I feel a sense of accomplishment when finishing tasks** (FR3).

**Acceptance Criteria:**

**Given** a task is displayed in the list
**When** I click on the completion circle (or task row)
**Then** the task fades out with a smooth animation (150-200ms)
**And** the list contracts to fill the space
**And** the task is removed from local state immediately (optimistic update)

**Given** the completion interaction
**When** I click to complete
**Then** no confirmation dialog is shown
**And** the action is immediate and irreversible in the UI

**Given** the API client
**When** completion is triggered
**Then** `completeTask(id)` is called in the background
**And** the API call uses PATCH /tasks/:id/complete

**Given** accessibility requirements
**When** I use keyboard navigation
**Then** I can Tab to the completion button
**And** pressing Space or Enter completes the task
**And** the button has `aria-label="Complete task: {task text}"`

**Given** the animation styling
**When** `prefers-reduced-motion` is enabled
**Then** the fade animation is disabled
**And** the task is removed instantly

**Given** all tasks are completed
**When** the last task fades out
**Then** the EmptyState component is displayed

---

### Story 3.3: Data Persistence Verification

As a **user**,
I want **my tasks to survive container restarts**,
So that **I can trust my data is safe even after system restarts** (FR10).

**Acceptance Criteria:**

**Given** tasks exist in the application
**When** I run `docker compose down`
**Then** the containers stop

**Given** the containers were stopped
**When** I run `docker compose up`
**Then** all containers start successfully
**And** the database reconnects automatically (NFR9)

**Given** the containers have restarted
**When** I open the application
**Then** all my previously created tasks are displayed
**And** they appear in the correct order
**And** no data has been lost (FR10)

**Given** the PostgreSQL container
**When** I inspect the Docker configuration
**Then** the `pgdata` named volume is mounted to `/var/lib/postgresql/data`
**And** this volume persists across container restarts

**Given** I add a new task after restart
**When** I refresh the browser
**Then** both old and new tasks are displayed correctly

**Given** the reliability requirement
**When** the system operates normally
**Then** there is zero task loss (NFR6)
**And** data integrity is maintained at 100% (NFR8)

---

## Epic 4: Task Reordering & Priority Management

User can drag tasks to reorder priority, with changes auto-saved instantly.

### Story 4.1: Reorder Tasks API Endpoint

As a **developer**,
I want **a PATCH /tasks/reorder endpoint that updates task positions**,
So that **the frontend can persist drag-and-drop reordering**.

**Acceptance Criteria:**

**Given** the backend is running
**When** I send a PATCH request to `/tasks/reorder` with body `{ "taskIds": [3, 1, 2] }`
**Then** the tasks are reordered so task 3 has position 0, task 1 has position 1, task 2 has position 2
**And** the response status is 200 OK
**And** the response body contains the updated tasks in new order

**Given** the reorder is performed
**When** I query GET /tasks
**Then** the tasks are returned in the new order
**And** the order persists immediately (FR8)

**Given** invalid task IDs are provided
**When** I send a reorder request with non-existent IDs
**Then** the response status is 400 Bad Request
**And** an appropriate error message is returned

**Given** the reorder operation
**When** performed in the database
**Then** it uses a transaction to ensure atomic updates
**And** data integrity is maintained (NFR8)

---

### Story 4.2: Drag-and-Drop Integration

As a **user**,
I want **to drag tasks to reorder them with visual feedback**,
So that **I can easily prioritize my work** (FR4, FR12).

**Acceptance Criteria:**

**Given** the frontend project
**When** I install drag-and-drop dependencies
**Then** `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` are added

**Given** the TaskList component
**When** I wrap it with DndContext and SortableContext
**Then** tasks become draggable and sortable

**Given** I click and hold on a task
**When** I start dragging
**Then** the task shows a dragging state (slight elevation/shadow, reduced opacity on original position)
**And** the cursor changes to indicate dragging

**Given** I am dragging a task
**When** I move it over other tasks
**Then** other tasks animate to make room for the drop
**And** a visual drop indicator shows where the task will land (FR12)

**Given** I release the task
**When** the drop completes
**Then** the task animates smoothly to its new position
**And** the list reflects the new order immediately

**Given** accessibility requirements
**When** I use keyboard navigation
**Then** I can reorder tasks using keyboard (Space to pick up, arrows to move, Space to drop)
**And** screen readers announce the drag operation

**Given** the animation timing
**When** tasks animate during drag
**Then** movements are smooth and real-time (no delay)
**And** the drop animation is under 150ms

---

### Story 4.3: Optimistic Reorder with Persistence

As a **user**,
I want **my task reordering to save automatically when I drop a task**,
So that **I never have to worry about losing my priority changes** (FR5, FR8).

**Acceptance Criteria:**

**Given** the API client
**When** I add the reorder function to `lib/api.ts`
**Then** `reorderTasks(taskIds: number[])` calls PATCH /tasks/reorder
**And** it sends the array of task IDs in the new order

**Given** I complete a drag-and-drop operation
**When** I release the task in a new position
**Then** the UI updates immediately (optimistic update)
**And** the local state reflects the new order
**And** the API call is made in the background (FR5)

**Given** the API call succeeds
**When** the persistence completes
**Then** no visible indication is shown to the user (silent save)
**And** the persistence happens within 500ms (NFR4)

**Given** the API call fails
**When** the error occurs
**Then** the UI silently retries the request
**And** if retry fails, the local state rolls back to the previous order
**And** no error message is shown to the user (per UX spec)

**Given** I refresh the browser after reordering
**When** the page loads
**Then** the tasks appear in the reordered position
**And** the order has been persisted (FR8)

**Given** rapid drag operations
**When** I reorder multiple times quickly
**Then** each reorder is saved (debounced if needed)
**And** the final order is correctly persisted

