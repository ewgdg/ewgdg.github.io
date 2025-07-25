# Portfolio Pages Refactor - Implementation Plan

## Problem Statement
The portfolio pages currently reuse blog templates and components directly, creating architectural inconsistency and suboptimal UX. Portfolio items have different requirements (external links, project showcase focus) than blog posts (reading-focused content).

## Current Architecture Issues
1. **Template Reuse**: Portfolio pages use `BlogPageTemplate` and `BlogPostTemplate` directly
2. **Missing Separation**: No portfolio-specific templates or data processing
3. **Configuration Gap**: No `content/portfolio.md` configuration file
4. **Data Processing**: Uses same `useBlogPostCards.js` without portfolio-specific handling
5. **Navigation Inconsistency**: Blog-style navigation doesn't fit portfolio context

## Implementation Plan

### Phase 1: Create Portfolio-Specific Templates
**Goal**: Establish architectural independence between blog and portfolio systems

#### 1.1 Create PortfolioPage Template
- **File**: `src/templates/PortfolioPage.jsx`
- **Purpose**: Portfolio equivalent of `BlogPage.jsx`
- **Features**: Portfolio-specific state management, data processing hooks
- **Dependencies**: Portfolio configuration from `content/portfolio.md`

#### 1.2 Create PortfolioPageTemplate 
- **File**: `src/templates/PortfolioPageTemplate.jsx`  
- **Purpose**: Portfolio list display template
- **Features**: 
  - Project grid/card layout optimized for portfolio items
  - Different filtering/sorting logic (featured vs chronological)
  - Portfolio-specific header styling and content

#### 1.3 Create PortfolioPost Template
- **File**: `src/templates/PortfolioPost.jsx`
- **Purpose**: Individual portfolio item wrapper
- **Features**: Portfolio-specific SEO, navigation, layout structure

#### 1.4 Create PortfolioPostTemplate
- **File**: `src/templates/PortfolioPostTemplate.jsx`
- **Purpose**: Portfolio item display template  
- **Features**:
  - External link handling (open in new tab, different styling)
  - Project showcase layout vs blog reading layout
  - Remove/modify "Back to List" for portfolio context
  - Technology tags and project metadata display

### Phase 2: Portfolio Configuration and Data Processing

#### 2.1 Create Portfolio Configuration
- **File**: `content/portfolio.md`
- **Content**: Portfolio page jumbotron, title, description, metadata
- **Integration**: Update `/src/app/portfolio/page.tsx` to use this config

#### 2.2 Extend Data Processing
- **Option A**: Extend `useBlogPostCards.js` with portfolio-specific logic
- **Option B**: Create separate `usePortfolioCards.js` hook
- **Features**:
  - Handle `externalLink` field properly
  - Portfolio-specific sorting (featured projects first)
  - Different card layouts for project vs blog content

### Phase 3: Update Portfolio Pages

#### 3.1 Update Portfolio List Page
- **File**: `/src/app/portfolio/page.tsx`
- **Changes**: Replace `BlogPageTemplate` with `PortfolioPageTemplate`
- **Integration**: Use portfolio configuration and data processing

#### 3.2 Update Individual Portfolio Pages
- **File**: `/src/app/portfolio/[slug]/portfolio-item-client.jsx`
- **Changes**: Replace `BlogPostTemplate` with `PortfolioPostTemplate`
- **Integration**: Portfolio-specific navigation and layout

### Phase 4: Widget Consistency

#### 4.1 Update PortfolioWidget
- **File**: `src/components/widgets/PortfolioWidget.jsx`
- **Changes**: Ensure consistency with main portfolio page data processing
- **Integration**: Share data processing logic between widget and main pages

## MVP Approach
Start with Phase 1 (templates) to establish architectural separation, then incrementally improve with configuration and data processing enhancements.

## Success Criteria
1. Portfolio pages have independent templates and architecture
2. Portfolio items handle external links properly
3. Portfolio configuration is file-based like blog configuration
4. Navigation and UX is optimized for project showcase vs reading
5. Code maintainability improved through proper separation of concerns

## Risk Mitigation
- Copy existing blog templates as starting point to maintain functionality
- Test thoroughly to ensure no regressions in portfolio display
- Maintain backward compatibility with existing content structure