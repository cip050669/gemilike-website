'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { HeartIcon, MenuIcon, ShoppingCartIcon, UserIcon, LogInIcon, Languages, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Removed Sheet import - using custom modal instead
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

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

          // Zusammenführen: Basis sind immer die Fallback-Links, API-Links kommen ergänzend hinzu
          const normalizeHref = (href: string) =>
            href.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';

          const merged = [...FALLBACK_NAV];
          mapped.forEach((item) => {
            const normalized = normalizeHref(item.href);
            const exists = merged.some((fallback) => normalizeHref(fallback.href) === normalized);
            if (!exists) {
              merged.push(item);
            }
          });

          if (merged.length) {
            console.log('Setting navItems:', merged);
            setNavItems(merged);
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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
        <div className="hidden md:flex flex-col items-end gap-1 flex-shrink-0">
          <div className="flex items-center gap-2 lg:gap-3">
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
              title={localePrefix === '/de' || !localePrefix ? 'Sprache wechseln: Zu Englisch' : 'Sprache wechseln: Zu Deutsch'}
            >
              <Languages className="h-4 w-4" />
            </Button>
            
            <DarkModeToggle />
            
            {headerSettings.wishlistEnabled && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push(buildHref('/wishlist'))}
                className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all relative"
                aria-label={`Wunschliste${isMounted && wishlistCount > 0 ? `, ${wishlistCount} Artikel` : ''}`}
                title={isMounted && wishlistCount > 0 
                  ? `Wunschliste öffnen (${wishlistCount} ${wishlistCount === 1 ? 'Artikel' : 'Artikel'})` 
                  : 'Wunschliste öffnen - Gespeicherte Edelsteine anzeigen'}
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
                className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all relative"
                aria-label={`Warenkorb${isMounted && getTotalItems() > 0 ? `, ${getTotalItems()} Artikel` : ''}`}
                title={isMounted && getTotalItems() > 0 
                  ? `Warenkorb öffnen (${getTotalItems()} ${getTotalItems() === 1 ? 'Artikel' : 'Artikel'})` 
                  : 'Warenkorb öffnen - Ihre ausgewählten Edelsteine anzeigen'}
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
              title={status === 'authenticated' 
                ? 'Profil öffnen - Ihre Kontoinformationen und Bestellungen anzeigen' 
                : 'Anmelden - Melden Sie sich an, um auf Ihr Konto zuzugreifen'}
            >
              {status === 'authenticated' ? (
                <UserIcon className="h-4 w-4" />
              ) : (
                <LogInIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
          {/* Welcome Message - Desktop */}
          {status === 'authenticated' && session?.user?.name && (
            <div className="text-xs text-white/90 font-medium px-1">
              Willkommen {session.user.name}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex flex-col items-end gap-1 md:hidden">
          <div className="flex items-center gap-2">
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
              title={localePrefix === '/de' || !localePrefix ? 'Sprache wechseln: Zu Englisch' : 'Sprache wechseln: Zu Deutsch'}
            >
              <Languages className="h-4 w-4" />
            </Button>
            
            {headerSettings.wishlistEnabled && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push(buildHref('/wishlist'))}
                className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white relative"
                aria-label="Wunschliste"
                title={isMounted && wishlistCount > 0 
                  ? `Wunschliste öffnen (${wishlistCount} ${wishlistCount === 1 ? 'Artikel' : 'Artikel'})` 
                  : 'Wunschliste öffnen - Gespeicherte Edelsteine anzeigen'}
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
                className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white relative"
                aria-label="Warenkorb"
                title={isMounted && getTotalItems() > 0 
                  ? `Warenkorb öffnen (${getTotalItems()} ${getTotalItems() === 1 ? 'Artikel' : 'Artikel'})` 
                  : 'Warenkorb öffnen - Ihre ausgewählten Edelsteine anzeigen'}
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
              title={status === 'authenticated' 
                ? 'Profil öffnen - Ihre Kontoinformationen und Bestellungen anzeigen' 
                : 'Anmelden - Melden Sie sich an, um auf Ihr Konto zuzugreifen'}
            >
              {status === 'authenticated' ? (
                <UserIcon className="h-4 w-4" />
              ) : (
                <LogInIcon className="h-4 w-4" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white flex-shrink-0"
              aria-label={isMenuOpen ? 'Navigation schließen' : 'Navigation öffnen'}
              title={isMenuOpen ? 'Menü schließen' : 'Menü öffnen - Zeigt die Navigation und alle Seiten an'}
              type="button"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              aria-controls="mobile-navigation"
              onClick={() => {
                setIsMenuOpen((prev) => !prev);
              }}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </Button>
            
            {/* Custom Mobile Menu Modal */}
            {isMenuOpen && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm"
                  onClick={() => setIsMenuOpen(false)}
                  aria-hidden="true"
                  style={{ pointerEvents: 'auto' }}
                />
                {/* Menu Panel */}
                <div
                  className="fixed right-0 top-0 h-full w-[300px] sm:w-[400px] z-[10001] bg-[#0a0a0a] border-l border-gray-800 shadow-2xl"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="mobile-menu-title"
                  style={{ pointerEvents: 'auto' }}
                >
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#111111]">
                      <h2 id="mobile-menu-title" className="text-xl font-bold text-[#ffffff]">
                        Navigation
                      </h2>
                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className="h-8 w-8 rounded-full hover:bg-gray-800 text-[#ffffff] flex items-center justify-center transition-colors"
                        aria-label="Menü schließen"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    {/* Navigation */}
                    <nav
                      id="mobile-navigation"
                      className="flex flex-col gap-1 flex-1 overflow-y-auto p-4"
                      aria-label="Mobile Navigation"
                    >
                      {navItems.length > 0 ? (
                        navItems.map(({ href, label, id }) => {
                          const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(`${href}/`));
                          // Use the same buildHref function as desktop navigation
                          const fullHref = buildHref(href);
                          
                          // Use router.push for all links to ensure consistent behavior
                          const handleClick = (e: React.MouseEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsMenuOpen(false);
                            // Use router.push for navigation
                            router.push(fullHref);
                          };
                          
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={handleClick}
                              className={cn(
                                'px-4 py-3 rounded-lg transition-all text-base font-medium block cursor-pointer text-left w-full',
                                isActive 
                                  ? 'bg-[#7c3aed] text-[#ffffff] font-semibold shadow-lg' 
                                  : 'text-[#ffffff] bg-[#1a1a1a] hover:bg-[#2a2a2a] hover:text-[#ff9447]'
                              )}
                              style={{ 
                                color: '#ffffff',
                                textDecoration: 'none',
                                textShadow: 'none',
                                border: 'none',
                                background: isActive ? '#7c3aed' : '#1a1a1a'
                              }}
                            >
                              {label}
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3 text-[#9ca4b5] text-sm">
                          Keine Navigationselemente verfügbar
                        </div>
                      )}
                    </nav>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Welcome Message - Mobile */}
          {status === 'authenticated' && session?.user?.name && (
            <div className="text-xs text-white/90 font-medium px-1">
              Willkommen {session.user.name}
            </div>
          )}
        </div>
      </div>
      
      <Cart />
    </header>
  );
}
