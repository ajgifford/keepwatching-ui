import { ReactNode } from 'react';

import { Box, Card, CardContent, CircularProgress, Container, Grid, Typography } from '@mui/material';

import {
  DistributionBarChart,
  DistributionPieChart,
  StatisticsSummaryCard,
  WatchStatusChart,
  useStatisticsData,
} from '../../../index';
import { AccountStatisticsResponse, ProfileStatisticsResponse } from '@ajgifford/keepwatching-types';

/**
 * Props for the {@link BaseStatisticsDashboard}.
 */
export interface BaseStatisticsDashboardProps {
  /** Account or profile statistics used to populate the charts. */
  statistics?: AccountStatisticsResponse | ProfileStatisticsResponse | null;
  /** When `true`, renders a centered spinner instead of the dashboard. Defaults to `false`. */
  isLoading?: boolean;
  /** Heading displayed at the top of the dashboard. */
  dashboardTitle: string;
  /**
   * Props forwarded to the `StatisticsSummaryCard` shown below the title.
   * Pass `null` to omit the summary card.
   */
  summaryCardProps: {
    progressLabel: string;
    progressValue: number;
    currentCount: number;
    totalCount: number;
    stats: Array<{
      value: number;
      label: string;
      color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
    }>;
  } | null;
  /**
   * Additional grid sections rendered after the built-in Watch Status,
   * Top Genres, and Streaming Services charts. Used by the enhanced
   * dashboard variants to inject their extra card sections.
   */
  contentSections?: ReactNode;
}

/**
 * Shared layout shell for the statistics dashboards.
 *
 * Renders a page title, an optional summary card, and a responsive grid
 * containing three built-in charts (Watch Status, Top Genres, Streaming
 * Services) followed by any `contentSections` provided by the caller.
 * Displays a spinner while loading and an empty-state message when `statistics`
 * is `null` or `undefined`.
 */
export function BaseStatisticsDashboard({
  statistics,
  isLoading = false,
  dashboardTitle,
  summaryCardProps,
  contentSections,
}: BaseStatisticsDashboardProps) {
  const { watchStatusData, genreData, serviceData } = useStatisticsData(statistics);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!statistics) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No statistics available
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {dashboardTitle}
      </Typography>

      {summaryCardProps && <StatisticsSummaryCard {...summaryCardProps} />}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Watch Status
              </Typography>
              <WatchStatusChart data={watchStatusData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Genres
              </Typography>
              {genreData.length > 0 ? (
                <DistributionPieChart data={genreData} />
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No genre data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Streaming Services
              </Typography>
              {serviceData.length > 0 ? (
                <DistributionBarChart data={serviceData} />
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No streaming service data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Custom content sections */}
        {contentSections}
      </Grid>
    </Container>
  );
}
