import { render, screen } from '@testing-library/react';

import { WatchingVelocityStats } from '@ajgifford/keepwatching-types';

import { WatchVelocityCard } from '../watchVelocityCard';

describe('WatchVelocityCard', () => {
  const mockVelocityData: WatchingVelocityStats = {
    averageEpisodesPerDay: 2.5,
    episodesPerWeek: 17.5,
    episodesPerMonth: 75,
    velocityTrend: 'increasing',
    mostActiveDay: 'Saturday',
    mostActiveHour: 20,
  } as WatchingVelocityStats;

  it('should render with title', () => {
    render(<WatchVelocityCard velocityData={mockVelocityData} />);

    expect(screen.getByText('Watching Velocity')).toBeInTheDocument();
  });

  it('should display average episodes per day', () => {
    render(<WatchVelocityCard velocityData={mockVelocityData} />);

    expect(screen.getByText('2.5')).toBeInTheDocument();
    expect(screen.getByText('Episodes / Day')).toBeInTheDocument();
  });

  it('should display episodes per week', () => {
    render(<WatchVelocityCard velocityData={mockVelocityData} />);

    expect(screen.getByText('17.5')).toBeInTheDocument();
    expect(screen.getByText('Episodes / Week')).toBeInTheDocument();
  });

  it('should display episodes per month', () => {
    render(<WatchVelocityCard velocityData={mockVelocityData} />);

    expect(screen.getByText('75.0')).toBeInTheDocument();
    expect(screen.getByText('Episodes / Month')).toBeInTheDocument();
  });

  it('should display most active day', () => {
    render(<WatchVelocityCard velocityData={mockVelocityData} />);

    expect(screen.getByText('Most Active Day')).toBeInTheDocument();
    expect(screen.getByText('Saturday')).toBeInTheDocument();
  });

  it('should display most active hour', () => {
    render(<WatchVelocityCard velocityData={mockVelocityData} />);

    expect(screen.getByText('Most Active Hour')).toBeInTheDocument();
    expect(screen.getByText('20:00 - 21:00')).toBeInTheDocument();
  });

  it('should display N/A for most active day when empty', () => {
    const dataWithoutDay = { ...mockVelocityData, mostActiveDay: null };
    render(<WatchVelocityCard velocityData={dataWithoutDay as unknown as WatchingVelocityStats} />);

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('should display N/A for most active hour when null', () => {
    const dataWithoutHour = { ...mockVelocityData, mostActiveHour: null };
    render(<WatchVelocityCard velocityData={dataWithoutHour as unknown as WatchingVelocityStats} />);

    const naElements = screen.getAllByText('N/A');
    expect(naElements.length).toBeGreaterThan(0);
  });

  it('should display increasing trend chip', () => {
    render(<WatchVelocityCard velocityData={mockVelocityData} />);

    expect(screen.getByText('Increasing')).toBeInTheDocument();
  });

  it('should display decreasing trend chip', () => {
    const decreasingData = { ...mockVelocityData, velocityTrend: 'decreasing' as const };
    render(<WatchVelocityCard velocityData={decreasingData} />);

    expect(screen.getByText('Decreasing')).toBeInTheDocument();
  });

  it('should display stable trend chip', () => {
    const stableData = { ...mockVelocityData, velocityTrend: 'stable' as const };
    render(<WatchVelocityCard velocityData={stableData} />);

    expect(screen.getByText('Stable')).toBeInTheDocument();
  });

  it('should not display trend chip when trend is null', () => {
    const noTrendData = { ...mockVelocityData, velocityTrend: null };
    render(<WatchVelocityCard velocityData={noTrendData as unknown as WatchingVelocityStats} />);

    expect(screen.queryByText(/Increasing|Decreasing|Stable/)).not.toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<WatchVelocityCard isLoading={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show empty state when velocityData is null', () => {
    render(<WatchVelocityCard velocityData={null} />);

    expect(screen.getByText('No velocity data available')).toBeInTheDocument();
  });

  it('should show empty state when velocityData is undefined', () => {
    render(<WatchVelocityCard />);

    expect(screen.getByText('No velocity data available')).toBeInTheDocument();
  });

  it('should render trend icons', () => {
    const { container } = render(<WatchVelocityCard velocityData={mockVelocityData} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should round decimal values to one decimal place', () => {
    const dataWithDecimals = {
      ...mockVelocityData,
      averageEpisodesPerDay: 2.567,
      episodesPerWeek: 17.893,
      episodesPerMonth: 75.432,
    };
    render(<WatchVelocityCard velocityData={dataWithDecimals} />);

    expect(screen.getByText('2.6')).toBeInTheDocument();
    expect(screen.getByText('17.9')).toBeInTheDocument();
    expect(screen.getByText('75.4')).toBeInTheDocument();
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<WatchVelocityCard velocityData={mockVelocityData} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(<WatchVelocityCard isLoading={true} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in empty state', () => {
    const { container } = render(<WatchVelocityCard velocityData={null} />);

    expect(container).toMatchSnapshot();
  });
});
