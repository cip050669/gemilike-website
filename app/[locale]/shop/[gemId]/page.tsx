import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MediaGallery } from '@/components/shop/MediaGallery';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { WishlistButton } from '@/components/cart/WishlistButton';
import { loadShopGemstoneById, PLACEHOLDER_IMAGE } from '@/lib/shop/shopData';

interface GemstoneDetailPageProps {
  params: {
    locale: string;
    gemId: string;
  };
}

const formatCurrency = (value: number) =>
  `€${value.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`;

export default async function GemstoneDetailPage({ params }: GemstoneDetailPageProps) {
  const { gemId, locale } = params;
  const { gemstone, fallback } = await loadShopGemstoneById(gemId);

  if (!gemstone) {
    notFound();
  }

  const cartItem = {
    id: gemstone.id,
    name: gemstone.name,
    price: gemstone.price,
    image: gemstone.images[0],
    category: gemstone.category,
    weight: typeof gemstone.weight === 'number' ? gemstone.weight : undefined,
    origin: gemstone.origin ?? undefined,
  };

  const detailBlocks = ([
    {
      title: 'Preis',
      content: formatCurrency(gemstone.price),
    },
    {
      title: 'Bestand',
      content: `${gemstone.stock} Stück`,
    },
    typeof gemstone.weight === 'number'
      ? {
          title: 'Gewicht',
          content: `${gemstone.weight.toFixed(2)} ${gemstone.weightUnit ?? 'ct'}`,
        }
      : null,
    gemstone.origin
      ? {
          title: 'Herkunft',
          content: gemstone.origin,
        }
      : null,
    gemstone.color
      ? {
          title: 'Farbe',
          content: gemstone.color,
        }
      : null,
    gemstone.clarity
      ? {
          title: 'Klarheit',
          content: gemstone.clarity,
        }
      : null,
    gemstone.cut
      ? {
          title: 'Schliff',
          content: gemstone.cut,
        }
      : null,
    gemstone.treatment
      ? {
          title: 'Behandlung',
          content: gemstone.treatment,
        }
      : null,
    gemstone.certification
      ? {
          title: 'Zertifizierung',
          content: gemstone.certification,
        }
      : null,
    gemstone.rarity
      ? {
          title: 'Seltenheit',
          content: gemstone.rarity,
        }
      : null,
  ] as Array<{ title: string; content: ReactNode } | null>).filter(
    (block): block is { title: string; content: ReactNode } => block !== null
  );

  return (
    <div className="min-h-screen public-page-bg/80 px-4 py-12 text-white backdrop-blur-md flex items-center justify-center overflow-y-auto">
      <div className="relative w-full sm:w-auto max-w-4xl">
        <div className="main-container !m-0 !rounded-3xl !border-white/10 !bg-[#2D2D2DDF] relative shadow-2xl">
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-6 top-6 h-10 w-10 rounded-full border border-white/10 public-page-bg/50 text-white transition hover:bg-gray-800/30/15"
            asChild
          >
            <Link href={`/${locale}/shop`} aria-label="Detailansicht schließen">
              <X className="h-5 w-5" />
            </Link>
          </Button>

          <div className="max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
            <div className="grid gap-8 pt-2 md:pt-4 lg:grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-impact font-weight-impact text-white md:text-4xl">
                      {gemstone.name}
                    </h1>
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-white/55">
                      <Badge variant="secondary">{gemstone.category}</Badge>
                      <Badge variant="outline">
                        {gemstone.type === 'cut' ? 'Geschliffener Stein' : 'Rohstein'}
                      </Badge>
                      {gemstone.isNew && <Badge variant="accent">Neu</Badge>}
                      {!gemstone.inStock && <Badge variant="destructive">Nicht verfügbar</Badge>}
                    </div>
                  </div>

                  {fallback && (
                    <div className="rounded-lg border border-yellow-400/30 bg-yellow-500/10 p-4 text-sm text-yellow-100">
                      Hinweis: Temporäre Beispiel-Daten, da aktuell keine Datenbankverbindung möglich war.
                    </div>
                  )}
                </div>

                <MediaGallery
                  images={gemstone.images.length ? gemstone.images : [PLACEHOLDER_IMAGE]}
                  videos={gemstone.videos}
                  gemName={gemstone.name}
                  className="rounded-xl"
                  inStock={gemstone.inStock}
                />
              </div>

              <div className="flex flex-col gap-8">
                {gemstone.description && (
                  <section className="space-y-3 text-sm text-white/80">
                    <h2 className="text-lg font-semibold text-white">Beschreibung</h2>
                    <p className="leading-relaxed">{gemstone.description}</p>
                  </section>
                )}

                <section className="grid gap-4 sm:grid-cols-2">
                  {detailBlocks.map((block) => (
                    <DetailBlock key={block.title} title={block.title}>
                      {block.content}
                    </DetailBlock>
                  ))}
                </section>

                <div className="flex flex-wrap items-center gap-4">
                  <AddToCartButton item={cartItem} />
                  <WishlistButton item={cartItem} />
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-gray-800/30/10"
                    asChild
                  >
                    <Link href={`/${locale}/shop`}>Weitere Edelsteine ansehen</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 public-page-bg/40 p-4">
      <p className="text-xs uppercase tracking-wide text-white/45">{title}</p>
      <p className="mt-2 text-sm text-white/90 leading-relaxed">{children}</p>
    </div>
  );
}
