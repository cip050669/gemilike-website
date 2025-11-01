import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { userId } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { invoiceId } = await params;

    // Get customer for this user
    const customer = await prisma.customer.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Get invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Verify customer owns this invoice
    if (invoice.customerId !== customer.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check DownloadGrant
    const grant = await prisma.downloadGrant.findFirst({
      where: {
        customerId: customer.id,
        resourceType: 'INVOICE',
        resourceKey: invoiceId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });

    if (!grant) {
      return NextResponse.json(
        { success: false, error: 'Download grant not found or expired' },
        { status: 403 }
      );
    }

    // Check max downloads
    if (grant.maxDownloads && grant.downloadCount >= grant.maxDownloads) {
      return NextResponse.json(
        { success: false, error: 'Maximum download limit reached' },
        { status: 403 }
      );
    }

    // Generate PDF if not exists
    if (!invoice.pdfStorageKey) {
      const { generateInvoicePDF } = await import('@/lib/services/invoice');
      await generateInvoicePDF(invoiceId);
      
      // Reload invoice to get updated pdfStorageKey
      const updatedInvoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
      });
      
      if (!updatedInvoice?.pdfStorageKey) {
        return NextResponse.json(
          { success: false, error: 'Failed to generate PDF' },
          { status: 500 }
        );
      }
    }

    // Read PDF file
    const pdfPath = join(process.cwd(), 'public', invoice.pdfStorageKey.replace(/^\//, ''));
    const pdfBuffer = await readFile(pdfPath);

    // Update download count
    await prisma.downloadGrant.update({
      where: { id: grant.id },
      data: {
        downloadCount: grant.downloadCount + 1,
        lastDownloadedAt: new Date(),
      },
    });

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error downloading invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to download invoice' },
      { status: 500 }
    );
  }
}

