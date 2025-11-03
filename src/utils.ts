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

export interface Contribution {
  date: string;
  color: string;
  tooltip: string;
}

interface Month {
  startAt: number;
  title: string;
}

type Contributions = (Contribution | undefined)[];

type Level = '0' | '1' | '2' | '3' | '4';

export type Theme = 'light' | 'dark';

// GitHub GraphQL API response types
interface GitHubContributionDay {
  contributionCount: number;
  date: string;
}

interface GitHubWeek {
  contributionDays: GitHubContributionDay[];
}

interface GitHubAPIResponse {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: GitHubWeek[];
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

// Helper function to determine contribution level from count
function getContributionLevel(count: number): Level {
  if (count === 0) return '0';
  if (count <= 3) return '1';
  if (count <= 6) return '2';
  if (count <= 9) return '3';
  return '4';
}

// Validate GitHub username format
export function validateUsername(username: string): boolean {
  // GitHub username rules: alphanumeric and hyphens, 1-39 chars, no consecutive hyphens
  const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
  return usernameRegex.test(username);
}

// Fetches contributions data from GitHub GraphQL API
export async function fetchContributions(
  username: string,
  theme: Theme = 'dark',
): Promise<Contributions> {
  // Validate username to prevent injection
  if (!validateUsername(username)) {
    throw new Error('Invalid GitHub username format');
  }

  // Check for GitHub token
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    throw new Error('GitHub token not configured. Please set GITHUB_TOKEN environment variable.');
  }

  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${githubToken}`,
      },
      body: JSON.stringify({ query }),
      // Enable caching for better performance
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const result: GitHubAPIResponse = await response.json();

    // Check for GraphQL errors
    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0].message);
    }

    // Check if user exists
    if (!result.data?.user) {
      throw new Error('User not found');
    }

    const weeks = result.data.user.contributionsCollection.contributionCalendar.weeks;

    // Flatten all contribution days and format them
    const contributions: Contribution[] = weeks
      .flatMap((week) => week.contributionDays)
      .map((day) => {
        const level = getContributionLevel(day.contributionCount);
        return {
          date: day.date,
          color: PALETTE[theme][level],
          tooltip: `${day.contributionCount} contributions on ${new Date(day.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}`,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return sortContributions(contributions);
  } catch (error) {
    // Re-throw with more context
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch GitHub contributions');
  }
}

// Sorts and organizes the contributions into the correct order for display
export function sortContributions(
  contributions: Contribution[],
): Contributions {
  // Check if contributions array is empty
  if (contributions.length === 0) {
    return [];
  }

  // Calculate offset to align to Sunday (week start)
  const firstContribution = contributions[0];
  if (!firstContribution) {
    return [];
  }

  const offset = 6 - new Date(firstContribution.date).getDay();
  const pastYearContributions: Contributions = contributions
    .slice(0, 364 - offset)
    .reverse();

  // Add empty cells for offset
  for (let i = 0; i < offset; i++) {
    pastYearContributions.push(undefined);
  }

  const rearrangedContributions: Contributions = [];
  const totalRows = 7; // 7 days in a week

  // Reorganize the contributions into a column-major grid layout
  for (let i = 0; i < totalRows; i++) {
    for (let j = i; j < pastYearContributions.length; j += totalRows) {
      rearrangedContributions.push(pastYearContributions[j]);
    }
  }

  return rearrangedContributions;
}

// Function to generate a list of months with their start positions based on contributions data
export function getMonthList(contributions: Contributions): Month[] {
  let lastMonth: number | undefined;

  const monthsData: Month[] = [];

  // Loop through first 52 weeks and identify the start of new months
  const weeksToCheck = Math.min(52, contributions.length);

  for (let i = 0; i < weeksToCheck; i++) {
    const contribution = contributions[i];
    if (!contribution) {
      continue;
    }

    const date = new Date(contribution.date);
    const currentMonth = date.getMonth();

    // When a new month is detected, record its start position and name
    if (currentMonth !== lastMonth) {
      monthsData.push({
        startAt: i,
        title: date.toLocaleString('default', { month: 'short' }),
      });
      lastMonth = currentMonth;
    }
  }

  // Adjust the list if the first two months are too close (less than 2 columns apart)
  if (monthsData.length > 1 && monthsData[1].startAt - monthsData[0].startAt < 2) {
    monthsData.shift();
  }

  return monthsData;
}
