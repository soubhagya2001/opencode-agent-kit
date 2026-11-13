---
description: Verify project is ready to deploy or publish
agent: planner
---

Check if the project is ready to deploy.

Current status:

!`git status --short`
!`git log --oneline -5`

Verify:

1. `opencode.json` has valid JSON syntax
2. All agent definitions in `.opencode/prompts/agents/` exist and are referenced correctly
3. All skills in `.opencode/skills/` have a `SKILL.md` file
4. Build passes: `npm run build` (or the project's equivalent)
5. Test suite passes: `npm test` (or equivalent)
6. No secrets or uncommitted breaking changes

Optionally run the validation suite: `python .opencode/scripts/verify_all.py .`

List any blockers clearly, ordered CRITICAL → HIGH → MEDIUM → LOW.
