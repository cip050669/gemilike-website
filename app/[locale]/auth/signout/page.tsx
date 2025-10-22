'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';

export default function SignOutPage() {
  const [status, setStatus] = useState('Abmelden...');

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        setStatus('Wird abgemeldet...');
        
        await signOut({ 
          redirect: false,
          callbackUrl: '/' 
        });
        
        setStatus('Abmeldung erfolgreich!');
        
        // Immediate redirect for better UX
        window.location.href = '/';
        
      } catch (error) {
        console.error('Sign out error:', error);
        setStatus('Weiterleitung...');
        
        // Fallback: redirect to home page anyway
        window.location.href = '/';
      }
    };

    handleSignOut();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{status}</h1>
        <p className="text-muted-foreground">Sie werden zur Startseite weitergeleitet.</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
