import { useState } from 'react';

import { Movie as MovieIcon, Tv as TvIcon } from '@mui/icons-material';
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

import { ContentPopularityStats } from '@ajgifford/keepwatching-types';

interface ContentPopularityCardProps {
  stats: ContentPopularityStats;
  isLoading?: boolean;
}

export function ContentPopularityCard({ stats, isLoading = false }: ContentPopularityCardProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Popular Content
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const shows = stats.popularContent.filter((c) => c.contentType === 'show');
  const movies = stats.popularContent.filter((c) => c.contentType === 'movie');
  const allContent = stats.popularContent;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderContentList = (content: typeof stats.popularContent) => {
    if (content.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
          No content available
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
                  {item.releaseYear && (
                    <Chip label={item.releaseYear} size="small" variant="outlined" sx={{ height: 20 }} />
                  )}
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                  <Typography variant="caption" color="text.secondary">
                    {item.profileCount.toLocaleString()} profiles
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.accountCount.toLocaleString()} accounts
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.totalWatchCount.toLocaleString()} watches
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight="medium">
                    {item.completionRate}% completion
                  </Typography>
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
          Popular Content
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
