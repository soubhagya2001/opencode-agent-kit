---
description: Initialize a new project or boilerplate from standard templates
agent: leader
---

Scaffold a new project or major module based on the request: $ARGUMENTS

### Create Requirements

1. **Analyze**: Evaluate the available templates in `.opencode/skills/app-builder/templates/` (27 stacks).
2. **Match**: Select the best matching template for the language/framework requested. If ambiguous, use the question tool with structured options.
3. **Initialize**: Read the selected `TEMPLATE.md` to extract the correct setup commands (`npx`, `cargo`, `dotnet new`, …).
4. **Run**: Execute the setup commands safely (respect permission rules — never install unvetted packages silently).
5. **Plan next steps**: After scaffolding, suggest the next immediate actions (schema design → API contract → UI), referencing `@planner`, `@architect`, and the relevant stack subagent.
6. **Report**: What was scaffolded, files created, verification status (`verified` / `partially_verified` / `not_verified`).
