import { useMemo } from 'react';

import {
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Grid, Typography, useTheme } from '@mui/material';

import { PlatformTrendsStats } from '@ajgifford/keepwatching-types';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PlatformTrendsCardProps {
  stats: PlatformTrendsStats;
  isLoading?: boolean;
}

interface TrendIndicatorProps {
  value: number;
  label: string;
}

function TrendIndicator({ value, label }: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const icon = isNeutral ? (
    <TrendingFlatIcon fontSize="small" />
  ) : isPositive ? (
    <TrendingUpIcon fontSize="small" />
  ) : (
    <TrendingDownIcon fontSize="small" />
  );

  const color = isNeutral ? 'default' : isPositive ? 'success' : 'error';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
      <Chip
        icon={icon}
        label={`${isPositive ? '+' : ''}${value}%`}
        color={color}
        size="small"
        sx={{ fontWeight: 'bold' }}
      />
    </Box>
  );
}

export function PlatformTrendsCard({ stats, isLoading = false }: PlatformTrendsCardProps) {
  const theme = useTheme();

  const chartData = useMemo(() => {
    if (!stats?.dailyActivity) return [];
    // Sort by date in ascending order (oldest to newest) to display correctly on x-axis
    return [...stats.dailyActivity]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((day) => ({
        date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        accounts: day.activeAccounts,
        episodes: day.episodesWatched,
        movies: day.moviesWatched,
      }));
  }, [stats?.dailyActivity]);

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Platform Trends
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
          Platform Trends ({stats.periodDays} days)
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {stats.newAccountsInPeriod.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New Accounts
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {stats.episodesWatchedInPeriod.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Episodes Watched
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {stats.moviesWatchedInPeriod.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Movies Watched
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {(stats.episodesWatchedInPeriod + stats.moviesWatchedInPeriod).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Activity
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
          <TrendIndicator value={stats.dailyActiveUsersTrend} label="Daily Active Users" />
          <TrendIndicator value={stats.watchActivityTrend} label="Watch Activity" />
        </Box>

        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="accountsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="episodesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="moviesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="accounts"
                stroke={theme.palette.primary.main}
                fillOpacity={1}
                fill="url(#accountsGradient)"
                name="Active Accounts"
              />
              <Area
                type="monotone"
                dataKey="episodes"
                stroke={theme.palette.secondary.main}
                fillOpacity={1}
                fill="url(#episodesGradient)"
                name="Episodes"
              />
              <Area
                type="monotone"
                dataKey="movies"
                stroke={theme.palette.success.main}
                fillOpacity={1}
                fill="url(#moviesGradient)"
                name="Movies"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
