import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

function getRepoRoot() {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], {
        encoding: 'utf8',
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
}

function parseArgs(argv) {
    const args = { force: false };
    for (let i = 2; i < argv.length; i += 1) {
        const token = argv[i];
        if (token === '--force') args.force = true;
        else throw new Error(`Unknown arg: ${token}`);
    }
    return args;
}

const MARKER = '# installed-by: scripts/install-git-hooks.mjs';

function main() {
    const args = parseArgs(process.argv);
    const repoRoot = getRepoRoot();
    const hooksDir = join(repoRoot, '.git', 'hooks');
    const hookPath = join(hooksDir, 'pre-commit');

    mkdirSync(hooksDir, { recursive: true });

    if (existsSync(hookPath) && !args.force) {
        const existing = readFileSync(hookPath, 'utf8');
        if (!existing.includes(MARKER)) {
            console.log(`[hooks] ${hookPath} already exists; re-run with --force to overwrite.`); // eslint-disable-line no-console
            return;
        }
    }

    const script = `#!/bin/sh
set -e
${MARKER}

ROOT="$(git rev-parse --show-toplevel)"
node "$ROOT/scripts/update-last-modified.mjs" --staged --mode now --path-prefix content/blog --template-key BlogPost
`;

    writeFileSync(hookPath, script, 'utf8');
    chmodSync(hookPath, 0o755);
    console.log(`[hooks] Installed pre-commit hook at ${hookPath}`); // eslint-disable-line no-console
}

main();
