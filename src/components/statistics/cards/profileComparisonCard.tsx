import { useState } from 'react';

import {
  BarChart as BarChartIcon,
  Movie as MovieIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  Tv as TvIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

import { ProfileComparisonStats } from '@ajgifford/keepwatching-types';

interface ProfileComparisonCardProps {
  stats: ProfileComparisonStats | null;
  isLoading?: boolean;
}

export function ProfileComparisonCard({ stats, isLoading = false }: ProfileComparisonCardProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Profile Comparison
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Profile Comparison
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No comparison data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Find the profile with the most activity for comparison
  const maxEpisodes = Math.max(...stats.profiles.map((p) => p.episodesWatched), 1);
  const maxMovies = Math.max(...stats.profiles.map((p) => p.moviesWatched), 1);
  const maxHours = Math.max(...stats.profiles.map((p) => p.totalHoursWatched), 1);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Profile Comparison ({stats.profileCount} profiles)
        </Typography>

        {/* Account Summary */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {stats.accountSummary.totalUniqueShows.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unique Shows
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary" fontWeight="bold">
                {stats.accountSummary.totalUniqueMovies.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unique Movies
              </Typography>
            </Box>
          </Grid>
          {stats.accountSummary.mostWatchedShow && (
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Most Watched Show
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {stats.accountSummary.mostWatchedShow.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stats.accountSummary.mostWatchedShow.watchCount} profiles
                </Typography>
              </Box>
            </Grid>
          )}
          {stats.accountSummary.mostWatchedMovie && (
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Most Watched Movie
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {stats.accountSummary.mostWatchedMovie.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stats.accountSummary.mostWatchedMovie.watchCount} profiles
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Overview" />
            <Tab label="Watching Stats" />
            <Tab label="Preferences" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        {activeTab === 0 && (
          <List>
            {stats.profiles.map((profile) => (
              <ListItem
                key={profile.profileId}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 2,
                  flexDirection: 'column',
                  alignItems: 'stretch',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {profile.profileName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      icon={<TvIcon fontSize="small" />}
                      label={`${profile.currentlyWatchingCount} watching`}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      icon={<TrendingUpIcon fontSize="small" />}
                      label={`${profile.completedShowsCount} completed`}
                      size="small"
                      color="success"
                    />
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Episodes Watched
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {profile.episodesWatched.toLocaleString()}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(profile.episodesWatched / maxEpisodes) * 100}
                      color="primary"
                      sx={{ mt: 1, height: 6, borderRadius: 1 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Movies Watched
                    </Typography>
                    <Typography variant="h6" color="secondary">
                      {profile.moviesWatched.toLocaleString()}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(profile.moviesWatched / maxMovies) * 100}
                      color="secondary"
                      sx={{ mt: 1, height: 6, borderRadius: 1 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Total Hours
                    </Typography>
                    <Typography variant="h6" color="info.main">
                      {profile.totalHoursWatched.toLocaleString()}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(profile.totalHoursWatched / maxHours) * 100}
                      color="info"
                      sx={{ mt: 1, height: 6, borderRadius: 1 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Episodes/Week
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {profile.episodesPerWeek.toFixed(1)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Most active: {profile.mostActiveDay}
                    </Typography>
                  </Grid>
                </Grid>

                {profile.lastActivityDate && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Last activity: {new Date(profile.lastActivityDate).toLocaleDateString()}
                  </Typography>
                )}
              </ListItem>
            ))}
          </List>
        )}

        {/* Watching Stats Tab */}
        {activeTab === 1 && (
          <List>
            {stats.profiles.map((profile) => (
              <ListItem
                key={profile.profileId}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 2,
                  flexDirection: 'column',
                  alignItems: 'stretch',
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  {profile.profileName}
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TvIcon color="primary" fontSize="small" />
                      <Typography variant="body2" fontWeight="medium">
                        Show Progress
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={profile.showWatchProgress}
                      color="primary"
                      sx={{ height: 8, borderRadius: 1, mb: 0.5 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {profile.showWatchProgress}% - {profile.totalShows} shows
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <MovieIcon color="secondary" fontSize="small" />
                      <Typography variant="body2" fontWeight="medium">
                        Movie Progress
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={profile.movieWatchProgress}
                      color="secondary"
                      sx={{ height: 8, borderRadius: 1, mb: 0.5 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {profile.movieWatchProgress}% - {profile.totalMovies} movies
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <SpeedIcon color="success" fontSize="small" />
                      <Typography variant="body2" fontWeight="medium">
                        Velocity
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="success.main">
                      {profile.episodesPerWeek.toFixed(1)} eps/week
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Most active: {profile.mostActiveDay}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        )}

        {/* Preferences Tab */}
        {activeTab === 2 && (
          <List>
            {stats.profiles.map((profile) => (
              <ListItem
                key={profile.profileId}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 2,
                  flexDirection: 'column',
                  alignItems: 'stretch',
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  {profile.profileName}
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <BarChartIcon color="primary" fontSize="small" />
                      <Typography variant="body2" fontWeight="medium">
                        Top Genres
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {profile.topGenres.length > 0 ? (
                        profile.topGenres.map((genre, idx) => (
                          <Chip
                            key={idx}
                            label={`${genre.genre} (${genre.count})`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No genre data
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TvIcon color="secondary" fontSize="small" />
                      <Typography variant="body2" fontWeight="medium">
                        Top Services
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {profile.topServices.length > 0 ? (
                        profile.topServices.map((service, idx) => (
                          <Chip
                            key={idx}
                            label={`${service.service} (${service.count})`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        ))
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No service data
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
