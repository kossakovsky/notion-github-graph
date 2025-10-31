# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Notion GitHub Tracker is a Next.js 15 application that embeds GitHub contribution graphs into Notion pages. It uses the GitHub GraphQL API to fetch contribution data and renders it as an embeddable widget with light/dark theme support.

## Development Commands

```bash
# Install dependencies
npm install
# or
yarn install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.5.6 (App Router)
- **Runtime**: React 19.2.0
- **Language**: TypeScript 5 (strict mode enabled)
- **Styling**: Tailwind CSS 3.4.18 + CSS Modules
- **Data Fetching**: GitHub GraphQL API (server-side)
- **Analytics**: Vercel Analytics 1.5.0
- **Caching**: ISR with 1-hour revalidation
- **Image Optimization**: Next.js Image component

### Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata and analytics
│   ├── page.tsx            # Home page with project documentation
│   ├── [username]/
│   │   ├── page.tsx        # Dynamic route: GitHub contribution graph
│   │   ├── loading.tsx     # Loading skeleton UI
│   │   ├── error.tsx       # Error boundary with user-friendly messages
│   │   ├── not-found.tsx   # 404 page for non-existent users
│   │   └── page.module.css # Contribution graph styles
│   └── globals.css         # Global Tailwind styles
└── utils.ts                # Core API fetching and data transformation logic
```

### Key Components and Data Flow

#### Dynamic Route: `[username]/page.tsx`
- Server component that renders the GitHub contribution graph
- Accepts URL params: `/:username?theme=dark|light`
- Theme defaults to 'dark' if not specified
- Fetches data server-side via `fetchContributions()`
- Returns null if username is missing
- Implements ISR caching with 1-hour revalidation (`revalidate = 3600`)
- Includes `generateMetadata()` for dynamic SEO tags
- Fully accessible with ARIA labels and roles

#### Core Utilities: `utils.ts`

**`fetchContributions(username, theme)`**
- Fetches contribution data from GitHub GraphQL API
- Validates username format using `validateUsername()` to prevent injection attacks
- Queries: `contributionsCollection.contributionCalendar.weeks`
- Maps contribution counts to levels (0-4) and theme-specific colors
- Comprehensive error handling for API errors, rate limits, and user not found
- Returns sorted array via `sortContributions()`
- Caching enabled via Next.js fetch cache (1-hour revalidation)

**`validateUsername(username)`**
- Validates GitHub username format using regex
- Prevents XSS and injection attacks
- Returns boolean indicating validity

**`sortContributions(contributions)`**
- Validates contributions array is not empty
- Calculates offset to align contributions to week boundaries (Sunday start)
- Slices last 364 days (minus offset) to show exactly 52 weeks
- Reorganizes data from chronological to column-major grid layout (7 rows × 52 columns)
- Fills empty cells with `undefined` for proper grid alignment
- Includes null checks to avoid runtime errors

**`getMonthList(contributions)`**
- Iterates through first 52 weeks (or less if contributions array is shorter)
- Detects month boundaries by comparing month values
- Returns array of months with `startAt` (column index) and `title` (short month name)
- Removes first month if too close to second month (< 2 columns apart)
- Includes null checks for undefined contributions

#### Color Palettes
- **Light theme**: Green shades from `#ebedf0` (no contributions) to `#216e39` (most active)
- **Dark theme**: Green shades from `#5f5f5f` (no contributions) to `#39d353` (most active)
- Levels 0-4 map to GitHub's contribution intensity scale

### TypeScript Configuration
- Path alias: `@/*` maps to `./src/*`
- Strict mode enabled
- Module resolution: bundler (Next.js specific)

### Styling Approach
- Tailwind CSS for utility classes (Home page, global styles)
- CSS Modules for component-specific styles (contribution graph grid)
- The contribution graph uses CSS Grid for layout with dynamic column positioning

## Important Implementation Details

1. **GitHub GraphQL API**: The app uses GitHub's official GraphQL API instead of web scraping, providing reliable and stable data access. The API has rate limits:
   - **Unauthenticated**: 60 requests/hour per IP
   - **Authenticated**: 5,000 requests/hour (not currently implemented)
   - Caching (1-hour revalidation) significantly reduces API calls

2. **Grid Layout Logic**: The contribution graph uses a complex column-major transformation in `sortContributions()` to render weeks vertically (7 days × 52 weeks). Changes to this logic require careful testing as it affects the visual layout.

3. **Date Handling**: All date calculations assume weeks start on Sunday (JavaScript default). The offset calculation relies on this convention.

4. **Server Components**: Pages are server components (async functions) with ISR caching. Data fetching happens server-side with 1-hour cache, reducing API calls and improving performance.

5. **Error Handling**: Comprehensive error boundaries handle:
   - Invalid username format (validated before API call)
   - User not found (404)
   - API errors and rate limits
   - Network failures

6. **Accessibility**: Full ARIA label support including:
   - `role="region"` for main container
   - `role="img"` for graph visualization
   - `role="gridcell"` for contribution squares
   - `aria-label` with descriptive text for screen readers

7. **SEO**: Dynamic metadata generation with username-specific titles and descriptions, Open Graph tags for social sharing.

8. **No Test Suite**: The project has no test framework configured. Manual testing is required for changes to data transformation logic.

9. **Responsive Design**: Known limitation - the widget is not fully responsive and may not display well on mobile devices.

## Deployment

The application is deployed on Vercel at `https://notion-github.vercel.app/`.

### Configuration
- **Image Optimization**: `next.config.mjs` includes remote patterns for imgur.com to allow Next.js Image optimization
- **ISR Caching**: Pages use Incremental Static Regeneration with 1-hour revalidation
- **API Caching**: GitHub API responses are cached via Next.js fetch cache

## Recent Updates (v0.2.0)

### Major Changes
1. **Migrated from web scraping to GitHub GraphQL API**
   - More reliable and officially supported
   - No risk of breaking when GitHub updates their HTML
   - Better error handling and rate limit management

2. **Next.js 15 Compatibility**
   - Updated params/searchParams to Promise-based API
   - Fixed breaking changes from Next.js 14 → 15

3. **Enhanced Error Handling**
   - Added error.tsx for graceful error display
   - Added not-found.tsx for 404 handling
   - User-friendly error messages for common issues

4. **Performance Optimizations**
   - ISR caching with 1-hour revalidation
   - Loading skeleton UI (loading.tsx)
   - Next.js Image component for optimized images

5. **Accessibility & SEO Improvements**
   - Full ARIA label support for screen readers
   - Dynamic metadata generation per username
   - Open Graph tags for social sharing

6. **Security Enhancements**
   - Username validation to prevent injection attacks
   - XSS protection via input sanitization

### Dependency Updates
- Next.js: 14.x → 15.5.6
- React: 18.x → 19.2.0
- eslint-config-next: 14.2.33 → 15.5.6
- Removed: cheerio (no longer needed)
