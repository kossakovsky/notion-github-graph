import { load, Element, CheerioAPI } from 'cheerio';

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

// Function to format a single contribution element from the GitHub contributions calendar
function formatContribution($: CheerioAPI, td: Element, theme: Theme = 'dark') {
  return {
    date: td.attribs['data-date'],
    color: PALETTE[theme][td.attribs['data-level'] as Level],
    tooltip: $(`[for="${td.attribs.id}"]`).text(),
  };
}

// Fetches contributions data from GitHub and formats it
export async function fetchContributions(
  username: string,
  theme: Theme = 'dark',
): Promise<Contributions> {
  const data = await fetch(`https://github.com/${username}`);
  const $ = load(await data.text());

  // Parses the HTML to find contribution elements and maps them to formatted contributions
  const contributions = $(
    '.graph-before-activity-overview td.ContributionCalendar-day',
  )
    .get()
    .map((td) => formatContribution($, td, theme))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return sortContributions(contributions);
}

// Sorts and organizes the contributions into the correct order for display
export function sortContributions(
  contributions: Contribution[],
): Contributions {
  const offset = 6 - new Date(contributions[0].date).getDay();
  const pastYearContributions: Contributions = contributions
    .slice(0, 364 - offset)
    .reverse();

  for (let i = 0; i < offset; i++) {
    pastYearContributions.push(undefined);
  }

  const rearrangedContributions = [];
  const totalRows = 7;

  // Reorganize the contributions into a grid layout
  for (let i = 0; i < totalRows; i++) {
    for (let j = i; j < pastYearContributions.length; j += totalRows) {
      rearrangedContributions.push(pastYearContributions[j]);
    }
  }

  return rearrangedContributions;
}

// Function to generate a list of months with their start positions based on contributions data
export function getMonthList(contributions: Contributions): Month[] {
  let lastMonth;

  const monthsData = [];

  // Loop through each week and identify the start of new months
  for (let i = 0; i < 52; i++) {
    if (!contributions[i]) {
      continue;
    }

    const date = new Date(contributions[i]!.date);
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

  // Adjust the list if the first two months are too close to each other
  if (monthsData.length > 1 && monthsData[1].startAt - monthsData[0].startAt < 2) {
    monthsData.shift();
  }

  return monthsData;
}
