import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        }
      },
      orderItems: {
        include: {
          gemstone: {
            select: {
              id: true,
              name: true,
              price: true,
            }
          }
        }
      },
      billingAddress: true,
      shippingAddress: true
    }
  });

  if (!order) {
    notFound();
  }


  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">Bestellung bearbeiten</h1>
              <p className="text-gray-300">
                Bestellung #{order.orderNumber}
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href={`/de/admin/orders/view/${order.id}`}
                className="inline-flex items-center bg-gray-600 px-6 py-3 font-medium text-white rounded-lg hover:bg-gray-700"
              >
                👁️ Anzeigen
              </Link>
              <Link
                href="/de/admin/orders"
                className="inline-flex items-center bg-gray-600 px-6 py-3 font-medium text-white rounded-lg hover:bg-gray-700"
              >
                ← Zurück
              </Link>
            </div>
          </div>
        </div>

        {/* Formular */}
        <form action={`/api/admin/orders/${order.id}`} method="POST" className="bg-gray-800/30 rounded-lg shadow-sm border p-6">
          <input type="hidden" name="_method" value="PUT" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bestellnummer */}
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-200 mb-2">
                Bestellnummer
              </label>
              <input
                type="text"
                id="orderNumber"
                name="orderNumber"
                defaultValue={order.orderNumber}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-200 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={order.status}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PENDING">Ausstehend</option>
                <option value="CONFIRMED">Bestätigt</option>
                <option value="PROCESSING">In Bearbeitung</option>
                <option value="SHIPPED">Versandt</option>
                <option value="DELIVERED">Geliefert</option>
                <option value="CANCELLED">Storniert</option>
                <option value="REFUNDED">Erstattet</option>
              </select>
            </div>

            {/* Gesamtbetrag */}
            <div>
              <label htmlFor="total" className="block text-sm font-medium text-gray-200 mb-2">
                Gesamtbetrag (€)
              </label>
              <input
                type="number"
                id="total"
                name="total"
                step="0.01"
                defaultValue={order.total}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Zwischensumme */}
            <div>
              <label htmlFor="subtotal" className="block text-sm font-medium text-gray-200 mb-2">
                Zwischensumme (€)
              </label>
              <input
                type="number"
                id="subtotal"
                name="subtotal"
                step="0.01"
                defaultValue={order.subtotal}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Steuer */}
            <div>
              <label htmlFor="tax" className="block text-sm font-medium text-gray-200 mb-2">
                Steuer (€)
              </label>
              <input
                type="number"
                id="tax"
                name="tax"
                step="0.01"
                defaultValue={order.tax}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Versand */}
            <div>
              <label htmlFor="shipping" className="block text-sm font-medium text-gray-200 mb-2">
                Versand (€)
              </label>
              <input
                type="number"
                id="shipping"
                name="shipping"
                step="0.01"
                defaultValue={order.shipping}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Zahlungsmethode */}
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-200 mb-2">
                Zahlungsmethode
              </label>
              <input
                type="text"
                id="paymentMethod"
                name="paymentMethod"
                defaultValue={order.paymentMethod || ''}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Zahlungsstatus */}
            <div>
              <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-200 mb-2">
                Zahlungsstatus
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                defaultValue={order.paymentStatus}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PENDING">Ausstehend</option>
                <option value="PAID">Bezahlt</option>
                <option value="FAILED">Fehlgeschlagen</option>
                <option value="REFUNDED">Erstattet</option>
                <option value="PARTIALLY_REFUNDED">Teilweise erstattet</option>
              </select>
            </div>

            {/* Versandmethode */}
            <div>
              <label htmlFor="shippingMethod" className="block text-sm font-medium text-gray-200 mb-2">
                Versandmethode
              </label>
              <input
                type="text"
                id="shippingMethod"
                name="shippingMethod"
                defaultValue={order.shippingMethod || ''}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tracking-Nummer */}
            <div>
              <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-200 mb-2">
                Tracking-Nummer
              </label>
              <input
                type="text"
                id="trackingNumber"
                name="trackingNumber"
                defaultValue={order.trackingNumber || ''}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notizen */}
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-200 mb-2">
                Notizen
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                defaultValue={order.notes || ''}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <Link
              href="/de/admin/orders"
              className="px-6 py-2 border border-gray-600 rounded-lg text-gray-200 hover:bg-gray-800/50"
            >
              Abbrechen
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Änderungen speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
