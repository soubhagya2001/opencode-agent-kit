# Installation

Install the Agent Kit into any OpenCode project — per-project, globally, or both. Every claim below is verified against the installer code in `bin/commands/` (v1.3.13, shipping as v1.4.0).

**Related docs**: [CONFIGURATION.md](CONFIGURATION.md) (config reference) · [AGENT_ARCHITECTURE.md](AGENT_ARCHITECTURE.md) (agent system) · [AGENT_DIRECTORY.md](AGENT_DIRECTORY.md) (agent reference)

---

## Prerequisites

| Requirement  | Minimum | Notes                                                            |
| ------------ | ------- | ---------------------------------------------------------------- |
| Node.js      | 18      | Checked by `opencode-agent-kit doctor` (`Node.js >= 18`)         |
| npm          | any     | Used by the installer; pnpm/yarn/bun lockfiles are auto-detected |
| OpenCode CLI | latest  | `opencode` must be on your PATH                                  |
| git          | any     | Recommended; the installer writes/updates `.gitignore`           |

The installer also installs two optional global helpers when possible: `agentmemory` (persistent cross-session memory) and `portless` (stable `https://<app>.localhost` dev-server URLs). If either global install fails, the installer warns and continues — you can install them later:

```bash
npm install -g @agentmemory/agentmemory
npm install -g portless
```

---

## Installation Methods

### 1. Per-Project (npx one-liner)

```bash
cd /path/to/your-project
npx opencode-agent-kit init
```

What this does (verified in `bin/commands/init.mjs` → `initLocal()`):

- Copies the full `template/.opencode/` tree into your project as `.opencode/` (agents, skills, commands, rules, hooks, plugins, tools, workflows, scripts, instructions, contexts, docs). Existing files at the destination are **not overwritten** — your local modifications are preserved.
- Merges the template `opencode.json` into your project's `opencode.json`: your `permission`, `formatter`, `$schema`, and provider settings are kept; kit agents, MCP servers, instructions, and plugins are added without duplicating existing entries.
- Copies `opencode.example.json` for reference.
- Installs `.opencode/` dependencies (package manager auto-detected from `bun.lock` / `pnpm-lock.yaml` / `yarn.lock`, defaulting to npm).
- Installs `agentmemory` and `portless` globally if missing.
- Creates/updates `.gitignore` (adds `.opencode/*`, `opencode.json`, `opencode.example.json`, `data/`).
- Writes `.opencode/.kit-version` and runs any pending config migrations.

Force-overwrite with `--force`; skip dependency/helper installs with `--skip-install`.

### 2. Global Install (Recommended — one install, every project)

```bash
# Step 1: install once
npx opencode-agent-kit init --global

# Step 2: just run OpenCode in any project
cd /path/to/your-project
opencode
```

The global install copies the template **flat** into the OpenCode config directory (no `.opencode/` wrapper) and rewrites every `.opencode/` path in the config (`instructions[]`, `agent.*.prompt`, `mcp.*.command[]`, `plugin[]`) to absolute paths. Your existing config is merged, not overwritten: `permission`, `provider`, and `formatter` are preserved as-is.

Per-project setup after a global install:

| Platform    | Setup needed                                                                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| macOS/Linux | None — OpenCode auto-detects the global config. `npx opencode-agent-kit link` just prints this.                                                                                       |
| Windows     | Run `npx opencode-agent-kit link`. It creates a `.opencode/` **junction** to the global install, a minimal `opencode.json`, and adds `.opencode/*` + `opencode.json` to `.gitignore`. |

If you prefer a fully self-contained project (or want to customize files independently of the global install), detach with a local copy:

```bash
npx opencode-agent-kit init --local
```

Useful global management commands:

```bash
opencode-agent-kit global status   # install location, version, kit contents
opencode-agent-kit global path     # print the global config path
opencode-agent-kit global update   # re-run the global install at the latest version
```

### 3. Update

Two commands, two different targets:

```bash
# Update the kit content installed in projects / global config
# (re-copies the template with merge — existing files are preserved)
npx opencode-agent-kit global update     # for a global install
npx opencode-agent-kit init              # re-run in a project to re-copy content

# Update the opencode-agent-kit CLI package itself (npm global)
npx opencode-agent-kit upgrade
```

After upgrading, check for pending config migrations:

```bash
npx opencode-agent-kit migrate
```

### 4. Doctor (health check)

```bash
npx opencode-agent-kit doctor
```

Checks (verified in `bin/commands/doctor.mjs`): Node.js >= 18, `package.json`, `opencode.json` presence and JSON validity, `.opencode/` structure (`prompts/agents/`, `instructions/`, `skills/`), agent prompt count, installed vs. latest kit version, pending migrations, `.gitignore` coverage, global `agentmemory` availability, and global kit install status. Run with `--fix` to print actionable fix suggestions for each finding.

---

## Cross-Platform Paths

Resolution order (verified in `bin/commands/global-path.mjs`): `$OPENCODE_HOME` first, then the platform default.

| Platform | Default path                                                 | Override        |
| -------- | ------------------------------------------------------------ | --------------- |
| macOS    | `~/.config/opencode/`                                        | `OPENCODE_HOME` |
| Linux    | `$XDG_CONFIG_HOME/opencode/` (default `~/.config/opencode/`) | `OPENCODE_HOME` |
| Windows  | `%USERPROFILE%\.config\opencode\` (not `%APPDATA%`)          | `OPENCODE_HOME` |

Note: on Windows the installer uses `%USERPROFILE%\.config\opencode\`, following OpenCode's config location — it does **not** use `%APPDATA%\opencode\`.

---

## What Gets Installed

Per-project install (tree verified against `scripts/generate-template.sh`, which generates the shipped `template/` directory):

```
<your-project>/
├── opencode.json              ← merged agent definitions, MCP, permissions
├── opencode.example.json      ← reference config
├── .gitignore                 ← created/updated
└── .opencode/
    ├── .kit-version           ← installed kit version
    ├── package.json           ← .opencode/ dependencies
    ├── prompts/agents/        ← agent prompt files (markdown)
    ├── skills/                ← 300+ skill playbooks
    ├── commands/              ← 75+ slash commands
    ├── workflows/             ← project-kickoff / tdd-feature / pre-flight-audit playbooks
    ├── tools/                 ← custom tools (read-env, run-script)
    ├── plugins/               ← agentmemory-capture, ponytail, env-protection, inject-env
    ├── hooks/                 ← lifecycle automation (agentmemory-start, ponytail runtime)
    ├── scripts/               ← Python validation suite (verify_all, checklist, security_scan, …)
    ├── instructions/          ← core rules always loaded into agents
    ├── rules/                 ← scoped coding rules (common/, typescript/, python/, …)
    ├── contexts/              ← dev / research / review contexts
    └── docs/                  ← framework reference docs (Nuxt, Next, Node)
```

The global install (`init --global`) copies the same `.opencode/` contents **flat** into the OpenCode home directory and adds `opencode.jsonc` (merged config), `opencode.example.json`, and `.kit-version`:

```
~/.config/opencode/
├── opencode.jsonc             ← merged config (preserves your providers/permission)
├── opencode.example.json
├── .kit-version
├── skills/  prompts/  commands/  workflows/  tools/  plugins/
├── hooks/  scripts/  instructions/  rules/  contexts/  docs/
└── package.json               ← dependencies (preserved if you already have one)
```

---

## Post-Install Verification

1. **Smoke test** — start OpenCode in your project:

   ```bash
   opencode
   ```

   Then confirm the kit is loaded:

   - Run `/plan <something>` — the planning command should respond with an implementation plan.
   - Or `@leader` the primary IT Leader agent directly with a small task.

2. **Doctor** — run the automated health check:

   ```bash
   npx opencode-agent-kit doctor          # add --fix for fix suggestions
   ```

3. **Deep validation (optional)** — run the full Python verification suite:

   ```bash
   python .opencode/scripts/verify_all.py .
   ```

   This runs security scan, lint, schema validation, tests, UX audit, SEO check, Lighthouse, and Playwright E2E where the corresponding scripts and external tools are available. Checks whose scripts or tools are missing are **gracefully skipped** (reported as `Skipped`, not counted as failures) — verified in `verify_all.py`.

---

## Troubleshooting

### Windows: junction creation fails

`npx opencode-agent-kit link` creates an NTFS junction from `.opencode/` → the global install. If it fails (permissions, antivirus, network drive):

- Use a full local copy instead: `npx opencode-agent-kit init` (self-contained, no junction needed), or
- Create the junction manually, then re-run `npx opencode-agent-kit link`:

  ```powershell
  New-Item -ItemType Junction -Path .opencode -Target "$env:USERPROFILE\.config\opencode"
  ```

### portless: first run needs trust (port 443)

On macOS/Linux, serving stable `https://<app>.localhost` URLs on port 443 requires a one-time trust step:

```bash
sudo portless trust
```

If you cannot use privileged ports, point portless at another port via the `PORT` environment variable (e.g. `PORT=443 portless <dev-command>` — see the visual-dev-loop skill).

### agentmemory server offline

If the agentmemory MCP server is not running (not installed, or port 3111 unavailable), agents fall back to a **file-based memory** under `.opencode/memory/` (per the agent-memory-workflow skill): memories are saved as JSON files there and recalled by reading the directory. Install/start the real server any time for full semantic search and the viewer dashboard:

```bash
npm install -g @agentmemory/agentmemory
agentmemory          # starts the server; viewer at http://localhost:3113
```

### Other checks

- **Stale kit version** — `doctor` warns if `.opencode/.kit-version` is behind npm; run `npx opencode-agent-kit upgrade` then `npx opencode-agent-kit init` (or `global update`) and `migrate`.
- **Global install missing** — `doctor` reports it; run `npx opencode-agent-kit init --global`.
- **Uninstall** — `npx opencode-agent-kit uninstall` removes the kit from a project.
