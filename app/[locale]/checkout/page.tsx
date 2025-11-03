'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useCartStore } from '@/lib/store/cart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, CreditCardIcon, TruckIcon, TagIcon, X } from 'lucide-react';

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const isLoading = useCartStore((state) => state.isLoading);
  const error = useCartStore((state) => state.error);
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
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: string;
    value: number;
    discount: number;
    description: string;
  } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [checkoutStartTime, setCheckoutStartTime] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('start');
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());
  const [cartId, setCartId] = useState<string | null>(null);

  // Tracking-Funktion
  const trackCheckoutEvent = async (
    step: string,
    stepOrder: number,
    completed: boolean = false,
    error?: string,
    metadata?: Record<string, any>
  ) => {
    try {
      const duration = Date.now() - stepStartTime;
      
      await fetch('/api/checkout/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId,
          step,
          stepOrder,
          duration,
          metadata,
          error,
          completed,
        }),
      });

      // Neuen Schritt starten
      setStepStartTime(Date.now());
    } catch (error) {
      console.error('Error tracking checkout event:', error);
      // Fail silently - tracking sollte nicht den Checkout blockieren
    }
  };

  useEffect(() => {
    // Hole Cart-ID
    const loadCartId = async () => {
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          if (data.cart?.id) {
            setCartId(data.cart.id);
          }
        }
      } catch (error) {
        console.error('Error loading cart ID:', error);
      }
    };
    
    void loadCartId();
    
    // Track Checkout-Start
    const startTime = Date.now();
    setCheckoutStartTime(startTime);
    void trackCheckoutEvent('start', 1);
  }, []);

  // Track Schritt-Wechsel
  useEffect(() => {
    if (currentStep !== 'start') {
      // Track vorherigen Schritt als abgeschlossen
      const stepOrderMap: Record<string, number> = {
        start: 1,
        address: 2,
        payment: 3,
        shipping: 4,
        coupon: 5,
        review: 6,
        submit: 7,
      };
      
      void trackCheckoutEvent(
        currentStep,
        stepOrderMap[currentStep] || 0,
        false,
        undefined,
        { formFieldsFilled: Object.values(formData).filter(v => v).length }
      );
    }
  }, [currentStep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Erstelle oder hole Adresse
      let billingAddressId: string | null = null;
      let shippingAddressId: string | null = null;

      try {
        // Erstelle Rechnungsadresse
        const billingResponse = await fetch('/api/user/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'BILLING',
            firstName: formData.firstName,
            lastName: formData.lastName,
            address1: formData.address,
            city: formData.city,
            postalCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone,
            isDefault: true,
          }),
        });

        if (billingResponse.ok) {
          const billingData = await billingResponse.json();
          billingAddressId = billingData.address?.id || null;
          shippingAddressId = billingAddressId; // Verwende Rechnungsadresse als Lieferadresse, wenn nicht anders angegeben
        }
      } catch (addressError) {
        console.error('Error creating address:', addressError);
        // Fortsetzen auch wenn Adress-Erstellung fehlschlägt (könnte bereits existieren)
      }

      // Berechne Preise
      const subtotal = getSubtotal();
      const discount = getDiscount();
      const finalTotal = getFinalTotal();
      const shipping = 0; // Kostenlos ab €50, sonst €4,95 - könnte später berechnet werden
      const tax = finalTotal * 0.19; // 19% MwSt (könnte später konfigurierbar sein)

      // Erstelle Order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            gemstoneId: item.gemstoneId,
            quantity: item.quantity,
            price: item.price,
          })),
          billingAddressId,
          shippingAddressId,
          paymentMethod: formData.paymentMethod || null,
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: finalTotal + tax,
          notes: formData.notes || null,
          couponCode: appliedCoupon?.code || null,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Fehler beim Erstellen der Bestellung');
      }

      const order = await orderResponse.json();

      // Track erfolgreiche Bestellung
      await trackCheckoutEvent('success', 8, true, undefined, {
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalItems: getTotalItems(),
        totalAmount: finalTotal + tax,
      });

      // Cart leeren
      await clearCart();

      // Weiterleitung zur Bestellbestätigung
      window.location.href = `/${locale}/orders/${order.id}`;
    } catch (error) {
      console.error('Error submitting order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Fehler beim Absenden der Bestellung';
      setSubmitError(errorMessage);
      
      // Track Fehler
      await trackCheckoutEvent('submit', 7, false, errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Bitte geben Sie einen Gutscheincode ein');
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError('');
    
    // Track Coupon-Schritt
    if (currentStep !== 'coupon') {
      setCurrentStep('coupon');
    }

    try {
      const subtotal = getTotalPrice();
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });

      if (response.ok) {
        const coupon = await response.json();
        setAppliedCoupon(coupon);
        setCouponCode('');
      } else {
        const error = await response.json();
        setCouponError(error.error || 'Ungültiger Gutscheincode');
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setCouponError('Fehler beim Validieren des Gutscheins');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const getSubtotal = () => getTotalPrice();
  const getDiscount = () => appliedCoupon?.discount || 0;
  const getFinalTotal = () => Math.max(0, getSubtotal() - getDiscount());

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  // Track Abandonment wenn Seite verlassen wird
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Track Abandonment nur wenn Checkout gestartet wurde und noch nicht abgeschlossen
      if (checkoutStartTime && currentStep !== 'success' && !isSubmitting) {
        // Synchrones Tracking über sendBeacon (wird auch bei Seitenwechsel ausgeführt)
        const eventData = JSON.stringify({
          cartId,
          step: 'abandon',
          stepOrder: 999,
          duration: Date.now() - (checkoutStartTime || Date.now()),
          completed: false,
          metadata: { lastStep: currentStep },
        });
        
        // sendBeacon für zuverlässiges Tracking beim Verlassen
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/checkout/track', eventData);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [checkoutStartTime, currentStep, isSubmitting, cartId]);

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen public-page-bg flex items-center justify-center text-muted-foreground">
        Warenkorb wird geladen...
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="min-h-screen public-page-bg flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen public-page-bg flex items-center justify-center">
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
    <div className="min-h-screen public-page-bg">
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
                      onChange={(e) => {
                        handleInputChange('paymentMethod', e.target.value);
                        if (currentStep !== 'payment') {
                          setCurrentStep('payment');
                        }
                      }}
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
                  
                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Zwischensumme:</span>
                      <span>€{getSubtotal().toFixed(2)}</span>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Badge variant="secondary" className="gap-1">
                            <TagIcon className="h-3 w-3" />
                            {appliedCoupon.code}
                          </Badge>
                          <span className="text-green-600">{appliedCoupon.description}:</span>
                        </span>
                        <span className="text-green-600">-€{getDiscount().toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                      <span>Gesamt ({getTotalItems()} Artikel):</span>
                      <span className="text-primary">€{getFinalTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coupon Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TagIcon className="h-5 w-5" />
                  Gutscheincode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{appliedCoupon.code}</Badge>
                      <span className="text-sm text-green-700 dark:text-green-300">
                        {appliedCoupon.description}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCoupon}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Gutscheincode eingeben"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyCoupon();
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponCode.trim()}
                        variant="outline"
                      >
                        {isValidatingCoupon ? 'Prüfe...' : 'Anwenden'}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-red-600 dark:text-red-400">{couponError}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {submitError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400 text-sm">
                {submitError}
              </div>
            )}
            
            <Button 
              onClick={(e) => {
                setCurrentStep('submit');
                void trackCheckoutEvent('submit', 7, false, undefined, {
                  hasCoupon: !!appliedCoupon,
                  itemCount: getTotalItems(),
                });
                handleSubmit(e);
              }}
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckIcon className="h-5 w-5 mr-2" />
              {isSubmitting ? 'Wird verarbeitet...' : 'Bestellung abschließen'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
