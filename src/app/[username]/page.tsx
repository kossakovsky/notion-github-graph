import cx from 'classnames';
import { Theme, getMonthList, fetchContributions } from '@/utils';

import styles from './page.module.css';

// Type definition for component props
type Props = {
  params: { username?: string };
  searchParams: { theme?: Theme };
};

export default async function ContributionsGraph(props: Props) {
  // Destructure username from props; if not provided, exit function early
  const { username } = props.params;
  if (!username) return; // Exits if username is not provided

  // Destructure theme from props, defaulting to 'dark' if not specified
  const { theme } = props.searchParams;

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
    >
      <div className={styles.widget}>
        {/* Map over the monthsList to display month labels */}
        <div className={styles.month}>
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
        <div className={styles.graph}>
          {/* Static labels for weekdays */}
          <div className={styles.week}>
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
                />
              ) : (
                <div key={i} />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
