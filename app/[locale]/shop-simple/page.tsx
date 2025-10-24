'use client';

import { useTranslations } from 'next-intl';
import { useCartStore } from '@/lib/store/cart';
import { useState, useEffect } from 'react';
import { GemstoneThumbnail } from '@/components/shop/GemstoneThumbnail';
import { GemstoneCardModal } from '@/components/shop/GemstoneCardModal';
import { SimpleShopFilters } from '@/components/shop/SimpleShopFilters';
import { SimpleSortOptions, SimpleSortOption, sortGemstones } from '@/components/shop/SimpleSortOptions';
import { Gemstone } from '@/lib/types/gemstone';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Grid, List, Search } from 'lucide-react';

export default function SimpleShopPage() {
  const t = useTranslations('shop');
  const addItem = useCartStore((state) => state.addItem);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
  const [filteredGemstones, setFilteredGemstones] = useState<Gemstone[]>([]);
  const [displayedGemstones, setDisplayedGemstones] = useState<Gemstone[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState<SimpleSortOption>('name-asc');
  const [modalGemstone, setModalGemstone] = useState<Gemstone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mounted, setMounted] = useState(false);

  // Function to load gemstones data
  const loadGemstones = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gemstones');
      if (response.ok) {
        const data = await response.json();
        setGemstones(data);
        setFilteredGemstones(data);
      } else {
        console.error('Failed to load gemstones');
      }
    } catch (error) {
      console.error('Error loading gemstones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadGemstones();
  }, []);

  // Sort and update displayed gemstones when filters or sort change
  useEffect(() => {
    const sorted = sortGemstones(filteredGemstones, sortOption);
    setDisplayedGemstones(sorted);
  }, [filteredGemstones, sortOption]);

  const handleAddToCart = (gemstone: Gemstone) => {
    addItem({
      id: gemstone.id,
      name: gemstone.name,
      price: gemstone.price,
      image: gemstone.mainImage,
    });
    setAddedItems(new Set(addedItems).add(gemstone.id));
    setTimeout(() => {
      setAddedItems((prev) => {
        const next = new Set(prev);
        next.delete(gemstone.id);
        return next;
      });
    }, 2000);
  };

  const handleFilter = (filtered: Gemstone[]) => {
    setFilteredGemstones(filtered);
  };

  const handleOpenModal = (gemstone: Gemstone) => {
    setModalGemstone(gemstone);
    setIsModalOpen(true);
  };

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edelstein-Shop</h1>
          <p className="text-muted-foreground">
            Entdecken Sie unsere exquisite Sammlung von rohen und geschliffenen Edelsteinen
          </p>
        </div>

        {/* Filter und Sortierung */}
        <div className="mb-6">
          <SimpleShopFilters
            gemstones={gemstones}
            onFilter={handleFilter}
          />
          
          {/* Sortierung und Ansicht */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {displayedGemstones.length} von {gemstones.length} Edelsteinen
              </span>
              {filteredGemstones.length !== gemstones.length && (
                <Badge variant="secondary">
                  Gefiltert
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <SimpleSortOptions 
                value={sortOption} 
                onValueChange={setSortOption}
              />
              
              {/* Ansichtsmodus */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Edelsteine werden geladen...</p>
            </div>
          </div>
        )}

        {/* Keine Ergebnisse */}
        {!loading && displayedGemstones.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Keine Edelsteine gefunden</h3>
            <p className="text-muted-foreground mb-4">
              Versuchen Sie, Ihre Suchkriterien zu ändern oder die Filter zurückzusetzen.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Alle Filter zurücksetzen
            </Button>
          </div>
        )}

        {/* Edelstein-Grid */}
        {!loading && displayedGemstones.length > 0 && (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {displayedGemstones.map((gemstone) => (
              <GemstoneThumbnail
                key={gemstone.id}
                gemstone={gemstone}
                onOpenCard={handleOpenModal}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        {modalGemstone && (
          <GemstoneCardModal
            gemstone={modalGemstone}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddToCart={handleAddToCart}
            isAdded={addedItems.has(modalGemstone.id)}
          />
        )}
      </div>
    </div>
  );
}

