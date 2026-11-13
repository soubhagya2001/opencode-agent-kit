---
description: Test-Driven Development core loop for new feature construction.
---

# TDD Feature Workflow (Red-Green-Refactor)

Use this workflow when creating an isolated piece of business logic or an isolated component.

1. Ask `@test-engineer` to define failing tests for the new component using `/test <target>`. Validate expected inputs/outputs are correct.
2. **RED**: Run the testing framework (`npm run test`, `pytest`, `go test ./...`) to verify the tests explicitly fail.
3. Ask the execution subagent (`@node-developer`, `@frontend-nuxt`, `@frontend-react`, …) to write the minimal code to pass the tests.
4. **GREEN**: Re-run the tests to verify they now pass. If they fail, return to step 3.
5. Run `/enhance <file>` (handled by `@performance-optimizer`) to clean up complexity without changing behavior.
6. **REFACTOR**: Run the tests one final time to verify no regressions were introduced.
