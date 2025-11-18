import { render } from '@testing-library/react';

import { ChartDataItem } from '../../utils/distributionTypes';
import { DistributionPieChart } from '../distributionPieChart';

// Mock recharts to avoid canvas issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ data }: { data: ChartDataItem[] }) => (
    <div data-testid="pie">
      {data.map((item, i) => (
        <div key={i} data-testid={`pie-item-${i}`}>
          {item.name}: {item.value}
        </div>
      ))}
    </div>
  ),
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe('DistributionPieChart', () => {
  const mockData: ChartDataItem[] = [
    { name: 'Action', value: 25 },
    { name: 'Comedy', value: 15 },
    { name: 'Drama', value: 30 },
  ];

  it('should render with data', () => {
    const { getByTestId } = render(<DistributionPieChart data={mockData} />);

    expect(getByTestId('pie-chart')).toBeInTheDocument();
    expect(getByTestId('pie')).toBeInTheDocument();
  });

  it('should render all data items', () => {
    const { getByTestId } = render(<DistributionPieChart data={mockData} />);

    expect(getByTestId('pie-item-0')).toHaveTextContent('Action: 25');
    expect(getByTestId('pie-item-1')).toHaveTextContent('Comedy: 15');
    expect(getByTestId('pie-item-2')).toHaveTextContent('Drama: 30');
  });

  it('should render with custom height', () => {
    const { container } = render(<DistributionPieChart data={mockData} height={400} />);

    expect(container).toBeInTheDocument();
  });

  it('should render with custom colors', () => {
    const customColors = ['#FF0000', '#00FF00', '#0000FF'];
    const { container } = render(<DistributionPieChart data={mockData} colors={customColors} />);

    expect(container).toBeInTheDocument();
  });

  it('should handle empty data array', () => {
    const { getByTestId } = render(<DistributionPieChart data={[]} />);

    expect(getByTestId('pie-chart')).toBeInTheDocument();
    expect(getByTestId('pie-item-0')).toHaveTextContent('No Data: 1');
  });

  it('should handle undefined data', () => {
    const { getByTestId } = render(<DistributionPieChart data={undefined as unknown as ChartDataItem[]} />);

    expect(getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('should use default colors when not provided', () => {
    const { container } = render(<DistributionPieChart data={mockData} />);

    expect(container).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<DistributionPieChart data={mockData} height={350} />);

    expect(container).toMatchSnapshot();
  });
});
