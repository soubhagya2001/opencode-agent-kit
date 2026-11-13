# Agent Directory

> Complete reference of all 47 registered agents (grouped by department) plus the 11 built-in OpenCode agents.

Agents marked **NEW** were added in v1.4.0 from the Skeletorflet donor kit — see [INTEGRATION_ANALYSIS.md](INTEGRATION_ANALYSIS.md) §4.1. Colors are the values registered in `opencode.json`. Prompt files live in `.opencode/prompts/agents/`.

> Note on counts: `opencode.json` registers 47 agents; `.opencode/prompts/agents/` contains 48 prompt files. The extra file, `nuxt-frontend-developer-mentor.md`, is a legacy reference document — it is **not** registered as an agent.

---

## Registered agents by department

### Primary orchestrators

| Mention      | Prompt file            | Responsibility                                                                            | Color     |
| ------------ | ---------------------- | ----------------------------------------------------------------------------------------- | --------- |
| `@leader`    | `it-leader.md`         | Primary IT Leader / orchestrator — analyzes requirements, plans, delegates, integrates    | `#8b5cf6` |
| `@sonarqube` | `sonarqube-quality.md` | Primary SonarQube quality agent — scans, triages issues, routes fixes to domain subagents | `#eab308` |

### Management & Orchestration

| Mention              | Prompt file            | Responsibility                                                      | Color     |
| -------------------- | ---------------------- | ------------------------------------------------------------------- | --------- |
| `@harness-optimizer` | `harness-optimizer.md` | Agent config optimization, cost efficiency, throughput              | `#7C4FE0` |
| `@loop-operator`     | `loop-operator.md`     | Autonomous agent loops with quality gates, monitoring, intervention | `#EC4899` |

### Planning & Research

| Mention                       | Prompt file             | Responsibility                                                                                | Color     | Source                     |
| ----------------------------- | ----------------------- | --------------------------------------------------------------------------------------------- | --------- | -------------------------- |
| `@planner` **NEW**            | `planner.md`            | Phased plans, dependencies, risks, acceptance criteria, `docs/plans/<task-slug>.md` files     | `#c026d3` | donor `project-planner`    |
| `@product-manager` **NEW**    | `product-manager.md`    | Requirements discovery, user stories, acceptance criteria, PRD drafts                         | `#db2777` | donor `product-manager`    |
| `@code-archaeologist` **NEW** | `code-archaeologist.md` | Reconstructs intent from legacy code, maps architecture drift, documents undocumented systems | `#57534e` | donor `code-archaeologist` |
| `@docs-lookup`                | `docs-lookup.md`        | Library/framework docs via MCP with code examples                                             | `#4F52B0` | —                          |

### Architecture & Design

| Mention                  | Prompt file         | Responsibility                                                                                 | Color     | Source                                                        |
| ------------------------ | ------------------- | ---------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------- |
| `@architect` **NEW**     | `architect.md`      | Advisory system design, trade-off evaluation, ADR documentation — never implements             | `#0f766e` | derived (architecture skill + orchestrator advisory concepts) |
| `@api-architect` **NEW** | `api-architect.md`  | REST/GraphQL contracts, versioning, pagination, error standards as shared delegation contracts | `#0369a1` | donor `graphql-developer` + `api-patterns`                    |
| `@designer`              | `ui-ux-designer.md` | Design system, Impeccable (23 commands), accessibility, design-to-code handoff                 | `#f59e0b` | —                                                             |

### Frontend Development

| Mention           | Prompt file                   | Responsibility                                             | Color     |
| ----------------- | ----------------------------- | ---------------------------------------------------------- | --------- |
| `@frontend-nuxt`  | `nuxt-frontend-developer.md`  | Vue components, Nuxt UI, composables, pages (Nuxt 4)       | `#3b82f6` |
| `@frontend-react` | `react-frontend-developer.md` | React, Next.js 15 App Router, Server Components, shadcn/ui | `#06b6d4` |
| `@angular`        | `angular-developer.md`        | Angular standalone components, NgRx, RxJS, Material        | `#DD0031` |

### Backend Development

| Mention                   | Prompt file                   | Responsibility                                          | Color     | Source                 |
| ------------------------- | ----------------------------- | ------------------------------------------------------- | --------- | ---------------------- |
| `@node-developer`         | `node-backend-developer.md`   | Express 5, Prisma, PostgreSQL, REST APIs, JWT auth      | `#10b981` | —                      |
| `@ci3`                    | `code-igniter-3-fullstack.md` | CI3 MVC monolith, REST API, JWT                         | `#84cc16` | —                      |
| `@laravel`                | `laravel-advanced.md`         | Laravel REST API, Service/Repository pattern            | `#f97316` | —                      |
| `@java-developer`         | `java-developer.md`           | Spring Boot, JPA/Hibernate, Maven/Gradle, microservices | `#ED8B00` | —                      |
| `@go-developer`           | `go-developer.md`             | Go APIs, CLI tools, concurrency, sqlx/gorm              | `#00ADD8` | —                      |
| `@python`                 | `python-developer.md`         | Django, FastAPI, ML engineering, data science           | `#3776AB` | —                      |
| `@rust`                   | `rust-developer.md`           | Systems programming, CLI tools, embedded                | `#DEA584` | —                      |
| `@swift`                  | `swift-developer.md`          | SwiftUI, iOS/macOS apps, Apple ecosystem                | `#F05138` | —                      |
| `@dotnet`                 | `dotnet-developer.md`         | ASP.NET Core, Blazor, MAUI, EF Core, Azure              | `#512BD4` | —                      |
| `@cpp`                    | `cpp-developer.md`            | Modern C++17/20/23, CMake, perf-critical systems        | `#00599C` | —                      |
| `@ruby-developer` **NEW** | `ruby-developer.md`           | Ruby 3.3+, Rails 7+, Hotwire/Turbo, Active Record       | `#CC342D` | donor `ruby-developer` |

### Database & Data

| Mention                  | Prompt file              | Responsibility                                                  | Color     | Source                |
| ------------------------ | ------------------------ | --------------------------------------------------------------- | --------- | --------------------- |
| `@database`              | `database-specialist.md` | PostgreSQL schema, query optimization, Prisma                   | `#0891b2` | —                     |
| `@data-engineer` **NEW** | `data-engineer.md`       | ETL pipelines, warehouse modeling, batch/stream processing, dbt | `#92400e` | donor `data-engineer` |

### Mobile

| Mention    | Prompt file            | Responsibility                                          | Color     |
| ---------- | ---------------------- | ------------------------------------------------------- | --------- |
| `@android` | `android-developer.md` | Kotlin, Jetpack Compose, Gradle, Play Store (GPC suite) | `#22c55e` |
| `@flutter` | `flutter-developer.md` | Flutter, Dart, Material 3, Cupertino, Firebase          | `#0284c7` |

### Game Development _(new department)_

| Mention                   | Prompt file         | Responsibility                                                                  | Color     | Source                 |
| ------------------------- | ------------------- | ------------------------------------------------------------------------------- | --------- | ---------------------- |
| `@game-developer` **NEW** | `game-developer.md` | Cross-platform game dev (web/PC/mobile/VR-AR), engine selection, asset pipeline | `#a855f7` | donor `game-developer` |

### Testing & QA

| Mention                  | Prompt file        | Responsibility                                                               | Color     | Source                |
| ------------------------ | ------------------ | ---------------------------------------------------------------------------- | --------- | --------------------- |
| `@test-engineer` **NEW** | `test-engineer.md` | TDD-first unit/integration/E2E coverage, owns test files, 80%+ coverage gate | `#166534` | donor `test-engineer` |

> E2E test generation is also covered by the built-in `@e2e-runner` (see Built-ins below).

### Security & Review

| Mention                          | Prompt file                | Responsibility                                                                                       | Color     | Source                        |
| -------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------- | --------- | ----------------------------- |
| `@security-auditor` **NEW**      | `security-auditor.md`      | OWASP threat modeling, secrets scan, auth-flow review, vulnerability triage                          | `#991b1b` | donor `security-auditor`      |
| `@reviewer`                      | `code-reviewer.md`         | Code quality, security audit, testing strategy                                                       | `#ef4444` | —                             |
| `@debugger` **NEW**              | `debugger.md`              | 4-phase root-cause investigation (reproduce → isolate → understand → fix & verify) across all stacks | `#e11d48` | donor `debugger`              |
| `@performance-optimizer` **NEW** | `performance-optimizer.md` | Measurement-first profiling, bottleneck analysis, verified optimization                              | `#a16207` | donor `performance-optimizer` |
| `@python-reviewer`               | `python-reviewer.md`       | Python type safety, PEP 8, Django/FastAPI review                                                     | `#306998` | —                             |
| `@rust-reviewer`                 | `rust-reviewer.md`         | Rust memory safety, ownership, concurrency                                                           | `#C67D4B` | —                             |
| `@cpp-reviewer`                  | `cpp-reviewer.md`          | C++ RAII, Rule of Five, memory safety                                                                | `#004477` | —                             |
| `@java-reviewer`                 | `java-reviewer.md`         | Java/Spring Boot, JPA, concurrency                                                                   | `#CC7700` | —                             |
| `@php-reviewer`                  | `php-reviewer.md`          | PHP/Laravel, Eloquent, PSR standards                                                                 | `#777BB4` | —                             |
| `@kotlin-reviewer`               | `kotlin-reviewer.md`       | Kotlin coroutines, Compose, Android security                                                         | `#7F52FF` | —                             |
| `@go-reviewer`                   | `go-reviewer.md`           | Go error handling, concurrency, idiomatic Go                                                         | `#0088AA` | —                             |

### DevOps & Infrastructure

| Mention                    | Prompt file            | Responsibility                                                                    | Color     | Source                  |
| -------------------------- | ---------------------- | --------------------------------------------------------------------------------- | --------- | ----------------------- |
| `@devops`                  | `devops-specialist.md` | CI/CD, Docker, deployment, monitoring                                             | `#6366f1` | —                       |
| `@cloud-architect` **NEW** | `cloud-architect.md`   | AWS/Azure/GCP architecture, serverless, cost optimization (complements `@devops`) | `#4338ca` | donor `cloud-architect` |

### Documentation

| Mention               | Prompt file         | Responsibility                                                                                                            | Color     | Source                       |
| --------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------- |
| `@doc-writer` **NEW** | `doc-writer.md`     | Diataxis docs (tutorial/how-to/reference/explanation), README/CHANGELOG; only agent permitted to edit markdown/docs files | `#64748b` | donor `documentation-writer` |
| `@agent-engineer`     | `agent-engineer.md` | Agent orchestration systems, eval harnesses, autonomous loops, safety guardrails                                          | `#6D28D9` | —                            |

> **`@agent-engineer` boundary**: it _builds_ AI agent software; it does not orchestrate the development team — that is `@leader`'s job.

### Discovery & Growth

| Mention | Prompt file         | Responsibility                                        | Color     |
| ------- | ------------------- | ----------------------------------------------------- | --------- |
| `@seo`  | `seo-specialist.md` | Meta tags, structured data, Core Web Vitals, sitemaps | `#65a30d` |

---

## Built-in OpenCode agents

Not registered in this kit — provided by OpenCode itself and referenced by the leader prompt:

| Built-in agent                         | Use For                                        |
| -------------------------------------- | ---------------------------------------------- |
| `@planner` / `/plan` _(built-in)_      | Deep planning, architecture analysis           |
| `@architect` _(built-in)_              | System design, scalability, trade-off analysis |
| `@scout`                               | Clone & read external dependency source        |
| `@general`                             | Complex multi-step research                    |
| `@code-reviewer` / `/code-review`      | General code quality review                    |
| `@security-reviewer` / `/security`     | Vulnerability scanning, OWASP compliance       |
| `@build-error-resolver` / `/build-fix` | TS errors, build failures                      |
| `@e2e-runner` / `/e2e`                 | Playwright E2E test generation                 |
| `@refactor-cleaner`                    | Dead code removal, unused imports              |
| `@database-reviewer`                   | PostgreSQL query analysis, EXPLAIN plans       |
| `@doc-updater` / `/update-docs`        | Documentation updates                          |

> The built-in `@planner`, `@architect`, `@code-reviewer`, `@security-reviewer`, and `@doc-updater` have the same mention names as registered custom agents. Per the leader prompt: **use custom stack agents for implementation, specialist reviewers for code review, built-in agents for general-purpose tasks.** For deep audits, the registered `@security-auditor` replaces the default `@security-reviewer`; for full documentation deliverables, the registered `@doc-writer` replaces `@doc-updater`.

---

## Quick-reference routing table

| If you need…                                                | Use                                     |
| ----------------------------------------------------------- | --------------------------------------- |
| A Vue/Nuxt component, page, composable                      | `@frontend-nuxt`                        |
| A React/Next.js component, Server Component, shadcn/ui work | `@frontend-react`                       |
| An Angular component, NgRx state, RxJS                      | `@angular`                              |
| A Node.js API endpoint, DTO, middleware, Prisma operation   | `@node-developer`                       |
| A CodeIgniter 3 controller/model/view                       | `@ci3`                                  |
| A Laravel controller, service, repository, Eloquent model   | `@laravel`                              |
| A Spring Boot / JPA service                                 | `@java-developer`                       |
| A Go service, CLI tool, concurrent system                   | `@go-developer`                         |
| A Django/FastAPI endpoint, Celery task, ML pipeline         | `@python`                               |
| A Rust module, CLI, embedded system                         | `@rust`                                 |
| An iOS/macOS app, SwiftUI view                              | `@swift`                                |
| A .NET API, Blazor app, EF Core change                      | `@dotnet`                               |
| A C++ module, CMake change                                  | `@cpp`                                  |
| A Ruby/Rails app, Hotwire/Turbo feature                     | `@ruby-developer` **NEW**               |
| Android UI, Compose, Play Store release                     | `@android`                              |
| A Flutter widget, Dart change                               | `@flutter`                              |
| A game (any platform)                                       | `@game-developer` **NEW**               |
| Database schema, migration, query optimization              | `@database`                             |
| ETL pipeline, warehouse modeling, streaming                 | `@data-engineer` **NEW**                |
| A phased plan with dependencies and risks                   | `@planner` **NEW**                      |
| Requirements → user stories → PRD                           | `@product-manager` **NEW**              |
| An architecture decision or ADR (advisory)                  | `@architect` **NEW**                    |
| An API contract before backend work starts                  | `@api-architect` **NEW**                |
| Design, UX, tokens, accessibility, design critique          | `@designer`                             |
| A stubborn or cross-cutting bug                             | `@debugger` **NEW**                     |
| Test files, TDD, coverage gates                             | `@test-engineer` **NEW**                |
| Playwright E2E test generation                              | `@e2e-runner` (built-in)                |
| A deep security audit (auth/PII/payments)                   | `@security-auditor` **NEW**             |
| A routine security scan                                     | `@security-reviewer` (built-in)         |
| Code quality review                                         | `@reviewer` (or language `@*-reviewer`) |
| Profiling and performance optimization                      | `@performance-optimizer` **NEW**        |
| SonarQube scan and issue triage                             | `@sonarqube`                            |
| Legacy code onboarding / intent reconstruction              | `@code-archaeologist` **NEW**           |
| CI/CD, Docker, deployment configs                           | `@devops`                               |
| Cloud/serverless/scaling architecture (AWS/Azure/GCP)       | `@cloud-architect` **NEW**              |
| SEO meta tags, structured data, CWV                         | `@seo`                                  |
| Documentation, README, CHANGELOG                            | `@doc-writer` **NEW**                   |
| A documentation update tied to a just-merged change         | `@doc-updater` (built-in)               |
| Library/API documentation lookup                            | `@docs-lookup`                          |
| An AI agent system (loops, evals, guardrails)               | `@agent-engineer`                       |
| Agent-config optimization / cost tuning                     | `@harness-optimizer`                    |
| An autonomous agent loop, monitoring                        | `@loop-operator`                        |
| External dependency source exploration                      | `@scout` (built-in)                     |
| Complex multi-step research                                 | `@general` (built-in)                   |
| Build / TypeScript errors                                   | `@build-error-resolver` (built-in)      |
| Dead-code cleanup                                           | `@refactor-cleaner` (built-in)          |

---

## Related docs

- [AGENT_ARCHITECTURE.md](AGENT_ARCHITECTURE.md) — how the agent system is defined and orchestrated
- [DELEGATION_WORKFLOW.md](DELEGATION_WORKFLOW.md) — the end-to-end contract-driven workflow
- [INTEGRATION_ANALYSIS.md](INTEGRATION_ANALYSIS.md) — how v1.4.0 components were selected and merged
