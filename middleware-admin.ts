import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Prüfe ob der Benutzer Admin-Rechte hat
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/de/admin') || 
                        req.nextUrl.pathname.startsWith('/en/admin')
    
    if (isAdminRoute && !token) {
      // Weiterleitung zur Login-Seite
      return NextResponse.redirect(new URL('/de/admin/login', req.url))
    }
    
    // Für Admin-Routen: Prüfe zusätzlich die Rolle
    if (isAdminRoute && token) {
      // Hier könnten wir die Admin-Rolle prüfen
      // Für jetzt erlauben wir alle authentifizierten Benutzer
      return NextResponse.next()
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith('/de/admin') || 
                            req.nextUrl.pathname.startsWith('/en/admin')
        
        // Für Admin-Routen ist ein Token erforderlich
        if (isAdminRoute) {
          return !!token
        }
        
        // Für andere Routen ist kein Token erforderlich
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/de/admin/:path*',
    '/en/admin/:path*',
  ]
}
