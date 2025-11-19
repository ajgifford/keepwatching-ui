import { render, screen } from '@testing-library/react';

import { MilestonesAndAnniversaryCard } from '../milestonesAndAnniversaryCard';
import { MilestoneStats } from '@ajgifford/keepwatching-types';

describe('MilestonesAndAnniversaryCard', () => {
  const mockStats: MilestoneStats = {
    totalEpisodesWatched: 750,
    totalMoviesWatched: 65,
    totalHoursWatched: 320,
    createdAt: '2023-01-15T12:00:00Z',
    milestones: [],
    firstEpisodeWatchedAt: '2023-01-20T12:00:00Z',
    firstEpisodeMetadata: {
      showName: 'Breaking Bad',
      seasonNumber: 1,
      episodeNumber: 1,
      episodeName: 'Pilot',
      profileName: 'John',
    },
    firstMovieWatchedAt: '2023-02-01T12:00:00Z',
    firstMovieMetadata: {
      movieName: 'Inception',
      profileName: 'Jane',
    },
    recentAchievements: [
      {
        description: 'Watched 500 episodes',
        achievedDate: '2024-10-01T12:00:00Z',
        metadata: {
          episodeCount: 500,
        },
      },
      {
        description: 'Watched 50 movies',
        achievedDate: '2024-09-15T12:00:00Z',
        metadata: {
          movieName: 'The Matrix',
        },
      },
    ],
  } as MilestoneStats;

  it('should render with title', () => {
    render(<MilestonesAndAnniversaryCard stats={mockStats} />);

    expect(screen.getByText('Milestones & Achievements')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<MilestonesAndAnniversaryCard stats={mockStats} isLoading={true} />);

    expect(screen.getByText('Milestones & Achievements')).toBeInTheDocument();
  });

  it('should display no data message when stats are null', () => {
    render(<MilestonesAndAnniversaryCard stats={null} />);

    expect(screen.getByText('No milestone data available')).toBeInTheDocument();
  });

  it('should display total episodes watched', () => {
    render(<MilestonesAndAnniversaryCard stats={mockStats} />);

    expect(screen.getByText('750')).toBeInTheDocument();
    expect(screen.getByText('Episodes')).toBeInTheDocument();
  });

  it('should display total movies watched', () => {
    render(<MilestonesAndAnniversaryCard stats={mockStats} />);

    expect(screen.getByText('65')).toBeInTheDocument();
    expect(screen.getByText('Movies')).toBeInTheDocument();
  });

  it('should display total hours watched', () => {
    render(<MilestonesAndAnniversaryCard stats={mockStats} />);

    expect(screen.getByText('320')).toBeInTheDocument();
    expect(screen.getByText('Hours')).toBeInTheDocument();
  });

  it('should display unlocked achievements count', () => {
    render(<MilestonesAndAnniversaryCard stats={mockStats} />);

    // Should show number of unlocked achievements
    const chip = screen.getByText(/Unlocked/);
    expect(chip).toBeInTheDocument();
  });

  it('should display member since section', () => {
    render(<MilestonesAndAnniversaryCard stats={mockStats} />);

    expect(screen.getByText('Member Since')).toBeInTheDocument();
    expect(screen.getByText('January 15, 2023')).toBeInTheDocument();
  });

  it('should display first episode watched section', () => {
    render(<MilestonesAndAnniversaryCard stats={mockStats} />);

    expect(screen.getByText('First Episode Watched')).toBeInTheDocument();
    expect(screen.getByText('Breaking Bad - S1E1: Pilot')).toBeInTheDocument();
  });

  it('should display first movie watched section', () => {
    render(<MilestonesAndAnniversaryCard stats={mockStats} />);

    expect(screen.getByText('First Movie Watched')).toBeInTheDocument();
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });

  it('should display recent achievements section', () => {
    render(<MilestonesAndAnniversaryCard stats={mockStats} />);

    expect(screen.getByText('Recent Achievements')).toBeInTheDocument();
    expect(screen.getByText('Watched 500 episodes')).toBeInTheDocument();
    expect(screen.getByText('Watched 50 movies')).toBeInTheDocument();
  });

  it('should display next milestones section', () => {
    render(<MilestonesAndAnniversaryCard stats={mockStats} />);

    expect(screen.getByText('Next Milestones')).toBeInTheDocument();
  });

  it('should render progress bars for next milestones', () => {
    const { container } = render(<MilestonesAndAnniversaryCard stats={mockStats} />);

    const progressBars = container.querySelectorAll('.MuiLinearProgress-root');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('should handle stats without first episode', () => {
    const statsWithoutFirstEpisode = {
      ...mockStats,
      firstEpisodeWatchedAt: undefined,
      firstEpisodeMetadata: undefined,
    };

    render(<MilestonesAndAnniversaryCard stats={statsWithoutFirstEpisode} />);

    expect(screen.queryByText('First Episode Watched')).not.toBeInTheDocument();
  });

  it('should handle stats without first movie', () => {
    const statsWithoutFirstMovie = {
      ...mockStats,
      firstMovieWatchedAt: undefined,
      firstMovieMetadata: undefined,
    };

    render(<MilestonesAndAnniversaryCard stats={statsWithoutFirstMovie} />);

    expect(screen.queryByText('First Movie Watched')).not.toBeInTheDocument();
  });

  it('should display unknown show when first episode metadata is null', () => {
    const statsWithNullMetadata = {
      ...mockStats,
      firstEpisodeMetadata: undefined,
    };

    render(<MilestonesAndAnniversaryCard stats={statsWithNullMetadata} />);

    expect(screen.getByText('Unknown Show')).toBeInTheDocument();
  });

  it('should display unknown movie when first movie metadata is null', () => {
    const statsWithNullMovieMetadata = {
      ...mockStats,
      firstMovieMetadata: undefined,
    };

    render(<MilestonesAndAnniversaryCard stats={statsWithNullMovieMetadata} />);

    expect(screen.getByText('Unknown Movie')).toBeInTheDocument();
  });

  it('should handle stats without recent achievements', () => {
    const statsWithoutAchievements = {
      ...mockStats,
      recentAchievements: [],
    };

    render(<MilestonesAndAnniversaryCard stats={statsWithoutAchievements} />);

    expect(screen.queryByText('Recent Achievements')).not.toBeInTheDocument();
  });

  it('should display average viewing rate when available', () => {
    render(<MilestonesAndAnniversaryCard stats={mockStats} />);

    expect(screen.getByText('Average Viewing Rate')).toBeInTheDocument();
    expect(screen.getByText('Episodes/Day')).toBeInTheDocument();
    expect(screen.getByText('Movies/Month')).toBeInTheDocument();
  });

  it('should render trophy icons', () => {
    const { container } = render(<MilestonesAndAnniversaryCard stats={mockStats} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should format large numbers with commas', () => {
    const largeStats = {
      ...mockStats,
      totalEpisodesWatched: 10000,
      totalMoviesWatched: 1000,
      totalHoursWatched: 5000,
    };

    render(<MilestonesAndAnniversaryCard stats={largeStats} />);

    expect(screen.getByText('10,000')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('5,000')).toBeInTheDocument();
  });

  it('should handle zero episodes and movies', () => {
    const zeroStats = {
      ...mockStats,
      totalEpisodesWatched: 0,
      totalMoviesWatched: 0,
      totalHoursWatched: 0,
    };

    render(<MilestonesAndAnniversaryCard stats={zeroStats} />);

    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<MilestonesAndAnniversaryCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(<MilestonesAndAnniversaryCard stats={mockStats} isLoading={true} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with null data', () => {
    const { container } = render(<MilestonesAndAnniversaryCard stats={null} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot without recent achievements', () => {
    const statsWithoutAchievements = {
      ...mockStats,
      recentAchievements: [],
    };

    const { container } = render(<MilestonesAndAnniversaryCard stats={statsWithoutAchievements} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot without first episode and movie', () => {
    const minimalStats = {
      ...mockStats,
      firstEpisodeWatchedAt: undefined,
      firstEpisodeMetadata: undefined,
      firstMovieWatchedAt: undefined,
      firstMovieMetadata: undefined,
    };

    const { container } = render(<MilestonesAndAnniversaryCard stats={minimalStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with zero watching data', () => {
    const zeroStats = {
      ...mockStats,
      totalEpisodesWatched: 0,
      totalMoviesWatched: 0,
      totalHoursWatched: 0,
    };

    const { container } = render(<MilestonesAndAnniversaryCard stats={zeroStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with large numbers', () => {
    const largeStats = {
      ...mockStats,
      totalEpisodesWatched: 10000,
      totalMoviesWatched: 1000,
      totalHoursWatched: 5000,
    };

    const { container } = render(<MilestonesAndAnniversaryCard stats={largeStats} />);

    expect(container).toMatchSnapshot();
  });
});
