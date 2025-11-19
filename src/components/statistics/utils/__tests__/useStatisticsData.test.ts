import { renderHook } from '@testing-library/react';

import { AccountStatisticsResponse, ProfileStatisticsResponse } from '@ajgifford/keepwatching-types';

import { useStatisticsData, getTopCategory, getTopCategoryPercentage } from '../useStatisticsData';

// Mock the convertToChartData function
jest.mock('../distributionTypes', () => ({
  convertToChartData: jest.fn(
    (distribution: Record<string, number>, limit = 6): Array<{ name: string; value: number }> => {
      return Object.entries(distribution)
        .filter(([value]) => value && value.trim() !== '')
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => (b.value as number) - (a.value as number))
        .slice(0, limit);
    },
  ),
}));

describe('useStatisticsData', () => {
  const mockProfileStatistics: ProfileStatisticsResponse = {
    showStatistics: {
      total: 50,
      watchProgress: 75,
      watchStatusCounts: {
        watched: 15,
        watching: 20,
        notWatched: 10,
        upToDate: 3,
        unaired: 2,
      },
      genreDistribution: {
        Drama: 20,
        Comedy: 15,
        Action: 10,
      },
      serviceDistribution: {
        Netflix: 25,
        'Disney+': 15,
        'Amazon Prime': 10,
      },
    },
    movieStatistics: {
      total: 30,
      watchProgress: 60,
      watchStatusCounts: {
        watched: 12,
        watching: 0,
        notWatched: 6,
        upToDate: 0,
        unaired: 2,
      },
      genreDistribution: {
        Drama: 10,
        Comedy: 8,
        SciFi: 5,
      },
      serviceDistribution: {
        Netflix: 15,
        Hulu: 10,
        HBO: 5,
      },
      movieReferences: [],
    },
    episodeStatistics: {
      totalEpisodes: 500,
      watchedEpisodes: 350,
      watchProgress: 70,
    },
    episodeWatchProgress: {
      totalEpisodes: 500,
      watchedEpisodes: 350,
      unairedEpisodes: 50,
      overallProgress: 70,
      showsProgress: [],
    },
  } as ProfileStatisticsResponse;

  const mockAccountStatistics: AccountStatisticsResponse = {
    profileCount: 3,
    showStatistics: {
      total: 100,
      watchProgress: 80,
      watchStatusCounts: {
        watched: 30,
        watching: 40,
        notWatched: 20,
        upToDate: 5,
        unaired: 5,
      },
      genreDistribution: {
        Drama: 40,
        Comedy: 30,
        Action: 20,
      },
      serviceDistribution: {
        Netflix: 50,
        'Disney+': 30,
        'Amazon Prime': 20,
      },
    },
    movieStatistics: {
      total: 60,
      watchProgress: 70,
      watchStatusCounts: {
        watched: 25,
        watching: 0,
        notWatched: 15,
        upToDate: 0,
        unaired: 5,
      },
      genreDistribution: {
        Drama: 20,
        Comedy: 15,
        SciFi: 10,
      },
      serviceDistribution: {
        Netflix: 30,
        Hulu: 20,
        HBO: 10,
      },
      movieReferences: [],
    },
    episodeStatistics: {
      totalEpisodes: 1000,
      watchedEpisodes: 800,
      watchProgress: 80,
    },
    uniqueContent: {
      showCount: 90,
      movieCount: 55,
    },
  } as AccountStatisticsResponse;

  describe('hook behavior', () => {
    it('should return empty arrays when statistics is null', () => {
      const { result } = renderHook(() => useStatisticsData(null));

      expect(result.current.watchStatusData).toEqual([]);
      expect(result.current.genreData).toEqual([]);
      expect(result.current.serviceData).toEqual([]);
    });

    it('should return empty arrays when statistics is undefined', () => {
      const { result } = renderHook(() => useStatisticsData(undefined));

      expect(result.current.watchStatusData).toEqual([]);
      expect(result.current.genreData).toEqual([]);
      expect(result.current.serviceData).toEqual([]);
    });

    it('should process profile statistics correctly', () => {
      const { result } = renderHook(() => useStatisticsData(mockProfileStatistics));

      expect(result.current.watchStatusData).toHaveLength(2);
      expect(result.current.watchStatusData[0]).toEqual({
        name: 'Shows',
        watched: 15,
        watching: 20,
        notWatched: 10,
        upToDate: 3,
        unaired: 2,
      });
      expect(result.current.watchStatusData[1]).toEqual({
        name: 'Movies',
        watched: 12,
        notWatched: 6,
        unaired: 2,
      });
    });

    it('should process account statistics correctly', () => {
      const { result } = renderHook(() => useStatisticsData(mockAccountStatistics));

      expect(result.current.watchStatusData).toHaveLength(2);
      expect(result.current.watchStatusData[0]).toEqual({
        name: 'Shows',
        watched: 30,
        watching: 40,
        notWatched: 20,
        upToDate: 5,
        unaired: 5,
      });
      expect(result.current.watchStatusData[1]).toEqual({
        name: 'Movies',
        watched: 25,
        notWatched: 15,
        unaired: 5,
      });
    });

    it('should handle missing watch status counts with fallback to 0', () => {
      const statsWithMissingCounts: ProfileStatisticsResponse = {
        ...mockProfileStatistics,
        showStatistics: {
          ...mockProfileStatistics.showStatistics,
          watchStatusCounts: {
            watched: 15,
            watching: 0,
            notWatched: 0,
            upToDate: 0,
            unaired: 0,
          },
        },
      };

      const { result } = renderHook(() => useStatisticsData(statsWithMissingCounts));

      expect(result.current.watchStatusData[0]).toEqual({
        name: 'Shows',
        watched: 15,
        watching: 0,
        notWatched: 0,
        upToDate: 0,
        unaired: 0,
      });
    });

    it('should combine genre distributions from shows and movies', () => {
      const { result } = renderHook(() => useStatisticsData(mockProfileStatistics));

      // Drama: 20 + 10 = 30, Comedy: 15 + 8 = 23, Action: 10, SciFi: 5
      expect(result.current.genreData).toHaveLength(4);
      expect(result.current.genreData[0]).toEqual({ name: 'Drama', value: 30 });
      expect(result.current.genreData[1]).toEqual({ name: 'Comedy', value: 23 });
      expect(result.current.genreData[2]).toEqual({ name: 'Action', value: 10 });
      expect(result.current.genreData[3]).toEqual({ name: 'SciFi', value: 5 });
    });

    it('should filter out empty genre names', () => {
      const statsWithEmptyGenre: ProfileStatisticsResponse = {
        ...mockProfileStatistics,
        showStatistics: {
          ...mockProfileStatistics.showStatistics,
          genreDistribution: {
            Drama: 20,
            '': 10, // Empty genre should be filtered
            Comedy: 15,
          },
        },
      };

      const { result } = renderHook(() => useStatisticsData(statsWithEmptyGenre));

      // Should not include the empty genre in the result
      expect(result.current.genreData.find((item) => item.name === '')).toBeUndefined();
    });

    it('should combine service distributions from shows and movies', () => {
      const { result } = renderHook(() => useStatisticsData(mockProfileStatistics));

      // Netflix: 25 + 15 = 40, Disney+: 15, Amazon Prime: 10, Hulu: 10, HBO: 5
      expect(result.current.serviceData).toHaveLength(5);
      expect(result.current.serviceData[0]).toEqual({ name: 'Netflix', value: 40 });
      expect(result.current.serviceData[1]).toEqual({ name: 'Disney+', value: 15 });
    });

    it('should limit service data to 8 items', () => {
      const statsWithManyServices: ProfileStatisticsResponse = {
        ...mockProfileStatistics,
        showStatistics: {
          ...mockProfileStatistics.showStatistics,
          serviceDistribution: {
            Service1: 100,
            Service2: 90,
            Service3: 80,
            Service4: 70,
            Service5: 60,
            Service6: 50,
            Service7: 40,
            Service8: 30,
            Service9: 20,
            Service10: 10,
          },
        },
        movieStatistics: {
          ...mockProfileStatistics.movieStatistics,
          serviceDistribution: {},
        },
      };

      const { result } = renderHook(() => useStatisticsData(statsWithManyServices));

      expect(result.current.serviceData.length).toBeLessThanOrEqual(8);
    });

    it('should handle statistics with no genre distribution', () => {
      const statsWithNoGenres: ProfileStatisticsResponse = {
        ...mockProfileStatistics,
        showStatistics: {
          ...mockProfileStatistics.showStatistics,
          genreDistribution: {},
        },
        movieStatistics: {
          ...mockProfileStatistics.movieStatistics,
          genreDistribution: {},
        },
      };

      const { result } = renderHook(() => useStatisticsData(statsWithNoGenres));

      expect(result.current.genreData).toEqual([]);
    });

    it('should handle statistics with no service distribution', () => {
      const statsWithNoServices: ProfileStatisticsResponse = {
        ...mockProfileStatistics,
        showStatistics: {
          ...mockProfileStatistics.showStatistics,
          serviceDistribution: {},
        },
        movieStatistics: {
          ...mockProfileStatistics.movieStatistics,
          serviceDistribution: {},
        },
      };

      const { result } = renderHook(() => useStatisticsData(statsWithNoServices));

      expect(result.current.serviceData).toEqual([]);
    });

    it('should memoize results based on statistics', () => {
      const { result, rerender } = renderHook(({ stats }) => useStatisticsData(stats), {
        initialProps: { stats: mockProfileStatistics },
      });

      const firstResult = result.current;

      // Rerender with same statistics should return same references
      rerender({ stats: mockProfileStatistics });
      expect(result.current.watchStatusData).toBe(firstResult.watchStatusData);
      expect(result.current.genreData).toBe(firstResult.genreData);
      expect(result.current.serviceData).toBe(firstResult.serviceData);
    });

    it('should recalculate when statistics change', () => {
      const { result, rerender } = renderHook(({ stats }) => useStatisticsData(stats), {
        initialProps: { stats: mockProfileStatistics },
      });

      const firstResult = result.current;

      // Create different profile statistics
      const differentStats: ProfileStatisticsResponse = {
        ...mockProfileStatistics,
        showStatistics: {
          ...mockProfileStatistics.showStatistics,
          watchStatusCounts: {
            watched: 20,
            watching: 15,
            notWatched: 15,
            upToDate: 0,
            unaired: 0,
          },
        },
      };

      // Rerender with different statistics
      rerender({ stats: differentStats });

      expect(result.current.watchStatusData).not.toBe(firstResult.watchStatusData);
      expect(result.current.genreData).not.toBe(firstResult.genreData);
      expect(result.current.serviceData).not.toBe(firstResult.serviceData);
    });
  });

  describe('getTopCategory', () => {
    it('should return "not categorized" for empty status counts', () => {
      expect(getTopCategory({})).toBe('not categorized');
    });

    it('should return "not categorized" when all counts are undefined', () => {
      expect(getTopCategory({ watched: undefined, watching: undefined })).toBe('not categorized');
    });

    it('should find the category with the highest count', () => {
      const statusCounts = {
        watched: 10,
        watching: 25,
        notWatched: 5,
      };

      expect(getTopCategory(statusCounts)).toBe('Watching');
    });

    it('should convert "watched" to "Watched"', () => {
      const statusCounts = {
        watched: 30,
        watching: 10,
        notWatched: 5,
      };

      expect(getTopCategory(statusCounts)).toBe('Watched');
    });

    it('should convert "watching" to "Watching"', () => {
      const statusCounts = {
        watched: 10,
        watching: 30,
        notWatched: 5,
      };

      expect(getTopCategory(statusCounts)).toBe('Watching');
    });

    it('should convert "notWatched" to "Not Watched"', () => {
      const statusCounts = {
        watched: 10,
        watching: 5,
        notWatched: 30,
      };

      expect(getTopCategory(statusCounts)).toBe('Not Watched');
    });

    it('should return the key as-is for unknown categories', () => {
      const statusCounts = {
        customStatus: 30,
        watched: 10,
      };

      expect(getTopCategory(statusCounts)).toBe('customStatus');
    });

    it('should handle tie by returning the first maximum', () => {
      const statusCounts = {
        watched: 20,
        watching: 20,
        notWatched: 10,
      };

      // The reduce function will return the first max encountered
      const result = getTopCategory(statusCounts);
      expect(['Watched', 'Watching']).toContain(result);
    });

    it('should filter out undefined values before finding max', () => {
      const statusCounts = {
        watched: 10,
        watching: undefined,
        notWatched: 5,
      };

      expect(getTopCategory(statusCounts)).toBe('Watched');
    });
  });

  describe('getTopCategoryPercentage', () => {
    it('should return 0 when total is 0', () => {
      const statusCounts = { watched: 10, watching: 20 };
      expect(getTopCategoryPercentage(statusCounts, 0)).toBe(0);
    });

    it('should return 0 when status counts are empty', () => {
      expect(getTopCategoryPercentage({}, 100)).toBe(0);
    });

    it('should return 0 when all counts are undefined', () => {
      expect(getTopCategoryPercentage({ watched: undefined, watching: undefined }, 100)).toBe(0);
    });

    it('should calculate percentage correctly', () => {
      const statusCounts = {
        watched: 25,
        watching: 50,
        notWatched: 25,
      };

      // Top is watching with 50 out of 100 total
      expect(getTopCategoryPercentage(statusCounts, 100)).toBe(50);
    });

    it('should round to nearest integer', () => {
      const statusCounts = {
        watched: 33,
        watching: 33,
        notWatched: 34,
      };

      // Top is notWatched with 34 out of 100 total = 34%
      expect(getTopCategoryPercentage(statusCounts, 100)).toBe(34);
    });

    it('should handle decimals and round correctly', () => {
      const statusCounts = {
        watched: 7,
        watching: 10,
        notWatched: 3,
      };

      // Top is watching with 10 out of 30 total = 33.33% -> rounds to 33
      expect(getTopCategoryPercentage(statusCounts, 30)).toBe(33);
    });

    it('should handle small percentages', () => {
      const statusCounts = {
        watched: 1,
        watching: 2,
        notWatched: 97,
      };

      // Top is notWatched with 97 out of 100 total = 97%
      expect(getTopCategoryPercentage(statusCounts, 100)).toBe(97);
    });

    it('should handle 100% case', () => {
      const statusCounts = {
        watched: 100,
        watching: 0,
        notWatched: 0,
      };

      expect(getTopCategoryPercentage(statusCounts, 100)).toBe(100);
    });

    it('should filter out undefined values before calculating', () => {
      const statusCounts = {
        watched: 30,
        watching: undefined,
        notWatched: 20,
      };

      // Top is watched with 30 out of 100 total = 30%
      expect(getTopCategoryPercentage(statusCounts, 100)).toBe(30);
    });
  });
});
