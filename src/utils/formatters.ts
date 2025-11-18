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
