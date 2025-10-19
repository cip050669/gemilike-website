import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface Customer {
  id: string;
  customerNumber: string;
  company?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  taxId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default async function ViewCustomerPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Kunde anzeigen</h1>
              <p className="text-gray-600">
                Details für {customer.firstName} {customer.lastName}
              </p>
            </div>
            <div className="flex gap-4">
              <form action="/de/admin/customers" method="get">
                <button
                  type="submit"
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
                >
                  ← Zurück
                </button>
              </form>
              <form action={`/de/admin/customers/edit/${customer.id}`} method="get">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  ✏️ Bearbeiten
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Kunden-Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hauptinformationen */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Kunden-Informationen</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kunden-Nummer
                    </label>
                    <p className="text-sm text-gray-900">{customer.customerNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.isActive ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vorname
                    </label>
                    <p className="text-sm text-gray-900">{customer.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nachname
                    </label>
                    <p className="text-sm text-gray-900">{customer.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-Mail
                    </label>
                    <p className="text-sm text-gray-900">{customer.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <p className="text-sm text-gray-900">{customer.phone || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unternehmen
                    </label>
                    <p className="text-sm text-gray-900">{customer.company || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Adressdaten */}
            <div className="bg-white rounded-lg shadow-sm border mt-6">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Adressdaten</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Straße und Hausnummer
                    </label>
                    <p className="text-sm text-gray-900">{customer.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stadt
                    </label>
                    <p className="text-sm text-gray-900">{customer.city}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postleitzahl
                    </label>
                    <p className="text-sm text-gray-900">{customer.postalCode}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Land
                    </label>
                    <p className="text-sm text-gray-900">{customer.country}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Steuernummer
                    </label>
                    <p className="text-sm text-gray-900">{customer.taxId || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notizen */}
            {customer.notes && (
              <div className="bg-white rounded-lg shadow-sm border mt-6">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">Notizen</h2>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{customer.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Zusätzliche Informationen</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registriert am
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(customer.createdAt).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zuletzt aktualisiert
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(customer.updatedAt).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Aktionen */}
            <div className="bg-white rounded-lg shadow-sm border mt-6">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Aktionen</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <form action={`/de/admin/customers/edit/${customer.id}`} method="get">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      ✏️ Kunde bearbeiten
                    </button>
                  </form>
                  <form action={`/de/admin/customers/${customer.id}`} method="post">
                    <input type="hidden" name="_method" value="DELETE" />
                    <button
                      type="submit"
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                    >
                      🗑️ Kunde löschen
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
