import { render, screen } from '@testing-library/react';

import { ContentDiscoveryStats } from '@ajgifford/keepwatching-types';

import { ContentDiscoveryCard } from '../contentDiscoveryCard';

describe('ContentDiscoveryCard', () => {
  const mockStats: ContentDiscoveryStats = {
    daysSinceLastContentAdded: 15,
    contentAdditionRate: {
      showsPerMonth: 5.5,
      moviesPerMonth: 3.2,
    },
    watchToAddRatio: {
      shows: 1.2,
      movies: 0.7,
    },
  } as ContentDiscoveryStats;

  it('should render with title', () => {
    render(<ContentDiscoveryCard stats={mockStats} />);

    expect(screen.getByText('Content Discovery Patterns')).toBeInTheDocument();
  });

  it('should display days since last content added', () => {
    render(<ContentDiscoveryCard stats={mockStats} />);

    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Days Since Last Content Added')).toBeInTheDocument();
  });

  it('should display actively discovering message when < 30 days', () => {
    render(<ContentDiscoveryCard stats={mockStats} />);

    expect(screen.getByText('Actively discovering content')).toBeInTheDocument();
  });

  it('should display time to discover message when > 30 days', () => {
    const oldStats = { ...mockStats, daysSinceLastContentAdded: 45 };
    render(<ContentDiscoveryCard stats={oldStats as ContentDiscoveryStats} />);

    expect(screen.getByText('Time to discover new content!')).toBeInTheDocument();
  });

  it('should display shows added per month', () => {
    render(<ContentDiscoveryCard stats={mockStats} />);

    expect(screen.getByText('Shows Added Per Month')).toBeInTheDocument();
    expect(screen.getByText('5.5')).toBeInTheDocument();
  });

  it('should display movies added per month', () => {
    render(<ContentDiscoveryCard stats={mockStats} />);

    expect(screen.getByText('Movies Added Per Month')).toBeInTheDocument();
    expect(screen.getByText('3.2')).toBeInTheDocument();
  });

  it('should display watch-to-add ratio section', () => {
    render(<ContentDiscoveryCard stats={mockStats} />);

    expect(screen.getByText('Watch-to-Add Ratio')).toBeInTheDocument();
    expect(screen.getByText(/Values > 1.0 mean your backlog is shrinking/)).toBeInTheDocument();
  });

  it('should display shows watch-to-add ratio', () => {
    render(<ContentDiscoveryCard stats={mockStats} />);

    expect(screen.getByText('1.20')).toBeInTheDocument();
  });

  it('should display movies watch-to-add ratio', () => {
    render(<ContentDiscoveryCard stats={mockStats} />);

    expect(screen.getByText('0.70')).toBeInTheDocument();
  });

  it('should display Backlog Shrinking chip when ratio > 1', () => {
    render(<ContentDiscoveryCard stats={mockStats} />);

    expect(screen.getByText('Backlog Shrinking')).toBeInTheDocument();
  });

  it('should display Backlog Growing chip when ratio < 0.8', () => {
    render(<ContentDiscoveryCard stats={mockStats} />);

    expect(screen.getByText('Backlog Growing')).toBeInTheDocument();
  });

  it('should display Balanced chip when ratio is between 0.8 and 1', () => {
    const balancedStats = {
      ...mockStats,
      watchToAddRatio: {
        shows: 0.9,
        movies: 0.85,
      },
    };

    render(<ContentDiscoveryCard stats={balancedStats as ContentDiscoveryStats} />);

    const balancedChips = screen.getAllByText('Balanced');
    expect(balancedChips).toHaveLength(2); // Both shows and movies are balanced
  });

  it('should render empty state when stats is null', () => {
    render(<ContentDiscoveryCard stats={null} />);

    expect(screen.getByText('Content Discovery Patterns')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should render trend icons', () => {
    const { container } = render(<ContentDiscoveryCard stats={mockStats} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should round addition rate to one decimal place', () => {
    const decimalStats = {
      ...mockStats,
      contentAdditionRate: {
        showsPerMonth: 5.678,
        moviesPerMonth: 3.234,
      },
    };

    render(<ContentDiscoveryCard stats={decimalStats as ContentDiscoveryStats} />);

    expect(screen.getByText('5.7')).toBeInTheDocument();
    expect(screen.getByText('3.2')).toBeInTheDocument();
  });

  it('should round watch-to-add ratio to two decimal places', () => {
    const decimalStats = {
      ...mockStats,
      watchToAddRatio: {
        shows: 1.2567,
        movies: 0.7891,
      },
    };

    render(<ContentDiscoveryCard stats={decimalStats as ContentDiscoveryStats} />);

    expect(screen.getByText('1.26')).toBeInTheDocument();
    expect(screen.getByText('0.79')).toBeInTheDocument();
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<ContentDiscoveryCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with empty state', () => {
    const { container } = render(<ContentDiscoveryCard stats={null} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with old content warning', () => {
    const oldStats = { ...mockStats, daysSinceLastContentAdded: 45 };
    const { container } = render(<ContentDiscoveryCard stats={oldStats as ContentDiscoveryStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with balanced ratios', () => {
    const balancedStats = {
      ...mockStats,
      watchToAddRatio: {
        shows: 0.9,
        movies: 0.85,
      },
    };

    const { container } = render(<ContentDiscoveryCard stats={balancedStats as ContentDiscoveryStats} />);

    expect(container).toMatchSnapshot();
  });
});
