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

const INVOICE_STORAGE_DIR = join(/* turbopackIgnore: true */ process.cwd(), 'public', 'invoices');

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

const calcTotals = (orderItems: Array<OrderItem | OrderWithRelations['items'][number]>) => {
  const subtotal = orderItems.reduce((sum, item) => {
    const unitPrice = typeof item.unitPrice === 'number' ? item.unitPrice : Number(item.unitPrice);
    const quantity = typeof item.quantity === 'number' ? item.quantity : Number(item.quantity);
    return sum + unitPrice * quantity;
  }, 0);
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
      return 'PAID';
    case 'UNPAID':
      return 'UNPAID';
    case 'PENDING':
      return 'PENDING';
    case 'FAILED':
      return 'FAILED';
    case 'REFUNDED':
      return 'REFUNDED';
    default:
      return 'UNPAID';
  }
};

type OrderWithRelations = Order & {
  items: Array<
    OrderItem & {
      gemstone: Prisma.GemstoneGetPayload<{
        include: { attributes: true; inventory: true; media: true };
      }> | null;
    }
  >;
  customer: Customer | null;
  billingAddress: Prisma.AddressGetPayload<object> | null;
  shippingAddress: Prisma.AddressGetPayload<object> | null;
};

const resolveCustomerForOrder = async (order: OrderWithRelations): Promise<Customer> => {
  if (order.customer) {
    return order.customer;
  }

  throw new Error('Kunde für Bestellung nicht gefunden');
};

const createInvoiceNumber = async (): Promise<string> => {
  const companySettings = await prisma.companySettings.findFirst();
  if (!companySettings) {
    throw new Error('Firmeneinstellungen nicht gefunden');
  }

  const invoiceNumber = `${companySettings.invoicePrefix}-${companySettings.nextInvoiceNumber.toString().padStart(4, '0')}`;

  await prisma.companySettings.update({
    where: { id: companySettings.id },
    data: {
      nextInvoiceNumber: companySettings.nextInvoiceNumber + 1,
    },
  });

  return invoiceNumber;
};

const createOrUpdateInvoiceItems = async (
  invoiceId: string,
  orderItems: OrderWithRelations['items']
): Promise<InvoiceItem[]> => {
  await prisma.invoiceItem.deleteMany({
    where: { invoiceId },
  });

  await Promise.all(
    orderItems.map(async (item, index) => {
      const unitPrice = typeof item.unitPrice === 'number' ? item.unitPrice : Number(item.unitPrice);
      const quantity = typeof item.quantity === 'number' ? item.quantity : Number(item.quantity);
      const total = unitPrice * quantity;

      return prisma.invoiceItem.create({
        data: {
          invoiceId,
          description: item.gemstone?.name ?? item.description ?? 'Artikel',
          quantity,
          unitPrice,
          taxRate: 0,
          total,
          position: index,
        },
      });
    })
  );

  return prisma.invoiceItem.findMany({ where: { invoiceId } });
};

export const generateInvoiceForOrder = async (orderId: string): Promise<GeneratedInvoice> => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          gemstone: {
            include: {
              attributes: true,
              inventory: true,
              media: true,
            },
          },
        },
      },
      customer: true,
      billingAddress: true,
      shippingAddress: true,
    },
  });

  if (!order) throw new Error(`Bestellung ${orderId} nicht gefunden`);

  const customer = await resolveCustomerForOrder(order as OrderWithRelations);
  const { subtotal, total } = calcTotals((order as OrderWithRelations).items);

  const existingInvoice = await prisma.invoice.findUnique({ where: { orderId } });

  if (existingInvoice) {
    const updatedInvoice = await prisma.invoice.update({
      where: { id: existingInvoice.id },
      data: {
        customerId: customer.id,
        subtotal,
        taxAmount: 0, // No VAT for small business
        total,
        currency: order.currency || 'EUR',
        paymentStatus: mapPaymentStatus(order.paymentStatus),
        legalNotice: buildLegalNotice(),
        pdfStorageKey: null,
        emailSent: false,
        sentAt: null,
      },
    });

    const items = await createOrUpdateInvoiceItems(existingInvoice.id, (order as OrderWithRelations).items);
    
    // Create DownloadGrant for invoice PDF
    await createInvoiceDownloadGrant(updatedInvoice.id, customer.id, orderId);
    
    return { invoice: updatedInvoice, items };
  }

  const invoiceNumber = await createInvoiceNumber();

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
      taxAmount: 0, // No VAT for small business
      total,
      currency: order.currency || 'EUR',
      legalNotice: buildLegalNotice(),
    },
  });

  const items = await createOrUpdateInvoiceItems(invoice.id, (order as OrderWithRelations).items);
  
  // Create DownloadGrant for invoice PDF
  await createInvoiceDownloadGrant(invoice.id, customer.id, orderId);
  
  return { invoice, items };
};

// Create DownloadGrant for invoice PDF
const createInvoiceDownloadGrant = async (invoiceId: string, customerId: string, orderId: string | null) => {
  // Check if grant already exists
  const existingGrant = await prisma.downloadGrant.findFirst({
    where: {
      customerId,
      orderId: orderId || undefined,
      resourceType: 'INVOICE',
      resourceKey: invoiceId,
    },
  });

  if (existingGrant) {
    return existingGrant;
  }

  // Create new grant (valid for 5 years)
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 5);

  return prisma.downloadGrant.create({
    data: {
      customerId,
      orderId: orderId || undefined,
      resourceType: 'INVOICE',
      resourceKey: invoiceId,
      expiresAt,
      maxDownloads: 10, // Allow 10 downloads
    },
  });
};

export const generateInvoicePDF = async (invoiceId: string): Promise<string> => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      customer: {
        include: {
          billingAddress: true,
          shippingAddress: true,
        },
      },
      items: true,
      order: {
        include: {
          billingAddress: true,
          shippingAddress: true,
        },
      },
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
  
  // Get address from order billing address or customer billing address
  const address = invoice.order?.billingAddress ?? invoice.customer?.billingAddress;
  if (address && address.street) {
    lines.push(address.street);
  }

  lines.push(
    `${address?.postalCode ?? ''} ${address?.city ?? ''}`.trim(),
    address?.country ?? 'Deutschland',
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
      pdfStorageKey: `/invoices/${fileName}`,
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

  let pdfStorageKey = invoice.pdfStorageKey;
  if (!pdfStorageKey) {
    pdfStorageKey = await generateInvoicePDF(invoiceId);
  }
  const pdfAbsolutePath = join(
    /* turbopackIgnore: true */ process.cwd(),
    'public',
    pdfStorageKey.replace(/^\//, '')
  );

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
        filename: pdfStorageKey.split('/').pop() ?? `${invoice.invoiceNumber}.pdf`,
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
