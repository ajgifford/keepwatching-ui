/**
 * A single data point used by Recharts bar and pie chart components.
 * Additional numeric or string fields may be present for multi-series charts.
 */
export interface ChartDataItem {
  /** Display name for the data point (e.g., genre name, service name). */
  name: string;
  /** Numeric value for the data point. */
  value: number;
  [key: string]: string | number;
}

/**
 * A record mapping genre names to their occurrence counts.
 * @example `{ "Drama": 42, "Comedy": 18 }`
 */
export interface GenreDistribution {
  [genre: string]: number;
}

/**
 * A record mapping streaming service names to their occurrence counts.
 * @example `{ "Netflix": 30, "Hulu": 15 }`
 */
export interface ServiceDistribution {
  [service: string]: number;
}

/**
 * Converts a genre or service distribution record to a sorted array of
 * {@link ChartDataItem} objects ready for use in Recharts components.
 * Entries with blank or whitespace-only names are excluded.
 * @param distribution - Genre or service distribution to convert.
 * @param limit - Maximum number of items to return, ordered by descending count. Defaults to `6`.
 * @returns Array of chart data items, largest first, capped at `limit`.
 */
export function convertToChartData(
  distribution: GenreDistribution | ServiceDistribution,
  limit: number = 6
): ChartDataItem[] {
  return Object.entries(distribution)
    .filter(([value]) => value && value.trim() !== '')
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/**
 * Returns the name of the highest-count item in a distribution record.
 * @param distribution - Genre or service distribution to inspect.
 * @returns The key with the highest value, or `"None"` if the distribution is empty.
 */
export function getTopItem(distribution: GenreDistribution | ServiceDistribution): string {
  if (Object.keys(distribution).length === 0) return 'None';

  const topItem = Object.entries(distribution).sort((a, b) => b[1] - a[1])[0];

  return topItem[0];
}

/**
 * Returns the percentage share (0–100, rounded) of the highest-count item
 * in a distribution record relative to the provided total.
 * @param distribution - Genre or service distribution to inspect.
 * @param total - The total count used as the denominator.
 * @returns Rounded percentage, or `0` if `total` is zero or the distribution is empty.
 */
export function getTopItemPercentage(distribution: GenreDistribution | ServiceDistribution, total: number): number {
  if (total === 0 || Object.keys(distribution).length === 0) return 0;

  const topItem = Object.entries(distribution).sort((a, b) => b[1] - a[1])[0];

  return Math.round((topItem[1] / total) * 100);
}
