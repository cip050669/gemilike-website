'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const router = useRouter();
  const [countdown, setCountdown] = useState(4);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('landing');

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Cookie setzen, dass Landing Page besucht wurde
    if (typeof document !== 'undefined') {
      document.cookie = 'landing-visited=true; path=/; max-age=31536000'; // 1 Jahr
    }
  }, []);

  useEffect(() => {
    // Countdown Timer
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Navigation wenn Countdown abgelaufen
    if (countdown <= 0 && mounted && typeof window !== 'undefined') {
      // Verwende window.location für bessere mobile Kompatibilität
      window.location.href = `/${locale}`;
    }
  }, [countdown, locale, mounted]);

  const handleSkip = () => {
    // Verwende window.location für bessere mobile Kompatibilität
    if (typeof window !== 'undefined') {
      window.location.href = `/${locale}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background relative overflow-hidden">
      {/* Hintergrund-Muster */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Logo mit Animation */}
      <div className="animate-in fade-in zoom-in duration-1000 px-4">
        <Image
          src="/logo.png"
          alt="Gemilike - Heroes in Gems"
          width={600}
          height={240}
          className="w-full max-w-2xl h-auto"
          priority
        />
      </div>

      {/* Untertitel */}
      <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-muted-foreground mb-2">
          {t('subtitle')}
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground/80">
          {t('description')}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 px-4">
        <Button 
          size="lg" 
          onClick={handleSkip}
          className="min-w-[200px] w-full sm:w-auto"
        >
          {t('goToWebsite')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        {/* Fallback Link für mobile Geräte */}
        <Link 
          href={`/${locale}`}
          className="text-sm text-muted-foreground hover:text-primary underline mt-2 sm:mt-0 text-center"
        >
          Direkt zur Website
        </Link>
      </div>

      {/* Countdown */}
      <div className="mt-8 text-sm text-muted-foreground animate-in fade-in duration-1000 delay-700 px-4 text-center">
        {mounted && t('autoRedirect', { countdown })}
      </div>

      {/* Dezentes Hintergrund-Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <Image
          src="/logo.png"
          alt="Background"
          width={1200}
          height={480}
          className="w-full max-w-6xl h-auto"
        />
      </div>
    </div>
  );
}
