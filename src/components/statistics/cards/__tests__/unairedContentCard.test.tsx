import { render, screen } from '@testing-library/react';

import { UnairedContentStats } from '@ajgifford/keepwatching-types';

import { UnairedContentCard } from '../unairedContentCard';

describe('UnairedContentCard', () => {
  const mockStats: UnairedContentStats = {
    unairedShowCount: 5,
    unairedSeasonCount: 12,
    unairedEpisodeCount: 45,
    unairedMovieCount: 8,
  } as UnairedContentStats;

  it('should render with title when stats are provided', () => {
    render(<UnairedContentCard stats={mockStats} />);

    expect(screen.getByText('Unaired Content Awaiting Release')).toBeInTheDocument();
  });

  it('should display show count', () => {
    render(<UnairedContentCard stats={mockStats} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Shows')).toBeInTheDocument();
  });

  it('should display season count', () => {
    render(<UnairedContentCard stats={mockStats} />);

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Seasons')).toBeInTheDocument();
  });

  it('should display episode count', () => {
    render(<UnairedContentCard stats={mockStats} />);

    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('Episodes')).toBeInTheDocument();
  });

  it('should display movie count', () => {
    render(<UnairedContentCard stats={mockStats} />);

    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Movies')).toBeInTheDocument();
  });

  it('should display total unaired content summary', () => {
    render(<UnairedContentCard stats={mockStats} />);

    expect(screen.getByText(/You're tracking 70 pieces of content awaiting release/)).toBeInTheDocument();
  });

  it('should render null stats as no data available', () => {
    render(<UnairedContentCard stats={null} />);

    expect(screen.getByText('Unaired Content')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should display message when all content has aired', () => {
    const zeroStats: UnairedContentStats = {
      unairedShowCount: 0,
      unairedSeasonCount: 0,
      unairedEpisodeCount: 0,
      unairedMovieCount: 0,
    } as UnairedContentStats;

    render(<UnairedContentCard stats={zeroStats} />);

    expect(screen.getByText('All content has aired - nothing to wait for!')).toBeInTheDocument();
  });

  it('should calculate total correctly', () => {
    render(<UnairedContentCard stats={mockStats} />);

    // 5 shows + 12 seasons + 45 episodes + 8 movies = 70
    expect(screen.getByText(/70 pieces of content/)).toBeInTheDocument();
  });

  it('should render icons for each content type', () => {
    const { container } = render(<UnairedContentCard stats={mockStats} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should render grid layout for content counts', () => {
    const { container } = render(<UnairedContentCard stats={mockStats} />);

    const gridItems = container.querySelectorAll('.MuiGrid-root');
    expect(gridItems.length).toBeGreaterThan(0);
  });

  it('should handle large numbers', () => {
    const largeStats: UnairedContentStats = {
      unairedShowCount: 100,
      unairedSeasonCount: 500,
      unairedEpisodeCount: 2500,
      unairedMovieCount: 150,
    } as UnairedContentStats;

    render(<UnairedContentCard stats={largeStats} />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('2500')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText(/3250 pieces of content/)).toBeInTheDocument();
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<UnairedContentCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with null data', () => {
    const { container } = render(<UnairedContentCard stats={null} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with zero content', () => {
    const zeroStats: UnairedContentStats = {
      unairedShowCount: 0,
      unairedSeasonCount: 0,
      unairedEpisodeCount: 0,
      unairedMovieCount: 0,
    } as UnairedContentStats;

    const { container } = render(<UnairedContentCard stats={zeroStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with mixed zero and non-zero values', () => {
    const mixedStats: UnairedContentStats = {
      unairedShowCount: 0,
      unairedSeasonCount: 5,
      unairedEpisodeCount: 0,
      unairedMovieCount: 3,
    } as UnairedContentStats;

    const { container } = render(<UnairedContentCard stats={mixedStats} />);

    expect(container).toMatchSnapshot();
  });
});
