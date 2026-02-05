const fs = require('fs')
const os = require('os')
const path = require('path')
const { execFileSync } = require('child_process')

function run(scriptPath, cwd, args) {
  return execFileSync('node', [scriptPath, ...args], {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

test('inserts lastModified after date when missing', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lastmod-insert-'))
  try {
    execFileSync('git', ['init'], { cwd: dir, stdio: 'ignore' })
    const contentDir = path.join(dir, 'content')
    fs.mkdirSync(contentDir)
    const file = path.join(contentDir, 'a.md')
    fs.writeFileSync(
      file,
      `---\n` +
        `templateKey: BlogPost\n` +
        `title: A\n` +
        `date: 2019-01-01T00:00:00.000Z\n` +
        `---\n` +
        `Body\n`,
      'utf8'
    )

    const scriptPath = path.join(process.cwd(), 'scripts', 'update-last-modified.mjs')
    run(scriptPath, dir, ['--all', '--mode', 'now', '--now', '2020-01-01T00:00:00.000Z', '--template-key', 'BlogPost'])

    const updated = fs.readFileSync(file, 'utf8')
    expect(updated).toContain('date: 2019-01-01T00:00:00.000Z\nlastModified: 2020-01-01T00:00:00.000Z\n')
    expect(updated).toContain('\n---\nBody\n')
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('replaces existing lastModified without changing body', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lastmod-replace-'))
  try {
    execFileSync('git', ['init'], { cwd: dir, stdio: 'ignore' })
    const contentDir = path.join(dir, 'content')
    fs.mkdirSync(contentDir)
    const file = path.join(contentDir, 'a.md')
    fs.writeFileSync(
      file,
      `---\n` +
        `templateKey: BlogPost\n` +
        `title: A\n` +
        `date: 2019-01-01T00:00:00.000Z\n` +
        `lastModified: 1999-01-01T00:00:00.000Z\n` +
        `---\n` +
        `Body line 1\n` +
        `Body line 2\n`,
      'utf8'
    )

    const scriptPath = path.join(process.cwd(), 'scripts', 'update-last-modified.mjs')
    run(scriptPath, dir, ['--all', '--mode', 'now', '--now', '2020-01-01T00:00:00.000Z', '--template-key', 'BlogPost'])

    const updated = fs.readFileSync(file, 'utf8')
    expect(updated).toContain('lastModified: 2020-01-01T00:00:00.000Z\n')
    expect(updated).toContain('Body line 1\nBody line 2\n')
    expect(updated).not.toContain('1999-01-01T00:00:00.000Z')
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('--check exits non-zero when changes would be made', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lastmod-check-'))
  try {
    execFileSync('git', ['init'], { cwd: dir, stdio: 'ignore' })
    const contentDir = path.join(dir, 'content')
    fs.mkdirSync(contentDir)
    const file = path.join(contentDir, 'a.md')
    fs.writeFileSync(
      file,
      `---\n` +
        `templateKey: BlogPost\n` +
        `title: A\n` +
        `date: 2019-01-01T00:00:00.000Z\n` +
        `---\n` +
        `Body\n`,
      'utf8'
    )

    const scriptPath = path.join(process.cwd(), 'scripts', 'update-last-modified.mjs')
    expect(() =>
      execFileSync('node', [scriptPath, '--all', '--mode', 'now', '--now', '2020-01-01T00:00:00.000Z', '--check', '--template-key', 'BlogPost'], {
        cwd: dir,
        stdio: 'ignore',
      })
    ).toThrow()
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('does not touch non-BlogPost files unless --remove-others is set', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lastmod-filter-'))
  try {
    execFileSync('git', ['init'], { cwd: dir, stdio: 'ignore' })
    const contentDir = path.join(dir, 'content')
    fs.mkdirSync(contentDir)
    const file = path.join(contentDir, 'a.md')
    fs.writeFileSync(
      file,
      `---\n` +
        `templateKey: AboutPage\n` +
        `title: A\n` +
        `date: 2019-01-01T00:00:00.000Z\n` +
        `---\n` +
        `Body\n`,
      'utf8'
    )

    const before = fs.readFileSync(file, 'utf8')
    const scriptPath = path.join(process.cwd(), 'scripts', 'update-last-modified.mjs')
    run(scriptPath, dir, ['--all', '--mode', 'now', '--now', '2020-01-01T00:00:00.000Z', '--template-key', 'BlogPost'])
    const after = fs.readFileSync(file, 'utf8')
    expect(after).toBe(before)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('--remove-others removes lastModified from non-BlogPost files', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lastmod-remove-'))
  try {
    execFileSync('git', ['init'], { cwd: dir, stdio: 'ignore' })
    const contentDir = path.join(dir, 'content')
    fs.mkdirSync(contentDir)
    const file = path.join(contentDir, 'a.md')
    fs.writeFileSync(
      file,
      `---\n` +
        `templateKey: AboutPage\n` +
        `title: A\n` +
        `date: 2019-01-01T00:00:00.000Z\n` +
        `lastModified: 1999-01-01T00:00:00.000Z\n` +
        `---\n` +
        `Body\n`,
      'utf8'
    )

    const scriptPath = path.join(process.cwd(), 'scripts', 'update-last-modified.mjs')
    run(scriptPath, dir, [
      '--all',
      '--mode',
      'now',
      '--now',
      '2020-01-01T00:00:00.000Z',
      '--path-prefix',
      'content/blog',
      '--template-key',
      'BlogPost',
      '--remove-others',
    ])

    const updated = fs.readFileSync(file, 'utf8')
    expect(updated).not.toContain('lastModified:')
    expect(updated).toContain('templateKey: AboutPage\n')
    expect(updated).toContain('Body\n')
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('preserves missing newline after closing frontmatter delimiter', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lastmod-newline-'))
  try {
    execFileSync('git', ['init'], { cwd: dir, stdio: 'ignore' })
    const contentDir = path.join(dir, 'content')
    fs.mkdirSync(contentDir)
    const file = path.join(contentDir, 'a.md')

    // No newline at EOF.
    fs.writeFileSync(
      file,
      `---\n` +
        `templateKey: AboutPage\n` +
        `title: A\n` +
        `date: 2019-01-01T00:00:00.000Z\n` +
        `---`,
      'utf8'
    )

    const scriptPath = path.join(process.cwd(), 'scripts', 'update-last-modified.mjs')
    run(scriptPath, dir, ['--all', '--mode', 'now', '--now', '2020-01-01T00:00:00.000Z', '--path-prefix', 'content/blog', '--template-key', 'BlogPost', '--remove-others'])

    const updated = fs.readFileSync(file, 'utf8')
    expect(updated.endsWith('---')).toBe(true)
    expect(updated.endsWith('---\n')).toBe(false)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('excludes BlogPost templates (isTemplate: true)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lastmod-istemplate-'))
  try {
    execFileSync('git', ['init'], { cwd: dir, stdio: 'ignore' })
    const contentDir = path.join(dir, 'content', 'blog')
    fs.mkdirSync(contentDir, { recursive: true })
    const file = path.join(contentDir, 'template.md')

    fs.writeFileSync(
      file,
      `---\n` +
        `templateKey: BlogPost\n` +
        `isTemplate: true\n` +
        `title: Template\n` +
        `date: 2019-01-01T00:00:00.000Z\n` +
        `lastModified: 1999-01-01T00:00:00.000Z\n` +
        `---\n` +
        `Body\n`,
      'utf8'
    )

    const scriptPath = path.join(process.cwd(), 'scripts', 'update-last-modified.mjs')
    run(scriptPath, dir, [
      '--all',
      '--mode',
      'now',
      '--now',
      '2020-01-01T00:00:00.000Z',
      '--path-prefix',
      'content/blog',
      '--template-key',
      'BlogPost',
      '--remove-others',
    ])

    const updated = fs.readFileSync(file, 'utf8')
    expect(updated).not.toContain('lastModified:')
    expect(updated).toContain('isTemplate: true\n')
    expect(updated).toContain('Body\n')
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('--staged stages the files it modifies', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lastmod-staged-add-'))
  try {
    execFileSync('git', ['init'], { cwd: dir, stdio: 'ignore' })
    execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: dir, stdio: 'ignore' })
    execFileSync('git', ['config', 'user.name', 'Test User'], { cwd: dir, stdio: 'ignore' })

    const contentDir = path.join(dir, 'content', 'blog')
    fs.mkdirSync(contentDir, { recursive: true })
    const fileRel = path.join('content', 'blog', 'a.md')
    const fileAbs = path.join(dir, fileRel)

    fs.writeFileSync(
      fileAbs,
      `---\n` +
        `templateKey: BlogPost\n` +
        `title: A\n` +
        `date: 2019-01-01T00:00:00.000Z\n` +
        `---\n` +
        `Body\n`,
      'utf8'
    )

    execFileSync('git', ['add', fileRel], { cwd: dir, stdio: 'ignore' })

    const scriptPath = path.join(process.cwd(), 'scripts', 'update-last-modified.mjs')
    run(scriptPath, dir, [
      '--staged',
      '--mode',
      'now',
      '--now',
      '2020-01-01T00:00:00.000Z',
      '--path-prefix',
      'content/blog',
      '--template-key',
      'BlogPost',
      '--remove-others',
    ])

    const cachedDiff = execFileSync('git', ['diff', '--cached', '--', fileRel], { cwd: dir, encoding: 'utf8' })
    expect(cachedDiff).toContain('lastModified: 2020-01-01T00:00:00.000Z')
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
