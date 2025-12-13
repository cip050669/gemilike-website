import createMiddleware from 'next-intl/middleware';
import { locales } from './lib/i18n/config';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: 'de',
  
  // Always use locale prefix
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  // Align forwarded host with origin/host to avoid Server Actions origin mismatch in dev tunnels
  const reqHeaders = new Headers(request.headers);
  const origin = reqHeaders.get('origin');
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      reqHeaders.set('x-forwarded-host', originHost);
    } catch {
      // ignore malformed origin
    }
  } else if (reqHeaders.get('host')) {
    reqHeaders.set('x-forwarded-host', reqHeaders.get('host') as string);
  }
  
  // Create a new request with modified headers
  const modifiedRequest = new NextRequest(request.url, {
    headers: reqHeaders,
    method: request.method,
  });
  
  // Call intlMiddleware with the modified request
  const response = intlMiddleware(modifiedRequest);
  
  return response;
}

export const config = {
  // Match only internationalized pathnames, but exclude API routes
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
