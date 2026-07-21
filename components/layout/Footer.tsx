'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import navStyles from './HeaderNav.module.css';

interface FooterLink {
  text: string;
  url: string;
  slug: string;
}

export function Footer() {
  const locale = useLocale();
  const tFooter = useTranslations('footer');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [aboutLinks, setAboutLinks] = useState<FooterLink[]>([
    { text: locale === 'en' ? 'About us' : 'Über uns', url: '/about', slug: 'about' },
    { text: locale === 'en' ? 'Our services' : 'Unsere Leistungen', url: '/services', slug: 'services' },
    { text: locale === 'en' ? 'Knowledge' : 'Wissenswertes', url: '/wissenswertes', slug: 'wissenswertes' },
    { text: locale === 'en' ? 'Contact' : 'Kontakt', url: '/contact', slug: 'contact' },
  ]);
  const [legalLinks, setLegalLinks] = useState<FooterLink[]>([]);
  const [linksLoaded, setLinksLoaded] = useState(false);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch(`/api/footer-data?locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          if (data.legal && data.legal.length > 0) {
            setLegalLinks(data.legal);
          }
          if (data.about && data.about.length > 0) {
            setAboutLinks(data.about);
          }
        }
        setLinksLoaded(true);
      } catch (error) {
        console.error('Error fetching footer data:', error);
        setLinksLoaded(true); // Still show footer even if fetch fails
      }
    };

    fetchFooterData();
  }, [locale]);

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

  return (
    <footer className="bg-gem-bgDark border-t border-gem-iceDark/20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,2.1fr)] xl:items-start">
          
          {/* Spalte 1: Logo */}
          <div className="space-y-5">
            <div className="flex flex-col items-start space-y-4">
              <Link href={`/${locale}`} className="inline-flex flex-col gap-3 items-start">
                <Image 
                  src="/logo.png" 
                  alt="Gemilike Logo" 
                  width={240} 
                  height={106} 
                  className="h-auto max-w-[220px] object-contain sm:max-w-[260px]"
                />
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gem-ice/40 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-gem-iceLight">
                  Heroes in Gems
                </span>
              </Link>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-6 xl:gap-10">
            {/* About + Legal: always two columns side by side */}
            <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4">
              {/* Spalte 2: Wer sind wir? */}
              <div className="min-w-0 space-y-4 rounded-lg border border-gem-iceDark/20 bg-gem-bgDark/50 p-3 sm:p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-gem-text sm:text-lg sm:tracking-[0.2em]">
                  {locale === 'en' ? 'Who we are' : 'Wer sind wir?'}
                </h3>
                <div className="flex flex-col items-stretch gap-2">
                  {aboutLinks.map((link) => (
                    <Link
                      key={link.slug}
                      href={`/${locale}${link.url}`}
                      className={cn(navStyles.navButton, navStyles.navButtonTight, 'w-full max-w-full')}
                    >
                      <span className={cn(navStyles.navLabel, '!whitespace-normal text-center')}>
                        {link.text}
                      </span>
                      <span className={navStyles.navGlow} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Spalte 3: Rechtliches */}
              <div className="min-w-0 space-y-4 rounded-lg border border-gem-iceDark/20 bg-gem-bgDark/50 p-3 sm:p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-gem-text sm:text-lg sm:tracking-[0.2em]">
                  {locale === 'en' ? 'Legal' : 'Rechtliches'}
                </h3>
                <div className="flex flex-col items-stretch gap-2">
                  {linksLoaded && legalLinks.length > 0 ? (
                    legalLinks.map((link) => (
                      <Link
                        key={link.slug}
                        href={`/${locale}${link.url}`}
                        className={cn(navStyles.navButton, navStyles.navButtonTight, 'w-full max-w-full')}
                      >
                        <span className={cn(navStyles.navLabel, '!whitespace-normal text-center')}>
                          {link.text}
                        </span>
                        <span className={navStyles.navGlow} />
                      </Link>
                    ))
                  ) : null}
                </div>
                {!linksLoaded || legalLinks.length === 0 ? (
                  <p className="mt-2 text-xs text-gray-400">
                    {locale === 'en'
                      ? 'Create legal pages in the admin area so they appear here.'
                      : 'Erstellen Sie rechtliche Seiten im Admin-Bereich, damit sie hier erscheinen.'}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Spalte 4: Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gem-text uppercase tracking-[0.2em]">
                Newsletter
              </h3>
              <p className="text-sm text-gem-text2 leading-relaxed">
                {locale === 'en'
                  ? 'Stay up to date on new gemstones and exclusive offers.'
                  : 'Bleiben Sie auf dem Laufenden über neue Edelsteine und exklusive Angebote.'}
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder={locale === 'en' ? 'Your email address' : 'Ihre E-Mail-Adresse'}
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
                    {isSubscribed ? (locale === 'en' ? 'Subscribed!' : 'Angemeldet!') : locale === 'en' ? 'Subscribe' : 'Anmelden'}
                  </span>
                  <span className={navStyles.navGlow} />
                </Button>
              </form>

              {isSubscribed && (
                <p className="text-xs text-gem-green">
                  {locale === 'en' ? '✓ Newsletter subscription successful!' : '✓ Newsletter-Anmeldung erfolgreich!'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gem-iceDark/20 pt-6 sm:mt-12 sm:pt-8">
          <div className="flex justify-center">
            <p className="text-center text-sm text-gem-text2">
              © {new Date().getFullYear()} Gemilike. {tFooter('rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
