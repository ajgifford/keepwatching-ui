import { CheckCircle as CheckCircleIcon, Movie as MovieIcon, Tv as TvIcon } from '@mui/icons-material';
import { Box, Card, CardContent, Divider, Grid, LinearProgress, Typography } from '@mui/material';

import { ContentEngagementStats } from '@ajgifford/keepwatching-types';

interface ContentEngagementCardProps {
  stats: ContentEngagementStats;
  isLoading?: boolean;
}

interface ProgressMetricProps {
  label: string;
  value: number;
  total: number;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

function ProgressMetric({ label, value, total, color }: ProgressMetricProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {value.toLocaleString()} ({percentage}%)
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={percentage} color={color} sx={{ height: 8, borderRadius: 1 }} />
    </Box>
  );
}

export function ContentEngagementCard({ stats, isLoading = false }: ContentEngagementCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Content Engagement
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          {stats.contentType === 'show' ? <TvIcon color="primary" /> : <MovieIcon color="secondary" />}
          <Typography variant="h6">{stats.title}</Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {stats.totalProfiles.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Profiles
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {stats.completionRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completion Rate
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {stats.abandonmentRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Abandonment Rate
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {stats.averageDaysToComplete}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Days to Complete
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
          Profile Status Distribution
        </Typography>

        <ProgressMetric label="Completed" value={stats.completedProfiles} total={stats.totalProfiles} color="success" />
        <ProgressMetric
          label="Currently Watching"
          value={stats.watchingProfiles}
          total={stats.totalProfiles}
          color="primary"
        />
        <ProgressMetric label="Not Started" value={stats.notStartedProfiles} total={stats.totalProfiles} color="info" />
        <ProgressMetric label="Abandoned" value={stats.abandonedProfiles} total={stats.totalProfiles} color="error" />

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Average Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {stats.averageProgress}%
            </Typography>
            {stats.averageProgress >= 75 && <CheckCircleIcon color="success" fontSize="large" />}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
