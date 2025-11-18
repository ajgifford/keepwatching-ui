import { render, screen } from '@testing-library/react';

import { ContentDepthStats } from '@ajgifford/keepwatching-types';

import { ContentDepthCard } from '../contentDepthCard';

// Mock the chart components
jest.mock('../../elements/distributionBarChart', () => ({
  DistributionBarChart: ({ data }: { data: unknown[] }) => (
    <div data-testid="bar-chart">Bar Chart ({data.length} items)</div>
  ),
}));

jest.mock('../../elements/distributionPieChart', () => ({
  DistributionPieChart: ({ data }: { data: unknown[] }) => (
    <div data-testid="pie-chart">Pie Chart ({data.length} items)</div>
  ),
}));

describe('ContentDepthCard', () => {
  const mockStats: ContentDepthStats = {
    averageEpisodeCountPerShow: 35.5,
    averageMovieRuntime: 120,
    releaseYearDistribution: {
      '2020': 10,
      '2021': 15,
      '2022': 20,
      '2023': 25,
    },
    contentMaturityDistribution: {
      'TV-MA': 30,
      'TV-14': 25,
      'TV-PG': 20,
      'R': 15,
      'PG-13': 10,
    },
  } as ContentDepthStats;

  it('should render with title', () => {
    render(<ContentDepthCard stats={mockStats} />);

    expect(screen.getByText('Content Depth Analysis')).toBeInTheDocument();
  });

  it('should display average episodes per show', () => {
    render(<ContentDepthCard stats={mockStats} />);

    expect(screen.getByText('35.5')).toBeInTheDocument();
    expect(screen.getByText('Avg Episodes Per Show')).toBeInTheDocument();
  });

  it('should display balanced series preference for 20-50 episodes', () => {
    render(<ContentDepthCard stats={mockStats} />);

    expect(screen.getByText('Balanced series length')).toBeInTheDocument();
  });

  it('should display short series preference for < 20 episodes', () => {
    const shortStats = { ...mockStats, averageEpisodeCountPerShow: 15 };
    render(<ContentDepthCard stats={shortStats as ContentDepthStats} />);

    expect(screen.getByText('Preference for shorter series')).toBeInTheDocument();
  });

  it('should display long series preference for > 50 episodes', () => {
    const longStats = { ...mockStats, averageEpisodeCountPerShow: 75 };
    render(<ContentDepthCard stats={longStats as ContentDepthStats} />);

    expect(screen.getByText('Preference for long-running series')).toBeInTheDocument();
  });

  it('should display average movie runtime', () => {
    render(<ContentDepthCard stats={mockStats} />);

    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('Avg Movie Runtime (min)')).toBeInTheDocument();
  });

  it('should display standard film preference for 90-150 min', () => {
    render(<ContentDepthCard stats={mockStats} />);

    expect(screen.getByText('Standard length films')).toBeInTheDocument();
  });

  it('should display short film preference for < 90 min', () => {
    const shortFilmStats = { ...mockStats, averageMovieRuntime: 80 };
    render(<ContentDepthCard stats={shortFilmStats as ContentDepthStats} />);

    expect(screen.getByText('Preference for shorter films')).toBeInTheDocument();
  });

  it('should display long film preference for > 150 min', () => {
    const longFilmStats = { ...mockStats, averageMovieRuntime: 180 };
    render(<ContentDepthCard stats={longFilmStats as ContentDepthStats} />);

    expect(screen.getByText('Preference for longer films')).toBeInTheDocument();
  });

  it('should display release year distribution section', () => {
    render(<ContentDepthCard stats={mockStats} />);

    expect(screen.getByText('Release Year Distribution')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should display content maturity ratings section', () => {
    render(<ContentDepthCard stats={mockStats} />);

    expect(screen.getByText('Content Maturity Ratings')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('should render empty state when stats is null', () => {
    render(<ContentDepthCard stats={null} />);

    expect(screen.getByText('Content Depth Analysis')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should round average episodes to one decimal place', () => {
    const decimalStats = { ...mockStats, averageEpisodeCountPerShow: 35.678 };
    render(<ContentDepthCard stats={decimalStats as ContentDepthStats} />);

    expect(screen.getByText('35.7')).toBeInTheDocument();
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<ContentDepthCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with empty state', () => {
    const { container } = render(<ContentDepthCard stats={null} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with short series preference', () => {
    const shortStats = { ...mockStats, averageEpisodeCountPerShow: 15 };
    const { container } = render(<ContentDepthCard stats={shortStats as ContentDepthStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with long film preference', () => {
    const longFilmStats = { ...mockStats, averageMovieRuntime: 180 };
    const { container } = render(<ContentDepthCard stats={longFilmStats as ContentDepthStats} />);

    expect(container).toMatchSnapshot();
  });
});
