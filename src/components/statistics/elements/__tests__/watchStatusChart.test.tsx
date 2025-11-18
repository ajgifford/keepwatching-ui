import { render } from '@testing-library/react';

import { WatchStatusChart, WatchStatusDataItem } from '../watchStatusChart';

// Mock recharts to avoid canvas issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children, data }: { children: React.ReactNode; data: WatchStatusDataItem[] }) => (
    <div data-testid="bar-chart">
      {data.map((item, i) => (
        <div key={i} data-testid={`chart-item-${i}`}>
          {item.name}: watched={item.watched}, watching={item.watching}, notWatched={item.notWatched}
        </div>
      ))}
      {children}
    </div>
  ),
  Bar: ({ name, dataKey }: { name: string; dataKey: string }) => (
    <div data-testid={`bar-${dataKey}`}>
      {name} ({dataKey})
    </div>
  ),
  CartesianGrid: () => <div data-testid="grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe('WatchStatusChart', () => {
  const mockData: WatchStatusDataItem[] = [
    {
      name: 'Shows',
      watched: 25,
      watching: 15,
      notWatched: 10,
      upToDate: 5,
      unaired: 3,
    },
    {
      name: 'Movies',
      watched: 50,
      watching: 5,
      notWatched: 20,
      upToDate: 0,
      unaired: 2,
    },
  ];

  it('should render with data', () => {
    const { getByTestId } = render(<WatchStatusChart data={mockData} />);

    expect(getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should render all data items', () => {
    const { getByTestId } = render(<WatchStatusChart data={mockData} />);

    expect(getByTestId('chart-item-0')).toHaveTextContent('Shows: watched=25, watching=15, notWatched=10');
    expect(getByTestId('chart-item-1')).toHaveTextContent('Movies: watched=50, watching=5, notWatched=20');
  });

  it('should render all chart elements', () => {
    const { getByTestId } = render(<WatchStatusChart data={mockData} />);

    expect(getByTestId('grid')).toBeInTheDocument();
    expect(getByTestId('x-axis')).toBeInTheDocument();
    expect(getByTestId('y-axis')).toBeInTheDocument();
    expect(getByTestId('tooltip')).toBeInTheDocument();
    expect(getByTestId('legend')).toBeInTheDocument();
  });

  it('should render all watch status bars', () => {
    const { getByTestId } = render(<WatchStatusChart data={mockData} />);

    expect(getByTestId('bar-watched')).toHaveTextContent('Watched');
    expect(getByTestId('bar-watching')).toHaveTextContent('Watching');
    expect(getByTestId('bar-notWatched')).toHaveTextContent('Not Watched');
    expect(getByTestId('bar-upToDate')).toHaveTextContent('Up To Date');
    expect(getByTestId('bar-unaired')).toHaveTextContent('Unaired');
  });

  it('should render with custom height', () => {
    const { container } = render(<WatchStatusChart data={mockData} height={400} />);

    expect(container).toBeInTheDocument();
  });

  it('should render with default height', () => {
    const { container } = render(<WatchStatusChart data={mockData} />);

    expect(container).toBeInTheDocument();
  });

  it('should handle empty data array', () => {
    const { getByTestId } = render(<WatchStatusChart data={[]} />);

    expect(getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should render with single data item', () => {
    const singleItem: WatchStatusDataItem[] = [
      {
        name: 'Series',
        watched: 10,
        watching: 5,
        notWatched: 3,
        unaired: 1,
      },
    ];

    const { getByTestId } = render(<WatchStatusChart data={singleItem} />);

    expect(getByTestId('chart-item-0')).toHaveTextContent('Series: watched=10, watching=5, notWatched=3');
  });

  it('should handle data with optional fields', () => {
    const dataWithOptional: WatchStatusDataItem[] = [
      {
        name: 'Test',
        watched: 5,
        notWatched: 2,
        unaired: 1,
      },
    ];

    const { getByTestId } = render(<WatchStatusChart data={dataWithOptional} />);

    expect(getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<WatchStatusChart data={mockData} height={350} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with empty data', () => {
    const { container } = render(<WatchStatusChart data={[]} />);

    expect(container).toMatchSnapshot();
  });
});
