import { WatchStatus } from '@ajgifford/keepwatching-types';

import { getWatchStatusDisplay } from '../watchStatusUtility';

describe('getWatchStatusDisplay', () => {
  it('should return empty string for undefined', () => {
    expect(getWatchStatusDisplay(undefined)).toBe('');
  });

  it('should return "Watched" for WATCHED status', () => {
    expect(getWatchStatusDisplay(WatchStatus.WATCHED)).toBe('Watched');
  });

  it('should return "Up To Date" for UP_TO_DATE status', () => {
    expect(getWatchStatusDisplay(WatchStatus.UP_TO_DATE)).toBe('Up To Date');
  });

  it('should return "Watching" for WATCHING status', () => {
    expect(getWatchStatusDisplay(WatchStatus.WATCHING)).toBe('Watching');
  });

  it('should return "Not Watched" for NOT_WATCHED status', () => {
    expect(getWatchStatusDisplay(WatchStatus.NOT_WATCHED)).toBe('Not Watched');
  });

  it('should return "Not Yet Aired" for UNAIRED status', () => {
    expect(getWatchStatusDisplay(WatchStatus.UNAIRED)).toBe('Not Yet Aired');
  });

  it('should return undefined for unknown status', () => {
    expect(getWatchStatusDisplay('UNKNOWN' as WatchStatus)).toBeUndefined();
  });
});
