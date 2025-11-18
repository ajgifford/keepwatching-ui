import { useState } from 'react';

import {
  EmojiEvents as EmojiEventsIcon,
  Group as GroupIcon,
  Movie as MovieIcon,
  Schedule as ScheduleIcon,
  Tv as TvIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import { formatDate } from '../../../utils';
import { AccountRankingStats } from '@ajgifford/keepwatching-types';

interface AccountRankingCardProps {
  stats: AccountRankingStats;
  onMetricChange?: (metric: 'episodesWatched' | 'moviesWatched' | 'hoursWatched' | 'engagement') => void;
  isLoading?: boolean;
}

export function AccountRankingCard({ stats, onMetricChange, isLoading = false }: AccountRankingCardProps) {
  const [metric, setMetric] = useState<'episodesWatched' | 'moviesWatched' | 'hoursWatched' | 'engagement'>(
    stats.rankingMetric
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Rankings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const handleMetricChange = (newMetric: typeof metric) => {
    setMetric(newMetric);
    onMetricChange?.(newMetric);
  };

  const getMetricLabel = (metric: typeof stats.rankingMetric) => {
    switch (metric) {
      case 'episodesWatched':
        return 'Episodes Watched';
      case 'moviesWatched':
        return 'Movies Watched';
      case 'hoursWatched':
        return 'Hours Watched';
      case 'engagement':
        return 'Engagement Score';
      default:
        return 'Engagement';
    }
  };

  const getMetricValue = (account: (typeof stats.rankings)[0], metric: typeof stats.rankingMetric): string | number => {
    switch (metric) {
      case 'episodesWatched':
        return account.totalEpisodesWatched.toLocaleString();
      case 'moviesWatched':
        return account.totalMoviesWatched.toLocaleString();
      case 'hoursWatched':
        return `${account.totalHoursWatched.toLocaleString()} hrs`;
      case 'engagement':
        return account.engagementScore;
      default:
        return account.engagementScore;
    }
  };

  const getMetricIcon = (metric: typeof stats.rankingMetric) => {
    switch (metric) {
      case 'episodesWatched':
        return <TvIcon fontSize="small" />;
      case 'moviesWatched':
        return <MovieIcon fontSize="small" />;
      case 'hoursWatched':
        return <ScheduleIcon fontSize="small" />;
      case 'engagement':
        return <EmojiEventsIcon fontSize="small" />;
      default:
        return <EmojiEventsIcon fontSize="small" />;
    }
  };

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return 'transparent';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Account Rankings</Typography>
          <Select
            value={metric}
            onChange={(e) => handleMetricChange(e.target.value as typeof metric)}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="engagement">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEventsIcon fontSize="small" />
                Engagement
              </Box>
            </MenuItem>
            <MenuItem value="episodesWatched">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TvIcon fontSize="small" />
                Episodes Watched
              </Box>
            </MenuItem>
            <MenuItem value="moviesWatched">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MovieIcon fontSize="small" />
                Movies Watched
              </Box>
            </MenuItem>
            <MenuItem value="hoursWatched">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon fontSize="small" />
                Hours Watched
              </Box>
            </MenuItem>
          </Select>
        </Box>

        {stats.rankings.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No rankings available
          </Typography>
        ) : (
          <List sx={{ maxHeight: 600, overflow: 'auto' }}>
            {stats.rankings.map((account, index) => (
              <ListItem
                key={account.accountId}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: index < 3 ? `${getMedalColor(index + 1)}15` : 'transparent',
                  borderLeft: index < 3 ? `4px solid ${getMedalColor(index + 1)}` : undefined,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: index < 3 ? getMedalColor(index + 1) : 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    mr: 2,
                  }}
                >
                  {index + 1}
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="body1" fontWeight="medium">
                        {account.accountName || account.accountEmail}
                      </Typography>
                      <Chip
                        icon={<GroupIcon fontSize="small" />}
                        label={`${account.profileCount} profiles`}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Box component="span" sx={{ display: 'inline-flex', gap: 0.5, alignItems: 'center', mr: 2 }}>
                        {getMetricIcon(metric)}
                        <Typography component="span" variant="caption" color="primary.main" fontWeight="bold">
                          {getMetricValue(account, metric)}
                        </Typography>
                        <Typography component="span" variant="caption" color="text.secondary">
                          {getMetricLabel(metric)}
                        </Typography>
                      </Box>
                      {account.lastActivityDate && (
                        <Typography component="span" variant="caption" color="text.secondary">
                          Last active: {formatDate(account.lastActivityDate)}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
