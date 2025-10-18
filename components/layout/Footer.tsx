'use client';

import Link from 'next/link';
import { FacebookIcon, InstagramIcon, TwitterIcon, MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="gemilike-text-gradient text-xl font-bold">Gemilike</h3>
            <p className="text-muted-foreground text-sm">
              Ihr Spezialist für rohe und geschliffene Edelsteine. 
              Entdecken Sie unsere exquisite Auswahl an Diamanten, 
              Smaragden, Rubinen und weiteren Edelsteinen.
            </p>
            <div className="flex space-x-4">
              <FacebookIcon className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <InstagramIcon className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <TwitterIcon className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Schnellzugriff</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Startseite
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Leistungen</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground">Edelstein-Beratung</li>
              <li className="text-muted-foreground">Schmuck-Design</li>
              <li className="text-muted-foreground">Reparaturen</li>
              <li className="text-muted-foreground">Bewertungen</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Kontakt</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  Musterstraße 123<br />
                  12345 Musterstadt
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">+49 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <MailIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">info@gemilike.de</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              &copy; 2024 Gemilike. Alle Rechte vorbehalten.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/impressum" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Datenschutz
              </Link>
              <Link href="/agb" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                AGB
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}