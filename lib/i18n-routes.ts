/**
 * Internationalized routing utilities
 * Provides SEO-friendly URLs based on language
 */

export type Locale = 'el' | 'en';

export const routes = {
  el: {
    home: '/',
    services: '/ypiresies',
    gallery: '/galeri',
    about: '/sxetika',
    contact: '/epikoinonia',
  },
  en: {
    home: '/',
    services: '/en/services',
    gallery: '/en/gallery',
    about: '/en/about',
    contact: '/en/contact',
  },
} as const;

/**
 * Get localized path for a route
 */
export function getLocalizedPath(path: string, locale: Locale = 'el'): string {
  // Handle home page - for English, use /en
  if (path === '/' || path === '') {
    return locale === 'en' ? '/en' : '/';
  }

  // Remove leading slash
  const cleanPath = path.replace(/^\//, '');

  // Map English paths to localized paths
  const pathMap: Record<string, keyof typeof routes.el> = {
    'services': 'services',
    'gallery': 'gallery',
    'about': 'about',
    'contact': 'contact',
  };

  const routeKey = pathMap[cleanPath];
  if (routeKey) {
    return routes[locale][routeKey];
  }

  // Handle privacy and terms - keep same path but add /en prefix for English
  if (cleanPath === 'privacy' || cleanPath === 'terms') {
    return locale === 'en' ? `/en/${cleanPath}` : `/${cleanPath}`;
  }

  // If path starts with /en/, handle it
  if (path.startsWith('/en/')) {
    const enPath = path.replace('/en', '');
    return getLocalizedPath(enPath, 'en');
  }

  // Default: return as-is
  return path;
}

/**
 * Get the base path (without locale) from a localized path
 */
export function getBasePath(localizedPath: string): string {
  // Handle home page - /en maps to /
  if (localizedPath === '/en') {
    return '/';
  }

  // Handle home page
  if (localizedPath === '/' || localizedPath === '') {
    return '/';
  }

  // Check if it's a Greek SEO-friendly path
  const greekRoutes: Record<string, string> = {
    '/ypiresies': '/services',
    '/galeri': '/gallery',
    '/sxetika': '/about',
    '/epikoinonia': '/contact',
  };

  if (greekRoutes[localizedPath]) {
    return greekRoutes[localizedPath];
  }

  // Check if it's an English path
  if (localizedPath.startsWith('/en/')) {
    return localizedPath.replace('/en', '');
  }

  // If it's already a base path (services, gallery, etc.), return as-is
  const basePaths = ['/services', '/gallery', '/about', '/contact', '/privacy', '/terms'];
  if (basePaths.includes(localizedPath)) {
    return localizedPath;
  }
  
  // Handle /en/privacy and /en/terms
  if (localizedPath === '/en/privacy' || localizedPath === '/en/terms') {
    return localizedPath.replace('/en', '');
  }

  // Default: return as-is
  return localizedPath;
}

/**
 * Detect locale from pathname
 */
export function detectLocaleFromPath(pathname: string): Locale {
  // Check if it's an English path
  if (pathname.startsWith('/en/') || pathname === '/en') {
    return 'en';
  }

  // Check if it's a Greek SEO-friendly path
  const greekRoutes = ['/ypiresies', '/galeri', '/sxetika', '/epikoinonia'];
  if (greekRoutes.includes(pathname)) {
    return 'el';
  }

  // Default: Greek
  return 'el';
}

