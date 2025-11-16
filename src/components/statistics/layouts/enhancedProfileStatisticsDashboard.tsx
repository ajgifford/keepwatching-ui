import { useMemo, useRef } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import {
  AbandonmentRiskCard,
  ActivityTimelineChart,
  BacklogAgingCard,
  BingeWatchingCard,
  ContentDepthCard,
  ContentDiscoveryCard,
  MilestonesAndAnniversaryCard,
  SeasonalViewingCard,
  ShowProgressCard,
  TimeToWatchCard,
  UnairedContentCard,
  WatchStreakCard,
  WatchVelocityCard,
} from '../cards';
import { getProfileSummaryProps } from '../utils';
import { BaseStatisticsDashboard } from './baseStatisticsDashboard';
import { ProfileEnhancedStatistics, ProfileStatisticsResponse, WatchStatus } from '@ajgifford/keepwatching-types';

export interface EnhancedProfileStatisticsDashboardProps {
  statistics?: ProfileStatisticsResponse | null;
  isLoading?: boolean;
  enhancedStatistics?: ProfileEnhancedStatistics;
  isLoadingEnhancedStats?: boolean;
}

// Define section categories
const SECTION_CATEGORIES = [
  { id: 'milestones', label: 'Milestones & Achievements', icon: '🏆' },
  { id: 'progress', label: 'Progress & Activity', icon: '📊' },
  { id: 'patterns', label: 'Viewing Patterns', icon: '📺' },
  { id: 'insights', label: 'Content Insights', icon: '💡' },
  { id: 'management', label: 'Content Management', icon: '📋' },
] as const;

export function EnhancedProfileStatisticsDashboard({
  statistics,
  isLoading = false,
  enhancedStatistics,
  isLoadingEnhancedStats = false,
}: EnhancedProfileStatisticsDashboardProps) {
  // Destructure enhanced statistics for easy access
  const {
    velocity: velocityData,
    timeline: timelineData,
    binge: bingeData,
    streak: streakData,
    timeToWatch: timeToWatchData,
    seasonal: seasonalData,
    milestones: milestoneData,
    contentDepth: contentDepthData,
    contentDiscovery: contentDiscoveryData,
    abandonmentRisk: abandonmentRiskData,
    unairedContent: unairedContentData,
  } = enhancedStatistics || {};

  // Refs for scrolling to sections
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll to section handler
  const scrollToSection = (sectionId: string) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const summaryCardProps = useMemo(() => {
    return getProfileSummaryProps(statistics);
  }, [statistics]);

  const contentSections = useMemo(() => {
    if (!statistics) return null;

    return (
      <>
        {/* Quick Navigation */}
        <Grid size={12}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: 'wrap',
              gap: 1,
              mb: 2,
              p: 2,
              backgroundColor: 'background.paper',
              borderRadius: 1,
              position: 'sticky',
              top: 0,
              zIndex: 10,
              boxShadow: 1,
            }}
          >
            <Typography variant="body2" sx={{ alignSelf: 'center', mr: 1, fontWeight: 'medium' }}>
              Jump to:
            </Typography>
            {SECTION_CATEGORIES.map((section) => (
              <Chip
                key={section.id}
                label={`${section.icon} ${section.label}`}
                onClick={() => scrollToSection(section.id)}
                size="small"
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Stack>
        </Grid>

        {/* Milestones & Achievements Section */}
        <Grid size={12}>
          <Accordion
            defaultExpanded
            ref={(el) => {
              sectionRefs.current['milestones'] = el;
            }}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">🏆 Milestones & Achievements</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <MilestonesAndAnniversaryCard stats={milestoneData ?? null} isLoading={isLoadingEnhancedStats} />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Progress & Activity Section */}
        <Grid size={12}>
          <Accordion
            defaultExpanded
            ref={(el) => {
              sectionRefs.current['progress'] = el;
            }}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">📊 Progress & Activity</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <ShowProgressCard
                    title="Active Shows Progress"
                    shows={statistics.episodeWatchProgress.showsProgress}
                    filters={[WatchStatus.WATCHING, WatchStatus.UP_TO_DATE]}
                    maxHeight={300}
                    maxItems={10}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <WatchVelocityCard velocityData={velocityData ?? null} isLoading={isLoadingEnhancedStats} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <ActivityTimelineChart timeline={timelineData ?? null} isLoading={isLoadingEnhancedStats} />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Viewing Patterns Section */}
        <Grid size={12}>
          <Accordion
            ref={(el) => {
              sectionRefs.current['patterns'] = el;
            }}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">📺 Viewing Patterns</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <BingeWatchingCard bingeData={bingeData ?? null} isLoading={isLoadingEnhancedStats} />
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <WatchStreakCard streakData={streakData ?? null} isLoading={isLoadingEnhancedStats} />
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  {isLoadingEnhancedStats ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <SeasonalViewingCard stats={seasonalData ?? null} />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Content Insights Section */}
        <Grid size={12}>
          <Accordion
            ref={(el) => {
              sectionRefs.current['insights'] = el;
            }}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">💡 Content Insights</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  {isLoadingEnhancedStats ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ContentDepthCard stats={contentDepthData ?? null} />
                  )}
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  {isLoadingEnhancedStats ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ContentDiscoveryCard stats={contentDiscoveryData ?? null} />
                  )}
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  {isLoadingEnhancedStats ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <TimeToWatchCard stats={timeToWatchData ?? null} />
                  )}
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <BacklogAgingCard stats={timeToWatchData ?? null} />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Content Management Section */}
        <Grid size={12}>
          <Accordion
            ref={(el) => {
              sectionRefs.current['management'] = el;
            }}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">📋 Content Management</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  {isLoadingEnhancedStats ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <AbandonmentRiskCard stats={abandonmentRiskData ?? null} />
                  )}
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  {isLoadingEnhancedStats ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <UnairedContentCard stats={unairedContentData ?? null} />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </>
    );
  }, [
    statistics,
    velocityData,
    timelineData,
    bingeData,
    streakData,
    timeToWatchData,
    seasonalData,
    milestoneData,
    contentDepthData,
    contentDiscoveryData,
    abandonmentRiskData,
    unairedContentData,
    isLoadingEnhancedStats,
  ]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!statistics) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Enhanced Viewing Statistics
        </Typography>
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No statistics available
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <BaseStatisticsDashboard
      statistics={statistics}
      isLoading={isLoading}
      dashboardTitle="Viewing Statistics"
      summaryCardProps={summaryCardProps}
      contentSections={contentSections}
    />
  );
}
