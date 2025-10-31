'use client';

import { useState, useTransition } from 'react';

type AddressInfo = {
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  address1?: string | null;
  address2?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;
  phone?: string | null;
};

type OrderEditData = {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  paymentMethod?: string | null;
  paymentStatus: string;
  shippingMethod?: string | null;
  trackingNumber?: string | null;
  notes?: string | null;
  billingAddress?: AddressInfo | null;
  shippingAddress?: AddressInfo | null;
};

type ApiResponse =
  | {
      success: true;
      data: OrderEditData;
      message?: string;
      invoiceDispatched?: boolean;
      invoiceTriggered?: boolean;
      invoiceError?: string;
    }
  | {
      success: false;
      error: string;
      invoiceError?: string;
    };

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Ausstehend' },
  { value: 'CONFIRMED', label: 'Bestätigt' },
  { value: 'FULFILLED', label: 'Erfüllt' },
  { value: 'CANCELLED', label: 'Storniert' },
  { value: 'REFUNDED', label: 'Erstattet' },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: 'UNPAID', label: 'Unbezahlt' },
  { value: 'PENDING', label: 'Ausstehend' },
  { value: 'PAID', label: 'Bezahlt' },
  { value: 'FAILED', label: 'Fehlgeschlagen' },
  { value: 'REFUNDED', label: 'Erstattet' },
];

const buildMessage = (response: ApiResponse) => {
  if (!response.success) {
    const errorDetails = response.invoiceError ? ` – Rechnung: ${response.invoiceError}` : '';
    return `❌ ${response.error}${errorDetails}`;
  }

  const parts: string[] = [];
  parts.push(response.message || '✅ Bestellung aktualisiert');

  if (response.invoiceDispatched) {
    parts.push('📧 Rechnung wurde erzeugt und versendet (E-Mail-Queue geprüft).');
  } else if (response.invoiceTriggered) {
    parts.push('ℹ️ Rechnung wurde vorbereitet; Versandstatus unverändert.');
  }

  if (response.invoiceError) {
    parts.push(`⚠️ Rechnung konnte nicht versendet werden: ${response.invoiceError}`);
  }

  return parts.join(' ');
};

export function OrderEditForm({ order }: { order: OrderEditData }) {
  const [message, setMessage] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      orderNumber: formData.get('orderNumber'),
      status: formData.get('status'),
      total: formData.get('total'),
      subtotal: formData.get('subtotal'),
      taxAmount: formData.get('taxAmount'),
      shippingAmount: formData.get('shippingAmount'),
      paymentMethod: formData.get('paymentMethod'),
      paymentStatus: formData.get('paymentStatus'),
      shippingMethod: formData.get('shippingMethod'),
      trackingNumber: formData.get('trackingNumber'),
      notes: formData.get('notes'),
    };

    startTransition(async () => {
      try {
        setMessage('');
        const response = await fetch(`/api/admin/orders/${order.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = (await response.json()) as ApiResponse;
        setMessage(buildMessage(data));

        if (!response.ok) {
          console.warn('Order update failed', data);
        }
      } catch (error) {
        console.error('Order update failed', error);
        setMessage('❌ Unerwarteter Fehler beim Aktualisieren der Bestellung.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/30 rounded-lg shadow-sm border p-6 space-y-6">
      {message && (
        <div
          role="status"
          className={`rounded-lg px-4 py-3 text-sm text-white ${
            message.startsWith('❌')
              ? 'bg-red-600/80'
              : message.includes('⚠️')
              ? 'bg-yellow-600/80'
              : 'bg-emerald-600/80'
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

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

        <div>
          <label htmlFor="taxAmount" className="block text-sm font-medium text-gray-200 mb-2">
            Steuer (€)
          </label>
          <input
            type="number"
            id="taxAmount"
            name="taxAmount"
            step="0.01"
            defaultValue={order.taxAmount}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="shippingAmount" className="block text-sm font-medium text-gray-200 mb-2">
            Versand (€)
          </label>
          <input
            type="number"
            id="shippingAmount"
            name="shippingAmount"
            step="0.01"
            defaultValue={order.shippingAmount}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-200 mb-2">
            Zahlungsmethode
          </label>
          <input
            type="text"
            id="paymentMethod"
            name="paymentMethod"
            defaultValue={order.paymentMethod ?? ''}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
            {PAYMENT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="shippingMethod" className="block text-sm font-medium text-gray-200 mb-2">
            Versandmethode
          </label>
          <input
            type="text"
            id="shippingMethod"
            name="shippingMethod"
            defaultValue={order.shippingMethod ?? ''}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-200 mb-2">
            Tracking-Nummer
          </label>
          <input
            type="text"
            id="trackingNumber"
            name="trackingNumber"
            defaultValue={order.trackingNumber ?? ''}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-200 mb-2">
            Notizen
          </label>
          <textarea
            id="notes"
            name="notes"
            defaultValue={order.notes ?? ''}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center bg-blue-600 px-6 py-3 font-medium text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
          disabled={isPending}
        >
          {isPending ? 'Speichern…' : 'Speichern'}
        </button>
      </div>
    </form>
  );
}
