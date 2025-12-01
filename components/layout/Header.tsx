'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HeartIcon, MenuIcon, ShoppingCartIcon, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Cart } from '@/components/cart/Cart';
import { useCartStore } from '@/lib/store/cart';
import { useWishlistStore } from '@/lib/store/wishlist';
import { cn } from '@/lib/utils';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
import styles from './HeaderNav.module.css';

interface NavigationItem {
  href: string;
  label: string;
  id: string;
}

const FALLBACK_NAV: NavigationItem[] = [
  { href: '/', label: 'Startseite', id: 'fallback-1' },
  { href: '/shop', label: 'Shop', id: 'fallback-2' },
  { href: '/wissenswertes', label: 'Wissenswertes', id: 'fallback-3' },
  { href: '/worldmap', label: 'Fundorte', id: 'fallback-4' },
  { href: '/contact', label: 'Kontakt', id: 'fallback-5' },
  { href: '/downloads', label: 'Download', id: 'fallback-6' },
];

export function Header() {
  const [/* searchQuery */, /* setSearchQuery */] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [navItems, setNavItems] = useState<NavigationItem[]>(FALLBACK_NAV);
  const actionButtonClass =
    'relative h-10 w-10 rounded-full border border-white/40 bg-white/30 text-white hover:bg-white/45 hover:border-white/60 hover:text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/80';
  const [headerSettings, setHeaderSettings] = useState({
    cartEnabled: true,
    cartShowCount: true,
    wishlistEnabled: true,
    wishlistShowCount: true,
  });
  const toggleCart = useCartStore((state) => state.toggleCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const cartSummary = useCartStore((state) => state.summary);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const wishlistSummary = useWishlistStore((state) => state.summary);
  const wishlistCount = useWishlistStore((state) => state.totalItems);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!cartSummary) {
      void fetchCart();
    }
  }, [cartSummary, fetchCart]);

  useEffect(() => {
    if (!wishlistSummary) {
      void fetchWishlist();
    }
  }, [wishlistSummary, fetchWishlist]);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch('/api/admin/header');
        if (!response.ok) return;
        const data = await response.json();
        if (data?.navigation?.items?.length) {
          const mapped = data.navigation.items
            .map((item: { id?: string; text: string; url: string }, index: number) => {
              const label = item?.text?.trim();
              const rawUrl = item?.url?.trim();
              if (!label || !rawUrl) return null;
              return {
                id: item.id ?? `db-${index}`,
                label,
                href: rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`,
              } satisfies NavigationItem;
            })
            .filter(Boolean) as NavigationItem[];

          const ensureDefaults = ['/downloads'];
          ensureDefaults.forEach((path) => {
            if (!mapped.some((item) => item.href === path)) {
              const fallbackMatch = FALLBACK_NAV.find((item) => item.href === path);
              if (fallbackMatch) {
                mapped.push({ ...fallbackMatch, id: `fallback-${path}` });
              }
            }
          });

          if (mapped.length) {
            setNavItems(mapped);
          }
        }
        setHeaderSettings({
          cartEnabled: data?.cartSettings?.enabled ?? true,
          cartShowCount: data?.cartSettings?.showCount ?? true,
          wishlistEnabled: data?.wishlist?.enabled ?? true,
          wishlistShowCount: data?.wishlist?.showCount ?? true,
        });
      } catch (error) {
        console.warn('Header navigation fetch failed, using fallback.', error);
      }
    })();
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
    <header 
      data-header-fixed
      className="sticky top-0 h-16 z-[9999] header-gradient-bg"
    >
      {/* Header Content - zentriert im Container */}
      <div className="flex items-center justify-between w-full h-full px-4 sm:px-6 gap-3 sm:gap-4 max-w-7xl mx-auto">
        {/* Logo - Links */}
        <div className="flex-shrink-0">
          <Link href="/" className="inline-flex items-center transition-transform duration-200 hover:scale-[1.08]">
            <Image
              src="/logo.png"
              alt="Gemilike - Heroes in Gems"
              width={140}
              height={64}
              className="h-12 w-auto sm:h-14"
              style={{ width: 'auto' }}
              priority
            />
          </Link>
        </div>

        {/* Hauptnavigation */}
        <nav 
          className="flex items-center justify-start flex-1 gap-3 sm:gap-5 ml-4 sm:ml-6 overflow-x-auto sm:overflow-visible px-2"
          aria-label="Hauptnavigation"
        >
          {navItems.map(({ href, label, id }) => {
            const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(`${href}/`));
            return (
              <Link
                key={id}
                href={buildHref(href)}
                className={cn(styles.navButton, isActive && 'shadow-[0_0_32px_rgba(0,0,0,0.35)]')}
                aria-current={isActive ? 'page' : undefined}
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
          <DarkModeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            className={actionButtonClass}
            aria-label="Benutzerprofil öffnen"
          >
            <UserIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
          {headerSettings.wishlistEnabled && (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className={actionButtonClass}
              aria-label={`Wunschliste öffnen${isMounted && wishlistCount > 0 ? `, ${wishlistCount} Artikel gemerkt` : ''}`}
            >
              <Link href={buildHref('/wishlist')}>
                <HeartIcon className="h-4 w-4" aria-hidden="true" />
                {headerSettings.wishlistShowCount && isMounted && wishlistCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 bg-gem-purple text-gem-bgDark text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </Button>
          )}
          {headerSettings.cartEnabled && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleCart}
              className={actionButtonClass}
              aria-label={`Warenkorb öffnen${isMounted && getTotalItems() > 0 ? `, ${getTotalItems()} Artikel im Warenkorb` : ''}`}
              aria-expanded={false}
            >
              <ShoppingCartIcon className="h-4 w-4" aria-hidden="true" />
              {headerSettings.cartShowCount && isMounted && getTotalItems() > 0 && (
                <span 
                  className="absolute -top-2 -right-2 bg-gem-fire text-gem-bgDark text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  aria-hidden="true"
                >
                  {getTotalItems()}
                </span>
              )}
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center space-x-2 md:hidden">
          <DarkModeToggle />
          {headerSettings.wishlistEnabled && (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className={actionButtonClass}
              aria-label={`Wunschliste öffnen${isMounted && wishlistCount > 0 ? `, ${wishlistCount} Artikel gemerkt` : ''}`}
            >
              <Link href={buildHref('/wishlist')}>
                <HeartIcon className="h-4 w-4" aria-hidden="true" />
                {headerSettings.wishlistShowCount && isMounted && wishlistCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 bg-gem-purple text-gem-bgDark text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </Button>
          )}
          {headerSettings.cartEnabled && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleCart}
              className={actionButtonClass}
              aria-label={`Warenkorb öffnen${isMounted && getTotalItems() > 0 ? `, ${getTotalItems()} Artikel im Warenkorb` : ''}`}
              aria-expanded={false}
            >
              <ShoppingCartIcon className="h-4 w-4" aria-hidden="true" />
              {headerSettings.cartShowCount && isMounted && getTotalItems() > 0 && (
                <span 
                  className="absolute -top-2 -right-2 bg-gem-fire text-gem-bgDark text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  aria-hidden="true"
                >
                  {getTotalItems()}
                </span>
              )}
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="border-gem-ice/30 text-gem-text hover:bg-gem-ice/10 hover:border-gem-ice/50"
                aria-label="Navigation öffnen"
                aria-expanded={false}
              >
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle>Navigation</SheetTitle>
              <nav className="flex flex-col gap-3 mt-6" aria-label="Mobile Navigation">
                {navItems.map(({ href, label, id }) => {
                  const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(`${href}/`));
                  return (
                    <Link
                      key={id}
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
