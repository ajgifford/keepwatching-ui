import { render, screen } from '@testing-library/react';

import { ContentBreakdownCard } from '../contentBreakdownCard';

describe('ContentBreakdownCard', () => {
  const mockItems = [
    { label: 'Shows', total: 150, progress: 75, color: 'primary' as const },
    { label: 'Movies', total: 80, progress: 50, color: 'secondary' as const },
    { label: 'Episodes', total: 2000, progress: 90, color: 'success' as const },
  ];

  it('should render with title', () => {
    render(<ContentBreakdownCard title="Content Summary" items={mockItems} />);

    expect(screen.getByText('Content Summary')).toBeInTheDocument();
  });

  it('should render all items', () => {
    render(<ContentBreakdownCard title="Breakdown" items={mockItems} />);

    expect(screen.getByText('Shows')).toBeInTheDocument();
    expect(screen.getByText('Movies')).toBeInTheDocument();
    expect(screen.getByText('Episodes')).toBeInTheDocument();
  });

  it('should display total counts', () => {
    render(<ContentBreakdownCard title="Breakdown" items={mockItems} />);

    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('2000')).toBeInTheDocument();
  });

  it('should render progress bars for each item', () => {
    const { container } = render(<ContentBreakdownCard title="Breakdown" items={mockItems} />);

    const progressBars = container.querySelectorAll('.MuiLinearProgress-root');
    expect(progressBars).toHaveLength(3);
  });

  it('should render with different colors', () => {
    const { container } = render(<ContentBreakdownCard title="Breakdown" items={mockItems} />);

    expect(container.querySelector('.MuiLinearProgress-colorPrimary')).toBeInTheDocument();
    expect(container.querySelector('.MuiLinearProgress-colorSecondary')).toBeInTheDocument();
    expect(container.querySelector('.MuiLinearProgress-colorSuccess')).toBeInTheDocument();
  });

  it('should handle single item', () => {
    const singleItem = [{ label: 'Total', total: 100, progress: 60, color: 'info' as const }];

    render(<ContentBreakdownCard title="Single Item" items={singleItem} />);

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('should handle empty items array', () => {
    render(<ContentBreakdownCard title="Empty" items={[]} />);

    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('should render items in correct order', () => {
    render(<ContentBreakdownCard title="Breakdown" items={mockItems} />);

    const labels = screen.getAllByText(/Shows|Movies|Episodes/);
    expect(labels[0]).toHaveTextContent('Shows');
    expect(labels[1]).toHaveTextContent('Movies');
    expect(labels[2]).toHaveTextContent('Episodes');
  });

  it('should handle zero progress', () => {
    const itemsWithZero = [{ label: 'No Progress', total: 100, progress: 0, color: 'error' as const }];

    render(<ContentBreakdownCard title="Zero Progress" items={itemsWithZero} />);

    expect(screen.getByText('No Progress')).toBeInTheDocument();
  });

  it('should handle 100% progress', () => {
    const itemsWithFull = [{ label: 'Complete', total: 50, progress: 100, color: 'success' as const }];

    render(<ContentBreakdownCard title="Full Progress" items={itemsWithFull} />);

    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('should match snapshot with multiple items', () => {
    const { container } = render(<ContentBreakdownCard title="Content Breakdown" items={mockItems} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with single item', () => {
    const singleItem = [{ label: 'Shows', total: 50, progress: 75, color: 'primary' as const }];
    const { container } = render(<ContentBreakdownCard title="Single" items={singleItem} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with empty items', () => {
    const { container } = render(<ContentBreakdownCard title="Empty" items={[]} />);

    expect(container).toMatchSnapshot();
  });
});
