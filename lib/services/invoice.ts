'use server';

import { prisma } from '@/lib/prisma';
import { sendEmail, type SendEmailResult } from '@/lib/email';
import type { Invoice, InvoiceItem, Order, OrderItem, Customer, Prisma } from '@prisma/client';
import { promises as fsp } from 'fs';
import { join } from 'path';

interface GeneratedInvoice {
  invoice: Invoice;
  items: InvoiceItem[];
}

const INVOICE_STORAGE_DIR = join(process.cwd(), 'public', 'invoices');

const ensureInvoiceDir = async () => {
  await fsp.mkdir(INVOICE_STORAGE_DIR, { recursive: true });
};

const buildLegalNotice = () => 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.';

const escapePdfText = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const buildPdfBuffer = (lines: string[]) => {
  const textOps: string[] = ['BT', '/F1 12 Tf', '50 780 Td', '14 TL'];

  lines.forEach((line, index) => {
    const safeLine = escapePdfText(line);
    if (index === 0) {
      textOps.push(`(${safeLine}) Tj`);
    } else {
      textOps.push('T*', `(${safeLine}) Tj`);
    }
  });

  textOps.push('ET');

  const content = textOps.join('\n');
  const contentLength = Buffer.byteLength(content, 'utf8');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${contentLength} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];

  const header = '%PDF-1.4\n';
  const bodyParts: string[] = [];
  const offsets: number[] = [];

  let offset = Buffer.byteLength(header, 'utf8');

  objects.forEach((object, index) => {
    const section = `${index + 1} 0 obj\n${object}\nendobj\n`;
    bodyParts.push(section);
    offsets.push(offset);
    offset += Buffer.byteLength(section, 'utf8');
  });

  const xrefOffset = offset;

  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((entry) => {
    xref += `${entry.toString().padStart(10, '0')} 00000 n \n`;
  });

  const trailer = `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const pdfString = header + bodyParts.join('') + xref + trailer;
  return Buffer.from(pdfString, 'utf8');
};

const isSendEmailFailure = (
  result: SendEmailResult
): result is Extract<SendEmailResult, { success: false }> => result.success === false;

const calcTotals = (orderItems: Array<OrderItem | OrderWithRelations['orderItems'][number]>) => {
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return {
    subtotal,
    total: subtotal,
  };
};

const mapPaymentStatus = (paymentStatus?: string | null) => {
  if (!paymentStatus) {
    return 'UNPAID';
  }

  const normalized = paymentStatus.toString().toUpperCase();

  switch (normalized) {
    case 'PAID':
    case 'REFUNDED':
    case 'PARTIALLY_REFUNDED':
      return 'PAID';
    default:
      return 'UNPAID';
  }
};

const guessNames = (source?: { firstName?: string | null; lastName?: string | null; name?: string | null }) => {
  if (!source) {
    return { firstName: 'Unbekannt', lastName: '-' };
  }

  if (source.firstName || source.lastName) {
    return {
      firstName: source.firstName ?? 'Unbekannt',
      lastName: source.lastName ?? '-',
    };
  }

  if (source.name) {
    const parts = source.name.split(' ');
    return {
      firstName: parts[0] ?? 'Unbekannt',
      lastName: parts.slice(1).join(' ') || '-',
    };
  }

  return { firstName: 'Unbekannt', lastName: '-' };
};

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        gemstone: true;
      };
    };
    user: true;
    billingAddress: true;
    shippingAddress: true;
  };
}>;

const resolveCustomerForOrder = async (order: OrderWithRelations): Promise<Customer> => {
  const email = order.user?.email ?? null;

  if (email) {
    const existingByEmail = await prisma.customer.findFirst({ where: { email } });
    if (existingByEmail) {
      return existingByEmail;
    }
  }

  if (order.userId) {
    const existingByUser = await prisma.customer.findFirst({ where: { customerNumber: order.userId } });
    if (existingByUser) {
      return existingByUser;
    }
  }

  const address = order.billingAddress ?? order.shippingAddress;
  const names = guessNames({
    firstName: address?.firstName,
    lastName: address?.lastName,
    name: order.user?.name ?? undefined,
  });

  const customerNumber = `CUST-${Date.now()}`;

  return prisma.customer.create({
    data: {
      customerNumber,
      company: address?.company ?? null,
      firstName: names.firstName,
      lastName: names.lastName,
      email: email ?? `kunde-${customerNumber}@example.com`,
      phone: address?.phone ?? order.user?.phone ?? null,
      address: [address?.address1, address?.address2].filter(Boolean).join(' ') || 'Adresse unbekannt',
      postalCode: address?.postalCode ?? '00000',
      city: address?.city ?? 'Unbekannt',
      country: address?.country ?? 'Deutschland',
      notes: order.notes ?? null,
      isActive: true,
    },
  });
};

const createInvoiceNumber = async (customerId: string, order: Order) => {
  const lastInvoice = await prisma.invoice.findFirst({
    where: { customerId },
    orderBy: { createdAt: 'desc' },
  });

  if (order.orderNumber) {
    return `RE-${order.orderNumber}`;
  }

  if (!lastInvoice) {
    return `RE-${new Date().getFullYear()}-0001`;
  }

  const match = lastInvoice.invoiceNumber.match(/(\d+)$/);
  const next = match ? (parseInt(match[1], 10) + 1).toString().padStart(match[1].length, '0') : '0001';
  return lastInvoice.invoiceNumber.replace(/(\d+)$/, next);
};

const createOrUpdateInvoiceItems = async (
  invoiceId: string,
  orderItems: OrderWithRelations['orderItems']
) => {
  await prisma.invoiceItem.deleteMany({ where: { invoiceId } });
  await prisma.invoiceItem.createMany({
    data: orderItems.map((item, index) => ({
      invoiceId,
      description:
        item.gemstone?.name ??
        item.gemstone?.sku ??
        item.notes ??
        `Artikel ${index + 1}`,
      quantity: item.quantity,
      unitPrice: item.price,
      total: item.price * item.quantity,
      order: index,
    })),
  });

  return prisma.invoiceItem.findMany({ where: { invoiceId } });
};

export const generateInvoiceForOrder = async (orderId: string): Promise<GeneratedInvoice> => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          gemstone: true,
        },
      },
      user: true,
      billingAddress: true,
      shippingAddress: true,
    },
  });

  if (!order) throw new Error(`Bestellung ${orderId} nicht gefunden`);

  const customer = await resolveCustomerForOrder(order);
  const { subtotal, total } = calcTotals(order.orderItems);

  const existingInvoice = await prisma.invoice.findUnique({ where: { orderId } });

  if (existingInvoice) {
    const updatedInvoice = await prisma.invoice.update({
      where: { id: existingInvoice.id },
      data: {
        customerId: customer.id,
        subtotal,
        total,
        paymentStatus: mapPaymentStatus(order.paymentStatus),
        legalNotice: buildLegalNotice(),
        pdfUrl: null,
        emailSent: false,
        sentAt: null,
      },
    });

    const items = await createOrUpdateInvoiceItems(existingInvoice.id, order.orderItems);
    return { invoice: updatedInvoice, items };
  }

  const invoiceNumber = await createInvoiceNumber(customer.id, order);

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      customerId: customer.id,
      orderId,
      invoiceDate: new Date(),
      dueDate: new Date(),
      status: 'DRAFT',
      paymentStatus: mapPaymentStatus(order.paymentStatus),
      subtotal,
      total,
      legalNotice: buildLegalNotice(),
    },
  });

  const items = await createOrUpdateInvoiceItems(invoice.id, order.orderItems);
  return { invoice, items };
};

export const generateInvoicePDF = async (invoiceId: string): Promise<string> => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      customer: true,
      items: true,
      order: true,
    },
  });

  if (!invoice) throw new Error(`Rechnung ${invoiceId} nicht gefunden`);

  await ensureInvoiceDir();

  const fileName = `${invoice.invoiceNumber}.pdf`;
  const pdfPath = join(INVOICE_STORAGE_DIR, fileName);

  const lines: string[] = [
    'Gemilike – Rechnung',
    `Rechnungsnummer: ${invoice.invoiceNumber}`,
  ];

  if (invoice.order?.orderNumber) {
    lines.push(`Bestellnummer: ${invoice.order.orderNumber}`);
  }

  lines.push(
    `Rechnungsdatum: ${new Date(invoice.invoiceDate).toLocaleDateString('de-DE')}`,
    '',
    'Rechnung an:',
    `${invoice.customer?.firstName ?? ''} ${invoice.customer?.lastName ?? ''}`.trim(),
  );

  if (invoice.customer?.company) lines.push(invoice.customer.company);
  if (invoice.customer?.address) lines.push(invoice.customer.address);

  lines.push(
    `${invoice.customer?.postalCode ?? ''} ${invoice.customer?.city ?? ''}`.trim(),
    invoice.customer?.country ?? '',
    '',
    'Positionen:',
  );

  invoice.items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.description} – Menge: ${item.quantity} × ${item.unitPrice.toFixed(2)} € = ${item.total.toFixed(2)} €`,
    );
  });

  lines.push(
    '',
    `Zwischensumme: ${invoice.subtotal.toFixed(2)} €`,
    `Gesamtbetrag: ${invoice.total.toFixed(2)} €`,
    '',
    invoice.legalNotice ?? buildLegalNotice(),
  );

  const pdfBuffer = buildPdfBuffer(lines);
  await fsp.writeFile(pdfPath, pdfBuffer);

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      pdfUrl: `/invoices/${fileName}`,
    },
  });

  return `/invoices/${fileName}`;
};

export const sendInvoiceEmail = async (invoiceId: string) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { customer: true, order: true },
  });

  if (!invoice) throw new Error(`Rechnung ${invoiceId} nicht gefunden`);
  if (!invoice.customer?.email) {
    console.warn(`Keine E-Mail für Kunde der Rechnung ${invoice.invoiceNumber}`);
    return;
  }

  const pdfUrl = invoice.pdfUrl ?? (await generateInvoicePDF(invoiceId));
  const pdfAbsolutePath = join(process.cwd(), 'public', pdfUrl.replace(/^\//, ''));

  const emailResult = await sendEmail({
    to: invoice.customer.email,
    subject: `Ihre Rechnung ${invoice.invoiceNumber}`,
    text: `Sehr geehrte/r ${invoice.customer.firstName ?? ''} ${invoice.customer.lastName ?? ''},\n\n` +
      `im Anhang finden Sie Ihre Rechnung ${invoice.invoiceNumber}.\n\n` +
      `${invoice.legalNotice ?? buildLegalNotice()}\n\n` +
      'Vielen Dank für Ihren Einkauf bei Gemilike.',
    html: `
      <p>Sehr geehrte/r ${invoice.customer.firstName ?? ''} ${invoice.customer.lastName ?? ''},</p>
      <p>im Anhang finden Sie Ihre Rechnung <strong>${invoice.invoiceNumber}</strong>.</p>
      <p>${invoice.legalNotice ?? buildLegalNotice()}</p>
      <p>Vielen Dank für Ihren Einkauf bei Gemilike.</p>
    `,
    attachments: [
      {
        filename: pdfUrl.split('/').pop() ?? `${invoice.invoiceNumber}.pdf`,
        path: pdfAbsolutePath,
        contentType: 'application/pdf',
      },
    ],
  });

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      sentAt: emailResult.success ? new Date() : invoice.sentAt,
      emailSent: emailResult.success ? true : invoice.emailSent,
      status: emailResult.success ? 'SENT' : invoice.status,
    },
  });

  if (isSendEmailFailure(emailResult)) {
    throw new Error(`E-Mail Versand fehlgeschlagen: ${emailResult.error}`);
  }
};

export const regenerateAndSendInvoice = async (orderId: string) => {
  const { invoice } = await generateInvoiceForOrder(orderId);
  await generateInvoicePDF(invoice.id);
  await sendInvoiceEmail(invoice.id);
};
