import { useTheme } from '@mui/material';

import { ChartDataItem } from '../utils/distributionTypes';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/**
 * Props for the {@link DistributionBarChart}.
 */
interface DistributionBarChartProps {
  /** Chart data items to render. Renders a "No Data" placeholder when empty. */
  data: ChartDataItem[];
  /** Height of the chart in pixels. Defaults to `300`. */
  height?: number;
  /** Fill color for the bars. Defaults to the MUI primary theme color. */
  color?: string;
}

/**
 * Horizontal bar chart for displaying distribution data (e.g., genre or service counts).
 *
 * Renders a Recharts `BarChart` in vertical layout (categories on the y-axis, values on the
 * x-axis) inside a responsive container. The left margin is automatically sized based on the
 * longest category label. Displays a single "No Data" bar when `data` is empty.
 */
export function DistributionBarChart({ data, height = 300, color }: DistributionBarChartProps) {
  const theme = useTheme();
  const barColor = color || theme.palette.primary.main;

  const validData = data && data.length > 0 ? data : [{ name: 'No Data', value: 0 }];

  const maxLabelLength = Math.max(...validData.map((item) => item.name.length));
  const leftMargin = Math.min(Math.max(30, maxLabelLength * 6), 120);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={validData} layout="vertical" margin={{ top: 20, right: 30, left: leftMargin, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" />
        <Tooltip
          formatter={(value) => [`${value ?? 0} shows/movies`]}
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
        />
        <Bar
          dataKey="value"
          fill={barColor}
          name="Count"
          label={{ position: 'right', fill: '#333', fontSize: 12 }}
          isAnimationActive={true}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
