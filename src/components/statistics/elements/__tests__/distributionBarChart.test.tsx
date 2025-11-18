import { render } from '@testing-library/react';

import { ChartDataItem } from '../../utils/distributionTypes';
import { DistributionBarChart } from '../distributionBarChart';

// Mock recharts to avoid canvas issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children, data }: { children: React.ReactNode; data: ChartDataItem[] }) => (
    <div data-testid="bar-chart">
      {data.map((item, i) => (
        <div key={i} data-testid={`bar-item-${i}`}>
          {item.name}: {item.value}
        </div>
      ))}
      {children}
    </div>
  ),
  Bar: () => <div data-testid="bar" />,
  CartesianGrid: () => <div data-testid="grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe('DistributionBarChart', () => {
  const mockData: ChartDataItem[] = [
    { name: 'Action', value: 25 },
    { name: 'Comedy', value: 15 },
    { name: 'Drama', value: 30 },
  ];

  it('should render with data', () => {
    const { getByTestId } = render(<DistributionBarChart data={mockData} />);

    expect(getByTestId('bar-chart')).toBeInTheDocument();
    expect(getByTestId('bar')).toBeInTheDocument();
  });

  it('should render all data items', () => {
    const { getByTestId } = render(<DistributionBarChart data={mockData} />);

    expect(getByTestId('bar-item-0')).toHaveTextContent('Action: 25');
    expect(getByTestId('bar-item-1')).toHaveTextContent('Comedy: 15');
    expect(getByTestId('bar-item-2')).toHaveTextContent('Drama: 30');
  });

  it('should render chart elements', () => {
    const { getByTestId } = render(<DistributionBarChart data={mockData} />);

    expect(getByTestId('grid')).toBeInTheDocument();
    expect(getByTestId('x-axis')).toBeInTheDocument();
    expect(getByTestId('y-axis')).toBeInTheDocument();
    expect(getByTestId('tooltip')).toBeInTheDocument();
  });

  it('should render with custom height', () => {
    const { container } = render(<DistributionBarChart data={mockData} height={400} />);

    expect(container).toBeInTheDocument();
  });

  it('should render with custom color', () => {
    const { container } = render(<DistributionBarChart data={mockData} color="#FF0000" />);

    expect(container).toBeInTheDocument();
  });

  it('should handle empty data array', () => {
    const { getByTestId } = render(<DistributionBarChart data={[]} />);

    expect(getByTestId('bar-chart')).toBeInTheDocument();
    expect(getByTestId('bar-item-0')).toHaveTextContent('No Data: 0');
  });

  it('should handle undefined data', () => {
    const { getByTestId } = render(<DistributionBarChart data={undefined as unknown as ChartDataItem[]} />);

    expect(getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should calculate left margin based on label length', () => {
    const longLabelData: ChartDataItem[] = [
      { name: 'Very Long Category Name That Should Increase Margin', value: 10 },
      { name: 'Short', value: 5 },
    ];

    const { container } = render(<DistributionBarChart data={longLabelData} />);

    expect(container).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<DistributionBarChart data={mockData} height={350} color="#123456" />);

    expect(container).toMatchSnapshot();
  });
});
