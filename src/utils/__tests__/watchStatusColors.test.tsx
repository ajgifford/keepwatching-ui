import { WatchStatus } from '@ajgifford/keepwatching-types';

import {
  getMuiColorVariant,
  getProgressBarColor,
  getRechartsColors,
  getWatchStatusColor,
  getWatchStatusColorWithOpacity,
  getWatchStatusColorsArray,
  WATCH_STATUS_COLORS,
  WATCH_STATUS_COLORS_ACCESSIBLE,
  WATCH_STATUS_COLORS_DARK,
  WATCH_STATUS_LEGEND,
} from '../watchStatusColors';

describe('WATCH_STATUS_COLORS', () => {
  it('should have all required status colors defined', () => {
    expect(WATCH_STATUS_COLORS.watched).toBeDefined();
    expect(WATCH_STATUS_COLORS.watching).toBeDefined();
    expect(WATCH_STATUS_COLORS.notWatched).toBeDefined();
    expect(WATCH_STATUS_COLORS.upToDate).toBeDefined();
    expect(WATCH_STATUS_COLORS.unaired).toBeDefined();
  });

  it('should have valid hex color format', () => {
    Object.values(WATCH_STATUS_COLORS).forEach((color) => {
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });
});

describe('WATCH_STATUS_COLORS_DARK', () => {
  it('should have all required status colors defined', () => {
    expect(WATCH_STATUS_COLORS_DARK.watched).toBeDefined();
    expect(WATCH_STATUS_COLORS_DARK.watching).toBeDefined();
    expect(WATCH_STATUS_COLORS_DARK.notWatched).toBeDefined();
    expect(WATCH_STATUS_COLORS_DARK.upToDate).toBeDefined();
    expect(WATCH_STATUS_COLORS_DARK.unaired).toBeDefined();
  });
});

describe('WATCH_STATUS_COLORS_ACCESSIBLE', () => {
  it('should have all required status colors defined', () => {
    expect(WATCH_STATUS_COLORS_ACCESSIBLE.watched).toBeDefined();
    expect(WATCH_STATUS_COLORS_ACCESSIBLE.watching).toBeDefined();
    expect(WATCH_STATUS_COLORS_ACCESSIBLE.notWatched).toBeDefined();
    expect(WATCH_STATUS_COLORS_ACCESSIBLE.upToDate).toBeDefined();
    expect(WATCH_STATUS_COLORS_ACCESSIBLE.unaired).toBeDefined();
  });
});

describe('getWatchStatusColor', () => {
  it('should return correct color for WATCHED status', () => {
    expect(getWatchStatusColor(WatchStatus.WATCHED)).toBe(WATCH_STATUS_COLORS.watched);
  });

  it('should return correct color for WATCHING status', () => {
    expect(getWatchStatusColor(WatchStatus.WATCHING)).toBe(WATCH_STATUS_COLORS.watching);
  });

  it('should return correct color for NOT_WATCHED status', () => {
    expect(getWatchStatusColor(WatchStatus.NOT_WATCHED)).toBe(WATCH_STATUS_COLORS.notWatched);
  });

  it('should return correct color for UP_TO_DATE status', () => {
    expect(getWatchStatusColor(WatchStatus.UP_TO_DATE)).toBe(WATCH_STATUS_COLORS.upToDate);
  });

  it('should return correct color for UNAIRED status', () => {
    expect(getWatchStatusColor(WatchStatus.UNAIRED)).toBe(WATCH_STATUS_COLORS.unaired);
  });

  it('should use dark theme colors when specified', () => {
    expect(getWatchStatusColor(WatchStatus.WATCHED, 'dark')).toBe(WATCH_STATUS_COLORS_DARK.watched);
  });

  it('should use accessible theme colors when specified', () => {
    expect(getWatchStatusColor(WatchStatus.WATCHED, 'accessible')).toBe(WATCH_STATUS_COLORS_ACCESSIBLE.watched);
  });

  it('should return default notWatched color for unknown status', () => {
    expect(getWatchStatusColor('UNKNOWN' as WatchStatus)).toBe(WATCH_STATUS_COLORS.notWatched);
  });
});

describe('getWatchStatusColorsArray', () => {
  it('should return array of default colors', () => {
    const colors = getWatchStatusColorsArray();
    expect(Array.isArray(colors)).toBe(true);
    expect(colors.length).toBe(5);
  });

  it('should return array of dark theme colors', () => {
    const colors = getWatchStatusColorsArray('dark');
    expect(colors).toContain(WATCH_STATUS_COLORS_DARK.watched);
  });

  it('should return array of accessible theme colors', () => {
    const colors = getWatchStatusColorsArray('accessible');
    expect(colors).toContain(WATCH_STATUS_COLORS_ACCESSIBLE.watched);
  });
});

describe('getWatchStatusColorWithOpacity', () => {
  it('should return rgba color with default opacity', () => {
    const color = getWatchStatusColorWithOpacity(WatchStatus.WATCHED);
    expect(color).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*1\)$/);
  });

  it('should return rgba color with custom opacity', () => {
    const color = getWatchStatusColorWithOpacity(WatchStatus.WATCHED, 0.5);
    expect(color).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*0\.5\)$/);
  });

  it('should work with different themes', () => {
    const color = getWatchStatusColorWithOpacity(WatchStatus.WATCHED, 0.8, 'dark');
    expect(color).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*0\.8\)$/);
  });

  it('should convert hex to correct rgb values', () => {
    // #4CAF50 should convert to rgb(76, 175, 80)
    const color = getWatchStatusColorWithOpacity(WatchStatus.WATCHED, 1);
    expect(color).toBe('rgba(76, 175, 80, 1)');
  });
});

describe('getProgressBarColor', () => {
  it('should return error for 0%', () => {
    expect(getProgressBarColor(0)).toBe('error');
  });

  it('should return success for 100%', () => {
    expect(getProgressBarColor(100)).toBe('success');
  });

  it('should return info for 75% and above', () => {
    expect(getProgressBarColor(75)).toBe('info');
    expect(getProgressBarColor(80)).toBe('info');
    expect(getProgressBarColor(99)).toBe('info');
  });

  it('should return warning for in-progress (below 75%)', () => {
    expect(getProgressBarColor(25)).toBe('warning');
    expect(getProgressBarColor(50)).toBe('warning');
    expect(getProgressBarColor(74)).toBe('warning');
  });
});

describe('getMuiColorVariant', () => {
  it('should return success for WATCHED', () => {
    expect(getMuiColorVariant(WatchStatus.WATCHED)).toBe('success');
  });

  it('should return warning for WATCHING', () => {
    expect(getMuiColorVariant(WatchStatus.WATCHING)).toBe('warning');
  });

  it('should return error for NOT_WATCHED', () => {
    expect(getMuiColorVariant(WatchStatus.NOT_WATCHED)).toBe('error');
  });

  it('should return info for UP_TO_DATE', () => {
    expect(getMuiColorVariant(WatchStatus.UP_TO_DATE)).toBe('info');
  });

  it('should return inherit for UNAIRED', () => {
    expect(getMuiColorVariant(WatchStatus.UNAIRED)).toBe('inherit');
  });

  it('should return inherit for unknown status', () => {
    expect(getMuiColorVariant('UNKNOWN' as WatchStatus)).toBe('inherit');
  });
});

describe('getRechartsColors', () => {
  it('should return color array for default theme', () => {
    const colors = getRechartsColors();
    expect(Array.isArray(colors)).toBe(true);
    expect(colors.length).toBe(5);
  });

  it('should return color array for dark theme', () => {
    const colors = getRechartsColors('dark');
    expect(colors).toContain(WATCH_STATUS_COLORS_DARK.watched);
  });

  it('should return color array for accessible theme', () => {
    const colors = getRechartsColors('accessible');
    expect(colors).toContain(WATCH_STATUS_COLORS_ACCESSIBLE.watched);
  });
});

describe('WATCH_STATUS_LEGEND', () => {
  it('should have all watch statuses', () => {
    expect(WATCH_STATUS_LEGEND).toHaveLength(5);
  });

  it('should have correct structure for each item', () => {
    WATCH_STATUS_LEGEND.forEach((item) => {
      expect(item).toHaveProperty('status');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('color');
    });
  });

  it('should include WATCHED status', () => {
    const watched = WATCH_STATUS_LEGEND.find((item) => item.status === WatchStatus.WATCHED);
    expect(watched).toBeDefined();
    expect(watched?.label).toBe('Watched');
  });

  it('should include all required statuses', () => {
    const statuses = WATCH_STATUS_LEGEND.map((item) => item.status);
    expect(statuses).toContain(WatchStatus.WATCHED);
    expect(statuses).toContain(WatchStatus.WATCHING);
    expect(statuses).toContain(WatchStatus.NOT_WATCHED);
    expect(statuses).toContain(WatchStatus.UP_TO_DATE);
    expect(statuses).toContain(WatchStatus.UNAIRED);
  });
});
