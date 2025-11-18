import { render, screen } from '@testing-library/react';

import { AccountHealthStats } from '@ajgifford/keepwatching-types';

import { AccountHealthCard } from '../accountHealthCard';

describe('AccountHealthCard', () => {
  const mockStats: AccountHealthStats = {
    totalAccounts: 150,
    activeAccounts: 100,
    inactiveAccounts: 30,
    atRiskAccounts: 20,
    averageEngagementScore: 75,
    riskDistribution: {
      low: 90,
      medium: 40,
      high: 20,
    },
  } as AccountHealthStats;

  it('should render with title', () => {
    render(<AccountHealthCard stats={mockStats} />);

    expect(screen.getByText('Account Health')).toBeInTheDocument();
  });

  it('should display total accounts', () => {
    render(<AccountHealthCard stats={mockStats} />);

    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Total Accounts')).toBeInTheDocument();
  });

  it('should display active accounts with percentage', () => {
    render(<AccountHealthCard stats={mockStats} />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText(/Active \(67%\)/)).toBeInTheDocument();
  });

  it('should display inactive accounts', () => {
    render(<AccountHealthCard stats={mockStats} />);

    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('should display at risk accounts with percentage', () => {
    render(<AccountHealthCard stats={mockStats} />);

    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText(/At Risk \(13%\)/)).toBeInTheDocument();
  });

  it('should display average engagement score', () => {
    render(<AccountHealthCard stats={mockStats} />);

    expect(screen.getByText('Average Engagement Score')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('out of 100')).toBeInTheDocument();
  });

  it('should display risk distribution section', () => {
    render(<AccountHealthCard stats={mockStats} />);

    expect(screen.getByText('Risk Distribution')).toBeInTheDocument();
  });

  it('should display low risk indicator', () => {
    render(<AccountHealthCard stats={mockStats} />);

    expect(screen.getByText('Low Risk')).toBeInTheDocument();
    expect(screen.getByText('90 accounts (60%)')).toBeInTheDocument();
  });

  it('should display medium risk indicator', () => {
    render(<AccountHealthCard stats={mockStats} />);

    expect(screen.getByText('Medium Risk')).toBeInTheDocument();
    expect(screen.getByText('40 accounts (27%)')).toBeInTheDocument();
  });

  it('should display high risk indicator', () => {
    render(<AccountHealthCard stats={mockStats} />);

    expect(screen.getByText('High Risk')).toBeInTheDocument();
    expect(screen.getByText('20 accounts (13%)')).toBeInTheDocument();
  });

  it('should calculate percentages correctly', () => {
    render(<AccountHealthCard stats={mockStats} />);

    // Active: 100/150 = 67%
    expect(screen.getByText(/Active \(67%\)/)).toBeInTheDocument();
    // At Risk: 20/150 = 13%
    expect(screen.getByText(/At Risk \(13%\)/)).toBeInTheDocument();
  });

  it('should handle zero total accounts without errors', () => {
    const zeroStats = {
      totalAccounts: 0,
      activeAccounts: 0,
      inactiveAccounts: 0,
      atRiskAccounts: 0,
      averageEngagementScore: 0,
      riskDistribution: {
        low: 0,
        medium: 0,
        high: 0,
      },
    } as AccountHealthStats;

    render(<AccountHealthCard stats={zeroStats} />);

    expect(screen.getByText('Total Accounts')).toBeInTheDocument();
    expect(screen.getByText(/Active \(0%\)/)).toBeInTheDocument();
    expect(screen.getByText(/At Risk \(0%\)/)).toBeInTheDocument();
  });

  it('should format large numbers with commas', () => {
    const largeStats = {
      ...mockStats,
      totalAccounts: 5000,
      activeAccounts: 3500,
      inactiveAccounts: 1000,
      atRiskAccounts: 500,
    };

    render(<AccountHealthCard stats={largeStats} />);

    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('3,500')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<AccountHealthCard stats={mockStats} isLoading={true} />);

    expect(screen.getByText('Account Health')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Total Accounts')).not.toBeInTheDocument();
  });

  it('should render progress bars for risk levels', () => {
    const { container } = render(<AccountHealthCard stats={mockStats} />);

    const progressBars = container.querySelectorAll('.MuiLinearProgress-root');
    expect(progressBars).toHaveLength(3); // low, medium, high
  });

  it('should render icons for risk levels', () => {
    const { container } = render(<AccountHealthCard stats={mockStats} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should display risk level chips with correct colors', () => {
    const { container } = render(<AccountHealthCard stats={mockStats} />);

    // Check for chip elements
    const chips = container.querySelectorAll('.MuiChip-root');
    expect(chips.length).toBeGreaterThan(0);
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<AccountHealthCard stats={mockStats} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(<AccountHealthCard stats={mockStats} isLoading={true} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with zero accounts', () => {
    const zeroStats = {
      totalAccounts: 0,
      activeAccounts: 0,
      inactiveAccounts: 0,
      atRiskAccounts: 0,
      averageEngagementScore: 0,
      riskDistribution: {
        low: 0,
        medium: 0,
        high: 0,
      },
    } as AccountHealthStats;

    const { container } = render(<AccountHealthCard stats={zeroStats} />);

    expect(container).toMatchSnapshot();
  });
});
