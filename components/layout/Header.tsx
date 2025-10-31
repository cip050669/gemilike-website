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
import styles from './HeaderNav.module.css';

const NAV_ITEMS = [
  { href: '/', label: 'Startseite' },
  { href: '/shop', label: 'Shop' },
  { href: '/wissenswertes', label: 'Wissenswertes' },
  { href: '/worldmap', label: 'Fundorte' },
  { href: '/contact', label: 'Kontakt' },
];

export function Header() {
  const [/* searchQuery */, /* setSearchQuery */] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const summary = useCartStore((state) => state.summary);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    if (!summary) {
      void fetchCart();
    }
  }, [summary, fetchCart]);

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
    <header 
      data-header-fixed
      className="sticky top-0 h-16 bg-gem-bgDark/95 backdrop-blur-md border-b border-gem-iceDark/20 z-[9999]"
    >
      {/* Header Content - zentriert im Container */}
      <div className="flex items-center justify-between w-full h-full px-6 gap-4" style={{ width: '100%', maxWidth: 'none' }}>
        {/* Logo - Links */}
        <div className="flex-shrink-0">
          <Link href="/" className="inline-flex items-center transition-transform duration-200 hover:scale-[1.4]">
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
                className={cn(styles.navButton, isActive && 'shadow-[0_0_32px_rgba(0,0,0,0.35)]')}
              >
                <span className={styles.navLabel}>{label}</span>
                <span className={styles.navGlow} />
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
                      className={cn(styles.navButton, styles.navButtonCompact, 'justify-between px-3 py-2 text-sm', isActive && 'shadow-[0_0_28px_rgba(0,0,0,0.35)]')}
                    >
                      <span className={styles.navLabel}>{label}</span>
                      <span className={cn(styles.navLabel, styles.navLabelSecondary)}>Entdecken</span>
                      <span className={styles.navGlow} />
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <Cart />
    </header>
  );
}
