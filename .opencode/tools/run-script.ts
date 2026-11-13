import { tool } from '@opencode-ai/plugin';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(exec);

export default tool({
  description: 'Run a package.json script and return its output',
  args: {
    script: tool.schema
      .string()
      .describe("npm script name, e.g. 'test', 'build', 'lint'")
      .regex(/^[a-zA-Z0-9:_-]+$/),
  },
  async execute(args, context) {
    const cwd = context?.worktree || context?.directory || process.cwd();
    try {
      const { stdout, stderr } = await run(`npm run ${args.script}`, { cwd, windowsHide: true });
      return `${stdout}\n${stderr}`.trim();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const stderr =
        error && typeof error === 'object' && 'stderr' in error
          ? String((error as { stderr: unknown }).stderr).trim()
          : '';
      return `Script "${args.script}" failed:\n${stderr || message}`;
    }
  },
});
