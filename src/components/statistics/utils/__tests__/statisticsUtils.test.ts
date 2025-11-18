import {
  getAccountSummaryProps,
  getProfileSummaryProps,
  isAccountStatistics,
  isProfileStatistics,
} from '../statisticsUtils';
import { AccountStatisticsResponse, ProfileStatisticsResponse } from '@ajgifford/keepwatching-types';

describe('getAccountSummaryProps', () => {
  it('should return null for null input', () => {
    expect(getAccountSummaryProps(null)).toBeNull();
  });

  it('should return null for undefined input', () => {
    expect(getAccountSummaryProps(undefined)).toBeNull();
  });

  it('should return correct summary props for valid account statistics', () => {
    const mockStats: AccountStatisticsResponse = {
      profileCount: 3,
      episodeStatistics: {
        watchProgress: 75,
        watchedEpisodes: 150,
        totalEpisodes: 200,
      },
      uniqueContent: {
        showCount: 10,
        movieCount: 25,
      },
    } as AccountStatisticsResponse;

    const result = getAccountSummaryProps(mockStats);

    expect(result).not.toBeNull();
    expect(result?.progressLabel).toBe('Episode Watch Progress');
    expect(result?.progressValue).toBe(75);
    expect(result?.currentCount).toBe(150);
    expect(result?.totalCount).toBe(200);
    expect(result?.stats).toHaveLength(3);
    expect(result?.stats[0]).toEqual({ value: 3, label: 'Profiles', color: 'primary' });
    expect(result?.stats[1]).toEqual({ value: 10, label: 'Unique Shows', color: 'secondary' });
    expect(result?.stats[2]).toEqual({ value: 25, label: 'Unique Movies', color: 'info' });
  });
});

describe('getProfileSummaryProps', () => {
  it('should return null for null input', () => {
    expect(getProfileSummaryProps(null)).toBeNull();
  });

  it('should return null for undefined input', () => {
    expect(getProfileSummaryProps(undefined)).toBeNull();
  });

  it('should return correct summary props for valid profile statistics', () => {
    const mockStats = {
      episodeWatchProgress: {
        overallProgress: 60,
        watchedEpisodes: 120,
        totalEpisodes: 200,
        showsProgress: [],
      },
      showStatistics: {
        total: 15,
      },
      movieStatistics: {
        total: 30,
      },
    } as unknown as ProfileStatisticsResponse;

    const result = getProfileSummaryProps(mockStats);

    expect(result).not.toBeNull();
    expect(result?.progressLabel).toBe('Overall Progress');
    expect(result?.progressValue).toBe(60);
    expect(result?.currentCount).toBe(120);
    expect(result?.totalCount).toBe(200);
    expect(result?.stats).toHaveLength(3);
    expect(result?.stats[0]).toEqual({ value: 15, label: 'Shows', color: 'primary' });
    expect(result?.stats[1]).toEqual({ value: 30, label: 'Movies', color: 'secondary' });
    expect(result?.stats[2]).toEqual({ value: 200, label: 'Episodes', color: 'success' });
  });
});

describe('isAccountStatistics', () => {
  it('should return true for valid AccountStatisticsResponse', () => {
    const mockStats: AccountStatisticsResponse = {
      profileCount: 3,
      episodeStatistics: {
        watchProgress: 75,
        watchedEpisodes: 150,
        totalEpisodes: 200,
      },
      uniqueContent: {
        showCount: 10,
        movieCount: 25,
      },
    } as AccountStatisticsResponse;

    expect(isAccountStatistics(mockStats)).toBe(true);
  });

  it('should return false for ProfileStatisticsResponse', () => {
    const mockStats = {
      episodeWatchProgress: {
        overallProgress: 60,
        watchedEpisodes: 120,
        totalEpisodes: 200,
        showsProgress: [],
      },
      showStatistics: { total: 15 },
      movieStatistics: { total: 30 },
    } as unknown as ProfileStatisticsResponse;

    expect(isAccountStatistics(mockStats)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isAccountStatistics(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isAccountStatistics(undefined)).toBe(false);
  });
});

describe('isProfileStatistics', () => {
  it('should return true for valid ProfileStatisticsResponse', () => {
    const mockStats = {
      episodeWatchProgress: {
        overallProgress: 60,
        watchedEpisodes: 120,
        totalEpisodes: 200,
        showsProgress: [],
      },
      showStatistics: { total: 15 },
      movieStatistics: { total: 30 },
    } as unknown as ProfileStatisticsResponse;

    expect(isProfileStatistics(mockStats)).toBe(true);
  });

  it('should return false for AccountStatisticsResponse', () => {
    const mockStats = {
      profileCount: 3,
      episodeStatistics: {
        watchProgress: 75,
        watchedEpisodes: 150,
        totalEpisodes: 200,
      },
      uniqueContent: {
        showCount: 10,
        movieCount: 25,
      },
    } as unknown as AccountStatisticsResponse;

    expect(isProfileStatistics(mockStats)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isProfileStatistics(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isProfileStatistics(undefined)).toBe(false);
  });
});
