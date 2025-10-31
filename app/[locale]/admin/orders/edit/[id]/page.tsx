import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { OrderEditForm } from '@/components/admin/orders/OrderEditForm';

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        }
      },
      items: {
        include: {
          gemstone: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      },
      billingAddress: true,
      shippingAddress: true,
      invoice: {
        include: {
          customer: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    }
  });

  if (!order) {
    notFound();
  }

  const serialisedOrder = JSON.parse(
    JSON.stringify({
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
    })
  );


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

        {order.invoice && (
          <div className="mt-6 bg-gray-800/20 border rounded-lg p-6 text-sm text-gray-200 space-y-2">
            <h2 className="text-lg font-semibold text-white">Rechnungsstatus</h2>
            <p>
              <span className="font-medium text-gray-100">Rechnung:</span>{' '}
              {order.invoice.invoiceNumber}
            </p>
            <p>
              <span className="font-medium text-gray-100">Empfänger:</span>{' '}
              {order.invoice.customer
                ? `${order.invoice.customer.firstName ?? ''} ${order.invoice.customer.lastName ?? ''}`.trim() ||
                  order.invoice.customer.email
                : '—'}
            </p>
            <p>
              <span className="font-medium text-gray-100">E-Mail:</span>{' '}
              {order.invoice.customer?.email ?? '—'}
            </p>
            <p>
              <span className="font-medium text-gray-100">Versendet:</span>{' '}
              {order.invoice.emailSent
                ? `Ja, zuletzt am ${
                    order.invoice.sentAt
                      ? new Date(order.invoice.sentAt).toLocaleString('de-DE')
                      : 'unbekannt'
                  }`
                : 'Nein'}
            </p>
            <p>
              <span className="font-medium text-gray-100">PDF:</span>{' '}
              {order.invoice.pdfStorageKey ? (
                <a
                  href={`/api/admin/invoices/${order.invoice.id}/pdf`}
                  className="text-blue-400 underline underline-offset-4 hover:text-blue-300"
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
