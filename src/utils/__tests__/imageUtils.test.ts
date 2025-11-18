import {
  buildPlaceholderImage,
  buildTMDBImagePath,
  getAccountImageUrl,
  getImageUrl,
  getProfileImageUrl,
} from '../imageUtils';

describe('buildTMDBImagePath', () => {
  it('should build correct TMDB URL with default size', () => {
    const path = '/abc123.jpg';
    const result = buildTMDBImagePath(path);
    expect(result).toBe('https://image.tmdb.org/t/p/w185/abc123.jpg');
  });

  it('should build correct TMDB URL with custom size', () => {
    const path = '/abc123.jpg';
    const result = buildTMDBImagePath(path, 'w500');
    expect(result).toBe('https://image.tmdb.org/t/p/w500/abc123.jpg');
  });

  it('should return placeholder when path is undefined', () => {
    const result = buildTMDBImagePath(undefined);
    expect(result).toContain('placehold.co');
    expect(result).toContain('No+Image');
  });

  it('should return placeholder with custom alt text', () => {
    const result = buildTMDBImagePath(undefined, 'w185', 'Custom Alt');
    expect(result).toContain('Custom+Alt');
  });
});

describe('buildPlaceholderImage', () => {
  it('should build placeholder with default dimensions', () => {
    const result = buildPlaceholderImage('Test Text');
    expect(result).toBe('https://placehold.co/300x200/gray/white?text=Test+Text&font=roboto');
  });

  it('should build placeholder with custom dimensions', () => {
    const result = buildPlaceholderImage('Test', '500x500');
    expect(result).toBe('https://placehold.co/500x500/gray/white?text=Test&font=roboto');
  });

  it('should replace spaces with plus signs', () => {
    const result = buildPlaceholderImage('Multiple Word Text');
    expect(result).toContain('Multiple+Word+Text');
  });
});

describe('getImageUrl', () => {
  it('should return URL as-is if it starts with http://', () => {
    const url = 'http://example.com/image.jpg';
    expect(getImageUrl(url)).toBe(url);
  });

  it('should return URL as-is if it starts with https://', () => {
    const url = 'https://example.com/image.jpg';
    expect(getImageUrl(url)).toBe(url);
  });

  it('should return default image when path is undefined', () => {
    const defaultImage = 'https://example.com/default.jpg';
    expect(getImageUrl(undefined, defaultImage)).toBe(defaultImage);
  });

  it('should return placeholder when no path and no default', () => {
    const result = getImageUrl(undefined);
    expect(result).toContain('placehold.co');
    expect(result).toContain('No+Image');
  });

  it('should prepend static content URL to relative path', () => {
    const path = '/images/test.jpg';
    const staticUrl = 'https://cdn.example.com';
    expect(getImageUrl(path, undefined, staticUrl)).toBe('https://cdn.example.com/images/test.jpg');
  });

  it('should normalize path without leading slash', () => {
    const path = 'images/test.jpg';
    const staticUrl = 'https://cdn.example.com';
    expect(getImageUrl(path, undefined, staticUrl)).toBe('https://cdn.example.com/images/test.jpg');
  });

  it('should return path as-is when no static URL provided', () => {
    const path = '/images/test.jpg';
    expect(getImageUrl(path)).toBe(path);
  });
});

describe('getProfileImageUrl', () => {
  it('should return profile image URL with static content URL', () => {
    const path = '/profiles/user123.jpg';
    const staticUrl = 'https://cdn.example.com';
    expect(getProfileImageUrl(path, staticUrl)).toBe('https://cdn.example.com/profiles/user123.jpg');
  });

  it('should return "No Profile" placeholder when undefined', () => {
    const result = getProfileImageUrl(undefined);
    expect(result).toContain('placehold.co');
    expect(result).toContain('No+Profile');
  });

  it('should handle complete URLs', () => {
    const url = 'https://example.com/profile.jpg';
    expect(getProfileImageUrl(url)).toBe(url);
  });
});

describe('getAccountImageUrl', () => {
  it('should return account image URL with static content URL', () => {
    const path = '/accounts/acc456.jpg';
    const staticUrl = 'https://cdn.example.com';
    expect(getAccountImageUrl(path, staticUrl)).toBe('https://cdn.example.com/accounts/acc456.jpg');
  });

  it('should return "No Account" placeholder when undefined', () => {
    const result = getAccountImageUrl(undefined);
    expect(result).toContain('placehold.co');
    expect(result).toContain('No+Account');
  });

  it('should handle complete URLs', () => {
    const url = 'https://example.com/account.jpg';
    expect(getAccountImageUrl(url)).toBe(url);
  });
});
