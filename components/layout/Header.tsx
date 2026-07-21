'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
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

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const localePrefix = (() => {
    if (!pathname) return '';
    const segments = pathname.split('/');
    return segments[1] && segments[1].length === 2 ? `/${segments[1]}` : '';
  })();
  const currentLocale = localePrefix.replace('/', '') || 'de';
  const fallbackNav = useMemo<NavigationItem[]>(
    () => [
      { href: '/', label: t('home'), id: 'fallback-1' },
      { href: '/shop', label: 'Shop', id: 'fallback-2' },
      { href: '/wissenswertes', label: currentLocale === 'en' ? 'Knowledge' : 'Wissenswertes', id: 'fallback-3' },
      { href: '/worldmap', label: currentLocale === 'en' ? 'Locations' : 'Fundorte', id: 'fallback-4' },
      { href: '/downloads', label: currentLocale === 'en' ? 'Downloads' : 'Download', id: 'fallback-6' },
    ],
    [currentLocale, t]
  );
  const [isMounted, setIsMounted] = useState(false);
  const [navItems, setNavItems] = useState<NavigationItem[]>(fallbackNav);
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
  const isEnglish = currentLocale === 'en';
  const switchLanguageLabel = isEnglish ? 'Switch language' : 'Sprache wechseln';
  const switchLanguageTitle = isEnglish ? 'Switch language: to German' : 'Sprache wechseln: Zu Englisch';
  const wishlistLabel = isEnglish ? 'Wishlist' : 'Wunschliste';
  const cartLabel = isEnglish ? 'Cart' : 'Warenkorb';
  const profileLabel = isEnglish ? 'Profile' : 'Profil';
  const signInLabel = isEnglish ? 'Sign in' : 'Anmelden';
  const openNavigationLabel = isEnglish ? 'Open navigation' : 'Navigation öffnen';
  const closeNavigationLabel = isEnglish ? 'Close navigation' : 'Navigation schließen';
  const menuTitle = isEnglish ? `Navigation (${navItems?.length || 0} items)` : `Navigation (${navItems?.length || 0} Einträge)`;
  const emptyNavLabel = isEnglish ? 'No navigation items available' : 'Keine Navigationselemente verfügbar';
  const welcomeLabel = isEnglish ? 'Welcome' : 'Willkommen';

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

          // Filtere "Über uns" und "Kontakt" aus den API-Links heraus
          const filteredMapped = mapped.filter((item) => {
            const normalized = normalizeHref(item.href);
            const labelLower = item.label.toLowerCase();
            return normalized !== '/about' && 
                   normalized !== '/contact' && 
                   labelLower !== 'über uns' && 
                   labelLower !== 'kontakt';
          });

          const merged = [...fallbackNav];
          filteredMapped.forEach((item) => {
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
            setNavItems(fallbackNav);
          }
        } else {
          console.log('No navigation items in API response, using fallback');
          setNavItems(fallbackNav);
        }
        setHeaderSettings({
          cartEnabled: data?.cartSettings?.enabled ?? true,
          cartShowCount: data?.cartSettings?.showCount ?? true,
          wishlistEnabled: data?.wishlist?.enabled ?? true,
          wishlistShowCount: data?.wishlist?.showCount ?? true,
        });
      } catch (error) {
        console.warn('Header navigation fetch failed, using fallback.', error);
        setNavItems(fallbackNav);
      }
    })();
  }, [fallbackNav]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
      className="sticky top-0 z-[10000] border-b border-white/10 header-gradient-bg"
    >
      <div className="mx-auto flex min-h-[114px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:min-h-[126px] sm:px-6 lg:px-8">
        {/* Logo - Links */}
        <div className="flex shrink-0 items-center">
          <Link href={buildHref('/')} className="inline-flex items-center transition-transform duration-200 hover:scale-[1.05]">
            <Image
              src="/logo.png"
              alt="Gemilike - Heroes in Gems"
              width={220}
              height={144}
              className="h-[86px] w-auto sm:h-[118px] lg:h-[126px]"
              style={{ width: 'auto' }}
              priority
            />
          </Link>
        </div>

        {/* Hauptnavigation - Desktop */}
        {navItems.length > 0 && (
          <nav 
            className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-2 md:justify-center md:gap-2 md:px-4 xl:gap-4"
            aria-label="Hauptnavigation"
          >
            {navItems.map(({ href, label, id }) => {
              const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(`${href}/`));
              return (
                <Link
                  key={id}
                  href={buildHref(href)}
                  className={cn(
                    styles.navButton,
                    'shrink-0 px-2.5 py-2 text-[11px] md:px-4 md:text-sm',
                    isActive && 'shadow-[0_0_32px_rgba(0,0,0,0.35)]'
                  )}
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
        <div className="hidden shrink-0 flex-col items-end gap-1 md:flex">
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
              aria-label={switchLanguageLabel}
              title={switchLanguageTitle}
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
                aria-label={`${wishlistLabel}${isMounted && wishlistCount > 0 ? `, ${wishlistCount}` : ''}`}
                title={wishlistLabel}
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
                aria-label={`${cartLabel}${isMounted && getTotalItems() > 0 ? `, ${getTotalItems()}` : ''}`}
                title={cartLabel}
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
              aria-label={status === 'authenticated' ? profileLabel : signInLabel}
              title={status === 'authenticated' ? profileLabel : signInLabel}
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
              {welcomeLabel} {session.user.name}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex shrink-0 flex-col items-end gap-1 md:hidden">
          <div className="flex items-center gap-1.5 sm:gap-2">
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
              className="h-8 w-8 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 sm:h-9 sm:w-9"
              aria-label={switchLanguageLabel}
              title={switchLanguageTitle}
            >
              <Languages className="h-4 w-4 sm:h-4 sm:w-4" />
            </Button>
            
            {headerSettings.wishlistEnabled && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push(buildHref('/wishlist'))}
                className="relative h-8 w-8 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 sm:h-9 sm:w-9"
                aria-label={wishlistLabel}
                title={wishlistLabel}
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
                className="relative h-8 w-8 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 sm:h-9 sm:w-9"
                aria-label={cartLabel}
                title={cartLabel}
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
              className="h-8 w-8 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 sm:h-9 sm:w-9"
              aria-label={status === 'authenticated' ? profileLabel : signInLabel}
              title={status === 'authenticated' ? profileLabel : signInLabel}
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
              className="relative z-[10000] h-8 w-8 shrink-0 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 sm:h-9 sm:w-9"
              aria-label={isMenuOpen ? closeNavigationLabel : openNavigationLabel}
              title={isMenuOpen ? closeNavigationLabel : openNavigationLabel}
              type="button"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              aria-controls="mobile-navigation"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
              style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </Button>
            
            {/* Custom Mobile Menu Modal */}
            {isMenuOpen && (
              <>
                {/* Overlay */}
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 99998
                  }}
                  onClick={() => setIsMenuOpen(false)}
                  aria-hidden="true"
                />
                
                {/* Menu Panel */}
                <div
                  style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    width: 'min(88vw, 360px)',
                    height: '100vh',
                    backgroundColor: '#0a0a0a',
                    borderRight: '1px solid #1f2937',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    zIndex: 99999,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="mobile-menu-title"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.875rem 1rem',
                      borderBottom: '1px solid #1f2937',
                      backgroundColor: '#111111',
                      flexShrink: 0,
                      minHeight: '60px'
                    }}
                  >
                    <h2
                      id="mobile-menu-title"
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        margin: 0,
                        lineHeight: '1.5'
                      }}
                    >
                      {menuTitle}
                    </h2>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      aria-label={closeNavigationLabel}
                    >
                      <X style={{ width: '1.25rem', height: '1.25rem' }} />
                    </button>
                  </div>
                  
                  {/* Navigation */}
                  <nav
                    id="mobile-navigation"
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      padding: '0.875rem 1rem 1rem',
                      overflowY: 'auto',
                      overflowX: 'hidden',
                      WebkitOverflowScrolling: 'touch',
                      minHeight: 0
                    }}
                    aria-label="Mobile Navigation"
                  >
                    {navItems && navItems.length > 0 ? (
                      navItems.map(({ href, label, id }) => {
                        const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(`${href}/`));
                        const fullHref = buildHref(href);
                        
                        const handleClick = (e: React.MouseEvent) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsMenuOpen(false);
                          router.push(fullHref);
                        };
                        
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={handleClick}
                            style={{
                              padding: '0.875rem 1rem',
                              borderRadius: '0.5rem',
                              border: 'none',
                              backgroundColor: isActive ? '#7c3aed' : '#1a1a1a',
                              color: '#ffffff',
                              fontSize: '1rem',
                              fontWeight: isActive ? '600' : '500',
                              textAlign: 'left',
                              width: '100%',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              boxShadow: isActive ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = '#2a2a2a';
                                e.currentTarget.style.color = '#ff9447';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = '#1a1a1a';
                                e.currentTarget.style.color = '#ffffff';
                              }
                            }}
                          >
                            {label}
                          </button>
                        );
                      })
                    ) : (
                      <div style={{ padding: '0.75rem 1rem', color: '#9ca4b5', fontSize: '0.875rem' }}>
                        {emptyNavLabel}
                      </div>
                    )}
                  </nav>
                  
                  {/* Footer */}
                  {status === 'authenticated' && session?.user?.name && (
                    <div
                      style={{
                        padding: '1rem',
                        borderTop: '1px solid #1f2937',
                        backgroundColor: '#111111',
                        flexShrink: 0
                      }}
                    >
                      <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>
                        {welcomeLabel}, {session.user.name}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          {/* Welcome Message - Mobile */}
          {status === 'authenticated' && session?.user?.name && (
            <div className="text-xs text-white/90 font-medium px-1">
              {welcomeLabel} {session.user.name}
            </div>
          )}
        </div>
      </div>

      <Cart />
    </header>
  );
}
