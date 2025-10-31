# Notion GitHub Tracker

A Next.js application that embeds GitHub contribution graphs into Notion pages with customizable themes.

## Introduction

Notion GitHub Tracker is a dynamic Next.js 15 application designed to seamlessly integrate GitHub user contribution data into Notion. This tool offers a convenient way to track and display GitHub contributions directly within a Notion page using GitHub's official GraphQL API.

## Live Deployment

The project is deployed at [https://notion-github-graph.vercel.app/](https://notion-github-graph.vercel.app/)

**URL Pattern:** `https://notion-github-graph.vercel.app/:username?theme=dark|light`

- Replace `:username` with any GitHub username
- Optional `theme` parameter: `dark` (default) or `light`

**Example:** [https://notion-github-graph.vercel.app/kossakovsky?theme=dark](https://notion-github-graph.vercel.app/kossakovsky?theme=dark)

### Screenshots

#### Dark theme
![Dark theme screenshot](https://i.imgur.com/hvSRiY1.png)

#### Light theme
![Light theme screenshot](https://i.imgur.com/4tNdzLW.png)

## Features

- **GitHub GraphQL API Integration** - Uses official GitHub API for reliable data fetching
- **Dual Theme Support** - Light and dark themes that match GitHub's color palette
- **Server-Side Rendering** - Fast initial page loads with Next.js SSR
- **ISR Caching** - 1-hour cache revalidation for optimal performance
- **Accessibility** - Full ARIA label support for screen readers
- **SEO Optimized** - Dynamic metadata generation with Open Graph tags
- **Error Handling** - User-friendly error messages for common issues
- **Loading States** - Skeleton UI with pulse animation

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kossakovsky/notion-github-graph.git
cd notion-github-graph
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Usage

### Standalone Usage

Navigate to the deployed URL with any GitHub username:

```
https://notion-github-graph.vercel.app/username?theme=dark
```

Parameters:
- `username` (required) - Any valid GitHub username
- `theme` (optional) - Either `dark` or `light` (defaults to `dark`)

### Notion Integration

To embed the contribution graph in Notion:

1. In your Notion page, type `/embed` and select "Embed" block
2. Paste the URL with your desired username:
   ```
   https://notion-github-graph.vercel.app/yourusername?theme=dark
   ```
3. Adjust the embed block size (recommended minimum width: 600px)
4. The graph will update automatically every hour via ISR caching

**Note:** Notion embeds may not display perfectly on mobile devices due to the fixed-width layout.

## Technical Stack

- **Framework:** Next.js 15.5.6 (App Router)
- **Runtime:** React 19.2.0
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.4.18 + CSS Modules
- **Data Source:** GitHub GraphQL API (unauthenticated)
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics

## Architecture

### Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   └── [username]/
│       ├── page.tsx            # Dynamic route for user graphs
│       ├── page.module.css     # Contribution graph styles
│       ├── loading.tsx         # Loading skeleton
│       └── error.tsx           # Error boundary
└── utils.ts                    # API and data transformation logic
```

### How It Works

1. **Data Fetching:** When you visit `/:username`, the app queries GitHub's GraphQL API for the user's contribution calendar
2. **Data Transformation:** Raw contribution data is transformed into a 52-week × 7-day grid layout
3. **Rendering:** Contributions are displayed as colored squares with hover tooltips
4. **Caching:** Results are cached for 1 hour using Next.js ISR (Incremental Static Regeneration)

## API Rate Limits

The application uses GitHub's **unauthenticated GraphQL API**, which has a rate limit of:

- **60 requests per hour per IP address**

The 1-hour ISR caching significantly reduces API calls. For higher rate limits (5,000 requests/hour), you can add GitHub authentication by modifying the fetch request in `src/utils.ts` to include an authorization header.

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Notes

- The project has no test suite configured - manual testing is required
- The grid layout logic in `sortContributions()` (utils.ts) is complex and critical - test thoroughly when modifying
- Server components use async/await for params (Next.js 15 requirement)

## Known Limitations

- **Not responsive** - Fixed-width grid doesn't adapt well to mobile screens
- **No authentication** - Limited to 60 API requests/hour per IP
- **52-week fixed display** - Always shows exactly one year of data
- **No contribution breakdown** - Shows total count only (no separation of commits, PRs, reviews)

## Changelog

### v0.2.0 (Current)

**Major Changes:**
- Migrated from web scraping to GitHub GraphQL API
- Upgraded to Next.js 15 and React 19
- Enhanced error handling with user-friendly messages
- Added loading skeleton UI
- Improved accessibility with full ARIA support
- Added dynamic SEO metadata
- Security: Username validation to prevent injection attacks

**Dependency Updates:**
- Next.js: 14.x → 15.5.6
- React: 18.x → 19.2.0
- Added: classnames, @vercel/analytics
- Removed: cheerio (no longer needed)

## License

[MIT](https://github.com/kossakovsky/notion-github-graph/blob/main/LICENSE)

## Contact

- **GitHub:** [kossakovsky](https://github.com/kossakovsky)
- **Telegram:** [@kossakovsky](https://t.me/kossakovsky)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Data from [GitHub GraphQL API](https://docs.github.com/en/graphql)
- Deployed on [Vercel](https://vercel.com/)
