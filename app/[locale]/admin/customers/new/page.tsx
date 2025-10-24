'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCustomerPage() {
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
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        address: formData.get('address'),
        city: formData.get('city'),
        postalCode: formData.get('postalCode'),
        country: formData.get('country'),
        notes: formData.get('notes'),
        isActive: formData.get('isActive') === 'on'
      };

      const response = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ Kunde erfolgreich erstellt');
        setTimeout(() => {
          router.push('/de/admin/customers');
        }, 1500);
      } else {
        setMessage('❌ Fehler beim Speichern: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      setMessage('❌ Fehler beim Speichern');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">Neuer Kunde</h1>
          <p className="text-gray-300">
            Fügen Sie einen neuen Kunden zu Ihrer Datenbank hinzu
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        <div className="bg-gray-800/30 rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Kunden-Informationen</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
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
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Max"
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
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mustermann"
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
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="max@example.com"
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
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+49 123 456789"
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
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Muster GmbH"
                />
              </div>

              {/* Adressdaten */}
              <div className="md:col-span-2">
                <h3 className="text-md font-medium text-white mb-4 mt-6">Adressdaten</h3>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-200 mb-2">
                  Straße und Hausnummer
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Musterstraße 123"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-200 mb-2">
                  Stadt
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="München"
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-200 mb-2">
                  Postleitzahl
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="80331"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-200 mb-2">
                  Land
                </label>
                <select
                  id="country"
                  name="country"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Land wählen</option>
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
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Zusätzliche Informationen über den Kunden..."
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    defaultChecked
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
              <button
                type="button"
                onClick={() => router.push('/de/admin/customers')}
                className="px-6 py-2 border border-gray-600 rounded-lg text-gray-200 hover:bg-gray-800/50"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Speichern...' : 'Kunde erstellen'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
