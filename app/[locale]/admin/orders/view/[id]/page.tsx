import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  currency: string;
  paymentMethod?: string;
  paymentStatus: string;
  shippingMethod?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name?: string;
    email: string;
    phone?: string;
  };
}

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Bestellung anzeigen</h1>
              <p className="text-gray-600">
                Bestellung #{order.orderNumber}
              </p>
            </div>
            <div className="flex gap-4">
              <form action={`/de/admin/orders/edit/${order.id}`} method="get">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  ✏️ Bearbeiten
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

        {/* Bestellungsdetails */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bestellungsinformationen */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Bestellungsinformationen</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bestellnummer</label>
                <p className="text-lg font-semibold text-gray-900">{order.orderNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'new' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                  order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bestelldatum</label>
                <p className="text-gray-900">{new Date(order.createdAt).toLocaleDateString('de-DE')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gesamtbetrag</label>
                <p className="text-2xl font-bold text-green-600">€{order.total.toFixed(2)}</p>
              </div>
              {order.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notizen</label>
                  <p className="text-gray-900">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Kundeninformationen */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Kundeninformationen</h2>
            {order.user ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{order.user.name || 'Unbekannt'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-Mail</label>
                  <p className="text-gray-900">{order.user.email}</p>
                </div>
                {order.user.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefon</label>
                    <p className="text-gray-900">{order.user.phone}</p>
                  </div>
                )}
                <div className="pt-4">
                  <form action={`/de/admin/customers/view/${order.user.id}`} method="get">
                    <button
                      type="submit"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      👤 Kundenprofil anzeigen
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Keine Kundeninformationen verfügbar</p>
            )}
          </div>

          {/* Bestellungsdetails */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Bestellungsdetails</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Zwischensumme</label>
                <p className="text-gray-900">€{order.subtotal.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Steuer</label>
                <p className="text-gray-900">€{order.tax.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Versand</label>
                <p className="text-gray-900">€{order.shipping.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Währung</label>
                <p className="text-gray-900">{order.currency}</p>
              </div>
              {order.paymentMethod && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Zahlungsmethode</label>
                  <p className="text-gray-900">{order.paymentMethod}</p>
                </div>
              )}
              {order.trackingNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tracking-Nummer</label>
                  <p className="text-gray-900">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bestellhistorie */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Bestellhistorie</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Bestellung erstellt</span>
              <span className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleString('de-DE')}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Zuletzt aktualisiert</span>
              <span className="text-sm text-gray-900">{new Date(order.updatedAt).toLocaleString('de-DE')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}