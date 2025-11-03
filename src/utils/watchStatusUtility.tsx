import { WatchStatus } from '@ajgifford/keepwatching-types';

export function getWatchStatusDisplay(status: WatchStatus | undefined) {
  if (!status) return '';
  if (status === WatchStatus.WATCHED) return 'Watched';
  if (status === WatchStatus.UP_TO_DATE) return 'Up To Date';
  if (status === WatchStatus.WATCHING) return 'Watching';
  if (status === WatchStatus.NOT_WATCHED) return 'Not Watched';
  if (status === WatchStatus.UNAIRED) return 'Not Yet Aired';
}
