'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye, Package, Truck, CheckCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const t = useTranslations();
  const [viewedOrders, setViewedOrders] = useState<string[]>([]);

  // Function to handle order view
  const handleViewOrder = (orderId: string, customerName: string) => {
    console.log(`👁️ VIEW ORDER BUTTON CLICKED: ${orderId}`);
    alert(`👁️ BESTELLUNG ${orderId.toUpperCase()} WIRD ANGEZEIGT!\n\nKunde: ${customerName}`);
    
    // Add to viewed orders
    setViewedOrders(prev => [...prev, orderId]);
    
    // Simulate opening order details
    setTimeout(() => {
      alert(`✅ Bestellung ${orderId} Details erfolgreich geladen!\n\nKunde: ${customerName}\nStatus: Bestellung wird angezeigt`);
    }, 1000);
  };

  // Mock data - in production this would come from your database
  const orders = [
    {
      id: 'ORD-001',
      customer: 'Max Mustermann',
      email: 'max@example.com',
      date: '2025-01-11',
      status: 'pending',
      total: 1250.00,
      items: 2
    },
    {
      id: 'ORD-002',
      customer: 'Anna Schmidt',
      email: 'anna@example.com',
      date: '2025-01-10',
      status: 'processing',
      total: 890.00,
      items: 1
    },
    {
      id: 'ORD-003',
      customer: 'Peter Weber',
      email: 'peter@example.com',
      date: '2025-01-09',
      status: 'shipped',
      total: 2100.00,
      items: 3
    },
    {
      id: 'ORD-004',
      customer: 'Lisa Müller',
      email: 'lisa@example.com',
      date: '2025-01-08',
      status: 'delivered',
      total: 750.00,
      items: 1
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Ausstehend</Badge>;
      case 'processing':
        return <Badge variant="default">In Bearbeitung</Badge>;
      case 'shipped':
        return <Badge variant="outline">Versandt</Badge>;
      case 'delivered':
        return <Badge variant="default" className="bg-green-500">Geliefert</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ShoppingCart className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <ShoppingCart className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bestellungen</h1>
        <p className="text-muted-foreground">
          Verwalten Sie alle Kundenbestellungen
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamtbestellungen</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 diese Woche
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausstehend</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Bearbeitung erforderlich
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Bearbeitung</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'processing').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Vorbereitung läuft
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Geliefert</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Erfolgreich abgeschlossen
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Bestellungen</CardTitle>
          <CardDescription>
            Übersicht aller Kundenbestellungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <div>
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.customer} • {order.email}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">€{order.total.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.items} Artikel • {order.date}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(order.status)}
                    <Button 
                      variant={viewedOrders.includes(order.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleViewOrder(order.id, order.customer)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {viewedOrders.includes(order.id) ? "Angezeigt" : "Anzeigen"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
