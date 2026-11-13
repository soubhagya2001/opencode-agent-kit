#!/usr/bin/env node
// agentmemory MCP launcher for OpenCode.
//
// 1. Reuses a running agentmemory server on :3111, or starts one in the
//    background (agentmemory installed globally or run via npx as fallback).
// 2. Hands stdio over to the @agentmemory/mcp bridge so the MCP client
//    (OpenCode) can talk to it.
import { spawn, execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const IS_WIN = process.platform === 'win32';
const PORT = process.env.AGENTMEMORY_URL || 'http://localhost:3111';
const HEALTH = PORT + '/agentmemory/livez';

// Resolve the global npm root once (and cache it), preferring direct binaries
// over npx to avoid cold-start latency that can trip MCP handshake timeouts.
let globalRoot = null;
function getGlobalRoot() {
  if (globalRoot !== null) return globalRoot;
  try {
    globalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
  } catch {
    globalRoot = '';
  }
  return globalRoot;
}

function globalBin(pkg, bin) {
  const root = getGlobalRoot();
  if (!root) return null;
  const p = join(root, pkg, bin);
  return existsSync(p) ? p : null;
}

function resolveServerLauncher() {
  const bin = globalBin('@agentmemory/agentmemory', join('dist', 'cli.mjs'));
  if (bin) return { cmd: 'node', args: [bin] };
  if (IS_WIN) return { cmd: 'cmd.exe', args: ['/d', '/s', '/c', 'npx', '@agentmemory/agentmemory'] };
  return { cmd: 'npx', args: ['@agentmemory/agentmemory'] };
}

function resolveMcpBridge() {
  const bin = globalBin('@agentmemory/mcp', 'bin.mjs');
  if (bin) return { cmd: 'node', args: [bin] };
  if (IS_WIN) return { cmd: 'cmd.exe', args: ['/d', '/s', '/c', 'npx', '-y', '@agentmemory/mcp'] };
  return { cmd: 'npx', args: ['-y', '@agentmemory/mcp'] };
}

async function isRunning() {
  try {
    const res = await fetch(HEALTH, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

async function waitForServer(timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await isRunning()) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function main() {
  if (!(await isRunning())) {
    const { cmd, args } = resolveServerLauncher();
    const proc = spawn(cmd, args, {
      stdio: 'ignore',
      detached: true,
    });
    proc.unref();
    const ready = await waitForServer();
    if (!ready) {
      console.error(
        '[agentmemory] server did not start in time, MCP will use local fallback (7 tools)',
      );
    }
  }

  const { cmd, args } = resolveMcpBridge();
  const mcp = spawn(cmd, [...args, ...process.argv.slice(2)], {
    stdio: ['inherit', 'inherit', 'inherit'],
  });

  const cleanup = () => {
    mcp.kill();
    process.exit();
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('SIGHUP', cleanup);

  mcp.on('exit', (code) => process.exit(code ?? 0));
}

main();
