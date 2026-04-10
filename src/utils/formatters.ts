import { DisplayPreferences } from '@ajgifford/keepwatching-types';

/**
 * Parses a date-only string (YYYY-MM-DD) as a local date to avoid timezone shifts.
 * For other date formats, falls back to standard Date constructor.
 * @param dateString - Date string to parse
 * @returns Date object parsed as local date
 */
export function parseLocalDate(dateString: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(dateString);
}

/**
 * Formats runtime in minutes to "Xh Ym" format
 * @param minutes - Runtime in minutes
 * @returns Formatted string like "2h 30m"
 */
export function formatRuntime(minutes: number | undefined): string {
  if (!minutes) {
    return '';
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

/**
 * Formats user rating to "X.XX / 10" format
 * @param rating - Rating value (0-10)
 * @returns Formatted string like "7.50 / 10"
 */
export function formatUserRating(rating: number | undefined): string {
  if (!rating) {
    return 'Unknown';
  }
  return `${rating.toFixed(2)} / 10`;
}

/**
 * Formats amount as USD currency
 * @param amount - Dollar amount
 * @returns Formatted string like "$1,234,567.89"
 */
export function formatCurrency(amount: number | undefined): string {
  if (!amount) {
    return 'Unknown';
  }
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

interface DateDisplayOptions {
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
  fallbackText?: string;
}

/**
 * Formats a given date into a human-readable string using `toLocaleDateString`.
 *
 * - Returns a fallback string if the date is null, undefined, or invalid.
 * - Optionally accepts a locale and Intl.DateTimeFormatOptions for custom formatting.
 * - Only applies `locale` and `options` if they are defined.
 * - Handles date-only strings (YYYY-MM-DD) as local dates to avoid timezone shifts.
 *
 * @param {string | Date | null | undefined} date - The date value to format.
 * @param {Object} [dateDisplayOptions] - Optional configuration for date formatting.
 * @param {string} [dateDisplayOptions.locale] - BCP 47 language tag (e.g., `"en-US"`, `"en-GB"`).
 * @param {Intl.DateTimeFormatOptions} [dateDisplayOptions.options] - Intl formatting options.
 * @param {string} [dateDisplayOptions.fallbackText='Unknown'] - Text to return if date is missing or invalid.
 * @returns {string} The formatted date string or the fallback text.
 */
export function formatDateDisplay(
  date: string | Date | null | undefined,
  { locale, options, fallbackText = 'Unknown' }: DateDisplayOptions = {}
): string {
  if (!date) return fallbackText;

  let d: Date;
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    // Parse date-only strings (YYYY-MM-DD) as local dates to avoid timezone issues
    const [year, month, day] = date.split('-').map(Number);
    d = new Date(year, month - 1, day);
  } else {
    d = new Date(date);
  }

  // Only include locale/options if defined
  if (locale && options) return d.toLocaleDateString(locale, options);
  if (locale) return d.toLocaleDateString(locale);
  if (options) return d.toLocaleDateString(undefined, options);
  return d.toLocaleDateString();
}

/**
 * Helper to format a date as "Month Day, Year" (e.g. "November 6, 2025").
 *
 * Wraps {@link formatDateDisplay} with preset Intl.DateTimeFormat options:
 * `{ year: 'numeric', month: 'long', day: 'numeric' }`.
 *
 * @param {string | Date | null | undefined} date - The date to format.
 * @param {DateDisplayOptions} [overrides] - Optional overrides (e.g., locale or fallbackText).
 * @returns {string} Formatted date string or fallback text.
 */
export function formatFullDate(date: string | Date | null | undefined, overrides: DateDisplayOptions = {}): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  // Merge default options with any user overrides
  const merged: DateDisplayOptions = {
    ...overrides,
    options: { ...defaultOptions, ...overrides.options },
  };

  return formatDateDisplay(date, merged);
}

/**
 * Formats a date string or Date object to locale string
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    // Parse date-only strings (YYYY-MM-DD) as local dates to avoid timezone issues
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString();
  }
  return new Date(date).toLocaleDateString();
}

/**
 * Formats bytes to human-readable size (KB, MB, GB)
 * @param bytes - Size in bytes
 * @returns Formatted string like "1.5 MB"
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Formats gender number to readable string
 * @param gender - Gender code (1=Female, 2=Male, 3=Non-binary)
 * @returns Gender string
 */
export function formatGender(gender: number): string {
  switch (gender) {
    case 1:
      return 'Female';
    case 2:
      return 'Male';
    case 3:
      return 'Non-binary';
    default:
      return 'Unknown';
  }
}

/**
 * Gets MUI color for gender display
 * @param gender - Gender code
 * @returns MUI color name
 */
export function getGenderColor(gender: number): 'secondary' | 'primary' | 'info' | 'default' {
  switch (gender) {
    case 1:
      return 'secondary';
    case 2:
      return 'primary';
    case 3:
      return 'info';
    default:
      return 'default';
  }
}

// ---------------------------------------------------------------------------
// Date formatter factory
// ---------------------------------------------------------------------------

/**
 * Maps a dateFormat preference value to the BCP 47 locale that produces the
 * correct date ordering when combined with numeric Intl.DateTimeFormatOptions.
 *
 * - MM/DD/YYYY → en-US  ("03/15/2024")
 * - DD/MM/YYYY → en-GB  ("15/03/2024")
 * - YYYY-MM-DD → en-CA  ("2024-03-15")
 */
const DATE_FORMAT_LOCALE: Record<NonNullable<DisplayPreferences['dateFormat']>, string> = {
  'MM/DD/YYYY': 'en-US',
  'DD/MM/YYYY': 'en-GB',
  'YYYY-MM-DD': 'en-CA',
};

/** Converts a raw value into a Date, handling YYYY-MM-DD strings as local dates. */
function toDate(date: string | Date): Date {
  if (typeof date === 'string') return parseLocalDate(date);
  return date;
}

/**
 * The collection of named formatting functions returned by {@link createDateFormatters}.
 * Each slot represents a distinct semantic use-case for date display.
 */
export interface DateFormatters {
  /**
   * A calendar date on content (air date, release date, premiere, birthday, etc.).
   * Formatted according to the user's `dateFormat` preference.
   * @example "03/15/2024" | "15/03/2024" | "2024-03-15"
   */
  contentDate(date: string | Date | null | undefined): string;

  /**
   * A date that may be shown in relative form ("Today", "3 days ago") depending
   * on the user's `relativeDate` preference and how recent the date is.
   * Falls back to `contentDate` format when switching to absolute display.
   * @example "Today" | "In 3 days" | "03/15/2024"
   */
  relativeDate(date: string | Date | null | undefined): string;

  /**
   * A notification or activity timestamp with minute/hour granularity for very
   * recent events, transitioning to `contentDate` format for older ones.
   * Behavior is driven by the user's `relativeDate` preference.
   * @example "5m ago" | "2h ago" | "3d ago" | "03/15/2024"
   */
  notificationTimestamp(date: string | Date | null | undefined): string;

  /**
   * A date of user activity (watched-at, mark date, last activity).
   * Formatted according to the user's `dateFormat` preference.
   * @example "03/15/2024" | "15/03/2024" | "2024-03-15"
   */
  activityDate(date: string | Date | null | undefined): string;

  /**
   * A significant milestone date (member since, first episode/movie watched,
   * account created). Uses the user's `dateFormat` locale with a long month name.
   * @example "March 15, 2024" | "15 March 2024"
   */
  milestoneDate(date: string | Date | null | undefined): string;

  /**
   * A date combined with a time component (e.g. "Last Updated").
   * Respects both the user's `dateFormat` (for locale/ordering) and
   * `timeFormat` (12h vs 24h) preferences.
   * @example "03/15/2024, 2:30 PM" | "15/03/2024, 14:30"
   */
  dateTime(date: string | Date | null | undefined): string;

  /**
   * A compact date label for chart x-axes showing day and short month name.
   * Not affected by user preferences — kept compact for readability in charts.
   * @example "Mar 15"
   */
  chartAxisShort(date: string | Date | null | undefined): string;

  /**
   * A compact date label for chart x-axes showing short month name and year.
   * Not affected by user preferences — kept compact for readability in charts.
   * @example "Mar 2024"
   */
  chartAxisMonth(date: string | Date | null | undefined): string;

  /**
   * Extracts only the four-digit year from a date.
   * Not affected by user preferences.
   * @example "2024"
   */
  yearOnly(date: string | Date | null | undefined): string;
}

/**
 * Creates a fully-configured set of date formatter functions bound to the
 * supplied user display preferences.
 *
 * Components should call this once (memoised by the `useDateFormatters` hook)
 * and use the returned formatters throughout the render. When preferences
 * change, a new set of formatters is produced automatically.
 *
 * @param prefs - The user's `DisplayPreferences`. Missing fields fall back to
 *   sensible defaults so the factory is safe to call with a partial object or
 *   an empty object during initial load.
 * @returns An object whose methods cover every date-display semantic slot used
 *   across keepwatching-client and keepwatching-ui statistics components.
 *
 * @example
 * ```typescript
 * const formatters = createDateFormatters(displayPrefs);
 * formatters.contentDate(episode.airDate);   // "03/15/2024"
 * formatters.relativeDate(episode.airDate);  // "Today" | "03/15/2024"
 * formatters.notificationTimestamp(n.startDate); // "5m ago"
 * formatters.milestoneDate(account.createdAt);   // "March 15, 2024"
 * formatters.dateTime(lastUpdated);              // "03/15/2024, 2:30 PM"
 * formatters.chartAxisShort(day.date);           // "Mar 15"
 * formatters.yearOnly(show.releaseDate);         // "2024"
 * ```
 */
export function createDateFormatters(prefs: DisplayPreferences = {}): DateFormatters {
  const dateFormat = prefs.dateFormat ?? 'MM/DD/YYYY';
  const relativeDatePref = prefs.relativeDate ?? 'relative-recent';
  const timeFormat = prefs.timeFormat ?? '12h';

  const locale = DATE_FORMAT_LOCALE[dateFormat];

  // Shared Intl options for the numeric date portion (drives contentDate / activityDate)
  const numericDateOpts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  // Long-month options for milestone dates
  const longDateOpts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  // Fallback text when a null/undefined date is encountered
  const FALLBACK = 'Unknown';

  /** Formats a resolved Date using the user's locale and the provided options. */
  function applyLocale(d: Date, opts: Intl.DateTimeFormatOptions): string {
    return d.toLocaleDateString(locale, opts);
  }

  /** Core formatter for content / activity dates. */
  function formatAbsoluteDate(date: string | Date | null | undefined): string {
    if (!date) return FALLBACK;
    return applyLocale(toDate(date as string | Date), numericDateOpts);
  }

  /**
   * Builds a relative string for a given date: "Today", "Yesterday", "Tomorrow",
   * "In X days", or "X days ago". Returns null if the date is more than
   * `thresholdDays` days away from today (indicating the caller should fall back).
   */
  function buildRelativeString(d: Date, thresholdDays: number | null): string | null {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(d);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `In ${diffDays} days`;
    // diffDays < 0
    const absDiff = Math.abs(diffDays);
    if (thresholdDays !== null && absDiff > thresholdDays) return null;
    return `${absDiff} days ago`;
  }

  /**
   * Builds a relative notification timestamp with minute/hour resolution for
   * very recent events. Returns null when the caller should show an absolute date.
   */
  function buildTimestampRelative(d: Date, alwaysRelative: boolean): string | null {
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (alwaysRelative) return `${diffDays}d ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return null; // caller should fall back to absolute date
  }

  return {
    contentDate(date) {
      return formatAbsoluteDate(date);
    },

    activityDate(date) {
      return formatAbsoluteDate(date);
    },

    relativeDate(date) {
      if (!date) return FALLBACK;
      const d = toDate(date as string | Date);

      if (relativeDatePref === 'always-absolute') {
        return formatAbsoluteDate(date);
      }

      const threshold = relativeDatePref === 'relative-recent' ? 7 : null;
      const relative = buildRelativeString(d, threshold);
      return relative ?? formatAbsoluteDate(date);
    },

    notificationTimestamp(date) {
      if (!date) return FALLBACK;
      const d = toDate(date as string | Date);

      if (relativeDatePref === 'always-absolute') {
        return formatAbsoluteDate(date);
      }

      const alwaysRelative = relativeDatePref === 'always-relative';
      const relative = buildTimestampRelative(d, alwaysRelative);
      return relative ?? formatAbsoluteDate(date);
    },

    milestoneDate(date) {
      if (!date) return FALLBACK;
      return toDate(date as string | Date).toLocaleDateString(locale, longDateOpts);
    },

    dateTime(date) {
      if (!date) return FALLBACK;
      const d = toDate(date as string | Date);
      return d.toLocaleString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: timeFormat === '12h',
      });
    },

    chartAxisShort(date) {
      if (!date) return '';
      return toDate(date as string | Date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    },

    chartAxisMonth(date) {
      if (!date) return '';
      return toDate(date as string | Date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    },

    yearOnly(date) {
      if (!date) return FALLBACK;
      return String(toDate(date as string | Date).getFullYear());
    },
  };
}
