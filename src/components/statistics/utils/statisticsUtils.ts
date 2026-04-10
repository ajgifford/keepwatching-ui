import { AccountStatisticsResponse, ProfileStatisticsResponse } from '@ajgifford/keepwatching-types';

/**
 * Normalized props consumed by the `StatisticsSummaryCard` component.
 * Produced by {@link getAccountSummaryProps} and {@link getProfileSummaryProps}.
 */
export interface SummaryCardProps {
  /** Label displayed above the progress bar (e.g., `"Episode Watch Progress"`). */
  progressLabel: string;
  /** Overall watch progress percentage (0–100). */
  progressValue: number;
  /** Number of items already watched (numerator of the progress fraction). */
  currentCount: number;
  /** Total number of items available (denominator of the progress fraction). */
  totalCount: number;
  /** Array of summary stat chips displayed alongside the progress bar. */
  stats: Array<{
    /** Numeric value for the stat chip. */
    value: number;
    /** Human-readable label for the stat chip. */
    label: string;
    /** MUI color variant for the stat chip value. */
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  }>;
}

/**
 * Derives {@link SummaryCardProps} from an account-level statistics response.
 * @param stats - Account statistics to transform.
 * @returns Normalized summary card props, or `null` if `stats` is falsy.
 */
export function getAccountSummaryProps(stats: AccountStatisticsResponse | null | undefined): SummaryCardProps | null {
  if (!stats) return null;

  return {
    progressLabel: 'Episode Watch Progress',
    progressValue: stats.episodeStatistics.watchProgress,
    currentCount: stats.episodeStatistics.watchedEpisodes,
    totalCount: stats.episodeStatistics.totalEpisodes,
    stats: [
      { value: stats.profileCount, label: 'Profiles', color: 'primary' },
      { value: stats.uniqueContent.showCount, label: 'Unique Shows', color: 'secondary' },
      { value: stats.uniqueContent.movieCount, label: 'Unique Movies', color: 'info' },
    ],
  };
}

/**
 * Derives {@link SummaryCardProps} from a profile-level statistics response.
 * @param stats - Profile statistics to transform.
 * @returns Normalized summary card props, or `null` if `stats` is falsy.
 */
export function getProfileSummaryProps(stats: ProfileStatisticsResponse | null | undefined): SummaryCardProps | null {
  if (!stats) return null;

  return {
    progressLabel: 'Overall Progress',
    progressValue: stats.episodeWatchProgress.overallProgress,
    currentCount: stats.episodeWatchProgress.watchedEpisodes,
    totalCount: stats.episodeWatchProgress.totalEpisodes,
    stats: [
      { value: stats.showStatistics.total, label: 'Shows', color: 'primary' },
      { value: stats.movieStatistics.total, label: 'Movies', color: 'secondary' },
      { value: stats.episodeWatchProgress.totalEpisodes, label: 'Episodes', color: 'success' },
    ],
  };
}

/**
 * Type guard that narrows a statistics value to {@link AccountStatisticsResponse}.
 * Uses the presence of `profileCount` as the discriminating property.
 * @param stats - Statistics value to inspect.
 * @returns `true` if `stats` is an `AccountStatisticsResponse`.
 */
export function isAccountStatistics(
  stats: AccountStatisticsResponse | ProfileStatisticsResponse | null | undefined
): stats is AccountStatisticsResponse {
  return stats !== null && stats !== undefined && 'profileCount' in stats;
}

/**
 * Type guard that narrows a statistics value to {@link ProfileStatisticsResponse}.
 * Uses the presence of `episodeWatchProgress` with a nested `showsProgress` field
 * as the discriminating properties.
 * @param stats - Statistics value to inspect.
 * @returns `true` if `stats` is a `ProfileStatisticsResponse`.
 */
export function isProfileStatistics(
  stats: AccountStatisticsResponse | ProfileStatisticsResponse | null | undefined
): stats is ProfileStatisticsResponse {
  return (
    stats !== null &&
    stats !== undefined &&
    'episodeWatchProgress' in stats &&
    'showsProgress' in stats.episodeWatchProgress
  );
}
