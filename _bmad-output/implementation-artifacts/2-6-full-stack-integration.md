# Story 2.6: Full Stack Integration

Status: done

## Story

As a **user**,
I want **to add tasks and see them persist across browser refreshes**,
So that **I can trust my tasks are saved and won't be lost** (FR6, FR9).

## Acceptance Criteria

### AC1: Application Loads and Fetches Tasks
**Given** the application is running via Docker Compose
**When** I open the application at localhost:3000
**Then** the frontend loads and fetches tasks from the backend API
**And** the page loads in under 1 second (NFR1)

### AC2: API Client Implementation
**Given** the frontend needs to communicate with the backend
**When** I create the API client in `lib/api.ts`
**Then** it exports `fetchTasks()` and `createTask(title)` functions
**And** it uses the `NEXT_PUBLIC_API_URL` environment variable
**And** API responses are under 200ms (NFR5)

### AC3: Task Creation with Optimistic Updates
**Given** I type a task and press Enter
**When** the task is submitted
**Then** the UI updates immediately (optimistic update)
**And** the task appears at the bottom of the list
**And** the API call persists the task to the database (FR6)

### AC4: Task Persistence Across Refresh
**Given** I have added tasks
**When** I refresh the browser
**Then** all my tasks are still displayed (FR9)
**And** they appear in the same order

### AC5: Main Page State Management
**Given** the main page component
**When** it renders
**Then** it uses React useState for task state management
**And** it fetches tasks on mount with useEffect
**And** it passes appropriate callbacks to child components

### AC6: Silent Error Handling
**Given** an API call fails
**When** the error occurs
**Then** the UI silently retries in the background
**And** no error message is shown to the user (per UX spec)

## Tasks / Subtasks

- [x] Task 1: Create API Client (AC: #2, #6)
  - [x] 1.1 Create `frontend/src/lib/api.ts`
  - [x] 1.2 Add `API_BASE` constant using `NEXT_PUBLIC_API_URL` env var
  - [x] 1.3 Implement `fetchTasks(): Promise<Task[]>` function
  - [x] 1.4 Implement `createTask(title: string): Promise<Task>` function
  - [x] 1.5 Add silent retry logic (3 attempts, no user-facing errors)
  - [x] 1.6 Write unit tests for api.ts

- [x] Task 2: Implement Main Page Component (AC: #1, #3, #4, #5)
  - [x] 2.1 Replace default page.tsx with task management page
  - [x] 2.2 Add "use client" directive
  - [x] 2.3 Implement useState for tasks array
  - [x] 2.4 Implement useEffect for initial task fetch
  - [x] 2.5 Implement handleAddTask with optimistic updates
  - [x] 2.6 Add conditional rendering: EmptyState vs TaskList
  - [x] 2.7 Integrate TaskInput component with onSubmit handler
  - [x] 2.8 Apply layout styling (max-width 512px, centered)
  - [x] 2.9 Write unit tests for page.tsx

- [x] Task 3: Docker Build Verification (AC: All)
  - [x] 3.1 Run `docker compose build frontend`
  - [x] 3.2 Verify no TypeScript compilation errors
  - [x] 3.3 Run `docker compose up` and verify full stack integration
  - [x] 3.4 Test task creation persists to database
  - [x] 3.5 Test task persistence across browser refresh

## Dev Notes

### Technology Stack
- **Next.js Version:** 16.1.1+ with App Router
- **TypeScript:** Strict mode enabled
- **Tailwind CSS:** Latest (NO component libraries)
- **React:** Functional components with TypeScript
- **State Management:** React useState ONLY - no external libraries
- **HTTP Client:** Native fetch API ONLY - no axios or other libraries

### Architecture Patterns (CRITICAL)

**Frontend Component Structure:**
```
frontend/src/
├── app/
│   ├── page.tsx      # THIS STORY - Rewrite completely
│   └── layout.tsx    # Root layout (DO NOT MODIFY)
├── components/
│   ├── TaskInput.tsx # Story 2.3 - DONE ✅
│   ├── TaskList.tsx  # Story 2.4 - DONE ✅
│   ├── TaskItem.tsx  # Story 2.4 - DONE ✅
│   └── EmptyState.tsx # Story 2.5 - DONE ✅
└── lib/
    ├── types.ts      # Story 2.4 - DONE ✅
    └── api.ts        # THIS STORY - Create this file
```

### API Client Implementation (CRITICAL)

**From architecture.md - API Integration Pattern:**
```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://backend:3001';

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE}/tasks`);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}

export async function createTask(title: string): Promise<Task> {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error('Failed to create');
  return response.json();
}
```

**Silent Retry Pattern:**
```typescript
async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === attempts - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error('Retry exhausted');
}
```

### Main Page Implementation (CRITICAL)

**Component Data Flow (from architecture.md):**
```
App (useState: tasks[])
  ├── TaskList (props: tasks, onComplete, onReorder)
  │     └── TaskItem (props: task, onComplete)
  ├── TaskInput (props: onSubmit)
  └── EmptyState (conditional render)
```

**Optimistic Update Pattern (CRITICAL):**
```typescript
// 1. Update local state immediately
// 2. Send API request in background
// 3. On failure: rollback to previous state, retry silently

const handleAddTask = async (title: string) => {
  // Optimistic update - create temporary task
  const tempTask: Task = {
    id: Date.now(), // Temporary ID
    title,
    position: tasks.length,
    createdAt: new Date().toISOString(),
  };
  setTasks(prev => [...prev, tempTask]);

  try {
    // Persist to backend
    const savedTask = await createTask(title);
    // Replace temp task with real one
    setTasks(prev => prev.map(t => t.id === tempTask.id ? savedTask : t));
  } catch {
    // Rollback on failure - silent recovery
    setTasks(prev => prev.filter(t => t.id !== tempTask.id));
  }
};
```

### Page Layout Requirements (CRITICAL)

**From UX specification and architecture.md:**
- Container: `max-w-[512px] mx-auto` (centered, 512px max-width)
- Background: `bg-white` (per EmptyState pattern)
- Min height: `min-h-screen` for full viewport height
- Padding: `p-4` or `px-4 py-8` for breathing room

**Page Structure:**
```tsx
<main className="min-h-screen bg-white">
  <div className="w-full max-w-[512px] mx-auto px-4 py-8 flex flex-col min-h-screen">
    {/* Content area - grows to push input to bottom */}
    <div className="flex-grow">
      {tasks.length === 0 ? <EmptyState /> : <TaskList tasks={tasks} />}
    </div>
    {/* Input always at bottom */}
    <TaskInput onSubmit={handleAddTask} />
  </div>
</main>
```

### Error Handling (CRITICAL)

**From project-context.md:**
- **Frontend:** Silent retry (3 attempts), then log to console. NEVER show error dialogs to user
- **Optimistic updates:** Update local state immediately, rollback on API failure
- **NO loading spinners** - use optimistic updates pattern

### API Response Format

**From architecture.md - Direct data, no wrapper:**
```json
// GET /tasks returns:
[
  { "id": 1, "title": "Buy groceries", "position": 0, "createdAt": "2026-01-08T10:00:00Z" }
]

// POST /tasks returns:
{ "id": 2, "title": "New task", "position": 1, "createdAt": "2026-01-08T10:01:00Z" }
```

### Existing Components Interface

**TaskInput (Story 2.3):**
```typescript
interface TaskInputProps {
  onSubmit: (title: string) => void;
}
```

**TaskList (Story 2.4):**
```typescript
interface TaskListProps {
  tasks: Task[];
  onComplete?: (id: number) => void; // Optional - used in Epic 3
}
```

**EmptyState (Story 2.5):**
```typescript
// No props - stateless component
export default function EmptyState()
```

**Task Type (lib/types.ts):**
```typescript
export interface Task {
  id: number;
  title: string;
  position: number;
  createdAt: string; // ISO 8601 string from API
}
```

### Previous Story Intelligence

**Key Learnings from Story 2.5 (EmptyState):**
- "use client" directive is required for any client-side component
- Tailwind classes work as expected in Docker build
- Container pattern: `w-full max-w-[512px] mx-auto bg-white`
- Motion accessibility: `motion-reduce:transition-none`
- All components use default export function pattern
- Code review found need for `bg-white` consistency across components
- TDD approach: Write tests first, then implementation
- Test coverage must be 85%+

**Established Patterns:**
- Container: `w-full max-w-[512px] mx-auto`
- Background: `bg-white` (consistent across all components)
- Text color: `text-gray-900` for primary, `text-gray-500` for secondary
- Border color: `border-gray-200`
- Motion accessibility: `motion-reduce:transition-none`

**Git History Insights (Recent Commits):**
- TDD methodology established and enforced
- Code review process includes adversarial review
- PR workflow targets `dev` branch, not `main`
- Branch naming: `feature/story-{ID}-{description}`

### Backend API Endpoints (Already Implemented)

**GET /tasks:**
- Returns: `Task[]` ordered by position ascending
- Empty array if no tasks

**POST /tasks:**
- Request: `{ "title": "Task text" }`
- Returns: Created `Task` with auto-assigned position
- Uses transaction for race-safe position assignment

### Environment Configuration

**Docker Environment (from docker-compose.yml):**
```yaml
frontend:
  environment:
    - NEXT_PUBLIC_API_URL=http://backend:3001
```

**Local Development:**
- When running outside Docker, `NEXT_PUBLIC_API_URL` defaults to `http://backend:3001`
- For local dev without Docker, may need to set to `http://localhost:3001`

### Testing Requirements (CRITICAL)

**TDD Approach Required:**
1. **RED** - Write failing tests first
2. **GREEN** - Implement minimal code to pass
3. **REFACTOR** - Clean up while keeping tests green

**Test Coverage:** 85%+ required

**Test Files to Create:**
- `frontend/src/lib/__tests__/api.test.ts` - API client tests
- `frontend/src/app/__tests__/page.test.tsx` - Page component tests

**Test Patterns (from existing test files):**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
```

### Project Structure Notes

**Alignment with architecture.md:**
- API client goes in `frontend/src/lib/api.ts`
- Page component at `frontend/src/app/page.tsx`
- All components already exist and are ready to integrate

**Files to Create:**
1. `frontend/src/lib/api.ts` - API client functions
2. `frontend/src/lib/__tests__/api.test.ts` - API tests
3. `frontend/src/app/__tests__/page.test.tsx` - Page tests

**Files to Modify:**
1. `frontend/src/app/page.tsx` - Complete rewrite from Next.js template

**Files NOT to Modify:**
- `frontend/src/components/TaskInput.tsx` (already complete)
- `frontend/src/components/TaskList.tsx` (already complete)
- `frontend/src/components/TaskItem.tsx` (already complete)
- `frontend/src/components/EmptyState.tsx` (already complete)
- `frontend/src/lib/types.ts` (Task interface already defined)

### What NOT to Do in This Story

1. **DO NOT add loading spinners** - Use optimistic updates
2. **DO NOT show error messages** - Silent recovery only
3. **DO NOT use external state libraries** - React useState only
4. **DO NOT use axios or other HTTP libraries** - Native fetch only
5. **DO NOT add confirmation dialogs** - Actions are immediate
6. **DO NOT modify existing components** - Only integrate them
7. **DO NOT add new components** - Use the 4 existing ones
8. **DO NOT wrap API responses** - Return data directly

### Verification Commands

```bash
# Create feature branch first
git checkout -b feature/story-2-6-full-stack-integration

# Run tests (TDD - should fail initially)
docker compose exec frontend npm test

# Run test coverage
docker compose exec frontend npm run test:coverage

# Rebuild frontend after changes
docker compose build frontend

# Start full stack
docker compose up -d

# View frontend logs
docker compose logs frontend -f

# Test API directly
curl http://localhost:3001/tasks
curl -X POST http://localhost:3001/tasks -H "Content-Type: application/json" -d '{"title":"Test task"}'
```

### References

- [Source: epics.md#Story-2.6] - Acceptance criteria and story statement
- [Source: architecture.md#Frontend-Architecture] - State management pattern
- [Source: architecture.md#API-Communication] - API integration patterns
- [Source: architecture.md#Project-Structure] - File locations
- [Source: project-context.md#Error-Handling] - Silent error recovery
- [Source: project-context.md#State-Management] - useState only rule
- [Source: prd.md#FR6] - Persist tasks immediately on creation
- [Source: prd.md#FR9] - Tasks persist across browser refresh
- [Source: prd.md#NFR1] - Page load < 1 second
- [Source: prd.md#NFR5] - API response < 200ms
- [Source: ux-design-specification.md#Layout] - 512px max-width, centered
- [Source: CLAUDE.md#TDD] - Test-driven development requirements
- [Source: CLAUDE.md#Branch-Naming] - Feature branch naming convention

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None - implementation completed without issues.

### Completion Notes List

- ✅ Created API client (`lib/api.ts`) with `fetchTasks()` and `createTask()` functions
- ✅ Implemented silent retry pattern with 3 attempts and exponential backoff
- ✅ Rewrote `page.tsx` with useState for task state management
- ✅ Implemented useEffect for fetching tasks on mount
- ✅ Implemented optimistic updates with rollback on API failure
- ✅ Integrated all existing components: TaskInput, TaskList, TaskItem, EmptyState
- ✅ Applied layout styling: max-width 512px, centered, bg-white
- ✅ All 63 tests pass (11 API tests + 17 page tests + 35 existing)
- ✅ Test coverage: 100% lines, 93.33% branches (well above 85% requirement)
- ✅ Docker build successful with no TypeScript errors
- ✅ Full stack integration verified: tasks persist to database and survive refresh
- ✅ TDD methodology followed: RED-GREEN-REFACTOR cycle

### File List

**Created:**
- `frontend/src/lib/api.ts` - API client with fetchTasks(), createTask(), and retry logic
- `frontend/src/lib/__tests__/api.test.ts` - 11 unit tests for API client
- `frontend/src/app/__tests__/page.test.tsx` - 17 unit tests for page component

**Modified:**
- `frontend/src/app/page.tsx` - Complete rewrite from Next.js template to task management page
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - Updated story status
- `_bmad-output/implementation-artifacts/2-6-full-stack-integration.md` - This story file

## Change Log

- 2026-01-09: Story implemented with TDD methodology - all 3 tasks complete
- 2026-01-09: Created API client with silent retry pattern (Task 1)
- 2026-01-09: Rewrote page.tsx with full integration of all components (Task 2)
- 2026-01-09: Docker build verified, full stack integration tested (Task 3)
- 2026-01-09: All 63 tests pass with 97.61% coverage, story marked for review
- 2026-01-09: Code review completed - fixed 3 issues: coverage config, dead code, added data-testid
- 2026-01-09: Post-review coverage: 100% lines, 93.33% branches - story ready for done
