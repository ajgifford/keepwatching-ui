import { render, screen } from '@testing-library/react';

import { StatisticsSummaryCard } from '../statisticsSummaryCard';

describe('StatisticsSummaryCard', () => {
  const mockStats = [
    { value: 10, label: 'Shows', color: 'primary' as const },
    { value: 25, label: 'Movies', color: 'secondary' as const },
    { value: 100, label: 'Episodes', color: 'success' as const },
  ];

  it('should render with all required props', () => {
    render(
      <StatisticsSummaryCard progressValue={75} currentCount={150} totalCount={200} stats={mockStats} />
    );

    expect(screen.getByText('Overall Progress')).toBeInTheDocument();
    expect(screen.getByText('150/200')).toBeInTheDocument();
  });

  it('should render custom progress label', () => {
    render(
      <StatisticsSummaryCard
        progressLabel="Episode Watch Progress"
        progressValue={50}
        currentCount={100}
        totalCount={200}
        stats={mockStats}
      />
    );

    expect(screen.getByText('Episode Watch Progress')).toBeInTheDocument();
  });

  it('should render all stat items', () => {
    render(
      <StatisticsSummaryCard progressValue={75} currentCount={150} totalCount={200} stats={mockStats} />
    );

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Shows')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Movies')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Episodes')).toBeInTheDocument();
  });

  it('should render progress percentage', () => {
    render(
      <StatisticsSummaryCard progressValue={75.5} currentCount={151} totalCount={200} stats={mockStats} />
    );

    expect(screen.getByText('76%')).toBeInTheDocument();
  });

  it('should handle zero progress', () => {
    render(
      <StatisticsSummaryCard progressValue={0} currentCount={0} totalCount={200} stats={mockStats} />
    );

    expect(screen.getByText('0/200')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('should handle 100% progress', () => {
    render(
      <StatisticsSummaryCard progressValue={100} currentCount={200} totalCount={200} stats={mockStats} />
    );

    expect(screen.getByText('200/200')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should render with empty stats array', () => {
    render(
      <StatisticsSummaryCard progressValue={50} currentCount={100} totalCount={200} stats={[]} />
    );

    expect(screen.getByText('Overall Progress')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(
      <StatisticsSummaryCard
        progressLabel="Test Progress"
        progressValue={75}
        currentCount={150}
        totalCount={200}
        stats={mockStats}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
