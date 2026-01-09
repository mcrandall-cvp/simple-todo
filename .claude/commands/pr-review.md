---
description: 'Review PR feedback and fix issues by severity - critical/high must fix, medium if quick, low note only'
---

# PR Review

Review the specified PR for NEW feedback on the latest commit only.

## Instructions

For each issue found:
1. Assess severity (critical/high = must fix, medium = fix if quick, low = note only)
2. Fix critical/high issues
3. Run tests and build
4. Perform code-review changes before committing
5. Push changes to update the PR
6. Resolve conversations for addressed issues
7. Add comments explaining decisions for non-trivial changes

Skip issues that:
- Were addressed in previous commits
- Are purely stylistic with no functional impact
- Suggest architectural changes beyond the PR scope

## Severity Triage

| Severity | Action | Examples |
|----------|--------|----------|
| Critical | Must fix | Buffer overflow, silent data loss, security issue |
| High | Must fix | Logic bugs, missing validation, incorrect behavior |
| Medium | Fix if quick | Code clarity, better logging, minor DRY violations |
| Low | Note only | Style preferences, "consider" suggestions |

## Conversation Resolution

| Situation | Action |
|-----------|--------|
| Issue fixed as suggested | Resolve with brief confirmation |
| Issue fixed differently | Comment explaining approach, then resolve |
| Won't fix (out of scope) | Comment explaining why, leave open for reviewer |
| Needs clarification | Reply asking for details, leave open |

## When to Comment

Add a PR comment when:
- Explaining a non-obvious fix approach
- Clarifying why an issue was marked won't-fix
- Providing context the reviewer may need
- Highlighting a change that affects other areas

Skip comments when:
- The fix is exactly what was requested
- The change is self-explanatory from the diff
- Already explained in the commit message

## Common Pitfalls to Avoid

| Problem | Solution |
|---------|----------|
| Reviewing old comments | Specify "latest commit only" |
| Over-engineering fixes | Severity triage first |
| Multiple small commits | Batch related fixes |
| Missing edge cases | Self-review before commit |
| Addressing style-only feedback | Focus on functional issues |

## Review Checklist

Before committing fixes:
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Changes match the issue being fixed
- [ ] No unrelated changes included
- [ ] Commit message references the issue

After pushing:
- [ ] Push changes to update PR (`git push`)
- [ ] Resolve addressed conversations
- [ ] Add comments for non-trivial decisions
- [ ] Add comment with the exact command "/gemini review" to trigger an automated review
