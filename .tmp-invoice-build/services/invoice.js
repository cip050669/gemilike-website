'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regenerateAndSendInvoice = exports.sendInvoiceEmail = exports.generateInvoicePDF = exports.generateInvoiceForOrder = void 0;
const prisma_1 = require("../prisma");
const email_1 = require("../email");
const fs_1 = require("fs");
const path_1 = require("path");
const INVOICE_STORAGE_DIR = (0, path_1.join)(process.cwd(), 'public', 'invoices');
const ensureInvoiceDir = async () => {
    await fs_1.promises.mkdir(INVOICE_STORAGE_DIR, { recursive: true });
};
const buildLegalNotice = () => 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.';
const escapePdfText = (value) => value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
const buildPdfBuffer = (lines) => {
    const textOps = ['BT', '/F1 12 Tf', '50 780 Td', '14 TL'];
    lines.forEach((line, index) => {
        const safeLine = escapePdfText(line);
        if (index === 0) {
            textOps.push(`(${safeLine}) Tj`);
        }
        else {
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
    const bodyParts = [];
    const offsets = [];
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
const isSendEmailFailure = (result) => result.success === false;
const calcTotals = (orderItems) => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
        subtotal,
        total: subtotal,
    };
};
const mapPaymentStatus = (paymentStatus) => {
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
const guessNames = (source) => {
    var _a, _b, _c;
    if (!source) {
        return { firstName: 'Unbekannt', lastName: '-' };
    }
    if (source.firstName || source.lastName) {
        return {
            firstName: (_a = source.firstName) !== null && _a !== void 0 ? _a : 'Unbekannt',
            lastName: (_b = source.lastName) !== null && _b !== void 0 ? _b : '-',
        };
    }
    if (source.name) {
        const parts = source.name.split(' ');
        return {
            firstName: (_c = parts[0]) !== null && _c !== void 0 ? _c : 'Unbekannt',
            lastName: parts.slice(1).join(' ') || '-',
        };
    }
    return { firstName: 'Unbekannt', lastName: '-' };
};
const resolveCustomerForOrder = async (order) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const email = (_b = (_a = order.user) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : null;
    if (email) {
        const existingByEmail = await prisma_1.prisma.customer.findFirst({ where: { email } });
        if (existingByEmail) {
            return existingByEmail;
        }
    }
    if (order.userId) {
        const existingByUser = await prisma_1.prisma.customer.findFirst({ where: { customerNumber: order.userId } });
        if (existingByUser) {
            return existingByUser;
        }
    }
    const address = (_c = order.billingAddress) !== null && _c !== void 0 ? _c : order.shippingAddress;
    const names = guessNames({
        firstName: address === null || address === void 0 ? void 0 : address.firstName,
        lastName: address === null || address === void 0 ? void 0 : address.lastName,
        name: (_e = (_d = order.user) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : undefined,
    });
    const customerNumber = `CUST-${Date.now()}`;
    return prisma_1.prisma.customer.create({
        data: {
            customerNumber,
            company: (_f = address === null || address === void 0 ? void 0 : address.company) !== null && _f !== void 0 ? _f : null,
            firstName: names.firstName,
            lastName: names.lastName,
            email: email !== null && email !== void 0 ? email : `kunde-${customerNumber}@example.com`,
            phone: (_j = (_g = address === null || address === void 0 ? void 0 : address.phone) !== null && _g !== void 0 ? _g : (_h = order.user) === null || _h === void 0 ? void 0 : _h.phone) !== null && _j !== void 0 ? _j : null,
            address: [address === null || address === void 0 ? void 0 : address.address1, address === null || address === void 0 ? void 0 : address.address2].filter(Boolean).join(' ') || 'Adresse unbekannt',
            postalCode: (_k = address === null || address === void 0 ? void 0 : address.postalCode) !== null && _k !== void 0 ? _k : '00000',
            city: (_l = address === null || address === void 0 ? void 0 : address.city) !== null && _l !== void 0 ? _l : 'Unbekannt',
            country: (_m = address === null || address === void 0 ? void 0 : address.country) !== null && _m !== void 0 ? _m : 'Deutschland',
            notes: (_o = order.notes) !== null && _o !== void 0 ? _o : null,
            isActive: true,
        },
    });
};
const createInvoiceNumber = async (customerId, order) => {
    const lastInvoice = await prisma_1.prisma.invoice.findFirst({
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
const createOrUpdateInvoiceItems = async (invoiceId, orderItems) => {
    await prisma_1.prisma.invoiceItem.deleteMany({ where: { invoiceId } });
    await prisma_1.prisma.invoiceItem.createMany({
        data: orderItems.map((item, index) => {
            var _a, _b, _c, _d, _e;
            return ({
                invoiceId,
                description: (_e = (_d = (_b = (_a = item.gemstone) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : (_c = item.gemstone) === null || _c === void 0 ? void 0 : _c.sku) !== null && _d !== void 0 ? _d : item.notes) !== null && _e !== void 0 ? _e : `Artikel ${index + 1}`,
                quantity: item.quantity,
                unitPrice: item.price,
                total: item.price * item.quantity,
                order: index,
            });
        }),
    });
    return prisma_1.prisma.invoiceItem.findMany({ where: { invoiceId } });
};
const generateInvoiceForOrder = async (orderId) => {
    const order = await prisma_1.prisma.order.findUnique({
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
    if (!order)
        throw new Error(`Bestellung ${orderId} nicht gefunden`);
    const customer = await resolveCustomerForOrder(order);
    const { subtotal, total } = calcTotals(order.orderItems);
    const existingInvoice = await prisma_1.prisma.invoice.findUnique({ where: { orderId } });
    if (existingInvoice) {
        const updatedInvoice = await prisma_1.prisma.invoice.update({
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
    const invoice = await prisma_1.prisma.invoice.create({
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
exports.generateInvoiceForOrder = generateInvoiceForOrder;
const generateInvoicePDF = async (invoiceId) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const invoice = await prisma_1.prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
            customer: true,
            items: true,
            order: true,
        },
    });
    if (!invoice)
        throw new Error(`Rechnung ${invoiceId} nicht gefunden`);
    await ensureInvoiceDir();
    const fileName = `${invoice.invoiceNumber}.pdf`;
    const pdfPath = (0, path_1.join)(INVOICE_STORAGE_DIR, fileName);
    const lines = [
        'Gemilike – Rechnung',
        `Rechnungsnummer: ${invoice.invoiceNumber}`,
    ];
    if ((_a = invoice.order) === null || _a === void 0 ? void 0 : _a.orderNumber) {
        lines.push(`Bestellnummer: ${invoice.order.orderNumber}`);
    }
    lines.push(`Rechnungsdatum: ${new Date(invoice.invoiceDate).toLocaleDateString('de-DE')}`, '', 'Rechnung an:', `${(_c = (_b = invoice.customer) === null || _b === void 0 ? void 0 : _b.firstName) !== null && _c !== void 0 ? _c : ''} ${(_e = (_d = invoice.customer) === null || _d === void 0 ? void 0 : _d.lastName) !== null && _e !== void 0 ? _e : ''}`.trim());
    if ((_f = invoice.customer) === null || _f === void 0 ? void 0 : _f.company)
        lines.push(invoice.customer.company);
    if ((_g = invoice.customer) === null || _g === void 0 ? void 0 : _g.address)
        lines.push(invoice.customer.address);
    lines.push(`${(_j = (_h = invoice.customer) === null || _h === void 0 ? void 0 : _h.postalCode) !== null && _j !== void 0 ? _j : ''} ${(_l = (_k = invoice.customer) === null || _k === void 0 ? void 0 : _k.city) !== null && _l !== void 0 ? _l : ''}`.trim(), (_o = (_m = invoice.customer) === null || _m === void 0 ? void 0 : _m.country) !== null && _o !== void 0 ? _o : '', '', 'Positionen:');
    invoice.items.forEach((item, index) => {
        lines.push(`${index + 1}. ${item.description} – Menge: ${item.quantity} × ${item.unitPrice.toFixed(2)} € = ${item.total.toFixed(2)} €`);
    });
    lines.push('', `Zwischensumme: ${invoice.subtotal.toFixed(2)} €`, `Gesamtbetrag: ${invoice.total.toFixed(2)} €`, '', (_p = invoice.legalNotice) !== null && _p !== void 0 ? _p : buildLegalNotice());
    const pdfBuffer = buildPdfBuffer(lines);
    await fs_1.promises.writeFile(pdfPath, pdfBuffer);
    await prisma_1.prisma.invoice.update({
        where: { id: invoiceId },
        data: {
            pdfUrl: `/invoices/${fileName}`,
        },
    });
    return `/invoices/${fileName}`;
};
exports.generateInvoicePDF = generateInvoicePDF;
const sendInvoiceEmail = async (invoiceId) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const invoice = await prisma_1.prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { customer: true, order: true },
    });
    if (!invoice)
        throw new Error(`Rechnung ${invoiceId} nicht gefunden`);
    if (!((_a = invoice.customer) === null || _a === void 0 ? void 0 : _a.email)) {
        console.warn(`Keine E-Mail für Kunde der Rechnung ${invoice.invoiceNumber}`);
        return;
    }
    const pdfUrl = (_b = invoice.pdfUrl) !== null && _b !== void 0 ? _b : (await (0, exports.generateInvoicePDF)(invoiceId));
    const pdfAbsolutePath = (0, path_1.join)(process.cwd(), 'public', pdfUrl.replace(/^\//, ''));
    const emailResult = await (0, email_1.sendEmail)({
        to: invoice.customer.email,
        subject: `Ihre Rechnung ${invoice.invoiceNumber}`,
        text: `Sehr geehrte/r ${(_c = invoice.customer.firstName) !== null && _c !== void 0 ? _c : ''} ${(_d = invoice.customer.lastName) !== null && _d !== void 0 ? _d : ''},\n\n` +
            `im Anhang finden Sie Ihre Rechnung ${invoice.invoiceNumber}.\n\n` +
            `${(_e = invoice.legalNotice) !== null && _e !== void 0 ? _e : buildLegalNotice()}\n\n` +
            'Vielen Dank für Ihren Einkauf bei Gemilike.',
        html: `
      <p>Sehr geehrte/r ${(_f = invoice.customer.firstName) !== null && _f !== void 0 ? _f : ''} ${(_g = invoice.customer.lastName) !== null && _g !== void 0 ? _g : ''},</p>
      <p>im Anhang finden Sie Ihre Rechnung <strong>${invoice.invoiceNumber}</strong>.</p>
      <p>${(_h = invoice.legalNotice) !== null && _h !== void 0 ? _h : buildLegalNotice()}</p>
      <p>Vielen Dank für Ihren Einkauf bei Gemilike.</p>
    `,
        attachments: [
            {
                filename: (_j = pdfUrl.split('/').pop()) !== null && _j !== void 0 ? _j : `${invoice.invoiceNumber}.pdf`,
                path: pdfAbsolutePath,
                contentType: 'application/pdf',
            },
        ],
    });
    await prisma_1.prisma.invoice.update({
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
exports.sendInvoiceEmail = sendInvoiceEmail;
const regenerateAndSendInvoice = async (orderId) => {
    const { invoice } = await (0, exports.generateInvoiceForOrder)(orderId);
    await (0, exports.generateInvoicePDF)(invoice.id);
    await (0, exports.sendInvoiceEmail)(invoice.id);
};
exports.regenerateAndSendInvoice = regenerateAndSendInvoice;
