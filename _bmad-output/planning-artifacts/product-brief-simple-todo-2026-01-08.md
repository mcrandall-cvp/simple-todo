---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: []
date: 2026-01-08
author: Tony Stark
---

# Product Brief: simple-todo

## Executive Summary

simple-todo is a minimalist, web-based task management application designed for personal daily productivity. Inspired by Apple's Reminders app, it provides a clean, distraction-free interface for tracking tasks that need to be completed. Users can add tasks, reorder them via drag-and-drop to reflect priority, and remove completed items with a single action. Tasks persist across sessions, ensuring nothing falls through the cracks.

The application is built with a modern tech stack: Next.js frontend, NestJS backend, and PostgreSQL database, all orchestrated via Docker Compose for simple local development and deployment.

---

## Core Vision

### Problem Statement

Busy professionals juggle numerous tasks daily across work and personal life. Without a reliable system, tasks tracked via sticky notes or mental lists are easily forgotten, leading to missed commitments and unnecessary stress.

### Problem Impact

- Forgotten tasks lead to missed deadlines and dropped responsibilities
- Mental overhead of trying to remember everything reduces focus on actual work
- Scattered tracking methods (sticky notes, mental lists) lack persistence and reliability
- Existing solutions often feel bloated with features that add friction rather than reduce it

### Why Existing Solutions Fall Short

While apps like Apple Reminders exist, they are platform-specific and not web-accessible. Many web-based alternatives overcomplicate task management with projects, tags, due dates, recurring tasks, and collaboration features that add cognitive load for users who simply want a clean list they can prioritize and check off.

### Proposed Solution

A web-based todo application that embraces simplicity:
- **Add tasks** quickly with minimal friction
- **Reorder tasks** via drag-and-drop to reflect current priorities (auto-saves)
- **Complete tasks** to remove them from the list, maintaining a clean view
- **Persistent storage** so tasks survive browser refreshes and remain until completed
- **Single flat list** - no categories, projects, or tags to manage

### Key Differentiators

- **Radical simplicity**: One list, three actions (add, reorder, complete)
- **Web-based**: Accessible from any device with a browser
- **Clean architecture**: Modern stack (Next.js, NestJS, PostgreSQL) containerized for easy setup
- **Zero configuration**: `docker compose up` and you're running
- **Personal focus**: No accounts, no sharing, no collaboration overhead

## Target Users

### Primary Users

**Persona: Alex Chen - The Busy Professional**

- **Role & Context:** Mid-to-senior level professional (developer, manager, consultant, or similar knowledge worker) juggling multiple responsibilities across work and personal life
- **Environment:** Works primarily from a desk but accesses tasks from various devices throughout the day
- **Motivation:** Wants to stay on top of daily commitments without the mental overhead of remembering everything

**Problem Experience:**
- Currently relies on sticky notes, mental lists, or overly complex apps
- Frequently forgets tasks when context-switching between meetings, calls, and deep work
- Feels frustrated when existing tools require too much setup or maintenance
- Experiences stress from the nagging feeling of "what am I forgetting?"

**Usage Pattern:**
- Morning: Quick review and prioritization of today's tasks
- Throughout day: Adds new tasks as they come up, checks off completed items
- Uses drag-and-drop to reprioritize when urgent items emerge
- Values the clean slate of a completed list at end of day

**Success Vision:**
- "I added it, I can see it, I won't forget it"
- No friction between thinking of a task and capturing it
- Clear visual of what's left to do without clutter

### Secondary Users

N/A - This is a personal productivity tool designed for single-user use. No collaboration, sharing, or administrative roles are in scope.

### User Journey

1. **Discovery:** User is frustrated with current task tracking methods and searches for a simple, web-based alternative
2. **Onboarding:** Runs `docker compose up`, opens browser, sees empty task list - immediately understands how to use it
3. **First Use:** Adds 3-5 tasks for the day, drags to reorder by priority
4. **Core Usage:** Throughout the day, adds new tasks as they arise, checks off completed items which disappear from view
5. **Success Moment:** End of day with an empty or near-empty list - visible proof of productivity
6. **Long-term:** Becomes the default "capture point" for any task that needs tracking - trusted because it's always accessible and never loses data

## Success Metrics

### User Success Metrics

**Core Value Delivery:**
- User can add a new task in under 2 seconds (minimal friction)
- Drag-and-drop reorder completes and auto-saves within 500ms
- Task completion removes item from view immediately
- Zero data loss - tasks persist reliably across browser sessions and refreshes

**Behavioral Indicators:**
- User returns to the app daily during work days
- User maintains an active task list (evidence of ongoing use)
- User completes tasks (list shrinks over time, not just grows)

**User Satisfaction:**
- App feels as simple and intuitive as Apple Reminders
- No learning curve - new user understands all features within 30 seconds
- User trusts the app as their primary task capture point

### Business Objectives

N/A - This is a personal productivity tool, not a commercial product. Success is defined by user value delivery rather than business metrics.

### Key Performance Indicators

**Technical Performance:**
| KPI | Target |
|-----|--------|
| Page load time | < 1 second |
| API response time | < 200ms |
| Uptime (when running) | 99%+ |
| Data persistence | 100% (zero task loss) |

**Functional Completeness:**
| Feature | Success Criteria |
|---------|------------------|
| Add task | Single input, enter to submit |
| Complete task | Single click/tap removes from list |
| Reorder tasks | Drag-and-drop with auto-save |
| Persistence | Tasks survive refresh, browser close, container restart |

**Developer Experience:**
| KPI | Target |
|-----|--------|
| Setup time | < 5 minutes from clone to running |
| Single command deploy | `docker compose up` works first try |
| No external dependencies | Runs fully offline after initial setup |

## MVP Scope

### Core Features

**Task Management:**
| Feature | Description |
|---------|-------------|
| Add task | Text input field with enter-to-submit. New tasks appear at bottom of list |
| Complete task | Single click/tap marks task complete and removes it from view |
| Reorder tasks | Drag-and-drop to change priority order, auto-saves immediately |
| View tasks | Clean, single-column list showing all incomplete tasks in priority order |

**Technical Infrastructure:**
| Component | Implementation |
|-----------|----------------|
| Frontend | Next.js (latest) - React-based UI with drag-and-drop |
| Backend | NestJS - RESTful API for task CRUD operations |
| Database | PostgreSQL - Persistent task storage |
| Infrastructure | Docker Compose - Three containers (frontend, backend, db) |
| Deployment | Single `docker compose up` command to run entire stack |

**Data Model (Minimal):**
- Task: id, title, position, created_at

### Out of Scope for MVP

**Explicitly Deferred:**
| Feature | Rationale |
|---------|-----------|
| User authentication | Single-user app, no accounts needed |
| Multiple lists/categories | Flat list keeps it simple |
| Due dates & reminders | Adds complexity without solving core problem |
| Recurring tasks | Future enhancement if needed |
| Collaboration/sharing | Personal tool only |
| Edit task text | Add new, complete old - keeps interaction simple |
| Undo/restore completed | Clean view is the goal; completed means done |
| Mobile native apps | Web-based approach works on all devices |
| Search/filter | List should be short enough to scan |
| Dark mode | Nice-to-have, not essential |
| Keyboard shortcuts | Future enhancement |
| Offline mode | Requires service worker complexity |

### MVP Success Criteria

**Launch Criteria (Definition of Done):**
- [ ] All four core features functional (add, complete, reorder, view)
- [ ] Tasks persist across browser refresh
- [ ] Tasks persist across container restart
- [ ] `docker compose up` brings up working app in < 5 minutes
- [ ] Page loads in < 1 second
- [ ] Drag-and-drop feels responsive (< 500ms save)

**Validation Criteria:**
- User (Tony) uses the app daily for 1 week
- App successfully replaces sticky notes / mental list
- No data loss incidents
- No friction points that discourage use

### Future Vision

**Post-MVP Enhancements (if warranted):**

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

*Phase 4 - Platform Expansion:*
- User authentication for multi-device sync
- Progressive Web App (PWA) for offline support
- Mobile-optimized responsive design
- Browser extension for quick capture

**Long-term Vision:**
The simplest, most reliable task capture tool on the web. If it grows beyond personal use, maintain the core philosophy: radical simplicity over feature bloat.
