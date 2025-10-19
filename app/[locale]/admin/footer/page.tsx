'use client';

import { useState } from 'react';

export default function FooterAdminPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch('/api/admin/footer', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ ' + result.message);
      } else {
        setMessage('❌ ' + result.message);
      }
    } catch (error) {
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
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Footer-Verwaltung</h1>
          <p className="text-gray-600">
            Verwalten Sie den Footer-Inhalt und die Links
          </p>
        </div>

        {/* Footer Content Management */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Footer-Inhalt</h2>
          
          <div className="space-y-6">
            {/* Company Info */}
            <div>
              <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-2">
                Firmenname
              </label>
              <input
                type="text"
                id="company-name"
                name="company-name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Gemilike - Heroes in Gems"
              />
            </div>

            <div>
              <label htmlFor="company-description" className="block text-sm font-medium text-gray-700 mb-2">
                Firmenbeschreibung
              </label>
              <textarea
                id="company-description"
                name="company-description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ihr Spezialist für rohe und geschliffene Edelsteine..."
              ></textarea>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="info@gemilike.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+49 123 456789"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <textarea
                id="address"
                name="address"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Musterstraße 123, 12345 Musterstadt"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Footer-Links</h2>
          
          <div className="space-y-4">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-medium mb-3">Schnelllinks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="link1-text" className="block text-sm font-medium text-gray-700 mb-1">
                    Link 1 Text
                  </label>
                  <input
                    type="text"
                    id="link1-text"
                    name="link1-text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Über uns"
                  />
                </div>
                <div>
                  <label htmlFor="link1-url" className="block text-sm font-medium text-gray-700 mb-1">
                    Link 1 URL
                  </label>
                  <input
                    type="url"
                    id="link1-url"
                    name="link1-url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/about"
                  />
                </div>
                <div>
                  <label htmlFor="link2-text" className="block text-sm font-medium text-gray-700 mb-1">
                    Link 2 Text
                  </label>
                  <input
                    type="text"
                    id="link2-text"
                    name="link2-text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Kontakt"
                  />
                </div>
                <div>
                  <label htmlFor="link2-url" className="block text-sm font-medium text-gray-700 mb-1">
                    Link 2 URL
                  </label>
                  <input
                    type="url"
                    id="link2-url"
                    name="link2-url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/contact"
                  />
                </div>
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-lg font-medium mb-3">Rechtliches</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="privacy-text" className="block text-sm font-medium text-gray-700 mb-1">
                    Datenschutz Text
                  </label>
                  <input
                    type="text"
                    id="privacy-text"
                    name="privacy-text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Datenschutz"
                  />
                </div>
                <div>
                  <label htmlFor="privacy-url" className="block text-sm font-medium text-gray-700 mb-1">
                    Datenschutz URL
                  </label>
                  <input
                    type="url"
                    id="privacy-url"
                    name="privacy-url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/privacy"
                  />
                </div>
                <div>
                  <label htmlFor="terms-text" className="block text-sm font-medium text-gray-700 mb-1">
                    AGB Text
                  </label>
                  <input
                    type="text"
                    id="terms-text"
                    name="terms-text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="AGB"
                  />
                </div>
                <div>
                  <label htmlFor="terms-url" className="block text-sm font-medium text-gray-700 mb-1">
                    AGB URL
                  </label>
                  <input
                    type="url"
                    id="terms-url"
                    name="terms-url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/terms"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="facebook-url" className="block text-sm font-medium text-gray-700 mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                id="facebook-url"
                name="facebook-url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://facebook.com/gemilike"
              />
            </div>
            <div>
              <label htmlFor="instagram-url" className="block text-sm font-medium text-gray-700 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                id="instagram-url"
                name="instagram-url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/gemilike"
              />
            </div>
            <div>
              <label htmlFor="twitter-url" className="block text-sm font-medium text-gray-700 mb-1">
                Twitter URL
              </label>
              <input
                type="url"
                id="twitter-url"
                name="twitter-url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://twitter.com/gemilike"
              />
            </div>
            <div>
              <label htmlFor="linkedin-url" className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                id="linkedin-url"
                name="linkedin-url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/company/gemilike"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Copyright</h2>
          
          <div>
            <label htmlFor="copyright-text" className="block text-sm font-medium text-gray-700 mb-2">
              Copyright Text
            </label>
            <input
              type="text"
              id="copyright-text"
              name="copyright-text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="© 2025 Gemilike. Alle Rechte vorbehalten."
            />
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <form onSubmit={handleSubmit}>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Speichern...' : 'Footer speichern'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}