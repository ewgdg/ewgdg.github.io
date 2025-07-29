# My Personal Portfolio Website

A modern personal portfolio website built with Next.js, featuring a content management system powered by Decap CMS.

## Features

- **Next.js** with App Router and static site generation
- **Material-UI** for modern, responsive design
- **TypeScript** support with path aliases
- **Decap CMS** for easy content management
- **Local Git Backend** for development content editing
- **Markdown-based** blog and portfolio content
- **Interactive animations** using PIXI.js and GSAP
- **Static export** ready for GitHub Pages deployment

## Development

### Quick Start

```bash
# Install dependencies
npm install

# Start development server (localhost:8080)
npm run dev

# Or start with CMS server (recommended)
npm run dev:cms
```

### Content Management

Access the content management system at `http://localhost:8080/admin/` when running the development server.

**CMS Features:**

- Edit blog posts and portfolio items through web interface
- Real-time preview of changes
- Automatic git commits for content changes
- Media management for images

### Available Scripts

```bash
# Development
npm run dev          # Start Next.js dev server
npm run cms          # Start Decap CMS proxy server
npm run dev:cms      # Start both servers concurrently

# Production
npm run build        # Build for production
npm run start        # Start production server
npm run export       # Export static site

# Quality
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run updateSnap   # Update test snapshots

# Utilities
npm run clean        # Clean build cache

# Deployment
npm run deploy       # Build and deploy to GitHub Pages
```

## Project Structure

```shell
├── content/          # Markdown content files
│   ├── blog/         # Blog posts
│   └── portfolio/    # Portfolio items
├── public/           # Static assets
│   ├── admin/        # CMS configuration
│   └── img/          # Images
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── cms/          # CMS configuration and preview templates
│   ├── components/   # React components
│   ├── templates/    # Page templates
│   └── utils/        # Utility functions
└── .claude/          # Claude Code task management
```

## Technology Stack

- **Framework:** Next.js 15 with App Router
- **UI Library:** Material-UI v6 with Emotion
- **Content Management:** Decap CMS with local git backend
- **Styling:** CSS-in-JS with Emotion
- **Animation:** GSAP, PIXI.js
- **Content:** Markdown with gray-matter
- **Testing:** Jest with React Testing Library
- **Language:** TypeScript

## Deployment

### GitHub Pages

The project is configured for easy deployment to GitHub Pages:

```bash
npm run deploy
```

This command will:

1. Build the static site (`npm run build`)
2. Deploy to GitHub Pages using `gh-pages`


```bash
npm run export
```
