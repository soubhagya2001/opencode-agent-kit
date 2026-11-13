---
description: Generate unit, integration, or E2E tests for the active context
agent: test-engineer
---

Generate tests adhering strictly to the `testing-patterns` and `tdd-workflow` skills for: $ARGUMENTS

### Testing Requirements

1. **Determine Test Type**: unit (isolated logic), integration (multiple components), or E2E (browser)?
2. **Find Target File**: Locate the source code you are testing.
3. **Create Test File**: Standardize the naming (e.g., `*.test.ts`, `*_test.go`, `test_*.py`).
4. **Red-Green-Refactor**: Assert edge cases, invalid inputs, and happy paths.
5. **Run Tests**: Execute the test suite automatically to verify your tests pass. Report coverage if available.
