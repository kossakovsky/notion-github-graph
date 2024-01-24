import cx from 'classnames';
import {
  getMonthList,
  getContributions,
  getContributionTooltip,
} from '@/utils';

import styles from './page.module.css';

// Define color palettes for light and dark themes
const PALETTE = {
  light: {
    '0': '#ebedf0',
    '1': '#9be9a8',
    '2': '#40c463',
    '3': '#30a14e',
    '4': '#216e39',
  },
  dark: {
    '0': '#5f5f5f',
    '1': '#0e4429',
    '2': '#006d32',
    '3': '#26a641',
    '4': '#39d353',
  },
};

// Type definition for theme options
type Theme = 'light' | 'dark';

// Type definition for component props
type Props = {
  params: { username?: string };
  searchParams: { theme?: Theme };
};

export default async function ContributionsGraph(props: Props) {
  // Destructure username from props; if not provided, exit function early
  const { username } = props.params;
  if (!username) return;

  // Destructure theme from props with 'dark' as the default value
  const { theme = 'dark' } = props.searchParams;

  // Fetch contributions data for the given username
  const contributions = await getContributions(username);

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
            {contributions.map((contribution) => (
              <div
                key={contribution.date}
                // Apply background color based on the intensity of the contribution and theme
                style={{ background: PALETTE[theme][contribution.intensity] }}
                className={styles.contribution}
                // Set custom tooltip data attribute for each contribution
                data-tooltip={getContributionTooltip(contribution)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
