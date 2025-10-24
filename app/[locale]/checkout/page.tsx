'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useCartStore } from '@/lib/store/cart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckIcon, CreditCardIcon, TruckIcon } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const locale = useLocale();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Deutschland',
    paymentMethod: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hier würde die Bestellung verarbeitet werden
    alert('Bestellung erfolgreich aufgegeben!');
    clearCart();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-800/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ihr Warenkorb ist leer</h1>
          <p className="text-muted-foreground mb-6">
            Fügen Sie Artikel zu Ihrem Warenkorb hinzu, um fortzufahren.
          </p>
          <Button asChild>
            <Link href={`/${locale}/shop`}>Zum Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="gemilike-text-gradient text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bestellformular */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rechnungsadresse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Vorname</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nachname</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Straße und Hausnummer</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="zipCode">PLZ</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="city">Stadt</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="country">Land</Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Deutschland">Deutschland</SelectItem>
                      <SelectItem value="Österreich">Österreich</SelectItem>
                      <SelectItem value="Schweiz">Schweiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zahlungsmethode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    />
                    <Label htmlFor="paypal" className="flex items-center space-x-2">
                      <CreditCardIcon className="h-4 w-4" />
                      <span>PayPal</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="creditcard"
                      name="paymentMethod"
                      value="creditcard"
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    />
                    <Label htmlFor="creditcard" className="flex items-center space-x-2">
                      <CreditCardIcon className="h-4 w-4" />
                      <span>Kreditkarte</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="sepa"
                      name="paymentMethod"
                      value="sepa"
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    />
                    <Label htmlFor="sepa" className="flex items-center space-x-2">
                      <CreditCardIcon className="h-4 w-4" />
                      <span>SEPA-Lastschrift</span>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Versand</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <TruckIcon className="h-4 w-4 text-primary" />
                  <span>Standardversand (3-5 Werktage)</span>
                  <span className="ml-auto font-semibold">Kostenlos</span>
                </div>
              </CardContent>
            </Card>

            <div>
              <Label htmlFor="notes">Hinweise zur Bestellung (optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Spezielle Wünsche oder Anweisungen..."
                rows={3}
              />
            </div>
          </div>

          {/* Bestellübersicht */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bestellübersicht</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.category} • {item.weight}ct
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{item.price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">× {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Gesamt ({getTotalItems()} Artikel):</span>
                      <span className="text-primary">€{getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg"
            >
              <CheckIcon className="h-5 w-5 mr-2" />
              Bestellung abschließen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
