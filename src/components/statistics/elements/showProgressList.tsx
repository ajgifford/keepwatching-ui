import { useMemo } from 'react';

import { Box, Divider, LinearProgress, Typography } from '@mui/material';

import { getProgressBarColor } from '../../../utils/watchStatusColors';
import { ShowProgress, WatchStatus } from '@ajgifford/keepwatching-types';

/**
 * Props for the {@link ShowProgressList}.
 */
interface ShowProgressListProps {
  /** Array of show progress records to display. */
  shows: ShowProgress[];
  /** Maximum height of the scrollable list container. Defaults to `300`. */
  maxHeight?: number | string;
  /**
   * Watch status used to filter the list. Pass `null` to show all shows.
   * Defaults to `WatchStatus.WATCHING`.
   */
  filter?: WatchStatus | null;
}

/**
 * Scrollable list of shows with linear progress bars indicating episode completion.
 *
 * Filters shows by the `filter` watch status (default: `WATCHING`), then sorts them
 * by completion percentage descending. Renders an empty-state message when no shows
 * match the filter. Progress bar color is determined by
 * {@link getProgressBarColor}.
 */
export function ShowProgressList({ shows, maxHeight = 300, filter = WatchStatus.WATCHING }: ShowProgressListProps) {
  const filteredShows = filter ? shows.filter((show) => show.status === filter) : shows;
  const sortedShows = [...filteredShows].sort((a, b) => b.percentComplete - a.percentComplete);

  const defaultEmptyMessage = useMemo(() => {
    switch (filter) {
      case WatchStatus.NOT_WATCHED:
        return 'No unwatched shows';
      case WatchStatus.WATCHED:
        return 'No shows completed yet';
      case WatchStatus.WATCHING:
        return 'No shows currently being watched';
      case WatchStatus.UP_TO_DATE:
        return 'No shows are up to date';
      case WatchStatus.UNAIRED:
        return 'No unaired shows';
      default:
        return 'No shows available';
    }
  }, [filter]);

  if (sortedShows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
        {defaultEmptyMessage}
      </Typography>
    );
  }

  return (
    <Box sx={{ maxHeight, overflow: 'auto' }}>
      {sortedShows.map((show, index) => (
        <Box key={show.showId} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">{show.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {show.watchedEpisodes}/{show.totalEpisodes}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={show.percentComplete}
            color={getProgressBarColor(show.percentComplete)}
            sx={{ height: 8, borderRadius: 4 }}
          />
          {index < sortedShows.length - 1 && <Divider sx={{ mt: 1 }} />}
        </Box>
      ))}
    </Box>
  );
}
