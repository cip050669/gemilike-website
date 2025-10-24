import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    notFound();
  }


  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">Kunde bearbeiten</h1>
              <p className="text-gray-300">
                Bearbeiten Sie die Daten für {customer.firstName} {customer.lastName}
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/de/admin/customers"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium inline-block"
              >
                ← Abbrechen
              </Link>
            </div>
          </div>
        </div>


        {/* Form */}
        <div className="bg-gray-800/30 rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Kunden-Informationen</h2>
          </div>
          
          <form action={`/api/admin/customers/${customer.id}`} method="post" className="p-6">
            <input type="hidden" name="_method" value="PUT" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Persönliche Daten */}
              <div className="md:col-span-2">
                <h3 className="text-md font-medium text-white mb-4">Persönliche Daten</h3>
              </div>
              
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-2">
                  Vorname *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  defaultValue={customer.firstName}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-200 mb-2">
                  Nachname *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  defaultValue={customer.lastName}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  E-Mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  defaultValue={customer.email}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue={customer.phone || ''}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-200 mb-2">
                  Unternehmen
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  defaultValue={customer.company || ''}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Adressdaten */}
              <div className="md:col-span-2">
                <h3 className="text-md font-medium text-white mb-4 mt-6">Adressdaten</h3>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-200 mb-2">
                  Straße und Hausnummer *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  defaultValue={customer.address}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-200 mb-2">
                  Stadt *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  defaultValue={customer.city}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-200 mb-2">
                  Postleitzahl *
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  required
                  defaultValue={customer.postalCode}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-200 mb-2">
                  Land *
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  defaultValue={customer.country}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Deutschland">Deutschland</option>
                  <option value="Österreich">Österreich</option>
                  <option value="Schweiz">Schweiz</option>
                  <option value="Frankreich">Frankreich</option>
                  <option value="Italien">Italien</option>
                  <option value="Spanien">Spanien</option>
                  <option value="Niederlande">Niederlande</option>
                  <option value="Belgien">Belgien</option>
                  <option value="Luxemburg">Luxemburg</option>
                  <option value="USA">USA</option>
                  <option value="Kanada">Kanada</option>
                  <option value="Großbritannien">Großbritannien</option>
                  <option value="Sonstige">Sonstige</option>
                </select>
              </div>

              <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-gray-200 mb-2">
                  Steuernummer
                </label>
                <input
                  type="text"
                  id="taxId"
                  name="taxId"
                  defaultValue={customer.taxId || ''}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Zusätzliche Informationen */}
              <div className="md:col-span-2">
                <h3 className="text-md font-medium text-white mb-4 mt-6">Zusätzliche Informationen</h3>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-200 mb-2">
                  Notizen
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  defaultValue={customer.notes || ''}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    defaultChecked={customer.isActive}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-white">
                    Kunde ist aktiv
                  </label>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <Link
                href="/de/admin/customers"
                className="px-6 py-2 border border-gray-600 rounded-lg text-gray-200 hover:bg-gray-800/50 inline-block"
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
    </div>
  );
}
