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

## Architecture & Structure

### Core Architecture
- **Next.js 15 App Router**: React framework with SSG configuration using `output: 'export'`
- **Material-UI v6**: Component library with Emotion styling system
- **TypeScript**: Type safety with path aliases (`@/` maps to `./src/`)
- **Static Export**: Configured for GitHub Pages hosting with trailing slashes
- **Persisted Layout**: Custom layout wrapper (`PersistedLayout.jsx`) that maintains state across transitions
- **Context-based State**: Uses React Context via `LayoutContext` for shared state management

### App Router Structure
- **App Directory**: Uses Next.js 13+ App Router in `src/app/`
  - `layout.tsx`: Root layout with metadata and global providers
  - `page.jsx`: Home page
  - `about/page.tsx`: About page
  - `blog/page.tsx` & `blog/[slug]/page.tsx`: Blog listing and individual posts
  - `portfolio/page.tsx` & `portfolio/[slug]/page.tsx`: Portfolio listing and items
- **Templates**: Page-level components in `src/templates/` that handle data fetching and rendering
- **Widgets**: Main content sections (AboutWidget, BlogWidget, PortfolioWidget) 
- **Client Providers**: `client-providers.tsx` wraps Material-UI theme and other client-side providers

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
- Jest with jsdom environment for React component testing
- React Testing Library for component testing
- Component snapshot testing with `npm run updateSnap`
- Test files located throughout the codebase in `__tests__/` directories

### Development Configuration
- **TypeScript**: Configured with `@/` path alias mapping to `./src/`
- **ESLint**: Next.js ESLint configuration with `eslint-config-next`
- **Webpack Custom Config**: 
  - PIXI.js fallbacks for client-side rendering (`fs: false, path: false`)
  - Raw markdown loader using `asset/source` for `.md` files
  - Handles static export requirements

## Important Implementation Details

### Layout Persistence System
The `PersistedLayout.jsx` component provides a sophisticated state management system:
- **Context Resolution**: Uses `LayoutContext` with `contextValueRef` for cross-component state sharing
- **Scroll Management**: Maintains scroll position via `scrollLayer` reference and debounced resize handlers
- **State Persistence**: Preserves component state across page transitions using React Context
- **Fallback Handling**: 1-second timeout prevents infinite loading states
- **Z-index Management**: Handles overlay stacking for modals and interactive elements

### Client-Side Rendering Strategy
- **Dual Rendering**: Components marked with `'use client'` for interactivity
- **Static Export**: Pages pre-rendered at build time with `next build`
- **Hydration**: Client-side JavaScript adds interactivity to static HTML
- **Context Providers**: Material-UI theme and custom contexts wrapped in `ClientProviders`

### Animation & Graphics Systems
- **GSAP**: Complex timeline animations and scroll-triggered effects
- **PIXI.js**: WebGL-based graphics engine for bubble tank animations
- **Custom Utilities**: Throttling, debouncing, and viewport detection in `src/utils/`
- **Intersection Observer**: Used for performance-optimized scroll triggers

### Content Architecture
- **Markdown Processing**: Uses `gray-matter` for frontmatter parsing and `marked` for HTML conversion
- **Content Location**: All content moved from `src/pages/` to `content/` directory structure
- **Dynamic Routing**: `[slug].tsx` pages dynamically generate routes from markdown files
- **Static Generation**: Content processed at build time for optimal performance
- **Template System**: Page templates (`src/templates/`) separate data fetching from presentation
