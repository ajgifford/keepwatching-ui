import {
  Group as GroupIcon,
  Movie as MovieIcon,
  People as PeopleIcon,
  PlayCircle as PlayCircleIcon,
  Schedule as ScheduleIcon,
  Tv as TvIcon,
} from '@mui/icons-material';
import { Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material';

import { PlatformOverviewStats } from '@ajgifford/keepwatching-types';

interface PlatformOverviewCardProps {
  stats: PlatformOverviewStats;
  isLoading?: boolean;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subtitle?: string;
}

function StatItem({ icon, label, value, subtitle }: StatItemProps) {
  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1, color: 'primary.main' }}>{icon}</Box>
      <Typography variant="h4" color="primary" fontWeight="bold">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export function PlatformOverviewCard({ stats, isLoading = false }: PlatformOverviewCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Platform Overview
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
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Platform Overview
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 4 }}>
            <StatItem icon={<PeopleIcon fontSize="large" />} label="Total Accounts" value={stats.totalAccounts} />
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <StatItem icon={<PeopleIcon fontSize="large" />} label="Active Accounts" value={stats.activeAccounts} />
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <StatItem icon={<GroupIcon fontSize="large" />} label="Total Profiles" value={stats.totalProfiles} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatItem icon={<TvIcon fontSize="large" />} label="Total Shows" value={stats.totalShows} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatItem icon={<MovieIcon fontSize="large" />} label="Total Movies" value={stats.totalMovies} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatItem
              icon={<PlayCircleIcon fontSize="large" />}
              label="Episodes Watched"
              value={stats.totalEpisodesWatched}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatItem icon={<MovieIcon fontSize="large" />} label="Movies Watched" value={stats.totalMoviesWatched} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatItem
              icon={<ScheduleIcon fontSize="large" />}
              label="Total Hours Watched"
              value={stats.totalHoursWatched}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <StatItem
              icon={<GroupIcon fontSize="small" />}
              label="Avg Profiles/Account"
              value={stats.averageProfilesPerAccount}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <StatItem
              icon={<PlayCircleIcon fontSize="small" />}
              label="Avg Episodes/Account"
              value={stats.averageEpisodesPerAccount}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
