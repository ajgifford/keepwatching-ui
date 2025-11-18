import { render, screen } from '@testing-library/react';

import { StatisticsProgressBar } from '../statisticsProgressBar';

describe('StatisticsProgressBar', () => {
  it('should render with required props', () => {
    render(<StatisticsProgressBar value={75} current={150} total={200} />);

    expect(screen.getByText('150/200')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<StatisticsProgressBar value={50} current={100} total={200} label="Episodes Watched" />);

    expect(screen.getByText('Episodes Watched')).toBeInTheDocument();
    expect(screen.getByText('100/200')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('should round percentage correctly', () => {
    render(<StatisticsProgressBar value={75.7} current={151} total={200} />);

    expect(screen.getByText('76%')).toBeInTheDocument();
  });

  it('should handle 0% progress', () => {
    render(<StatisticsProgressBar value={0} current={0} total={100} />);

    expect(screen.getByText('0/100')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('should handle 100% progress', () => {
    render(<StatisticsProgressBar value={100} current={200} total={200} />);

    expect(screen.getByText('200/200')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should render with custom color', () => {
    const { container } = render(
      <StatisticsProgressBar value={75} current={150} total={200} color="success" />
    );

    const progressBar = container.querySelector('.MuiLinearProgress-colorSuccess');
    expect(progressBar).toBeInTheDocument();
  });

  it('should render with custom height', () => {
    const { container } = render(
      <StatisticsProgressBar value={75} current={150} total={200} height={20} />
    );

    const progressBar = container.querySelector('.MuiLinearProgress-root');
    expect(progressBar).toBeInTheDocument();
  });

  it('should handle decimal values correctly', () => {
    render(<StatisticsProgressBar value={33.33} current={100} total={300} />);

    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('should match snapshot with all props', () => {
    const { container } = render(
      <StatisticsProgressBar
        value={75}
        current={150}
        total={200}
        label="Progress"
        color="success"
        height={15}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot without label', () => {
    const { container } = render(<StatisticsProgressBar value={50} current={50} total={100} />);

    expect(container).toMatchSnapshot();
  });
});
