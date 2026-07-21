import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MediaGallery } from '@/components/shop/MediaGallery';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { WishlistButton } from '@/components/cart/WishlistButton';
import { ReviewsDisplay } from '@/components/shop/ReviewsDisplay';
import { ReviewForm } from '@/components/shop/ReviewForm';
import { getPrismaConnectionErrorSummary, isPrismaConnectionError } from '@/lib/prisma';
import { loadShopGemstoneById } from '@/lib/shop/shopData';
import { findSimilarGemstones, GEMSTONE_PLACEHOLDER_IMAGE } from '@/lib/services/shop/gemstone.service';
import navStyles from '@/components/layout/HeaderNav.module.css';
import { cn } from '@/lib/utils';

const formatWeight = (weight?: number | null, unit?: 'ct' | 'g', type?: 'cut' | 'rough') => {
  if (typeof weight !== 'number' || !Number.isFinite(weight)) return null;
  const resolvedUnit = unit ?? (type === 'rough' ? 'g' : 'ct');
  const formatted = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: weight % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(weight);
  return `${formatted} ${resolvedUnit}`;
};

const formatDimension = (value?: number | null) =>
  value != null ? `${Number(value).toFixed(1)} mm` : null;

interface GemstoneDetailPageProps {
  params: Promise<{
    locale: string;
    gemId: string;
  }>;
}

const formatCurrency = (value: number, currency = 'EUR') =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);

export async function generateMetadata({ params }: GemstoneDetailPageProps): Promise<Metadata> {
  const { gemId } = await params;
  const gemstone = await loadShopGemstoneById(gemId);

  if (!gemstone) {
    return {
      title: 'Edelstein nicht gefunden – Gemilike',
      description: 'Der angeforderte Edelstein ist nicht mehr verfügbar.',
    };
  }

  const title = `${gemstone.name} – Edelstein im Detail | Gemilike`;
  const baseDescription =
    gemstone.shortDescription ??
    gemstone.description ??
    `Entdecken Sie ${gemstone.name} mit Herkunft, Gewicht und Zertifizierung.`;
  const description =
    baseDescription.length > 160 ? `${baseDescription.slice(0, 157)}…` : baseDescription;
  const previewImage = gemstone.images[0] ?? GEMSTONE_PLACEHOLDER_IMAGE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: previewImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [previewImage],
    },
  };
}

export default async function GemstoneDetailPage({ params }: GemstoneDetailPageProps) {
  const { gemId, locale } = await params;
  const [gemstone, similarGemstones] = await Promise.all([
    loadShopGemstoneById(gemId),
    findSimilarGemstones(gemId, 4).catch((error) => {
      if (isPrismaConnectionError(error)) {
        console.warn(
          `Similar gemstones unavailable for ${gemId}: ${getPrismaConnectionErrorSummary(error)}`
        );
        return [];
      }

      console.error(`Similar gemstones unavailable for ${gemId}.`, error);
      return [];
    }),
  ]);

  if (!gemstone) {
    notFound();
  }

  const cartItem = {
    id: gemstone.id,
    name: gemstone.name,
    price: gemstone.price,
    currency: gemstone.currency ?? 'EUR',
    image: gemstone.images[0],
    category: gemstone.category,
    weight: typeof gemstone.weight === 'number' ? gemstone.weight : undefined,
    weightUnit: gemstone.weightUnit,
    origin: gemstone.origin ?? undefined,
  };

  const weightLabel = formatWeight(gemstone.weight, gemstone.weightUnit, gemstone.type);
  const detailBlocks = ([
    {
      title: 'Preis',
      content: formatCurrency(gemstone.price, gemstone.currency ?? 'EUR'),
    },
    {
      title: 'Bestand',
      content: `${gemstone.stock} Stück`,
    },
    weightLabel
      ? {
          title: 'Gewicht',
          content: weightLabel,
        }
      : null,
    gemstone.origin
      ? {
          title: 'Herkunft',
          content: gemstone.origin,
        }
      : null,
    formatDimension(gemstone.dimensions?.length)
      ? {
          title: 'Länge',
          content: formatDimension(gemstone.dimensions?.length),
        }
      : null,
    formatDimension(gemstone.dimensions?.width)
      ? {
          title: 'Breite',
          content: formatDimension(gemstone.dimensions?.width),
        }
      : null,
    formatDimension(gemstone.dimensions?.height)
      ? {
          title: 'Höhe',
          content: formatDimension(gemstone.dimensions?.height),
        }
      : null,
    gemstone.color
      ? {
          title: 'Farbe',
          content: gemstone.color,
        }
      : null,
    gemstone.colorSaturation
      ? {
          title: 'Farbsättigung',
          content: gemstone.colorSaturation,
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
    gemstone.cutForm
      ? {
          title: 'Schliffform',
          content: gemstone.cutForm,
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
        <div className="gem-card !m-0 !rounded-3xl relative shadow-2xl">
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-6 top-6 h-10 w-10 rounded-full border border-white/10 public-page-bg/50 text-white transition hover:bg-gray-700/30/15"
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
                      {gemstone.isSold && <Badge variant="destructive">Verkauft</Badge>}
                      {!gemstone.isSold && !gemstone.inStock && (
                        <Badge variant="destructive">Nicht verfügbar</Badge>
                      )}
                      {gemstone.rarity && (
                        <Badge className="bg-purple-600/20 text-purple-200 border-purple-500/40">
                          {gemstone.rarity}
                        </Badge>
                      )}
                    </div>
                  </div>

                </div>

                <MediaGallery
                  images={gemstone.images.length ? gemstone.images : [GEMSTONE_PLACEHOLDER_IMAGE]}
                  videos={gemstone.videos}
                  gemName={gemstone.name}
                  className="rounded-xl"
                  inStock={gemstone.inStock && !gemstone.isSold}
                  certification={
                    gemstone.certification
                      ? { certified: true, lab: gemstone.certification }
                      : undefined
                  }
                  treatment={gemstone.treatment}
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
                  <AddToCartButton
                    item={cartItem}
                    disabled={!gemstone.inStock || gemstone.isSold}
                  />
                  <WishlistButton item={cartItem} className="border border-white/10" />
                  <Link
                    href={`/${locale}/shop`}
                    className={cn(navStyles.navButton, navStyles.navButtonTight, 'px-4 py-2')}
                  >
                    <span className={navStyles.navLabel}>Weitere Edelsteine ansehen</span>
                    <span className={navStyles.navGlow} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12 space-y-8">
            {similarGemstones.length > 0 && (
              <section className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">Aehnliche Edelsteine</h2>
                  <p className="text-sm text-white/70">
                    Vorschlaege auf Basis von Kategorie, Merkmalen und semantischer Aehnlichkeit.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {similarGemstones.map((similarGem) => (
                    <Link
                      key={similarGem.id}
                      href={`/${locale}/shop/${similarGem.id}`}
                      className="rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:border-white/20 hover:bg-white/10"
                    >
                      <div
                        className="mb-3 h-40 rounded-xl bg-black/20"
                        style={{
                          backgroundImage: `url('${similarGem.images[0] ?? GEMSTONE_PLACEHOLDER_IMAGE}')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <div className="space-y-1">
                        <p className="line-clamp-2 text-sm font-semibold text-white">
                          {similarGem.name}
                        </p>
                        <p className="text-xs text-white/60">{similarGem.category}</p>
                        <p className="text-sm text-white/85">
                          {formatCurrency(similarGem.price, similarGem.currency ?? 'EUR')}
                        </p>
                        <p className="text-xs text-white/50">
                          Relevanz {Math.max(1, Math.min(99, Math.round(similarGem.similarity * 100)))}%
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <ReviewsDisplay gemstoneId={gemId} verifiedOnly={false} />
            <ReviewForm gemstoneId={gemId} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg bg-gray-800/60 border border-white/20 p-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-white/70">{title}:</span>
        <span className="text-sm text-white font-medium">{children}</span>
      </div>
    </div>
  );
}
