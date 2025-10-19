'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { MenuIcon, SearchIcon, ShoppingCartIcon, UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { Cart } from '@/components/cart/Cart';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { toggleCart, getTotalItems } = useCartStore();

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Gemilike - Heroes in Gems"
              width={160}
              height={64}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation - HORIZONTAL */}
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <Link 
              href="/" 
              className="text-foreground hover:text-primary transition-colors text-sm lg:text-base font-medium whitespace-nowrap"
            >
              Startseite
            </Link>
            <Link 
              href="/shop" 
              className="text-foreground hover:text-primary transition-colors text-sm lg:text-base font-medium whitespace-nowrap"
            >
              Shop
            </Link>
            <Link 
              href="/blog" 
              className="text-foreground hover:text-primary transition-colors text-sm lg:text-base font-medium whitespace-nowrap"
            >
              Blog
            </Link>
            <Link 
              href="/about" 
              className="text-foreground hover:text-primary transition-colors text-sm lg:text-base font-medium whitespace-nowrap"
            >
              Über uns
            </Link>
            <Link 
              href="/contact" 
              className="text-foreground hover:text-primary transition-colors text-sm lg:text-base font-medium whitespace-nowrap"
            >
              Kontakt
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
            {/* Action Buttons */}
            <Button variant="outline" size="icon" className="h-9 w-9">
              <UserIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleCart}
              className="relative h-9 w-9"
            >
              <ShoppingCartIcon className="h-4 w-4" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="hidden items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleCart}
              className="relative"
            >
              <ShoppingCartIcon className="h-4 w-4" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <nav className="flex flex-col gap-4 mt-6">
                  <Link href="/" className="text-foreground hover:text-primary text-lg">
                    Startseite
                  </Link>
                  <Link href="/shop" className="text-foreground hover:text-primary text-lg">
                    Shop
                  </Link>
                  <Link href="/blog" className="text-foreground hover:text-primary text-lg">
                    Blog
                  </Link>
                  <Link href="/about" className="text-foreground hover:text-primary text-lg">
                    Über uns
                  </Link>
                  <Link href="/contact" className="text-foreground hover:text-primary text-lg">
                    Kontakt
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <Cart />
    </header>
  );
}
