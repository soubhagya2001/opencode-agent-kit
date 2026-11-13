---
description: Review current branch changes before opening a PR
agent: reviewer
subtask: true
---

Review the following changes for a pull request:

!`git diff main...HEAD`

Recent commits:

!`git log main..HEAD --oneline`

Check for:

- Logic errors and edge cases
- Security issues (use the `security-review` skill checklist)
- Code quality and TypeScript strictness
- Missing tests
- File ownership violations (edits outside the delegated scope)

Output a structured review with MUST FIX / SHOULD FIX / SUGGESTION sections and a verification status.
