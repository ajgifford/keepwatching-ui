import { CheckCircle as CheckCircleIcon, Error as ErrorIcon, Warning as WarningIcon } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Grid, LinearProgress, Typography } from '@mui/material';

import { DateFormatters, createDateFormatters } from '../../../utils';
import { AccountHealthMetrics } from '@ajgifford/keepwatching-types';

/**
 * Props for the {@link SingleAccountHealthCard}.
 */
interface SingleAccountHealthCardProps {
  /** Health metrics for a single account. */
  stats: AccountHealthMetrics;
  /** When `true`, renders a loading placeholder. Defaults to `false`. */
  isLoading?: boolean;
  /**
   * Pre-configured date formatters used for account creation and last activity dates.
   * When omitted, formatters are created with default display preferences.
   */
  formatters?: DateFormatters;
}

function RiskLevelBadge({ riskLevel }: { riskLevel: 'low' | 'medium' | 'high' }) {
  const config = {
    low: { icon: <CheckCircleIcon />, color: 'success', label: 'Low Risk' },
    medium: { icon: <WarningIcon />, color: 'warning', label: 'Medium Risk' },
    high: { icon: <ErrorIcon />, color: 'error', label: 'High Risk' },
  }[riskLevel];

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color as 'success' | 'warning' | 'error'}
      size="medium"
    />
  );
}

/**
 * Card that displays health metrics for a single user account.
 *
 * Shows the engagement score, days since last activity, total episodes watched,
 * and profile count, plus two progress bars for recent activity (last 30 days)
 * and activity recency. Also surfaces account creation date, last activity date,
 * email verification status, and at-risk status. Renders a loading placeholder
 * when `isLoading` is `true`.
 */
export function SingleAccountHealthCard({ stats, isLoading = false, formatters: propFormatters }: SingleAccountHealthCardProps) {
  const formatters = propFormatters ?? createDateFormatters();
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Health
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const activityPercentage = stats.daysSinceLastActivity <= 30 ? 100 : Math.max(0, 100 - stats.daysSinceLastActivity);
  const lastActivityDisplay = stats.lastActivityDate ? formatters.activityDate(stats.lastActivityDate) : 'Never';

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Account Health</Typography>
          <RiskLevelBadge riskLevel={stats.riskLevel} />
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {stats.engagementScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Engagement Score
              </Typography>
              <Typography variant="caption" color="text.secondary">
                out of 100
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                color={stats.daysSinceLastActivity <= 7 ? 'success.main' : 'text.secondary'}
                fontWeight="bold"
              >
                {stats.daysSinceLastActivity ? stats.daysSinceLastActivity.toLocaleString() : 'No Activity'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Days Since Activity
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {stats.totalEpisodesWatched.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Episodes
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {stats.profileCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Profiles
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Recent Activity (Last 30 Days)
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {stats.recentEpisodesWatched} episodes
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, (stats.recentEpisodesWatched / Math.max(1, stats.totalEpisodesWatched / 10)) * 100)}
            color="primary"
            sx={{ height: 8, borderRadius: 1 }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Activity Recency
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {activityPercentage}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={activityPercentage}
            color={
              stats.daysSinceLastActivity <= 30 ? 'success' : stats.daysSinceLastActivity <= 90 ? 'warning' : 'error'
            }
            sx={{ height: 8, borderRadius: 1 }}
          />
        </Box>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Account Created
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {formatters.milestoneDate(stats.accountCreatedAt)}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Last Activity
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {lastActivityDisplay}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Email Status
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                {stats.emailVerified ? (
                  <Chip label="Verified" color="success" size="small" />
                ) : (
                  <Chip label="Not Verified" color="warning" size="small" />
                )}
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                At Risk Status
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                {stats.isAtRisk ? (
                  <Chip label="At Risk" color="error" size="small" />
                ) : (
                  <Chip label="Healthy" color="success" size="small" />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
