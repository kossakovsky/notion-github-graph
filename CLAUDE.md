# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Notion GitHub Tracker is a Next.js 15 application that embeds GitHub contribution graphs into Notion pages. It scrapes GitHub profile pages to extract contribution data and renders it as an embeddable widget with light/dark theme support.

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
- **Data Fetching**: Server-side scraping with Cheerio 1.1.2
- **Analytics**: Vercel Analytics 1.5.0

### Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata and analytics
│   ├── page.tsx            # Home page with project documentation
│   ├── [username]/
│   │   ├── page.tsx        # Dynamic route: GitHub contribution graph
│   │   └── page.module.css # Contribution graph styles
│   └── globals.css         # Global Tailwind styles
└── utils.ts                # Core scraping and data transformation logic
```

### Key Components and Data Flow

#### Dynamic Route: `[username]/page.tsx`
- Server component that renders the GitHub contribution graph
- Accepts URL params: `/:username?theme=dark|light`
- Theme defaults to 'dark' if not specified
- Fetches data server-side via `fetchContributions()`
- Returns early if username is missing

#### Core Utilities: `utils.ts`

**`fetchContributions(username, theme)`**
- Scrapes `https://github.com/${username}` for contribution data
- Uses Cheerio to parse HTML and extract elements with selector: `.graph-before-activity-overview td.ContributionCalendar-day`
- Extracts: date (`data-date`), level (`data-level` 0-4), tooltip text
- Maps contribution levels to theme-specific colors from PALETTE constant
- Returns sorted array via `sortContributions()`

**`sortContributions(contributions)`**
- Calculates offset to align contributions to week boundaries (Sunday start)
- Slices last 364 days (minus offset) to show exactly 52 weeks
- Reorganizes data from chronological to column-major grid layout (7 rows × 52 columns)
- Fills empty cells with `undefined` for proper grid alignment

**`getMonthList(contributions)`**
- Iterates through first 52 weeks to detect month boundaries
- Returns array of months with `startAt` (column index) and `title` (short month name)
- Removes first month if too close to second month (< 2 columns apart)

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

1. **Web Scraping Fragility**: The app depends on GitHub's HTML structure for `.graph-before-activity-overview` and `.ContributionCalendar-day` classes. If GitHub changes their markup, `fetchContributions()` in utils.ts:52-64 will break.

2. **Grid Layout Logic**: The contribution graph uses a complex column-major transformation in `sortContributions()` to render weeks vertically (7 days × 52 weeks). Changes to this logic require careful testing.

3. **Date Handling**: All date calculations assume weeks start on Sunday (JavaScript default). The offset calculation in utils.ts:70 relies on this convention.

4. **Server Components**: All pages are server components (async functions). Data fetching happens server-side, so GitHub scraping doesn't expose the user's IP.

5. **No Test Suite**: The project has no test framework configured. Manual testing is required for changes to data transformation logic.

6. **Responsive Design**: Known limitation - the widget is not fully responsive and may not display well on mobile devices.

## Deployment

The application is deployed on Vercel at `https://notion-github.vercel.app/`. The deployment configuration is standard Next.js (no custom settings in next.config.mjs).
