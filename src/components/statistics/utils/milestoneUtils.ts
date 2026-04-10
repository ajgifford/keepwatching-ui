import { MILESTONE_THRESHOLDS, Milestone, MilestoneStats } from '@ajgifford/keepwatching-types';

/**
 * A {@link Milestone} extended with an explicit content `type` discriminator,
 * used internally to distinguish episode, movie, and hour milestones.
 */
interface MilestoneWithType extends Milestone {
  type: 'episodes' | 'movies' | 'hours';
}

// Fallback thresholds in case import fails
const FALLBACK_THRESHOLDS = {
  episodes: [10, 25, 50, 100, 250, 500, 750, 1000, 2000, 3000, 4000, 5000],
  movies: [5, 10, 25, 50, 75, 100, 200, 300, 400, 500],
  hours: [10, 25, 50, 100, 250, 500, 750, 1000, 2000, 3000, 4000, 5000],
};

// Use imported thresholds or fallback
const THRESHOLDS = MILESTONE_THRESHOLDS || FALLBACK_THRESHOLDS;

function calculateMilestones(
  current: number,
  thresholds: number[],
  type: 'episodes' | 'movies' | 'hours'
): MilestoneWithType[] {
  return thresholds.map((threshold) => ({
    type,
    threshold,
    achieved: current >= threshold,
    progress: Math.min((current / threshold) * 100, 100),
  }));
}

/**
 * Returns the single most significant milestone the user has already achieved,
 * determined by the highest threshold value across all content types
 * (episodes, movies, and hours).
 * @param stats - Milestone statistics for the account or profile.
 * @returns The achieved milestone with the highest threshold, or `null` if none
 *   have been achieved or `stats` is `null`.
 */
export function getLastAchievedMilestone(stats: MilestoneStats | null): MilestoneWithType | null {
  if (!stats) return null;

  const allMilestones: MilestoneWithType[] = [
    ...calculateMilestones(stats.totalEpisodesWatched, THRESHOLDS.episodes, 'episodes'),
    ...calculateMilestones(stats.totalMoviesWatched, THRESHOLDS.movies, 'movies'),
    ...calculateMilestones(stats.totalHoursWatched, THRESHOLDS.hours, 'hours'),
  ];

  // Get all achieved milestones and return the one with the highest threshold
  const achieved = allMilestones.filter((m) => m.achieved);
  if (achieved.length === 0) return null;

  return achieved.reduce((highest, current) => (current.threshold > highest.threshold ? current : highest));
}

/**
 * Returns the next unachieved milestone the user is closest to completing,
 * determined by the highest progress percentage across all content types
 * (episodes, movies, and hours).
 * @param stats - Milestone statistics for the account or profile.
 * @returns The unachieved milestone with the greatest progress, or `null` if all
 *   milestones have been achieved or `stats` is `null`.
 */
export function getNextMilestone(stats: MilestoneStats | null): MilestoneWithType | null {
  if (!stats) return null;

  const allMilestones: MilestoneWithType[] = [
    ...calculateMilestones(stats.totalEpisodesWatched, THRESHOLDS.episodes, 'episodes'),
    ...calculateMilestones(stats.totalMoviesWatched, THRESHOLDS.movies, 'movies'),
    ...calculateMilestones(stats.totalHoursWatched, THRESHOLDS.hours, 'hours'),
  ];

  // Get all unachieved milestones and return the one with the highest progress
  const unachieved = allMilestones.filter((m) => !m.achieved);
  if (unachieved.length === 0) return null;

  return unachieved.reduce((closest, current) => (current.progress > closest.progress ? current : closest));
}
