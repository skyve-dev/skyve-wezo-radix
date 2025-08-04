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