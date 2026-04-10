import { useMemo, useRef } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import {
  AbandonmentRiskCard,
  ActivityTimelineChart,
  BacklogAgingCard,
  BingeWatchingCard,
  ContentBreakdownCard,
  ContentDepthCard,
  ContentDiscoveryCard,
  ContentSummaryCard,
  MilestonesAndAnniversaryCard,
  ProfileComparisonCard,
  RewatchStatsCard,
  SeasonalViewingCard,
  TimeToWatchCard,
  UnairedContentCard,
  WatchStreakCard,
  WatchVelocityCard,
} from '../cards';
import { getAccountSummaryProps, getTopCategory, getTopCategoryPercentage } from '../utils';
import { BaseStatisticsDashboard } from './baseStatisticsDashboard';
import { AccountEnhancedStatistics, AccountStatisticsResponse, DisplayPreferences } from '@ajgifford/keepwatching-types';
import { createDateFormatters } from '../../../utils';

/**
 * Props for the {@link EnhancedAccountStatisticsDashboard}.
 */
export interface EnhancedAccountStatisticsDashboardProps {
  /** Base account statistics used for summary and distribution charts. */
  statistics?: AccountStatisticsResponse | null;
  /** When `true`, renders a spinner instead of the dashboard. Defaults to `false`. */
  isLoading?: boolean;
  /** Enhanced analytics data fetched in parallel with the base statistics. */
  enhancedStatistics?: AccountEnhancedStatistics;
  /**
   * When `true`, individual enhanced-stat card sections show loading indicators
   * while `enhancedStatistics` is still being fetched. Defaults to `false`.
   */
  isLoadingEnhancedStats?: boolean;
  /** User display preferences used to configure date formatter functions. */
  dateFormatPreferences?: DisplayPreferences;
}

// Define section categories
const SECTION_CATEGORIES = [
  { id: 'profiles', label: 'Profile Comparison', icon: '👥' },
  { id: 'milestones', label: 'Milestones & Achievements', icon: '🏆' },
  { id: 'progress', label: 'Progress & Activity', icon: '📊' },
  { id: 'patterns', label: 'Viewing Patterns', icon: '📺' },
  { id: 'rewatches', label: 'Rewatches', icon: '🔁' },
  { id: 'insights', label: 'Content Insights', icon: '💡' },
  { id: 'management', label: 'Content Management', icon: '📋' },
] as const;

/**
 * Full account-level statistics dashboard with enhanced analytics sections.
 *
 * Builds on {@link BaseStatisticsDashboard} and adds collapsible accordion sections for:
 * Profile Comparison, Milestones & Achievements, Progress & Activity, Viewing Patterns,
 * Rewatches, Content Insights, and Content Management. A sticky quick-navigation bar
 * allows users to jump directly to any section.
 *
 * The Profile Comparison section is hidden when the account has only one profile.
 * Returns `null` when `statistics` is `null` after a loading state has resolved.
 */
export function EnhancedAccountStatisticsDashboard({
  statistics,
  isLoading = false,
  enhancedStatistics,
  isLoadingEnhancedStats = false,
  dateFormatPreferences,
}: EnhancedAccountStatisticsDashboardProps) {
  const formatters = useMemo(() => createDateFormatters(dateFormatPreferences), [dateFormatPreferences]);
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
    profileComparison: profileComparisonData,
    rewatchStats: rewatchData,
  } = enhancedStatistics || {};

  // Refs for scrolling to sections
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll to section handler
  const scrollToSection = (sectionId: string) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const summaryCardProps = useMemo(() => {
    return getAccountSummaryProps(statistics);
  }, [statistics]);

  const contentSections = useMemo(() => {
    if (!statistics) return null;

    return (
      <>
        <Grid size={{ xs: 12, md: 6 }}>
          <ContentBreakdownCard
            title="Content Breakdown"
            items={[
              {
                label: 'Shows',
                total: statistics.showStatistics.total,
                progress: statistics.showStatistics.watchProgress,
                color: 'primary',
              },
              {
                label: 'Movies',
                total: statistics.movieStatistics.total,
                progress: statistics.movieStatistics.watchProgress,
                color: 'secondary',
              },
              {
                label: 'Episodes',
                total: statistics.episodeStatistics.totalEpisodes,
                progress: statistics.episodeStatistics.watchProgress,
                color: 'success',
              },
            ]}
          />
        </Grid>

        <Grid size={12}>
          <ContentSummaryCard title="Content Distribution Across Profiles">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {statistics.profileCount} active profiles with {statistics.uniqueContent.showCount} unique shows and{' '}
              {statistics.uniqueContent.movieCount} unique movies
            </Typography>
            <Typography variant="body2" paragraph>
              The account has an overall watch progress of{' '}
              <strong>{Math.round(statistics.episodeStatistics.watchProgress)}%</strong> across all content, with{' '}
              <strong>{statistics.episodeStatistics.watchedEpisodes}</strong> episodes watched out of{' '}
              <strong>{statistics.episodeStatistics.totalEpisodes}</strong> total episodes.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" paragraph>
              Shows are most often categorized as {getTopCategory(statistics.showStatistics.watchStatusCounts)} (
              {getTopCategoryPercentage(statistics.showStatistics.watchStatusCounts, statistics.showStatistics.total)}
              %), while movies are predominantly {getTopCategory(statistics.movieStatistics.watchStatusCounts)} (
              {getTopCategoryPercentage(statistics.movieStatistics.watchStatusCounts, statistics.movieStatistics.total)}
              %).
            </Typography>
          </ContentSummaryCard>
        </Grid>

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
            {SECTION_CATEGORIES.filter((section) => {
              // Hide profile comparison if only one profile
              if (section.id === 'profiles' && statistics.profileCount <= 1) {
                return false;
              }
              return true;
            }).map((section) => (
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

        {/* Profile Comparison Section */}
        {statistics.profileCount > 1 && (
          <Grid size={12}>
            <Accordion
              defaultExpanded
              ref={(el) => {
                sectionRefs.current['profiles'] = el;
              }}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">👥 Profile Comparison</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <ProfileComparisonCard stats={profileComparisonData ?? null} isLoading={isLoadingEnhancedStats} formatters={formatters} />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}

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
                  <MilestonesAndAnniversaryCard stats={milestoneData ?? null} isLoading={isLoadingEnhancedStats} formatters={formatters} />
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
                  <WatchVelocityCard velocityData={velocityData} isLoading={isLoadingEnhancedStats} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <ActivityTimelineChart timeline={timelineData} isLoading={isLoadingEnhancedStats} formatters={formatters} />
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
                  <BingeWatchingCard bingeData={bingeData} isLoading={isLoadingEnhancedStats} formatters={formatters} />
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <WatchStreakCard streakData={streakData} isLoading={isLoadingEnhancedStats} formatters={formatters} />
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

        {/* Rewatches Section */}
        <Grid size={12}>
          <Accordion
            ref={(el) => {
              sectionRefs.current['rewatches'] = el;
            }}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">🔁 Rewatches</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <RewatchStatsCard stats={rewatchData ?? null} isLoading={isLoadingEnhancedStats} />
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
    profileComparisonData,
    rewatchData,
    isLoadingEnhancedStats,
    formatters,
  ]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <BaseStatisticsDashboard
      statistics={statistics}
      isLoading={isLoading}
      dashboardTitle="Account Statistics"
      summaryCardProps={summaryCardProps}
      contentSections={contentSections}
    />
  );
}
