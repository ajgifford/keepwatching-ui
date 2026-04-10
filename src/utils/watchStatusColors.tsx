import { WatchStatus } from '@ajgifford/keepwatching-types';

/**
 * Default hex color map for each watch status.
 * Suitable for light-mode UIs and standard color environments.
 */
export const WATCH_STATUS_COLORS = {
  watched: '#4CAF50', // Green - completed content
  watching: '#FFC107', // Amber - currently in progress
  notWatched: '#F44336', // Red - not started
  upToDate: '#2196F3', // Blue - caught up with latest episodes
  unaired: '#9E9E9E', // Grey - content not yet available
} as const;

/**
 * Lightened hex color map for each watch status, optimized for dark-mode UIs
 * where the default colors may appear too saturated or low-contrast.
 */
export const WATCH_STATUS_COLORS_DARK = {
  watched: '#66BB6A',
  watching: '#FFB74D',
  notWatched: '#EF5350',
  upToDate: '#42A5F5',
  unaired: '#BDBDBD',
} as const;

/**
 * High-contrast hex color map for each watch status, meeting WCAG AA contrast
 * requirements. Use in accessibility-focused or high-contrast mode UIs.
 */
export const WATCH_STATUS_COLORS_ACCESSIBLE = {
  watched: '#2E7D32', // Darker green for better contrast
  watching: '#F57C00', // Darker orange
  notWatched: '#C62828', // Darker red
  upToDate: '#1565C0', // Darker blue
  unaired: '#616161', // Darker grey
} as const;

/** Union of the keys present in {@link WATCH_STATUS_COLORS}. */
export type WatchStatusColorKey = keyof typeof WATCH_STATUS_COLORS;

/**
 * Returns the hex color string for a given watch status and color theme.
 * Falls back to the `notWatched` color for unrecognized status values.
 * @param status - The watch status to look up.
 * @param theme - Color theme to use (`"default"`, `"dark"`, or `"accessible"`).
 * @returns Hex color string for the status in the requested theme.
 */
export const getWatchStatusColor = (
  status: WatchStatus,
  theme: 'default' | 'dark' | 'accessible' = 'default'
): string => {
  const colorMap = {
    default: WATCH_STATUS_COLORS,
    dark: WATCH_STATUS_COLORS_DARK,
    accessible: WATCH_STATUS_COLORS_ACCESSIBLE,
  }[theme];

  switch (status) {
    case WatchStatus.WATCHED:
      return colorMap.watched;
    case WatchStatus.WATCHING:
      return colorMap.watching;
    case WatchStatus.NOT_WATCHED:
      return colorMap.notWatched;
    case WatchStatus.UP_TO_DATE:
      return colorMap.upToDate;
    case WatchStatus.UNAIRED:
      return colorMap.unaired;
    default:
      return colorMap.notWatched;
  }
};

/**
 * Returns all watch-status colors for the given theme as an ordered array.
 * The order matches the keys of {@link WATCH_STATUS_COLORS}:
 * watched, watching, notWatched, upToDate, unaired.
 * Useful for supplying a color palette to charting libraries.
 * @param theme - Color theme to use (`"default"`, `"dark"`, or `"accessible"`).
 * @returns Array of hex color strings.
 */
export const getWatchStatusColorsArray = (theme: 'default' | 'dark' | 'accessible' = 'default'): string[] => {
  const colorMap = {
    default: WATCH_STATUS_COLORS,
    dark: WATCH_STATUS_COLORS_DARK,
    accessible: WATCH_STATUS_COLORS_ACCESSIBLE,
  }[theme];

  return Object.values(colorMap);
};

/**
 * Returns an `rgba(…)` color string for a given watch status, theme, and opacity.
 * Converts the theme's hex color to RGBA so that transparency can be applied.
 * @param status - The watch status to look up.
 * @param opacity - Alpha channel value between `0` (transparent) and `1` (opaque).
 * @param theme - Color theme to use (`"default"`, `"dark"`, or `"accessible"`).
 * @returns RGBA color string, e.g. `"rgba(76, 175, 80, 0.5)"`.
 */
export const getWatchStatusColorWithOpacity = (
  status: WatchStatus,
  opacity: number = 1,
  theme: 'default' | 'dark' | 'accessible' = 'default'
): string => {
  const baseColor = getWatchStatusColor(status, theme);

  // Convert hex to rgba
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Maps a completion percentage to a MUI color variant for progress bar display.
 * - `0%` → `"error"` (red)
 * - `1–74%` → `"warning"` (amber)
 * - `75–99%` → `"info"` (blue)
 * - `100%` → `"success"` (green)
 * @param percentage - Completion percentage between `0` and `100`.
 * @returns MUI color variant string.
 */
export const getProgressBarColor = (percentage: number): 'success' | 'warning' | 'error' | 'info' => {
  if (percentage === 0) return 'error'; // Red for 0%
  if (percentage === 100) return 'success'; // Green for 100%
  if (percentage >= 75) return 'info'; // Blue for 75%+
  return 'warning'; // Orange/amber for in-progress
};

/**
 * Maps a watch status to the corresponding MUI theme color variant.
 * Returns `"inherit"` for `UNAIRED` and any unrecognized status values.
 * @param status - The watch status to map.
 * @returns MUI color variant string compatible with MUI component `color` props.
 */
export const getMuiColorVariant = (status: WatchStatus): 'success' | 'warning' | 'error' | 'info' | 'inherit' => {
  switch (status) {
    case WatchStatus.WATCHED:
      return 'success';
    case WatchStatus.WATCHING:
      return 'warning';
    case WatchStatus.NOT_WATCHED:
      return 'error';
    case WatchStatus.UP_TO_DATE:
      return 'info';
    case WatchStatus.UNAIRED:
    default:
      return 'inherit';
  }
};

/**
 * Returns watch-status colors as an ordered array suitable for use as a
 * Recharts `fill` / color palette.
 * Delegates to {@link getWatchStatusColorsArray}.
 * @param theme - Color theme to use (`"default"`, `"dark"`, or `"accessible"`).
 * @returns Array of hex color strings ordered by watch status.
 */
export const getRechartsColors = (theme: 'default' | 'dark' | 'accessible' = 'default'): string[] => {
  return getWatchStatusColorsArray(theme);
};

/**
 * Ordered legend entries for watch status, each containing the status enum value,
 * a human-readable label, and the default hex color. Useful for rendering chart
 * legends and color-keyed UI elements.
 */
export const WATCH_STATUS_LEGEND = [
  { status: WatchStatus.WATCHED, label: 'Watched', color: WATCH_STATUS_COLORS.watched },
  { status: WatchStatus.UP_TO_DATE, label: 'Up To Date', color: WATCH_STATUS_COLORS.upToDate },
  { status: WatchStatus.WATCHING, label: 'Watching', color: WATCH_STATUS_COLORS.watching },
  { status: WatchStatus.NOT_WATCHED, label: 'Not Watched', color: WATCH_STATUS_COLORS.notWatched },
  { status: WatchStatus.UNAIRED, label: 'Unaired', color: WATCH_STATUS_COLORS.unaired },
] as const;
