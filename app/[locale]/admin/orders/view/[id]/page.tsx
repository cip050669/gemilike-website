import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { OrderStatus } from '@prisma/client';

export default async function ViewOrderPage({
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
      }
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
              <h1 className="text-4xl font-bold mb-4 text-white">Bestellung anzeigen</h1>
              <p className="text-gray-300">
                Bestellung #{order.orderNumber}
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href={`/de/admin/orders/edit/${order.id}`}
                className="inline-flex items-center bg-blue-600 px-6 py-3 font-medium text-white rounded-lg hover:bg-blue-700"
              >
                ✏️ Bearbeiten
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

        {/* Bestellungsdetails */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bestellungsinformationen */}
          <div className="bg-gray-800/30 rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Bestellungsinformationen</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200">Bestellnummer</label>
                <p className="text-lg font-semibold text-white">{order.orderNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Status</label>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    ORDER_STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Bestelldatum</label>
                <p className="text-white">{new Date(order.createdAt).toLocaleDateString('de-DE')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Gesamtbetrag</label>
                <p className="text-2xl font-bold text-green-600">€{order.total.toFixed(2)}</p>
              </div>
              {order.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-200">Notizen</label>
                  <p className="text-white">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Kundeninformationen */}
          <div className="bg-gray-800/30 rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Kundeninformationen</h2>
            {order.user ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200">Name</label>
                  <p className="text-white">{order.user.name || 'Unbekannt'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200">E-Mail</label>
                  <p className="text-white">{order.user.email}</p>
                </div>
                {order.user.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-200">Telefon</label>
                    <p className="text-white">{order.user.phone}</p>
                  </div>
                )}
                <div className="pt-4">
                  <Link
                    href={`/de/admin/customers/view/${order.user.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    👤 Kundenprofil anzeigen
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Keine Kundeninformationen verfügbar</p>
            )}
          </div>

          {/* Bestellungsdetails */}
          <div className="bg-gray-800/30 rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Bestellungsdetails</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200">Zwischensumme</label>
                <p className="text-white">€{order.subtotal.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Steuer</label>
                <p className="text-white">€{order.tax.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Versand</label>
                <p className="text-white">€{order.shipping.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Währung</label>
                <p className="text-white">{order.currency}</p>
              </div>
              {order.paymentMethod && (
                <div>
                  <label className="block text-sm font-medium text-gray-200">Zahlungsmethode</label>
                  <p className="text-white">{order.paymentMethod}</p>
                </div>
              )}
              {order.trackingNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-200">Tracking-Nummer</label>
                  <p className="text-white">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bestellhistorie */}
        <div className="mt-8 bg-gray-800/30 rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Bestellhistorie</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-300">Bestellung erstellt</span>
              <span className="text-sm text-white">{new Date(order.createdAt).toLocaleString('de-DE')}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-300">Zuletzt aktualisiert</span>
              <span className="text-sm text-white">{new Date(order.updatedAt).toLocaleString('de-DE')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-indigo-100 text-indigo-800',
  PROCESSING: 'bg-yellow-100 text-yellow-800',
  SHIPPED: 'bg-green-100 text-green-800',
  DELIVERED: 'bg-purple-100 text-purple-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-200 text-gray-800',
};

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Offen',
  CONFIRMED: 'Bestätigt',
  PROCESSING: 'In Bearbeitung',
  SHIPPED: 'Versendet',
  DELIVERED: 'Geliefert',
  CANCELLED: 'Storniert',
  REFUNDED: 'Erstattet',
};
