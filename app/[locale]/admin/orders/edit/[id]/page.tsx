import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { OrderEditForm } from '@/components/admin/orders/OrderEditForm';
import { getOrderById } from '@/lib/services/shop/order.service';

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const invoice = await prisma.invoice.findFirst({
    where: { orderId: id },
    include: {
      customer: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const serialisedOrder = {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: order.subtotal,
    taxAmount: order.taxAmount,
    shippingAmount: order.shippingAmount,
    total: order.total,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    notes: order.notes,
    billingAddress: order.billingAddress,
    shippingAddress: order.shippingAddress,
  };


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

        <OrderEditForm order={serialisedOrder} />

        {invoice && (
          <div className="mt-6 bg-gray-800/20 border rounded-lg p-6 text-sm text-gray-200 space-y-2">
            <h2 className="text-lg font-semibold text-white">Rechnungsstatus</h2>
            <p>
              <span className="font-medium text-gray-100">Rechnung:</span>{' '}
              {invoice.invoiceNumber}
            </p>
            <p>
              <span className="font-medium text-gray-100">Empfänger:</span>{' '}
              {invoice.customer
                ? `${invoice.customer.firstName ?? ''} ${invoice.customer.lastName ?? ''}`.trim() ||
                  invoice.customer.email
                : '—'}
            </p>
            <p>
              <span className="font-medium text-gray-100">E-Mail:</span>{' '}
              {invoice.customer?.email ?? '—'}
            </p>
            <p>
              <span className="font-medium text-gray-100">Versendet:</span>{' '}
              {invoice.emailSent
                ? `Ja, zuletzt am ${
                    invoice.sentAt
                      ? new Date(invoice.sentAt).toLocaleString('de-DE')
                      : 'unbekannt'
                  }`
                : 'Nein'}
            </p>
            <p>
              <span className="font-medium text-gray-100">PDF:</span>{' '}
              {invoice.pdfStorageKey ? (
                <a
                  href={`/api/admin/invoices/${invoice.id}/pdf`}
                  className="text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
                >
                  herunterladen
                </a>
              ) : (
                'Noch nicht erzeugt'
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
