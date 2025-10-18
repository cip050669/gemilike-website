import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GemIcon, HeartIcon, ShoppingCartIcon } from 'lucide-react';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { WishlistButton } from '@/components/cart/WishlistButton';

// Mock-Daten für Edelsteine
const gemstones = [
  {
    id: '1',
    name: 'Brillant Diamant',
    price: 2500,
    category: 'Diamant',
    weight: 1.5,
    origin: 'Südafrika',
    image: '/products/diamond.jpg',
    description: 'Brillant geschliffener Diamant in höchster Qualität',
    treatment: 'Unbehandelt',
    clarity: 'VS1',
    color: 'D'
  },
  {
    id: '2',
    name: 'Smaragd',
    price: 1800,
    category: 'Smaragd',
    weight: 2.0,
    origin: 'Kolumbien',
    image: '/products/emerald.jpg',
    description: 'Natürlicher Smaragd mit intensiver grüner Farbe',
    treatment: 'Geölt',
    clarity: 'VS2',
    color: 'G'
  },
  {
    id: '3',
    name: 'Rubin',
    price: 3200,
    category: 'Rubin',
    weight: 1.8,
    origin: 'Myanmar',
    image: '/products/ruby.jpg',
    description: 'Feuerroter Rubin von außergewöhnlicher Klarheit',
    treatment: 'Erhitzt',
    clarity: 'VVS1',
    color: 'R'
  },
  {
    id: '4',
    name: 'Saphir',
    price: 2200,
    category: 'Saphir',
    weight: 2.2,
    origin: 'Sri Lanka',
    image: '/products/sapphire.jpg',
    description: 'Kornblumenblauer Saphir von seltener Schönheit',
    treatment: 'Unbehandelt',
    clarity: 'VS1',
    color: 'B'
  },
  {
    id: '5',
    name: 'Amethyst',
    price: 450,
    category: 'Amethyst',
    weight: 3.5,
    origin: 'Brasilien',
    image: '/products/amethyst.jpg',
    description: 'Tiefvioletter Amethyst in Tropfenform',
    treatment: 'Unbehandelt',
    clarity: 'VS2',
    color: 'V'
  },
  {
    id: '6',
    name: 'Citrin',
    price: 280,
    category: 'Citrin',
    weight: 4.0,
    origin: 'Brasilien',
    image: '/products/citrine.jpg',
    description: 'Sonnenfarbener Citrin mit warmem Glanz',
    treatment: 'Erhitzt',
    clarity: 'VS1',
    color: 'Y'
  }
];

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="gemilike-text-gradient text-4xl font-bold mb-4">Edelstein-Shop</h1>
          <p className="text-lg text-muted-foreground">
            Entdecken Sie unsere exquisite Auswahl an rohen und geschliffenen Edelsteinen
          </p>
        </div>

        {/* Filter und Sortierung */}
        <div className="mb-8 flex flex-wrap gap-4">
          <select className="px-4 py-2 border border-input rounded-md bg-background text-foreground">
            <option>Alle Kategorien</option>
            <option>Diamant</option>
            <option>Smaragd</option>
            <option>Rubin</option>
            <option>Saphir</option>
            <option>Amethyst</option>
            <option>Citrin</option>
          </select>
          <select className="px-4 py-2 border border-input rounded-md bg-background text-foreground">
            <option>Preis: Niedrig zu Hoch</option>
            <option>Preis: Hoch zu Niedrig</option>
            <option>Name: A-Z</option>
            <option>Name: Z-A</option>
          </select>
        </div>

        {/* Produktgrid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gemstones.map((gemstone) => (
            <Card key={gemstone.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <GemIcon className="h-24 w-24 text-primary" />
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{gemstone.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {gemstone.category} • {gemstone.weight}ct • {gemstone.origin}
                    </CardDescription>
                  </div>
                  <WishlistButton item={gemstone} />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  {gemstone.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{gemstone.treatment}</Badge>
                  <Badge variant="outline">{gemstone.clarity}</Badge>
                  <Badge variant="outline">{gemstone.color}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      €{gemstone.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      pro Stück
                    </span>
                  </div>
                  <AddToCartButton item={gemstone} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 text-center">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Verpassen Sie keine Neuigkeiten</h2>
            <p className="text-muted-foreground mb-6">
              Abonnieren Sie unseren Newsletter und erhalten Sie exklusive Angebote für neue Edelsteine
            </p>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Ihre E-Mail-Adresse"
                className="flex-1 px-4 py-3 border border-input rounded-md bg-background text-foreground"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3">
                Abonnieren
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}