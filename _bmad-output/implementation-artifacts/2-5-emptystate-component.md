# Story 2.5: EmptyState Component

Status: ready-for-dev

## Story

As a **user**,
I want **to see a friendly message when I have no tasks**,
So that **I understand how to get started** (FR11).

## Acceptance Criteria

### AC1: EmptyState Display Condition
**Given** the task list is empty
**When** I view the application
**Then** the EmptyState component is displayed instead of the TaskList
**And** the TaskInput remains visible below

### AC2: EmptyState Content
**Given** the EmptyState is displayed
**When** I view the message
**Then** I see the heading "No tasks yet"
**And** I see the body text "Add your first task below"
**And** the message is centered in the available space

### AC3: EmptyState Styling
**Given** the EmptyState styling
**When** I inspect the component
**Then** the heading uses 18px medium weight (#1A1A1A)
**And** the body uses 16px regular weight (#6B7280)
**And** the text is vertically centered in the content area

### AC4: Accessibility Requirements
**Given** accessibility requirements
**When** I inspect the EmptyState
**Then** it has `aria-live="polite"` for screen reader announcements

### AC5: EmptyState Disappears on Task Addition
**Given** I add a task
**When** the task is created
**Then** the EmptyState disappears
**And** the TaskList with the new task is displayed

## Tasks / Subtasks

- [ ] Task 1: Create EmptyState Component (AC: #1, #2, #3, #4)
  - [ ] 1.1 Create `frontend/src/components/EmptyState.tsx`
  - [ ] 1.2 Add "use client" directive
  - [ ] 1.3 Implement heading with text "No tasks yet"
  - [ ] 1.4 Implement body text "Add your first task below"
  - [ ] 1.5 Apply Tailwind styling for typography and centering
  - [ ] 1.6 Add `aria-live="polite"` accessibility attribute
  - [ ] 1.7 Add `motion-reduce:transition-none` for accessibility

- [ ] Task 2: Docker Build Verification (AC: All)
  - [ ] 2.1 Run `docker compose build frontend`
  - [ ] 2.2 Verify no TypeScript compilation errors
  - [ ] 2.3 Verify component exports correctly

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
│   ├── TaskList.tsx  # Story 2.4 - DONE
│   ├── TaskItem.tsx  # Story 2.4 - DONE
│   └── EmptyState.tsx # THIS STORY - Create this file
└── lib/
    └── types.ts      # Story 2.4 - DONE
```

**CRITICAL - Component File Naming:**
- Use PascalCase for component files: `EmptyState.tsx`
- Export default function component
- Add "use client" directive for client-side interactivity

### EmptyState Implementation Template

```typescript
"use client";

export default function EmptyState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full max-w-[512px] mx-auto flex flex-col items-center justify-center
                 py-16 text-center motion-reduce:transition-none"
    >
      {/* Heading */}
      <h2 className="text-lg font-medium text-gray-900 mb-2">
        No tasks yet
      </h2>
      {/* Body text */}
      <p className="text-base text-gray-500">
        Add your first task below
      </p>
    </div>
  );
}
```

### UX Specification Requirements (CRITICAL)

**From ux-design-specification.md:**

| Requirement | Value | Tailwind Class |
|-------------|-------|----------------|
| Container max-width | 512px | `max-w-[512px]` |
| Container centering | centered | `mx-auto` |
| Heading size | 18px | `text-lg` |
| Heading weight | medium (500) | `font-medium` |
| Heading color | #1A1A1A | `text-gray-900` |
| Body size | 16px | `text-base` |
| Body weight | regular (400) | (default) |
| Body color | #6B7280 | `text-gray-500` |
| Vertical centering | centered in content area | `flex flex-col items-center justify-center` |
| Text alignment | centered | `text-center` |

### State Management (CRITICAL)

**From project-context.md:**
- Use React useState ONLY - no external state libraries
- NO loading spinners - components render with data passed as props
- The parent (page.tsx in Story 2.6) will handle conditional rendering:
  - If `tasks.length === 0` → Render EmptyState
  - If `tasks.length > 0` → Render TaskList

### Accessibility Requirements

**WCAG 2.1 Level AA:**
- `aria-live="polite"` announces changes to screen readers without interrupting
- `role="status"` indicates this is a status message region
- Color contrast: 15.3:1 for heading, 4.9:1 for body (meets AA)
- Use semantic `<h2>` for heading structure

**From UX Design Specification:**
- EmptyState should have `aria-live="polite"` for screen reader announcements
- Respect `prefers-reduced-motion` media query

### Previous Story Intelligence

**Key Learnings from Story 2.4 (TaskList and TaskItem):**
- "use client" directive is required for any client-side component
- Tailwind classes work as expected in Docker build
- Component pattern: default export function component
- Added `motion-reduce:transition-none` for accessibility (code review fix)
- Components follow established patterns

**Established Patterns:**
- Container: `w-full max-w-[512px] mx-auto`
- Text color: `text-gray-900` for primary, `text-gray-500` for secondary
- Motion accessibility: `motion-reduce:transition-none`

### What NOT to Do in This Story

1. **DO NOT modify page.tsx** - Integration happens in Story 2.6
2. **DO NOT add conditional rendering logic** - That's the parent's responsibility (Story 2.6)
3. **DO NOT add loading states** - Follow optimistic update pattern
4. **DO NOT add error handling UI** - Silent recovery only
5. **DO NOT add any interactive elements** - EmptyState is purely informational

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
- EmptyState is one of the 4 allowed components (TaskList, TaskItem, TaskInput, EmptyState)
- Components live in `frontend/src/components/`
- Styling via Tailwind only (no component libraries)

**Files to Create:**
1. `frontend/src/components/EmptyState.tsx` - EmptyState component

**Files NOT to Modify:**
- `frontend/src/app/page.tsx` (integration is Story 2.6)
- `frontend/src/components/TaskInput.tsx` (already complete)
- `frontend/src/components/TaskList.tsx` (already complete)
- `frontend/src/components/TaskItem.tsx` (already complete)

### References

- [Source: epics.md#Story-2.5] - Acceptance criteria
- [Source: ux-design-specification.md#EmptyState] - Visual requirements and content
- [Source: ux-design-specification.md#Empty-State] - "Friendly message when list is empty"
- [Source: project-context.md#Component-Structure] - Component naming (4 components only)
- [Source: architecture.md#Frontend-Structure] - File locations
- [Source: prd.md#FR11] - User can see an empty state when no tasks exist

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2026-01-09: Story created with comprehensive context from artifacts analysis
