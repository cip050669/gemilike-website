'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, Package, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

interface StockMovement {
  id: string;
  movementType: string;
  quantity: number;
  createdAt: string;
  notes?: string;
  gemstone: {
    id: string;
    name: string;
  };
  warehouse?: {
    id: string;
    name: string;
    code: string;
  };
}

interface GemstoneInventory {
  id: string;
  quantity: number;
  gemstone: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function StockOverviewPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [inventory, setInventory] = useState<GemstoneInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [movementTypeFilter, setMovementTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movementTypeFilter]);

  const fetchData = async () => {
    try {
      const [movementsRes, inventoryRes] = await Promise.all([
        fetch(movementTypeFilter !== 'all' 
          ? `/api/admin/stock-movements?movementType=${movementTypeFilter}&limit=50`
          : '/api/admin/stock-movements?limit=50'
        ),
        fetch('/api/admin/gemstones?includeInventory=true'),
      ]);

      if (movementsRes.ok) {
        const movementsData = await movementsRes.json();
        setMovements(movementsData);
      }

      if (inventoryRes.ok) {
        const inventoryData = await inventoryRes.json();
        // Filter inventory items with quantity > 0 or show all
        setInventory((inventoryData.filter((item: { inventory?: { quantity: number } }) => 
          item.inventory && item.inventory.quantity > 0
        ) || []) as GemstoneInventory[]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMovementTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      IN: 'Wareneingang',
      OUT: 'Warenausgang',
      TRANSFER: 'Umlagerung',
      ADJUSTMENT: 'Korrektur',
      RETURN: 'Rücksendung',
      DAMAGE: 'Beschädigung',
      LOSS: 'Verlust',
    };
    return labels[type] || type;
  };

  const getMovementTypeBadge = (type: string) => {
    const colorMap: Record<string, string> = {
      IN: 'bg-green-500',
      OUT: 'bg-red-500',
      TRANSFER: 'bg-blue-500',
      ADJUSTMENT: 'bg-yellow-500',
      RETURN: 'bg-purple-500',
      DAMAGE: 'bg-orange-500',
      LOSS: 'bg-gray-500',
    };
    return (
      <Badge className={colorMap[type] || 'bg-gray-500'}>
        {getMovementTypeLabel(type)}
      </Badge>
    );
  };

  const filteredMovements = movements.filter(movement =>
    movement.gemstone.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter inventory items with quantity > 0
  const filteredInventory = inventory.filter((item: GemstoneInventory) => 
    item.gemstone.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Laden...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bestandsübersicht</h1>
        <p className="text-muted-foreground mt-2">
          Übersicht über Lagerbestände und Bewegungen
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Produkte</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">
              Produkte mit Bestand
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lagerbewegungen</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movements.length}</div>
            <p className="text-xs text-muted-foreground">
              Letzte 50 Bewegungen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamtbestand</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Gesamte Einheiten
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Produkte suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={movementTypeFilter} onValueChange={setMovementTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Typen</SelectItem>
                <SelectItem value="IN">Wareneingang</SelectItem>
                <SelectItem value="OUT">Warenausgang</SelectItem>
                <SelectItem value="TRANSFER">Umlagerung</SelectItem>
                <SelectItem value="ADJUSTMENT">Korrektur</SelectItem>
                <SelectItem value="RETURN">Rücksendung</SelectItem>
                <SelectItem value="DAMAGE">Beschädigung</SelectItem>
                <SelectItem value="LOSS">Verlust</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Recent Movements */}
      <Card>
        <CardHeader>
          <CardTitle>Letzte Lagerbewegungen</CardTitle>
          <CardDescription>
            Übersicht der letzten Lagerbewegungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMovements.slice(0, 20).map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {getMovementTypeBadge(movement.movementType)}
                    <span className="font-medium">{movement.gemstone.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Menge: {movement.quantity}
                    {movement.warehouse && ` • Lager: ${movement.warehouse.name} (${movement.warehouse.code})`}
                    {movement.notes && ` • ${movement.notes}`}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(movement.createdAt).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
          </div>
          {filteredMovements.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Keine Lagerbewegungen gefunden
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inventory Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Bestandsübersicht</CardTitle>
          <CardDescription>
            Produkte mit aktuellem Lagerbestand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredInventory
              .slice(0, 20)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div>
                    <div className="font-medium">{item.gemstone.name}</div>
                    <Link 
                      href={`/de/admin/gemstones/edit/${item.gemstone.id}`}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      Bearbeiten
                    </Link>
                  </div>
                  <Badge variant="outline" className="text-lg">
                    {item.quantity} {item.quantity === 1 ? 'Einheit' : 'Einheiten'}
                  </Badge>
                </div>
              ))}
          </div>
          {inventory.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Keine Produkte mit Bestand gefunden
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

