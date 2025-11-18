import { render, screen } from '@testing-library/react';

import { WatchStreakStats } from '@ajgifford/keepwatching-types';

import { WatchStreakCard } from '../watchStreakCard';

describe('WatchStreakCard', () => {
  const mockStreakData: WatchStreakStats = {
    currentStreak: 7,
    currentStreakStartDate: '2024-01-01',
    longestStreak: 30,
    longestStreakPeriod: {
      startDate: '2023-06-01',
      endDate: '2023-06-30',
      days: 30,
    },
    streaksOver7Days: 5,
    averageStreakLength: 12.5,
  } as WatchStreakStats;

  it('should render with title', () => {
    render(<WatchStreakCard streakData={mockStreakData} />);

    expect(screen.getByText('Watch Streaks')).toBeInTheDocument();
  });

  it('should display current streak', () => {
    render(<WatchStreakCard streakData={mockStreakData} />);

    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('Current Streak')).toBeInTheDocument();
  });

  it('should display current streak chip with count', () => {
    render(<WatchStreakCard streakData={mockStreakData} />);

    expect(screen.getByText('7 Days')).toBeInTheDocument();
  });

  it('should display singular "Day" for streak of 1', () => {
    const singleDayStreak = { ...mockStreakData, currentStreak: 1 };
    render(<WatchStreakCard streakData={singleDayStreak} />);

    expect(screen.getByText('1 Day')).toBeInTheDocument();
  });

  it('should display current streak start date', () => {
    render(<WatchStreakCard streakData={mockStreakData} />);

    expect(screen.getByText(/Since/)).toBeInTheDocument();
  });

  it('should display longest streak', () => {
    render(<WatchStreakCard streakData={mockStreakData} />);

    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Longest Streak')).toBeInTheDocument();
  });

  it('should display longest streak period dates', () => {
    render(<WatchStreakCard streakData={mockStreakData} />);

    expect(screen.getByText('Longest Streak Period')).toBeInTheDocument();
    expect(screen.getByText(/6\/1\/2023/)).toBeInTheDocument();
    expect(screen.getByText(/6\/30\/2023/)).toBeInTheDocument();
  });

  it('should display longest streak period days', () => {
    render(<WatchStreakCard streakData={mockStreakData} />);

    expect(screen.getByText('(30 consecutive days)')).toBeInTheDocument();
  });

  it('should display streak statistics', () => {
    render(<WatchStreakCard streakData={mockStreakData} />);

    expect(screen.getByText('Streak Statistics')).toBeInTheDocument();
    expect(screen.getByText('5 week+ streaks')).toBeInTheDocument();
    expect(screen.getByText('Avg: 12.5 days per streak')).toBeInTheDocument();
  });

  it('should display singular "streak" when count is 1', () => {
    const oneWeekStreak = { ...mockStreakData, streaksOver7Days: 1 };
    render(<WatchStreakCard streakData={oneWeekStreak} />);

    expect(screen.getByText('1 week+ streak')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<WatchStreakCard isLoading={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show empty state when streakData is null', () => {
    render(<WatchStreakCard streakData={null} />);

    expect(screen.getByText(/No streaks detected yet/)).toBeInTheDocument();
  });

  it('should show empty state when longest streak is 0', () => {
    const noStreakData = { ...mockStreakData, longestStreak: 0 };
    render(<WatchStreakCard streakData={noStreakData} />);

    expect(screen.getByText(/No streaks detected yet/)).toBeInTheDocument();
  });

  it('should not show current streak chip when current streak is 0', () => {
    const noCurrentStreak = { ...mockStreakData, currentStreak: 0 };
    render(<WatchStreakCard streakData={noCurrentStreak} />);

    expect(screen.queryByText(/Days/)).not.toBeInTheDocument();
  });

  it('should handle data without current streak start date', () => {
    const noStartDate = { ...mockStreakData, currentStreakStartDate: null };
    render(<WatchStreakCard streakData={noStartDate as unknown as WatchStreakStats} />);

    expect(screen.queryByText(/Since/)).not.toBeInTheDocument();
  });

  it('should render icons', () => {
    const { container } = render(<WatchStreakCard streakData={mockStreakData} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should match snapshot with active streak', () => {
    const { container } = render(<WatchStreakCard streakData={mockStreakData} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with no current streak', () => {
    const noCurrentStreak = { ...mockStreakData, currentStreak: 0 };
    const { container } = render(<WatchStreakCard streakData={noCurrentStreak} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(<WatchStreakCard isLoading={true} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in empty state', () => {
    const { container } = render(<WatchStreakCard streakData={null} />);

    expect(container).toMatchSnapshot();
  });
});
