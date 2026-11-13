---
description: Final security, UX, and testing checks before pushing or deploying to production.
---

# Pre-Flight Audit Workflow

Run this workflow whenever a feature is complete and you are preparing to finalize a Pull Request.

1. Run the validation suite: `python .opencode/scripts/verify_all.py .`
2. If any check fails (security scan, lint), stop and delegate the fix to the owning subagent (`@security-auditor`, `@debugger`).
3. Once audits pass, build the project output: `npm run build` (or `cargo build --release`, `go build ./...`, equivalent).
4. Run the test suite: `npm test` (or equivalent). For UI features, `@test-engineer` verifies coverage.
5. Run `git status` to verify which files were modified.
6. Commit with a conventional commit message (e.g. `feat: completed pre-flight audit for feature X`) — only when the user explicitly asked to commit.
7. Optional: `/deploy-check` for the final readiness report.
