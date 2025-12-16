'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { HeartIcon, MenuIcon, ShoppingCartIcon, UserIcon, LogInIcon, Languages } from 'lucide-react';
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
  const [isMounted, setIsMounted] = useState(false);
  const [navItems, setNavItems] = useState<NavigationItem[]>(FALLBACK_NAV);
  const { data: session, status } = useSession();
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
  const router = useRouter();

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
        if (!response.ok) {
          console.log('Header API not ok, using fallback');
          return;
        }
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

          // Ensure important default links stay present even if DB omits them
          const ensureDefaults = ['/downloads', '/wissenswertes'];
          ensureDefaults.forEach((path) => {
            if (!mapped.some((item) => item.href === path)) {
              const fallbackMatch = FALLBACK_NAV.find((item) => item.href === path);
              if (fallbackMatch) {
                mapped.push({ ...fallbackMatch, id: `fallback-${path}` });
              }
            }
          });

          if (mapped.length) {
            console.log('Setting navItems:', mapped);
            setNavItems(mapped);
          } else {
            console.log('No mapped items, using fallback');
            setNavItems(FALLBACK_NAV);
          }
        } else {
          console.log('No navigation items in API response, using fallback');
          setNavItems(FALLBACK_NAV);
        }
        setHeaderSettings({
          cartEnabled: data?.cartSettings?.enabled ?? true,
          cartShowCount: data?.cartSettings?.showCount ?? true,
          wishlistEnabled: data?.wishlist?.enabled ?? true,
          wishlistShowCount: data?.wishlist?.showCount ?? true,
        });
      } catch (error) {
        console.warn('Header navigation fetch failed, using fallback.', error);
        setNavItems(FALLBACK_NAV);
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

  const handleUserClick = () => {
    if (status === 'authenticated' && session) {
      router.push(buildHref('/profile'));
    } else {
      router.push(buildHref('/auth/signin'));
    }
  };

  return (
    <header 
      data-header-fixed
      className="sticky top-0 h-16 z-[9999] header-gradient-bg border-b border-white/10"
    >
      <div className="flex items-center justify-between w-full h-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Logo - Links */}
        <div className="flex-shrink-0">
          <Link href={buildHref('/')} className="inline-flex items-center transition-transform duration-200 hover:scale-[1.05]">
            <Image
              src="/logo.png"
              alt="Gemilike - Heroes in Gems"
              width={190}
              height={114}
              className="h-[98px] w-auto sm:h-[106px]"
              style={{ width: 'auto' }}
              priority
            />
          </Link>
        </div>

        {/* Hauptnavigation - Desktop */}
        {navItems.length > 0 && (
          <nav 
            className="flex items-center justify-center flex-1 gap-2 xl:gap-4 px-4 min-w-0"
            aria-label="Hauptnavigation"
            style={{ display: 'flex' }}
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
        )}

        {/* Action Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const currentLocale = localePrefix.replace('/', '') || 'de';
              const newLocale = currentLocale === 'de' ? 'en' : 'de';
              const newPath = pathname?.replace(`/${currentLocale}`, `/${newLocale}`) || `/${newLocale}`;
              router.push(newPath);
            }}
            className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all"
            aria-label="Sprache wechseln"
            title={localePrefix === '/de' || !localePrefix ? 'Switch to English' : 'Zu Deutsch wechseln'}
          >
            <Languages className="h-4 w-4" />
          </Button>
          
          <DarkModeToggle />
          
          {headerSettings.wishlistEnabled && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push(buildHref('/wishlist'))}
              className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all"
              aria-label={`Wunschliste${isMounted && wishlistCount > 0 ? `, ${wishlistCount} Artikel` : ''}`}
            >
              <HeartIcon className="h-4 w-4" />
              {headerSettings.wishlistShowCount && isMounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {wishlistCount}
                </span>
              )}
            </Button>
          )}
          
          {headerSettings.cartEnabled && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleCart}
              className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all"
              aria-label={`Warenkorb${isMounted && getTotalItems() > 0 ? `, ${getTotalItems()} Artikel` : ''}`}
            >
              <ShoppingCartIcon className="h-4 w-4" />
              {headerSettings.cartShowCount && isMounted && getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {getTotalItems()}
                </span>
              )}
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleUserClick}
            className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all"
            aria-label={status === 'authenticated' ? 'Profil öffnen' : 'Anmelden'}
          >
            {status === 'authenticated' ? (
              <UserIcon className="h-4 w-4" />
            ) : (
              <LogInIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Language Switcher - Mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const currentLocale = localePrefix.replace('/', '') || 'de';
              const newLocale = currentLocale === 'de' ? 'en' : 'de';
              const newPath = pathname?.replace(`/${currentLocale}`, `/${newLocale}`) || `/${newLocale}`;
              router.push(newPath);
            }}
            className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white"
            aria-label="Sprache wechseln"
            title={localePrefix === '/de' || !localePrefix ? 'Switch to English' : 'Zu Deutsch wechseln'}
          >
            <Languages className="h-4 w-4" />
          </Button>
          
          {headerSettings.wishlistEnabled && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push(buildHref('/wishlist'))}
              className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white"
              aria-label="Wunschliste"
            >
              <HeartIcon className="h-4 w-4" />
              {headerSettings.wishlistShowCount && isMounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {wishlistCount}
                </span>
              )}
            </Button>
          )}
          
          {headerSettings.cartEnabled && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleCart}
              className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white"
              aria-label="Warenkorb"
            >
              <ShoppingCartIcon className="h-4 w-4" />
              {headerSettings.cartShowCount && isMounted && getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {getTotalItems()}
                </span>
              )}
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleUserClick}
            className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white"
            aria-label={status === 'authenticated' ? 'Profil' : 'Anmelden'}
          >
            {status === 'authenticated' ? (
              <UserIcon className="h-4 w-4" />
            ) : (
              <LogInIcon className="h-4 w-4" />
            )}
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white"
                aria-label="Navigation öffnen"
                type="button"
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="text-xl font-bold mb-6">Navigation</SheetTitle>
              <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
                {navItems.map(({ href, label, id }) => {
                  const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(`${href}/`));
                  return (
                    <Link
                      key={id}
                      href={buildHref(href)}
                      onClick={() => {
                        // Close sheet when link is clicked
                        const sheetClose = document.querySelector('[data-state="open"]');
                        if (sheetClose) {
                          (sheetClose as HTMLElement).click();
                        }
                      }}
                      className={cn(
                        'px-4 py-3 rounded-lg transition-colors',
                        isActive 
                          ? 'bg-primary/20 text-primary font-semibold' 
                          : 'hover:bg-gray-800/50 text-gray-200'
                      )}
                    >
                      {label}
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
