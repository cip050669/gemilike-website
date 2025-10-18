'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  ShoppingBag, 
  Star,
  Euro,
  Package
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  lastOrderAt?: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'vip';
  notes?: string;
  tags: string[];
  orders: Order[];
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  gemstoneName: string;
  quantity: number;
  price: number;
}

interface CustomerDetailsModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDetailsModal({ customer, isOpen, onClose }: CustomerDetailsModalProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'vip': return 'default';
      case 'active': return 'secondary';
      case 'inactive': return 'outline';
      default: return 'outline';
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered': return <Badge variant="default" className="bg-green-500">Geliefert</Badge>;
      case 'shipped': return <Badge variant="outline">Versandt</Badge>;
      case 'processing': return <Badge variant="secondary">In Bearbeitung</Badge>;
      case 'pending': return <Badge variant="outline">Ausstehend</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            Kunden-Details: {customer.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kontaktinformationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                  </div>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Telefon</div>
                      <div className="text-sm text-muted-foreground">{customer.phone}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Kunde seit</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(customer.createdAt).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status & Statistiken</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(customer.status)}>
                    {customer.status.toUpperCase()}
                  </Badge>
                  {customer.status === 'vip' && <Star className="h-4 w-4 text-yellow-500" />}
                </div>
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Bestellungen</div>
                    <div className="text-sm text-muted-foreground">{customer.totalOrders}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Gesamtausgaben</div>
                    <div className="text-sm text-muted-foreground">
                      {customer.totalSpent.toLocaleString('de-DE')} €
                    </div>
                  </div>
                </div>
                {customer.lastOrderAt && (
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Letzte Bestellung</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(customer.lastOrderAt).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          {customer.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {customer.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {customer.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notizen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{customer.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bestellhistorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customer.orders.map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{order.orderNumber}</div>
                      {getOrderStatusBadge(order.status)}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {new Date(order.createdAt).toLocaleDateString('de-DE')} • {order.total.toLocaleString('de-DE')} €
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="text-sm">
                          {item.gemstoneName} • {item.quantity}x • {item.price.toLocaleString('de-DE')} €
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Schließen
            </Button>
            <Button 
              onClick={() => {
                alert(`📋 Kunde ${customer.name} Details erfolgreich angezeigt!`);
              }}
            >
              Details bestätigen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}