import { render, screen } from '@testing-library/react';

import { PlatformTrendsStats } from '@ajgifford/keepwatching-types';

import { PlatformTrendsCard } from '../platformTrendsCard';

describe('PlatformTrendsCard', () => {
  const mockStats: PlatformTrendsStats = {
    periodDays: 30,
    newAccountsInPeriod: 125,
    episodesWatchedInPeriod: 5432,
    moviesWatchedInPeriod: 892,
    dailyActiveUsersTrend: 12,
    watchActivityTrend: -5,
    dailyActivity: [
      {
        date: '2024-11-01T00:00:00Z',
        activeAccounts: 450,
        episodesWatched: 180,
        moviesWatched: 25,
      },
      {
        date: '2024-11-02T00:00:00Z',
        activeAccounts: 475,
        episodesWatched: 195,
        moviesWatched: 30,
      },
      {
        date: '2024-11-03T00:00:00Z',
        activeAccounts: 460,
        episodesWatched: 185,
        moviesWatched: 28,
      },
    ],
  } as PlatformTrendsStats;

  it('should render with title', () => {
    render(<PlatformTrendsCard stats={mockStats} />);

    expect(screen.getByText('Platform Trends (30 days)')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<PlatformTrendsCard stats={mockStats} isLoading={true} />);

    expect(screen.getByText('Platform Trends')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display new accounts count', () => {
    render(<PlatformTrendsCard stats={mockStats} />);

    expect(screen.getByText('125')).toBeInTheDocument();
    expect(screen.getByText('New Accounts')).toBeInTheDocument();
  });

  it('should display episodes watched count', () => {
    render(<PlatformTrendsCard stats={mockStats} />);

    expect(screen.getByText('5,432')).toBeInTheDocument();
    expect(screen.getByText('Episodes Watched')).toBeInTheDocument();
  });

  it('should display movies watched count', () => {
    render(<PlatformTrendsCard stats={mockStats} />);

    expect(screen.getByText('892')).toBeInTheDocument();
    expect(screen.getByText('Movies Watched')).toBeInTheDocument();
  });

  it('should display total activity', () => {
    render(<PlatformTrendsCard stats={mockStats} />);

    // 5432 + 892 = 6324
    expect(screen.getByText('6,324')).toBeInTheDocument();
    expect(screen.getByText('Total Activity')).toBeInTheDocument();
  });

  it('should display daily active users trend indicator', () => {
    render(<PlatformTrendsCard stats={mockStats} />);

    expect(screen.getByText('Daily Active Users:')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('should display watch activity trend indicator', () => {
    render(<PlatformTrendsCard stats={mockStats} />);

    expect(screen.getByText('Watch Activity:')).toBeInTheDocument();
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });

  it('should display positive trend with plus sign', () => {
    render(<PlatformTrendsCard stats={mockStats} />);

    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('should display negative trend with minus sign', () => {
    render(<PlatformTrendsCard stats={mockStats} />);

    expect(screen.getByText('-5%')).toBeInTheDocument();
  });

  it('should display neutral trend', () => {
    const neutralStats = {
      ...mockStats,
      dailyActiveUsersTrend: 0,
      watchActivityTrend: 0,
    };

    render(<PlatformTrendsCard stats={neutralStats} />);

    expect(screen.getAllByText('0%').length).toBeGreaterThan(0);
  });

  it('should render trend icons', () => {
    const { container } = render(<PlatformTrendsCard stats={mockStats} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should render chart when data is available', () => {
    const { container } = render(<PlatformTrendsCard stats={mockStats} />);

    // Check for recharts container
    const chartContainer = container.querySelector('.recharts-responsive-container');
    expect(chartContainer).toBeInTheDocument();
  });

  it('should not render chart when no daily activity data', () => {
    const noDataStats = {
      ...mockStats,
      dailyActivity: [],
    };

    const { container } = render(<PlatformTrendsCard stats={noDataStats} />);

    const chartContainer = container.querySelector('.recharts-responsive-container');
    expect(chartContainer).not.toBeInTheDocument();
  });

  it('should format large numbers with commas', () => {
    const largeStats = {
      ...mockStats,
      newAccountsInPeriod: 10000,
      episodesWatchedInPeriod: 50000,
      moviesWatchedInPeriod: 5000,
    };

    render(<PlatformTrendsCard stats={largeStats} />);

    expect(screen.getByText('10,000')).toBeInTheDocument();
    expect(screen.getByText('50,000')).toBeInTheDocument();
    expect(screen.getByText('5,000')).toBeInTheDocument();
  });

  it('should handle empty daily activity array', () => {
    const emptyStats = {
      ...mockStats,
      dailyActivity: [],
    };

    const { container } = render(<PlatformTrendsCard stats={emptyStats} />);

    expect(screen.getByText('125')).toBeInTheDocument();
    expect(container.querySelector('.recharts-responsive-container')).not.toBeInTheDocument();
  });

  it('should handle null daily activity gracefully', () => {
    const nullActivityStats = {
      ...mockStats,
      dailyActivity: null as any,
    };

    const { container } = render(<PlatformTrendsCard stats={nullActivityStats} />);

    expect(container.querySelector('.recharts-responsive-container')).not.toBeInTheDocument();
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<PlatformTrendsCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(<PlatformTrendsCard stats={mockStats} isLoading={true} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with positive trends', () => {
    const positiveStats = {
      ...mockStats,
      dailyActiveUsersTrend: 15,
      watchActivityTrend: 20,
    };

    const { container } = render(<PlatformTrendsCard stats={positiveStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with negative trends', () => {
    const negativeStats = {
      ...mockStats,
      dailyActiveUsersTrend: -10,
      watchActivityTrend: -15,
    };

    const { container } = render(<PlatformTrendsCard stats={negativeStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with neutral trends', () => {
    const neutralStats = {
      ...mockStats,
      dailyActiveUsersTrend: 0,
      watchActivityTrend: 0,
    };

    const { container } = render(<PlatformTrendsCard stats={neutralStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot without chart data', () => {
    const noChartStats = {
      ...mockStats,
      dailyActivity: [],
    };

    const { container } = render(<PlatformTrendsCard stats={noChartStats} />);

    expect(container).toMatchSnapshot();
  });
});
