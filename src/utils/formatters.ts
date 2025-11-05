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

/**
 * Formats a date string or Date object to locale string
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString();
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
