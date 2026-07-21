'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { ShopGemstone } from '@/lib/services/shop/types';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { WishlistButton } from '@/components/cart/WishlistButton';
import { Badge } from '@/components/ui/badge';

interface NewGemstonesCarouselProps {
  gemstones: ShopGemstone[];
  locale: string;
  description?: string;
}

const PLACEHOLDER_IMAGE = '/products/placeholder-gem.jpg';

const formatPrice = (value: number, currency = 'EUR') =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);

const formatWeight = (gem: ShopGemstone) => {
  if (typeof gem.weight !== 'number' || !Number.isFinite(gem.weight)) return null;
  const unit = gem.weightUnit ?? (gem.type === 'rough' ? 'g' : 'ct');
  const formatted = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: gem.weight % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(gem.weight);
  return `${formatted} ${unit}`;
};

const toCartItem = (gem: ShopGemstone) => ({
  id: gem.id,
  name: gem.name,
  price: gem.price,
  currency: gem.currency ?? 'EUR',
  image: gem.images[0],
  category: gem.category,
  weight: typeof gem.weight === 'number' ? gem.weight : undefined,
  weightUnit: gem.weightUnit,
  origin: gem.origin ?? undefined,
});

// Separate Komponente für jedes Thumbnail mit schwarzer Schrift
function CarouselThumbnail({ gemstone, locale, priceLabel, weightLabel, cartItem }: {
  gemstone: ShopGemstone;
  locale: string;
  priceLabel: string;
  weightLabel: string | null;
  cartItem: ReturnType<typeof toCartItem>;
}) {
  return (
    <article
      key={gemstone.id}
      className="gem-card group flex min-w-[250px] max-w-[250px] snap-center flex-col gap-3 rounded-[18px] p-4 transition-all duration-300 text-white/40"
    >
      <Link
        href={`/${locale}/shop?gem=${gemstone.id}`}
        className="group relative block h-[230px] w-full overflow-hidden rounded-[18px]"
      >
        <Image
          src={gemstone.images[0] ?? PLACEHOLDER_IMAGE}
          alt={gemstone.name}
          fill
          sizes="(max-width: 768px) 50vw, 250px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        {gemstone.isSold && (
          <div className="absolute left-3 top-3">
            <Badge variant="destructive">Verkauft</Badge>
          </div>
        )}
        {gemstone.isNew && (
          <div className="absolute right-3 top-3">
            <Badge variant="accent">Neu</Badge>
          </div>
        )}
      </Link>

      <div className="space-y-3 text-sm text-white/40">
        <div className="space-y-1">
          <span
            className="text-[11px] uppercase tracking-[0.3em] !text-black"
            style={{ color: 'black' } as React.CSSProperties}
          >
            {gemstone.category}
          </span>
          <Link
            href={`/${locale}/shop?gem=${gemstone.id}`}
            className="block text-lg font-semibold !text-black line-clamp-2 transition-colors hover:!text-black"
            style={{ color: 'black' } as React.CSSProperties}
          >
            {gemstone.name}
          </Link>
        </div>
        <div className="space-y-1 text-xs text-white/28">
          <p>{priceLabel}</p>
          {weightLabel && <p>Gewicht {weightLabel}</p>}
          {gemstone.origin && <p>Herkunft {gemstone.origin}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <AddToCartButton
          item={cartItem}
          disabled={!gemstone.inStock || gemstone.isSold}
        />
        <WishlistButton item={cartItem} className="border border-white/10" />
      </div>
    </article>
  );
}

export function NewGemstonesCarousel({
  gemstones,
  locale,
  description,
}: NewGemstonesCarouselProps) {
  const t = useTranslations('home');
  const items = useMemo(() => gemstones ?? [], [gemstones]);

  return (
    <section className="main-container">
      <div className="story-card space-y-6">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl md:text-4xl font-impact font-weight-impact">
            <span className="gemilike-text-gradient">{t('newGemstonesTitle')}</span>
          </h2>
          {description && (
            <p className="mx-auto max-w-3xl text-base md:text-lg text-white/80">
              <span>{description}</span>
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60 text-base">
              {t('noNewGemstones')}
            </p>
          </div>
        ) : (
          <div
            className="flex gap-[6px] overflow-x-auto px-[6px]"
            style={{ scrollSnapType: 'x mandatory', paddingBottom: '10px' }}
          >
            {items.map((gemstone) => {
            const priceLabel = formatPrice(gemstone.price, gemstone.currency);
            const weightLabel = formatWeight(gemstone);
            const cartItem = toCartItem(gemstone);

            return (
              <CarouselThumbnail
                key={gemstone.id}
                gemstone={gemstone}
                locale={locale}
                priceLabel={priceLabel}
                weightLabel={weightLabel}
                cartItem={cartItem}
              />
            );
          })}
          </div>
        )}
      </div>
    </section>
  );
}
