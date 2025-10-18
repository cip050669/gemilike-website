'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Eye, Download, Truck, CreditCard, MapPin, Calendar, Euro } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface OrderItem {
  id: string;
  gemstoneId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  paymentMethod: {
    type: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
    last4?: string;
    brand?: string;
  };
  shippingMethod: {
    name: string;
    estimatedDays: number;
    cost: number;
  };
  trackingNumber?: string;
  orderItems: OrderItem[];
  notes?: string;
}

const statusConfig = {
  pending: { label: 'Ausstehend', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  confirmed: { label: 'Bestätigt', color: 'bg-blue-100 text-blue-800', icon: '✅' },
  processing: { label: 'In Bearbeitung', color: 'bg-purple-100 text-purple-800', icon: '⚙️' },
  shipped: { label: 'Versendet', color: 'bg-indigo-100 text-indigo-800', icon: '🚚' },
  delivered: { label: 'Geliefert', color: 'bg-green-100 text-green-800', icon: '📦' },
  cancelled: { label: 'Storniert', color: 'bg-red-100 text-red-800', icon: '❌' },
  refunded: { label: 'Erstattet', color: 'bg-gray-100 text-gray-800', icon: '💰' },
};

export default function OrderHistory() {
  const t = useTranslations('profile');
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const handleReorder = async (order: Order) => {
    // Add all items from the order to cart
    try {
      for (const item of order.orderItems) {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gemstoneId: item.gemstoneId,
            quantity: item.quantity,
          }),
        });
      }
      router.push('/checkout');
    } catch (error) {
      console.error('Error reordering:', error);
    }
  };

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/invoice`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rechnung-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">Lädt Bestellungen...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Meine Bestellungen</h2>
          <p className="text-muted-foreground">
            Übersicht über alle Ihre Bestellungen
          </p>
        </div>
        <Button onClick={() => router.push('/shop')}>
          <Package className="h-4 w-4 mr-2" />
          Jetzt einkaufen
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Noch keine Bestellungen</h3>
              <p className="text-muted-foreground mb-4">
                Entdecken Sie unsere wunderschönen Edelsteine und bestellen Sie noch heute.
              </p>
              <Button onClick={() => router.push('/shop')}>
                <Package className="h-4 w-4 mr-2" />
                Edelsteine entdecken
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Bestellung #{order.orderNumber}
                      </CardTitle>
                      <CardDescription>
                        {formatDate(order.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge className={statusConfig[order.status].color}>
                      {statusConfig[order.status].icon} {statusConfig[order.status].label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {formatCurrency(order.total, order.currency)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.orderItems.length} Artikel
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Artikel</h4>
                    <div className="space-y-2">
                      {order.orderItems.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.quantity}x {formatCurrency(item.price, order.currency)}
                            </div>
                          </div>
                        </div>
                      ))}
                      {order.orderItems.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          +{order.orderItems.length - 3} weitere Artikel
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Lieferung</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {order.shippingAddress.city}, {order.shippingAddress.country}
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        {order.shippingMethod.name}
                      </div>
                      {order.trackingNumber && (
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Tracking: {order.trackingNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Details anzeigen
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadInvoice(order.id)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Rechnung
                  </Button>
                  {order.status === 'delivered' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(order)}
                    >
                      <Package className="h-3 w-3 mr-1" />
                      Erneut bestellen
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Bestellung #{selectedOrder?.orderNumber}
            </DialogTitle>
            <DialogDescription>
              Detaillierte Informationen zu Ihrer Bestellung
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status */}
              <div className="flex items-center gap-4">
                <Badge className={statusConfig[selectedOrder.status].color}>
                  {statusConfig[selectedOrder.status].icon} {statusConfig[selectedOrder.status].label}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  Bestellt am {formatDate(selectedOrder.createdAt)}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-3">Bestellte Artikel</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Menge: {item.quantity} • Preis: {formatCurrency(item.price, selectedOrder.currency)}
                        </div>
                      </div>
                      <div className="font-medium">
                        {formatCurrency(item.total, selectedOrder.currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Addresses */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Lieferadresse
                  </h3>
                  <div className="text-sm space-y-1">
                    <div>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</div>
                    {selectedOrder.shippingAddress.company && (
                      <div>{selectedOrder.shippingAddress.company}</div>
                    )}
                    <div>{selectedOrder.shippingAddress.address1}</div>
                    {selectedOrder.shippingAddress.address2 && (
                      <div>{selectedOrder.shippingAddress.address2}</div>
                    )}
                    <div>{selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}</div>
                    {selectedOrder.shippingAddress.state && (
                      <div>{selectedOrder.shippingAddress.state}</div>
                    )}
                    <div>{selectedOrder.shippingAddress.country}</div>
                    {selectedOrder.shippingAddress.phone && (
                      <div>📞 {selectedOrder.shippingAddress.phone}</div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Rechnungsadresse
                  </h3>
                  <div className="text-sm space-y-1">
                    <div>{selectedOrder.billingAddress.firstName} {selectedOrder.billingAddress.lastName}</div>
                    {selectedOrder.billingAddress.company && (
                      <div>{selectedOrder.billingAddress.company}</div>
                    )}
                    <div>{selectedOrder.billingAddress.address1}</div>
                    {selectedOrder.billingAddress.address2 && (
                      <div>{selectedOrder.billingAddress.address2}</div>
                    )}
                    <div>{selectedOrder.billingAddress.postalCode} {selectedOrder.billingAddress.city}</div>
                    {selectedOrder.billingAddress.state && (
                      <div>{selectedOrder.billingAddress.state}</div>
                    )}
                    <div>{selectedOrder.billingAddress.country}</div>
                    {selectedOrder.billingAddress.phone && (
                      <div>📞 {selectedOrder.billingAddress.phone}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment & Shipping */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-3">Zahlungsmethode</h3>
                  <div className="text-sm">
                    {selectedOrder.paymentMethod.type === 'credit_card' && (
                      <div>
                        💳 {selectedOrder.paymentMethod.brand} •••• {selectedOrder.paymentMethod.last4}
                      </div>
                    )}
                    {selectedOrder.paymentMethod.type === 'paypal' && (
                      <div>💳 PayPal</div>
                    )}
                    {selectedOrder.paymentMethod.type === 'bank_transfer' && (
                      <div>🏦 Banküberweisung</div>
                    )}
                    {selectedOrder.paymentMethod.type === 'cash_on_delivery' && (
                      <div>💰 Nachnahme</div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Versandart</h3>
                  <div className="text-sm">
                    <div>{selectedOrder.shippingMethod.name}</div>
                    <div className="text-muted-foreground">
                      Geschätzte Lieferzeit: {selectedOrder.shippingMethod.estimatedDays} Tage
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="mt-2">
                        <strong>Tracking-Nummer:</strong> {selectedOrder.trackingNumber}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-medium mb-3">Bestellübersicht</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Zwischensumme:</span>
                    <span>{formatCurrency(selectedOrder.subtotal, selectedOrder.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Versand:</span>
                    <span>{formatCurrency(selectedOrder.shipping, selectedOrder.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Steuern:</span>
                    <span>{formatCurrency(selectedOrder.tax, selectedOrder.currency)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Gesamt:</span>
                    <span>{formatCurrency(selectedOrder.total, selectedOrder.currency)}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h3 className="font-medium mb-3">Bestellnotizen</h3>
                  <div className="text-sm p-3 bg-muted rounded-lg">
                    {selectedOrder.notes}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
