import { render, screen, fireEvent } from '@testing-library/react';

import { ContentPopularityStats } from '@ajgifford/keepwatching-types';

import { ContentPopularityCard } from '../contentPopularityCard';

describe('ContentPopularityCard', () => {
  const mockStats: ContentPopularityStats = {
    popularContent: [
      {
        contentType: 'show',
        contentId: 1,
        title: 'Breaking Bad',
        releaseYear: 2008,
        profileCount: 150,
        accountCount: 100,
        totalWatchCount: 200,
        completionRate: 85,
      },
      {
        contentType: 'show',
        contentId: 2,
        title: 'Game of Thrones',
        releaseYear: 2011,
        profileCount: 120,
        accountCount: 80,
        totalWatchCount: 150,
        completionRate: 70,
      },
      {
        contentType: 'movie',
        contentId: 3,
        title: 'Inception',
        releaseYear: 2010,
        profileCount: 100,
        accountCount: 75,
        totalWatchCount: 125,
        completionRate: 90,
      },
    ],
  } as ContentPopularityStats;

  it('should render with title', () => {
    render(<ContentPopularityCard stats={mockStats} />);

    expect(screen.getByText('Popular Content')).toBeInTheDocument();
  });

  it('should render tabs with counts', () => {
    render(<ContentPopularityCard stats={mockStats} />);

    expect(screen.getByText('All (3)')).toBeInTheDocument();
    expect(screen.getByText('Shows (2)')).toBeInTheDocument();
    expect(screen.getByText('Movies (1)')).toBeInTheDocument();
  });

  it('should display all content by default', () => {
    render(<ContentPopularityCard stats={mockStats} />);

    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
    expect(screen.getByText('Game of Thrones')).toBeInTheDocument();
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });

  it('should filter to shows when Shows tab is clicked', () => {
    render(<ContentPopularityCard stats={mockStats} />);

    const showsTab = screen.getByText('Shows (2)');
    fireEvent.click(showsTab);

    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
    expect(screen.getByText('Game of Thrones')).toBeInTheDocument();
    expect(screen.queryByText('Inception')).not.toBeInTheDocument();
  });

  it('should filter to movies when Movies tab is clicked', () => {
    render(<ContentPopularityCard stats={mockStats} />);

    const moviesTab = screen.getByText('Movies (1)');
    fireEvent.click(moviesTab);

    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.queryByText('Breaking Bad')).not.toBeInTheDocument();
    expect(screen.queryByText('Game of Thrones')).not.toBeInTheDocument();
  });

  it('should display release years', () => {
    render(<ContentPopularityCard stats={mockStats} />);

    expect(screen.getByText('2008')).toBeInTheDocument();
    expect(screen.getByText('2011')).toBeInTheDocument();
    expect(screen.getByText('2010')).toBeInTheDocument();
  });

  it('should display profile counts', () => {
    render(<ContentPopularityCard stats={mockStats} />);

    expect(screen.getByText('150 profiles')).toBeInTheDocument();
    expect(screen.getByText('120 profiles')).toBeInTheDocument();
    expect(screen.getByText('100 profiles')).toBeInTheDocument();
  });

  it('should display account counts', () => {
    render(<ContentPopularityCard stats={mockStats} />);

    expect(screen.getByText('100 accounts')).toBeInTheDocument();
    expect(screen.getByText('80 accounts')).toBeInTheDocument();
    expect(screen.getByText('75 accounts')).toBeInTheDocument();
  });

  it('should display watch counts', () => {
    render(<ContentPopularityCard stats={mockStats} />);

    expect(screen.getByText('200 watches')).toBeInTheDocument();
    expect(screen.getByText('150 watches')).toBeInTheDocument();
    expect(screen.getByText('125 watches')).toBeInTheDocument();
  });

  it('should display completion rates', () => {
    render(<ContentPopularityCard stats={mockStats} />);

    expect(screen.getByText('85% completion')).toBeInTheDocument();
    expect(screen.getByText('70% completion')).toBeInTheDocument();
    expect(screen.getByText('90% completion')).toBeInTheDocument();
  });

  it('should display ranking numbers', () => {
    render(<ContentPopularityCard stats={mockStats} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should show empty message when no content', () => {
    const emptyStats = { popularContent: [], contentType: 'all', resultCount: 0 };
    render(<ContentPopularityCard stats={emptyStats as unknown as ContentPopularityStats} />);

    expect(screen.getByText('No content available')).toBeInTheDocument();
  });

  it('should show empty message when no shows in Shows tab', () => {
    const moviesOnlyStats = {
      popularContent: [mockStats.popularContent[2]], // Only movie
      contentType: 'all',
      resultCount: 1,
    };

    render(<ContentPopularityCard stats={moviesOnlyStats as unknown as ContentPopularityStats} />);

    const showsTab = screen.getByText('Shows (0)');
    fireEvent.click(showsTab);

    expect(screen.getByText('No content available')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<ContentPopularityCard stats={mockStats} isLoading={true} />);

    expect(screen.getByText('Popular Content')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render icons for content type', () => {
    const { container } = render(<ContentPopularityCard stats={mockStats} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should format large numbers with commas', () => {
    const largeStats = {
      popularContent: [
        {
          ...mockStats.popularContent[0],
          profileCount: 5000,
          accountCount: 3000,
          totalWatchCount: 10000,
        },
      ],
      contentType: 'all',
      resultCount: 1,
    };

    render(<ContentPopularityCard stats={largeStats as unknown as ContentPopularityStats} />);

    expect(screen.getByText('5,000 profiles')).toBeInTheDocument();
    expect(screen.getByText('3,000 accounts')).toBeInTheDocument();
    expect(screen.getByText('10,000 watches')).toBeInTheDocument();
  });

  it('should not display release year chip when not provided', () => {
    const noYearStats = {
      popularContent: [
        {
          ...mockStats.popularContent[0],
          releaseYear: null,
        },
      ],
      contentType: 'all',
      resultCount: 1,
    };

    render(<ContentPopularityCard stats={noYearStats as unknown as ContentPopularityStats} />);

    expect(screen.queryByText('2008')).not.toBeInTheDocument();
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<ContentPopularityCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(<ContentPopularityCard stats={mockStats} isLoading={true} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot on Shows tab', () => {
    const { container } = render(<ContentPopularityCard stats={mockStats} />);

    const showsTab = screen.getByText('Shows (2)');
    fireEvent.click(showsTab);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot on Movies tab', () => {
    const { container } = render(<ContentPopularityCard stats={mockStats} />);

    const moviesTab = screen.getByText('Movies (1)');
    fireEvent.click(moviesTab);

    expect(container).toMatchSnapshot();
  });
});
