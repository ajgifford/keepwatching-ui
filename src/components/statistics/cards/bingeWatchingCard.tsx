import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
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
  useTheme,
} from '@mui/material';

import { DateFormatters, createDateFormatters } from '../../../utils';
import { BingeWatchingStats } from '@ajgifford/keepwatching-types';

/**
 * Props for the {@link BingeWatchingCard}.
 */
interface BingeWatchingCardProps {
  /** Binge-watching statistics to display. Pass `null` or omit to show an empty-state card. */
  bingeData?: BingeWatchingStats | null;
  /** When `true`, renders a loading placeholder. Defaults to `false`. */
  isLoading?: boolean;
  /**
   * Pre-configured date formatters used to format session dates.
   * When omitted, formatters are created with default display preferences.
   */
  formatters?: DateFormatters;
}

/**
 * Card that summarizes binge-watching behavior.
 *
 * A binge session is defined as watching 3 or more episodes of a show within 24 hours.
 * Displays the total session count, average episodes per binge, longest binge session
 * (with show title and date), and a list of the most frequently binged shows. Shows
 * an encouraging empty-state message when no binge sessions have been recorded.
 */
export function BingeWatchingCard({ bingeData, isLoading = false, formatters: propFormatters }: BingeWatchingCardProps) {
  const formatters = propFormatters ?? createDateFormatters();
  const theme = useTheme();

  if (isLoading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Binge-Watching Stats
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!bingeData || bingeData.bingeSessionCount === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Binge-Watching Stats
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No binge sessions detected yet. Watch 3+ episodes of a show within 24 hours to start tracking!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Binge-Watching Stats</Typography>
          <Chip
            icon={<LocalFireDepartmentIcon />}
            label={`${bingeData.bingeSessionCount} Sessions`}
            color="warning"
            size="small"
          />
        </Box>

        <Grid container spacing={2}>
          {/* Key Metrics */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.action.hover, borderRadius: 1 }}>
              <Typography variant="h4" color="primary">
                {bingeData.averageEpisodesPerBinge.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Episodes / Binge
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.action.hover, borderRadius: 1 }}>
              <Typography variant="h4" color="primary">
                {bingeData.longestBingeSession.episodeCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Longest Binge Session
              </Typography>
            </Box>
          </Grid>

          {bingeData.longestBingeSession.episodeCount > 0 && (
            <>
              <Grid size={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              {/* Longest Binge Details */}
              <Grid size={12}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Longest Binge Session
                  </Typography>
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    {bingeData.longestBingeSession.showTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {bingeData.longestBingeSession.episodeCount} episodes on{' '}
                    {formatters.activityDate(bingeData.longestBingeSession.date)}
                  </Typography>
                </Box>
              </Grid>
            </>
          )}

          {bingeData.topBingedShows.length > 0 && (
            <>
              <Grid size={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              {/* Top Binged Shows */}
              <Grid size={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ px: 2 }}>
                  Most Binged Shows
                </Typography>
                <List dense disablePadding>
                  {bingeData.topBingedShows.map((show, index) => (
                    <ListItem key={show.showId} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ fontWeight: index === 0 ? 600 : 400 }}>
                              {show.showTitle}
                            </Typography>
                            <Chip
                              label={`${show.bingeSessionCount} ${show.bingeSessionCount === 1 ? 'session' : 'sessions'}`}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
