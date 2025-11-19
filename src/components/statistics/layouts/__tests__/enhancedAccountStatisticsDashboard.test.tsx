import { fireEvent, render, screen } from '@testing-library/react';

import { EnhancedAccountStatisticsDashboard } from '../enhancedAccountStatisticsDashboard';
import { AccountEnhancedStatistics, AccountStatisticsResponse } from '@ajgifford/keepwatching-types';

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
  ContentBreakdownCard: ({ title, items }: any) => (
    <div data-testid="content-breakdown">
      {title}: {items.length} items
    </div>
  ),
  ContentDepthCard: ({ stats }: any) => <div data-testid="content-depth">Depth: {stats ? 'Data' : 'No data'}</div>,
  ContentDiscoveryCard: ({ stats }: any) => (
    <div data-testid="content-discovery">Discovery: {stats ? 'Data' : 'No data'}</div>
  ),
  ContentSummaryCard: ({ title, children }: any) => (
    <div data-testid="content-summary">
      {title}: {children}
    </div>
  ),
  MilestonesAndAnniversaryCard: ({ stats, isLoading }: any) =>
    isLoading ? (
      <div>Loading...</div>
    ) : (
      <div data-testid="milestones-card">Milestones: {stats ? 'Data' : 'No data'}</div>
    ),
  ProfileComparisonCard: ({ stats, isLoading }: any) =>
    isLoading ? (
      <div>Loading...</div>
    ) : (
      <div data-testid="profile-comparison">Comparison: {stats ? 'Data' : 'No data'}</div>
    ),
  SeasonalViewingCard: ({ stats }: any) => (
    <div data-testid="seasonal-card">Seasonal: {stats ? 'Data' : 'No data'}</div>
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
  getAccountSummaryProps: jest.fn(() => ({
    progressLabel: 'Progress',
    progressValue: 70,
    currentCount: 350,
    totalCount: 500,
    stats: [],
  })),
  getTopCategory: jest.fn(() => 'Watching'),
  getTopCategoryPercentage: jest.fn(() => 45),
}));

jest.mock('../baseStatisticsDashboard', () => ({
  BaseStatisticsDashboard: ({ dashboardTitle, summaryCardProps, contentSections }: any) => (
    <div data-testid="base-dashboard">
      <h1>{dashboardTitle}</h1>
      {summaryCardProps && <div>Summary</div>}
      {contentSections}
    </div>
  ),
}));

describe('EnhancedAccountStatisticsDashboard', () => {
  const mockStatistics = {
    profileCount: 3,
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
    uniqueContent: {
      showCount: 45,
      movieCount: 28,
    },
  } as any as AccountStatisticsResponse;

  const mockEnhancedStats: AccountEnhancedStatistics = {
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
    profileComparison: { profileCount: 3 },
  } as any;

  it('should render loading state', () => {
    render(<EnhancedAccountStatisticsDashboard isLoading={true} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should return null when no statistics', () => {
    const { container } = render(<EnhancedAccountStatisticsDashboard statistics={null} />);

    expect(container.firstChild).toBeNull();
  });

  it('should render base dashboard with account title', () => {
    render(<EnhancedAccountStatisticsDashboard statistics={mockStatistics} />);

    expect(screen.getByText('Account Statistics')).toBeInTheDocument();
  });

  it('should render content breakdown card', () => {
    render(<EnhancedAccountStatisticsDashboard statistics={mockStatistics} />);

    expect(screen.getByTestId('content-breakdown')).toBeInTheDocument();
    expect(screen.getByText(/Content Breakdown: 3 items/)).toBeInTheDocument();
  });

  it('should render content summary card', () => {
    render(<EnhancedAccountStatisticsDashboard statistics={mockStatistics} />);

    expect(screen.getByTestId('content-summary')).toBeInTheDocument();
  });

  it('should render navigation chips for all sections', () => {
    render(<EnhancedAccountStatisticsDashboard statistics={mockStatistics} />);

    expect(screen.getByText('Jump to:')).toBeInTheDocument();
    expect(screen.getAllByText(/Profile Comparison/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Milestones & Achievements/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Progress & Activity/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Viewing Patterns/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Content Insights/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Content Management/)[0]).toBeInTheDocument();
  });

  it('should render profile comparison section when multiple profiles', () => {
    render(<EnhancedAccountStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    expect(screen.getAllByText('👥 Profile Comparison')[0]).toBeInTheDocument();
    expect(screen.getByTestId('profile-comparison')).toBeInTheDocument();
  });

  it('should not render profile comparison section when single profile', () => {
    const singleProfileStats = { ...mockStatistics, profileCount: 1 };

    render(
      <EnhancedAccountStatisticsDashboard statistics={singleProfileStats} enhancedStatistics={mockEnhancedStats} />
    );

    expect(screen.queryByText('👥 Profile Comparison')).not.toBeInTheDocument();
  });

  it('should render milestones section', () => {
    render(<EnhancedAccountStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    expect(screen.getAllByText('🏆 Milestones & Achievements')[0]).toBeInTheDocument();
    expect(screen.getByTestId('milestones-card')).toBeInTheDocument();
  });

  it('should render progress and activity section', () => {
    render(<EnhancedAccountStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    expect(screen.getAllByText('📊 Progress & Activity')[0]).toBeInTheDocument();
    expect(screen.getByTestId('velocity-card')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-chart')).toBeInTheDocument();
  });

  it('should render viewing patterns section', () => {
    render(<EnhancedAccountStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    expect(screen.getAllByText('📺 Viewing Patterns')[0]).toBeInTheDocument();
    expect(screen.getByTestId('binge-card')).toBeInTheDocument();
    expect(screen.getByTestId('streak-card')).toBeInTheDocument();
    expect(screen.getByTestId('seasonal-card')).toBeInTheDocument();
  });

  it('should render content insights section', () => {
    render(<EnhancedAccountStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    expect(screen.getAllByText('💡 Content Insights')[0]).toBeInTheDocument();
    expect(screen.getByTestId('content-depth')).toBeInTheDocument();
    expect(screen.getByTestId('content-discovery')).toBeInTheDocument();
    expect(screen.getByTestId('time-to-watch')).toBeInTheDocument();
    expect(screen.getByTestId('backlog-card')).toBeInTheDocument();
  });

  it('should render content management section', () => {
    render(<EnhancedAccountStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    expect(screen.getAllByText('📋 Content Management')[0]).toBeInTheDocument();
    expect(screen.getByTestId('abandonment-card')).toBeInTheDocument();
    expect(screen.getByTestId('unaired-content')).toBeInTheDocument();
  });

  it('should show loading state for enhanced stats cards', () => {
    render(<EnhancedAccountStatisticsDashboard statistics={mockStatistics} isLoadingEnhancedStats={true} />);

    // Check that loading state is shown for cards
    const loadingElements = screen.getAllByText('Loading...');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('should display "No data" when enhanced stats not provided', () => {
    render(<EnhancedAccountStatisticsDashboard statistics={mockStatistics} />);

    expect(screen.getByText(/Milestones: No data/)).toBeInTheDocument();
    expect(screen.getByText(/Velocity: No data/)).toBeInTheDocument();
  });

  it('should display data when enhanced stats provided', () => {
    render(<EnhancedAccountStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    expect(screen.getByText(/Milestones: Data/)).toBeInTheDocument();
    expect(screen.getByText(/Velocity: Data/)).toBeInTheDocument();
  });

  it('should expand accordions by default for key sections', () => {
    const { container } = render(
      <EnhancedAccountStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />
    );

    // Check that milestones and progress sections are expanded by default
    const accordions = container.querySelectorAll('.MuiAccordion-root');
    expect(accordions.length).toBeGreaterThan(0);
  });

  it('should handle navigation chip clicks', () => {
    render(<EnhancedAccountStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />);

    const progressChip = screen.getAllByText(/Progress & Activity/)[0];
    fireEvent.click(progressChip);

    // The click should trigger scrollIntoView (which is mocked in test environment)
    expect(progressChip).toBeInTheDocument();
  });

  it('should match snapshot with full enhanced statistics', () => {
    const { container } = render(
      <EnhancedAccountStatisticsDashboard statistics={mockStatistics} enhancedStatistics={mockEnhancedStats} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(<EnhancedAccountStatisticsDashboard isLoading={true} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot without enhanced statistics', () => {
    const { container } = render(<EnhancedAccountStatisticsDashboard statistics={mockStatistics} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with enhanced stats loading', () => {
    const { container } = render(
      <EnhancedAccountStatisticsDashboard statistics={mockStatistics} isLoadingEnhancedStats={true} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with single profile', () => {
    const singleProfileStats = { ...mockStatistics, profileCount: 1 };

    const { container } = render(
      <EnhancedAccountStatisticsDashboard statistics={singleProfileStats} enhancedStatistics={mockEnhancedStats} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot without statistics', () => {
    const { container } = render(<EnhancedAccountStatisticsDashboard statistics={null} />);

    expect(container).toMatchSnapshot();
  });
});
