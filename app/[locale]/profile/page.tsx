'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Check
} from 'lucide-react';

interface Address {
  id: string;
  type: 'billing' | 'shipping';
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
  isDefault: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: 'shipping',
    country: 'Deutschland'
  });
  const userRole =
    (session?.user as { role?: string } | null | undefined)?.role ?? 'Kunde';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/de/admin/login');
      return;
    }
    
    if (session) {
      fetchUserData();
    }
  }, [session, status, router]);

  const fetchUserData = async () => {
    try {
      const [addressesRes, ordersRes] = await Promise.all([
        fetch('/api/user/addresses'),
        fetch('/api/user/orders')
      ]);
      
      const addressesData = await addressesRes.json();
      const ordersData = await ordersRes.json();
      
      if (addressesData.success) {
        setAddresses(addressesData.addresses);
      }
      
      if (ordersData.success) {
        setOrders(ordersData.orders);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (address: Partial<Address>) => {
    try {
      const response = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAddresses([...addresses, data.address]);
        setNewAddress({ type: 'shipping', country: 'Deutschland' });
        setEditingAddress(null);
      }
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAddresses(addresses.filter(addr => addr.id !== addressId));
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Lade Profil...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Mein Profil</h1>
          <p className="text-gray-300 mt-2">Verwalten Sie Ihre persönlichen Daten und Einstellungen</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="addresses">Adressen</TabsTrigger>
            <TabsTrigger value="orders">Bestellungen</TabsTrigger>
            <TabsTrigger value="wishlist">Wunschliste</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Persönliche Daten
                </CardTitle>
                <CardDescription>
                  Ihre grundlegenden Kontaktinformationen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={session.user?.name || ''}
                      disabled
                      className="public-page-bg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-Mail</Label>
                    <Input
                      id="email"
                      value={session.user?.email || ''}
                      disabled
                      className="public-page-bg"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {userRole}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Meine Adressen</h2>
              <Button
                onClick={() => setEditingAddress('new')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Neue Adresse
              </Button>
            </div>

            {/* New Address Form */}
            {editingAddress === 'new' && (
              <Card>
                <CardHeader>
                  <CardTitle>Neue Adresse hinzufügen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Typ</Label>
                      <select
                        id="type"
                        value={newAddress.type}
                        onChange={(e) => setNewAddress({...newAddress, type: e.target.value as 'billing' | 'shipping'})}
                        className="w-full p-2 border border-gray-600 rounded-md"
                      >
                        <option value="shipping">Lieferadresse</option>
                        <option value="billing">Rechnungsadresse</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="isDefault">Standard-Adresse</Label>
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={newAddress.isDefault || false}
                        onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                        className="ml-2"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Vorname</Label>
                      <Input
                        id="firstName"
                        value={newAddress.firstName || ''}
                        onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nachname</Label>
                      <Input
                        id="lastName"
                        value={newAddress.lastName || ''}
                        onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company">Firma (optional)</Label>
                    <Input
                      id="company"
                      value={newAddress.company || ''}
                      onChange={(e) => setNewAddress({...newAddress, company: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address1">Straße und Hausnummer</Label>
                    <Input
                      id="address1"
                      value={newAddress.address1 || ''}
                      onChange={(e) => setNewAddress({...newAddress, address1: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address2">Adresszusatz (optional)</Label>
                    <Input
                      id="address2"
                      value={newAddress.address2 || ''}
                      onChange={(e) => setNewAddress({...newAddress, address2: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="postalCode">PLZ</Label>
                      <Input
                        id="postalCode"
                        value={newAddress.postalCode || ''}
                        onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Stadt</Label>
                      <Input
                        id="city"
                        value={newAddress.city || ''}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Land</Label>
                      <Input
                        id="country"
                        value={newAddress.country || ''}
                        onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleSaveAddress(newAddress)}>
                      <Check className="h-4 w-4 mr-2" />
                      Speichern
                    </Button>
                    <Button variant="outline" onClick={() => setEditingAddress(null)}>
                      Abbrechen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Address List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <Card key={address.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {address.type === 'billing' ? 'Rechnungsadresse' : 'Lieferadresse'}
                          {address.isDefault && (
                            <Badge variant="default" className="ml-2">Standard</Badge>
                          )}
                        </CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">
                        {address.firstName} {address.lastName}
                      </p>
                      {address.company && (
                        <p>{address.company}</p>
                      )}
                      <p>{address.address1}</p>
                      {address.address2 && (
                        <p>{address.address2}</p>
                      )}
                      <p>{address.postalCode} {address.city}</p>
                      <p>{address.country}</p>
                      {address.phone && (
                        <p>Tel: {address.phone}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {addresses.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-white">Keine Adressen</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Fügen Sie Ihre erste Adresse hinzu.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setEditingAddress('new')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Erste Adresse hinzufügen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Meine Bestellungen
                </CardTitle>
                <CardDescription>
                  Übersicht Ihrer Bestellungen und deren Status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-white">Keine Bestellungen</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Sie haben noch keine Bestellungen aufgegeben.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Bestellung #{order.orderNumber}</h4>
                            <p className="text-sm text-gray-300">
                              {new Date(order.createdAt).toLocaleDateString('de-DE')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{order.total.toFixed(2)} €</p>
                            <Badge variant="outline">{order.status}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Meine Wunschliste
                </CardTitle>
                <CardDescription>
                  Ihre gespeicherten Edelsteine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Heart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-white">Wunschliste ist leer</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Fügen Sie Edelsteine zu Ihrer Wunschliste hinzu.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
