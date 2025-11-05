const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const PLACEHOLDER_BASE_URL = 'https://placehold.co';

/**
 * Builds a TMDB image URL with specified size
 * @param path - TMDB image path (e.g., "/abc123.jpg")
 * @param size - Image size (e.g., "w185", "w500", "w1280")
 * @param alt - Alt text for placeholder if path is missing
 * @returns Full TMDB image URL or placeholder
 */
export function buildTMDBImagePath(path: string | undefined, size: string = 'w185', alt: string = 'No Image'): string {
  if (path) {
    return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
  }
  return buildPlaceholderImage(alt);
}

/**
 * Creates a placeholder image URL
 * @param text - Text to display in placeholder
 * @param dimensions - Image dimensions (default: "300x200")
 * @returns Placeholder image URL
 */
export function buildPlaceholderImage(text: string, dimensions: string = '300x200'): string {
  const formattedText = text.replace(/ /g, '+');
  return `${PLACEHOLDER_BASE_URL}/${dimensions}/gray/white?text=${formattedText}&font=roboto`;
}

/**
 * Converts a relative or absolute image path to a full URL
 * Handles both external URLs and local server paths
 * @param imagePath - Image path from API
 * @param defaultImage - Optional default image URL
 * @param staticContentUrl - Base URL for local images
 * @returns Complete image URL
 */
export function getImageUrl(imagePath: string | undefined, defaultImage?: string, staticContentUrl?: string): string {
  // If path is a complete URL, return as is
  if (imagePath?.startsWith('http://') || imagePath?.startsWith('https://')) {
    return imagePath;
  }

  if (!imagePath && defaultImage) {
    return defaultImage;
  }

  if (!imagePath) {
    return buildPlaceholderImage('No Image', '300x300');
  }

  // For local paths, prepend static content URL
  if (staticContentUrl) {
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${staticContentUrl}${normalizedPath}`;
  }

  return imagePath;
}

/**
 * Gets profile image URL with appropriate fallback
 * @param profileImage - Profile image path
 * @param staticContentUrl - Base URL for local images
 * @returns Profile image URL
 */
export function getProfileImageUrl(profileImage: string | undefined, staticContentUrl?: string): string {
  return getImageUrl(profileImage, buildPlaceholderImage('No Profile', '300x300'), staticContentUrl);
}

/**
 * Gets account image URL with appropriate fallback
 * @param accountImage - Account image path
 * @param staticContentUrl - Base URL for local images
 * @returns Account image URL
 */
export function getAccountImageUrl(accountImage: string | undefined, staticContentUrl?: string): string {
  return getImageUrl(accountImage, buildPlaceholderImage('No Account', '300x300'), staticContentUrl);
}
