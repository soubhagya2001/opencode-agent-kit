# Delegation Workflow

> The end-to-end contract-driven workflow `@leader` uses to turn a request into delegated, verified, synthesized work.

This is the operational reference for the orchestration model described in [AGENT_ARCHITECTURE.md](AGENT_ARCHITECTURE.md). It is enforced by the leader prompt (`.opencode/prompts/agents/it-leader.md`) and the `agent-delegation-contract` and `progress-tracking` skills.

---

## 1. End-to-end flow

```
Request → Clarify gate → Classification → Plan & decompose → Pre-flight checkpoint
        → Contract authoring → Sequential / Parallel delegation → Execution & state tracking
        → DELEGATION RESULT → Synthesis report → agentmemory save
```

The three phases that most often get skipped — clarify, pre-flight, and synthesis — are mandatory gates, not suggestions.

## 2. Step 1 — Clarify-Before-Orchestrate Gate

Before orchestrating ANY multi-agent work, verify the request is clear enough to break down without guessing. Orchestrating an ambiguous request wastes every downstream agent.

**Trigger clarification when ANY of these is true:**

- Multiple valid interpretations of the goal (what to build, for whom)
- Stack or architecture choice is open
- Scope boundary unclear (must-have vs nice-to-have vs out-of-scope)
- Acceptance criteria cannot be stated ("done" is undefinable)

**Gate behavior:**

1. Use the `question` tool with structured options — never open-ended questions; include a "Type your own answer" option.
2. Max ONE clarification round of 2–4 questions, then commit to the best interpretation and state the assumption explicitly.
3. Record the assumption in the plan and in every relevant delegation contract's **Memory Context**.

If the request passes the gate, proceed directly — do not ask redundant questions.

## 3. Step 2 — Request Classification

Every request is classified to select the operating mode:

| Type                 | Description                                           | Response Mode                                                                                    |
| -------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Discussion**       | Questions, consultation, exploration                  | Answer directly or delegate consultation to domain subagent                                      |
| **Information**      | Documentation lookups, research                       | Research via `@docs-lookup` / web / `@scout`                                                     |
| **Bug/Error Fix**    | Fix bug, error, crash, regression                     | **IMMEDIATE delegation** to domain subagent (read only to understand, then delegate — fast mode) |
| **Small Fix**        | 1–2 files, trivial changes, typos, tweaks             | Direct delegation (fast mode, no planning)                                                       |
| **Simple Feature**   | 1–3 files, single screen or endpoint                  | Minimal planning + delegation (balanced mode)                                                    |
| **Complex Feature**  | 3–20 files, multiple screens/endpoints, cross-stack   | Full analysis + breakdown + phased delegation (thorough mode)                                    |
| **Full Application** | Full-stack project from scratch, multi-phase delivery | Full leadership workflow with iterative phases                                                   |

Two hard rules at this step:

- **Zero code editing by the leader** — bug fixes count as application-code changes. Even a one-character fix is delegated to the domain owner.
- **Complex Feature / Full Application must load the `leadership-workflow` skill** before proceeding.

## 4. Step 3 — Planning & Task Decomposition

For Complex Feature / Full Application (optional for smaller scopes):

1. **Requirements analysis** — goal, implicit needs, ambiguities, scope.
2. **Architecture design** — affected layers, data models, API contracts, component hierarchy, state management.
3. **Task breakdown** — every task gets: ID, owner agent, description, input (patterns/contracts), expected output (files/behavior), dependencies, priority.
4. **Shared contracts** — API schemas and data models written down BEFORE agents that consume them (this is where `@planner` and `@api-architect` earn their place; see the worked examples).

Complex plans are typically authored by `@planner` into `docs/plans/<task-slug>.md` (kebab-case, max 30 chars) with sections: Overview, Constraints, Task Breakdown, Shared Contracts, Dependency Graph, Risks, Verification Plan.

### Task ID convention

| Prefix | Domain                                                                                 | Example   |
| ------ | -------------------------------------------------------------------------------------- | --------- |
| `FE`   | Frontend (Nuxt / React / Angular)                                                      | `FE-001`  |
| `BE`   | Backend (Node / CI3 / Laravel / Java / Go / Python / Rust / Swift / .NET / C++ / Ruby) | `BE-002`  |
| `DB`   | Database / data engineering                                                            | `DB-003`  |
| `DS`   | Design                                                                                 | `DS-001`  |
| `QA`   | Code review / quality / testing                                                        | `QA-002`  |
| `OP`   | DevOps / deploy / infrastructure                                                       | `OP-001`  |
| `SEC`  | Security                                                                               | `SEC-001` |
| `GEN`  | General / research                                                                     | `GEN-001` |
| `PL`   | Planning (tasks authored by `@planner`)                                                | `PL-001`  |

Every `todowrite` entry carries the structured form: `{ID}: {description} | priority:{P0..P3} | depends:{IDs or -} | assignee:{@agent}`.

## 5. Step 4 — Plan Pre-Flight Checkpoint

Before delegating a plan (especially one produced by `@planner` or self-authored for Complex Feature / Full App), run this checkpoint. **Do NOT start delegation until every check passes or the user explicitly accepts the exception.**

```
PRE-FLIGHT CHECKLIST
[ ] Every task has: ID, owner (agent), description, input, expected output, dependencies, priority
[ ] Every task's owner agent EXISTS and matches the file-type ownership matrix
[ ] Shared contracts (API schemas, types, DB schema) defined BEFORE agents that consume them
[ ] No parallel delegation between agents that share interfaces — those are chained
[ ] Dependencies form a DAG (no cycles); first task(s) have no unmet dependencies
[ ] Verification criteria exist per task (build/lint/test commands or observable behaviors)
[ ] Security gate identified (auth/PII/payments/uploads → @security-auditor scheduled)
[ ] UI tasks follow the 3-phase UI pipeline (design → implement → design QA)
[ ] Scope confirmed with user (nothing speculative added; nothing missing)
```

If a check fails, fix the plan first (or delegate a plan revision to `@planner`). Record the pre-flight result in one line before the first delegation: `Pre-flight: PASS (n/n checks)`.

## 6. Step 5 — Contract Authoring

Every delegation is wrapped in a **DELEGATION CONTRACT** (template from `it-leader.md`):

```markdown
## DELEGATION CONTRACT

### Agent

@{subagent}

### Task ID

{ID}

### Scope

{specific files and behaviours}

### Out of Scope

{what NOT to touch}

### Input Interface

{shared types, API contracts}

### Expected Output

{what to produce}

### Verification Criteria

{how to verify correctness}

### Memory Context

{relevant past decisions, preferences, conventions}
```

The **Out of Scope** section is not decoration — it is where scope creep is prevented, and the **Memory Context** section carries injected agentmemory recall (user preferences, past decisions, conventions) so subagents don't repeat resolved questions.

For UI features, use the UI-pipeline delegation variant (Phase 1 `@designer` → Phase 2 `@frontend-*` with mandatory polish gate → Phase 3 `@designer` QA) — see `it-leader.md` § "Delegation Template for UI Features".

## 7. Step 6 — Sequential vs Parallel Decision

```
Does task need output from another subagent?
├── YES → Sequential (await first subagent)
└── NO  → Can contract be defined upfront?
    ├── YES → Parallel delegation
    └── NO  → Sequential (or use question tool to clarify)
```

**Key principle: Define contract → Delegate parallel → Verify integration.**

| Scenario                        | Can Parallel? | Condition                     |
| ------------------------------- | ------------- | ----------------------------- |
| API + UI for same feature       | ✅ Yes        | API contract defined upfront  |
| Database schema + Backend logic | ✅ Yes        | Schema + DTOs defined upfront |
| Page build + Backend API        | ✅ Yes        | OpenAPI spec provided         |
| Design tokens + Component       | ❌ No         | Design needed first           |
| Backend API + Frontend uses it  | ❌ No         | Must wait for API             |

Global rules: **contract-first for parallel** (no parallel delegation without a shared contract) and **no mass fan-out** (never invoke all subagents at once). A shared-contract checklist: endpoint list + methods, request/response schemas + envelopes, errors + status codes, auth requirements, pagination/filtering, types/interfaces.

## 8. Step 7 — Execution & Agent State Tracking

### Agent states lifecycle

```
BACKLOG → TODO → IN_PROGRESS → REVIEW → DONE
                                   ↓
                        DONE (user-verified) / CANCELLED (explicit only)
```

| State         | Meaning                                                    | Transition trigger                          |
| ------------- | ---------------------------------------------------------- | ------------------------------------------- |
| `BACKLOG`     | Known, not scheduled this cycle                            | Planning output                             |
| `TODO`        | Scheduled, dependencies met, ready to delegate             | Pre-flight PASS                             |
| `IN_PROGRESS` | Delegated, subagent working (ONE per agent)                | Contract accepted by subagent               |
| `REVIEW`      | Result returned, integration check / synthesis pending     | DELEGATION RESULT received                  |
| `DONE`        | Verified: contract output matches, integration checks pass | Synthesis or user confirmation              |
| `BLOCKED`     | Waiting on external input (user, failing dependency)       | Missing input — surface to user immediately |
| `CANCELLED`   | Explicitly abandoned, with reason                          | User decision or scope change               |

**Rules:**

- Only ONE `IN_PROGRESS` task per agent at a time.
- A task cannot move to `DONE` while any contract verification criterion is unchecked.
- Blocked tasks are reported to the user at the next progress table — never silently dropped.

Each delegation cycle follows the TODO protocol: create TODOs before delegation → mark `in_progress` on delegation → on result, verify against contract (mark done or re-delegate the fix) → run integration checks → mark the integration TODO done.

## 9. Step 8 — DELEGATION RESULT Contract

Every subagent returns its result in the standard response contract (from the `agent-delegation-contract` skill):

```markdown
## DELEGATION RESULT

### Task ID

{ID}

### Files Changed

- CREATED: {path}
- MODIFIED: {path}
- DELETED: {path}

### Verification Status

- [x] {criterion 1 from the contract}
- [x] {criterion 2}
- [ ] {any unchecked criterion — blocks DONE}

### Deviations from Contract

{any change to scope, types, or behavior — explain why; empty if none}

### New Findings for Memory

{conventions discovered, bugs encountered, decisions made}

### Blockers / Risks

{anything the leader should know}
```

Verification status is one of `verified` / `partially_verified` / `not_verified`. A `not_verified` result can never flip a task to `DONE` — the leader must either re-delegate verification or accept the risk explicitly.

## 10. Step 9 — Synthesis Report

After completing all delegations for a feature/phase, produce ONE synthesis report that unifies the subagent outputs — **never paste subagent responses raw to the user**.

```markdown
## Synthesis Report: {feature/phase name}

### Delegations

| ID     | Agent          | Result            | Verification       |
| ------ | -------------- | ----------------- | ------------------ |
| FE-001 | @frontend-nuxt | ✅ / ⚠️ deviation | verified / partial |

### Integration Checks

- [ ] API alignment: frontend calls match backend endpoints
- [ ] Type compatibility: TS interfaces match backend DTOs
- [ ] Error handling consistent across layers
- [ ] Auth boundaries enforced on both sides
- [ ] No broken imports / missing files
- [ ] Ownership respected: every file edited by its matrix owner

### Unified Result

{what now works end-to-end, in user terms}

### Deviations & Resolutions

{contract deviations accepted, with reasons}

### Remaining / Follow-ups

{open items, TODO IDs, risks}
```

Contract violations (out-of-scope edits, unnotified type changes) are flagged here and either **accepted with reason, reverted, or re-delegated**.

## 11. Step 10 — agentmemory Save

After synthesis, the leader saves non-obvious findings to agentmemory (MCP server) — new conventions, decisions with trade-offs, lessons learned, and the session/task state. Subagents do not write memory directly; the leader mediates. Include the assumption recorded at the clarify gate if it proved consequential.

## 12. File-Type Ownership Matrix

Enforce boundaries by file type. When a task touches files in multiple rows, either split the task per owner or define a shared contract first. A subagent MUST NOT edit files owned by another agent unless its delegation contract explicitly grants an exception.

| File type / pattern                                                         | Owner (primary)                                                     | Advisory (may review, not edit)       |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------- |
| `components/`, `pages/`, `composables/` (Vue/Nuxt)                          | `@frontend-nuxt`                                                    | `@designer`, `@reviewer`              |
| `app/`, `components/` (React/Next), shadcn/ui                               | `@frontend-react`                                                   | `@designer`, `@reviewer`              |
| `src/**/*.spec.ts` / `*.test.ts` / `e2e/` (test files)                      | `@test-engineer`                                                    | Feature agent (fixes impl, not tests) |
| API routes, `*.dto.ts`, `*.controller.ts` (Node)                            | `@node-developer`                                                   | `@api-architect`                      |
| PHP (`app/`, `application/`)                                                | `@laravel` / `@ci3`                                                 | `@api-architect`                      |
| Java (`src/main/java`), Go (`*.go`), Python (`*.py`), Ruby (`*.rb`, `app/`) | `@java-developer` / `@go-developer` / `@python` / `@ruby-developer` | language `@*-reviewer`                |
| Mobile (`android/`, `ios/`, `lib/` for Flutter)                             | `@android` / `@flutter`                                             | `@designer` (UX)                      |
| `prisma/schema.prisma`, migrations, SQL                                     | `@database`                                                         | `@architect`, feature agent           |
| ETL/warehouse/streaming code                                                | `@data-engineer`                                                    | `@database`                           |
| `.github/workflows/`, `Dockerfile`, deploy config                           | `@devops` / `@cloud-architect`                                      | feature agent                         |
| Auth flows, secrets handling, security headers                              | `@security-auditor` (gate)                                          | feature agent (implementation)        |
| `docs/`, `README.md`, `CHANGELOG.md` (prose)                                | `@doc-writer`                                                       | feature agent (facts only)            |
| Design tokens, `DESIGN.md`, mockups                                         | `@designer`                                                         | frontend agents (implementation)      |
| OpenAPI/GraphQL schemas (shared contracts)                                  | `@api-architect`                                                    | all consuming agents                  |
| Game scenes, game loops, physics, assets                                    | `@game-developer`                                                   | `@designer` (art direction)           |
| Adversarial/rare languages (Rust, Swift, C++, .NET, Angular)                | `@rust` / `@swift` / `@cpp` / `@dotnet` / `@angular`                | language `@*-reviewer`                |

Ownership rules:

1. **One owner per file** per delegation cycle; conflicting edits = contract violation → flag in Deviations, escalate to re-delegation.
2. **Shared contracts first** when two agents touch the same interface.
3. **Boundary check at synthesis** — the last integration check in the synthesis report verifies each changed file was edited by its matrix owner.

## 13. Worked Examples

### Example A — Sequential chain: "Add notifications feature" (Complex Feature, Nuxt + Node stack)

**Clarify gate:** goal and stack are clear; scope confirmed (in-app notifications only, no email). Assumption recorded: notifications are per-user, not per-role.

**Classification:** Complex Feature → thorough mode → load `leadership-workflow`.

**Plan (authored by `@planner`, `docs/plans/notifications.md`):**

```
PL-001: Write shared contract | priority:P1 | depends:- | assignee:@planner (contract content: @api-architect)
```

| ID       | Task                                   | Owner             | Depends                      |
| -------- | -------------------------------------- | ----------------- | ---------------------------- |
| `PL-001` | Notification API contract + data model | `@api-architect`  | —                            |
| `DB-001` | `notifications` table migration        | `@database`       | `PL-001`                     |
| `BE-001` | Notification endpoints + service       | `@node-developer` | `PL-001`                     |
| `FE-001` | NotificationBell component + page      | `@frontend-nuxt`  | `PL-001`                     |
| `QA-001` | Unit/integration tests for API         | `@test-engineer`  | `BE-001`                     |
| `QA-002` | Full review of the feature diff        | `@reviewer`       | `BE-001`, `FE-001`, `QA-001` |

**Pre-flight:** `Pre-flight: PASS (9/9 checks)` — shared contract exists before DB/BE/FE start; nothing parallelized across shared interfaces; no security-sensitive surface (no auth change) so the security gate is not triggered.

**Chain execution (all sequential — each task consumes the previous output):**

1. `@api-architect` (PL-001) returns the contract:

```
## Shared API Contract
### GET /api/notifications
- Request: { unreadOnly?: boolean, cursor?: string, limit?: number }
- Response: { data: Notification[], meta: { nextCursor: string | null, unreadCount: number } }
- Errors: 401, 500
interface Notification { id: string; userId: string; type: 'mention' | 'system'; message: string; readAt: string | null; createdAt: string }
```

2. `@database` (DB-001) builds the migration from the contract's data model.
3. `@node-developer` (BE-001) implements endpoints + service against the contract.
4. `@frontend-nuxt` (FE-001) builds the bell + list page against the same contract.
5. `@test-engineer` (QA-001) writes tests — it owns `*.spec.ts` files exclusively per the ownership matrix; BE-001 must not create test files.
6. `@reviewer` (QA-002) reviews the combined diff.

**Synthesis:** each DELEGATION RESULT is checked against its contract, the six integration checks pass, and one unified report is issued. Findings (e.g. "notification polling interval convention: 30s via `useApi`") are saved to agentmemory.

### Example B — Parallel batch with contract-first: "User management page + API" (Simple-to-Complex Feature, contract already defined)

The contract (GET/POST `/api/users`, `User { id, name, email, createdAt }`) is defined **before** either agent starts. The two tasks touch disjoint files (ownership matrix: `@node-developer` owns API routes/DTOs; `@frontend-nuxt` owns `app/pages/`, `app/components/`) and share no uncontracted interfaces, so both are delegated in parallel:

```markdown
@node-developer Task BE-001: Create user API endpoints

Contract:

- GET /api/users (list with pagination)
- POST /api/users (create user)
- Types: User { id, name, email, createdAt }

Requirements:

- Use Prisma for database
- Add validation with class-validator
- Return consistent response envelope

Expected Output:

- src/routes/users.route.ts
- src/controllers/users.controller.ts
- src/dto/*.dto.ts

---

@frontend-nuxt Task FE-001: Create user management UI

Contract:

- API: GET /api/users, POST /api/users
- Types: User { id, name, email, createdAt }

Requirements:

- Use Nuxt UI components
- Use useApi composable
- Handle pagination, loading, error states

Expected Output:

- app/pages/users/index.vue
- app/components/users/UserList.vue
- app/components/users/UserForm.vue
```

Both run concurrently → both return DELEGATION RESULTs → the leader verifies API alignment (frontend calls match the shipped endpoints) and type compatibility (TS interfaces match DTOs) before either task is marked `DONE`.

**When this would NOT be parallel:** if the frontend needed the API to exist before it could be tested end-to-end, or if no contract could be written upfront, the tasks would be chained instead (`BE-001` first, then `FE-001`).

---

## Related docs

- [AGENT_ARCHITECTURE.md](AGENT_ARCHITECTURE.md) — how the agent system is defined and orchestrated
- [AGENT_DIRECTORY.md](AGENT_DIRECTORY.md) — complete reference of all agents and routing
- [INTEGRATION_ANALYSIS.md](INTEGRATION_ANALYSIS.md) — how v1.4.0 components were selected and merged
