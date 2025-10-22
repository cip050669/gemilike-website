'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react';

const navigationColumns = [
  {
    heading: 'Navigation',
    links: [
      { label: 'Startseite', href: '/' },
      { label: 'Shop', href: '/shop' },
      { label: 'Wissenswertes', href: '/wissenswertes' },
      { label: 'Kontakt', href: '/contact' },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'Virtuelle Beratung', href: '/contact#beratung' },
      { label: 'Zertifizierungen', href: '/services/zertifikate' },
      { label: 'Maßanfertigungen', href: '/services/design' },
      { label: 'Investment Guidance', href: '/services/invest' },
    ],
  },
  {
    heading: 'Rechtliches',
    links: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
      { label: 'AGB', href: '/agb' },
      { label: 'Widerruf', href: '/widerruf' },
    ],
  },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/gemilike', icon: Instagram },
  { label: 'Facebook', href: 'https://facebook.com/gemilike', icon: Facebook },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/gemilike', icon: Linkedin },
  { label: 'YouTube', href: 'https://youtube.com/@gemilike', icon: Youtube },
];

const contactDetails = [
  {
    icon: MapPin,
    heading: 'Showroom',
    content: (
      <>
        Kaiserin-Augusta-Allee 112<br />
        10553 Berlin · Deutschland
      </>
    ),
  },
  {
    icon: Phone,
    heading: 'Telefon',
    content: <Link href="tel:+4930123456789">+49 30 123 456 789</Link>,
  },
  {
    icon: Mail,
    heading: 'E-Mail',
    content: <Link href="mailto:info@gemilike.com">info@gemilike.com</Link>,
  },
  {
    icon: Clock,
    heading: 'Öffnungszeiten',
    content: (
      <>
        Mo–Fr · 10–18 Uhr<br />
        Sa · nach Vereinbarung
      </>
    ),
  },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      setStatus('error');
      return;
    }
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.12),_transparent_55%)]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(320px,1.1fr),repeat(4,minmax(160px,1fr))]">
          <div className="space-y-8">
            <div className="space-y-4">
              <Link href="/" className="inline-flex flex-col gap-3">
                <span className="gemilike-text-gradient text-3xl font-impact tracking-wide">Gemilike</span>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/40 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-200/80">
                  Heroes in Gems
                </span>
              </Link>
              <p className="max-w-sm text-sm leading-relaxed text-slate-300">
                Wir begleiten Sammler, Investorinnen und Schmuckschaffende mit kuratierten Edelsteinen,
                nachvollziehbarer Herkunft und Beratung, die jede Facette versteht.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-300"
                >
                  <social.icon className="h-5 w-5 transition group-hover:scale-110" />
                </Link>
              ))}
            </div>

            <form
              onSubmit={handleNewsletterSubmit}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-6 shadow-lg shadow-cyan-500/10"
              aria-labelledby="newsletter-heading"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_55%)]" />
              <div className="relative space-y-4">
                <div>
                  <h2 id="newsletter-heading" className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
                    Newsletter
                  </h2>
                  <p className="text-base text-slate-200">
                    Neue Fundstücke, Markt-Insights und exklusive Einladungen direkt in Ihr Postfach.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="newsletter-email" className="sr-only">
                    E-Mail-Adresse
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Ihre E-Mail-Adresse"
                    className="w-full rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/50 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 hover:bg-cyan-400"
                  >
                    Anmelden
                  </button>
                </div>
                {status === 'success' && (
                  <p className="text-xs text-emerald-300">Danke! Bitte bestätigen Sie Ihre Anmeldung in Ihrem Postfach.</p>
                )}
                {status === 'error' && (
                  <p className="text-xs text-rose-300">Bitte geben Sie eine gültige E-Mail-Adresse ein.</p>
                )}
                <p className="text-[11px] text-slate-400">
                  Mit der Anmeldung akzeptieren Sie unsere Datenschutzerklärung. Abmeldung jederzeit möglich.
                </p>
              </div>
            </form>
          </div>

          {navigationColumns.map((column) => (
            <div key={column.heading} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-200">{column.heading}</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-white/5 hover:text-white"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/80" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-200">Kontakt</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {contactDetails.map((item) => (
                <li key={item.heading} className="flex items-start gap-3">
                  <item.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-300" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">{item.heading}</p>
                    <div className="mt-1 text-sm leading-relaxed">{item.content}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative flex flex-col gap-6 border-t border-white/10 pt-8 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Gemilike. Alle Rechte vorbehalten.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/impressum" className="hover:text-cyan-200">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-cyan-200">
              Datenschutz
            </Link>
            <Link href="/agb" className="hover:text-cyan-200">
              AGB
            </Link>
            <Link href="/cookies" className="hover:text-cyan-200">
              Cookie-Richtlinie
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent blur-[1px]" />
    </footer>
  );
}
