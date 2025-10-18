import { NextRequest, NextResponse } from 'next/server';

export function adminAuthMiddleware(req: NextRequest) {
  // Simple admin authentication check
  // In a real app, you would check for valid session/token
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    // For now, allow all admin access
    // In production, implement proper authentication
    return NextResponse.next();
  }
  
  return NextResponse.next();
}
