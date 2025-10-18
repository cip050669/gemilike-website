import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Redirect root to /de
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/de', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/(de|en)/:path*']
};