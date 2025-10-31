import cx from 'classnames';
import { Theme, getMonthList, fetchContributions } from '@/utils';
import { Metadata } from 'next';

import styles from './page.module.css';

// Revalidate cached data every hour (3600 seconds)
export const revalidate = 3600;

// Type definition for component props
type Props = {
  params: Promise<{ username?: string }>;
  searchParams: Promise<{ theme?: Theme }>;
};

// Generate dynamic metadata for SEO
export async function generateMetadata(props: Props): Promise<Metadata> {
  const { username } = await props.params;

  if (!username) {
    return {
      title: 'GitHub Contributions Tracker',
      description: 'Track GitHub contributions graph',
    };
  }

  return {
    title: `${username}'s GitHub Contributions`,
    description: `View ${username}'s GitHub contribution graph and activity over the past year. Track contributions, commits, and coding activity on GitHub.`,
    keywords: [
      'GitHub',
      'contributions',
      username,
      'activity',
      'graph',
      'commits',
      'coding',
    ],
    openGraph: {
      title: `${username}'s GitHub Contributions`,
      description: `View ${username}'s GitHub contribution graph and activity`,
      type: 'website',
    },
  };
}

export default async function ContributionsGraph(props: Props) {
  // Destructure username from props; if not provided, exit function early
  const { username } = await props.params;
  if (!username) return null; // Exits if username is not provided

  // Destructure theme from props, defaulting to 'dark' if not specified
  const { theme } = await props.searchParams;

  // Fetch contributions data for the specified username and theme
  const contributions = await fetchContributions(username, theme);

  // Retrieve the list of months with start positions from the contributions data
  const monthsList = getMonthList(contributions);

  return (
    <div
      // Use classnames helper function to conditionally apply styles based on the theme
      className={cx({
        [styles.wrapper]: true,
        [styles.dark]: theme === 'dark',
      })}
      role="region"
      aria-label={`${username}'s GitHub contribution graph`}
    >
      <div className={styles.widget}>
        {/* Map over the monthsList to display month labels */}
        <div className={styles.month} aria-label="Month labels">
          {monthsList.map((month, key) => (
            <div
              key={key}
              // Set the CSS grid position for the month label
              style={{
                gridColumnStart: month.startAt + 1,
                gridColumnEnd: month.startAt + 1,
              }}
            >
              {month.title}
            </div>
          ))}
        </div>
        <div className={styles.graph} role="img" aria-label="Contribution activity graph">
          {/* Static labels for weekdays */}
          <div className={styles.week} aria-label="Day of week labels">
            <div>Mon</div>
            <div>Wed</div>
            <div>Fri</div>
          </div>
          {/* Map over the contributions to display as grid items */}
          <div className={styles.contributions}>
            {contributions.map((contribution, i) =>
              contribution ? (
                <div
                  key={contribution.date}
                  // Styles each square based on contribution intensity and theme
                  style={{ background: contribution.color }}
                  className={styles.contribution}
                  // Adds a custom tooltip for each contribution
                  data-tooltip={contribution.tooltip}
                  aria-label={contribution.tooltip}
                  role="gridcell"
                />
              ) : (
                <div key={i} aria-hidden="true" />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
