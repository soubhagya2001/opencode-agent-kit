// env-protection — OpenCode server plugin (V2 API).
//
// Hard runtime guard against reading .env file contents.
// Complements the opencode.json permission rules (`*.env` read: deny):
// even if an agent or tool bypasses the permission layer, this hook blocks
// any `read` tool call whose path points at a .env-style file.
//
// OpenCode 2.x reads `default` with `id` + `setup(ctx)`. OpenCode is case-insensitive
// for tool names in V2, but we match lowercase to be explicit.
//
// verification: verified against opencode v2.2.7 runtime (plugin loader
// requires a default export with id + setup).
import { Plugin } from '@opencode/plugin';

export default Plugin.define({
  id: 'env-protection',
  async setup(ctx: any) {
    await ctx.tool.hook('execute.before', (event: any) => {
      const tool = String(event?.tool ?? '').toLowerCase();
      if (tool !== 'read' && tool !== 'grep' && tool !== 'glob') return;
      const input = event?.input ?? {};
      const filePath = String(input.filePath ?? input.file ?? input.path ?? '');
      if (/\.env(\..*)?$/.test(filePath) && !/\.env\.example$/.test(filePath)) {
        throw new Error(
          'Security Exception: Do not read .env files directly! Use the read-env tool to list variable NAMES only.',
        );
      }
    });
  },
});
