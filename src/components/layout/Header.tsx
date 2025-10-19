'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, User } from 'lucide-react';
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
  { name: 'Über uns', href: '/de/about' },
  { name: 'Leistungen', href: '/de/services' },
  { name: 'Blog', href: '/de/blog' },
  { name: 'Kontakt', href: '/de/contact' },
];

export default function Header({ className }: HeaderProps): React.JSX.Element {
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const { getTotalItems, openCart } = useCartStore();
  const { getTotalItems: getWishlistItems } = useWishlistStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-black h-32 ${className || ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 h-full items-center">
          {/* Logo - 2 Spalten */}
          <div className="col-span-2">
            <Link href="/de" className="block">
              <Image
                src="/fulllogo_transparent_nobuffer.png"
                alt="Gemilike"
                width={200}
                height={60}
                className="h-16 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Navigation - 8 Spalten */}
          <nav className="col-span-8 grid grid-cols-6 gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-blue-400 text-center text-base font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions - 2 Spalten */}
          <div className="col-span-2 flex justify-end space-x-4">
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

            <Link 
              href="/de/profile" 
              className="text-white hover:text-blue-400 transition-colors"
              aria-label="Benutzerprofil"
            >
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
