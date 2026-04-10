import { Box, LinearProgress, Typography } from '@mui/material';

import { getProgressBarColor } from '../../../utils/watchStatusColors';

/**
 * Props for the {@link StatisticsProgressBar}.
 */
interface StatisticsProgressBarProps {
  /** Progress percentage (0–100) used as the determinate value of the bar. */
  value: number;
  /** Current count displayed as the numerator of the `current/total` label. */
  current: number;
  /** Total count displayed as the denominator of the `current/total` label. */
  total: number;
  /** Optional label rendered to the left of the `current/total` counter. */
  label?: string;
  /**
   * MUI color variant for the progress bar. When provided, overrides the
   * automatic color derived from `value`. Defaults to `"primary"`.
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  /** Height of the progress bar in pixels. Defaults to `10`. */
  height?: number;
}

/**
 * Labelled linear progress bar for statistics displays.
 *
 * Renders an optional label and a `current/total` counter above a MUI
 * `LinearProgress`, followed by a rounded percentage value. The bar color
 * defaults to `"primary"` but can be overridden via the `color` prop.
 */
export function StatisticsProgressBar({
  value,
  current,
  total,
  label,
  color = 'primary',
  height = 10,
}: StatisticsProgressBarProps) {
  const progressColor = color || getProgressBarColor(value);
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        {label && <Typography variant="body2">{label}</Typography>}
        <Typography variant="body2" color="text.secondary">
          {current}/{total}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={value}
            color={progressColor}
            sx={{ height: height, borderRadius: height / 2 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {Math.round(value)}%
        </Typography>
      </Box>
    </>
  );
}
