# Notion GitHub Tracker

## Introduction

Notion GitHub Tracker is a dynamic Next.js application designed to seamlessly integrate GitHub user data into Notion. This tool offers a convenient way to track and display GitHub contributions directly within a Notion page.

## Live Deployment

The project is deployed and can be accessed at [Notion GitHub Tracker](https://notion-github.vercel.app/kossakovsky?theme=dark). Simply replace `:username` with your GitHub username and optionally specify the theme (`light` or `dark`, with `dark` being the default).

Example: `https://notion-github.vercel.app/kossakovsky?theme=dark`

### Dark theme

![dark theme](https://i.imgur.com/hvSRiY1.png)

### Light theme

![light theme](https://i.imgur.com/4tNdzLW.png)

## Getting Started

To run the development server locally:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Installation and Setup

1. Clone the repository.
2. Install dependencies using `npm install` or `yarn install`.
3. Start the development server as mentioned above.

## Usage

The project allows users to view GitHub contribution data directly on Notion. Follow these steps to use it:

1. Navigate to the deployed URL: `https://notion-github.vercel.app/:username?theme=dark`.
2. Replace `:username` with your GitHub username.
3. Choose the theme by setting `theme=dark` or `theme=light` in the URL.

### Notion Integration

To embed this in Notion:

1. Create a new Embed block in your Notion document.
2. Set the URL to the deployed project URL with your GitHub username.
3. Adjust the size of the embed block as needed.

## Contributing

Contributions to improve Notion GitHub Tracker are welcome. Feel free to fork the repository, make changes, and submit a pull request.

## Known Caveats

- Not fully responsive, which may affect the display on mobile devices.
- Limited theme adaptability in Notion embeds due to Notion's current API constraints.

## License
[MIT](https://github.com/kossakovsky/notion-github-graph/blob/main/LICENSE)

## Contact

[Github](https://github.com/kossakovsky) [Telegram](https://t.me/kossakovsky)

