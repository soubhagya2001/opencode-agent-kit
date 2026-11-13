import type { Plugin } from '@opencode-ai/plugin';

/**
 * Env Protection — hard runtime guard against reading .env file contents.
 *
 * Complements the opencode.json permission rules (`*.env` read: deny):
 * even if an agent or tool bypasses the permission layer, this hook blocks
 * any `read` tool call whose path points at a .env-style file.
 */
export const EnvProtection: Plugin = async () => {
  return {
    'tool.execute.before': async (input, output) => {
      if (input.tool !== 'read' && input.tool !== 'grep' && input.tool !== 'glob') return;
      const args = (output?.args || {}) as Record<string, unknown>;
      const filePath = String(args.filePath ?? args.file ?? args.path ?? '');
      if (/\.env(\..*)?$/.test(filePath) && !/\.env\.example$/.test(filePath)) {
        throw new Error(
          'Security Exception: Do not read .env files directly! Use the read-env tool to list variable NAMES only.',
        );
      }
    },
  };
};
