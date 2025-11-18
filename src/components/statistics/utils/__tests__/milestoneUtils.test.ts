import { MilestoneStats } from '@ajgifford/keepwatching-types';

import { getLastAchievedMilestone, getNextMilestone } from '../milestoneUtils';

describe('getLastAchievedMilestone', () => {
  it('should return null for null stats', () => {
    expect(getLastAchievedMilestone(null)).toBeNull();
  });

  it('should return null when no milestones are achieved', () => {
    const stats = {
      totalEpisodesWatched: 0,
      totalMoviesWatched: 0,
      totalHoursWatched: 0,
    } as unknown as MilestoneStats;
    expect(getLastAchievedMilestone(stats)).toBeNull();
  });

  it('should return the highest achieved episode milestone', () => {
    const stats = {
      totalEpisodesWatched: 150,
      totalMoviesWatched: 10,
      totalHoursWatched: 50,
    } as unknown as MilestoneStats;
    const result = getLastAchievedMilestone(stats);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('episodes');
    expect(result?.threshold).toBe(100);
    expect(result?.achieved).toBe(true);
  });

  it('should return the highest achieved movie milestone', () => {
    const stats = {
      totalEpisodesWatched: 50,
      totalMoviesWatched: 75,
      totalHoursWatched: 30,
    } as unknown as MilestoneStats;
    const result = getLastAchievedMilestone(stats);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('movies');
    expect(result?.threshold).toBe(50);
    expect(result?.achieved).toBe(true);
  });

  it('should return the highest achieved hours milestone', () => {
    const stats = {
      totalEpisodesWatched: 50,
      totalMoviesWatched: 10,
      totalHoursWatched: 150,
    } as unknown as MilestoneStats;
    const result = getLastAchievedMilestone(stats);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('hours');
    expect(result?.threshold).toBe(100);
    expect(result?.achieved).toBe(true);
  });

  it('should return the highest milestone across all types', () => {
    const stats = {
      totalEpisodesWatched: 600,
      totalMoviesWatched: 60,
      totalHoursWatched: 200,
    } as unknown as MilestoneStats;
    const result = getLastAchievedMilestone(stats);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('episodes');
    expect(result?.threshold).toBe(500);
  });

  it('should handle multiple achieved milestones correctly', () => {
    const stats = {
      totalEpisodesWatched: 1500,
      totalMoviesWatched: 150,
      totalHoursWatched: 1500,
    } as unknown as MilestoneStats;
    const result = getLastAchievedMilestone(stats);
    expect(result).not.toBeNull();
    expect(result?.achieved).toBe(true);
    // Should return one of the 1000 thresholds
    expect([1000, 5000]).toContain(result?.threshold);
  });
});

describe('getNextMilestone', () => {
  it('should return null for null stats', () => {
    expect(getNextMilestone(null)).toBeNull();
  });

  it('should return the closest next milestone', () => {
    const stats = {
      totalEpisodesWatched: 50,
      totalMoviesWatched: 10,
      totalHoursWatched: 30,
    } as unknown as MilestoneStats;
    const result = getNextMilestone(stats);
    expect(result).not.toBeNull();
    expect(result?.achieved).toBe(false);
    expect(result?.progress).toBeGreaterThan(0);
  });

  it('should return episode milestone when closest', () => {
    const stats = {
      totalEpisodesWatched: 80,
      totalMoviesWatched: 5,
      totalHoursWatched: 20,
    } as unknown as MilestoneStats;
    const result = getNextMilestone(stats);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('episodes');
    expect(result?.threshold).toBe(100);
  });

  it('should return movie milestone when closest', () => {
    const stats = {
      totalEpisodesWatched: 50,
      totalMoviesWatched: 20,
      totalHoursWatched: 30,
    } as unknown as MilestoneStats;
    const result = getNextMilestone(stats);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('movies');
    expect(result?.threshold).toBe(25);
  });

  it('should return hours milestone when closest', () => {
    const stats = {
      totalEpisodesWatched: 30,
      totalMoviesWatched: 5,
      totalHoursWatched: 80,
    } as unknown as MilestoneStats;
    const result = getNextMilestone(stats);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('hours');
    expect(result?.threshold).toBe(100);
  });

  it('should calculate progress correctly', () => {
    const stats = {
      totalEpisodesWatched: 50,
      totalMoviesWatched: 10,
      totalHoursWatched: 30,
    } as unknown as MilestoneStats;
    const result = getNextMilestone(stats);
    expect(result).not.toBeNull();
    expect(result?.progress).toBeGreaterThan(0);
    expect(result?.progress).toBeLessThan(100);
  });

  it('should return null when all milestones are achieved', () => {
    const stats = {
      totalEpisodesWatched: 10000,
      totalMoviesWatched: 1000,
      totalHoursWatched: 10000,
    } as unknown as MilestoneStats;
    const result = getNextMilestone(stats);
    expect(result).toBeNull();
  });

  it('should prefer milestone with highest progress', () => {
    const stats = {
      totalEpisodesWatched: 90,
      totalMoviesWatched: 20,
      totalHoursWatched: 50,
    } as unknown as MilestoneStats;
    const result = getNextMilestone(stats);
    expect(result).not.toBeNull();
    // 90/100 = 90% progress should be the highest
    expect(result?.type).toBe('episodes');
    expect(result?.threshold).toBe(100);
  });
});
