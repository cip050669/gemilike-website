'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';

export default function SignOutPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const homeHref = `/${locale}/`;
  const [status, setStatus] = useState('');

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        setStatus(t('signOutLoading'));
        
        await signOut({ 
          redirect: false,
          callbackUrl: homeHref,
        });
        
        setStatus(t('signOutSuccess'));
        
        // Immediate redirect for better UX
        window.location.href = homeHref;
        
      } catch (error) {
        console.error('Sign out error:', error);
        setStatus(t('redirecting'));
        
        // Fallback: redirect to home page anyway
        window.location.href = homeHref;
      }
    };

    handleSignOut();
  }, [t, homeHref]);

  useEffect(() => {
    setStatus(t('signOutPreparing'));
  }, [t]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{status}</h1>
        <p className="text-muted-foreground">{t('redirectToHome')}</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
