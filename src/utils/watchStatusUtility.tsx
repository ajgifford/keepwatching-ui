import { WatchStatus } from '@ajgifford/keepwatching-types';

/**
 * Converts a `WatchStatus` enum value to its human-readable display string.
 * Returns an empty string when `status` is `undefined`.
 * @param status - The watch status to convert.
 * @returns Display string (e.g., `"Watched"`, `"Up To Date"`, `"Not Yet Aired"`),
 *   or `""` if `status` is `undefined`.
 */
export function getWatchStatusDisplay(status: WatchStatus | undefined) {
  if (!status) return '';
  if (status === WatchStatus.WATCHED) return 'Watched';
  if (status === WatchStatus.UP_TO_DATE) return 'Up To Date';
  if (status === WatchStatus.WATCHING) return 'Watching';
  if (status === WatchStatus.NOT_WATCHED) return 'Not Watched';
  if (status === WatchStatus.UNAIRED) return 'Not Yet Aired';
}
