# SIMPLE-TODO Development Guidelines

## Branch Naming Convention

**IMPORTANT:** Before implementing any story, create a feature branch.

### Branch Patterns

| Type | Pattern | Example |
|------|---------|---------|
| Story | `feature/story-{ID}-{description}` | `feature/story-001-helmet-ui` |
| Bug fix | `fix/{issue}-{description}` | `fix/issue-42-led-flicker` |
| Task | `task/{epic}/{description}` | `task/hud/add-diagnostics` |

### Workflow

When starting `/bmad:dev-story`:

1. Check current branch: `git status`
2. Create feature branch: `git checkout -b feature/story-{ID}-{description}`
3. Write failing tests for the story requirements (RED)
4. Implement minimal code to pass tests (GREEN)
5. Refactor while keeping tests green (REFACTOR)
6. Commit to feature branch (never to main directly)

### Commit Message Format

```
story-{ID}: Brief description of change
```

## Test-Driven Development (TDD)

**IMPORTANT:** TDD is MANDATORY for all story implementations. Tests MUST be written BEFORE implementation code.

### TDD Workflow (Red-Green-Refactor)

For every story, follow this cycle:

1. **RED** - Write a failing test first
   - Write tests that define the expected behavior
   - Run tests to confirm they fail (no implementation yet)

2. **GREEN** - Write minimal code to pass the test
   - Implement only enough code to make the test pass
   - Do not add extra functionality

3. **REFACTOR** - Improve the code while keeping tests green
   - Clean up code, remove duplication
   - Ensure all tests still pass

### TDD Requirements

- All new features MUST have tests written before implementation
- PRs without adequate test coverage will NOT be accepted
- Test files should be co-located or in a `__tests__` directory
- Aim for meaningful tests that cover behavior, not just line coverage

### Test Coverage Requirement

**IMPORTANT:** Test coverage MUST be 85% or greater for all PRs.

- Run coverage reports before submitting PRs: `npm run test:coverage`
- PRs with coverage below 85% will NOT be accepted
- Coverage applies to: statements, branches, functions, and lines

## Pull Request Guidelines

**IMPORTANT:** All pull requests MUST target the `dev` branch, NOT `main`.

### PR Workflow

When creating a pull request:
1. Ensure you're on a feature branch (not main or dev)
2. Push the feature branch: `git push -u origin <branch-name>`
3. Create PR targeting dev: `gh pr create --base dev`

### Never PR to Main

- `main` is the production branch - only `dev` can be merged into it
- All feature branches merge into `dev` first
- Direct PRs to `main` are prohibited
