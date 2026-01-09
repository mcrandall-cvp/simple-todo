# Story 2.1: Create Task API Endpoint

Status: done

## Story

As a **developer**,
I want **a POST /tasks endpoint that creates a new task in the database**,
So that **the frontend can persist new tasks**.

## Acceptance Criteria

### AC1: Basic Task Creation
**Given** the backend is running
**When** I send a POST request to `/tasks` with body `{ "title": "Buy groceries" }`
**Then** a new task is created in the database
**And** the response status is 201 Created
**And** the response body contains the created task with id, title, position, and createdAt

### AC2: Position Assignment
**Given** multiple tasks exist
**When** I create a new task
**Then** the new task's position is set to the next available position (max position + 1)
**And** new tasks appear at the bottom of the list

### AC3: Empty Title Validation
**Given** a request is made with an empty title
**When** the validation runs
**Then** the response status is 400 Bad Request
**And** an appropriate error message is returned

### AC4: Immediate Persistence
**Given** a task is created successfully
**When** I query the database
**Then** the task is immediately persisted (FR6)

## Tasks / Subtasks

- [x] Task 1: Create Tasks Module Structure (AC: #1)
  - [x] 1.1 Create `backend/src/tasks/` directory
  - [x] 1.2 Create `tasks.module.ts` with NestJS module decorator
  - [x] 1.3 Create `tasks.controller.ts` with @Controller('tasks') decorator
  - [x] 1.4 Create `tasks.service.ts` with @Injectable() decorator
  - [x] 1.5 Import TasksModule in AppModule

- [x] Task 2: Create DTOs with Validation (AC: #1, #3)
  - [x] 2.1 Create `backend/src/tasks/dto/` directory
  - [x] 2.2 Create `create-task.dto.ts` with title validation
  - [x] 2.3 Add @IsString(), @IsNotEmpty(), @MinLength(1) decorators
  - [x] 2.4 Configure ValidationPipe globally in main.ts (if not already)

- [x] Task 3: Implement TasksService.create() (AC: #1, #2, #4)
  - [x] 3.1 Inject PrismaService into TasksService
  - [x] 3.2 Implement create() method that:
    - Finds max position of existing tasks
    - Sets new task position to max + 1 (or 0 if no tasks)
    - Creates task with Prisma
    - Returns created task
  - [x] 3.3 Ensure immediate database persistence

- [x] Task 4: Implement TasksController.create() (AC: #1)
  - [x] 4.1 Add @Post() endpoint handler
  - [x] 4.2 Use @Body() decorator with CreateTaskDto
  - [x] 4.3 Return 201 status code with created task
  - [x] 4.4 Ensure response uses camelCase (createdAt, not created_at)

- [x] Task 5: Test Endpoint Functionality (AC: #1, #2, #3, #4)
  - [x] 5.1 Test via curl or HTTP client:
    - POST /tasks with valid title → 201 + task object
    - POST /tasks with empty title → 400 Bad Request
    - POST /tasks multiple times → positions increment correctly
  - [x] 5.2 Verify database contains created tasks
  - [x] 5.3 Verify response format matches architecture spec

## Dev Notes

### Technology Stack (CRITICAL - from Story 1.2 learnings)
- **NestJS Version:** 11.0.1+
- **Prisma Version:** 6.3.1 (downgraded from 7.2.0 due to breaking changes)
- **TypeScript:** Strict mode enabled
- **Validation:** class-validator 0.14.1, class-transformer 0.5.1 (already installed in Story 1.2)
- **Node Version:** 20+ required (use Docker container for testing)

### Architecture Patterns (CRITICAL)

**Backend Structure (from architecture.md):**
```
backend/src/tasks/
├── tasks.module.ts       # Module registration
├── tasks.controller.ts   # REST endpoint handlers
├── tasks.service.ts      # Business logic + Prisma calls
└── dto/
    └── create-task.dto.ts
```

**Naming Conventions:**
| Element | Convention | Example |
|---------|------------|---------|
| Controller | PascalCase + Controller | `TasksController` |
| Service | PascalCase + Service | `TasksService` |
| Module | PascalCase + Module | `TasksModule` |
| DTO | PascalCase + Dto | `CreateTaskDto` |
| Route | kebab-case, plural | `/tasks` |

### API Response Format (CRITICAL)

**Success Response - Direct data, NO wrapper:**
```json
{
  "id": 1,
  "title": "Buy groceries",
  "position": 0,
  "createdAt": "2026-01-08T10:00:00.000Z"
}
```

**Error Response (NestJS standard):**
```json
{
  "statusCode": 400,
  "message": ["title should not be empty"],
  "error": "Bad Request"
}
```

**ANTI-PATTERNS TO AVOID:**
```typescript
// WRONG: Wrapper object
return { data: task, success: true };

// WRONG: snake_case in JSON
{ created_at: "...", task_id: 1 }

// CORRECT: Direct camelCase response
return task; // Prisma returns camelCase by default
```

### Prisma Schema Reference (from Story 1.2)
```prisma
model Task {
  id        Int      @id @default(autoincrement())
  title     String
  position  Int
  createdAt DateTime @default(now()) @map("created_at")

  @@index([position])
  @@map("tasks")
}
```

### Position Assignment Logic
```typescript
// Get max position and add 1, or start at 0
const maxPosition = await this.prisma.task.aggregate({
  _max: { position: true }
});
const newPosition = (maxPosition._max.position ?? -1) + 1;
```

### Validation Setup
```typescript
// main.ts - Global validation pipe (verify this exists)
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,
}));

// create-task.dto.ts
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title: string;
}
```

### CORS Configuration (from Story 1.2)
Backend already configured with CORS:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
});
```

### Testing Commands (run inside Docker)
```bash
# Start the stack
docker compose up -d

# Test endpoint via curl
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries"}'

# Test validation (should return 400)
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": ""}'

# Verify database
docker compose exec postgres psql -U postgres -d simple_todo -c "SELECT * FROM tasks;"
```

### Previous Story Intelligence (from Epic 1)

**Key Learnings from Story 1.2:**
- PrismaService already created at `backend/src/prisma/prisma.service.ts`
- PrismaModule already exported and available for import
- ValidationPipe should be added to main.ts if not present
- class-validator and class-transformer already installed
- CORS already configured with correct methods

**Key Learnings from Story 1.3:**
- Backend port 3001 is exposed to host (http://localhost:3001)
- Test inside Docker: `docker compose exec backend npm test`
- Database connection string: `postgresql://postgres:postgres@postgres:5432/simple_todo`

### Project Structure Notes

**Alignment with architecture.md:**
- Tasks module goes in `backend/src/tasks/` directory
- Controller handles HTTP layer only
- Service handles business logic and Prisma calls
- DTOs define request/response shapes with validation

**Files to Create:**
- `backend/src/tasks/tasks.module.ts`
- `backend/src/tasks/tasks.controller.ts`
- `backend/src/tasks/tasks.service.ts`
- `backend/src/tasks/dto/create-task.dto.ts`

**Files to Modify:**
- `backend/src/app.module.ts` (import TasksModule)
- `backend/src/main.ts` (add ValidationPipe if not present)

### References

- [Source: architecture.md#API-Endpoints] - POST /tasks specification
- [Source: architecture.md#Implementation-Patterns] - Naming conventions
- [Source: architecture.md#Data-Architecture] - Prisma schema
- [Source: epics.md#Story-2.1] - Acceptance criteria
- [Source: project-context.md#API-Response-Format] - Response format rules
- [Source: 1-2-initialize-backend-project-with-prisma.md] - Backend setup details
- [Source: 1-3-docker-compose-configuration.md] - Docker testing commands

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Initial build failed due to Prisma client not generated in Docker build context
- DTO required definite assignment assertion (`title!: string`) for TypeScript strict mode compatibility
- Docker container rebuild required to pick up new source files

### Completion Notes List

1. **AC1 - Basic Task Creation:** COMPLETE
   - POST /tasks returns 201 Created
   - Response contains id, title, position, createdAt (camelCase)
   - Example response: `{"id": 3, "title": "Buy groceries", "position": 0, "createdAt": "2026-01-09T06:07:32.089Z"}`

2. **AC2 - Position Assignment:** COMPLETE
   - Position calculated as max(position) + 1, starting at 0
   - Tested: First task gets position 0, second gets position 1
   - New tasks appear at the bottom of the list

3. **AC3 - Empty Title Validation:** COMPLETE
   - Returns 400 Bad Request with validation errors
   - Error response: `{"message": ["title must be longer than or equal to 1 characters", "title should not be empty"], "error": "Bad Request", "statusCode": 400}`

4. **AC4 - Immediate Persistence:** COMPLETE
   - Tasks immediately visible in database after creation
   - Verified via direct PostgreSQL query

### File List

**Created Files:**
- backend/src/tasks/tasks.module.ts
- backend/src/tasks/tasks.controller.ts
- backend/src/tasks/tasks.service.ts
- backend/src/tasks/dto/create-task.dto.ts
- backend/src/tasks/tasks.service.spec.ts (added during review)
- backend/src/tasks/tasks.controller.spec.ts (added during review)

**Modified Files:**
- backend/src/app.module.ts (added TasksModule import)
- backend/src/main.ts (added ValidationPipe global configuration)

## Senior Developer Review (AI)

### Review Date
2026-01-09

### Reviewer
Claude Opus 4.5 (Adversarial Code Review)

### Issues Found

| # | Severity | Issue | File | Resolution |
|---|----------|-------|------|------------|
| H1 | HIGH | No unit tests for TasksService or TasksController | backend/src/tasks/ | Added tasks.service.spec.ts and tasks.controller.spec.ts |
| H2 | HIGH | Race condition in position assignment (TOCTOU) | backend/src/tasks/tasks.service.ts | Wrapped in Prisma $transaction |
| H3 | HIGH | Missing @MaxLength validation on title (DoS risk) | backend/src/tasks/dto/create-task.dto.ts | Added @MaxLength(500) |
| M1 | MEDIUM | Missing return type annotations | tasks.controller.ts, tasks.service.ts | Added Promise<Task> return types |
| M2 | MEDIUM | Controller missing async/await pattern | backend/src/tasks/tasks.controller.ts | Added async/await |
| M3 | MEDIUM | No error handling in service layer | backend/src/tasks/tasks.service.ts | Added try/catch with Logger |
| M4 | MEDIUM | Redundant @HttpCode decorator | backend/src/tasks/tasks.controller.ts | Removed (NestJS defaults to 201 for POST) |
| L1 | LOW | Inconsistent DTO property declaration | backend/src/tasks/dto/create-task.dto.ts | Kept `!:` assertion (acceptable) |
| L2 | LOW | Missing index comment in service | backend/src/tasks/tasks.service.ts | Added comment about position index |

### All Issues Fixed
All 7 HIGH and MEDIUM issues have been resolved. 2 LOW issues noted but not blocking.

### Files Modified During Review

- backend/src/tasks/tasks.service.ts - Added transaction, error handling, Logger, return type
- backend/src/tasks/tasks.controller.ts - Added async/await, return type, removed @HttpCode
- backend/src/tasks/dto/create-task.dto.ts - Added @MaxLength(500)
- backend/src/tasks/tasks.service.spec.ts - New unit test file (4 tests)
- backend/src/tasks/tasks.controller.spec.ts - New unit test file (3 tests)

### Review Outcome
**APPROVED** - All HIGH and MEDIUM issues fixed. Story ready for completion.

## Change Log

- 2026-01-08: Story created via create-story workflow - ready for development
- 2026-01-09: Story implemented - POST /tasks endpoint with validation, position assignment, all ACs verified via curl tests
- 2026-01-09: Senior Developer Review completed - 9 issues found, 7 fixed (3 HIGH, 4 MEDIUM)
