import ReplayIcon from '@mui/icons-material/Replay';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

import { AccountRewatchStats, ProfileRewatchStats } from '@ajgifford/keepwatching-types';

/**
 * Props for the {@link RewatchStatsCard}.
 */
interface RewatchStatsCardProps {
  /**
   * Rewatch statistics for either a profile or the whole account.
   * Pass `null` or omit to render an empty-state card.
   */
  stats?: ProfileRewatchStats | AccountRewatchStats | null;
  /** When `true`, renders a loading placeholder. Defaults to `false`. */
  isLoading?: boolean;
}

/**
 * Card that summarises rewatch activity for shows and movies.
 *
 * Displays total show and movie rewatch counts, a list of up to five most rewatched
 * shows, and a list of up to five most rewatched movies, each with a rewatch count
 * chip. Accepts both profile-level and account-level rewatch statistics. Shows an
 * encouraging empty-state message when no rewatches have been recorded.
 */
export function RewatchStatsCard({ stats, isLoading = false }: RewatchStatsCardProps) {
  if (isLoading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Rewatch Activity
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const hasNoRewatches =
    !stats || (stats.totalShowRewatches === 0 && stats.totalMovieRewatches === 0);

  if (hasNoRewatches) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ReplayIcon color="secondary" />
            <Typography variant="h6">Rewatch Activity</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No rewatches yet. Start a rewatch from any completed show or movie!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const totalRewatches = stats.totalShowRewatches + stats.totalMovieRewatches;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReplayIcon color="secondary" />
            <Typography variant="h6">Rewatch Activity</Typography>
          </Box>
          <Chip label={`${totalRewatches} total`} color="secondary" size="small" />
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 6 }}>
            <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="h4" color="secondary.main">
                {stats.totalShowRewatches}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Show Rewatches
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="h4" color="secondary.main">
                {stats.totalMovieRewatches}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Movie Rewatches
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {stats.mostRewatchedShows.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Most Rewatched Shows
            </Typography>
            <List dense disablePadding>
              {stats.mostRewatchedShows.slice(0, 5).map((show, idx) => (
                <ListItem key={`show-${show.showId}-${idx}`} disableGutters sx={{ py: 0.25 }}>
                  <ListItemText
                    primary={show.showTitle}
                    secondary={
                      'profileName' in show ? `${show.profileName}` : undefined
                    }
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <Chip
                    icon={<ReplayIcon />}
                    label={`×${show.rewatchCount}`}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {stats.mostRewatchedMovies.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Most Rewatched Movies
            </Typography>
            <List dense disablePadding>
              {stats.mostRewatchedMovies.slice(0, 5).map((movie, idx) => (
                <ListItem key={`movie-${movie.movieId}-${idx}`} disableGutters sx={{ py: 0.25 }}>
                  <ListItemText
                    primary={movie.movieTitle}
                    secondary={
                      'profileName' in movie ? `${movie.profileName}` : undefined
                    }
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <Chip
                    icon={<ReplayIcon />}
                    label={`×${movie.rewatchCount}`}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  );
}
