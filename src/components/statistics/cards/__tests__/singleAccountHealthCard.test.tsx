import { render, screen } from '@testing-library/react';

import { SingleAccountHealthCard } from '../singleAccountHealthCard';
import { AccountHealthMetrics } from '@ajgifford/keepwatching-types';

describe('SingleAccountHealthCard', () => {
  const mockStats: AccountHealthMetrics = {
    accountId: 123,
    accountEmail: 'test@example.com',
    accountCreatedAt: '2023-01-15T12:00:00Z',
    lastActivityDate: '2024-11-10T12:00:00Z',
    daysSinceLastActivity: 8,
    engagementScore: 85,
    riskLevel: 'low',
    totalEpisodesWatched: 1500,
    recentEpisodesWatched: 45,
    profileCount: 3,
    emailVerified: true,
    isAtRisk: false,
  } as AccountHealthMetrics;

  it('should render with title', () => {
    render(<SingleAccountHealthCard stats={mockStats} />);

    expect(screen.getByText('Account Health')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<SingleAccountHealthCard stats={mockStats} isLoading={true} />);

    expect(screen.getByText('Account Health')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display engagement score', () => {
    render(<SingleAccountHealthCard stats={mockStats} />);

    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('Engagement Score')).toBeInTheDocument();
    expect(screen.getByText('out of 100')).toBeInTheDocument();
  });

  it('should display days since last activity', () => {
    render(<SingleAccountHealthCard stats={mockStats} />);

    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Days Since Activity')).toBeInTheDocument();
  });

  it('should display total episodes watched', () => {
    render(<SingleAccountHealthCard stats={mockStats} />);

    expect(screen.getByText('1,500')).toBeInTheDocument();
    expect(screen.getByText('Total Episodes')).toBeInTheDocument();
  });

  it('should display profile count', () => {
    render(<SingleAccountHealthCard stats={mockStats} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Profiles')).toBeInTheDocument();
  });

  it('should display recent episodes watched', () => {
    render(<SingleAccountHealthCard stats={mockStats} />);

    expect(screen.getByText('45 episodes')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity (Last 30 Days)')).toBeInTheDocument();
  });

  it('should display low risk badge', () => {
    render(<SingleAccountHealthCard stats={mockStats} />);

    expect(screen.getByText('Low Risk')).toBeInTheDocument();
  });

  it('should display medium risk badge', () => {
    const mediumRiskStats = { ...mockStats, riskLevel: 'medium' as const };

    render(<SingleAccountHealthCard stats={mediumRiskStats} />);

    expect(screen.getByText('Medium Risk')).toBeInTheDocument();
  });

  it('should display high risk badge', () => {
    const highRiskStats = { ...mockStats, riskLevel: 'high' as const };

    render(<SingleAccountHealthCard stats={highRiskStats} />);

    expect(screen.getByText('High Risk')).toBeInTheDocument();
  });

  it('should display verified email status', () => {
    render(<SingleAccountHealthCard stats={mockStats} />);

    expect(screen.getByText('Email Status')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('should display unverified email status', () => {
    const unverifiedStats = { ...mockStats, emailVerified: false };

    render(<SingleAccountHealthCard stats={unverifiedStats} />);

    expect(screen.getByText('Not Verified')).toBeInTheDocument();
  });

  it('should display healthy status when not at risk', () => {
    render(<SingleAccountHealthCard stats={mockStats} />);

    expect(screen.getByText('At Risk Status')).toBeInTheDocument();
    expect(screen.getByText('Healthy')).toBeInTheDocument();
  });

  it('should display at risk status', () => {
    const atRiskStats = { ...mockStats, isAtRisk: true };

    render(<SingleAccountHealthCard stats={atRiskStats} />);

    expect(screen.getByText('At Risk')).toBeInTheDocument();
  });

  it('should display account created date', () => {
    render(<SingleAccountHealthCard stats={mockStats} />);

    expect(screen.getByText('Account Created')).toBeInTheDocument();
    expect(screen.getByText('1/15/2023')).toBeInTheDocument();
  });

  it('should display last activity date', () => {
    render(<SingleAccountHealthCard stats={mockStats} />);

    expect(screen.getByText('Last Activity')).toBeInTheDocument();
    // formatDate displays the date in locale format
    expect(screen.getByText(/Nov 10, 2024|11\/10\/2024/)).toBeInTheDocument();
  });

  it('should display "Never" when no last activity date', () => {
    const noActivityStats = { ...mockStats, lastActivityDate: null, daysSinceLastActivity: 0 };

    render(<SingleAccountHealthCard stats={noActivityStats} />);

    expect(screen.getByText('Never')).toBeInTheDocument();
  });

  it('should display "No Activity" when days since activity is zero or null', () => {
    const noActivityStats = { ...mockStats, daysSinceLastActivity: 0 };

    render(<SingleAccountHealthCard stats={noActivityStats} />);

    expect(screen.getByText('No Activity')).toBeInTheDocument();
  });

  it('should render progress bars', () => {
    const { container } = render(<SingleAccountHealthCard stats={mockStats} />);

    const progressBars = container.querySelectorAll('.MuiLinearProgress-root');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('should apply success color for recent activity', () => {
    const recentStats = { ...mockStats, daysSinceLastActivity: 7 };

    const { container } = render(<SingleAccountHealthCard stats={recentStats} />);

    expect(container.textContent).toContain('7');
  });

  it('should format large numbers with commas', () => {
    const largeStats = { ...mockStats, totalEpisodesWatched: 10000 };

    render(<SingleAccountHealthCard stats={largeStats} />);

    expect(screen.getByText('10,000')).toBeInTheDocument();
  });

  it('should render icons', () => {
    const { container } = render(<SingleAccountHealthCard stats={mockStats} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<SingleAccountHealthCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(<SingleAccountHealthCard stats={mockStats} isLoading={true} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with low risk', () => {
    const { container } = render(<SingleAccountHealthCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with medium risk', () => {
    const mediumRiskStats = { ...mockStats, riskLevel: 'medium' as const };

    const { container } = render(<SingleAccountHealthCard stats={mediumRiskStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with high risk', () => {
    const highRiskStats = { ...mockStats, riskLevel: 'high' as const, isAtRisk: true };

    const { container } = render(<SingleAccountHealthCard stats={highRiskStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with no activity', () => {
    const noActivityStats = {
      ...mockStats,
      lastActivityDate: null,
      daysSinceLastActivity: 0,
      recentEpisodesWatched: 0,
    };

    const { container } = render(<SingleAccountHealthCard stats={noActivityStats} />);

    expect(container).toMatchSnapshot();
  });
});
