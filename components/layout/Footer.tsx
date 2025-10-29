'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import navStyles from './HeaderNav.module.css';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
        setTimeout(() => setIsSubscribed(false), 3000);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    }
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/gemilike', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/gemilike', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/gemilike', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com/gemilike', label: 'YouTube' },
  ];

  // no-op

  return (
    <footer className="bg-gem-bgDark border-t border-gem-iceDark/20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-row gap-8">
          
          {/* Spalte 1: Logo + Social Media */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col items-start space-y-4">
              <Link href="/" className="inline-flex flex-col gap-3 items-start">
                <Image 
                  src="/logo.png" 
                  alt="Gemilike Logo" 
                  width={180} 
                  height={80} 
                  className="object-contain"
                />
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gem-ice/40 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-gem-iceLight">
                  Heroes in Gems
                </span>
              </Link>
              
              {/* Social Media Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    aria-label={social.label}
                    className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-gem-ice/20 bg-gem-bgDark/50 text-gem-text transition hover:border-gem-ice/60 hover:text-gem-iceLight hover:bg-gem-ice/10"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="h-5 w-5 transition group-hover:scale-110" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Spalte 2: Wer sind wir? */}
          <div className="flex-1 space-y-4">
            <h3 className="text-lg font-semibold text-gem-text uppercase tracking-[0.2em]">
              Wer sind wir?
            </h3>
            <div className="flex flex-col items-start gap-2">
              <Link href="/about" className={cn(navStyles.navButton, navStyles.navButtonTight)}>
                <span className={navStyles.navLabel}>Über uns</span>
                <span className={navStyles.navGlow} />
              </Link>
              <Link href="/services" className={cn(navStyles.navButton, navStyles.navButtonTight)}>
                <span className={navStyles.navLabel}>Unsere Leistungen</span>
                <span className={navStyles.navGlow} />
              </Link>
              <Link href="/wissenswertes" className={cn(navStyles.navButton, navStyles.navButtonTight)}>
                <span className={navStyles.navLabel}>Wissenswertes</span>
                <span className={navStyles.navGlow} />
              </Link>
              <Link href="/contact" className={cn(navStyles.navButton, navStyles.navButtonTight)}>
                <span className={navStyles.navLabel}>Kontakt</span>
                <span className={navStyles.navGlow} />
              </Link>
            </div>
          </div>

          {/* Spalte 3: Rechtliches */}
          <div className="flex-1 space-y-4">
            <h3 className="text-lg font-semibold text-gem-text uppercase tracking-[0.2em]">
              Rechtliches
            </h3>
            <div className="flex flex-col items-start gap-2">
              <Link href="/impressum" className={cn(navStyles.navButton, navStyles.navButtonTight)}>
                <span className={navStyles.navLabel}>Impressum</span>
                <span className={navStyles.navGlow} />
              </Link>
              <Link href="/datenschutz" className={cn(navStyles.navButton, navStyles.navButtonTight)}>
                <span className={navStyles.navLabel}>Datenschutz</span>
                <span className={navStyles.navGlow} />
              </Link>
              <Link href="/agb" className={cn(navStyles.navButton, navStyles.navButtonTight)}>
                <span className={navStyles.navLabel}>AGB</span>
                <span className={navStyles.navGlow} />
              </Link>
              <Link href="/widerruf" className={cn(navStyles.navButton, navStyles.navButtonTight)}>
                <span className={navStyles.navLabel}>Widerruf</span>
                <span className={navStyles.navGlow} />
              </Link>
            </div>
          </div>

          {/* Spalte 4: Newsletter */}
          <div className="flex-1 space-y-4">
            <h3 className="text-lg font-semibold text-gem-text uppercase tracking-[0.2em]">
              Newsletter
            </h3>
            <p className="text-sm text-gem-text2 leading-relaxed">
              Bleiben Sie auf dem Laufenden über neue Edelsteine und exklusive Angebote.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Ihre E-Mail-Adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gem-bgDark/50 border-gem-iceDark/30 text-gem-text placeholder:text-gem-text2 focus:border-gem-ice focus:ring-gem-ice/50"
                required
              />
              <Button
                type="submit"
                className={cn(navStyles.navButton, navStyles.navButtonTight, 'w-full justify-center')}
              >
                <span className={navStyles.navLabel}>
                  {isSubscribed ? 'Angemeldet!' : 'Anmelden'}
                </span>
                <span className={navStyles.navGlow} />
              </Button>
            </form>

            {isSubscribed && (
              <p className="text-xs text-gem-green">
                ✓ Newsletter-Anmeldung erfolgreich!
              </p>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gem-iceDark/20">
          <div className="flex justify-center">
            <p className="text-sm text-gem-text2">
              © {new Date().getFullYear()} Gemilike. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
