# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with Next.js 15, featuring:
- React components with Material-UI v6 styling  
- TypeScript support with path aliases
- Static site generation (SSG) with `next export`
- Blog functionality with markdown content
- Interactive animations using PIXI.js and GSAP
- Responsive design with parallax sections
- The project is intended to be served as a github static page

## Common Development Commands

```bash
# Start development server (accessible at http://localhost:8080)
npm run dev

# Build for production (static export)
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Export static site
npm run export

# Clean build cache
npm run clean

# Run tests
npm run test

# Update test snapshots
npm run updateSnap
```

## Architecture & Structure

### Core Architecture
- **Next.js 15**: React framework with SSG configuration
- **Material-UI v6**: Component library with Emotion styling
- **TypeScript**: Type safety with path aliases (@/ mapping)
- **Static Export**: Configured for static site hosting
- **Persisted Layout**: Custom layout wrapper that maintains state across page transitions
- **Context-based State**: Uses React Context for shared state management

### Key Components Structure
- **Pages**: Next.js pages in `pages/` directory with dynamic routing
- **Templates**: Page-level components in `src/templates/` (IndexPageTemplate, BlogPageTemplate, etc.)
- **Widgets**: Main content sections (AboutWidget, BlogWidget, PortfolioWidget)
- **Layout System**: Persisted layout with scroll management and state preservation
- **Interactive Elements**: 
  - Chatbot functionality with API integration
  - Bubble tank animations using PIXI.js
  - Parallax sections with scroll triggers
  - Flying sprite animations

### Page Scroll System
Uses a custom scroll system with:
- `Container.jsx`: Main scroll container wrapper
- `Section.jsx`: Individual page sections
- `useScrollTrigger.jsx`: Hook for scroll-based animations
- State persistence across navigation

### Content Management
- **Markdown Content**: Blog posts and pages stored as `.md` files in `content/` directory
- **Static Assets**: Images in `public/img/` and `static/img/`
- **File-based Routing**: Uses Next.js dynamic routes with `[slug].js` pattern
- **Content Processing**: Custom markdown processing with `gray-matter` and `marked`

### Testing Setup
- Jest with Next.js configuration
- React Testing Library for component testing
- Component snapshot testing
- Test files in `__tests__/` directory
- Mock files in `__mocks__/` for static assets

### Development Configuration
- **TypeScript**: Full TypeScript support with path aliases
- **ESLint**: Next.js ESLint configuration
- **Babel**: Next.js babel configuration
- **Webpack**: Custom webpack config for PIXI.js and raw markdown loading

## Important Implementation Details

### Layout Persistence
The site uses a custom layout system (`PersistedLayout.jsx`) that maintains:
- Scroll position across page transitions
- Component state preservation
- History state management
- Z-index management for overlays

### Chatbot Integration
- API endpoints for chatbot functionality
- Docker setup for chatbot backend in `src/chatbot/`
- FAQ and Q&A preprocessing scripts
- Real-time chat interface components

### Animation Systems
- GSAP for complex animations
- PIXI.js for WebGL-based graphics (bubble tank)
- ScrollMagic for scroll-triggered animations
- Custom throttling and viewport detection utilities

### Content Types
- **Blog Posts**: Markdown files with frontmatter in `content/blog/`
- **Portfolio Items**: Individual markdown files in `content/portfolio/`
- **Page Templates**: Reusable templates for different page types
- **Static Pages**: Main pages (index, about, blog) in `content/` directory
- **Legacy CMS Integration**: Netlify CMS configuration in `static/admin/config.yml`