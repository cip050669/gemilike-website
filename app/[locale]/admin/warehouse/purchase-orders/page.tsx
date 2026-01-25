'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Package, Calendar, Euro } from 'lucide-react';

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  status: string;
  orderDate: string;
  expectedDate?: string;
  totalAmount: number;
  currency: string;
  supplier: {
    id: string;
    name: string;
    companyName?: string;
  };
  _count: {
    items: number;
  };
}

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchOrders = async () => {
    try {
      const url = statusFilter !== 'all' 
        ? `/api/admin/purchase-orders?status=${statusFilter}`
        : '/api/admin/purchase-orders';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      DRAFT: { label: 'Entwurf', variant: 'secondary' },
      PENDING: { label: 'Ausstehend', variant: 'outline' },
      CONFIRMED: { label: 'Bestätigt', variant: 'default' },
      PARTIALLY_RECEIVED: { label: 'Teilweise erhalten', variant: 'outline' },
      RECEIVED: { label: 'Erhalten', variant: 'default' },
      CANCELLED: { label: 'Storniert', variant: 'destructive' },
    };
    const statusInfo = statusMap[status] || { label: status, variant: 'secondary' };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

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
          <h1 className="text-3xl font-bold">Einkaufsbestellungen</h1>
          <p className="text-muted-foreground mt-2">
            Verwalten Sie Ihre Einkaufsbestellungen
          </p>
        </div>
        <Link href="/de/admin/warehouse/purchase-orders/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Neue Bestellung
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label>Status:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="DRAFT">Entwurf</SelectItem>
                <SelectItem value="PENDING">Ausstehend</SelectItem>
                <SelectItem value="CONFIRMED">Bestätigt</SelectItem>
                <SelectItem value="PARTIALLY_RECEIVED">Teilweise erhalten</SelectItem>
                <SelectItem value="RECEIVED">Erhalten</SelectItem>
                <SelectItem value="CANCELLED">Storniert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {order.orderNumber}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {order.supplier.name}
                    {order.supplier.companyName && ` • ${order.supplier.companyName}`}
                  </CardDescription>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Bestelldatum</div>
                    <div className="text-muted-foreground">
                      {new Date(order.orderDate).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                </div>
                {order.expectedDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Erwartet</div>
                      <div className="text-muted-foreground">
                        {new Date(order.expectedDate).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Gesamtbetrag</div>
                    <div className="text-muted-foreground">
                      {Number(order.totalAmount).toFixed(2)} {order.currency}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {order._count.items} {order._count.items === 1 ? 'Position' : 'Positionen'}
              </div>
              <div className="mt-4">
                <Link href={`/de/admin/warehouse/purchase-orders/${order.id}`}>
                  <Button variant="outline" size="sm">
                    Details anzeigen
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {statusFilter !== 'all' ? 'Keine Bestellungen mit diesem Status' : 'Noch keine Einkaufsbestellungen vorhanden'}
            </p>
            {statusFilter === 'all' && (
              <Link href="/de/admin/warehouse/purchase-orders/new" className="mt-4 inline-block">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Erste Bestellung anlegen
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

