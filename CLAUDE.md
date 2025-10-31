# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Notion GitHub Tracker is a Next.js 15 application that embeds GitHub contribution graphs into Notion pages. It uses the GitHub GraphQL API (unauthenticated) to fetch contribution data and renders it as an embeddable widget with light/dark theme support.

## Development Commands

```bash
# Install dependencies
npm install

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
- **Data Fetching**: GitHub GraphQL API (unauthenticated, server-side)
- **Utilities**: classnames 2.5.1
- **Analytics**: Vercel Analytics 1.5.0
- **Caching**: ISR with 1-hour revalidation
- **Image Optimization**: Next.js Image component

### Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Inter font, metadata, analytics
│   ├── page.tsx                # Home page with documentation and examples
│   ├── globals.css             # Tailwind directives and global styles
│   └── [username]/
│       ├── page.tsx            # Dynamic route: GitHub contribution graph
│       ├── page.module.css     # Contribution graph styles (CSS Grid)
│       ├── loading.tsx         # Loading skeleton UI with pulse animation
│       └── error.tsx           # Client-side error boundary
└── utils.ts                    # Core API fetching and data transformation
```

### Key Components and Data Flow

#### Root Layout: `app/layout.tsx`
- Applies Inter font from next/font/google
- Sets global metadata (title, description, keywords)
- Includes Vercel Analytics component
- All pages inherit this layout

#### Home Page: `app/page.tsx`
- Static documentation page with Tailwind utility classes
- Shows usage examples, screenshots, and integration instructions
- Uses Next.js Image component for optimized images from imgur.com

#### Dynamic Route: `[username]/page.tsx`
- **Server component** (async function) that renders GitHub contribution graph
- Accepts URL pattern: `/:username?theme=dark|light`
- Theme defaults to 'dark' if not specified
- Uses Promise-based params/searchParams (Next.js 15 requirement)
- Fetches data server-side via `fetchContributions(username, theme)`
- Returns `null` if username is missing (no error thrown)
- Implements ISR caching: `export const revalidate = 3600` (1 hour)
- Includes `generateMetadata()` for dynamic SEO tags per username
- Fully accessible with ARIA labels and semantic roles
- Renders month labels and 52-week × 7-day contribution grid

#### Loading State: `[username]/loading.tsx`
- Client component showing skeleton UI
- Displays 364 placeholder cells with pulse animation
- Uses inline `<style jsx>` for keyframe animation

#### Error Boundary: `[username]/error.tsx`
- **Client component** ('use client' directive required)
- Handles different error types with custom messages:
  - "User not found" → User-friendly 404 message
  - "Invalid GitHub username" → Format validation error
  - "rate limit" → API quota exceeded
  - Default → Generic error message
- Provides "Try Again" button to retry (calls `reset()`)
- Styled with inline styles (dark theme)

#### Core Utilities: `utils.ts`

**`fetchContributions(username, theme)`**
- Fetches contribution data from GitHub GraphQL API (unauthenticated)
- Validates username format using `validateUsername()` to prevent GraphQL injection
- GraphQL query: `user(login: "...")` → `contributionsCollection.contributionCalendar.weeks`
- No authentication token (subject to 60 requests/hour rate limit per IP)
- Maps contribution counts to levels (0-4) using `getContributionLevel()`
- Assigns theme-specific colors from `PALETTE` constant
- Sorts contributions by date (newest first), then calls `sortContributions()`
- Comprehensive error handling:
  - HTTP errors (non-200 status)
  - GraphQL errors in response
  - User not found (null user)
  - Network failures
- Caching: `next: { revalidate: 3600 }` in fetch options
- Returns `Contributions` type (array with possible `undefined` values)

**`validateUsername(username)`**
- Validates GitHub username format using regex: `/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/`
- Rules enforced:
  - 1-39 characters
  - Alphanumeric and hyphens only
  - Must start with alphanumeric
  - No consecutive hyphens
- Prevents XSS and GraphQL injection attacks
- Returns boolean

**`getContributionLevel(count)`**
- Maps contribution counts to intensity levels:
  - 0 contributions → '0'
  - 1-3 → '1'
  - 4-6 → '2'
  - 7-9 → '3'
  - 10+ → '4'
- Returns `Level` type ('0' | '1' | '2' | '3' | '4')

**`sortContributions(contributions)`**
- **Critical transformation function** for grid layout
- Returns empty array if input is empty
- Calculates offset to align to Sunday (week start):
  - Formula: `offset = 6 - new Date(firstContribution.date).getDay()`
  - Assumes JavaScript convention: Sunday = 0, Saturday = 6
- Slices last `364 - offset` days and reverses to chronological order
- Adds `offset` number of `undefined` values to align grid
- Reorganizes from chronological to **column-major grid layout**:
  - Input: 364 days in chronological order
  - Output: 7 rows × 52 columns (364 cells)
  - Algorithm: nested loops transpose row-major to column-major
- This transformation is necessary for CSS Grid `grid-template-columns: repeat(52, 10px)`
- Returns `Contributions` type (can contain `undefined`)

**`getMonthList(contributions)`**
- Generates month labels for the contribution graph
- Iterates through first 52 weeks (or fewer if array is shorter)
- Detects month boundaries by comparing `date.getMonth()`
- Stores month start position (`startAt`) and short name (`title`)
- Post-processing: removes first month if within 2 columns of second month
- Handles `undefined` contributions with null checks
- Returns `Month[]` array with `{ startAt: number, title: string }`

#### Color Palettes (PALETTE constant)
- **Light theme**: Green shades from `#ebedf0` (level 0) to `#216e39` (level 4)
- **Dark theme**: Green shades from `#5f5f5f` (level 0) to `#39d353` (level 4)
- Matches GitHub's official contribution intensity scale

### Styling Architecture

**CSS Modules (`page.module.css`)**
- `.wrapper`: Grid layout with light/dark theme variants
  - Light: `background-color: white; color: #191919`
  - Dark: `background-color: #191919; color: #d4d4d4`
- `.month`: Grid for month labels (52 columns, 3px gap, 10px cells)
- `.graph`: Flex row container for week labels + contribution grid
- `.week`: Flex column for Mon/Wed/Fri labels
- `.contributions`: CSS Grid with `repeat(52, 10px)` columns and `repeat(7, 10px)` rows
- `.contribution`: Individual 10×10px square with hover tooltip
- Tooltip implementation: `::before` pseudo-element with `attr(data-tooltip)`
- Arrow implementation: `::after` pseudo-element with CSS triangles

**Tailwind CSS**
- Used for Home page (`app/page.tsx`) with utility classes
- Configured via `tailwind.config.ts` (default setup, no custom extensions)
- Global styles in `app/globals.css` (Tailwind directives only)

### TypeScript Configuration
- Target: ES2022
- Module resolution: bundler (Next.js specific)
- Strict mode: enabled
- Path alias: `@/*` → `./src/*`
- JSX: preserve (handled by Next.js)

## Important Implementation Details

1. **GitHub GraphQL API (Unauthenticated)**
   - No API token configured (public endpoint)
   - Rate limits: **60 requests/hour per IP**
   - ISR caching (1-hour revalidation) significantly reduces API calls
   - To add authentication: add `Authorization: bearer <token>` header (increases limit to 5,000/hour)

2. **Grid Layout Logic**
   - The contribution graph uses **column-major transformation** in `sortContributions()` (utils.ts:159-194)
   - Critical for rendering 52 weeks vertically (7 days per column)
   - Changes to this logic will break the visual layout
   - Test thoroughly when modifying offset or grid calculations

3. **Date Handling**
   - All calculations assume **Sunday = week start** (JavaScript `getDay()` convention)
   - Offset formula depends on this: `offset = 6 - getDay()`
   - Changing week start day requires refactoring offset logic

4. **Server vs Client Components**
   - Server components: `layout.tsx`, `page.tsx`, `[username]/page.tsx`
   - Client components: `error.tsx` (requires 'use client'), `loading.tsx` (uses JSX styles)
   - Next.js 15 requirement: params and searchParams are Promises (must await)

5. **Error Handling**
   - Username validation happens **before** API call (prevents invalid requests)
   - Error boundary (`error.tsx`) provides user-friendly messages for:
     - Invalid username format
     - User not found (404)
     - Rate limit exceeded
     - Network failures
   - Errors are logged to console via `useEffect`

6. **Accessibility**
   - ARIA roles: `role="region"`, `role="img"`, `role="gridcell"`
   - ARIA labels: descriptive text for screen readers on all interactive elements
   - Tooltip text: `data-tooltip` attribute with contribution count and date
   - Semantic HTML structure

7. **SEO**
   - Root metadata: `layout.tsx` (global title, description, keywords)
   - Dynamic metadata: `[username]/page.tsx` via `generateMetadata()`
   - Open Graph tags for social sharing (title, description, type)
   - Per-username titles: "{username}'s GitHub Contributions"

8. **No Test Suite**
   - No test framework configured (no Jest, Vitest, or testing libraries)
   - Manual testing required for:
     - Data transformation logic (`sortContributions`, `getMonthList`)
     - Grid layout rendering
     - Theme switching
     - Error states

9. **Responsive Design**
   - **Known limitation**: widget is not responsive
   - Fixed-width grid: 52 columns × 10px = 520px minimum
   - May overflow or render poorly on mobile devices
   - Notion embeds have limited responsive capabilities

10. **Dependencies**
    - Production: next, react, react-dom, classnames, @vercel/analytics
    - Dev: typescript, tailwindcss, postcss, autoprefixer, eslint, @types/*
    - **Removed in v0.2.0**: cheerio (no longer needed after migrating from web scraping)

## Deployment

- **Platform**: Vercel
- **URL**: https://notion-github-graph.vercel.app/
- **Configuration**:
  - `next.config.mjs`: Remote image patterns for imgur.com
  - ISR caching: 1-hour revalidation (`revalidate = 3600`)
  - No environment variables required (unauthenticated API)
  - No build-time secrets

## Usage Patterns

**URL Structure**
- Home: `https://notion-github-graph.vercel.app/`
- User graph: `https://notion-github-graph.vercel.app/:username`
- With theme: `https://notion-github-graph.vercel.app/:username?theme=light`
- Default theme: dark

**Notion Integration**
1. Create Embed block in Notion
2. Paste URL with username: `https://notion-github-graph.vercel.app/username?theme=dark`
3. Adjust embed size (recommended: 600px wide minimum)

## Recent Updates (v0.2.0)

### Major Changes
1. **Migrated from web scraping to GitHub GraphQL API**
   - Uses official API instead of parsing HTML
   - More reliable (no HTML structure dependencies)
   - Better error handling and rate limit awareness
   - Added username validation to prevent injection

2. **Next.js 15 Compatibility**
   - Updated params/searchParams to Promise-based API (`await props.params`)
   - Fixed breaking changes from Next.js 14 → 15
   - Updated React 18 → 19

3. **Enhanced Error Handling**
   - Added `error.tsx` for client-side error boundary
   - User-friendly error messages (no technical jargon)
   - "Try Again" retry functionality
   - Console logging for debugging

4. **Performance Optimizations**
   - ISR caching with 1-hour revalidation
   - Loading skeleton UI (`loading.tsx`)
   - Next.js Image component for optimized images on home page

5. **Accessibility & SEO Improvements**
   - Full ARIA label support for screen readers
   - Dynamic metadata generation per username
   - Open Graph tags for social sharing previews

6. **Security Enhancements**
   - Username validation regex to prevent GraphQL injection
   - XSS protection via input sanitization

### Dependency Updates
- Next.js: 14.x → 15.5.6
- React: 18.x → 19.2.0
- React-DOM: 18.x → 19.2.0
- eslint-config-next: 14.2.33 → 15.5.6
- Added: classnames 2.5.1
- Removed: cheerio (no longer needed)

## Known Issues & Limitations

1. **Not responsive** - fixed-width grid doesn't adapt to mobile screens
2. **No authentication** - limited to 60 API requests/hour per IP
3. **No not-found.tsx** - CLAUDE.md incorrectly referenced this file (it doesn't exist)
4. **No custom 404 handling** - relies on Next.js default behavior when user not found
5. **Fixed 52-week display** - always shows exactly 52 weeks, no customization
6. **No contribution type breakdown** - shows total count only (no commits vs PRs vs reviews)
