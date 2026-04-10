import { useMemo } from 'react';

import { WatchStatusDataItem } from '../elements';
import { ChartDataItem, convertToChartData } from './distributionTypes';
import { AccountStatisticsResponse, ProfileStatisticsResponse } from '@ajgifford/keepwatching-types';

/**
 * React hook that derives chart-ready data from account or profile statistics.
 *
 * Returns three memoised arrays:
 * - `watchStatusData` — per-content-type watch status counts for the
 *   {@link WatchStatusChart} component.
 * - `genreData` — combined show and movie genre distribution for pie/bar charts,
 *   capped at the top 6 genres.
 * - `serviceData` — combined show and movie streaming service distribution for
 *   pie/bar charts, capped at the top 8 services.
 *
 * All arrays are recalculated only when `statistics` changes.
 *
 * @param statistics - Account or profile statistics, or `null`/`undefined` while loading.
 * @returns Object with `watchStatusData`, `genreData`, and `serviceData` arrays.
 */
export function useStatisticsData(
  statistics: AccountStatisticsResponse | ProfileStatisticsResponse | null | undefined
) {
  const watchStatusData = useMemo((): WatchStatusDataItem[] => {
    if (!statistics) return [];

    const showCounts = statistics.showStatistics.watchStatusCounts;
    const movieCounts = statistics.movieStatistics.watchStatusCounts;

    return [
      {
        name: 'Shows',
        watched: showCounts.watched || 0,
        watching: showCounts.watching || 0,
        notWatched: showCounts.notWatched || 0,
        upToDate: showCounts.upToDate || 0,
        unaired: showCounts.unaired || 0,
      },
      {
        name: 'Movies',
        watched: movieCounts.watched || 0,
        notWatched: movieCounts.notWatched || 0,
        unaired: movieCounts.unaired || 0,
      },
    ];
  }, [statistics]);

  const genreData = useMemo((): ChartDataItem[] => {
    if (!statistics) return [];

    const showGenres = statistics.showStatistics.genreDistribution;
    const combinedGenres: Record<string, number> = { ...showGenres };

    if (statistics.movieStatistics.genreDistribution) {
      Object.entries(statistics.movieStatistics.genreDistribution).forEach(([genre, count]) => {
        if (genre !== '') {
          combinedGenres[genre] = (combinedGenres[genre] || 0) + count;
        }
      });
    }

    return convertToChartData(combinedGenres);
  }, [statistics]);

  const serviceData = useMemo((): ChartDataItem[] => {
    if (!statistics) return [];

    const showServices = statistics.showStatistics.serviceDistribution;
    const combinedServices: Record<string, number> = { ...showServices };

    if (statistics.movieStatistics.serviceDistribution) {
      Object.entries(statistics.movieStatistics.serviceDistribution).forEach(([service, count]) => {
        combinedServices[service] = (combinedServices[service] || 0) + count;
      });
    }

    return convertToChartData(combinedServices, 8);
  }, [statistics]);

  return { watchStatusData, genreData, serviceData };
}

/**
 * Returns the human-readable display name for the watch-status category with the
 * highest count in the provided status counts record.
 * Known keys (`"watched"`, `"watching"`, `"notWatched"`) are mapped to their
 * display names; all other keys are returned as-is.
 * @param statusCounts - Record of status key to count, e.g. `{ watched: 10, notWatched: 5 }`.
 * @returns Display name of the top category, or `"not categorized"` if the record is empty.
 */
export function getTopCategory(statusCounts: Record<string, number | undefined>): string {
  const entries = Object.entries(statusCounts).filter(([_, count]) => count !== undefined) as [string, number][];
  if (entries.length === 0) return 'not categorized';

  const topEntry = entries.reduce((max, current) => (current[1] > (max[1] || 0) ? current : max), ['', 0]);

  // Convert key to display name
  return topEntry[0] === 'watched'
    ? 'Watched'
    : topEntry[0] === 'watching'
      ? 'Watching'
      : topEntry[0] === 'notWatched'
        ? 'Not Watched'
        : topEntry[0];
}

/**
 * Returns the rounded percentage share (0–100) of the highest-count status
 * category relative to the provided total.
 * @param statusCounts - Record of status key to count.
 * @param total - Total count used as the denominator.
 * @returns Rounded percentage, or `0` if `total` is zero or the record is empty.
 */
export function getTopCategoryPercentage(statusCounts: Record<string, number | undefined>, total: number): number {
  if (total === 0) return 0;

  const entries = Object.entries(statusCounts).filter(([_, count]) => count !== undefined) as [string, number][];
  if (entries.length === 0) return 0;

  const topEntry = entries.reduce((max, current) => (current[1] > (max[1] || 0) ? current : max), ['', 0]);

  return Math.round(((topEntry[1] || 0) / total) * 100);
}
