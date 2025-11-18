import { render, screen } from '@testing-library/react';

import { TimeToWatchStats } from '@ajgifford/keepwatching-types';

import { TimeToWatchCard } from '../timeToWatchCard';

describe('TimeToWatchCard', () => {
  const mockStats: TimeToWatchStats = {
    averageDaysToStartShow: 15,
    averageDaysToCompleteShow: 45,
    fastestCompletions: [
      { showId: 1, showTitle: 'Breaking Bad', daysToComplete: 7 },
      { showId: 2, showTitle: 'The Office', daysToComplete: 10 },
      { showId: 3, showTitle: 'Game of Thrones', daysToComplete: 14 },
    ],
    backlogAging: {
      unwatchedOver30Days: 5,
      unwatchedOver90Days: 3,
      unwatchedOver365Days: 1,
    },
  } as TimeToWatchStats;

  it('should render null when stats is null', () => {
    const { container } = render(<TimeToWatchCard stats={null} />);

    expect(container.firstChild).toBeNull();
  });

  it('should render with title', () => {
    render(<TimeToWatchCard stats={mockStats} />);

    expect(screen.getByText('Time to Watch')).toBeInTheDocument();
  });

  it('should display average days to start show', () => {
    render(<TimeToWatchCard stats={mockStats} />);

    expect(screen.getByText('Average Days to Start Show')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('should display average days to complete show', () => {
    render(<TimeToWatchCard stats={mockStats} />);

    expect(screen.getByText('Average Days to Complete Show')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  it('should display N/A when average days to start is 0', () => {
    const statsWithZero = { ...mockStats, averageDaysToStartShow: 0 };
    render(<TimeToWatchCard stats={statsWithZero} />);

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('should display fastest completions section', () => {
    render(<TimeToWatchCard stats={mockStats} />);

    expect(screen.getByText('Fastest Completions')).toBeInTheDocument();
  });

  it('should display all fastest completions', () => {
    render(<TimeToWatchCard stats={mockStats} />);

    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
    expect(screen.getByText('7 days')).toBeInTheDocument();
    expect(screen.getByText('The Office')).toBeInTheDocument();
    expect(screen.getByText('10 days')).toBeInTheDocument();
    expect(screen.getByText('Game of Thrones')).toBeInTheDocument();
    expect(screen.getByText('14 days')).toBeInTheDocument();
  });

  it('should not display fastest completions when empty', () => {
    const statsNoFastest = { ...mockStats, fastestCompletions: [] };
    render(<TimeToWatchCard stats={statsNoFastest} />);

    expect(screen.queryByText('Fastest Completions')).not.toBeInTheDocument();
  });

  it('should display backlog aging section', () => {
    render(<TimeToWatchCard stats={mockStats} />);

    expect(screen.getByText('Backlog Aging')).toBeInTheDocument();
  });

  it('should display backlog aging chips', () => {
    render(<TimeToWatchCard stats={mockStats} />);

    expect(screen.getByText('5 over 30 days')).toBeInTheDocument();
    expect(screen.getByText('3 over 90 days')).toBeInTheDocument();
    expect(screen.getByText('1 over 1 year')).toBeInTheDocument();
  });

  it('should not display backlog aging when all values are 0', () => {
    const statsNoBacklog = {
      ...mockStats,
      backlogAging: {
        unwatchedOver30Days: 0,
        unwatchedOver90Days: 0,
        unwatchedOver365Days: 0,
      },
    };
    render(<TimeToWatchCard stats={statsNoBacklog} />);

    expect(screen.queryByText('Backlog Aging')).not.toBeInTheDocument();
  });

  it('should only display non-zero backlog aging chips', () => {
    const statsPartialBacklog = {
      ...mockStats,
      backlogAging: {
        unwatchedOver30Days: 5,
        unwatchedOver90Days: 0,
        unwatchedOver365Days: 2,
      },
    };
    render(<TimeToWatchCard stats={statsPartialBacklog} />);

    expect(screen.getByText('5 over 30 days')).toBeInTheDocument();
    expect(screen.queryByText(/over 90 days/)).not.toBeInTheDocument();
    expect(screen.getByText('2 over 1 year')).toBeInTheDocument();
  });

  it('should render icons', () => {
    const { container } = render(<TimeToWatchCard stats={mockStats} />);

    // Check for AccessTimeIcon, SpeedIcon, WarningAmberIcon
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<TimeToWatchCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with minimal data', () => {
    const minimalStats = {
      averageDaysToStartShow: 10,
      averageDaysToCompleteShow: 30,
      fastestCompletions: [],
      backlogAging: {
        unwatchedOver30Days: 0,
        unwatchedOver90Days: 0,
        unwatchedOver365Days: 0,
      },
    } as TimeToWatchStats;

    const { container } = render(<TimeToWatchCard stats={minimalStats} />);

    expect(container).toMatchSnapshot();
  });
});
