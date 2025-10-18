// Einfache Session-basierte Authentifizierung für Entwicklung
export interface SimpleSession {
  isAuthenticated: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// In-Memory Session Store (für Entwicklung)
let currentSession: SimpleSession = {
  isAuthenticated: false
};

export function createSession(user: { id: string; email: string; name: string; role: string }) {
  currentSession = {
    isAuthenticated: true,
    user
  };
  console.log('🔐 Session created for:', user.email);
}

export function getSession(): SimpleSession {
  return currentSession;
}

export function destroySession() {
  currentSession = {
    isAuthenticated: false
  };
  console.log('🔐 Session destroyed');
}

export function isAuthenticated(): boolean {
  return currentSession.isAuthenticated;
}

export function getCurrentUser() {
  return currentSession.user;
}
