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
    <header className="bg-background/95 backdrop-blur-sm border-b border-border fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Gemilike - Heroes in Gems"
              width={160}
              height={64}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Startseite
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              Über uns
            </Link>
            <Link href="/shop" className="text-foreground hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              Kontakt
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Edelsteine suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <UserIcon className="h-4 w-4" />
              </Button>
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
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <nav className="flex flex-col gap-4 mt-6">
                  <Link href="/" className="text-foreground hover:text-primary">
                    Startseite
                  </Link>
                  <Link href="/about" className="text-foreground hover:text-primary">
                    Über uns
                  </Link>
                  <Link href="/shop" className="text-foreground hover:text-primary">
                    Shop
                  </Link>
                  <Link href="/contact" className="text-foreground hover:text-primary">
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