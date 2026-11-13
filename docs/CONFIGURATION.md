# Configuration

How the Agent Kit is configured: the `opencode.json` / `opencode.jsonc` anatomy, MCP servers, plugins, custom tools, agents, permissions, and environment variables. Every claim is verified against `opencode.json`, `bin/commands/init.mjs`, `.opencode/tools/`, `.opencode/plugins/`, and `docs/INTEGRATION_ANALYSIS.md`.

---

## Anatomy of the Config

There are two config locations:

| Location                              | File             | Used when                                                            |
| ------------------------------------- | ---------------- | -------------------------------------------------------------------- |
| Project root                          | `opencode.json`  | Per-project install; `.opencode/` paths are relative to the project  |
| OpenCode home (`~/.config/opencode/`) | `opencode.jsonc` | Global install; the installer rewrites all kit paths to **absolute** |

During a global install (`bin/commands/init.mjs` → `rewriteTemplatePathsForGlobal()`), every `.opencode/` reference is rewritten to an absolute path in four places: `instructions[]`, `agent.*.prompt` (`{file:...}` wrapper), `mcp.*.command[]`, and `plugin[]`.

### Top-level keys

Verified in `opencode.json`: `$schema`, `formatter`, `permission`, `instructions`, `mcp`, `plugin`, `agent`.

### `permission` — global posture

Allow-by-default with security deny-lists (defuj posture, preserved through the integration — see `docs/INTEGRATION_ANALYSIS.md` §5):

```json
"permission": {
  "read":   { "*": "allow", "*.env": "deny", "*.env.*": "deny", "*.env.example": "allow" },
  "edit": "allow", "glob": "allow", "grep": "allow", "list": "allow",
  "webfetch": "allow", "skill": "allow", "todowrite": "allow", "question": "allow",
  "doom_loop": "ask",
  "external_directory": { "*": "allow", "~/.ssh/**": "deny", "...": "deny (see below)" },
  "bash": { "*": "allow", "ls *": "allow", "...": "allow (safe-command list)" },
  "agentmemory_*": "allow", "figma_*": "allow",
  "chrome-devtools_*": "allow", "agent-browser_*": "allow"
}
```

Three sub-behaviors worth knowing:

- **Read deny-list**: all reads allowed, except `.env` / `.env.*` files (`.env.example` explicitly allowed).
- **External directory denials**: outside the project, reads are denied for `~/.ssh/**`, `~/.aws/**`, `~/.config/**`, `~/secrets/**`, `~/.gnupg/**`, `~/.kube/**`, `~/.docker/**`, and `/etc/**`.
- **Bash**: broadly allowed (`"*": "allow"`) with an explicit safe-command allowlist (ls, pwd, which, type, mkdir, cp, mv, echo, printf, date, uname, whoami, file, wc, du, df). There are **no bash deny entries** at the global level — hard runtime enforcement for sensitive files comes from the `env-protection` plugin instead (defense in depth).

Individual agents may narrow or extend this via their own `permission` block (e.g. the leader adds `npm *`, `portless *`, `npx agent-browser*`, and MCP wildcards; the `task` tool is allowed for delegation).

### `instructions` — always-loaded context

An array of 17 file paths loaded into every agent at session start: `INSTRUCTIONS.md` plus 16 core skills (coding-standards, security-review, impeccable, it-leader-orchestration, eval-harness, verification-loop, strategic-compact, api-design, agent-task-workflow, agent-communication, agent-session-workflow, visual-dev-loop, agent-memory-workflow, agent-delegation-contract, progress-tracking, global-install). Deliberately small: all other skills (300+) load **on demand** via the skill tool (integration analysis §5).

### `mcp` map

12 servers — see the [table below](#mcp-servers).

### `plugin` array

4 plugins, absolute paths after global install — see [Plugins](#plugins).

### `agent` map

47 agent definitions keyed by short name — see [Agent Configuration](#agent-configuration).

---

## Model / Provider Configuration

**The kit adds no model fields and modifies no provider configuration.** There is no top-level `model` or `provider` key in the template `opencode.json`, and during merges the installer treats any existing `provider` section as `keep-target` — your API keys and model choices are never touched.

To configure providers (API keys, base URLs, models), follow the OpenCode documentation ([opencode.ai/docs](https://opencode.ai/docs)). For per-agent model recommendations, see the "Recommended Models" table in the project `README.md` — those are suggestions you apply yourself, not something the kit sets.

---

## MCP Servers

All 12 servers as defined in `opencode.json` (context7 and shadcn are new in v1.4.0 — integration analysis §4.6):

| MCP               | Type          | Enabled by default                 | Key / env required                           | What it provides                                                                                                   |
| ----------------- | ------------- | ---------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `nuxt`            | remote        | Yes                                | —                                            | Nuxt docs, blog, deployment guides (nuxt.com/mcp)                                                                  |
| `nuxt-ui`         | remote        | Yes                                | —                                            | Nuxt UI component docs & examples                                                                                  |
| `figma`           | remote        | **No** (`enabled: false`)          | `FIGMA_ACCESS_TOKEN` (README)                | Figma design file access — opt-in                                                                                  |
| `playwright`      | local (stdio) | Yes                                | —                                            | Browser automation & E2E testing                                                                                   |
| `stitch`          | remote        | Not set (OpenCode default applies) | `STITCH_API_KEY` (header `X-Goog-Api-Key`)   | Google Stitch AI design generation                                                                                 |
| `postman`         | remote        | Yes                                | `POSTMAN_API_KEY` (Bearer header)            | Postman collections, requests, documentation                                                                       |
| `sonarqube`       | remote        | Yes                                | `SONARQUBE_TOKEN` (Bearer header)            | SonarQube issues, hotspots, quality gates, coverage (`SONARQUBE_TOOLSETS` header selects toolsets)                 |
| `agentmemory`     | local         | Yes                                | — (needs the `agentmemory` server installed) | Persistent cross-session memory, 53 tools                                                                          |
| `chrome-devtools` | local         | Yes                                | —                                            | Full Chrome DevTools: navigation, screenshots (JPEG, max-width 1200), console/network                              |
| `agent-browser`   | local         | Yes                                | —                                            | Rust browser automation: annotated screenshots, visual diff, React tree (tools: core, network, react, tabs, debug) |
| `context7`        | remote        | Yes                                | — (no key required)                          | Live library & API documentation lookup — **new in v1.4.0**                                                        |
| `shadcn`          | local         | Yes                                | —                                            | shadcn/ui registry, component scaffolding, docs (`npx shadcn@latest mcp`) — **new in v1.4.0**                      |

Notes:

- `local` servers run via commands (`npx -y ...` or `node .opencode/hooks/agentmemory-start.mjs`); `remote` servers connect over HTTP(S) URLs.
- Netlify and Daytona MCPs from the donor kit were **not** integrated — both require account API keys and were judged low value for defaults (integration analysis §4.6).
- To enable Figma, flip `mcp.figma.enabled` to `true` and set `FIGMA_ACCESS_TOKEN` in your environment.
- Stitch's entry sets the API key as a request header (`X-Goog-Api-Key: ${STITCH_API_KEY}`) but does not set `enabled: false`; the README lists it as optional because the key is mandatory for it to work.

---

## Plugins

Four plugins registered in `opencode.json` (verified from each file's source):

| Plugin                   | What it does                                                                                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agentmemory-capture.ts` | Captures 22 agentmemory lifecycle events automatically: session lifecycle, messages, tool calls, reasoning, patches, file enrichment, permissions, todos, and commands.                                             |
| `ponytail.mjs`           | Injects the ponytail minimalism ruleset into every chat's system prompt at the active intensity and persists `/ponytail` mode switches (state file in the OpenCode config dir).                                     |
| `env-protection.ts`      | Hard runtime guard: throws on any `read`/`grep`/`glob` tool call whose path targets a `.env`-style file (except `.env.example`), even if the permission layer is bypassed. Complements the `*.env` read-deny rules. |
| `inject-env.ts`          | Injects `PROJECT_ROOT` (current cwd) and `OPENCODE_KIT_ACTIVE=true` into every shell execution so agents and scripts resolve the project root portably.                                                             |

---

## Custom Tools

Two custom tools in `.opencode/tools/` (new in v1.4.0 — integration analysis §4.5; both rewritten with `node:child_process` for runtime portability, replacing the donor's Bun-only `Bun.$`):

| Tool            | Behavior                                                                                                                                                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `read-env.ts`   | Lists the **names** of environment variables defined in `.env*` files at the project root — never their values. Values are split off before return. This is the sanctioned way to "see" env config without exposing secrets. |
| `run-script.ts` | Runs a `package.json` script (`npm run <script>`) and returns stdout/stderr. The script name is regex-validated (`[a-zA-Z0-9:_-]+`) to block command injection.                                                              |

---

## Agent Configuration

Agents are defined **in `opencode.json`** under `agent`, each pointing at a markdown prompt in `.opencode/prompts/agents/`:

```json
"leader": {
  "description": "IT Leader & Technical Project Manager — ...",
  "mode": "primary",                                   // "primary" | "subagent"
  "prompt": "{file:.opencode/prompts/agents/it-leader.md}",
  "temperature": 0.4,
  "color": "#8b5cf6",
  "permission": { "edit": "allow", "bash": { "...": "..." }, "task": { "*": "allow" } }
}
```

All 47 registered keys follow this shape (`leader` is the only `primary`; the rest are `subagent`).

### Add or customize an agent

1. Create a prompt file in `.opencode/prompts/agents/<name>.md`.
2. Add a key to the `agent` map with `mode`, `description`, and `prompt: "{file:.opencode/prompts/agents/<name>.md}"`.
3. Add a `permission` block to scope what the agent may do (edit/bash/MCP tool wildcards). Omit it to inherit defaults.
4. Optionally set `temperature` and `color`.

To customize an existing agent, edit its prompt file or create a same-named entry in your project — project-level agents override built-ins. Per-agent `model` fields are supported by OpenCode but the kit does not set any (see Model/Provider Configuration).

### Disable an agent

Remove its key from the `agent` map in your `opencode.json` (the prompt file under `.opencode/prompts/agents/` can stay or be deleted — only the map entry registers the agent). The installer's merge only _adds_ missing agent keys, so a removed key will not reappear on update.

---

## Permissions Philosophy

The kit's posture is **allow-by-default with security deny-lists** (`edit: allow`, `read: deny` for `.env`, `external_directory` denials for credential directories) — this is the defuj foundation posture, deliberately preserved. During the v1.4.0 integration, the donor kit's `edit: ask` / `bash: ask` posture was evaluated and **rejected**: it would have regressed the established permission model (see `docs/INTEGRATION_ANALYSIS.md` §5 and §7). Runtime hardening is layered on top instead via the `env-protection` plugin and the read-env-only `read-env` tool.

---

## Environment Variables Reference

| Variable             | Used by                         | Purpose                                                                               |
| -------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| `STITCH_API_KEY`     | `mcp.stitch`                    | `X-Goog-Api-Key` header for Google Stitch MCP. Get a key at stitch.withgoogle.com.    |
| `POSTMAN_API_KEY`    | `mcp.postman`                   | `Authorization: Bearer` token for the Postman MCP.                                    |
| `SONARQUBE_TOKEN`    | `mcp.sonarqube`                 | `Authorization: Bearer` token for the SonarQube MCP.                                  |
| `FIGMA_ACCESS_TOKEN` | Figma MCP (disabled by default) | Enables Figma access when you flip `mcp.figma.enabled` to `true`.                     |
| `OPENCODE_HOME`      | Installer (`global-path.mjs`)   | Full override of the OpenCode global config directory (beats the platform default).   |
| `PORT`               | portless (visual dev loop)      | Fallback port when privileged port 443 is unavailable (e.g. `PORT=443 portless ...`). |
| `COMPACT_THRESHOLD`  | strategic-compact hook          | Tool calls before the first manual-compaction suggestion (default: 50).               |

Two variables are **set automatically** by the `inject-env` plugin (not user-configured): `PROJECT_ROOT` (the shell's cwd) and `OPENCODE_KIT_ACTIVE=true`.

Also resolved by the installer, not you: `XDG_CONFIG_HOME` (Linux/macOS path resolution) and `USERPROFILE` (Windows path resolution) when computing the OpenCode home directory.
