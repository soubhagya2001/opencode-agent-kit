import type { Plugin } from '@opencode-ai/plugin';

/**
 * Inject Env — injects PROJECT_ROOT and OPENCODE_KIT_ACTIVE into every shell
 * execution so agents and scripts can resolve the project root portably.
 */
export const InjectEnvPlugin: Plugin = async () => {
  return {
    'shell.env': async (input: { cwd?: string }, output: { env: Record<string, string> }) => {
      if (input?.cwd) output.env.PROJECT_ROOT = input.cwd;
      output.env.OPENCODE_KIT_ACTIVE = 'true';
    },
  };
};
