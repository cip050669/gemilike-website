'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import NewsletterSignup from '../NewsletterSignup';

interface SocialLinkProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hoverColor: string;
}

interface ContactItemProps {
  icon: React.ComponentType<{ className?: string }>;
  content: string | React.ReactNode;
  color: string;
}

interface FooterProps {
  className?: string;
}

const socialLinks: SocialLinkProps[] = [
  {
    href: '#',
    label: 'Facebook',
    icon: Facebook,
    hoverColor: 'hover:text-blue-400'
  },
  {
    href: '#',
    label: 'Instagram',
    icon: Instagram,
    hoverColor: 'hover:text-purple-400'
  },
  {
    href: '#',
    label: 'Twitter',
    icon: Twitter,
    hoverColor: 'hover:text-blue-300'
  },
  {
    href: '#',
    label: 'LinkedIn',
    icon: Linkedin,
    hoverColor: 'hover:text-blue-500'
  }
];

const quickLinks = [
  { name: 'Über uns', href: '/de/about' },
  { name: 'Leistungen', href: '/de/services' },
  { name: 'Blog', href: '/de/blog' },
  { name: 'Kontakt', href: '/de/contact' }
];

const legalLinks = [
  { name: 'Datenschutz', href: '#' },
  { name: 'AGB', href: '#' },
  { name: 'Impressum', href: '#' }
];

const contactItems: ContactItemProps[] = [
  {
    icon: Mail,
    content: 'info@gemilike.de',
    color: 'text-blue-400'
  },
  {
    icon: Phone,
    content: '+49 123 456789',
    color: 'text-green-400'
  },
  {
    icon: MapPin,
    content: (
      <>
        Gemilike GmbH <br />
        Musterstraße 1 <br />
        12345 Musterstadt <br />
        Deutschland
      </>
    ),
    color: 'text-purple-400'
  }
];

export default function Footer({ className }: FooterProps): React.JSX.Element {
  return (
    <footer className={`bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50 text-slate-300 ${className || ''}`}>
      <div className="w-full container-responsive py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Logo und Beschreibung */}
          <div className="lg:col-span-1">
            <Link href="/de" className="flex items-center mb-6">
              <Image
                src="/fulllogo_transparent_nobuffer.png"
                alt="Gemilike Logo"
                width={200}
                height={60}
                className="h-12 w-auto filter brightness-110"
              />
            </Link>
            <p className="text-slate-400 mb-6 max-w-md leading-relaxed text-sm">
              Entdecken Sie die Welt der exklusiven Edelsteine. Wir bieten handverlesene Steine
              von höchster Qualität aus den besten Minen der Welt.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  aria-label={social.label} 
                  className={`w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 ${social.hoverColor} hover:bg-slate-700 transition-all duration-300`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Unternehmen</h3>
            <ul className="space-y-3 text-slate-400 text-base">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Kontakt</h3>
            <ul className="space-y-3 text-slate-400 text-base">
              {contactItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <item.icon className={`h-5 w-5 mr-3 ${item.color} ${index === 2 ? 'mt-1' : ''}`} />
                  <span>{item.content}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <NewsletterSignup />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p className="mb-4 md:mb-0">
            © {new Date().getFullYear()} Gemilike. Alle Rechte vorbehalten.
          </p>
          <div className="flex space-x-6">
            {legalLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className="hover:text-white transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
