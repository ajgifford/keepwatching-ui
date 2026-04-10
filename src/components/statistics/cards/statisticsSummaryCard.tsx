import { Box, Grid, Paper, Typography } from '@mui/material';

import { StatisticsProgressBar } from '../elements/statisticsProgressBar';

/**
 * A single key-stat item displayed alongside the progress bar.
 */
interface StatItem {
  /** Numeric value for the stat. */
  value: number;
  /** Human-readable label shown below the value. */
  label: string;
  /** MUI color variant applied to the value text. Defaults to `"primary"`. */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

/**
 * Props for the {@link StatisticsSummaryCard}.
 */
interface StatisticsSummaryCardProps {
  /** Label above the progress bar. Defaults to `"Overall Progress"`. */
  progressLabel?: string;
  /** Progress percentage (0–100) for the `StatisticsProgressBar`. */
  progressValue: number;
  /** Watched count displayed as the numerator of the progress fraction. */
  currentCount: number;
  /** Total count displayed as the denominator of the progress fraction. */
  totalCount: number;
  /** Array of key-stat items displayed in a row beside the progress bar. */
  stats: StatItem[];
}

/**
 * Summary banner card shown at the top of each statistics dashboard.
 *
 * Renders a labelled `StatisticsProgressBar` on the left and a row of key
 * stat values (e.g., profile count, unique shows, unique movies) on the right,
 * inside a MUI `Paper` component with elevation 2.
 */
export function StatisticsSummaryCard({
  progressLabel = 'Overall Progress',
  progressValue,
  currentCount,
  totalCount,
  stats,
}: StatisticsSummaryCardProps) {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            {progressLabel}
          </Typography>
          <StatisticsProgressBar
            value={progressValue}
            current={currentCount}
            total={totalCount}
            color="success"
            height={10}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            {stats.map((stat, index) => (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color={stat.color || 'primary'}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
