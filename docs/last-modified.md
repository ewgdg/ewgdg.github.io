# "Last modified" timestamps

Blog/portfolio pages show a **Last modified** timestamp.

## How it works

### Source of truth: frontmatter (Blog posts only)

Markdown files can include a `lastModified` field in their YAML frontmatter:

- `lastModified: 2025-07-27T09:25:05.000Z`

If present, the app uses this value as-is. In this project, we only use `lastModified` for blog posts under `content/blog` with `templateKey: BlogPost`.

## CI / GitHub Actions note

CI typically checks out the repository as a shallow clone for speed. For consistent timestamps in CI, ensure `lastModified` is present in frontmatter.

## Keeping `lastModified` updated

### One-time backfill (recommended)

Populate `lastModified` for all existing blog posts (`content/blog/*` + `templateKey: BlogPost`) using Git history:

- `node scripts/update-last-modified.mjs --all --mode git --path-prefix content/blog --template-key BlogPost --remove-others`

Posts marked with `isTemplate: true` are excluded.

### Optional pre-commit hook

Install a pre-commit hook that updates `lastModified` to “now” for staged blog-post changes:

- `node scripts/install-git-hooks.mjs`
