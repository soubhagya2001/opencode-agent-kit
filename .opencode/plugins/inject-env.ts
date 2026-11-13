// inject-env — OpenCode server plugin (V2 API).
//
// Injects PROJECT_ROOT and OPENCODE_KIT_ACTIVE into every shell
// execution so agents and scripts can resolve the project root portably.
import { Plugin } from '@opencode/plugin';

export default Plugin.define({
  id: 'inject-env',
  async setup(ctx: any) {
    await ctx.shell.hook('create.before', (event: any) => {
      try {
        if (!event.env) event.env = {};
        event.env.PROJECT_ROOT = event?.cwd ?? ctx?.location?.directory ?? process.cwd();
        event.env.OPENCODE_KIT_ACTIVE = 'true';
      } catch {
        // Never break shell execution because of this decorator.
      }
    });
  },
});
