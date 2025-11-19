import { fireEvent, render, screen } from '@testing-library/react';

import { ProfileComparisonCard } from '../profileComparisonCard';
import { ProfileComparisonStats } from '@ajgifford/keepwatching-types';

describe('ProfileComparisonCard', () => {
  const mockStats: ProfileComparisonStats = {
    accountId: 123,
    profileCount: 3,
    accountSummary: {
      totalUniqueShows: 125,
      totalUniqueMovies: 87,
      mostWatchedShow: {
        title: 'Breaking Bad',
        watchCount: 2,
      },
      mostWatchedMovie: {
        title: 'Inception',
        watchCount: 2,
      },
    },
    profiles: [
      {
        profileId: 1,
        profileName: 'John',
        episodesWatched: 1500,
        moviesWatched: 75,
        totalHoursWatched: 650,
        currentlyWatchingCount: 5,
        completedShowsCount: 25,
        episodesPerWeek: 12.5,
        mostActiveDay: 'Saturday',
        lastActivityDate: '2024-11-15T12:00:00Z',
        showWatchProgress: 75,
        movieWatchProgress: 60,
        totalShows: 30,
        totalMovies: 80,
        topGenres: [
          { genre: 'Drama', count: 15 },
          { genre: 'Comedy', count: 10 },
        ],
        topServices: [
          { service: 'Netflix', count: 20 },
          { service: 'HBO', count: 10 },
        ],
      },
      {
        profileId: 2,
        profileName: 'Jane',
        episodesWatched: 1200,
        moviesWatched: 90,
        totalHoursWatched: 580,
        currentlyWatchingCount: 3,
        completedShowsCount: 20,
        episodesPerWeek: 10.0,
        mostActiveDay: 'Friday',
        lastActivityDate: '2024-11-14T12:00:00Z',
        showWatchProgress: 80,
        movieWatchProgress: 70,
        totalShows: 25,
        totalMovies: 95,
        topGenres: [
          { genre: 'Action', count: 12 },
          { genre: 'Sci-Fi', count: 8 },
        ],
        topServices: [
          { service: 'Disney+', count: 15 },
          { service: 'Amazon', count: 12 },
        ],
      },
    ],
  } as ProfileComparisonStats;

  it('should render with title', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    expect(screen.getByText('Profile Comparison (3 profiles)')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<ProfileComparisonCard stats={mockStats} isLoading={true} />);

    expect(screen.getByText('Profile Comparison')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display no data message when stats are null', () => {
    render(<ProfileComparisonCard stats={null} />);

    expect(screen.getByText('No comparison data available')).toBeInTheDocument();
  });

  it('should display total unique shows', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    expect(screen.getByText('125')).toBeInTheDocument();
    expect(screen.getByText('Unique Shows')).toBeInTheDocument();
  });

  it('should display total unique movies', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    expect(screen.getByText('87')).toBeInTheDocument();
    expect(screen.getByText('Unique Movies')).toBeInTheDocument();
  });

  it('should display most watched show', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    expect(screen.getByText('Most Watched Show')).toBeInTheDocument();
    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
    // Both most watched show and movie have "2 profiles"
    expect(screen.getAllByText('2 profiles').length).toBeGreaterThan(0);
  });

  it('should display most watched movie', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    expect(screen.getByText('Most Watched Movie')).toBeInTheDocument();
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });

  it('should render all three tabs', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Watching Stats')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
  });

  it('should display profile names on overview tab', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('should display episodes watched for each profile', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    expect(screen.getByText('1,500')).toBeInTheDocument();
    expect(screen.getByText('1,200')).toBeInTheDocument();
  });

  it('should display movies watched for each profile', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
  });

  it('should display currently watching count', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    expect(screen.getByText('5 watching')).toBeInTheDocument();
    expect(screen.getByText('3 watching')).toBeInTheDocument();
  });

  it('should display completed shows count', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    expect(screen.getByText('25 completed')).toBeInTheDocument();
    expect(screen.getByText('20 completed')).toBeInTheDocument();
  });

  it('should switch to watching stats tab when clicked', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    const watchingStatsTab = screen.getByText('Watching Stats');
    fireEvent.click(watchingStatsTab);

    // Multiple profiles have these labels
    expect(screen.getAllByText('Show Progress').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Movie Progress').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Velocity').length).toBeGreaterThan(0);
  });

  it('should display show progress on watching stats tab', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    const watchingStatsTab = screen.getByText('Watching Stats');
    fireEvent.click(watchingStatsTab);

    expect(screen.getByText('75% - 30 shows')).toBeInTheDocument();
    expect(screen.getByText('80% - 25 shows')).toBeInTheDocument();
  });

  it('should display movie progress on watching stats tab', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    const watchingStatsTab = screen.getByText('Watching Stats');
    fireEvent.click(watchingStatsTab);

    expect(screen.getByText('60% - 80 movies')).toBeInTheDocument();
    expect(screen.getByText('70% - 95 movies')).toBeInTheDocument();
  });

  it('should display episodes per week on watching stats tab', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    const watchingStatsTab = screen.getByText('Watching Stats');
    fireEvent.click(watchingStatsTab);

    expect(screen.getByText('12.5 eps/week')).toBeInTheDocument();
    expect(screen.getByText('10.0 eps/week')).toBeInTheDocument();
  });

  it('should display most active day on watching stats tab', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    const watchingStatsTab = screen.getByText('Watching Stats');
    fireEvent.click(watchingStatsTab);

    expect(screen.getByText('Most active: Saturday')).toBeInTheDocument();
    expect(screen.getByText('Most active: Friday')).toBeInTheDocument();
  });

  it('should switch to preferences tab when clicked', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    const preferencesTab = screen.getByText('Preferences');
    fireEvent.click(preferencesTab);

    // There are multiple profiles, so "Top Genres" and "Top Services" appear multiple times
    expect(screen.getAllByText('Top Genres').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Top Services').length).toBeGreaterThan(0);
  });

  it('should display top genres on preferences tab', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    const preferencesTab = screen.getByText('Preferences');
    fireEvent.click(preferencesTab);

    expect(screen.getByText('Drama (15)')).toBeInTheDocument();
    expect(screen.getByText('Comedy (10)')).toBeInTheDocument();
    expect(screen.getByText('Action (12)')).toBeInTheDocument();
    expect(screen.getByText('Sci-Fi (8)')).toBeInTheDocument();
  });

  it('should display top services on preferences tab', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    const preferencesTab = screen.getByText('Preferences');
    fireEvent.click(preferencesTab);

    expect(screen.getByText('Netflix (20)')).toBeInTheDocument();
    expect(screen.getByText('HBO (10)')).toBeInTheDocument();
    expect(screen.getByText('Disney+ (15)')).toBeInTheDocument();
    expect(screen.getByText('Amazon (12)')).toBeInTheDocument();
  });

  it('should display "No genre data" when profile has no genres', () => {
    const noGenresStats = {
      ...mockStats,
      profiles: [
        {
          ...mockStats.profiles[0],
          topGenres: [],
        },
      ],
    };

    render(<ProfileComparisonCard stats={noGenresStats} />);

    const preferencesTab = screen.getByText('Preferences');
    fireEvent.click(preferencesTab);

    expect(screen.getByText('No genre data')).toBeInTheDocument();
  });

  it('should display "No service data" when profile has no services', () => {
    const noServicesStats = {
      ...mockStats,
      profiles: [
        {
          ...mockStats.profiles[0],
          topServices: [],
        },
      ],
    };

    render(<ProfileComparisonCard stats={noServicesStats} />);

    const preferencesTab = screen.getByText('Preferences');
    fireEvent.click(preferencesTab);

    expect(screen.getByText('No service data')).toBeInTheDocument();
  });

  it('should display last activity date', () => {
    render(<ProfileComparisonCard stats={mockStats} />);

    // formatDate displays the date in locale format
    expect(screen.getByText(/Last activity: (Nov 15, 2024|11\/15\/2024)/)).toBeInTheDocument();
    expect(screen.getByText(/Last activity: (Nov 14, 2024|11\/14\/2024)/)).toBeInTheDocument();
  });

  it('should render progress bars', () => {
    const { container } = render(<ProfileComparisonCard stats={mockStats} />);

    const progressBars = container.querySelectorAll('.MuiLinearProgress-root');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('should render icons', () => {
    const { container } = render(<ProfileComparisonCard stats={mockStats} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should format large numbers with commas', () => {
    const largeStats = {
      ...mockStats,
      accountSummary: {
        ...mockStats.accountSummary,
        totalUniqueShows: 5000,
        totalUniqueMovies: 3000,
      },
    };

    render(<ProfileComparisonCard stats={largeStats} />);

    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('3,000')).toBeInTheDocument();
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<ProfileComparisonCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(<ProfileComparisonCard stats={mockStats} isLoading={true} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with null data', () => {
    const { container } = render(<ProfileComparisonCard stats={null} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with watching stats tab', () => {
    const { container } = render(<ProfileComparisonCard stats={mockStats} />);

    const watchingStatsTab = screen.getByText('Watching Stats');
    fireEvent.click(watchingStatsTab);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with preferences tab', () => {
    const { container } = render(<ProfileComparisonCard stats={mockStats} />);

    const preferencesTab = screen.getByText('Preferences');
    fireEvent.click(preferencesTab);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot without most watched show', () => {
    const noMostWatchedStats = {
      ...mockStats,
      accountSummary: {
        ...mockStats.accountSummary,
        mostWatchedShow: null,
      },
    };

    const { container } = render(<ProfileComparisonCard stats={noMostWatchedStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot without most watched movie', () => {
    const noMostWatchedMovieStats = {
      ...mockStats,
      accountSummary: {
        ...mockStats.accountSummary,
        mostWatchedMovie: null,
      },
    };

    const { container } = render(<ProfileComparisonCard stats={noMostWatchedMovieStats} />);

    expect(container).toMatchSnapshot();
  });
});
