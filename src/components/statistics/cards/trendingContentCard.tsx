import { useState } from 'react';

import {
  Movie as MovieIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  TrendingUp as TrendingUpIcon,
  Tv as TvIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

import { TrendingContentStats } from '@ajgifford/keepwatching-types';

interface TrendingContentCardProps {
  stats: TrendingContentStats;
  isLoading?: boolean;
}

export function TrendingContentCard({ stats, isLoading = false }: TrendingContentCardProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Trending Content
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const shows = stats.trendingContent.filter((c) => c.contentType === 'show');
  const movies = stats.trendingContent.filter((c) => c.contentType === 'movie');
  const allContent = stats.trendingContent;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getTrendIcon = (direction: 'rising' | 'stable' | 'falling') => {
    switch (direction) {
      case 'rising':
        return <TrendingUpIcon fontSize="small" />;
      case 'falling':
        return <TrendingDownIcon fontSize="small" />;
      default:
        return <TrendingFlatIcon fontSize="small" />;
    }
  };

  const getTrendColor = (direction: 'rising' | 'stable' | 'falling') => {
    switch (direction) {
      case 'rising':
        return 'success';
      case 'falling':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderContentList = (content: typeof stats.trendingContent) => {
    if (content.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
          No trending content available
        </Typography>
      );
    }

    return (
      <List>
        {content.map((item, index) => (
          <ListItem
            key={`${item.contentType}-${item.contentId}`}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              mb: 1,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <ListItemIcon>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  mr: 1,
                }}
              >
                {index + 1}
              </Box>
              <Box sx={{ px: 2 }}>
                {item.contentType === 'show' ? <TvIcon color="primary" /> : <MovieIcon color="secondary" />}
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body1" fontWeight="medium">
                    {item.title}
                  </Typography>
                  <Chip
                    icon={getTrendIcon(item.trendDirection)}
                    label={`${item.trendPercentage > 0 ? '+' : ''}${item.trendPercentage}%`}
                    color={getTrendColor(item.trendDirection) as 'success' | 'error' | 'default'}
                    size="small"
                    sx={{ height: 24 }}
                  />
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                  <Typography variant="caption" color="text.secondary">
                    {item.recentWatchCount.toLocaleString()} recent watches
                  </Typography>
                  {item.newAdditions > 0 && (
                    <Typography variant="caption" color="primary.main" fontWeight="medium">
                      +{item.newAdditions.toLocaleString()} new additions
                    </Typography>
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Trending Content ({stats.periodDays} days)
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label={`All (${allContent.length})`} />
            <Tab label={`Shows (${shows.length})`} />
            <Tab label={`Movies (${movies.length})`} />
          </Tabs>
        </Box>

        {activeTab === 0 && renderContentList(allContent)}
        {activeTab === 1 && renderContentList(shows)}
        {activeTab === 2 && renderContentList(movies)}
      </CardContent>
    </Card>
  );
}
