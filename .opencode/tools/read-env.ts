import { tool } from '@opencode-ai/plugin';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const run = promisify(exec);

export default tool({
  description:
    'List environment variable NAMES (never values) present in .env files at the project root',
  args: {},
  async execute(_args, context) {
    const dir = context?.worktree || context?.directory || process.cwd();
    const glob = path.join(dir, '.env*');
    try {
      // Only capture the portion before '=' — values are never read or returned.
      const { stdout } = await run(
        process.platform === 'win32'
          ? `powershell -NoProfile -Command "Get-ChildItem -Path '${glob.replace(/'/g, "''")}' -ErrorAction SilentlyContinue | ForEach-Object { Get-Content $_.FullName | Where-Object { $_ -match '^[A-Za-z_][A-Za-z0-9_]*=' } | ForEach-Object { ($_ -split '=')[0] } } | Sort-Object -Unique"`
          : `grep -h '^[A-Za-z_]' ${glob} 2>/dev/null | cut -d= -f1 | sort -u`,
      );
      const names = stdout.trim();
      return `Environment variables defined (names only):\n${names || 'No .env files found'}`;
    } catch {
      return 'No .env files found or unable to read them';
    }
  },
});
