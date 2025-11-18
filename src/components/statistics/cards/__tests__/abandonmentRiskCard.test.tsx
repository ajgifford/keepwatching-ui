import { render, screen } from '@testing-library/react';

import { AbandonmentRiskStats } from '@ajgifford/keepwatching-types';

import { AbandonmentRiskCard } from '../abandonmentRiskCard';

describe('AbandonmentRiskCard', () => {
  const mockStats: AbandonmentRiskStats = {
    showAbandonmentRate: 25.5,
    showsAtRisk: [
      {
        showId: 1,
        showTitle: 'Breaking Bad',
        daysSinceLastWatch: 45,
        unwatchedEpisodes: 20,
        profileName: 'John',
        status: 'at_risk',
      },
      {
        showId: 2,
        showTitle: 'Game of Thrones',
        daysSinceLastWatch: 95,
        unwatchedEpisodes: 15,
        profileName: 'Jane',
        status: 'at_risk',
      },
      {
        showId: 3,
        showTitle: 'The Office',
        daysSinceLastWatch: 60,
        unwatchedEpisodes: 10,
        status: 'at_risk',
      },
    ],
  } as unknown as AbandonmentRiskStats;

  it('should render with title', () => {
    render(<AbandonmentRiskCard stats={mockStats} />);

    expect(screen.getByText('Abandonment Risk Analysis')).toBeInTheDocument();
  });

  it('should display abandonment rate', () => {
    render(<AbandonmentRiskCard stats={mockStats} />);

    expect(screen.getByText('25.5%')).toBeInTheDocument();
    expect(screen.getByText('Show Abandonment Rate')).toBeInTheDocument();
  });

  it('should display Medium Risk chip for rate between 15-30', () => {
    render(<AbandonmentRiskCard stats={mockStats} />);

    expect(screen.getByText('Medium Risk')).toBeInTheDocument();
  });

  it('should display High Risk chip for rate above 30', () => {
    const highRiskStats = { ...mockStats, showAbandonmentRate: 35 };
    render(<AbandonmentRiskCard stats={highRiskStats} />);

    expect(screen.getByText('High Risk')).toBeInTheDocument();
  });

  it('should display Low Risk chip for rate below 15', () => {
    const lowRiskStats = { ...mockStats, showAbandonmentRate: 10 };
    render(<AbandonmentRiskCard stats={lowRiskStats} />);

    expect(screen.getByText('Low Risk')).toBeInTheDocument();
  });

  it('should display shows at risk count', () => {
    render(<AbandonmentRiskCard stats={mockStats} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Shows at Risk')).toBeInTheDocument();
    expect(screen.getByText('No progress in 30+ days')).toBeInTheDocument();
  });

  it('should display shows at risk list', () => {
    render(<AbandonmentRiskCard stats={mockStats} />);

    expect(screen.getByText('Shows Needing Attention')).toBeInTheDocument();
    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
    expect(screen.getByText('Game of Thrones')).toBeInTheDocument();
    expect(screen.getByText('The Office')).toBeInTheDocument();
  });

  it('should display days since last watch for each show', () => {
    render(<AbandonmentRiskCard stats={mockStats} />);

    expect(screen.getByText('45 days since last watch')).toBeInTheDocument();
    expect(screen.getByText('95 days since last watch')).toBeInTheDocument();
    expect(screen.getByText('60 days since last watch')).toBeInTheDocument();
  });

  it('should display unwatched episodes for each show', () => {
    render(<AbandonmentRiskCard stats={mockStats} />);

    expect(screen.getByText('20 unwatched episodes')).toBeInTheDocument();
    expect(screen.getByText('15 unwatched episodes')).toBeInTheDocument();
    expect(screen.getByText('10 unwatched episodes')).toBeInTheDocument();
  });

  it('should display profile names when available', () => {
    render(<AbandonmentRiskCard stats={mockStats} />);

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('should not display profile name when not available', () => {
    render(<AbandonmentRiskCard stats={mockStats} />);

    const johnElements = screen.getAllByText('John');
    const janeElements = screen.getAllByText('Jane');

    // Should only appear once each (for shows that have profile names)
    expect(johnElements).toHaveLength(1);
    expect(janeElements).toHaveLength(1);
  });

  it('should render warning icons', () => {
    const { container } = render(<AbandonmentRiskCard stats={mockStats} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should limit display to 10 shows', () => {
    const manyShows = Array.from({ length: 15 }, (_, i) => ({
      showId: i + 1,
      showTitle: `Show ${i + 1}`,
      daysSinceLastWatch: 40,
      unwatchedEpisodes: 5,
      status: 'at_risk',
    }));

    const statsWithMany = { ...mockStats, showsAtRisk: manyShows };
    render(<AbandonmentRiskCard stats={statsWithMany as unknown as AbandonmentRiskStats} />);

    expect(screen.getByText('Showing 10 of 15 shows at risk')).toBeInTheDocument();
  });

  it('should not show pagination text when 10 or fewer shows', () => {
    render(<AbandonmentRiskCard stats={mockStats} />);

    expect(screen.queryByText(/Showing 10 of/)).not.toBeInTheDocument();
  });

  it('should not render shows list when no shows at risk', () => {
    const noShowsStats = { ...mockStats, showsAtRisk: [] };
    render(<AbandonmentRiskCard stats={noShowsStats} />);

    expect(screen.queryByText('Shows Needing Attention')).not.toBeInTheDocument();
  });

  it('should render empty state when stats is null', () => {
    render(<AbandonmentRiskCard stats={null} />);

    expect(screen.getByText('Abandonment Risk Analysis')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should handle zero shows at risk count', () => {
    const zeroShowsStats = { ...mockStats, showsAtRisk: [] };
    render(<AbandonmentRiskCard stats={zeroShowsStats} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<AbandonmentRiskCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with empty state', () => {
    const { container } = render(<AbandonmentRiskCard stats={null} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with high risk', () => {
    const highRiskStats = { ...mockStats, showAbandonmentRate: 35 };
    const { container } = render(<AbandonmentRiskCard stats={highRiskStats} />);

    expect(container).toMatchSnapshot();
  });
});
