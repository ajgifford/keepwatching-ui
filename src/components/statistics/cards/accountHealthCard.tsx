import { CheckCircle as CheckCircleIcon, Error as ErrorIcon, Warning as WarningIcon } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Grid, LinearProgress, Typography } from '@mui/material';

import { AccountHealthStats } from '@ajgifford/keepwatching-types';

interface AccountHealthCardProps {
  stats: AccountHealthStats;
  isLoading?: boolean;
}

interface RiskLevelIndicatorProps {
  level: 'low' | 'medium' | 'high';
  count: number;
  total: number;
}

function RiskLevelIndicator({ level, count, total }: RiskLevelIndicatorProps) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  const config = {
    low: { icon: <CheckCircleIcon />, color: 'success', label: 'Low Risk' },
    medium: { icon: <WarningIcon />, color: 'warning', label: 'Medium Risk' },
    high: { icon: <ErrorIcon />, color: 'error', label: 'High Risk' },
  }[level];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Chip
          icon={config.icon}
          label={config.label}
          color={config.color as 'success' | 'warning' | 'error'}
          size="small"
        />
        <Typography variant="body2" color="text.secondary">
          {count.toLocaleString()} accounts ({percentage}%)
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        color={config.color as 'success' | 'warning' | 'error'}
        sx={{ height: 8, borderRadius: 1 }}
      />
    </Box>
  );
}

export function AccountHealthCard({ stats, isLoading = false }: AccountHealthCardProps) {
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

  const activePercentage = stats.totalAccounts > 0 ? Math.round((stats.activeAccounts / stats.totalAccounts) * 100) : 0;
  const atRiskPercentage = stats.totalAccounts > 0 ? Math.round((stats.atRiskAccounts / stats.totalAccounts) * 100) : 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Account Health
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {stats.totalAccounts.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Accounts
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {stats.activeAccounts.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active ({activePercentage}%)
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="text.secondary" fontWeight="bold">
                {stats.inactiveAccounts.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inactive
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {stats.atRiskAccounts.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                At Risk ({atRiskPercentage}%)
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Average Engagement Score
          </Typography>
          <Typography variant="h3" color="primary" fontWeight="bold">
            {stats.averageEngagementScore}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            out of 100
          </Typography>
        </Box>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 3, mb: 2 }}>
          Risk Distribution
        </Typography>
        <Grid container spacing={2}>
          <Grid size={12}>
            <RiskLevelIndicator level="low" count={stats.riskDistribution.low} total={stats.totalAccounts} />
          </Grid>
          <Grid size={12}>
            <RiskLevelIndicator level="medium" count={stats.riskDistribution.medium} total={stats.totalAccounts} />
          </Grid>
          <Grid size={12}>
            <RiskLevelIndicator level="high" count={stats.riskDistribution.high} total={stats.totalAccounts} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
