'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  status: string;
  totalAmount: number;
  orderDate: string;
  shippingAddress: string;
  billingAddress: string;
  notes?: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/admin/orders/${params.then(p => p.id)}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data.data);
        } else {
          setMessage('❌ Bestellung nicht gefunden');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setMessage('❌ Fehler beim Laden der Bestellung');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        orderNumber: formData.get('orderNumber'),
        status: formData.get('status'),
        totalAmount: formData.get('totalAmount'),
        orderDate: formData.get('orderDate'),
        shippingAddress: formData.get('shippingAddress'),
        billingAddress: formData.get('billingAddress'),
        notes: formData.get('notes'),
      };

      const response = await fetch(`/api/admin/orders/${order?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Aktualisieren der Bestellung');
      }

      setMessage('✅ Bestellung erfolgreich aktualisiert!');
      setTimeout(() => {
        router.push('/de/admin/orders');
      }, 1500);
    } catch (error) {
      console.error('Error updating order:', error);
      setMessage('❌ Fehler beim Speichern');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Bestellung...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Bestellung nicht gefunden</h1>
          <form action="/de/admin/orders" method="get">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              ← Zurück zu Bestellungen
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Bestellung bearbeiten</h1>
              <p className="text-gray-600">
                Bestellung #{order.orderNumber}
              </p>
            </div>
            <div className="flex gap-4">
              <form action={`/de/admin/orders/view/${order.id}`} method="get">
                <button
                  type="submit"
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
                >
                  👁️ Anzeigen
                </button>
              </form>
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
                defaultValue={order.orderNumber}
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
                defaultValue={order.status}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="new">Neu</option>
                <option value="processing">In Bearbeitung</option>
                <option value="shipped">Versandt</option>
                <option value="delivered">Geliefert</option>
                <option value="cancelled">Storniert</option>
              </select>
            </div>

            {/* Gesamtbetrag */}
            <div>
              <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Gesamtbetrag (€)
              </label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                step="0.01"
                defaultValue={order.totalAmount}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Bestelldatum */}
            <div>
              <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700 mb-2">
                Bestelldatum
              </label>
              <input
                type="datetime-local"
                id="orderDate"
                name="orderDate"
                defaultValue={new Date(order.orderDate).toISOString().slice(0, 16)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Lieferadresse */}
            <div className="md:col-span-2">
              <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Lieferadresse
              </label>
              <textarea
                id="shippingAddress"
                name="shippingAddress"
                rows={4}
                defaultValue={order.shippingAddress}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Rechnungsadresse */}
            <div className="md:col-span-2">
              <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Rechnungsadresse
              </label>
              <textarea
                id="billingAddress"
                name="billingAddress"
                rows={4}
                defaultValue={order.billingAddress}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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
                defaultValue={order.notes || ''}
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
              {isSubmitting ? 'Speichern...' : 'Änderungen speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}