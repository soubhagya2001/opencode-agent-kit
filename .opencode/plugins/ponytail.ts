// ponytail — OpenCode server plugin (V2 API).
//
// Injects the ponytail ruleset into every model call's system prompt at the
// active intensity, and persists `/ponytail <level>` so the next turn follows it.
// Reuses the shared instruction builder so Claude Code, Codex, pi, and
// OpenCode all read one source of truth.
//
// OpenCode 2.x reads `default` with `id` + `setup(ctx)`. Skills ship in
// .opencode/skills/ and are auto-discovered by OpenCode — the old `config`
// hook used to register them manually, which V2 no longer exposes.
//
// verification: V2 hooks registered (session.hook("context"/"prompt")).
// Failures are logged and never block a session.
import { createRequire } from 'module';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);
const { getPonytailInstructions } = require('../hooks/ponytail-instructions');
const { getDefaultMode, normalizePersistedMode } = require('../hooks/ponytail-config');

// OpenCode has no flag-file convention of its own; keep mode beside its config.
const statePath = path.join(
  process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config'),
  'opencode',
  '.ponytail-active',
);

function readMode() {
  try {
    return normalizePersistedMode(fs.readFileSync(statePath, 'utf8').trim()) || getDefaultMode();
  } catch {
    return getDefaultMode();
  }
}

function writeMode(mode) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, mode);
}

function extractPromptText(event) {
  if (!event || typeof event !== 'object') return '';
  if (typeof event.text === 'string') return event.text;
  if (typeof event.prompt === 'string') return event.prompt;
  if (typeof event.input === 'string') return event.input;
  if (Array.isArray(event.parts)) {
    return event.parts
      .filter((p) => p && p.type === 'text')
      .map((p) => p.text || '')
      .join('\n');
  }
  return '';
}

export default {
  id: 'ponytail',
  async setup(ctx) {
    const log = (level, message) => {
      try {
        ctx?.app?.log?.({ service: 'ponytail', level, message });
      } catch {
        // logging must never break a session
      }
    };

    // Each registration is independently guarded: one bad hook must not take
    // down the others (the plugin then still serves everything else).
    const registerSessionHook = async (name, callback) => {
      try {
        await ctx.session.hook(name, callback);
      } catch (e) {
        log('warn', `session.hook "${name}" failed: ${(e && e.message) || e}`);
      }
    };

    if (typeof ctx?.session?.hook === 'function') {
      await registerSessionHook('context', (event) => {
        try {
          const mode = readMode();
          if (mode === 'off') return;
          const text = getPonytailInstructions(mode);
          if (!Array.isArray(event?.system)) return;
          event.system.push({ type: 'text', text });
        } catch (e) {
          log('warn', 'inject failed: ' + (e && e.message));
        }
      });

      // Persist `/ponytail <level>` so the next turn's injection follows it.
      // Commands arrive through the prompt hook in V2; the context hook reads
      // the flag this writes. Mode applies from the next message.
      await registerSessionHook('prompt', (event) => {
        try {
          const text = extractPromptText(event).trim();
          const match = /^\/ponytail(?:\s+(.+))?$/.exec(text);
          if (!match) return;
          const mode = normalizePersistedMode((match[1] || '').trim()) || getDefaultMode();
          writeMode(mode);
          log('info', 'ponytail ' + mode);
        } catch {
          // mode persistence must never break a session
        }
      });
    } else {
      log('warn', 'session.hook unavailable; ponytail injection disabled');
    }
  },
};
