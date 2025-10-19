'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  Search,
  Bell,
  Settings,
  LogOut,
  UserCircle,
  CreditCard,
  Package,
  Star,
  HelpCircle
} from 'lucide-react';
import { useCartStore } from '../../store/cart';
import { useWishlistStore } from '../../store/wishlist';

interface NavigationItem {
  name: string;
  href: string;
}

interface HeaderProps {
  className?: string;
}

const navigation: NavigationItem[] = [
  { name: 'Startseite', href: '/de' },
  { name: 'Shop', href: '/de/shop' },
  { name: 'Blog', href: '/de/blog' },
  { name: 'Über uns', href: '/de/about' },
  { name: 'Kontakt', href: '/de/contact' }
];

export default function Header({ className }: HeaderProps): React.JSX.Element {
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { getTotalItems, openCart } = useCartStore();
  const { getTotalItems: getWishlistItems } = useWishlistStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleUserMenuToggle = (): void => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/de/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-slate-800 ${className || ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/de" className="block">
              <Image
                src="/fulllogo_transparent_nobuffer.png"
                alt="Gemilike"
                width={200}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Main Navigation - HORIZONTAL OHNE DROPDOWNS */}
          <nav className="flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-blue-400 transition-colors py-2 px-4 text-base font-medium whitespace-nowrap bg-slate-800/50 rounded-lg hover:bg-slate-700/50"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-sm mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Edelsteine suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative text-white hover:text-blue-400 transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Wishlist */}
            <Link 
              href="/de/wishlist" 
              className="relative text-white hover:text-purple-400 transition-colors"
            >
              <Heart className="h-6 w-6" />
              {isHydrated && getWishlistItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getWishlistItems()}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative text-white hover:text-blue-400 transition-colors"
              aria-label="Warenkorb öffnen"
            >
              <ShoppingCart className="h-6 w-6" />
              {isHydrated && getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={handleUserMenuToggle}
                className="flex items-center text-white hover:text-blue-400 transition-colors"
              >
                <UserCircle className="h-6 w-6" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg shadow-xl z-50">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-700">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Max Mustermann</p>
                        <p className="text-slate-400 text-sm">max@example.com</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link href="/de/profile" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-white">Profil</span>
                      </Link>
                      <Link href="/de/orders" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                        <Package className="h-4 w-4 text-slate-400" />
                        <span className="text-white">Bestellungen</span>
                      </Link>
                      <Link href="/de/favorites" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                        <Star className="h-4 w-4 text-slate-400" />
                        <span className="text-white">Favoriten</span>
                      </Link>
                      <Link href="/de/payment" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                        <CreditCard className="h-4 w-4 text-slate-400" />
                        <span className="text-white">Zahlungsmethoden</span>
                      </Link>
                      <Link href="/de/settings" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                        <Settings className="h-4 w-4 text-slate-400" />
                        <span className="text-white">Einstellungen</span>
                      </Link>
                      <Link href="/de/help" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                        <HelpCircle className="h-4 w-4 text-slate-400" />
                        <span className="text-white">Hilfe</span>
                      </Link>
                      <div className="border-t border-slate-700 pt-2">
                        <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors w-full">
                          <LogOut className="h-4 w-4 text-slate-400" />
                          <span className="text-white">Abmelden</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between h-16">
          {/* Mobile Logo */}
          <Link href="/de" className="flex-shrink-0">
            <Image
              src="/fulllogo_transparent_nobuffer.png"
              alt="Gemilike"
              width={150}
              height={45}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-blue-400 transition-colors">
              <Search className="h-6 w-6" />
            </button>
            <Link href="/de/wishlist" className="relative text-white hover:text-purple-400 transition-colors">
              <Heart className="h-6 w-6" />
              {isHydrated && getWishlistItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getWishlistItems()}
                </span>
              )}
            </Link>
            <button
              onClick={openCart}
              className="relative text-white hover:text-blue-400 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {isHydrated && getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-900/95 backdrop-blur-sm border-t border-slate-800">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Edelsteine suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              </form>

              {/* Mobile Navigation - ALLE LINKS HORIZONTAL */}
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-3 text-white hover:text-blue-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-slate-700 space-y-2">
                <Link href="/de/profile" className="flex items-center space-x-3 py-2 text-white hover:text-blue-400 transition-colors">
                  <User className="h-5 w-5" />
                  <span>Profil</span>
                </Link>
                <Link href="/de/orders" className="flex items-center space-x-3 py-2 text-white hover:text-blue-400 transition-colors">
                  <Package className="h-5 w-5" />
                  <span>Bestellungen</span>
                </Link>
                <Link href="/de/settings" className="flex items-center space-x-3 py-2 text-white hover:text-blue-400 transition-colors">
                  <Settings className="h-5 w-5" />
                  <span>Einstellungen</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}