import { render, screen } from '@testing-library/react';

import { SeasonalViewingStats } from '@ajgifford/keepwatching-types';

import { SeasonalViewingCard } from '../seasonalViewingCard';

describe('SeasonalViewingCard', () => {
  const mockStats: SeasonalViewingStats = {
    viewingBySeason: {
      spring: 450,
      summer: 380,
      fall: 520,
      winter: 490,
    },
    viewingByMonth: {
      January: 150,
      February: 140,
      March: 160,
      April: 145,
      May: 155,
      June: 150,
      July: 130,
      August: 125,
      September: 135,
      October: 175,
      November: 180,
      December: 165,
    },
    peakViewingMonth: 'November',
    slowestViewingMonth: 'August',
  } as SeasonalViewingStats;

  it('should render with title', () => {
    render(<SeasonalViewingCard stats={mockStats} />);

    expect(screen.getByText('Seasonal Viewing Patterns')).toBeInTheDocument();
  });

  it('should return null when stats are null', () => {
    const { container } = render(<SeasonalViewingCard stats={null} />);

    expect(container.firstChild).toBeNull();
  });

  it('should display peak viewing month', () => {
    render(<SeasonalViewingCard stats={mockStats} />);

    expect(screen.getByText('Peak Viewing Month')).toBeInTheDocument();
    expect(screen.getByText('November')).toBeInTheDocument();
  });

  it('should display slowest viewing month', () => {
    render(<SeasonalViewingCard stats={mockStats} />);

    expect(screen.getByText('Slowest Viewing Month')).toBeInTheDocument();
    expect(screen.getByText('August')).toBeInTheDocument();
  });

  it('should display episodes by season section', () => {
    render(<SeasonalViewingCard stats={mockStats} />);

    expect(screen.getByText('Episodes by Season')).toBeInTheDocument();
  });

  it('should display all four seasons', () => {
    render(<SeasonalViewingCard stats={mockStats} />);

    expect(screen.getByText('Spring')).toBeInTheDocument();
    expect(screen.getByText('Summer')).toBeInTheDocument();
    expect(screen.getByText('Fall')).toBeInTheDocument();
    expect(screen.getByText('Winter')).toBeInTheDocument();
  });

  it('should display seasonal episode counts', () => {
    render(<SeasonalViewingCard stats={mockStats} />);

    expect(screen.getByText('450')).toBeInTheDocument(); // Spring
    expect(screen.getByText('380')).toBeInTheDocument(); // Summer
    expect(screen.getByText('520')).toBeInTheDocument(); // Fall
    expect(screen.getByText('490')).toBeInTheDocument(); // Winter
  });

  it('should display episodes by month section', () => {
    render(<SeasonalViewingCard stats={mockStats} />);

    expect(screen.getByText('Episodes by Month')).toBeInTheDocument();
  });

  it('should display all twelve months', () => {
    render(<SeasonalViewingCard stats={mockStats} />);

    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Feb')).toBeInTheDocument();
    expect(screen.getByText('Mar')).toBeInTheDocument();
    expect(screen.getByText('Apr')).toBeInTheDocument();
    expect(screen.getByText('May')).toBeInTheDocument();
    expect(screen.getByText('Jun')).toBeInTheDocument();
    expect(screen.getByText('Jul')).toBeInTheDocument();
    expect(screen.getByText('Aug')).toBeInTheDocument();
    expect(screen.getByText('Sep')).toBeInTheDocument();
    expect(screen.getByText('Oct')).toBeInTheDocument();
    expect(screen.getByText('Nov')).toBeInTheDocument();
    expect(screen.getByText('Dec')).toBeInTheDocument();
  });

  it('should display monthly episode counts', () => {
    render(<SeasonalViewingCard stats={mockStats} />);

    // Check for unique values first
    expect(screen.getByText('180')).toBeInTheDocument(); // November
    expect(screen.getByText('125')).toBeInTheDocument(); // August
    // January and June both have 150, so use getAllByText
    expect(screen.getAllByText('150').length).toBeGreaterThan(0);
  });

  it('should not show peak/slowest months when marked as N/A', () => {
    const naStats = {
      ...mockStats,
      peakViewingMonth: 'N/A',
      slowestViewingMonth: 'N/A',
    };

    render(<SeasonalViewingCard stats={naStats} />);

    expect(screen.queryByText('Peak Viewing Month')).not.toBeInTheDocument();
    expect(screen.queryByText('Slowest Viewing Month')).not.toBeInTheDocument();
  });

  it('should render with all zero viewing data', () => {
    const zeroStats: SeasonalViewingStats = {
      viewingBySeason: {
        spring: 0,
        summer: 0,
        fall: 0,
        winter: 0,
      },
      viewingByMonth: {},
      peakViewingMonth: 'N/A',
      slowestViewingMonth: 'N/A',
    } as SeasonalViewingStats;

    render(<SeasonalViewingCard stats={zeroStats} />);

    // With all zeros in seasonal data, monthly section should still render (with 12 months of zeros)
    // But seasonal section won't render since hasSeasonalData is false
    expect(screen.queryByText('Episodes by Season')).not.toBeInTheDocument();
    expect(screen.getByText('Episodes by Month')).toBeInTheDocument();
  });

  it('should render calendar icon', () => {
    const { container } = render(<SeasonalViewingCard stats={mockStats} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should render seasonal heat map boxes', () => {
    const { container } = render(<SeasonalViewingCard stats={mockStats} />);

    // Should have 4 seasonal boxes
    const seasonBoxes = container.querySelectorAll('.MuiGrid-root');
    expect(seasonBoxes.length).toBeGreaterThan(0);
  });

  it('should handle missing months in viewingByMonth', () => {
    const partialMonthStats = {
      ...mockStats,
      viewingByMonth: {
        January: 150,
        February: 140,
      },
    };

    render(<SeasonalViewingCard stats={partialMonthStats} />);

    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Feb')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('140')).toBeInTheDocument();
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<SeasonalViewingCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with null stats', () => {
    const { container } = render(<SeasonalViewingCard stats={null} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with zero data', () => {
    const zeroStats: SeasonalViewingStats = {
      viewingBySeason: {
        spring: 0,
        summer: 0,
        fall: 0,
        winter: 0,
      },
      viewingByMonth: {},
      peakViewingMonth: 'N/A',
      slowestViewingMonth: 'N/A',
    } as SeasonalViewingStats;

    const { container } = render(<SeasonalViewingCard stats={zeroStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with N/A months', () => {
    const naStats = {
      ...mockStats,
      peakViewingMonth: 'N/A',
      slowestViewingMonth: 'N/A',
    };

    const { container } = render(<SeasonalViewingCard stats={naStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with partial month data', () => {
    const partialStats = {
      ...mockStats,
      viewingByMonth: {
        January: 150,
        February: 140,
        March: 160,
      },
    };

    const { container } = render(<SeasonalViewingCard stats={partialStats} />);

    expect(container).toMatchSnapshot();
  });
});
