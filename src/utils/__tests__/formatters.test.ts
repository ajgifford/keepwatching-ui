import {
  createDateFormatters,
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

describe('createDateFormatters', () => {
  const ISO_DATE = '2024-03-15';
  const DATE_OBJ = new Date(2024, 2, 15); // March 15, 2024

  describe('contentDate', () => {
    it('should format with MM/DD/YYYY locale (en-US)', () => {
      const f = createDateFormatters({ dateFormat: 'MM/DD/YYYY' });
      expect(f.contentDate(ISO_DATE)).toBe('03/15/2024');
    });

    it('should format with DD/MM/YYYY locale (en-GB)', () => {
      const f = createDateFormatters({ dateFormat: 'DD/MM/YYYY' });
      expect(f.contentDate(ISO_DATE)).toBe('15/03/2024');
    });

    it('should format with YYYY-MM-DD locale (en-CA)', () => {
      const f = createDateFormatters({ dateFormat: 'YYYY-MM-DD' });
      expect(f.contentDate(ISO_DATE)).toBe('2024-03-15');
    });

    it('should accept a Date object', () => {
      const f = createDateFormatters({ dateFormat: 'MM/DD/YYYY' });
      expect(f.contentDate(DATE_OBJ)).toBe('03/15/2024');
    });

    it('should return "Unknown" for null', () => {
      const f = createDateFormatters({});
      expect(f.contentDate(null)).toBe('Unknown');
    });

    it('should return "Unknown" for undefined', () => {
      const f = createDateFormatters({});
      expect(f.contentDate(undefined)).toBe('Unknown');
    });
  });

  describe('activityDate', () => {
    it('should produce the same output as contentDate', () => {
      const f = createDateFormatters({ dateFormat: 'DD/MM/YYYY' });
      expect(f.activityDate(ISO_DATE)).toBe(f.contentDate(ISO_DATE));
    });
  });

  describe('milestoneDate', () => {
    it('should include the full month name for MM/DD/YYYY', () => {
      const f = createDateFormatters({ dateFormat: 'MM/DD/YYYY' });
      const result = f.milestoneDate(ISO_DATE);
      expect(result).toContain('March');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should include the full month name for DD/MM/YYYY', () => {
      const f = createDateFormatters({ dateFormat: 'DD/MM/YYYY' });
      const result = f.milestoneDate(ISO_DATE);
      expect(result).toContain('March');
      expect(result).toContain('2024');
    });

    it('should return "Unknown" for null', () => {
      const f = createDateFormatters({});
      expect(f.milestoneDate(null)).toBe('Unknown');
    });
  });

  describe('relativeDate', () => {
    it('should return "Today" for today with relative-recent', () => {
      const f = createDateFormatters({ relativeDate: 'relative-recent' });
      expect(f.relativeDate(new Date())).toBe('Today');
    });

    it('should return "Today" for today with always-relative', () => {
      const f = createDateFormatters({ relativeDate: 'always-relative' });
      expect(f.relativeDate(new Date())).toBe('Today');
    });

    it('should return formatted date for old date with always-absolute', () => {
      const f = createDateFormatters({ dateFormat: 'MM/DD/YYYY', relativeDate: 'always-absolute' });
      expect(f.relativeDate(ISO_DATE)).toBe('03/15/2024');
    });

    it('should return formatted date for 30-day-old date with relative-recent', () => {
      const f = createDateFormatters({ dateFormat: 'MM/DD/YYYY', relativeDate: 'relative-recent' });
      const old = new Date();
      old.setDate(old.getDate() - 30);
      const result = f.relativeDate(old);
      // Beyond 7-day threshold → absolute date
      expect(result).not.toContain('ago');
    });

    it('should return relative string for 30-day-old date with always-relative', () => {
      const f = createDateFormatters({ relativeDate: 'always-relative' });
      const old = new Date();
      old.setDate(old.getDate() - 30);
      expect(f.relativeDate(old)).toContain('days ago');
    });

    it('should return "Unknown" for null', () => {
      const f = createDateFormatters({});
      expect(f.relativeDate(null)).toBe('Unknown');
    });
  });

  describe('notificationTimestamp', () => {
    it('should return minutes-ago for a very recent date', () => {
      const f = createDateFormatters({ relativeDate: 'relative-recent' });
      const recent = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
      expect(f.notificationTimestamp(recent)).toBe('5m ago');
    });

    it('should return hours-ago for a date a few hours old', () => {
      const f = createDateFormatters({ relativeDate: 'relative-recent' });
      const hoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
      expect(f.notificationTimestamp(hoursAgo)).toBe('3h ago');
    });

    it('should return days-ago for a date within the threshold', () => {
      const f = createDateFormatters({ relativeDate: 'relative-recent' });
      const daysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      expect(f.notificationTimestamp(daysAgo)).toBe('3d ago');
    });

    it('should fall back to absolute date beyond 7 days with relative-recent', () => {
      const f = createDateFormatters({ dateFormat: 'MM/DD/YYYY', relativeDate: 'relative-recent' });
      const old = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      const result = f.notificationTimestamp(old);
      expect(result).not.toContain('ago');
    });

    it('should always show relative with always-relative', () => {
      const f = createDateFormatters({ relativeDate: 'always-relative' });
      const old = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      expect(f.notificationTimestamp(old)).toContain('d ago');
    });

    it('should always show absolute with always-absolute', () => {
      const f = createDateFormatters({ dateFormat: 'MM/DD/YYYY', relativeDate: 'always-absolute' });
      const recent = new Date(Date.now() - 5 * 60 * 1000);
      const result = f.notificationTimestamp(recent);
      expect(result).not.toContain('m ago');
    });

    it('should return "Unknown" for null', () => {
      const f = createDateFormatters({});
      expect(f.notificationTimestamp(null)).toBe('Unknown');
    });
  });

  describe('dateTime', () => {
    it('should include AM/PM with 12h format', () => {
      const f = createDateFormatters({ dateFormat: 'MM/DD/YYYY', timeFormat: '12h' });
      const result = f.dateTime(new Date(2024, 2, 15, 14, 30));
      expect(result).toMatch(/AM|PM/);
    });

    it('should not include AM/PM with 24h format', () => {
      const f = createDateFormatters({ dateFormat: 'MM/DD/YYYY', timeFormat: '24h' });
      const result = f.dateTime(new Date(2024, 2, 15, 14, 30));
      expect(result).not.toMatch(/AM|PM/);
    });

    it('should return "Unknown" for null', () => {
      const f = createDateFormatters({});
      expect(f.dateTime(null)).toBe('Unknown');
    });
  });

  describe('chartAxisShort', () => {
    it('should produce a compact month+day label', () => {
      const f = createDateFormatters({ dateFormat: 'DD/MM/YYYY' });
      expect(f.chartAxisShort(ISO_DATE)).toBe('Mar 15');
    });

    it('should return empty string for null', () => {
      const f = createDateFormatters({});
      expect(f.chartAxisShort(null)).toBe('');
    });
  });

  describe('chartAxisMonth', () => {
    it('should produce a compact month+year label', () => {
      const f = createDateFormatters({ dateFormat: 'DD/MM/YYYY' });
      expect(f.chartAxisMonth(ISO_DATE)).toBe('Mar 2024');
    });

    it('should return empty string for null', () => {
      const f = createDateFormatters({});
      expect(f.chartAxisMonth(null)).toBe('');
    });
  });

  describe('yearOnly', () => {
    it('should return only the four-digit year', () => {
      const f = createDateFormatters({});
      expect(f.yearOnly(ISO_DATE)).toBe('2024');
      expect(f.yearOnly(DATE_OBJ)).toBe('2024');
    });

    it('should return "Unknown" for null', () => {
      const f = createDateFormatters({});
      expect(f.yearOnly(null)).toBe('Unknown');
    });
  });

  describe('defaults', () => {
    it('should work with an empty preferences object', () => {
      const f = createDateFormatters({});
      expect(f.contentDate(ISO_DATE)).toBeTruthy();
      expect(f.relativeDate(new Date())).toBe('Today');
      expect(f.yearOnly(ISO_DATE)).toBe('2024');
    });

    it('should work with no argument at all', () => {
      const f = createDateFormatters();
      expect(f.contentDate(ISO_DATE)).toBeTruthy();
    });
  });
});
