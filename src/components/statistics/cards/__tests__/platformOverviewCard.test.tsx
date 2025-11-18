import { render, screen } from '@testing-library/react';

import { PlatformOverviewStats } from '@ajgifford/keepwatching-types';

import { PlatformOverviewCard } from '../platformOverviewCard';

describe('PlatformOverviewCard', () => {
  const mockStats: PlatformOverviewStats = {
    totalAccounts: 150,
    activeAccounts: 125,
    totalProfiles: 450,
    totalShows: 3000,
    totalMovies: 1500,
    totalEpisodesWatched: 50000,
    totalMoviesWatched: 10000,
    totalHoursWatched: 75000,
    averageProfilesPerAccount: 3,
    averageEpisodesPerAccount: 333,
  } as PlatformOverviewStats;

  it('should render with title', () => {
    render(<PlatformOverviewCard stats={mockStats} />);

    expect(screen.getByText('Platform Overview')).toBeInTheDocument();
  });

  it('should display total accounts', () => {
    render(<PlatformOverviewCard stats={mockStats} />);

    expect(screen.getByText('Total Accounts')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('should display active accounts', () => {
    render(<PlatformOverviewCard stats={mockStats} />);

    expect(screen.getByText('Active Accounts')).toBeInTheDocument();
    expect(screen.getByText('125')).toBeInTheDocument();
  });

  it('should display total profiles', () => {
    render(<PlatformOverviewCard stats={mockStats} />);

    expect(screen.getByText('Total Profiles')).toBeInTheDocument();
    expect(screen.getByText('450')).toBeInTheDocument();
  });

  it('should display total shows', () => {
    render(<PlatformOverviewCard stats={mockStats} />);

    expect(screen.getByText('Total Shows')).toBeInTheDocument();
    expect(screen.getByText('3,000')).toBeInTheDocument();
  });

  it('should display total movies', () => {
    render(<PlatformOverviewCard stats={mockStats} />);

    expect(screen.getByText('Total Movies')).toBeInTheDocument();
    expect(screen.getByText('1,500')).toBeInTheDocument();
  });

  it('should display episodes watched', () => {
    render(<PlatformOverviewCard stats={mockStats} />);

    expect(screen.getByText('Episodes Watched')).toBeInTheDocument();
    expect(screen.getByText('50,000')).toBeInTheDocument();
  });

  it('should display movies watched', () => {
    render(<PlatformOverviewCard stats={mockStats} />);

    expect(screen.getByText('Movies Watched')).toBeInTheDocument();
    expect(screen.getByText('10,000')).toBeInTheDocument();
  });

  it('should display total hours watched', () => {
    render(<PlatformOverviewCard stats={mockStats} />);

    expect(screen.getByText('Total Hours Watched')).toBeInTheDocument();
    expect(screen.getByText('75,000')).toBeInTheDocument();
  });

  it('should display average profiles per account', () => {
    render(<PlatformOverviewCard stats={mockStats} />);

    expect(screen.getByText('Avg Profiles/Account')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should display average episodes per account', () => {
    render(<PlatformOverviewCard stats={mockStats} />);

    expect(screen.getByText('Avg Episodes/Account')).toBeInTheDocument();
    expect(screen.getByText('333')).toBeInTheDocument();
  });

  it('should format large numbers with commas', () => {
    const largeStats = {
      ...mockStats,
      totalEpisodesWatched: 1234567,
      totalMoviesWatched: 987654,
    };
    render(<PlatformOverviewCard stats={largeStats} />);

    expect(screen.getByText('1,234,567')).toBeInTheDocument();
    expect(screen.getByText('987,654')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<PlatformOverviewCard stats={mockStats} isLoading={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render all stat items with icons', () => {
    const { container } = render(<PlatformOverviewCard stats={mockStats} />);

    const icons = container.querySelectorAll('svg');
    // Should have icons for all stat items
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should render dividers between sections', () => {
    render(<PlatformOverviewCard stats={mockStats} />);

    const dividers = screen.getAllByRole('separator');
    expect(dividers).toHaveLength(2);
  });

  it('should handle zero values', () => {
    const zeroStats = {
      totalAccounts: 0,
      activeAccounts: 0,
      totalProfiles: 0,
      totalShows: 0,
      totalMovies: 0,
      totalEpisodesWatched: 0,
      totalMoviesWatched: 0,
      totalHoursWatched: 0,
      averageProfilesPerAccount: 0,
      averageEpisodesPerAccount: 0,
    } as PlatformOverviewStats;

    render(<PlatformOverviewCard stats={zeroStats} />);

    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBeGreaterThan(0);
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<PlatformOverviewCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(<PlatformOverviewCard stats={mockStats} isLoading={true} />);

    expect(container).toMatchSnapshot();
  });
});
