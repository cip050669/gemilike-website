import { Metadata } from 'next';
import { Suspense } from 'react';
import ProductGrid from '../../../components/shop/ProductGrid';
import ProductFilters from '../../../components/shop/ProductFilters';
import { gemstones } from '../../../lib/data/gemstones';

export const metadata: Metadata = {
  title: 'Shop - Gemilike',
  description: 'Entdecken Sie unsere exklusiven Edelsteine im Shop',
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    price?: string;
    sort?: string;
    search?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps): Promise<JSX.Element> {
  const params = await searchParams;
  
  return (
    <div className="min-h-screen bg-black">
      <div className="container-responsive py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display mb-6 gemilike-text-gradient">
              Edelstein Shop
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
              Entdecken Sie unsere handverlesene Kollektion exklusiver Edelsteine von höchster Qualität
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters */}
            <div className="lg:col-span-1">
              <Suspense fallback={<div className="animate-pulse h-64 bg-slate-800 rounded-lg"></div>}>
                <ProductFilters />
              </Suspense>
            </div>

            {/* Products */}
            <div className="lg:col-span-3">
              <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-64 bg-slate-800 rounded-lg mb-4"></div>
                      <div className="h-4 bg-slate-800 rounded mb-2"></div>
                      <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              }>
                <ProductGrid 
                  products={gemstones}
                  filters={params}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
