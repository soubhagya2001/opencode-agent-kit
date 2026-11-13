---
description: Improve code quality, performance Big O, UX interactions, or accessibility without changing business logic
agent: performance-optimizer
---

Enhance the implementation details of the provided context: $ARGUMENTS

### Enhancement Requirements

1. **Do No Harm**: Core business logic and expected inputs/outputs must remain exactly the same.
2. **Performance Focus**: Analyze algorithmic complexity (Big O). Convert nested loops to Hash Maps/Sets where applicable. Add memoization or caching if appropriate. Use the `performance-profiling` and `caching-strategies` skills.
3. **UX & Accessibility Focus**: For frontend files, add skeleton loaders, ensure ARIA attributes, fix color contrast issues, and implement micro-interactions (hover states, transitions). Use the `frontend-design` and `error-states` skills.
4. **Document Changes**: Leave inline comments explaining _why_ a specific refactor was done (e.g., `// O(1) lookup map for performance`).
5. **Verify**: Run the relevant checks (tests, typecheck, lint) and report verification status.
