'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  Truck, 
  Warehouse as WarehouseIcon, 
  TrendingUp, 
  Plus,
  Search,
  Edit,
  DollarSign,
  Activity,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Supplier {
  id: string;
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  _count: {
    purchaseOrders: number;
  };
}

interface Warehouse {
  id: string;
  name: string;
  code: string;
  city?: string;
  isActive: boolean;
  isDefault: boolean;
}

interface WarehouseStats {
  suppliers: {
    total: number;
    active: number;
    inactive: number;
  };
  warehouses: {
    total: number;
    active: number;
    inactive: number;
  };
  purchaseOrders: {
    total: number;
    pending: number;
    received: number;
    totalAmount: number;
    statusDistribution: {
      draft: number;
      pending: number;
      confirmed: number;
      partiallyReceived: number;
      received: number;
      cancelled: number;
    };
  };
  stockMovements: {
    total: number;
    byType: {
      in: number;
      out: number;
      transfer: number;
      adjustment: number;
      return: number;
      damage: number;
      loss: number;
    };
    recent: Array<{
      id: string;
      type: string;
      quantity: number;
      gemstone: string;
      warehouse: string;
      createdAt: string;
    }>;
  };
  lowStockItems: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
  topSuppliers: Array<{
    id: string;
    name: string;
    companyName?: string;
    orderCount: number;
  }>;
}

export default function WarehouseManagementPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stats, setStats] = useState<WarehouseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [suppliersRes, warehousesRes, statsRes] = await Promise.all([
        fetch('/api/admin/suppliers'),
        fetch('/api/admin/warehouses'),
        fetch('/api/admin/warehouse/stats'),
      ]);

      if (suppliersRes.ok) {
        const suppliersData = await suppliersRes.json();
        setSuppliers(suppliersData);
      }

      if (warehousesRes.ok) {
        const warehousesData = await warehousesRes.json();
        setWarehouses(warehousesData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Warenwirtschaftssystem</h1>
          <p className="text-muted-foreground mt-2">
            Verwaltung von Lieferanten, Lagern, Bestellungen und Beständen
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lieferanten</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.suppliers.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.suppliers.active} aktiv, {stats.suppliers.inactive} inaktiv
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lagerorte</CardTitle>
              <WarehouseIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.warehouses.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.warehouses.active} aktiv, {stats.warehouses.inactive} inaktiv
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Einkaufsbestellungen</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.purchaseOrders.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.purchaseOrders.pending} ausstehend
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamtumsatz</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('de-DE', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(stats.purchaseOrders.totalAmount)}
              </div>
              <p className="text-xs text-muted-foreground">
                Alle Bestellungen
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/de/admin/warehouse/suppliers">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Lieferanten
              </CardTitle>
              <CardDescription>
                {suppliers.length} {suppliers.length === 1 ? 'Lieferant' : 'Lieferanten'}
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/de/admin/warehouse/warehouses">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WarehouseIcon className="h-5 w-5" />
                Lagerorte
              </CardTitle>
              <CardDescription>
                {warehouses.length} {warehouses.length === 1 ? 'Lagerort' : 'Lagerorte'}
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/de/admin/warehouse/purchase-orders">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Einkaufsbestellungen
              </CardTitle>
              <CardDescription>Bestellungen verwalten</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/de/admin/warehouse/stock">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Bestandsübersicht
              </CardTitle>
              <CardDescription>Lagerbewegungen & Reservierungen</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lieferanten Übersicht */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lieferanten</CardTitle>
              <Link href="/de/admin/warehouse/suppliers/new">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Neu
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Lieferanten suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              {filteredSuppliers.slice(0, 5).map((supplier) => (
                <div
                  key={supplier.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div>
                    <div className="font-medium">{supplier.name}</div>
                    {supplier.companyName && (
                      <div className="text-sm text-muted-foreground">
                        {supplier.companyName}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {supplier._count.purchaseOrders} Bestellungen
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {supplier.isActive ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Aktiv
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Inaktiv
                      </span>
                    )}
                    <Link href={`/de/admin/warehouse/suppliers/${supplier.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {filteredSuppliers.length > 5 && (
              <div className="mt-4 text-center">
                <Link href="/de/admin/warehouse/suppliers">
                  <Button variant="outline" size="sm">
                    Alle anzeigen ({filteredSuppliers.length})
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lagerorte Übersicht */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lagerorte</CardTitle>
              <Link href="/de/admin/warehouse/warehouses/new">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Neu
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {warehouses.slice(0, 5).map((warehouse) => (
                <div
                  key={warehouse.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div>
                    <div className="font-medium">{warehouse.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Code: {warehouse.code}
                      {warehouse.city && ` • ${warehouse.city}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {warehouse.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Standard
                      </span>
                    )}
                    {warehouse.isActive ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Aktiv
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Inaktiv
                      </span>
                    )}
                    <Link href={`/de/admin/warehouse/warehouses/${warehouse.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {warehouses.length > 5 && (
              <div className="mt-4 text-center">
                <Link href="/de/admin/warehouse/warehouses">
                  <Button variant="outline" size="sm">
                    Alle anzeigen ({warehouses.length})
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistics & Analytics */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bestellungen Status-Verteilung */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Bestellungen nach Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Entwurf</span>
                  <Badge variant="secondary">{stats.purchaseOrders.statusDistribution.draft}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ausstehend</span>
                  <Badge variant="outline">{stats.purchaseOrders.statusDistribution.pending}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bestätigt</span>
                  <Badge variant="default">{stats.purchaseOrders.statusDistribution.confirmed}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Teilweise erhalten</span>
                  <Badge variant="outline">{stats.purchaseOrders.statusDistribution.partiallyReceived}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Erhalten</span>
                  <Badge className="bg-green-500">{stats.purchaseOrders.statusDistribution.received}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Storniert</span>
                  <Badge variant="destructive">{stats.purchaseOrders.statusDistribution.cancelled}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lagerbewegungen nach Typ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Lagerbewegungen nach Typ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Wareneingang</span>
                  <Badge className="bg-green-500">{stats.stockMovements.byType.in}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Warenausgang</span>
                  <Badge className="bg-red-500">{stats.stockMovements.byType.out}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Umlagerung</span>
                  <Badge className="bg-blue-500">{stats.stockMovements.byType.transfer}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Korrektur</span>
                  <Badge className="bg-yellow-500">{stats.stockMovements.byType.adjustment}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rücksendung</span>
                  <Badge className="bg-purple-500">{stats.stockMovements.byType.return}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Beschädigung</span>
                  <Badge className="bg-orange-500">{stats.stockMovements.byType.damage}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Verlust</span>
                  <Badge className="bg-gray-500">{stats.stockMovements.byType.loss}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Lieferanten */}
          {stats.topSuppliers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Lieferanten</CardTitle>
                <CardDescription>Nach Anzahl Bestellungen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.topSuppliers.map((supplier) => (
                    <div
                      key={supplier.id}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-sm">{supplier.name}</div>
                        {supplier.companyName && (
                          <div className="text-xs text-muted-foreground">
                            {supplier.companyName}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline">{supplier.orderCount}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Niedrige Bestände */}
          {stats.lowStockItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Niedrige Bestände
                </CardTitle>
                <CardDescription>Produkte mit Bestand ≤ 10</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div className="font-medium text-sm">{item.name}</div>
                      <Badge variant="destructive">{item.quantity}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Letzte Lagerbewegungen */}
          {stats.stockMovements.recent.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Letzte Lagerbewegungen</CardTitle>
                <CardDescription>Die 10 neuesten Bewegungen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.stockMovements.recent.map((movement) => (
                    <div
                      key={movement.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              movement.type === 'IN'
                                ? 'bg-green-500'
                                : movement.type === 'OUT'
                                ? 'bg-red-500'
                                : 'bg-blue-500'
                            }
                          >
                            {movement.type}
                          </Badge>
                          <span className="font-medium">{movement.gemstone}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Menge: {movement.quantity} • Lager: {movement.warehouse} •{' '}
                          {new Date(movement.createdAt).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

