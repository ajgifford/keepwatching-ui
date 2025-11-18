import {
  formatBytes,
  formatCurrency,
  formatDate,
  formatDateDisplay,
  formatFullDate,
  formatGender,
  formatRuntime,
  formatUserRating,
  getGenderColor,
} from '../formatters';

describe('formatRuntime', () => {
  it('should format runtime correctly with hours and minutes', () => {
    expect(formatRuntime(150)).toBe('2h 30m');
  });

  it('should format runtime with only hours', () => {
    expect(formatRuntime(120)).toBe('2h 0m');
  });

  it('should format runtime with only minutes', () => {
    expect(formatRuntime(45)).toBe('0h 45m');
  });

  it('should return empty string for undefined', () => {
    expect(formatRuntime(undefined)).toBe('');
  });

  it('should handle zero minutes', () => {
    expect(formatRuntime(0)).toBe('');
  });
});

describe('formatUserRating', () => {
  it('should format rating with two decimal places', () => {
    expect(formatUserRating(7.5)).toBe('7.50 / 10');
  });

  it('should format whole numbers with decimals', () => {
    expect(formatUserRating(8)).toBe('8.00 / 10');
  });

  it('should return "Unknown" for undefined', () => {
    expect(formatUserRating(undefined)).toBe('Unknown');
  });

  it('should return "Unknown" for zero', () => {
    expect(formatUserRating(0)).toBe('Unknown');
  });
});

describe('formatCurrency', () => {
  it('should format currency with commas and decimals', () => {
    expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
  });

  it('should format small amounts', () => {
    expect(formatCurrency(10)).toBe('$10.00');
  });

  it('should return "Unknown" for undefined', () => {
    expect(formatCurrency(undefined)).toBe('Unknown');
  });

  it('should return "Unknown" for zero', () => {
    expect(formatCurrency(0)).toBe('Unknown');
  });
});

describe('formatDateDisplay', () => {
  it('should format a valid date string', () => {
    const date = '2024-01-15';
    const result = formatDateDisplay(date);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should format a Date object', () => {
    const date = new Date('2024-01-15');
    const result = formatDateDisplay(date);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should return default fallback for null', () => {
    expect(formatDateDisplay(null)).toBe('Unknown');
  });

  it('should return default fallback for undefined', () => {
    expect(formatDateDisplay(undefined)).toBe('Unknown');
  });

  it('should use custom fallback text', () => {
    expect(formatDateDisplay(null, { fallbackText: 'N/A' })).toBe('N/A');
  });

  it('should apply locale when provided', () => {
    const date = '2024-01-15';
    const result = formatDateDisplay(date, { locale: 'en-US' });
    expect(result).toBeTruthy();
  });

  it('should apply options when provided', () => {
    const date = '2024-01-15';
    const result = formatDateDisplay(date, {
      options: { year: 'numeric', month: 'long' },
    });
    expect(result).toBeTruthy();
  });
});

describe('formatFullDate', () => {
  it('should format date with full month name', () => {
    const date = new Date(2024, 0, 15); // January 15, 2024 (month is 0-indexed)
    const result = formatFullDate(date);
    expect(result).toContain('January');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('should handle Date objects', () => {
    const date = new Date(2024, 5, 20); // June 20, 2024 (month is 0-indexed)
    const result = formatFullDate(date);
    expect(result).toContain('June');
    expect(result).toContain('20');
    expect(result).toContain('2024');
  });

  it('should use custom fallback for null', () => {
    expect(formatFullDate(null, { fallbackText: 'No date' })).toBe('No date');
  });
});

describe('formatDate', () => {
  it('should format a date string', () => {
    const date = '2024-01-15';
    const result = formatDate(date);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should format a Date object', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});

describe('formatBytes', () => {
  it('should return "0 Bytes" for zero', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('should format bytes', () => {
    expect(formatBytes(500)).toBe('500 Bytes');
  });

  it('should format KB correctly', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('should format MB correctly', () => {
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
  });

  it('should format GB correctly', () => {
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
  });

  it('should format fractional values', () => {
    expect(formatBytes(1536)).toBe('1.5 KB');
  });
});

describe('formatGender', () => {
  it('should return "Female" for code 1', () => {
    expect(formatGender(1)).toBe('Female');
  });

  it('should return "Male" for code 2', () => {
    expect(formatGender(2)).toBe('Male');
  });

  it('should return "Non-binary" for code 3', () => {
    expect(formatGender(3)).toBe('Non-binary');
  });

  it('should return "Unknown" for invalid code', () => {
    expect(formatGender(0)).toBe('Unknown');
    expect(formatGender(99)).toBe('Unknown');
    expect(formatGender(-1)).toBe('Unknown');
  });
});

describe('getGenderColor', () => {
  it('should return "secondary" for code 1', () => {
    expect(getGenderColor(1)).toBe('secondary');
  });

  it('should return "primary" for code 2', () => {
    expect(getGenderColor(2)).toBe('primary');
  });

  it('should return "info" for code 3', () => {
    expect(getGenderColor(3)).toBe('info');
  });

  it('should return "default" for invalid code', () => {
    expect(getGenderColor(0)).toBe('default');
    expect(getGenderColor(99)).toBe('default');
    expect(getGenderColor(-1)).toBe('default');
  });
});
