'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import WishlistManager from '@/components/profile/WishlistManager';
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
  Plus,
  Edit,
  Trash2,
  Check
} from 'lucide-react';

interface Address {
  id: string;
  type: 'billing' | 'shipping' | 'BILLING' | 'SHIPPING' | 'OTHER' | null;
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
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    company: '',
    preferredLanguage: 'de',
    marketingOptIn: false,
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
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
      // Initialize profile data from session
      if (session.user) {
        setProfileData(prev => ({
          ...prev,
          name: session.user?.name || prev.name,
          email: session.user?.email || prev.email,
        }));
      }
    }
  }, [session, status, router]);

  const fetchUserData = async () => {
    try {
      const [addressesRes, ordersRes, profileRes] = await Promise.all([
        fetch('/api/user/addresses'),
        fetch('/api/user/orders'),
        fetch('/api/user/profile')
      ]);
      
      const addressesData = await addressesRes.json();
      const ordersData = await ordersRes.json();
      const profileData = await profileRes.json();
      
      if (addressesData.success) {
        setAddresses(addressesData.addresses);
      }
      
      if (ordersData.success) {
        setOrders(ordersData.orders);
      }

      if (profileData.success && profileData.user) {
        setProfileData({
          name: profileData.user.name || '',
          email: profileData.user.email || '',
          phone: profileData.user.phone || '',
          firstName: profileData.user.firstName || '',
          lastName: profileData.user.lastName || '',
          company: profileData.user.company || '',
          preferredLanguage: profileData.user.preferredLanguage || 'de',
          marketingOptIn: profileData.user.marketingOptIn || false,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (data.success) {
        // Update session
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: profileData.name,
            email: profileData.email,
          },
        });
        setIsEditingProfile(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveAddress = async (address: Partial<Address>) => {
    setSavingAddress(true);
    setAddressError(null);
    
    // Validation
    if (!address.firstName?.trim() || !address.lastName?.trim() || !address.address1?.trim() || !address.city?.trim() || !address.postalCode?.trim() || !address.country?.trim()) {
      setAddressError('Bitte füllen Sie alle Pflichtfelder aus (Vorname, Nachname, Straße, Stadt, PLZ, Land).');
      setSavingAddress(false);
      return;
    }
    
    try {
      // Prepare address data for API
      const addressData = {
        type: address.type || 'shipping',
        firstName: address.firstName.trim(),
        lastName: address.lastName.trim(),
        company: address.company?.trim() || undefined,
        address1: address.address1.trim(),
        address2: address.address2?.trim() || undefined,
        city: address.city.trim(),
        state: address.state?.trim() || undefined,
        postalCode: address.postalCode.trim(),
        country: address.country.trim(),
        phone: address.phone?.trim() || undefined,
        isDefault: address.isDefault || false,
      };
      
      console.log('Saving address:', addressData);
      
      const response = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });
      
      const data = await response.json();
      console.log('Address save response:', data);
      
      if (data.success) {
        // Refresh addresses from server
        await fetchUserData();
        setNewAddress({ type: 'shipping', country: 'Deutschland' });
        setEditingAddress(null);
        setAddressError(null);
      } else {
        const errorMessage = data.error || 'Fehler beim Speichern der Adresse';
        setAddressError(errorMessage);
        console.error('Address save error:', errorMessage);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      setAddressError('Fehler beim Speichern der Adresse. Bitte versuchen Sie es erneut.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address.id);
    // Convert enum type to lowercase for form
    const addressType = address.type?.toLowerCase() === 'billing' || address.type === 'BILLING' ? 'billing' : 'shipping';
    setNewAddress({
      type: addressType as 'billing' | 'shipping',
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      company: address.company || '',
      address1: address.address1 || '',
      address2: address.address2 || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || 'Deutschland',
      phone: address.phone || '',
      isDefault: address.isDefault || false,
    });
    setAddressError(null);
  };

  const handleUpdateAddress = async (addressId: string, address: Partial<Address>) => {
    setSavingAddress(true);
    setAddressError(null);
    
    // Validation
    if (!address.firstName?.trim() || !address.lastName?.trim() || !address.address1?.trim() || !address.city?.trim() || !address.postalCode?.trim() || !address.country?.trim()) {
      setAddressError('Bitte füllen Sie alle Pflichtfelder aus (Vorname, Nachname, Straße, Stadt, PLZ, Land).');
      setSavingAddress(false);
      return;
    }
    
    try {
      // Prepare address data for API
      const addressData = {
        type: address.type || 'shipping',
        firstName: address.firstName.trim(),
        lastName: address.lastName.trim(),
        company: address.company?.trim() || undefined,
        address1: address.address1.trim(),
        address2: address.address2?.trim() || undefined,
        city: address.city.trim(),
        state: address.state?.trim() || undefined,
        postalCode: address.postalCode.trim(),
        country: address.country.trim(),
        phone: address.phone?.trim() || undefined,
        isDefault: address.isDefault || false,
      };
      
      console.log('Updating address:', addressId, addressData);
      
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });
      
      const data = await response.json();
      console.log('Address update response:', data);
      
      if (data.success) {
        // Refresh addresses from server
        await fetchUserData();
        setNewAddress({ type: 'shipping', country: 'Deutschland' });
        setEditingAddress(null);
        setAddressError(null);
      } else {
        const errorMessage = data.error || 'Fehler beim Aktualisieren der Adresse';
        setAddressError(errorMessage);
        console.error('Address update error:', errorMessage);
      }
    } catch (error) {
      console.error('Error updating address:', error);
      setAddressError('Fehler beim Aktualisieren der Adresse. Bitte versuchen Sie es erneut.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diese Adresse löschen möchten?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchUserData();
      } else {
        alert('Fehler beim Löschen der Adresse');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Fehler beim Löschen der Adresse');
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
    <div className="container mx-auto px-4 py-8 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mein Profil</h1>
          <p className="mt-2 text-gray-700 dark:text-gray-300">Verwalten Sie Ihre persönlichen Daten und Einstellungen</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="profile" className="text-gray-900 dark:text-white data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">Profil</TabsTrigger>
            <TabsTrigger value="addresses" className="text-gray-900 dark:text-white data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">Adressen</TabsTrigger>
            <TabsTrigger value="orders" className="text-gray-900 dark:text-white data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">Bestellungen</TabsTrigger>
            <TabsTrigger value="wishlist" className="text-gray-900 dark:text-white data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">Wunschliste</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <User className="h-5 w-5" />
                      Persönliche Daten
                    </CardTitle>
                    <CardDescription className="text-gray-700 dark:text-gray-300">
                      Ihre grundlegenden Kontaktinformationen
                    </CardDescription>
                  </div>
                  {!isEditingProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Bearbeiten
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-900 dark:text-white">Name</Label>
                    <input
                      id="name"
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditingProfile}
                      className="h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1 text-sm text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      style={{ color: '#111827' }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-900 dark:text-white">E-Mail</Label>
                    <input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditingProfile}
                      className="h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1 text-sm text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      style={{ color: '#111827' }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-900 dark:text-white">Telefon</Label>
                    <input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditingProfile}
                      className="h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1 text-sm text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      style={{ color: '#111827' }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="firstName" className="text-gray-900 dark:text-white">Vorname</Label>
                    <input
                      id="firstName"
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      disabled={!isEditingProfile}
                      className="h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1 text-sm text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      style={{ color: '#111827' }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-900 dark:text-white">Nachname</Label>
                    <input
                      id="lastName"
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      disabled={!isEditingProfile}
                      className="h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1 text-sm text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      style={{ color: '#111827' }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-gray-900 dark:text-white">Firma (optional)</Label>
                    <input
                      id="company"
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      disabled={!isEditingProfile}
                      className="h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1 text-sm text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      style={{ color: '#111827' }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {userRole}
                  </Badge>
                </div>
                {isEditingProfile && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      {savingProfile ? 'Speichern...' : 'Speichern'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingProfile(false);
                        // Reset to original values
                        if (session?.user) {
                          setProfileData({
                            name: session.user.name || '',
                            email: session.user.email || '',
                            phone: '',
                            firstName: '',
                            lastName: '',
                            company: '',
                            preferredLanguage: 'de',
                            marketingOptIn: false,
                          });
                        }
                      }}
                    >
                      Abbrechen
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Meine Adressen</h2>
              <Button
                onClick={() => setEditingAddress('new')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Neue Adresse
              </Button>
            </div>

            {/* New/Edit Address Form */}
            {(editingAddress === 'new' || (editingAddress && editingAddress !== 'new')) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    {editingAddress === 'new' ? 'Neue Adresse hinzufügen' : 'Adresse bearbeiten'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {addressError && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md">
                      <p className="text-sm text-red-800 dark:text-red-200">{addressError}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type" className="text-gray-900 dark:text-white">Typ</Label>
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
                      <Label htmlFor="isDefault" className="text-gray-900 dark:text-white">Standard-Adresse</Label>
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
                      <Label htmlFor="firstName" className="text-gray-900 dark:text-white">Vorname</Label>
                      <Input
                        id="firstName"
                        value={newAddress.firstName || ''}
                        onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})}
                        className="text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-900 dark:text-white">Nachname</Label>
                      <Input
                        id="lastName"
                        value={newAddress.lastName || ''}
                        onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})}
                        className="text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-gray-900 dark:text-white">Firma (optional)</Label>
                    <Input
                      id="company"
                      value={newAddress.company || ''}
                      onChange={(e) => setNewAddress({...newAddress, company: e.target.value})}
                      className="text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address1" className="text-gray-900 dark:text-white">Straße und Hausnummer</Label>
                    <Input
                      id="address1"
                      value={newAddress.address1 || ''}
                      onChange={(e) => setNewAddress({...newAddress, address1: e.target.value})}
                      className="text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address2" className="text-gray-900 dark:text-white">Adresszusatz (optional)</Label>
                    <Input
                      id="address2"
                      value={newAddress.address2 || ''}
                      onChange={(e) => setNewAddress({...newAddress, address2: e.target.value})}
                      className="text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="postalCode" className="text-gray-900 dark:text-white">PLZ</Label>
                      <Input
                        id="postalCode"
                        value={newAddress.postalCode || ''}
                        onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                        className="text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city" className="text-gray-900 dark:text-white">Stadt</Label>
                      <Input
                        id="city"
                        value={newAddress.city || ''}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        className="text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-gray-900 dark:text-white">Land</Label>
                      <Input
                        id="country"
                        value={newAddress.country || ''}
                        onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                        className="text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        if (editingAddress === 'new') {
                          handleSaveAddress(newAddress);
                        } else if (editingAddress) {
                          handleUpdateAddress(editingAddress, newAddress);
                        }
                      }}
                      disabled={savingAddress}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {savingAddress ? 'Speichern...' : 'Speichern'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingAddress(null);
                        setAddressError(null);
                        setNewAddress({ type: 'shipping', country: 'Deutschland' });
                      }}
                      disabled={savingAddress}
                    >
                      Abbrechen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Address List */}
            {!editingAddress && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <Card key={address.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-gray-900 dark:text-white">
                            {address.type === 'billing' || address.type === 'BILLING' ? 'Rechnungsadresse' : 'Lieferadresse'}
                            {address.isDefault && (
                              <Badge variant="default" className="ml-2">Standard</Badge>
                            )}
                          </CardTitle>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditAddress(address)}
                          >
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
                      <div className="space-y-1 text-sm text-gray-900 dark:text-white">
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
            )}

            {addresses.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <MapPin className="mx-auto h-12 w-12 text-gray-500 dark:text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Keine Adressen</h3>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
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
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <ShoppingBag className="h-5 w-5" />
                  Meine Bestellungen
                </CardTitle>
                <CardDescription className="text-gray-700 dark:text-gray-300">
                  Übersicht Ihrer Bestellungen und deren Status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-500 dark:text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Keine Bestellungen</h3>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      Sie haben noch keine Bestellungen aufgegeben.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Bestellung #{order.orderNumber}</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {new Date(order.createdAt).toLocaleDateString('de-DE')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900 dark:text-white">{order.total.toFixed(2)} €</p>
                            <Badge variant="outline" className="text-gray-900 dark:text-white">{order.status}</Badge>
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
            <WishlistManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
