---
project_name: 'simple-todo'
user_name: 'Tony Stark'
date: '2026-01-08'
sections_completed: ['discovery', 'technology_stack', 'implementation_rules']
status: 'complete'
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

| Technology | Version | Notes |
|------------|---------|-------|
| **Next.js** | 16.1.1+ | App Router, TypeScript, Tailwind |
| **NestJS** | 11.0.14+ | Strict TypeScript, Jest |
| **PostgreSQL** | 16+ | Docker container |
| **Prisma** | Latest | ORM with auto-migration |
| **TypeScript** | Strict mode | Both frontend and backend |
| **Tailwind CSS** | Latest | No component library |
| **@dnd-kit** | Latest | core + sortable packages |
| **Docker Compose** | 3.8 | 3 containers |

---

## Critical Implementation Rules

### Error Handling (CRITICAL)

- **Frontend:** Silent retry (3 attempts), then log to console. NEVER show error dialogs to user
- **Backend:** Use NestJS exception filters for consistent HTTP errors
- **Optimistic updates:** Update local state immediately, rollback on API failure

### API Response Format

- Return data directly, NO wrapper objects like `{ data: ..., success: true }`
- Use camelCase for JSON fields (e.g., `createdAt`, NOT `created_at`)
- Dates as ISO 8601 strings
- Empty arrays as `[]`, never `null`

### Component Structure

4 components only - do not add more:
- `TaskList.tsx` - Container with @dnd-kit
- `TaskItem.tsx` - Individual task row
- `TaskInput.tsx` - Always-visible input
- `EmptyState.tsx` - Empty list message

### State Management

- Use React `useState` only - no external state libraries
- Use native `fetch` API - no axios or other HTTP libraries
- Implement optimistic updates for all mutations

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| React components | PascalCase.tsx | `TaskItem.tsx` |
| Utility functions | camelCase | `fetchTasks()` |
| NestJS services | PascalCase + suffix | `TasksService` |
| DTOs | PascalCase + Dto | `CreateTaskDto` |
| Database tables | snake_case, plural | `tasks` |
| Database columns | snake_case | `created_at` |
| API endpoints | kebab-case, plural | `/tasks/reorder` |

### UX Requirements (CRITICAL)

- NO loading spinners - use optimistic updates
- NO confirmation dialogs - actions are immediate
- NO error messages shown to user - silent recovery
- Animations under 200ms using CSS transitions only
- 512px max-width centered container
- WCAG 2.1 Level AA accessibility compliance

### Docker & Deployment

- Frontend calls backend via `http://backend:3001` (Docker network)
- Backend DATABASE_URL: `postgresql://postgres:postgres@postgres:5432/simple_todo`
- Prisma migrations run automatically on container startup
- Zero manual configuration required

---

## Anti-Patterns to Avoid

```typescript
// WRONG: Wrapper object
return { data: task, success: true };

// CORRECT: Direct data
return task;

// WRONG: Snake case in JSON
{ created_at: "...", task_id: 1 }

// CORRECT: Camel case
{ createdAt: "...", taskId: 1 }

// WRONG: Error dialog
catch (error) { alert("Failed!"); }

// CORRECT: Silent recovery
catch { setTasks(previousTasks); }

// WRONG: Loading spinner
if (loading) return <Spinner />;

// CORRECT: Optimistic update
setTasks([...tasks, newTask]); // Immediate
await api.createTask(title);    // Background
```

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /tasks | Retrieve all tasks |
| POST | /tasks | Create a new task |
| PATCH | /tasks/:id/complete | Mark task complete |
| PATCH | /tasks/reorder | Update task positions |

---

## Prisma Schema

```prisma
model Task {
  id        Int      @id @default(autoincrement())
  title     String
  position  Int
  createdAt DateTime @default(now()) @map("created_at")

  @@map("tasks")
}
```

---

**Reference Documents:**
- Architecture: `_bmad-output/planning-artifacts/architecture.md`
- UX Specification: `_bmad-output/planning-artifacts/ux-design-specification.md`
- PRD: `_bmad-output/planning-artifacts/prd.md`
