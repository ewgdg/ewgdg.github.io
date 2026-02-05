import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep, posix } from 'node:path';

function parseArgs(argv) {
    const args = {
        all: false,
        staged: false,
        mode: null,
        now: null,
        check: false,
        templateKey: null,
        removeOthers: false,
        pathPrefix: null,
    };

    for (let i = 2; i < argv.length; i += 1) {
        const token = argv[i];
        if (token === '--all') args.all = true;
        else if (token === '--staged') args.staged = true;
        else if (token === '--check') args.check = true;
        else if (token === '--remove-others') args.removeOthers = true;
        else if (token === '--mode') {
            args.mode = argv[i + 1];
            i += 1;
        } else if (token.startsWith('--mode=')) {
            args.mode = token.slice('--mode='.length);
        } else if (token === '--template-key') {
            args.templateKey = argv[i + 1];
            i += 1;
        } else if (token.startsWith('--template-key=')) {
            args.templateKey = token.slice('--template-key='.length);
        } else if (token === '--path-prefix') {
            args.pathPrefix = argv[i + 1];
            i += 1;
        } else if (token.startsWith('--path-prefix=')) {
            args.pathPrefix = token.slice('--path-prefix='.length);
        } else if (token === '--now') {
            args.now = argv[i + 1];
            i += 1;
        } else if (token.startsWith('--now=')) {
            args.now = token.slice('--now='.length);
        } else {
            throw new Error(`Unknown arg: ${token}`);
        }
    }

    if (!args.mode) {
        throw new Error('Missing required --mode (git|now)');
    }
    if (args.mode !== 'git' && args.mode !== 'now') {
        throw new Error(`Invalid --mode ${args.mode} (expected git|now)`);
    }
    if (!args.all && !args.staged) {
        // Default to staged to avoid surprising mass rewrites.
        args.staged = true;
    }
    if (args.all && args.staged) {
        throw new Error('Use only one of --all or --staged');
    }
    if (args.removeOthers && !args.templateKey && !args.pathPrefix) {
        throw new Error('--remove-others requires --template-key and/or --path-prefix')
    }

    return args;
}

function getRepoRoot() {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], {
        encoding: 'utf8',
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
}

function toPosixPath(pathString) {
    return pathString.split(sep).join(posix.sep);
}

function getNowIso(args) {
    if (args.now) {
        const parsed = new Date(args.now);
        if (Number.isNaN(parsed.getTime())) {
            throw new Error(`Invalid --now value: ${args.now}`);
        }
        return parsed.toISOString();
    }
    return new Date().toISOString();
}

function getGitLastModifiedIso(repoRoot, relativePath, args) {
    try {
        const output = execFileSync(
            'git',
            ['log', '-1', '--format=%cI', '--follow', '--', relativePath],
            {
                encoding: 'utf8',
                cwd: repoRoot,
                stdio: ['ignore', 'pipe', 'ignore'],
            },
        ).trim();

        if (!output) return null;

        const parsed = new Date(output);
        if (Number.isNaN(parsed.getTime())) return null;
        return parsed.toISOString();
    } catch {
        return null;
    }
}

function listAllMarkdownFiles(contentRoot) {
    const results = [];

    function walk(dir) {
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = join(dir, entry.name);
            if (entry.isDirectory()) walk(fullPath);
            else if (entry.isFile() && entry.name.endsWith('.md')) results.push(fullPath);
        }
    }

    walk(contentRoot);
    return results;
}

function listStagedMarkdownFiles(repoRoot) {
    const output = execFileSync(
        'git',
        ['diff', '--name-only', '--cached', '--diff-filter=ACMR'],
        { encoding: 'utf8', cwd: repoRoot, stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();

    if (!output) return [];

    return output
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean)
        .filter((p) => p.startsWith('content/') && p.endsWith('.md'))
        .map((p) => join(repoRoot, p));
}

function detectNewline(text) {
    const firstLf = text.indexOf('\n');
    if (firstLf === -1) return '\n';
    return firstLf > 0 && text[firstLf - 1] === '\r' ? '\r\n' : '\n';
}

function splitFrontmatter(markdownText) {
    if (!markdownText.startsWith('---')) return null;

    const newline = detectNewline(markdownText);
    const startDelimiter = `---${newline}`;
    if (!markdownText.startsWith(startDelimiter)) return null;

    const endIndex = markdownText.indexOf(`${newline}---`, startDelimiter.length);
    if (endIndex === -1) return null;

    const frontmatterRaw = markdownText.slice(startDelimiter.length, endIndex);
    const rest = markdownText.slice(endIndex + newline.length + 3);
    const hasNewlineAfterClosing = rest.startsWith(newline);
    const body = hasNewlineAfterClosing ? rest.slice(newline.length) : rest;

    return {
        newline,
        frontmatterRaw,
        hasNewlineAfterClosing,
        body,
    };
}

function readScalarValue(value) {
    const trimmed = value.trim()
    if (
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
        return trimmed.slice(1, -1)
    }
    return trimmed
}

function getFrontmatterTemplateKey(frontmatterRaw, newline) {
    const lines = frontmatterRaw.split(newline)
    for (const line of lines) {
        const match = line.match(/^\s*templateKey\s*:\s*(.+?)\s*$/)
        if (match) return readScalarValue(match[1])
    }
    return null
}

function parseBooleanScalar(value) {
    const normalized = readScalarValue(value).toLowerCase()
    if (normalized === 'true') return true
    if (normalized === 'false') return false
    return null
}

function getFrontmatterIsTemplate(frontmatterRaw, newline) {
    const lines = frontmatterRaw.split(newline)
    for (const line of lines) {
        const match = line.match(/^\s*isTemplate\s*:\s*(.+?)\s*$/)
        if (match) return parseBooleanScalar(match[1])
    }
    return null
}

function removeLastModified(frontmatterRaw, newline) {
    const lines = frontmatterRaw.split(newline)
    const filtered = lines.filter((line) => !/^\s*lastModified\s*:/.test(line))
    return filtered.join(newline)
}

function updateFrontmatter(frontmatterRaw, newline, lastModifiedIso) {
    const lines = frontmatterRaw.split(newline);

    const existingIndex = lines.findIndex((line) => /^\s*lastModified\s*:/.test(line));
    if (existingIndex !== -1) {
        const indent = (lines[existingIndex].match(/^(\s*)/) || ['',''])[1];
        lines[existingIndex] = `${indent}lastModified: ${lastModifiedIso}`;
        return lines.join(newline);
    }

    const dateIndex = lines.findIndex((line) => /^\s*date\s*:/.test(line));
    const insertAt = dateIndex !== -1 ? dateIndex + 1 : lines.length;
    lines.splice(insertAt, 0, `lastModified: ${lastModifiedIso}`);
    return lines.join(newline);
}

function normalizePathPrefix(prefix) {
    const posixPrefix = toPosixPath(prefix)
    if (posixPrefix === '') return null
    return posixPrefix.endsWith('/') ? posixPrefix : `${posixPrefix}/`
}

function computeTargetLastModified(repoRoot, filePath, args) {
    if (args.mode === 'now') return getNowIso(args);

    const relativePath = toPosixPath(relative(repoRoot, filePath));
    const iso = getGitLastModifiedIso(repoRoot, relativePath, args);
    return iso || getNowIso(args);
}

function updateFile(repoRoot, filePath, args) {
    const text = readFileSync(filePath, 'utf8');
    const split = splitFrontmatter(text);
    if (!split) {
        return { changed: false, reason: 'missing_frontmatter' };
    }

    const repoRelativePath = toPosixPath(relative(repoRoot, filePath))

    const requiredPrefix = args.pathPrefix ? normalizePathPrefix(args.pathPrefix) : null
    const matchesPath = requiredPrefix ? repoRelativePath.startsWith(requiredPrefix) : true

    const templateKey = getFrontmatterTemplateKey(split.frontmatterRaw, split.newline)
    const matchesTemplateKey = args.templateKey ? templateKey === args.templateKey : true
    const isTemplate = getFrontmatterIsTemplate(split.frontmatterRaw, split.newline) === true

    if (requiredPrefix || args.templateKey) {
        const matches = matchesPath && matchesTemplateKey && !isTemplate

        if (!matches) {
            if (!args.removeOthers) {
                return { changed: false, reason: 'templateKey_mismatch' }
            }

            const withoutLastModified = removeLastModified(split.frontmatterRaw, split.newline)
            const rebuilt = `---${split.newline}${withoutLastModified}${split.newline}---${split.hasNewlineAfterClosing ? split.newline : ''}${split.body}`;
            if (rebuilt === text) return { changed: false, reason: 'no_change' };
            if (!args.check) writeFileSync(filePath, rebuilt, 'utf8');
            return { changed: true };
        }
    }

    const lastModifiedIso = computeTargetLastModified(repoRoot, filePath, args);
    const updatedFrontmatter = updateFrontmatter(split.frontmatterRaw, split.newline, lastModifiedIso);
    const rebuilt = `---${split.newline}${updatedFrontmatter}${split.newline}---${split.hasNewlineAfterClosing ? split.newline : ''}${split.body}`;

    if (rebuilt === text) return { changed: false, reason: 'no_change' };
    if (!args.check) writeFileSync(filePath, rebuilt, 'utf8');
    return { changed: true };
}

function main() {
    const args = parseArgs(process.argv);
    const repoRoot = getRepoRoot();
    const contentRoot = join(repoRoot, 'content');

    let files = [];
    if (args.all) files = listAllMarkdownFiles(contentRoot);
    else files = listStagedMarkdownFiles(repoRoot);

    files = files.filter((p) => {
        try {
            return statSync(p).isFile();
        } catch {
            return false;
        }
    });

    if (files.length === 0) return;

    const changed = [];
    const skipped = [];

    for (const filePath of files) {
        const res = updateFile(repoRoot, filePath, args);
        if (res.changed) changed.push(relative(repoRoot, filePath));
        else if (res.reason === 'missing_frontmatter') skipped.push(relative(repoRoot, filePath));
    }

    if (!args.check && args.staged && changed.length) {
        execFileSync('git', ['add', '--', ...changed], {
            cwd: repoRoot,
            stdio: ['ignore', 'ignore', 'pipe'],
        })
    }

    if (skipped.length) {
        console.warn(`[lastModified] Skipped (missing frontmatter):${skipped.map((p) => `\n- ${p}`).join('')}`); // eslint-disable-line no-console
    }

    if (args.check && changed.length) {
        console.error(`[lastModified] Would update:${changed.map((p) => `\n- ${p}`).join('')}`); // eslint-disable-line no-console
        process.exitCode = 1;
    }
}

main();
