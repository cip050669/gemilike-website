'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';

export default function CartPage() {
  const t = useTranslations('shop');
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
            <span className="gradient-text animate-glow">{t('cart')}</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {t('emptyCart')}
          </p>
          <Button asChild>
            <a href="/de/shop">{t('goToShop')}</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
          <span className="gradient-text animate-glow">{t('cart')}</span>
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 bg-muted rounded-md flex-shrink-0"></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-2xl font-bold text-primary mt-2">
                        €{item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>{t('summary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('subtotal')}</span>
                  <span>€{total().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('shipping')}</span>
                  <span>{t('free')}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>{t('total')}</span>
                    <span className="text-primary">€{total().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button className="w-full" size="lg">
                  {t('checkout')}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={clearCart}
                >
                  {t('clearCart')}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
