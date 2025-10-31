import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-gray-100 text-gray-900 font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Notion GitHub Tracker</h1>

        <h2 className="text-2xl font-semibold mt-6">Introduction</h2>
        <p className="mt-2">
          Notion GitHub Tracker is a dynamic Next.js application designed to
          seamlessly integrate GitHub user data into Notion. This tool offers a
          convenient way to track and display GitHub contributions directly
          within a Notion page.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Live Deployment</h2>
        <p className="mt-2">
          The project is deployed and can be accessed at{' '}
          <a
            href="https://notion-github.vercel.app/kossakovsky?theme=dark"
            className="text-blue-500 hover:text-blue-700"
          >
            Notion GitHub Tracker
          </a>
          . Simply replace <code>:username</code> with your GitHub username and
          optionally specify the theme (<code>light</code> or <code>dark</code>,
          with <code>dark</code> being the default).
        </p>
        <p className="mt-2">
          Example:{' '}
          <a
            href="https://notion-github.vercel.app/kossakovsky?theme=dark"
            className="text-blue-500 hover:text-blue-700"
          >
            https://notion-github.vercel.app/kossakovsky?theme=dark
          </a>
        </p>

        <h3 className="text-xl font-semibold mt-6">Dark theme</h3>
        <Image
          src="https://i.imgur.com/hvSRiY1.png"
          alt="Dark theme screenshot of GitHub contribution graph"
          width={800}
          height={400}
          className="mt-4 shadow-lg"
          priority
        />

        <h3 className="text-xl font-semibold mt-6">Light theme</h3>
        <Image
          src="https://i.imgur.com/4tNdzLW.png"
          alt="Light theme screenshot of GitHub contribution graph"
          width={800}
          height={400}
          className="mt-4 shadow-lg"
        />

        <h2 className="text-2xl font-semibold mt-6">Getting Started</h2>
        <p className="mt-2">To run the development server locally:</p>
        <pre className="bg-gray-200 text-gray-700 p-4 rounded">
          <code>{`npm run dev\n# or\nyarn dev\n# or\npnpm dev\n# or\nbun dev`}</code>
        </pre>
        <p className="mt-2">
          Visit{' '}
          <a
            href="http://localhost:3000"
            className="text-blue-500 hover:text-blue-700"
          >
            http://localhost:3000
          </a>{' '}
          in your browser to view the application.
        </p>

        <h3 className="text-xl font-semibold mt-6">Installation and Setup</h3>
        <ol className="list-decimal list-inside ml-6">
          <li>Clone the repository.</li>
          <li>
            Install dependencies using <code>npm install</code> or{' '}
            <code>yarn install</code>.
          </li>
          <li>Start the development server as mentioned above.</li>
        </ol>

        <h2 className="text-2xl font-semibold mt-6">Usage</h2>
        <p className="mt-2">
          The project allows users to view GitHub contribution data directly on
          Notion. Follow these steps to use it:
        </p>
        <ol className="list-decimal list-inside ml-6">
          <li>
            Navigate to the deployed URL:{' '}
            <a
              href="https://notion-github.vercel.app/:username?theme=dark"
              className="text-blue-500 hover:text-blue-700"
            >
              https://notion-github.vercel.app/:username?theme=dark
            </a>
            .
          </li>
          <li>
            Replace <code>:username</code> with your GitHub username.
          </li>
          <li>
            Choose the theme by setting <code>theme=dark</code> or{' '}
            <code>theme=light</code> in the URL.
          </li>
        </ol>

        <h3 className="text-xl font-semibold mt-6">Notion Integration</h3>
        <p className="mt-2">To embed this in Notion:</p>
        <ol className="list-decimal list-inside ml-6">
          <li>Create a new Embed block in your Notion document.</li>
          <li>
            Set the URL to the deployed project URL with your GitHub username.
          </li>
          <li>Adjust the size of the embed block as needed.</li>
        </ol>

        <h2 className="text-2xl font-semibold mt-6">Contributing</h2>
        <p className="mt-2">
          Contributions to improve Notion GitHub Tracker are welcome. Feel free
          to fork the repository, make changes, and submit a pull request.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Known Caveats</h2>
        <ul className="list-disc list-inside ml-6">
          <li>
            Not fully responsive, which may affect the display on mobile
            devices.
          </li>
          <li>
            Limited theme adaptability in Notion embeds due to Notion&apos;s
            current API constraints.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">License</h2>
        <p className="mt-2">
          <a
            href="https://github.com/kossakovsky/notion-github-graph/blob/main/LICENSE"
            className="text-blue-500 hover:text-blue-700"
          >
            MIT
          </a>
        </p>

        <h2 className="text-2xl font-semibold mt-6">Contact</h2>
        <p className="mt-2">
          <a
            href="https://github.com/kossakovsky"
            className="text-blue-500 hover:text-blue-700"
          >
            Github
          </a>{' '}
          <a
            href="https://t.me/kossakovsky"
            className="text-blue-500 hover:text-blue-700"
          >
            Telegram
          </a>
        </p>
      </div>
    </div>
  );
}
