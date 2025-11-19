import { render, screen, fireEvent } from '@testing-library/react';

import { TrendingContentStats } from '@ajgifford/keepwatching-types';

import { TrendingContentCard } from '../trendingContentCard';

describe('TrendingContentCard', () => {
  const mockStats: TrendingContentStats = {
    periodDays: 30,
    resultCount: 3,
    trendingContent: [
      {
        contentId: 1,
        contentType: 'show',
        title: 'Breaking Bad',
        recentWatchCount: 150,
        newAdditions: 25,
        trendDirection: 'rising',
        trendPercentage: 15,
      },
      {
        contentId: 2,
        contentType: 'movie',
        title: 'Inception',
        recentWatchCount: 85,
        newAdditions: 10,
        trendDirection: 'stable',
        trendPercentage: 0,
      },
      {
        contentId: 3,
        contentType: 'show',
        title: 'The Office',
        recentWatchCount: 120,
        newAdditions: 0,
        trendDirection: 'falling',
        trendPercentage: -5,
      },
    ],
  } as TrendingContentStats;

  it('should render with title', () => {
    render(<TrendingContentCard stats={mockStats} />);

    expect(screen.getByText('Trending Content (30 days)')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<TrendingContentCard stats={mockStats} isLoading={true} />);

    expect(screen.getByText('Trending Content')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render all three tabs', () => {
    render(<TrendingContentCard stats={mockStats} />);

    expect(screen.getByText('All (3)')).toBeInTheDocument();
    expect(screen.getByText('Shows (2)')).toBeInTheDocument();
    expect(screen.getByText('Movies (1)')).toBeInTheDocument();
  });

  it('should display content titles', () => {
    render(<TrendingContentCard stats={mockStats} />);

    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('The Office')).toBeInTheDocument();
  });

  it('should display recent watch counts', () => {
    render(<TrendingContentCard stats={mockStats} />);

    expect(screen.getByText('150 recent watches')).toBeInTheDocument();
    expect(screen.getByText('85 recent watches')).toBeInTheDocument();
    expect(screen.getByText('120 recent watches')).toBeInTheDocument();
  });

  it('should display trend percentages', () => {
    render(<TrendingContentCard stats={mockStats} />);

    expect(screen.getByText('+15%')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });

  it('should display new additions when greater than zero', () => {
    render(<TrendingContentCard stats={mockStats} />);

    expect(screen.getByText('+25 new additions')).toBeInTheDocument();
    expect(screen.getByText('+10 new additions')).toBeInTheDocument();
    expect(screen.queryByText('+0 new additions')).not.toBeInTheDocument();
  });

  it('should display rank numbers for each item', () => {
    const { container } = render(<TrendingContentCard stats={mockStats} />);

    expect(container.textContent).toContain('1');
    expect(container.textContent).toContain('2');
    expect(container.textContent).toContain('3');
  });

  it('should switch to shows tab when clicked', () => {
    render(<TrendingContentCard stats={mockStats} />);

    const showsTab = screen.getByText('Shows (2)');
    fireEvent.click(showsTab);

    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
    expect(screen.getByText('The Office')).toBeInTheDocument();
    expect(screen.queryByText('Inception')).not.toBeInTheDocument();
  });

  it('should switch to movies tab when clicked', () => {
    render(<TrendingContentCard stats={mockStats} />);

    const moviesTab = screen.getByText('Movies (1)');
    fireEvent.click(moviesTab);

    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.queryByText('Breaking Bad')).not.toBeInTheDocument();
    expect(screen.queryByText('The Office')).not.toBeInTheDocument();
  });

  it('should display empty state when no content', () => {
    const emptyStats: TrendingContentStats = {
      periodDays: 30,
      resultCount: 0,
      trendingContent: [],
    } as TrendingContentStats;

    render(<TrendingContentCard stats={emptyStats} />);

    expect(screen.getByText('No trending content available')).toBeInTheDocument();
  });

  it('should display empty state on shows tab when no shows', () => {
    const movieOnlyStats: TrendingContentStats = {
      periodDays: 30,
      resultCount: 1,
      trendingContent: [
        {
          contentId: 1,
          contentType: 'movie',
          title: 'Inception',
          recentWatchCount: 85,
          newAdditions: 10,
          trendDirection: 'stable',
          trendPercentage: 0,
        },
      ],
    } as TrendingContentStats;

    render(<TrendingContentCard stats={movieOnlyStats} />);

    const showsTab = screen.getByText('Shows (0)');
    fireEvent.click(showsTab);

    expect(screen.getByText('No trending content available')).toBeInTheDocument();
  });

  it('should render trend icons', () => {
    const { container } = render(<TrendingContentCard stats={mockStats} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should format large watch counts with commas', () => {
    const largeStats: TrendingContentStats = {
      periodDays: 30,
      resultCount: 1,
      trendingContent: [
        {
          contentId: 1,
          contentType: 'show',
          title: 'Popular Show',
          recentWatchCount: 5000,
          newAdditions: 1000,
          trendDirection: 'rising',
          trendPercentage: 25,
        },
      ],
    } as TrendingContentStats;

    render(<TrendingContentCard stats={largeStats} />);

    expect(screen.getByText('5,000 recent watches')).toBeInTheDocument();
    expect(screen.getByText('+1,000 new additions')).toBeInTheDocument();
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<TrendingContentCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(<TrendingContentCard stats={mockStats} isLoading={true} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with empty content', () => {
    const emptyStats: TrendingContentStats = {
      periodDays: 30,
      resultCount: 0,
      trendingContent: [],
    } as TrendingContentStats;

    const { container } = render(<TrendingContentCard stats={emptyStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with shows tab selected', () => {
    const { container } = render(<TrendingContentCard stats={mockStats} />);

    const showsTab = screen.getByText('Shows (2)');
    fireEvent.click(showsTab);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with movies tab selected', () => {
    const { container } = render(<TrendingContentCard stats={mockStats} />);

    const moviesTab = screen.getByText('Movies (1)');
    fireEvent.click(moviesTab);

    expect(container).toMatchSnapshot();
  });
});
