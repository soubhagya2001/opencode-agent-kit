---
description: Automated loop to initialize a new project from ideation to initial structural commit.
---

# Project Kickoff Workflow

Use this workflow to transition from an idea to a fully planned and scaffolded application.

1. Ask `@planner` to create a task plan using `/plan` (e.g. `/plan e-commerce dashboard with Stripe`).
2. Review the generated plan. Provide feedback or approve the architecture choice.
3. Once approved, scaffold the application via `/create e-commerce dashboard based on <plan>` (uses the `app-builder` skill templates).
4. Run `git init` locally to initialize version control.
5. Write an initial commit: `git add .` and `git commit -m "chore: initial scaffold from <plan>"`.
6. Hand off to `@leader` for task decomposition and parallel delegation (schema → API → UI → tests).
