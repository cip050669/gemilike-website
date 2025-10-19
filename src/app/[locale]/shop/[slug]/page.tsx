import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Heart, Share2, Star } from 'lucide-react';
import Link from 'next/link';
import ProductGallery from '../../../../components/shop/ProductGallery';
import ProductInfo from '../../../../components/shop/ProductInfo';
import ProductSpecifications from '../../../../components/shop/ProductSpecifications';
import RelatedProducts from '../../../../components/shop/RelatedProducts';
import { gemstones } from '../../../../lib/data/gemstones';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = gemstones.find(p => p.slug === slug);
  
  if (!product) {
    return {
      title: 'Produkt nicht gefunden - Gemilike',
    };
  }

  return {
    title: `${product.name} - Gemilike`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const product = gemstones.find(p => p.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = gemstones
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-black">
      <div className="container-responsive py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-8">
            <Link href="/de" className="hover:text-white transition-colors">
              Startseite
            </Link>
            <span>/</span>
            <Link href="/de/shop" className="hover:text-white transition-colors">
              Shop
            </Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </nav>

          {/* Back Button */}
          <Link 
            href="/de/shop"
            className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zum Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Gallery */}
            <div>
              <ProductGallery
                images={product.images || [product.imageUrl]}
                videos={product.videoUrl ? [product.videoUrl] : []}
                productName={product.name}
              />
            </div>

            {/* Product Info */}
            <div>
              <ProductInfo product={product} />
            </div>
          </div>

          {/* Product Specifications */}
          <div className="mt-16">
            <ProductSpecifications product={product} />
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <RelatedProducts products={relatedProducts} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
