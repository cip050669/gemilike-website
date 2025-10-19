import { prisma } from '@/lib/prisma';

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
  };
}

export default async function OrdersPage() {
  // Fetch orders from database
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Bestellungen</h1>
              <p className="text-gray-600">
                Verwalten Sie alle Kundenbestellungen
              </p>
            </div>
            <div className="flex gap-4">
              <form action="/de/admin/orders/export" method="get">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
                >
                  📊 Export
                </button>
              </form>
              <form action="/de/admin/orders/new" method="get">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  + Neue Bestellung
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <form action="/de/admin/orders" method="get" className="inline">
              <input type="hidden" name="status" value="all" />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Alle ({orders.length})
              </button>
            </form>
            <form action="/de/admin/orders" method="get" className="inline">
              <input type="hidden" name="status" value="PENDING" />
              <button type="submit" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                Ausstehend ({orders.filter(o => o.status === 'PENDING').length})
              </button>
            </form>
            <form action="/de/admin/orders" method="get" className="inline">
              <input type="hidden" name="status" value="PROCESSING" />
              <button type="submit" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                In Bearbeitung ({orders.filter(o => o.status === 'PROCESSING').length})
              </button>
            </form>
            <form action="/de/admin/orders" method="get" className="inline">
              <input type="hidden" name="status" value="SHIPPED" />
              <button type="submit" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                Versandt ({orders.filter(o => o.status === 'SHIPPED').length})
              </button>
            </form>
            <form action="/de/admin/orders" method="get" className="inline">
              <input type="hidden" name="status" value="DELIVERED" />
              <button type="submit" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                Geliefert ({orders.filter(o => o.status === 'DELIVERED').length})
              </button>
            </form>
            <form action="/de/admin/orders" method="get" className="inline">
              <input type="hidden" name="status" value="CANCELLED" />
              <button type="submit" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                Storniert ({orders.filter(o => o.status === 'CANCELLED').length})
              </button>
            </form>
          </div>
        </div>

        {/* Such- und Filterbereich */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Suche
              </label>
              <input
                type="text"
                id="search"
                name="search"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bestellnummer, Kunde..."
              />
            </div>
            <div>
              <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-2">
                Von Datum
              </label>
              <input
                type="date"
                id="date-from"
                name="date-from"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-2">
                Bis Datum
              </label>
              <input
                type="date"
                id="date-to"
                name="date-to"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <form action="/de/admin/orders" method="get">
                <button type="submit" className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                  Filter anwenden
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bestellungen-Liste mit Scrollleiste */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Bestellungen ({orders.length} gefunden)</h2>
          </div>
          
          {/* Scrollbar-Container */}
          <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bestellnummer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kunde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Betrag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">Online</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.user ? order.user.name || 'Unbekannt' : 'Unbekannt'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'SHIPPED' ? 'bg-green-100 text-green-800' :
                        order.status === 'DELIVERED' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <form action={`/de/admin/orders/view/${order.id}`} method="get" className="inline">
                          <button type="submit" className="text-blue-600 hover:text-blue-900">Anzeigen</button>
                        </form>
                        <form action={`/de/admin/orders/edit/${order.id}`} method="get" className="inline ml-4">
                          <button type="submit" className="text-green-600 hover:text-green-900">Bearbeiten</button>
                        </form>
                        <form action={`/api/admin/orders/${order.id}`} method="post" className="inline ml-4">
                          <input type="hidden" name="_method" value="DELETE" />
                          <button type="submit" className="text-red-600 hover:text-red-900">Löschen</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
