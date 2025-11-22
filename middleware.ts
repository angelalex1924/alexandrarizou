import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Greek SEO-friendly routes mapping to actual pages
const greekRoutes: Record<string, string> = {
  '/ypiresies': '/services',
  '/galeri': '/gallery',
  '/sxetika': '/about',
  '/epikoinonia': '/contact',
  '/apokrypsia': '/privacy',
  '/oroi': '/terms',
};

// English routes (with /en prefix)
const englishRoutes = ['/services', '/gallery', '/about', '/contact', '/privacy', '/terms'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/fonts') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // Handle Greek SEO-friendly routes
  if (greekRoutes[pathname]) {
    // Rewrite Greek SEO-friendly URL to actual page
    const url = request.nextUrl.clone();
    url.pathname = greekRoutes[pathname];
    return NextResponse.rewrite(url);
  }

  // Handle English routes with /en prefix
  if (pathname.startsWith('/en/')) {
    const englishPath = pathname.replace('/en', '');
    // Check if it's a valid English route
    if (englishPath === '/' || englishRoutes.includes(englishPath)) {
      // Rewrite /en/* to actual page
      const url = request.nextUrl.clone();
      url.pathname = englishPath || '/';
      return NextResponse.rewrite(url);
    }
  }

  // Handle /en (English home)
  if (pathname === '/en') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.rewrite(url);
  }

  // Default: serve as-is (for home page and other routes)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

