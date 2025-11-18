import { render, screen, fireEvent } from '@testing-library/react';

import { AccountRankingStats } from '@ajgifford/keepwatching-types';

import { AccountRankingCard } from '../accountRankingCard';

describe('AccountRankingCard', () => {
  const mockStats: AccountRankingStats = {
    rankingMetric: 'engagement',
    rankings: [
      {
        accountId: 1,
        accountName: 'John Doe',
        accountEmail: 'john@example.com',
        totalEpisodesWatched: 1000,
        totalMoviesWatched: 200,
        totalHoursWatched: 5000,
        engagementScore: 95,
        profileCount: 4,
        lastActivityDate: '2024-01-15',
      },
      {
        accountId: 2,
        accountName: 'Jane Smith',
        accountEmail: 'jane@example.com',
        totalEpisodesWatched: 800,
        totalMoviesWatched: 150,
        totalHoursWatched: 4000,
        engagementScore: 88,
        profileCount: 3,
        lastActivityDate: '2024-01-10',
      },
      {
        accountId: 3,
        accountName: null,
        accountEmail: 'test@example.com',
        totalEpisodesWatched: 600,
        totalMoviesWatched: 100,
        totalHoursWatched: 3000,
        engagementScore: 82,
        profileCount: 2,
        lastActivityDate: '2024-01-05',
      },
    ],
  } as unknown as AccountRankingStats;

  it('should render with title', () => {
    render(<AccountRankingCard stats={mockStats} />);

    expect(screen.getByText('Account Rankings')).toBeInTheDocument();
  });

  it('should display metric selector', () => {
    render(<AccountRankingCard stats={mockStats} />);

    // The select should be present (can check for the Engagement option)
    expect(screen.getByText('Engagement')).toBeInTheDocument();
  });

  it('should display all ranking entries', () => {
    render(<AccountRankingCard stats={mockStats} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should display account name when available', () => {
    render(<AccountRankingCard stats={mockStats} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should display email when account name is not available', () => {
    render(<AccountRankingCard stats={mockStats} />);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should display profile counts', () => {
    render(<AccountRankingCard stats={mockStats} />);

    expect(screen.getByText('4 profiles')).toBeInTheDocument();
    expect(screen.getByText('3 profiles')).toBeInTheDocument();
    expect(screen.getByText('2 profiles')).toBeInTheDocument();
  });

  it('should display engagement scores by default', () => {
    render(<AccountRankingCard stats={mockStats} />);

    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('88')).toBeInTheDocument();
    expect(screen.getByText('82')).toBeInTheDocument();
  });

  it('should display last activity dates', () => {
    render(<AccountRankingCard stats={mockStats} />);

    expect(screen.getByText(/Last active: 1\/15\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/Last active: 1\/10\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/Last active: 1\/5\/2024/)).toBeInTheDocument();
  });

  it('should display ranking numbers', () => {
    render(<AccountRankingCard stats={mockStats} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should change metric when selector is used', () => {
    render(<AccountRankingCard stats={mockStats} />);

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    const episodesOption = screen.getByText('Episodes Watched');
    fireEvent.click(episodesOption);

    // Should now show episodes watched values
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('should call onMetricChange when metric changes', () => {
    const onMetricChange = jest.fn();
    render(<AccountRankingCard stats={mockStats} onMetricChange={onMetricChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    const episodesOption = screen.getByText('Episodes Watched');
    fireEvent.click(episodesOption);

    expect(onMetricChange).toHaveBeenCalledWith('episodesWatched');
  });

  it('should display movies watched when metric is changed', () => {
    render(<AccountRankingCard stats={mockStats} />);

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    const moviesOption = screen.getByText('Movies Watched');
    fireEvent.click(moviesOption);

    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('should display hours watched when metric is changed', () => {
    render(<AccountRankingCard stats={mockStats} />);

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    const hoursOption = screen.getByText('Hours Watched');
    fireEvent.click(hoursOption);

    expect(screen.getByText('5,000 hrs')).toBeInTheDocument();
    expect(screen.getByText('4,000 hrs')).toBeInTheDocument();
    expect(screen.getByText('3,000 hrs')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<AccountRankingCard stats={mockStats} isLoading={true} />);

    expect(screen.getByText('Account Rankings')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('should show empty state when no rankings', () => {
    const emptyStats = { ...mockStats, rankings: [] };
    render(<AccountRankingCard stats={emptyStats} />);

    expect(screen.getByText('No rankings available')).toBeInTheDocument();
  });

  it('should render ranking icons', () => {
    const { container } = render(<AccountRankingCard stats={mockStats} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should format large numbers with commas', () => {
    const largeStats = {
      ...mockStats,
      rankings: [
        {
          ...mockStats.rankings[0],
          totalEpisodesWatched: 10000,
          totalMoviesWatched: 2000,
          totalHoursWatched: 50000,
        },
      ],
    };

    render(<AccountRankingCard stats={largeStats as unknown as AccountRankingStats} />);

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    const episodesOption = screen.getByText('Episodes Watched');
    fireEvent.click(episodesOption);

    expect(screen.getByText('10,000')).toBeInTheDocument();
  });

  it('should have all metric options in selector', () => {
    render(<AccountRankingCard stats={mockStats} />);

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    const engagementOptions = screen.getAllByText('Engagement');
    expect(engagementOptions.length).toBeGreaterThan(0);
    expect(screen.getByText('Episodes Watched')).toBeInTheDocument();
    expect(screen.getByText('Movies Watched')).toBeInTheDocument();
    expect(screen.getByText('Hours Watched')).toBeInTheDocument();
  });

  it('should handle accounts without last activity date', () => {
    const statsNoDate = {
      ...mockStats,
      rankings: [
        {
          ...mockStats.rankings[0],
          lastActivityDate: null,
        },
      ],
    };

    render(<AccountRankingCard stats={statsNoDate as unknown as AccountRankingStats} />);

    expect(screen.queryByText(/Last active:/)).not.toBeInTheDocument();
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<AccountRankingCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(<AccountRankingCard stats={mockStats} isLoading={true} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with empty rankings', () => {
    const emptyStats = { ...mockStats, rankings: [] };
    const { container } = render(<AccountRankingCard stats={emptyStats} />);

    expect(container).toMatchSnapshot();
  });
});
