/**
 * Get the base path for the application from Vite's configuration
 * This ensures all routing is relative to the build configuration
 */
export const getBasePath = (): string => {
  // In production, Vite injects the base path into import.meta.env.BASE_URL
  // In development, it defaults to '/'
  const basePath = import.meta.env.BASE_URL || '/';
  
  // Ensure the base path starts and ends with '/' for proper routing
  return basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
};

/**
 * Get the full base path with trailing slash for BrowserRouter
 */
export const getRouterBasePath = (): string => {
  const basePath = import.meta.env.BASE_URL || '/';
  return basePath;
};

/**
 * Convert an asset URL to work with the configured base path
 * This handles both absolute and relative asset URLs
 */
export const getAssetUrl = (assetPath: string): string => {
  // If the path is empty or undefined, return empty string
  if (!assetPath) return '';
  
  // Get the base path without trailing slash
  const basePath = getBasePath();
  
  // If path already starts with base path, return as-is
  if (assetPath.startsWith(basePath)) {
    return assetPath;
  }
  
  // If path starts with '/', prepend base path
  if (assetPath.startsWith('/')) {
    return basePath + assetPath;
  }
  
  // If path is relative, prepend base path and '/'
  return basePath + '/' + assetPath;
};