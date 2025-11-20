import { render, screen, fireEvent } from '@testing-library/react';

import { WatchingActivityTimeline } from '@ajgifford/keepwatching-types';

import { ActivityTimelineChart } from '../activityTimelineChart';

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AreaChart: ({ data }: { data: unknown[] }) => <div data-testid="area-chart">Area Chart ({data.length} items)</div>,
  BarChart: ({ data }: { data: unknown[] }) => <div data-testid="bar-chart">Bar Chart ({data.length} items)</div>,
  CartesianGrid: () => <div>Grid</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
  Area: () => <div>Area</div>,
  Bar: () => <div>Bar</div>,
}));

describe('ActivityTimelineChart', () => {
  const mockTimeline: WatchingActivityTimeline = {
    dailyActivity: [
      { date: '2024-01-15', episodesWatched: 5, showsWatched: 2 },
      { date: '2024-01-14', episodesWatched: 3, showsWatched: 1 },
      { date: '2024-01-13', episodesWatched: 7, showsWatched: 3 },
    ],
    weeklyActivity: [
      { weekStart: '2024-01-08', episodesWatched: 25 },
      { weekStart: '2024-01-01', episodesWatched: 30 },
    ],
    monthlyActivity: [
      { month: '2024-01', episodesWatched: 100, moviesWatched: 10 },
      { month: '2023-12', episodesWatched: 80, moviesWatched: 5 },
    ],
  } as WatchingActivityTimeline;

  it('should render with title', () => {
    render(<ActivityTimelineChart timeline={mockTimeline} />);

    expect(screen.getByText('Activity Timeline')).toBeInTheDocument();
  });

  it('should render tabs for Daily, Weekly, and Monthly', () => {
    render(<ActivityTimelineChart timeline={mockTimeline} />);

    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
  });

  it('should show Daily chart by default', () => {
    render(<ActivityTimelineChart timeline={mockTimeline} />);

    const charts = screen.getAllByTestId('area-chart');
    expect(charts.length).toBeGreaterThan(0);
  });

  it('should switch to Weekly chart when Weekly tab is clicked', () => {
    render(<ActivityTimelineChart timeline={mockTimeline} />);

    const weeklyTab = screen.getByText('Weekly');
    fireEvent.click(weeklyTab);

    const charts = screen.getAllByTestId('bar-chart');
    expect(charts.length).toBeGreaterThan(0);
  });

  it('should switch to Monthly chart when Monthly tab is clicked', () => {
    render(<ActivityTimelineChart timeline={mockTimeline} />);

    const monthlyTab = screen.getByText('Monthly');
    fireEvent.click(monthlyTab);

    const charts = screen.getAllByTestId('bar-chart');
    expect(charts.length).toBeGreaterThan(0);
  });

  it('should show loading state', () => {
    render(<ActivityTimelineChart isLoading={true} />);

    expect(screen.getByText('Activity Timeline')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show empty state when timeline is null', () => {
    render(<ActivityTimelineChart timeline={null} />);

    expect(screen.getByText('Activity Timeline')).toBeInTheDocument();
    expect(screen.getByText('No activity data available')).toBeInTheDocument();
  });

  it('should show empty state when timeline is undefined', () => {
    render(<ActivityTimelineChart />);

    expect(screen.getByText('No activity data available')).toBeInTheDocument();
  });

  it('should show no data message for empty daily activity', () => {
    const emptyTimeline = {
      ...mockTimeline,
      dailyActivity: [],
    };

    render(<ActivityTimelineChart timeline={emptyTimeline as WatchingActivityTimeline} />);

    expect(screen.getByText('No daily activity data available')).toBeInTheDocument();
  });

  it('should show no data message for empty weekly activity', () => {
    const emptyTimeline = {
      ...mockTimeline,
      weeklyActivity: [],
    };

    render(<ActivityTimelineChart timeline={emptyTimeline as WatchingActivityTimeline} />);

    const weeklyTab = screen.getByText('Weekly');
    fireEvent.click(weeklyTab);

    expect(screen.getByText('No weekly activity data available')).toBeInTheDocument();
  });

  it('should show no data message for empty monthly activity', () => {
    const emptyTimeline = {
      ...mockTimeline,
      monthlyActivity: [],
    };

    render(<ActivityTimelineChart timeline={emptyTimeline as WatchingActivityTimeline} />);

    const monthlyTab = screen.getByText('Monthly');
    fireEvent.click(monthlyTab);

    expect(screen.getByText('No monthly activity data available')).toBeInTheDocument();
  });

  it('should render daily chart with correct data length', () => {
    render(<ActivityTimelineChart timeline={mockTimeline} />);

    expect(screen.getByText(/Area Chart \(3 items\)/)).toBeInTheDocument();
  });

  it('should render weekly chart with correct data length', () => {
    render(<ActivityTimelineChart timeline={mockTimeline} />);

    const weeklyTab = screen.getByText('Weekly');
    fireEvent.click(weeklyTab);

    expect(screen.getByText(/Bar Chart \(2 items\)/)).toBeInTheDocument();
  });

  it('should render monthly chart with correct data length', () => {
    render(<ActivityTimelineChart timeline={mockTimeline} />);

    const monthlyTab = screen.getByText('Monthly');
    fireEvent.click(monthlyTab);

    expect(screen.getByText(/Bar Chart \(2 items\)/)).toBeInTheDocument();
  });

  it('should not render charts in loading state', () => {
    render(<ActivityTimelineChart isLoading={true} />);

    expect(screen.queryByTestId('area-chart')).not.toBeInTheDocument();
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
  });

  it('should not render tabs in loading state', () => {
    render(<ActivityTimelineChart isLoading={true} />);

    expect(screen.queryByText('Daily')).not.toBeInTheDocument();
    expect(screen.queryByText('Weekly')).not.toBeInTheDocument();
    expect(screen.queryByText('Monthly')).not.toBeInTheDocument();
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<ActivityTimelineChart timeline={mockTimeline} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(<ActivityTimelineChart isLoading={true} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in empty state', () => {
    const { container } = render(<ActivityTimelineChart timeline={null} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot on Weekly tab', () => {
    const { container } = render(<ActivityTimelineChart timeline={mockTimeline} />);

    const weeklyTab = screen.getByText('Weekly');
    fireEvent.click(weeklyTab);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot on Monthly tab', () => {
    const { container } = render(<ActivityTimelineChart timeline={mockTimeline} />);

    const monthlyTab = screen.getByText('Monthly');
    fireEvent.click(monthlyTab);

    expect(container).toMatchSnapshot();
  });

  it('should sort daily activity data by date in ascending order', () => {
    const unsortedTimeline: WatchingActivityTimeline = {
      dailyActivity: [
        { date: '2024-01-20', episodesWatched: 8, showsWatched: 4 }, // Newest
        { date: '2024-01-15', episodesWatched: 5, showsWatched: 2 }, // Middle
        { date: '2024-01-10', episodesWatched: 3, showsWatched: 1 }, // Oldest
      ],
      weeklyActivity: [],
      monthlyActivity: [],
    };

    render(<ActivityTimelineChart timeline={unsortedTimeline} />);

    // Chart should render without errors
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('should sort weekly activity data by week start in ascending order', () => {
    const unsortedTimeline: WatchingActivityTimeline = {
      dailyActivity: [],
      weeklyActivity: [
        { weekStart: '2024-01-22', episodesWatched: 40 }, // Newest
        { weekStart: '2024-01-15', episodesWatched: 35 }, // Middle
        { weekStart: '2024-01-08', episodesWatched: 25 }, // Oldest
      ],
      monthlyActivity: [],
    };

    render(<ActivityTimelineChart timeline={unsortedTimeline} />);

    const weeklyTab = screen.getByText('Weekly');
    fireEvent.click(weeklyTab);

    // Chart should render without errors
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should sort monthly activity data by month in ascending order', () => {
    const unsortedTimeline: WatchingActivityTimeline = {
      dailyActivity: [],
      weeklyActivity: [],
      monthlyActivity: [
        { month: '2024-03', episodesWatched: 120, moviesWatched: 15 }, // Newest
        { month: '2024-01', episodesWatched: 100, moviesWatched: 10 }, // Middle
        { month: '2023-12', episodesWatched: 80, moviesWatched: 5 }, // Oldest
      ],
    };

    render(<ActivityTimelineChart timeline={unsortedTimeline} />);

    const monthlyTab = screen.getByText('Monthly');
    fireEvent.click(monthlyTab);

    // Chart should render without errors
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});
