import { render, screen } from '@testing-library/react';

import { ContentEngagementStats } from '@ajgifford/keepwatching-types';

import { ContentEngagementCard } from '../contentEngagementCard';

describe('ContentEngagementCard', () => {
  const mockStats: ContentEngagementStats = {
    contentType: 'show',
    title: 'Breaking Bad',
    totalProfiles: 100,
    completionRate: 45,
    abandonmentRate: 15,
    averageDaysToComplete: 30,
    completedProfiles: 45,
    watchingProfiles: 30,
    notStartedProfiles: 10,
    abandonedProfiles: 15,
    averageProgress: 65,
  } as ContentEngagementStats;

  it('should render with title', () => {
    render(<ContentEngagementCard stats={mockStats} />);

    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
  });

  it('should display TV icon for show content type', () => {
    const { container } = render(<ContentEngagementCard stats={mockStats} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should display Movie icon for movie content type', () => {
    const movieStats = { ...mockStats, contentType: 'movie' as const, title: 'Inception' };
    const { container } = render(<ContentEngagementCard stats={movieStats} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should display total profiles', () => {
    render(<ContentEngagementCard stats={mockStats} />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Total Profiles')).toBeInTheDocument();
  });

  it('should display completion rate', () => {
    render(<ContentEngagementCard stats={mockStats} />);

    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
  });

  it('should display abandonment rate', () => {
    render(<ContentEngagementCard stats={mockStats} />);

    expect(screen.getByText('15%')).toBeInTheDocument();
    expect(screen.getByText('Abandonment Rate')).toBeInTheDocument();
  });

  it('should display average days to complete', () => {
    render(<ContentEngagementCard stats={mockStats} />);

    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Avg Days to Complete')).toBeInTheDocument();
  });

  it('should display profile status distribution section', () => {
    render(<ContentEngagementCard stats={mockStats} />);

    expect(screen.getByText('Profile Status Distribution')).toBeInTheDocument();
  });

  it('should display completed profiles with percentage', () => {
    render(<ContentEngagementCard stats={mockStats} />);

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('45 (45%)')).toBeInTheDocument();
  });

  it('should display currently watching profiles with percentage', () => {
    render(<ContentEngagementCard stats={mockStats} />);

    expect(screen.getByText('Currently Watching')).toBeInTheDocument();
    expect(screen.getByText('30 (30%)')).toBeInTheDocument();
  });

  it('should display not started profiles with percentage', () => {
    render(<ContentEngagementCard stats={mockStats} />);

    expect(screen.getByText('Not Started')).toBeInTheDocument();
    expect(screen.getByText('10 (10%)')).toBeInTheDocument();
  });

  it('should display abandoned profiles with percentage', () => {
    render(<ContentEngagementCard stats={mockStats} />);

    expect(screen.getByText('Abandoned')).toBeInTheDocument();
    expect(screen.getByText('15 (15%)')).toBeInTheDocument();
  });

  it('should display average progress', () => {
    render(<ContentEngagementCard stats={mockStats} />);

    expect(screen.getByText('Average Progress')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('should not display check icon when average progress < 75', () => {
    const { container } = render(<ContentEngagementCard stats={mockStats} />);

    // The check icon should not be visible for progress < 75%
    const checkIcons = container.querySelectorAll('[data-testid="CheckCircleIcon"]');
    expect(checkIcons.length).toBe(0);
  });

  it('should display check icon when average progress >= 75', () => {
    const highProgressStats = { ...mockStats, averageProgress: 80 };
    const { container } = render(<ContentEngagementCard stats={highProgressStats as ContentEngagementStats} />);

    // The check icon should be visible for progress >= 75%
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should show loading state', () => {
    render(<ContentEngagementCard stats={mockStats} isLoading={true} />);

    expect(screen.getByText('Content Engagement')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Breaking Bad')).not.toBeInTheDocument();
  });

  it('should render progress bars for each status', () => {
    const { container } = render(<ContentEngagementCard stats={mockStats} />);

    const progressBars = container.querySelectorAll('.MuiLinearProgress-root');
    expect(progressBars).toHaveLength(4); // Completed, Watching, Not Started, Abandoned
  });

  it('should render dividers', () => {
    const { container } = render(<ContentEngagementCard stats={mockStats} />);

    const dividers = container.querySelectorAll('.MuiDivider-root');
    expect(dividers.length).toBeGreaterThan(0);
  });

  it('should calculate percentages correctly', () => {
    render(<ContentEngagementCard stats={mockStats} />);

    // 45/100 = 45%
    expect(screen.getByText('45 (45%)')).toBeInTheDocument();
    // 30/100 = 30%
    expect(screen.getByText('30 (30%)')).toBeInTheDocument();
    // 10/100 = 10%
    expect(screen.getByText('10 (10%)')).toBeInTheDocument();
    // 15/100 = 15%
    expect(screen.getByText('15 (15%)')).toBeInTheDocument();
  });

  it('should handle zero total profiles without errors', () => {
    const zeroStats = {
      ...mockStats,
      totalProfiles: 0,
      completedProfiles: 0,
      watchingProfiles: 0,
      notStartedProfiles: 0,
      abandonedProfiles: 0,
    };

    render(<ContentEngagementCard stats={zeroStats as ContentEngagementStats} />);

    const zeroElements = screen.getAllByText('0 (0%)');
    expect(zeroElements.length).toBeGreaterThan(0);
  });

  it('should format large numbers with commas', () => {
    const largeStats = {
      ...mockStats,
      totalProfiles: 5000,
      completedProfiles: 2500,
      watchingProfiles: 1500,
      notStartedProfiles: 500,
      abandonedProfiles: 500,
    };

    render(<ContentEngagementCard stats={largeStats as ContentEngagementStats} />);

    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('2,500 (50%)')).toBeInTheDocument();
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<ContentEngagementCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(<ContentEngagementCard stats={mockStats} isLoading={true} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with high progress', () => {
    const highProgressStats = { ...mockStats, averageProgress: 85 };
    const { container } = render(<ContentEngagementCard stats={highProgressStats as ContentEngagementStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with movie content type', () => {
    const movieStats = { ...mockStats, contentType: 'movie' as const, title: 'Inception' };
    const { container } = render(<ContentEngagementCard stats={movieStats} />);

    expect(container).toMatchSnapshot();
  });
});
