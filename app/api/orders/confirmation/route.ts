import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates, validateEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      orderNumber, 
      customerEmail, 
      customerName, 
      orderDate, 
      totalAmount, 
      currency = 'EUR',
      items,
      locale = 'de' 
    } = body;

    // Validate required fields
    if (!orderNumber || !customerEmail || !customerName || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(customerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.log('SMTP not configured, logging order confirmation:', { orderNumber, customerEmail });
      return NextResponse.json(
        { message: 'Order confirmation logged (SMTP not configured)' },
        { status: 200 }
      );
    }

    // Send order confirmation email
    const emailResult = await sendEmail({
      to: customerEmail,
      subject: emailTemplates.orderConfirmation.subject(locale, orderNumber),
      html: emailTemplates.orderConfirmation.html({
        orderNumber,
        customerName,
        orderDate: orderDate || new Date().toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US'),
        totalAmount,
        currency,
        items,
        locale,
      }),
    });

    if (!emailResult.success) {
      console.error('Failed to send order confirmation email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send order confirmation email' },
        { status: 500 }
      );
    }

    // Send admin notification
    const adminEmailResult = await sendEmail({
      to: process.env.SMTP_USER,
      subject: `Neue Bestellung #${orderNumber} - Gemilike`,
      html: `
        <h2>Neue Bestellung eingegangen</h2>
        <p><strong>Bestellnummer:</strong> #${orderNumber}</p>
        <p><strong>Kunde:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Gesamtbetrag:</strong> ${totalAmount.toFixed(2)} ${currency}</p>
        <p><strong>Artikel:</strong></p>
        <ul>
          ${items.map((item: any) => `<li>${item.name} (${item.quantity}x) - ${item.price.toFixed(2)} ${currency}</li>`).join('')}
        </ul>
        <p>Bitte bearbeiten Sie die Bestellung in Ihrem Admin-Panel.</p>
      `,
    });

    console.log('Order confirmation emails sent successfully:', {
      customer: emailResult.messageId,
      admin: adminEmailResult.messageId
    });

    return NextResponse.json(
      { 
        message: locale === 'de' 
          ? 'Bestellbestätigung erfolgreich gesendet' 
          : 'Order confirmation sent successfully',
        messageIds: {
          customer: emailResult.messageId,
          admin: adminEmailResult.messageId
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Order confirmation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
