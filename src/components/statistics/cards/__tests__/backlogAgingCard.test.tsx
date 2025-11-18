import { render, screen } from '@testing-library/react';

import { TimeToWatchStats } from '@ajgifford/keepwatching-types';

import { BacklogAgingCard } from '../backlogAgingCard';

describe('BacklogAgingCard', () => {
  const mockStats: TimeToWatchStats = {
    averageDaysToStartShow: 15,
    averageDaysToCompleteShow: 45,
    backlogAging: {
      unwatchedOver30Days: 10,
      unwatchedOver90Days: 5,
      unwatchedOver365Days: 2,
    },
    fastestCompletions: [
      { showId: 1, showTitle: 'Breaking Bad', daysToComplete: 7 },
      { showId: 2, showTitle: 'The Office', daysToComplete: 10 },
      { showId: 3, showTitle: 'Game of Thrones', daysToComplete: 14 },
    ],
  } as TimeToWatchStats;

  it('should render with title', () => {
    render(<BacklogAgingCard stats={mockStats} />);

    expect(screen.getByText('Backlog Aging')).toBeInTheDocument();
  });

  it('should display total backlog count', () => {
    render(<BacklogAgingCard stats={mockStats} />);

    expect(screen.getByText('17')).toBeInTheDocument(); // 10 + 5 + 2
    expect(screen.getByText('Unwatched Shows')).toBeInTheDocument();
  });

  it('should display 30+ days backlog', () => {
    render(<BacklogAgingCard stats={mockStats} />);

    expect(screen.getByText('30+ Days')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should display 90+ days backlog', () => {
    render(<BacklogAgingCard stats={mockStats} />);

    expect(screen.getByText('90+ Days')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should display 365+ days backlog', () => {
    render(<BacklogAgingCard stats={mockStats} />);

    expect(screen.getByText('365+ Days')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should display percentages for each age group', () => {
    render(<BacklogAgingCard stats={mockStats} />);

    // 10/17 = 59%, 5/17 = 29%, 2/17 = 12%
    expect(screen.getByText('(59%)')).toBeInTheDocument();
    expect(screen.getByText('(29%)')).toBeInTheDocument();
    expect(screen.getByText('(12%)')).toBeInTheDocument();
  });

  it('should display average days to start show', () => {
    render(<BacklogAgingCard stats={mockStats} />);

    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Days to Start')).toBeInTheDocument();
  });

  it('should display average days to complete show', () => {
    render(<BacklogAgingCard stats={mockStats} />);

    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('Days to Complete')).toBeInTheDocument();
  });

  it('should display fastest completions section', () => {
    render(<BacklogAgingCard stats={mockStats} />);

    expect(screen.getByText('Fastest Completions')).toBeInTheDocument();
  });

  it('should display top 3 fastest completions', () => {
    render(<BacklogAgingCard stats={mockStats} />);

    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
    expect(screen.getByText('7 days')).toBeInTheDocument();
    expect(screen.getByText('The Office')).toBeInTheDocument();
    expect(screen.getByText('10 days')).toBeInTheDocument();
    expect(screen.getByText('Game of Thrones')).toBeInTheDocument();
    expect(screen.getByText('14 days')).toBeInTheDocument();
  });

  it('should limit fastest completions to 3', () => {
    const statsWithMany = {
      ...mockStats,
      fastestCompletions: [
        { showId: 1, showTitle: 'Show 1', daysToComplete: 5 },
        { showId: 2, showTitle: 'Show 2', daysToComplete: 7 },
        { showId: 3, showTitle: 'Show 3', daysToComplete: 10 },
        { showId: 4, showTitle: 'Show 4', daysToComplete: 12 },
        { showId: 5, showTitle: 'Show 5', daysToComplete: 15 },
      ],
    };

    render(<BacklogAgingCard stats={statsWithMany as TimeToWatchStats} />);

    expect(screen.getByText('Show 1')).toBeInTheDocument();
    expect(screen.getByText('Show 2')).toBeInTheDocument();
    expect(screen.getByText('Show 3')).toBeInTheDocument();
    expect(screen.queryByText('Show 4')).not.toBeInTheDocument();
    expect(screen.queryByText('Show 5')).not.toBeInTheDocument();
  });

  it('should not display fastest completions when empty', () => {
    const statsNoFastest = {
      ...mockStats,
      fastestCompletions: [],
    };

    render(<BacklogAgingCard stats={statsNoFastest as TimeToWatchStats} />);

    expect(screen.queryByText('Fastest Completions')).not.toBeInTheDocument();
  });

  it('should show no backlog message when all counts are zero', () => {
    const noBacklogStats = {
      ...mockStats,
      backlogAging: {
        unwatchedOver30Days: 0,
        unwatchedOver90Days: 0,
        unwatchedOver365Days: 0,
      },
    };

    render(<BacklogAgingCard stats={noBacklogStats as TimeToWatchStats} />);

    expect(screen.getByText('No Aging Backlog')).toBeInTheDocument();
    expect(screen.getByText("You're staying on top of your watch list!")).toBeInTheDocument();
  });

  it('should show empty state when stats is null', () => {
    render(<BacklogAgingCard stats={null} />);

    expect(screen.getByText('Backlog Aging')).toBeInTheDocument();
    expect(screen.getByText('No backlog data available')).toBeInTheDocument();
  });

  it('should show empty state when backlogAging is missing', () => {
    const statsNoBacklog = {
      ...mockStats,
      backlogAging: undefined,
    };

    render(<BacklogAgingCard stats={statsNoBacklog as unknown as TimeToWatchStats} />);

    expect(screen.getByText('No backlog data available')).toBeInTheDocument();
  });

  it('should render icons', () => {
    const { container } = render(<BacklogAgingCard stats={mockStats} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should round average days to nearest integer', () => {
    const statsWithDecimals = {
      ...mockStats,
      averageDaysToStartShow: 15.7,
      averageDaysToCompleteShow: 45.3,
    };

    render(<BacklogAgingCard stats={statsWithDecimals as TimeToWatchStats} />);

    expect(screen.getByText('16')).toBeInTheDocument(); // Rounded up
    expect(screen.getByText('45')).toBeInTheDocument(); // Rounded down
  });

  it('should display Average Time section header', () => {
    render(<BacklogAgingCard stats={mockStats} />);

    expect(screen.getByText('Average Time')).toBeInTheDocument();
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<BacklogAgingCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with no backlog', () => {
    const noBacklogStats = {
      ...mockStats,
      backlogAging: {
        unwatchedOver30Days: 0,
        unwatchedOver90Days: 0,
        unwatchedOver365Days: 0,
      },
    };

    const { container } = render(<BacklogAgingCard stats={noBacklogStats as TimeToWatchStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in empty state', () => {
    const { container } = render(<BacklogAgingCard stats={null} />);

    expect(container).toMatchSnapshot();
  });
});
