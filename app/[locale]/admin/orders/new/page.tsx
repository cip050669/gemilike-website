'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewOrderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        orderNumber: formData.get('orderNumber'),
        userId: formData.get('userId'),
        status: formData.get('status'),
        subtotal: formData.get('subtotal'),
        tax: formData.get('tax'),
        shipping: formData.get('shipping'),
        total: formData.get('total'),
        currency: formData.get('currency'),
        paymentMethod: formData.get('paymentMethod'),
        paymentStatus: formData.get('paymentStatus'),
        shippingMethod: formData.get('shippingMethod'),
        trackingNumber: formData.get('trackingNumber'),
        notes: formData.get('notes'),
      };

      const response = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Erstellen der Bestellung');
      }

      setMessage('✅ Bestellung erfolgreich erstellt!');
      router.push('/de/admin/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      setMessage('❌ Fehler beim Speichern');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Neue Bestellung</h1>
              <p className="text-gray-600">
                Erstellen Sie eine neue Bestellung
              </p>
            </div>
            <div className="flex gap-4">
              <form action="/de/admin/orders" method="get">
                <button
                  type="submit"
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
                >
                  ← Zurück
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Formular */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6">
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-white ${message.startsWith('✅') ? 'bg-green-500' : 'bg-red-500'}`}>
              {message}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bestellnummer */}
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Bestellnummer
              </label>
              <input
                type="text"
                id="orderNumber"
                name="orderNumber"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Kunden-ID */}
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                Kunden-ID
              </label>
              <input
                type="text"
                id="userId"
                name="userId"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="PENDING"
              >
                <option value="PENDING">Ausstehend</option>
                <option value="PROCESSING">In Bearbeitung</option>
                <option value="SHIPPED">Versandt</option>
                <option value="DELIVERED">Geliefert</option>
                <option value="CANCELLED">Storniert</option>
              </select>
            </div>

            {/* Zwischensumme */}
            <div>
              <label htmlFor="subtotal" className="block text-sm font-medium text-gray-700 mb-2">
                Zwischensumme (€)
              </label>
              <input
                type="number"
                id="subtotal"
                name="subtotal"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Steuer */}
            <div>
              <label htmlFor="tax" className="block text-sm font-medium text-gray-700 mb-2">
                Steuer (€)
              </label>
              <input
                type="number"
                id="tax"
                name="tax"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="0"
              />
            </div>

            {/* Versand */}
            <div>
              <label htmlFor="shipping" className="block text-sm font-medium text-gray-700 mb-2">
                Versand (€)
              </label>
              <input
                type="number"
                id="shipping"
                name="shipping"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="0"
              />
            </div>

            {/* Gesamtbetrag */}
            <div>
              <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-2">
                Gesamtbetrag (€)
              </label>
              <input
                type="number"
                id="total"
                name="total"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Währung */}
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                Währung
              </label>
              <select
                id="currency"
                name="currency"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="EUR"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="CHF">CHF</option>
              </select>
            </div>

            {/* Zahlungsmethode */}
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                Zahlungsmethode
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Zahlungsmethode wählen</option>
                <option value="credit_card">Kreditkarte</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Überweisung</option>
                <option value="cash">Bar</option>
                <option value="other">Sonstige</option>
              </select>
            </div>

            {/* Zahlungsstatus */}
            <div>
              <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-2">
                Zahlungsstatus
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="PENDING"
              >
                <option value="PENDING">Ausstehend</option>
                <option value="PAID">Bezahlt</option>
                <option value="FAILED">Fehlgeschlagen</option>
                <option value="REFUNDED">Erstattet</option>
              </select>
            </div>

            {/* Versandmethode */}
            <div>
              <label htmlFor="shippingMethod" className="block text-sm font-medium text-gray-700 mb-2">
                Versandmethode
              </label>
              <select
                id="shippingMethod"
                name="shippingMethod"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Versandmethode wählen</option>
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="overnight">Übernacht</option>
                <option value="pickup">Abholung</option>
              </select>
            </div>

            {/* Tracking-Nummer */}
            <div>
              <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Tracking-Nummer
              </label>
              <input
                type="text"
                id="trackingNumber"
                name="trackingNumber"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notizen */}
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notizen
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push('/de/admin/orders')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Speichern...' : 'Bestellung erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
