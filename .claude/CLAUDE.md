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
3. Implement the story
4. Commit to feature branch (never to main directly)

### Commit Message Format

```
story-{ID}: Brief description of change
```

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
