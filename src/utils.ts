export interface Contribution {
  date: string;
  count: number;
  color: string;
  intensity: '0' | '1' | '2' | '3' | '4';
}

interface Month {
  startAt: number;
  title: string;
}

// Fetches contributions data from a third-party GitHub contributions service
export async function getContributions(
  username: string,
): Promise<Contribution[]> {
  const { contributions } = await fetch(
    `https://github-contributions.now.sh/api/v1/${username}`,
  ).then((res) => res.json());

  return getPastYearContributions(contributions);
}

// Finds the index of the current date within the contributions data
export function findCurrentDateIndex(contributions: Contribution[]): number {
  const currentDate = new Date().toISOString().split('T')[0];

  return contributions.findIndex((c) => c.date === currentDate);
}

// Retrieves contributions for the past year, restructured into a week-by-week format
export function getPastYearContributions(
  contributions: Contribution[],
): Contribution[] {
  const currentDateIndex = findCurrentDateIndex(contributions);
  const offset = 6 - new Date(contributions[currentDateIndex].date).getDay();

  const pastYearContributions = contributions
    .slice(currentDateIndex - offset, currentDateIndex + 364 - offset)
    .reverse();

  const rearrangedContributions = [];
  const totalRows = 7;

  for (let i = 0; i < totalRows; i++) {
    for (let j = i; j < pastYearContributions.length; j += totalRows) {
      rearrangedContributions.push(pastYearContributions[j]);
    }
  }

  return rearrangedContributions;
}

// Generates a list of months based on the contributions data
export function getMonthList(contributions: Contribution[]): Month[] {
  let lastMonth;

  const monthsData = [];

  for (let i = 0; i < 52; i++) {
    const date = new Date(contributions[i].date);
    const currentMonth = date.getMonth();

    if (currentMonth !== lastMonth) {
      monthsData.push({
        startAt: i,
        title: date.toLocaleString('default', { month: 'short' }),
      });
      lastMonth = currentMonth;
    }
  }

  // Adjust the list if the first two months are too close to each other
  if (monthsData[1].startAt - monthsData[0].startAt < 2) {
    monthsData.shift();
  }

  return monthsData;
}

// Provides a tooltip message for each contribution cell
export function getContributionTooltip(contribution: Contribution): string {
  // if (contribution.count === 0) {
  //   return `No contributions on ${contribution.date}`;
  // }

  return contribution.date;
}
