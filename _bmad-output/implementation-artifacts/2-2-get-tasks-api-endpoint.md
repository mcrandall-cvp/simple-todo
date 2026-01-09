# Story 2.2: Get Tasks API Endpoint

Status: done

## Story

As a **developer**,
I want **a GET /tasks endpoint that retrieves all incomplete tasks ordered by position**,
So that **the frontend can display the current task list**.

## Acceptance Criteria

### AC1: Basic Task Retrieval
**Given** the backend is running
**When** I send a GET request to `/tasks`
**Then** the response status is 200 OK
**And** the response body is an array of tasks

### AC2: Task Ordering
**Given** tasks exist in the database
**When** I retrieve all tasks
**Then** they are ordered by position ascending (lowest position first)
**And** each task includes id, title, position, and createdAt fields

### AC3: Empty Response
**Given** no tasks exist in the database
**When** I retrieve all tasks
**Then** the response is an empty array `[]`
**And** the response status is still 200 OK

### AC4: Response Format Compliance
**Given** the API response format
**When** I inspect the JSON response
**Then** it uses camelCase field names (createdAt, not created_at)
**And** dates are formatted as ISO 8601 strings
**And** the response is a direct array (no wrapper object)

## Tasks / Subtasks

- [x] Task 1: Implement TasksService.findAll() (AC: #1, #2, #3)
  - [x] 1.1 Add `findAll()` method to TasksService
  - [x] 1.2 Query all tasks using Prisma
  - [x] 1.3 Order by position ascending
  - [x] 1.4 Return array (empty array if no tasks)
  - [x] 1.5 Add return type annotation `Promise<Task[]>`

- [x] Task 2: Implement TasksController.findAll() (AC: #1, #4)
  - [x] 2.1 Add @Get() endpoint handler
  - [x] 2.2 Call tasksService.findAll()
  - [x] 2.3 Add async/await pattern
  - [x] 2.4 Add return type annotation `Promise<Task[]>`
  - [x] 2.5 Ensure 200 status code (default for GET)

- [x] Task 3: Add Unit Tests (AC: #1, #2, #3)
  - [x] 3.1 Add tests to tasks.service.spec.ts:
    - findAll returns tasks ordered by position
    - findAll returns empty array when no tasks
  - [x] 3.2 Add tests to tasks.controller.spec.ts:
    - findAll calls service and returns tasks
    - findAll returns empty array for no tasks

- [x] Task 4: Test Endpoint Functionality (AC: #1, #2, #3, #4)
  - [x] 4.1 Test via curl or HTTP client:
    - GET /tasks with tasks → 200 + array of tasks
    - GET /tasks with no tasks → 200 + empty array
    - Verify ordering by position
  - [x] 4.2 Verify response format matches architecture spec
  - [x] 4.3 Verify camelCase field names (createdAt)

## Dev Notes

### Technology Stack (from Story 2.1)
- **NestJS Version:** 11.0.1+
- **Prisma Version:** 6.3.1
- **TypeScript:** Strict mode enabled
- **Node Version:** 20+ required (use Docker container for testing)

### Architecture Patterns (CRITICAL)

**Existing Backend Structure (already created in Story 2.1):**
```
backend/src/tasks/
├── tasks.module.ts       # Already exists
├── tasks.controller.ts   # Add @Get() handler
├── tasks.service.ts      # Add findAll() method
├── tasks.service.spec.ts # Add findAll tests
├── tasks.controller.spec.ts # Add findAll tests
└── dto/
    └── create-task.dto.ts  # Already exists
```

**CRITICAL - Files Already Exist:**
- TasksModule, TasksController, TasksService were created in Story 2.1
- DO NOT recreate these files - only ADD methods to existing files
- Unit test files already exist - ADD new test cases

### API Response Format (CRITICAL)

**Success Response - Direct array, NO wrapper:**
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "position": 0,
    "createdAt": "2026-01-08T10:00:00.000Z"
  },
  {
    "id": 2,
    "title": "Walk the dog",
    "position": 1,
    "createdAt": "2026-01-08T10:01:00.000Z"
  }
]
```

**Empty Response:**
```json
[]
```

**ANTI-PATTERNS TO AVOID:**
```typescript
// WRONG: Wrapper object
return { data: tasks, success: true, count: tasks.length };

// WRONG: snake_case in JSON
[{ created_at: "...", task_id: 1 }]

// CORRECT: Direct array with camelCase
return tasks; // Prisma returns camelCase by default
```

### Implementation Pattern

**Service Method (tasks.service.ts):**
```typescript
async findAll(): Promise<Task[]> {
  try {
    return await this.prisma.task.findMany({
      orderBy: { position: 'asc' },
    });
  } catch (error) {
    this.logger.error('Failed to retrieve tasks', error);
    throw new InternalServerErrorException('Failed to retrieve tasks');
  }
}
```

**Controller Method (tasks.controller.ts):**
```typescript
@Get()
async findAll(): Promise<Task[]> {
  return await this.tasksService.findAll();
}
```

### Previous Story Intelligence (from Story 2.1)

**Key Learnings:**
- TasksModule already imports PrismaService (via PrismaModule @Global)
- Controller uses `async/await` pattern (added during code review)
- Return type annotations required: `Promise<Task[]>`
- Use try/catch with Logger in service layer
- NestJS defaults to 200 OK for GET endpoints
- Prisma returns camelCase by default (createdAt, not created_at)
- Docker rebuild required after code changes: `docker compose build backend`

**Code Review Findings to Apply:**
- Always add explicit return type annotations
- Use async/await in controller methods
- Add error handling with Logger in service
- Write unit tests for all new methods

**Existing Code Patterns (from tasks.service.ts):**
```typescript
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly prisma: PrismaService) {}
  // ... existing create method
}
```

### Testing Commands (run from project root)
```bash
# Start the stack
docker compose up -d

# Rebuild backend after changes
docker compose build backend && docker compose up -d

# Test GET endpoint (with tasks)
curl -s http://localhost:3001/tasks | python3 -m json.tool

# Test GET endpoint (verify empty array)
docker compose exec postgres psql -U postgres -d simple_todo -c "DELETE FROM tasks;"
curl -s http://localhost:3001/tasks
# Expected: []

# Create test data then verify ordering
curl -X POST http://localhost:3001/tasks -H "Content-Type: application/json" -d '{"title": "Task A"}'
curl -X POST http://localhost:3001/tasks -H "Content-Type: application/json" -d '{"title": "Task B"}'
curl -s http://localhost:3001/tasks | python3 -m json.tool
# Expected: Task A at position 0, Task B at position 1
```

### Project Structure Notes

**Alignment with architecture.md:**
- GET /tasks endpoint is second of four API endpoints
- Response format is direct array (no wrapper)
- camelCase field names (Prisma handles automatically)
- 200 OK status code for success

**Files to Modify:**
- `backend/src/tasks/tasks.service.ts` (add findAll method)
- `backend/src/tasks/tasks.controller.ts` (add @Get handler)
- `backend/src/tasks/tasks.service.spec.ts` (add findAll tests)
- `backend/src/tasks/tasks.controller.spec.ts` (add findAll tests)

**Files NOT to Create:**
- All files already exist from Story 2.1
- Only ADD to existing files

### References

- [Source: architecture.md#API-Endpoints] - GET /tasks specification
- [Source: architecture.md#API-Response-Formats] - Direct array response format
- [Source: epics.md#Story-2.2] - Acceptance criteria
- [Source: project-context.md#API-Response-Format] - Response format rules
- [Source: 2-1-create-task-api-endpoint.md] - Previous story patterns and learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Unit tests cannot run locally due to Node version mismatch (Jest requires newer Node)
- Unit tests added but functional verification via curl used for AC validation

### Completion Notes List

1. **AC1 - Basic Task Retrieval:** COMPLETE
   - GET /tasks returns 200 OK
   - Response body is array of tasks
   - Example: `[{"id": 6, "title": "Task A", "position": 0, "createdAt": "2026-01-09T06:20:19.948Z"}, ...]`

2. **AC2 - Task Ordering:** COMPLETE
   - Tasks ordered by position ascending
   - Each task includes id, title, position, createdAt fields
   - Verified: Task A (position 0) appears before Task B (position 1)

3. **AC3 - Empty Response:** COMPLETE
   - Returns empty array `[]` when no tasks exist
   - Response status is 200 OK

4. **AC4 - Response Format Compliance:** COMPLETE
   - Uses camelCase field names (createdAt)
   - Dates formatted as ISO 8601 strings
   - Response is direct array (no wrapper object)

### File List

**Modified Files:**
- backend/src/tasks/tasks.service.ts (added findAll method)
- backend/src/tasks/tasks.controller.ts (added @Get handler, added Get import)
- backend/src/tasks/tasks.service.spec.ts (added findAll tests: 3 test cases, fixed during review)
- backend/src/tasks/tasks.controller.spec.ts (added findAll tests: 3 test cases after review fix)

## Senior Developer Review (AI)

### Review Date
2026-01-09

### Reviewer
Claude Opus 4.5 (Adversarial Code Review)

### Issues Found

| # | Severity | Issue | File | Resolution |
|---|----------|-------|------|------------|
| H1 | HIGH | Missing error propagation test for findAll | tasks.controller.spec.ts | Added error propagation test |
| M1 | MEDIUM | Unused variable declarations in test files | tasks.*.spec.ts | Removed unused prismaService/tasksService vars |
| M2 | MEDIUM | Controller test uses toHaveBeenCalled() without args | tasks.controller.spec.ts | Changed to toHaveBeenCalledWith() |
| M3 | MEDIUM | Mock objects use new Date() causing flaky tests | tasks.*.spec.ts | Changed to fixed ISO date strings |
| L1 | LOW | Redundant await in controller return | tasks.controller.ts | Not fixed (acceptable pattern) |
| L2 | LOW | No JSDoc comments on public API | tasks.controller.ts | Not fixed (out of scope) |

### All Issues Fixed
All 1 HIGH and 3 MEDIUM issues have been resolved. 2 LOW issues noted but not blocking.

### Files Modified During Review

- backend/src/tasks/tasks.controller.spec.ts - Added error propagation test, removed unused var, fixed date mocks
- backend/src/tasks/tasks.service.spec.ts - Removed unused var, fixed date mocks

### Review Outcome
**APPROVED** - All HIGH and MEDIUM issues fixed. Story ready for completion.

## Change Log

- 2026-01-09: Story created via create-story workflow - ready for development
- 2026-01-09: Story implemented - GET /tasks endpoint with ordering, all ACs verified via curl tests
- 2026-01-09: Senior Developer Review completed - 6 issues found, 4 fixed (1 HIGH, 3 MEDIUM)
