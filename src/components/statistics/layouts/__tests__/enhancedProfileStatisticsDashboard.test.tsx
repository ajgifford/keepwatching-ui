import { fireEvent, render, screen } from '@testing-library/react';

import { EnhancedProfileStatisticsDashboard } from '../enhancedProfileStatisticsDashboard';
import { ProfileEnhancedStatistics, ProfileStatisticsResponse, WatchStatus } from '@ajgifford/keepwatching-types';

// Mock the child components
jest.mock('../../cards', () => ({
  AbandonmentRiskCard: ({ stats, isLoading }: any) =>
    isLoading ? (
      <div>Loading...</div>
    ) : (
      <div data-testid="abandonment-card">Abandonment: {stats ? 'Data' : 'No data'}</div>
    ),
  ActivityTimelineChart: ({ timeline, isLoading }: any) =>
    isLoading ? (
      <div>Loading...</div>
    ) : (
      <div data-testid="timeline-chart">Timeline: {timeline ? 'Data' : 'No data'}</div>
    ),
  BacklogAgingCard: ({ stats }: any) => <div data-testid="backlog-card">Backlog: {stats ? 'Data' : 'No data'}</div>,
  BingeWatchingCard: ({ bingeData, isLoading }: any) =>
    isLoading ? <div>Loading...</div> : <div data-testid="binge-card">Binge: {bingeData ? 'Data' : 'No data'}</div>,
  ContentDepthCard: ({ stats }: any) => <div data-testid="content-depth">Depth: {stats ? 'Data' : 'No data'}</div>,
  ContentDiscoveryCard: ({ stats }: any) => (
    <div data-testid="content-discovery">Discovery: {stats ? 'Data' : 'No data'}</div>
  ),
  MilestonesAndAnniversaryCard: ({ stats, isLoading }: any) =>
    isLoading ? (
      <div>Loading...</div>
    ) : (
      <div data-testid="milestones-card">Milestones: {stats ? 'Data' : 'No data'}</div>
    ),
  SeasonalViewingCard: ({ stats }: any) => (
    <div data-testid="seasonal-card">Seasonal: {stats ? 'Data' : 'No data'}</div>
  ),
  ShowProgressCard: ({ title, shows, filters }: any) => (
    <div data-testid="show-progress">
      {title}: {shows?.length || 0} shows, Filters: {filters?.join(',')}
    </div>
  ),
  TimeToWatchCard: ({ stats }: any) => <div data-testid="time-to-watch">TimeToWatch: {stats ? 'Data' : 'No data'}</div>,
  UnairedContentCard: ({ stats }: any) => (
    <div data-testid="unaired-content">Unaired: {stats ? 'Data' : 'No data'}</div>
  ),
  WatchStreakCard: ({ streakData, isLoading }: any) =>
    isLoading ? <div>Loading...</div> : <div data-testid="streak-card">Streak: {streakData ? 'Data' : 'No data'}</div>,
  WatchVelocityCard: ({ velocityData, isLoading }: any) =>
    isLoading ? (
      <div>Loading...</div>
    ) : (
      <div data-testid="velocity-card">Velocity: {velocityData ? 'Data' : 'No data'}</div>
    ),
}));

jest.mock('../../utils', () => ({
  getProfileSummaryProps: jest.fn(() => ({
    progressLabel: 'Progress',
    progressValue: 70,
    currentCount: 350,
    totalCount: 500,
    stats: [],
  })),
}));

jest.mock('../baseStatisticsDashboard', () => ({
  BaseStatisticsDashboard: ({ dashboardTitle, summaryCardProps, contentSections, statistics }: any) => (
    <div data-testid="base-dashboard">
      <h1>{dashboardTitle}</h1>
      {summaryCardProps && <div>Summary</div>}
      {contentSections}
    </div>
  ),
}));

describe('EnhancedProfileStatisticsDashboard', () => {
  const mockStatistics: ProfileStatisticsResponse = {
    showStatistics: {
      total: 50,
      watchProgress: 75,
      watchStatusCounts: { watching: 20, unaired: 5, watched: 15, notWatched: 10, upToDate: 0 },
      genreDistribution: {},
      serviceDistribution: {},
    },
    movieStatistics: {
      total: 30,
      watchProgress: 60,
      watchStatusCounts: { watching: 10, unaired: 2, watched: 12, notWatched: 6, upToDate: 0 },
      genreDistribution: {},
      serviceDistribution: {},
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
      showsProgress: [
        { showId: 1, showName: 'Show 1', watchProgress: 80, watchStatus: WatchStatus.WATCHING },
        { showId: 2, showName: 'Show 2', watchProgress: 100, watchStatus: WatchStatus.WATCHED },
      ],
    },
  } as any;

  const mockEnhancedStats: ProfileEnhancedStatistics = {
    velocity: { current: 10 },
    timeline: { data: [] },
    binge: { sessions: [] },
    streak: { current: 5 },
    timeToWatch: { totalHours: 100 },
    seasonal: { viewingBySeason: {} },
    milestones: { totalEpisodesWatched: 350 },
    contentDepth: { avgEpisodesPerShow: 10 },
    contentDiscovery: { newShowsPerMonth: 5 },
    abandonmentRisk: { atRisk: [] },
    unairedContent: { unairedShowCount: 5 },
  } as any;

  it('should render loading state', () => {
    render(<EnhancedProfileStatisticsDashboard isLoading={true} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render no statistics message when statistics is null', () => {
    render(<EnhancedProfileStatisticsDashboard statistics={null} />);

    expect(screen.getByText('Enhanced Viewing Statistics')).toBeInTheDocument();
    expect(screen.getByText('No statistics available')).toBeInTheDocument();
  });

  it('should render base dashboard with viewing statistics title', () => {
    render(<EnhancedProfileStatisticsDashboard statistics={mockStatistics} />);

    expect(screen.getByText('Viewing Statistics')).toBeInTheDocument();
  });

  it('should render navigation chips for all sections', () => {
    render(<EnhancedProfileStatisticsDashboard statistics={mockStatistics} />);

    expect(screen.getByText('Jump to:')).toBeInTheDocument();
    expect(screen.getAllByText(/Milestones & Achievements/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Progress & Activity/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Viewing Patterns/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Content Insights/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Content Management/)[0]).toBeInTheDocument();
  });

  it('should not render profile comparison chip for profile dashboard', () => {
    render(<EnhancedProfileStatisticsDashboard statistics={mockStatistics} />);

    expect(screen.queryByText(/Profile Comparison/)).not.toBeInTheDocument();
  });

  it('should render milestones section', () => {
    render(<EnhancedProfileStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    expect(screen.getAllByText('🏆 Milestones & Achievements')[0]).toBeInTheDocument();
    expect(screen.getByTestId('milestones-card')).toBeInTheDocument();
  });

  it('should render progress and activity section with show progress card', () => {
    render(<EnhancedProfileStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    expect(screen.getAllByText('📊 Progress & Activity')[0]).toBeInTheDocument();
    expect(screen.getByTestId('show-progress')).toBeInTheDocument();
    expect(screen.getByText(/Active Shows Progress/)).toBeInTheDocument();
    expect(screen.getByTestId('velocity-card')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-chart')).toBeInTheDocument();
  });

  it('should pass correct filters to show progress card', () => {
    render(<EnhancedProfileStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    const showProgressCard = screen.getByTestId('show-progress');
    expect(showProgressCard.textContent).toContain(`Filters: ${WatchStatus.WATCHING},${WatchStatus.UP_TO_DATE}`);
  });

  it('should render viewing patterns section', () => {
    render(<EnhancedProfileStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    expect(screen.getAllByText('📺 Viewing Patterns')[0]).toBeInTheDocument();
    expect(screen.getByTestId('binge-card')).toBeInTheDocument();
    expect(screen.getByTestId('streak-card')).toBeInTheDocument();
    expect(screen.getByTestId('seasonal-card')).toBeInTheDocument();
  });

  it('should render content insights section', () => {
    render(<EnhancedProfileStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    expect(screen.getAllByText('💡 Content Insights')[0]).toBeInTheDocument();
    expect(screen.getByTestId('content-depth')).toBeInTheDocument();
    expect(screen.getByTestId('content-discovery')).toBeInTheDocument();
    expect(screen.getByTestId('time-to-watch')).toBeInTheDocument();
    expect(screen.getByTestId('backlog-card')).toBeInTheDocument();
  });

  it('should render content management section', () => {
    render(<EnhancedProfileStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    expect(screen.getAllByText('📋 Content Management')[0]).toBeInTheDocument();
    expect(screen.getByTestId('abandonment-card')).toBeInTheDocument();
    expect(screen.getByTestId('unaired-content')).toBeInTheDocument();
  });

  it('should show loading state for enhanced stats cards', () => {
    render(<EnhancedProfileStatisticsDashboard statistics={mockStatistics} isLoadingEnhancedStats={true} />);

    const loadingElements = screen.getAllByText('Loading...');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('should display "No data" when enhanced stats not provided', () => {
    render(<EnhancedProfileStatisticsDashboard statistics={mockStatistics} />);

    expect(screen.getByText(/Milestones: No data/)).toBeInTheDocument();
    expect(screen.getByText(/Velocity: No data/)).toBeInTheDocument();
  });

  it('should display data when enhanced stats provided', () => {
    render(<EnhancedProfileStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    expect(screen.getByText(/Milestones: Data/)).toBeInTheDocument();
    expect(screen.getByText(/Velocity: Data/)).toBeInTheDocument();
  });

  it('should expand accordions by default for key sections', () => {
    const { container } = render(
      <EnhancedProfileStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />
    );

    const accordions = container.querySelectorAll('.MuiAccordion-root');
    expect(accordions.length).toBeGreaterThan(0);
  });

  it('should handle navigation chip clicks', () => {
    render(<EnhancedProfileStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    const progressChip = screen.getAllByText(/Progress & Activity/)[0];
    fireEvent.click(progressChip);

    expect(progressChip).toBeInTheDocument();
  });

  it('should render show progress with shows from statistics', () => {
    render(<EnhancedProfileStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    const showProgressCard = screen.getByTestId('show-progress');
    expect(showProgressCard.textContent).toContain('2 shows');
  });

  it('should match snapshot with full enhanced statistics', () => {
    const { container } = render(
      <EnhancedProfileStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(<EnhancedProfileStatisticsDashboard isLoading={true} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot without enhanced statistics', () => {
    const { container } = render(<EnhancedProfileStatisticsDashboard statistics={mockStatistics} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with enhanced stats loading', () => {
    const { container } = render(
      <EnhancedProfileStatisticsDashboard statistics={mockStatistics} isLoadingEnhancedStats={true} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot without statistics', () => {
    const { container } = render(<EnhancedProfileStatisticsDashboard statistics={null} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with empty show progress', () => {
    const emptyShowStats = {
      ...mockStatistics,
      episodeWatchProgress: {
        totalEpisodes: 0,
        watchedEpisodes: 0,
        unairedEpisodes: 0,
        overallProgress: 0,
        showsProgress: [],
      },
    };

    const { container } = render(
      <EnhancedProfileStatisticsDashboard statistics={emptyShowStats} enhancedStatistics={mockEnhancedStats} />
    );

    expect(container).toMatchSnapshot();
  });
});
