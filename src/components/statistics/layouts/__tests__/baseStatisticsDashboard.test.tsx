import { render, screen } from '@testing-library/react';

import { AccountStatisticsResponse } from '@ajgifford/keepwatching-types';

import { BaseStatisticsDashboard, BaseStatisticsDashboardProps } from '../baseStatisticsDashboard';

// Mock the child components and hooks
const mockUseStatisticsData = jest.fn();

jest.mock('../../../index', () => ({
  DistributionBarChart: ({ data }: { data: any[] }) => <div data-testid="bar-chart">{data.length} bars</div>,
  DistributionPieChart: ({ data }: { data: any[] }) => <div data-testid="pie-chart">{data.length} slices</div>,
  StatisticsSummaryCard: (props: any) => (
    <div data-testid="summary-card">
      {props.progressLabel}: {props.progressValue}%
    </div>
  ),
  WatchStatusChart: ({ data }: { data: any[] }) => <div data-testid="watch-status-chart">{data.length} items</div>,
  useStatisticsData: (stats: any) => mockUseStatisticsData(stats),
}));

describe('BaseStatisticsDashboard', () => {
  const mockStatistics: AccountStatisticsResponse = {
    profileCount: 3,
    showStatistics: {
      total: 50,
      watchProgress: 75,
      watchStatusCounts: {},
    },
    movieStatistics: {
      total: 30,
      watchProgress: 60,
      watchStatusCounts: {},
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
  } as AccountStatisticsResponse;

  const mockSummaryCardProps: BaseStatisticsDashboardProps['summaryCardProps'] = {
    progressLabel: 'Overall Progress',
    progressValue: 70,
    currentCount: 350,
    totalCount: 500,
    stats: [
      { value: 50, label: 'Shows', color: 'primary' },
      { value: 30, label: 'Movies', color: 'secondary' },
    ],
  };

  beforeEach(() => {
    mockUseStatisticsData.mockReturnValue({
      watchStatusData: [
        { name: 'Watching', value: 10 },
        { name: 'Completed', value: 20 },
      ],
      genreData: [
        { name: 'Drama', value: 15 },
        { name: 'Comedy', value: 10 },
      ],
      serviceData: [
        { name: 'Netflix', value: 25 },
        { name: 'Disney+', value: 15 },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    render(
      <BaseStatisticsDashboard
        dashboardTitle="Test Dashboard"
        summaryCardProps={mockSummaryCardProps}
        isLoading={true}
      />,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render empty state when no statistics', () => {
    render(
      <BaseStatisticsDashboard
        dashboardTitle="Test Dashboard"
        summaryCardProps={mockSummaryCardProps}
        statistics={null}
      />,
    );

    expect(screen.getByText('No statistics available')).toBeInTheDocument();
  });

  it('should render dashboard title', () => {
    render(
      <BaseStatisticsDashboard
        dashboardTitle="Account Statistics"
        summaryCardProps={mockSummaryCardProps}
        statistics={mockStatistics}
      />,
    );

    expect(screen.getByText('Account Statistics')).toBeInTheDocument();
  });

  it('should render summary card when summaryCardProps provided', () => {
    render(
      <BaseStatisticsDashboard
        dashboardTitle="Test Dashboard"
        summaryCardProps={mockSummaryCardProps}
        statistics={mockStatistics}
      />,
    );

    expect(screen.getByTestId('summary-card')).toBeInTheDocument();
    expect(screen.getByText(/Overall Progress: 70%/)).toBeInTheDocument();
  });

  it('should not render summary card when summaryCardProps is null', () => {
    render(
      <BaseStatisticsDashboard
        dashboardTitle="Test Dashboard"
        summaryCardProps={null}
        statistics={mockStatistics}
      />,
    );

    expect(screen.queryByTestId('summary-card')).not.toBeInTheDocument();
  });

  it('should render watch status chart', () => {
    render(
      <BaseStatisticsDashboard
        dashboardTitle="Test Dashboard"
        summaryCardProps={mockSummaryCardProps}
        statistics={mockStatistics}
      />,
    );

    expect(screen.getByText('Watch Status')).toBeInTheDocument();
    expect(screen.getByTestId('watch-status-chart')).toBeInTheDocument();
  });

  it('should render genre pie chart when genre data available', () => {
    render(
      <BaseStatisticsDashboard
        dashboardTitle="Test Dashboard"
        summaryCardProps={mockSummaryCardProps}
        statistics={mockStatistics}
      />,
    );

    expect(screen.getByText('Top Genres')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('should display no genre data message when genre data is empty', () => {
    mockUseStatisticsData.mockReturnValue({
      watchStatusData: [{ name: 'Watching', value: 10 }],
      genreData: [],
      serviceData: [{ name: 'Netflix', value: 25 }],
    });

    render(
      <BaseStatisticsDashboard
        dashboardTitle="Test Dashboard"
        summaryCardProps={mockSummaryCardProps}
        statistics={mockStatistics}
      />,
    );

    expect(screen.getByText('No genre data available')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
  });

  it('should render streaming services bar chart when service data available', () => {
    render(
      <BaseStatisticsDashboard
        dashboardTitle="Test Dashboard"
        summaryCardProps={mockSummaryCardProps}
        statistics={mockStatistics}
      />,
    );

    expect(screen.getByText('Streaming Services')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should display no service data message when service data is empty', () => {
    mockUseStatisticsData.mockReturnValue({
      watchStatusData: [{ name: 'Watching', value: 10 }],
      genreData: [{ name: 'Drama', value: 15 }],
      serviceData: [],
    });

    render(
      <BaseStatisticsDashboard
        dashboardTitle="Test Dashboard"
        summaryCardProps={mockSummaryCardProps}
        statistics={mockStatistics}
      />,
    );

    expect(screen.getByText('No streaming service data available')).toBeInTheDocument();
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
  });

  it('should render custom content sections', () => {
    const customContent = <div data-testid="custom-content">Custom Section</div>;

    render(
      <BaseStatisticsDashboard
        dashboardTitle="Test Dashboard"
        summaryCardProps={mockSummaryCardProps}
        statistics={mockStatistics}
        contentSections={customContent}
      />,
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Custom Section')).toBeInTheDocument();
  });

  it('should call useStatisticsData hook with statistics', () => {
    render(
      <BaseStatisticsDashboard
        dashboardTitle="Test Dashboard"
        summaryCardProps={mockSummaryCardProps}
        statistics={mockStatistics}
      />,
    );

    expect(mockUseStatisticsData).toHaveBeenCalledWith(mockStatistics);
  });

  it('should match snapshot with full data', () => {
    const { container } = render(
      <BaseStatisticsDashboard
        dashboardTitle="Test Dashboard"
        summaryCardProps={mockSummaryCardProps}
        statistics={mockStatistics}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(
      <BaseStatisticsDashboard
        dashboardTitle="Test Dashboard"
        summaryCardProps={mockSummaryCardProps}
        isLoading={true}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with empty statistics', () => {
    const { container } = render(
      <BaseStatisticsDashboard
        dashboardTitle="Test Dashboard"
        summaryCardProps={mockSummaryCardProps}
        statistics={null}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot without summary card', () => {
    const { container } = render(
      <BaseStatisticsDashboard dashboardTitle="Test Dashboard" summaryCardProps={null} statistics={mockStatistics} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with custom content sections', () => {
    const customContent = (
      <>
        <div>Section 1</div>
        <div>Section 2</div>
      </>
    );

    const { container } = render(
      <BaseStatisticsDashboard
        dashboardTitle="Test Dashboard"
        summaryCardProps={mockSummaryCardProps}
        statistics={mockStatistics}
        contentSections={customContent}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
