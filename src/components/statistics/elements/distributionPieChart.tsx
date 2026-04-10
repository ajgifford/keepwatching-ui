import { ChartDataItem } from '../utils/distributionTypes';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * Props for the {@link DistributionPieChart}.
 */
interface DistributionPieChartProps {
  /** Chart data items to render. Renders a single-slice placeholder when empty. */
  data: ChartDataItem[];
  /** Height of the chart in pixels. Defaults to `300`. */
  height?: number;
  /**
   * Ordered array of hex fill colors applied to slices cyclically.
   * Defaults to a six-color palette of green, amber, red, blue, purple, and orange.
   */
  colors?: string[];
}

const DEFAULT_COLORS = ['#4CAF50', '#FFC107', '#F44336', '#2196F3', '#9C27B0', '#FF9800'];

/**
 * Pie chart for displaying distribution data (e.g., genre or service counts).
 *
 * Renders a Recharts `PieChart` with percentage labels on each slice inside a responsive
 * container. Slice colors cycle through the `colors` prop. Shows a single-slice
 * "No Data" placeholder when `data` is empty.
 */
export function DistributionPieChart({ data, height = 300, colors = DEFAULT_COLORS }: DistributionPieChartProps) {
  const validData = data && data.length > 0 ? data : [{ name: 'No Data', value: 1 }];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={validData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={2}
          nameKey="name"
        >
          {validData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value} shows/movies`]}
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
