---
stepsCompleted: [1, 2, 3, 4, 7, 8, 9, 10, 11]
inputDocuments:
  - product-brief-simple-todo-2026-01-08.md
workflowType: 'prd'
lastStep: 11
status: complete
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 0
---

# Product Requirements Document - simple-todo

**Author:** Tony Stark
**Date:** 2026-01-08

## Executive Summary

simple-todo is a minimalist, web-based task management application designed for personal daily productivity. Inspired by Apple's Reminders app, it provides a clean, distraction-free interface for managing daily tasks without the cognitive overhead of complex productivity tools.

The application solves a focused problem: busy professionals forget tasks when relying on sticky notes or mental lists, and existing digital solutions overcomplicate task management with unnecessary features. simple-todo embraces radical simplicity - one list, three core actions (add, reorder, complete), zero configuration.

**Target User:** Knowledge workers who want reliable task capture without friction - the kind of person who just needs to know "what do I need to do today?" without managing projects, tags, due dates, or collaboration.

**Technical Approach:** Modern stack (Next.js, NestJS, PostgreSQL) containerized via Docker Compose for single-command deployment (`docker compose up`).

### What Makes This Special

- **Radical Simplicity:** One flat list, three actions - add tasks, drag to reorder, click to complete
- **Zero Friction:** No accounts, no configuration, no learning curve
- **Web-Based Accessibility:** Works on any device with a browser
- **Reliable Persistence:** Tasks survive refreshes, browser closes, and container restarts
- **Developer-Friendly:** Clean architecture, containerized, runs locally in under 5 minutes

## Project Classification

**Technical Type:** web_app
**Domain:** general (productivity)
**Complexity:** low
**Project Context:** Greenfield - new project

This is a straightforward web application with standard requirements. No specialized compliance, regulatory, or domain-specific concerns apply. Focus areas: user experience, performance, data reliability.

## Success Criteria

### User Success

**Core Experience:**
- User can add a task and see it appear in under 2 seconds
- Drag-and-drop reorder feels instant with auto-save completing within 500ms
- Completing a task immediately removes it from view (no confirmation dialogs)
- Zero data loss - tasks are never forgotten or lost

**Emotional Success:**
- "I added it, I can see it, I won't forget it" - confidence in the system
- No friction between thinking of a task and capturing it
- Clean, uncluttered view reduces cognitive load
- End-of-day satisfaction seeing completed work

**Adoption Indicators:**
- User returns to the app daily during work days
- App becomes the default "capture point" for any task
- User trusts the app enough to stop using sticky notes/mental lists

### Business Success

N/A - This is a personal productivity tool, not a commercial product. Success is defined entirely by user value delivery.

### Technical Success

| Metric | Target | Rationale |
|--------|--------|-----------|
| Page load time | < 1 second | Instant access encourages use |
| API response time | < 200ms | Interactions feel immediate |
| Data persistence | 100% | Zero tolerance for lost tasks |
| Uptime (when running) | 99%+ | Reliable when needed |
| Setup time | < 5 minutes | Developer-friendly onboarding |

### Measurable Outcomes

**MVP Launch Criteria:**
- [ ] All four core features work (add, complete, reorder, view)
- [ ] Tasks persist across browser refresh
- [ ] Tasks persist across container restart
- [ ] `docker compose up` runs successfully first try
- [ ] Page loads in < 1 second
- [ ] Drag-and-drop saves in < 500ms

**Validation Criteria (Post-Launch):**
- User (Tony) uses the app daily for 1 week
- App successfully replaces sticky notes / mental list
- No data loss incidents
- No friction points that discourage use

## Product Scope

### MVP - Minimum Viable Product

**In Scope:**
| Feature | Description |
|---------|-------------|
| Add task | Text input with enter-to-submit, new tasks at bottom |
| Complete task | Single click removes from list |
| Reorder tasks | Drag-and-drop with auto-save |
| View tasks | Clean single-column list in priority order |
| Persistence | PostgreSQL storage via NestJS API |
| Deployment | Docker Compose with 3 containers |

**Data Model:**
- Task: `id`, `title`, `position`, `created_at`

### Growth Features (Post-MVP)

*Phase 2 - Quality of Life:*
- Edit task text inline
- Keyboard shortcuts (quick add, navigate, complete)
- Dark mode toggle
- Undo last action

*Phase 3 - Extended Functionality:*
- Multiple lists (work, personal, etc.)
- Due dates with optional reminders
- Search/filter for longer lists
- Archive view of completed tasks

### Vision (Future)

*Phase 4 - Platform Expansion:*
- User authentication for multi-device sync
- Progressive Web App (PWA) for offline support
- Mobile-optimized responsive design
- Browser extension for quick capture

**Guiding Principle:** The simplest, most reliable task capture tool on the web. If it grows beyond personal use, maintain the core philosophy: radical simplicity over feature bloat.

## User Journeys

### Journey 1: Alex Chen - Reclaiming Mental Clarity

Alex is a senior developer who juggles feature work, code reviews, meetings, and the occasional "can you help with this?" interruption. Every morning starts the same way - a vague sense of anxiety about what might slip through the cracks. Sticky notes litter the desk, some outdated, some critical. The mental list grows throughout the day, each new item pushing out something important.

One evening, frustrated after missing a deadline for a simple task that "just slipped my mind," Alex decides enough is enough and spins up simple-todo locally.

**First Morning with simple-todo:**
Alex opens the browser, sees an empty list, and types the first task: "Review PR for authentication module." Press Enter. It appears. No signup, no configuration, no tutorials. Just a task on a list. Within 30 seconds, five more tasks are captured - the ones that were floating in Alex's head, causing low-grade anxiety.

**The Drag-and-Drop Moment:**
Mid-morning, the manager pings about an urgent production issue. Alex drags "Fix prod logging bug" to the top of the list. It saves instantly. No mental overhead of remembering the new priority - it's right there, visually obvious.

**The Satisfaction of Completion:**
Alex fixes the logging bug, clicks the task, and it vanishes. Clean. Gone. One less thing to think about. By end of day, four tasks are completed and removed. The remaining three are tomorrow's starting point - already captured, already prioritized.

**One Week Later:**
The sticky notes are in the trash. The mental list is quiet. Alex starts each day by glancing at simple-todo, reorders if needed, and works through the list. The "what am I forgetting?" anxiety has faded. When something new comes up, it takes 2 seconds to capture it and move on.

---

### Journey 2: Alex Chen - The Edge Case (Recovery from Distraction)

It's a chaotic day. Alex is deep in debugging a complex issue when three people ask for "quick" things. Each time, Alex quickly adds a task to simple-todo without breaking flow - type, Enter, done. No context switching to a complex tool, no opening apps, no categorizing.

Later, a browser tab crashes. Alex reopens simple-todo with a moment of dread - did the tasks survive? The page loads. All seven tasks are there, exactly as left, in the right order. Relief. The system is trustworthy.

At 5pm, Alex realizes one task was added by mistake (it's actually next week's concern). No edit button, but that's fine - complete it to clear it, add it fresh later if needed. The constraint feels intentional, not limiting.

---

### Journey 3: Developer Setup - Getting Started

A developer clones the simple-todo repository, curious about the clean architecture. They run `docker compose up`, wait about 2 minutes for containers to build and start, then open `localhost:3000`.

The app loads instantly. No database migrations to run manually, no environment variables to configure, no accounts to create. They add a test task, drag it around, complete it - everything works. The developer reviews the code structure, appreciates the separation between frontend and backend containers, and has a working local development environment in under 5 minutes.

---

### Journey Requirements Summary

**From Journey 1 & 2 (Primary User - Daily Use):**
| Capability | Requirement |
|------------|-------------|
| Task Creation | Single text input, Enter to submit, instant appearance |
| Task Completion | Single-click removal, immediate visual feedback |
| Task Reordering | Drag-and-drop with auto-save, instant position update |
| Data Persistence | Survive browser refresh, survive container restart |
| Performance | Page load < 1s, interactions feel instant |
| Simplicity | No auth, no config, no learning curve |

**From Journey 3 (Developer Setup):**
| Capability | Requirement |
|------------|-------------|
| Single Command Deploy | `docker compose up` works first try |
| No Manual Config | Database auto-initializes, no env vars required |
| Fast Setup | Clone to running in < 5 minutes |
| Clean Architecture | Separated containers (frontend, backend, db) |

## Web App Specific Requirements

### Project-Type Overview

simple-todo is a Single Page Application (SPA) built with Next.js, designed for simplicity and performance. As a personal productivity tool accessed locally via Docker, it prioritizes fast interactions and reliable data persistence over SEO or broad browser compatibility.

### Technical Architecture Considerations

**Application Type:** Single Page Application (SPA)
- Single view with dynamic task list
- Client-side state management for instant UI updates
- API calls to NestJS backend for persistence

**Browser Support:**
| Browser | Support Level |
|---------|---------------|
| Chrome (latest) | Full support |
| Firefox (latest) | Full support |
| Safari (latest) | Full support |
| Edge (latest) | Full support |
| Legacy browsers | Not supported |

**SEO Strategy:** N/A
- Personal tool accessed via localhost
- No public-facing pages requiring search indexing
- No meta tags or sitemap needed

**Real-time Requirements:**
- No real-time sync needed (single user, single device)
- Standard request/response pattern sufficient
- Page refresh loads current state from database

### Responsive Design

**Viewport Support:**
| Device | Priority | Notes |
|--------|----------|-------|
| Desktop | Primary | Main usage scenario |
| Tablet | Secondary | Should work, not optimized |
| Mobile | Tertiary | Functional but not focus for MVP |

**Approach:** Desktop-first with basic responsive breakpoints. The simple single-column layout naturally adapts to smaller screens.

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial page load | < 1 second | Time to interactive |
| Task add | < 100ms | UI response |
| Task complete | < 100ms | UI response |
| Drag-and-drop save | < 500ms | Backend persistence |
| API response | < 200ms | Server response time |

### Accessibility Level

**Target:** Basic accessibility (not full WCAG compliance for MVP)

**MVP Accessibility:**
- Keyboard navigation for core actions (Tab, Enter, Escape)
- Semantic HTML structure
- Sufficient color contrast
- Focus indicators on interactive elements

**Post-MVP Considerations:**
- Screen reader support
- ARIA labels for drag-and-drop
- Full WCAG 2.1 AA compliance

### Implementation Considerations

**Frontend (Next.js):**
- App Router for simple routing (single page)
- React state for task list management
- Drag-and-drop library (e.g., @dnd-kit or react-beautiful-dnd)
- Fetch API for backend communication

**Backend (NestJS):**
- RESTful API endpoints for CRUD operations
- TypeORM or Prisma for PostgreSQL integration
- Auto-migration on startup for zero-config setup

**Database (PostgreSQL):**
- Single `tasks` table
- Auto-initialization via Docker entrypoint
- Persistent volume for data durability

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP
- Solve the core problem (forgetting tasks) with minimal features
- Validate that radical simplicity resonates before adding complexity
- Fastest path to daily use and validated learning

**Resource Requirements:**
- Team: Solo developer
- Timeline: MVP achievable in focused development sprint
- Skills: Full-stack TypeScript (Next.js, NestJS), Docker, PostgreSQL

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Journey 1: Daily task management (add, reorder, complete)
- Journey 3: Developer setup (docker compose up)

**Must-Have Capabilities:**
| Capability | Rationale |
|------------|-----------|
| Add task | Core value - capture tasks |
| Complete task | Core value - clear completed work |
| Reorder tasks | Core value - prioritize by drag-drop |
| View task list | Core value - see what needs doing |
| Data persistence | Trust - tasks must never be lost |
| Docker Compose | Setup - single command deployment |

**Explicitly Excluded from MVP:**
- Edit task text (workaround: complete and re-add)
- Undo (constraint encourages intentional actions)
- Multiple lists (flat list is the feature)
- Authentication (single user, local deployment)

### Post-MVP Features

**Phase 2 - Quality of Life:**
- Edit task text inline
- Keyboard shortcuts
- Dark mode
- Undo last action

**Phase 3 - Extended Functionality:**
- Multiple lists
- Due dates with reminders
- Search/filter
- Completed task archive

**Phase 4 - Platform Expansion:**
- User authentication
- Multi-device sync
- PWA/offline support
- Browser extension

### Risk Mitigation Strategy

**Technical Risks:**
| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Drag-and-drop complexity | Medium | Use proven library (@dnd-kit), spike early |
| Position ordering bugs | Low | Simple integer position, reorder on drop |
| Docker networking issues | Low | Standard compose setup, well-documented patterns |

**Market Risks:**
| Risk | Likelihood | Mitigation |
|------|------------|------------|
| "Too simple" perception | Low | Simplicity is the feature, not a limitation |
| Competition from existing tools | N/A | Personal tool, not competing for market |

**Resource Risks:**
| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Scope creep | Medium | Strict MVP boundaries, defer all "nice to haves" |
| Over-engineering | Medium | YAGNI principle, build only what's needed |
| Time constraints | Low | Minimal scope, proven tech stack |

## Functional Requirements

### Task Management

- FR1: User can create a new task by entering text and pressing Enter
- FR2: User can view all incomplete tasks in a single list
- FR3: User can complete a task, removing it from the visible list
- FR4: User can reorder tasks via drag-and-drop to change priority
- FR5: System automatically saves task order when user completes a drag-and-drop action

### Data Persistence

- FR6: System persists all tasks to the database immediately upon creation
- FR7: System persists task completion status immediately upon user action
- FR8: System persists task order changes immediately upon reorder
- FR9: User can refresh the browser and see the same task list in the same order
- FR10: Tasks survive container restarts without data loss

### User Interface

- FR11: User can see an empty state when no tasks exist
- FR12: User can see visual feedback when a task is being dragged
- FR13: User can see the task input field is always visible and accessible
- FR14: User can interact with the application without creating an account

### Developer Experience

- FR15: Developer can start the complete application stack with a single command
- FR16: Developer can access the application at a predictable localhost URL
- FR17: System automatically initializes the database on first startup
- FR18: System runs without requiring manual environment variable configuration

### API (Internal)

- FR19: Backend provides an endpoint to create a new task
- FR20: Backend provides an endpoint to retrieve all incomplete tasks
- FR21: Backend provides an endpoint to mark a task as complete
- FR22: Backend provides an endpoint to update task positions (reorder)

## Non-Functional Requirements

### Performance

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| NFR1: Page Load | < 1 second | Time to interactive |
| NFR2: Task Creation | < 100ms | UI response to Enter key |
| NFR3: Task Completion | < 100ms | UI response to click |
| NFR4: Drag-and-Drop | < 500ms | Time from drop to persistence confirmation |
| NFR5: API Response | < 200ms | Server response time for all endpoints |

### Reliability

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| NFR6: Data Persistence | 100% | Zero task loss under normal operation |
| NFR7: Uptime | 99%+ | When containers are running |
| NFR8: Data Integrity | 100% | Task order maintained accurately |
| NFR9: Recovery | Automatic | Database recovers cleanly after container restart |

### Accessibility (Basic)

| Requirement | Target | Notes |
|-------------|--------|-------|
| NFR10: Keyboard Navigation | Core actions | Tab, Enter, Escape work for add/complete |
| NFR11: Focus Indicators | Visible | Interactive elements show focus state |
| NFR12: Color Contrast | Sufficient | Text readable without strain |
| NFR13: Semantic HTML | Valid | Proper heading structure, form elements |

### Maintainability

| Requirement | Target | Notes |
|-------------|--------|-------|
| NFR14: Code Organization | Clean separation | Frontend, backend, database as separate concerns |
| NFR15: Setup Simplicity | Zero config | No manual env vars or migrations |
| NFR16: Documentation | README | Basic setup and usage instructions |

### Skipped Categories

The following NFR categories were evaluated and determined not applicable:

- **Security**: No authentication, no sensitive data, local-only deployment
- **Scalability**: Single-user tool, no growth planning needed
- **Integration**: No external system connections
- **Compliance**: No regulatory requirements apply
