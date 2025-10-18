'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, MapPin, CreditCard, Truck, CheckCircle, Download } from 'lucide-react';

interface OrderItem {
  id: string;
  gemstoneId: string;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
}

interface Address {
  id: string;
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
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  shippingMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  orderItems: OrderItem[];
  billingAddress: Address;
  shippingAddress?: Address;
}

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderPage({ params }: OrderPageProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      const { id } = await params;
      
      if (!session) {
        router.push('/auth/signin');
        return;
      }

      try {
        const response = await fetch(`/api/orders/${id}`);
        if (response.ok) {
          const orderData = await response.json();
          setOrder(orderData);
        } else {
          router.push('/profile');
        }
      } catch (error) {
        console.error('Error loading order:', error);
        router.push('/profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [session, router, params]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Ausstehend';
      case 'confirmed':
        return 'Bestätigt';
      case 'processing':
        return 'In Bearbeitung';
      case 'shipped':
        return 'Versendet';
      case 'delivered':
        return 'Geliefert';
      case 'cancelled':
        return 'Storniert';
      default:
        return status;
    }
  };

  const downloadInvoice = async () => {
    if (!order) return;
    
    try {
      const response = await fetch(`/api/orders/${order.id}/invoice`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Rechnung-${order.orderNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="text-center">Lädt...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bestellung nicht gefunden</h1>
          <Button onClick={() => router.push('/profile')}>
            Zurück zum Profil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        <div className="mb-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Bestellung erfolgreich!</h1>
          <p className="text-muted-foreground">
            Ihre Bestellung wurde aufgegeben und wird bearbeitet.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Bestelldetails</span>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Bestellnummer: {order.orderNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bestelldatum</p>
                    <p>{new Date(order.createdAt).toLocaleDateString('de-DE')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Zahlungsart</p>
                    <p className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {order.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Versandart</p>
                    <p className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      {order.shippingMethod}
                    </p>
                  </div>
                  {order.trackingNumber && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Sendungsnummer</p>
                      <p className="font-mono text-sm">{order.trackingNumber}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Bestellte Artikel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">Edelstein #{item.gemstoneId}</p>
                        <p className="text-sm text-muted-foreground">
                          Menge: {item.quantity} × €{item.price.toFixed(2)}
                        </p>
                        {item.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Notiz: {item.notes}
                          </p>
                        )}
                      </div>
                      <p className="font-medium">€{item.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Addresses */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Rechnungsadresse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p className="font-medium">
                      {order.billingAddress.firstName} {order.billingAddress.lastName}
                    </p>
                    {order.billingAddress.company && (
                      <p>{order.billingAddress.company}</p>
                    )}
                    <p>{order.billingAddress.address1}</p>
                    {order.billingAddress.address2 && (
                      <p>{order.billingAddress.address2}</p>
                    )}
                    <p>
                      {order.billingAddress.postalCode} {order.billingAddress.city}
                    </p>
                    <p>{order.billingAddress.country}</p>
                    {order.billingAddress.phone && (
                      <p className="mt-2">{order.billingAddress.phone}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {order.shippingAddress && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Lieferadresse
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <p className="font-medium">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      {order.shippingAddress.company && (
                        <p>{order.shippingAddress.company}</p>
                      )}
                      <p>{order.shippingAddress.address1}</p>
                      {order.shippingAddress.address2 && (
                        <p>{order.shippingAddress.address2}</p>
                      )}
                      <p>
                        {order.shippingAddress.postalCode} {order.shippingAddress.city}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      {order.shippingAddress.phone && (
                        <p className="mt-2">{order.shippingAddress.phone}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Bestellnotizen</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Bestellübersicht</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Zwischensumme</span>
                    <span>€{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Versand</span>
                    <span>€{order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MwSt. (19%)</span>
                    <span>€{order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Gesamt</span>
                    <span>€{order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={downloadInvoice}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Rechnung herunterladen
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/profile')}
                  >
                    Zu meinen Bestellungen
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/shop')}
                  >
                    Weiter einkaufen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
