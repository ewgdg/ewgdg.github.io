# AGENTS.md

## Project summary
Personal portfolio site built with Next.js 15 App Router, TypeScript, and Material UI. It is statically exported for GitHub Pages, uses markdown-driven blog/portfolio content, and includes GSAP/PIXI-based interactive sections.

## Working assumptions
- Keep changes compatible with static export (`output: 'export'`) and trailing-slash routing.
- Use the `@/` alias for `src/` imports.
- Prefer extending existing layout, widget, and template patterns over introducing parallel structures.

## Key structure
- `src/app/`: App Router pages and root layout
- `src/templates/`: page-level data loading and rendering
- `src/widgets/`: major homepage/content sections
- `content/`: markdown content for blog and pages
- `public/`: static assets
- `src/app/client-providers.tsx`: client-side theme/providers

## Important implementation details
- `PersistedLayout.jsx` and `LayoutContext` preserve shared state and scroll behavior across navigation.
- The custom scroll system centers on `Container.jsx`, `Section.jsx`, and `useScrollTrigger.jsx`.
- Markdown content is parsed with `gray-matter` and rendered with `marked`.
- Interactive components should stay client-only where needed (`'use client'`).
- Build config includes PIXI browser fallbacks and raw `.md` loading.

## Testing
- Jest + React Testing Library
- Tests live mainly under `__tests__/`
- Snapshot updates: `npm run updateSnap`
