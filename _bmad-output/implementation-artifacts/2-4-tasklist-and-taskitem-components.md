# Story 2.4: TaskList and TaskItem Components

Status: done

## Story

As a **user**,
I want **to see my tasks displayed in a clean, single-column list**,
So that **I can view all my incomplete tasks at a glance** (FR2).

## Acceptance Criteria

### AC1: Tasks Displayed in Single Column
**Given** tasks exist in the system
**When** I view the task list
**Then** all incomplete tasks are displayed in a single column
**And** tasks are ordered by position (priority order)
**And** the list is centered with 512px max-width

### AC2: TaskItem Visual Requirements
**Given** the TaskItem component is displayed
**When** I view a task
**Then** it shows the task title text
**And** it has a circle outline on the left (completion target for Epic 3)
**And** it has 16px vertical and horizontal padding
**And** it has a subtle bottom border (#E5E7EB) separating tasks

### AC3: TaskList Container Styling
**Given** the TaskList container is styled
**When** I view the list
**Then** it uses the UX-specified layout (centered, max-width 512px)
**And** there is 8px gap between task items
**And** the background is white (#FFFFFF)

### AC4: Hover State
**Given** I hover over a TaskItem
**When** my mouse is over the task
**Then** the background changes to light gray (#F3F4F6)

### AC5: Accessibility Requirements
**Given** accessibility requirements
**When** I inspect the TaskList
**Then** it has `role="list"` and `aria-label="Task list"`
**And** each TaskItem has `role="listitem"`

## Tasks / Subtasks

- [x] Task 1: Create Task TypeScript Interface (AC: All)
  - [x] 1.1 Create `frontend/src/lib/` directory
  - [x] 1.2 Create `frontend/src/lib/types.ts` with Task interface
  - [x] 1.3 Export Task interface matching Prisma schema (id, title, position, createdAt)

- [x] Task 2: Create TaskItem Component (AC: #2, #4, #5)
  - [x] 2.1 Create `frontend/src/components/TaskItem.tsx`
  - [x] 2.2 Add "use client" directive
  - [x] 2.3 Define TaskItemProps interface with task and optional onComplete
  - [x] 2.4 Implement completion circle (visual only, not clickable yet)
  - [x] 2.5 Implement task title display
  - [x] 2.6 Apply Tailwind styling: padding, border, hover state
  - [x] 2.7 Add `role="listitem"` accessibility attribute
  - [x] 2.8 Add CSS transition for smooth hover effect

- [x] Task 3: Create TaskList Component (AC: #1, #3, #5)
  - [x] 3.1 Create `frontend/src/components/TaskList.tsx`
  - [x] 3.2 Add "use client" directive
  - [x] 3.3 Define TaskListProps interface with tasks array and optional onComplete
  - [x] 3.4 Map over tasks and render TaskItem for each
  - [x] 3.5 Apply Tailwind styling: max-width, centering, background
  - [x] 3.6 Add `role="list"` and `aria-label="Task list"` accessibility attributes
  - [x] 3.7 Use semantic ul/li elements

- [x] Task 4: Docker Build Verification (AC: All)
  - [x] 4.1 Run `docker compose build frontend`
  - [x] 4.2 Verify no TypeScript compilation errors
  - [x] 4.3 Verify component exports are correct

## Dev Notes

### Technology Stack
- **Next.js Version:** 16.1.1+ with App Router
- **TypeScript:** Strict mode enabled
- **Tailwind CSS:** Latest (NO component libraries)
- **React:** Functional components with TypeScript

### Architecture Patterns (CRITICAL)

**Frontend Component Structure:**
```
frontend/src/
├── app/
│   ├── page.tsx      # Main page (DO NOT MODIFY in this story)
│   └── layout.tsx    # Root layout
├── components/
│   ├── TaskInput.tsx # Story 2.3 - DONE
│   ├── TaskList.tsx  # THIS STORY - Create this file
│   └── TaskItem.tsx  # THIS STORY - Create this file
└── lib/
    └── types.ts      # THIS STORY - Create this file
```

**CRITICAL - Component File Naming:**
- Use PascalCase for component files: `TaskList.tsx`, `TaskItem.tsx`
- Export default function component
- Add "use client" directive for client-side interactivity

### Task Interface (types.ts)

```typescript
export interface Task {
  id: number;
  title: string;
  position: number;
  createdAt: string;  // ISO 8601 string from API
}
```

### TaskItem Implementation Template

```typescript
"use client";

import { Task } from "@/lib/types";

interface TaskItemProps {
  task: Task;
  onComplete?: () => void;  // Optional - will be used in Epic 3
}

export default function TaskItem({ task, onComplete }: TaskItemProps) {
  return (
    <li
      role="listitem"
      className="flex items-center px-4 py-4 border-b border-gray-200
                 hover:bg-gray-50 transition-colors duration-150"
    >
      {/* Completion circle - visual only for now */}
      <span
        className="w-5 h-5 border-2 border-gray-300 rounded-full mr-3 flex-shrink-0"
        aria-hidden="true"
      />
      {/* Task title */}
      <span className="text-base text-gray-900 flex-grow">
        {task.title}
      </span>
    </li>
  );
}
```

### TaskList Implementation Template

```typescript
"use client";

import { Task } from "@/lib/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onComplete?: (id: number) => void;  // Optional - will be used in Epic 3
}

export default function TaskList({ tasks, onComplete }: TaskListProps) {
  return (
    <ul
      role="list"
      aria-label="Task list"
      className="w-full max-w-[512px] mx-auto bg-white"
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onComplete={onComplete ? () => onComplete(task.id) : undefined}
        />
      ))}
    </ul>
  );
}
```

### UX Specification Requirements (CRITICAL)

**From ux-design-specification.md:**

| Requirement | Value | Tailwind Class |
|-------------|-------|----------------|
| Container max-width | 512px | `max-w-[512px]` |
| Container centering | centered | `mx-auto` |
| Background | #FFFFFF (white) | `bg-white` |
| Task padding | 16px | `px-4 py-4` |
| Border color | #E5E7EB | `border-gray-200` |
| Hover background | #F3F4F6 | `hover:bg-gray-50` |
| Text color | #1A1A1A | `text-gray-900` |
| Font size | 16px | `text-base` |
| Circle border | #D1D5DB | `border-gray-300` |
| Transition duration | <200ms | `duration-150` |

### State Management (CRITICAL)

**From project-context.md:**
- Use React useState ONLY - no external state libraries
- NO loading spinners - components render with data passed as props
- NO error dialogs - silent recovery
- Optimistic updates for all mutations

### Accessibility Requirements

**WCAG 2.1 Level AA:**
- Semantic HTML: use `<ul>` and `<li>` elements
- ARIA roles: `role="list"` on container, `role="listitem"` on items
- Focus indicators: visible focus state on interactive elements
- Color contrast: 15.3:1 for primary text (exceeds AAA)

### Previous Story Intelligence

**Key Learnings from Story 2.3 (TaskInput):**
- "use client" directive is required for any component with interactivity
- Tailwind classes work as expected in Docker build
- Component pattern: props interface → default export function
- Follow existing import pattern: `import { ... } from "react"`

**Established Patterns:**
- Focus ring: `focus:ring-2 focus:ring-blue-500` (for when completion becomes clickable)
- Border: `border border-gray-200`
- Transition: `transition-colors` for smooth state changes

### What NOT to Do in This Story

1. **DO NOT modify page.tsx** - Integration happens in Story 2.6
2. **DO NOT implement click-to-complete** - That's Story 3.2 (Epic 3)
3. **DO NOT add drag-and-drop** - That's Story 4.2 (Epic 4)
4. **DO NOT add loading states** - Follow optimistic update pattern
5. **DO NOT add error handling UI** - Silent recovery only

### Testing Commands

```bash
# Rebuild frontend after changes
docker compose build frontend

# Check for TypeScript errors
docker compose exec frontend npx tsc --noEmit

# Start the stack (if needed)
docker compose up -d

# View logs
docker compose logs frontend -f
```

### Project Structure Notes

**Alignment with architecture.md:**
- TaskList and TaskItem are 2 of the 4 allowed components
- Components live in `frontend/src/components/`
- Types live in `frontend/src/lib/types.ts`
- Styling via Tailwind only (no component libraries)

**Files to Create:**
1. `frontend/src/lib/types.ts` - Task interface
2. `frontend/src/components/TaskItem.tsx` - Individual task component
3. `frontend/src/components/TaskList.tsx` - List container component

**Files NOT to Modify:**
- `frontend/src/app/page.tsx` (integration is Story 2.6)
- `frontend/src/components/TaskInput.tsx` (already complete)

### References

- [Source: epics.md#Story-2.4] - Acceptance criteria
- [Source: ux-design-specification.md#TaskList] - Container requirements
- [Source: ux-design-specification.md#TaskItem] - Visual requirements
- [Source: project-context.md#Component-Structure] - Component naming
- [Source: architecture.md#Frontend-Structure] - File locations

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Docker build output: ✓ Compiled successfully in 26.8s, TypeScript passed

### Completion Notes List

- Created Task interface in `frontend/src/lib/types.ts` matching Prisma schema
- Implemented TaskItem component with circle outline, hover state, and accessibility attributes
- Implemented TaskList component with 512px max-width, centering, and ARIA labels
- All components use "use client" directive for Next.js App Router compatibility
- Components follow established patterns from Story 2.3 (TaskInput)
- Docker build verification passed - no TypeScript errors

### File List

- `frontend/src/lib/types.ts` (created)
- `frontend/src/components/TaskItem.tsx` (created)
- `frontend/src/components/TaskList.tsx` (created)

## Change Log

- 2026-01-09: Story implementation complete - all tasks/subtasks done, status → review
- 2026-01-09: Senior Developer Review completed - 4 issues fixed (2 HIGH, 2 MEDIUM), status → done

## Senior Developer Review (AI)

### Review Date
2026-01-09

### Reviewer
Claude Opus 4.5 (Adversarial Code Review)

### Issues Found and Fixed

| Severity | Issue | Fix Applied |
|----------|-------|-------------|
| **HIGH** | H1: Missing 8px gap between tasks (AC3 violation) | Added `flex flex-col gap-2` to TaskList.tsx |
| **HIGH** | H2: Missing prefers-reduced-motion support | Added `motion-reduce:transition-none` to TaskItem.tsx |
| **MEDIUM** | M1: Unused onComplete prop causing ESLint warning | Removed from destructuring, kept in interface for future use |
| **MEDIUM** | M2: Missing keyboard focus state (WCAG compliance) | Added `tabIndex={0}` and focus ring styles |

### Issues Noted (Not Fixed - Low Severity)

| Severity | Issue | Reason Not Fixed |
|----------|-------|------------------|
| LOW | L1: Missing empty state handling | Not required by AC - handled by parent component |
| LOW | L2: Missing PropTypes/runtime validation | TypeScript provides compile-time safety |
| LOW | L3: No unit tests | Testing stories are separate (Story 2.5 or Epic 5) |

### Files Modified in Review

- `frontend/src/components/TaskList.tsx` - Added flex container with gap-2
- `frontend/src/components/TaskItem.tsx` - Added motion-reduce, focus states, fixed prop usage

### Verification

- Docker build: ✓ Compiled successfully
- TypeScript: ✓ No errors
- All HIGH and MEDIUM issues resolved

