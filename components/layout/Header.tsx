'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MenuIcon, ShoppingCartIcon, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Cart } from '@/components/cart/Cart';
import { useCartStore } from '@/lib/store/cart';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Startseite' },
  { href: '/shop', label: 'Shop' },
  { href: '/wissenswertes', label: 'Wissenswertes' },
  { href: '/worldmap', label: 'Fundorte' },
  { href: '/contact', label: 'Kontakt' },
];

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const localePrefix = (() => {
    if (!pathname) return '';
    const segments = pathname.split('/');
    return segments[1] && segments[1].length === 2 ? `/${segments[1]}` : '';
  })();

  const stripLocale = (path: string) => {
    const segments = path.split('/');
    if (segments[1] && segments[1].length === 2) {
      const rest = segments.slice(2).join('/');
      return rest ? `/${rest}` : '/';
    }
    return path || '/';
  };

  const currentPath = stripLocale(pathname ?? '/');
  const buildHref = (href: string) => {
    if (!localePrefix) return href;
    if (href === '/') return localePrefix;
    return `${localePrefix}${href}`;
  };

  return (
    <div 
      className="fixed top-0 z-50 h-16 bg-gem-bgDark/90 backdrop-blur-md border-b border-gem-iceDark/20"
      style={{
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        width: '100%',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header Content - zentriert im Container */}
      <div className="flex items-center justify-between w-full h-full px-6 gap-4" style={{ width: '100%', maxWidth: 'none' }}>
        {/* Logo - Links */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Gemilike - Heroes in Gems"
              width={180}
              height={84}
              className="h-16 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Hauptnavigation */}
        <nav className="flex items-center justify-start flex-1 gap-[30px] ml-10 overflow-x-auto sm:overflow-visible">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={buildHref(href)}
                className={cn(
                  'relative inline-flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-gem-text/80 whitespace-nowrap transition-all duration-200 rounded-full border border-gem-ice/20 backdrop-blur-sm',
                  'hover:text-gem-text hover:border-gem-ice/40 hover:bg-gem-ice/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gem-ice/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                  isActive && 'text-gem-text bg-gem-ice/15 border-gem-ice/40 shadow-[0_12px_32px_rgba(0,188,212,0.35)]'
                )}
              >
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions - Rechts */}
        <div className="hidden md:flex items-center justify-end space-x-3 lg:space-x-4 flex-shrink-0">
          {/* Action Buttons */}
          <Button variant="outline" size="icon" className="h-9 w-9 border-gem-ice/30 text-gem-text hover:bg-gem-ice/10 hover:border-gem-ice/50">
            <UserIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleCart}
            className="relative h-9 w-9 border-gem-ice/30 text-gem-text hover:bg-gem-ice/10 hover:border-gem-ice/50"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            {isMounted && getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-gem-fire text-gem-bgDark text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center space-x-2 md:hidden">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleCart}
            className="relative border-gem-ice/30 text-gem-text hover:bg-gem-ice/10 hover:border-gem-ice/50"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            {isMounted && getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-gem-fire text-gem-bgDark text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-gem-ice/30 text-gem-text hover:bg-gem-ice/10 hover:border-gem-ice/50">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="flex flex-col gap-3 mt-6">
                {NAV_ITEMS.map(({ href, label }) => {
                  const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(`${href}/`));
                  return (
                    <Link
                      key={href}
                      href={buildHref(href)}
                      className={cn(
                        'flex items-center justify-between rounded-xl border border-gem-ice/40 bg-gem-bgDark/60 px-4 py-3 text-base font-medium transition-colors duration-200 text-gem-text',
                        'hover:border-gem-ice/60 hover:bg-gem-ice/10 hover:text-gem-iceLight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gem-ice/40 focus-visible:ring-offset-2',
                        isActive && 'border-gem-ice/60 bg-gem-ice/15 text-gem-iceLight'
                      )}
                    >
                      {label}
                      <span className="text-xs uppercase tracking-wide text-gem-text2/60">Entdecken</span>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <Cart />
    </div>
  );
}
