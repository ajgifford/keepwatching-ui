import { WATCH_STATUS_COLORS } from '../../../utils/watchStatusColors';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/**
 * A single data row for the {@link WatchStatusChart}, typically representing one
 * content type (e.g., "Shows" or "Movies").
 */
export interface WatchStatusDataItem {
  /** Display name for this data row shown on the x-axis (e.g., `"Shows"`, `"Movies"`). */
  name: string;
  /** Count of content items with `WATCHED` status. */
  watched: number;
  /** Count of content items with `WATCHING` status. Not applicable to movies. */
  watching?: number;
  /** Count of content items with `NOT_WATCHED` status. */
  notWatched: number;
  /** Count of content items with `UP_TO_DATE` status. Not applicable to movies. */
  upToDate?: number;
  /** Count of content items with `UNAIRED` status. */
  unaired: number;
  [key: string]: string | number | undefined;
}

/**
 * Props for the {@link WatchStatusChart}.
 */
interface WatchStatusChartProps {
  /** Array of data rows to render, one per content type. */
  data: WatchStatusDataItem[];
  /** Height of the chart in pixels. Defaults to `300`. */
  height?: number;
}

/**
 * Stacked bar chart that visualizes watch status counts for one or more content types.
 *
 * Renders a Recharts `BarChart` with stacked bars for each watch status category
 * (Watched, Up To Date, Watching, Not Watched, Unaired), using the colors defined
 * in `WATCH_STATUS_COLORS`. Includes a legend and tooltip.
 */
export function WatchStatusChart({ data, height = 300 }: WatchStatusChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="watched" stackId="a" fill={WATCH_STATUS_COLORS.watched} name="Watched" />
        <Bar dataKey="upToDate" stackId="a" fill={WATCH_STATUS_COLORS.upToDate} name="Up To Date" />
        <Bar dataKey="watching" stackId="a" fill={WATCH_STATUS_COLORS.watching} name="Watching" />
        <Bar dataKey="notWatched" stackId="a" fill={WATCH_STATUS_COLORS.notWatched} name="Not Watched" />
        <Bar dataKey="unaired" stackId="a" fill={WATCH_STATUS_COLORS.unaired} name="Unaired" />
      </BarChart>
    </ResponsiveContainer>
  );
}
