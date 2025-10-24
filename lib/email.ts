import nodemailer from 'nodemailer';

type SendEmailResult =
  | { success: true; messageId: string }
  | { success: false; error: string };

interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

const smtpHost = process.env.SMTP_HOST || 'smtp.strato.de';
const smtpPort = Number.parseInt(process.env.SMTP_PORT || '587', 10);
const smtpSecure = process.env.SMTP_SECURE === 'true';
const smtpUser = process.env.SMTP_USER || 'info@gemilike.com';
const smtpPassword = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || '';
const smtpFrom = process.env.SMTP_FROM || smtpUser || 'noreply@gemilike.com';

// SMTP-Konfiguration
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

// E-Mail senden
export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<SendEmailResult> {
  try {
    const info = await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      html,
      text,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown email error';
    console.error('E-Mail-Versand Fehler:', error);
    return { success: false, error: message };
  }
}

// E-Mail-Validierung
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

type NewsletterCampaignTemplateInput = {
  subject: string;
  content: string;
  unsubscribeLink: string;
  locale?: 'de' | 'en';
};

// E-Mail-Templates
export const emailTemplates = {
  newsletter: {
    de: (email: string) => ({
      subject: 'Newsletter-Anmeldung - Gemilike',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Willkommen bei unserem Newsletter!</h1>
          <p>Vielen Dank für Ihre Anmeldung zu unserem Newsletter.</p>
          <p>Ihre E-Mail-Adresse: ${email}</p>
        </div>
      `,
    }),
    en: (email: string) => ({
      subject: 'Newsletter Subscription - Gemilike',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to our newsletter!</h1>
          <p>Thank you for subscribing to our newsletter.</p>
          <p>Your email address: ${email}</p>
        </div>
      `,
    }),
  },
  newsletterCampaign: ({ subject, content, unsubscribeLink, locale = 'de' }: NewsletterCampaignTemplateInput) => {
    const greetings =
      locale === 'de'
        ? { headline: 'Neuigkeiten & Highlights', footer: 'Sie können sich jederzeit vom Newsletter abmelden.' }
        : { headline: 'News & Highlights', footer: 'You can unsubscribe from the newsletter at any time.' };

    return {
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #111827;">
          <div style="padding: 24px; background: linear-gradient(135deg, #111827, #1f2937); border-radius: 16px 16px 0 0;">
            <h1 style="margin: 0; color: #fff; font-size: 24px;">Gemilike</h1>
            <p style="margin: 8px 0 0; color: #d1d5db; font-size: 16px;">${greetings.headline}</p>
          </div>
          <div style="padding: 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
            <div style="font-size: 16px; line-height: 1.6; white-space: pre-line;">${content}</div>
            <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;" />
            <p style="font-size: 14px; color: #6b7280;">${greetings.footer}</p>
            <a href="${unsubscribeLink}" style="display: inline-block; margin-top: 12px; font-size: 14px; color: #2563eb;">
              Newsletter abmelden
            </a>
          </div>
        </div>
      `,
    };
  },
  orderConfirmation: {
    subject: (locale: string, orderNumber: string) => 
      locale === 'de' 
        ? `Bestellbestätigung #${orderNumber} - Gemilike`
        : `Order Confirmation #${orderNumber} - Gemilike`,
    html: ({
      orderNumber,
      customerName,
      orderDate,
      totalAmount,
      currency,
      items,
      locale = 'de'
    }: {
      orderNumber: string;
      customerName: string;
      orderDate: string;
      totalAmount: number;
      currency: string;
      items: Array<{ name: string; quantity: number; price: number }>;
      locale?: string;
    }) => {
      const isGerman = locale === 'de';
      const texts = isGerman ? {
        title: 'Bestellbestätigung',
        orderNumber: 'Bestellnummer',
        customer: 'Kunde',
        date: 'Datum',
        items: 'Artikel',
        quantity: 'Menge',
        price: 'Preis',
        total: 'Gesamtbetrag',
        thankYou: 'Vielen Dank für Ihre Bestellung!',
        footer: 'Ihre Bestellung wird in Kürze bearbeitet.'
      } : {
        title: 'Order Confirmation',
        orderNumber: 'Order Number',
        customer: 'Customer',
        date: 'Date',
        items: 'Items',
        quantity: 'Quantity',
        price: 'Price',
        total: 'Total Amount',
        thankYou: 'Thank you for your order!',
        footer: 'Your order will be processed shortly.'
      };

      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
          <div style="padding: 24px; background: linear-gradient(135deg, #111827, #1f2937); border-radius: 16px 16px 0 0;">
            <h1 style="margin: 0; color: #fff; font-size: 24px;">Gemilike</h1>
            <p style="margin: 8px 0 0; color: #d1d5db; font-size: 16px;">${texts.title}</p>
          </div>
          <div style="padding: 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
            <h2 style="color: #111827; margin-bottom: 16px;">${texts.thankYou}</h2>
            
            <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
              <p style="margin: 0 0 8px; font-weight: bold;">${texts.orderNumber}: #${orderNumber}</p>
              <p style="margin: 0 0 8px;">${texts.customer}: ${customerName}</p>
              <p style="margin: 0;">${texts.date}: ${orderDate}</p>
            </div>

            <h3 style="color: #111827; margin-bottom: 16px;">${texts.items}</h3>
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
              ${items.map(item => `
                <div style="padding: 16px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <p style="margin: 0; font-weight: bold;">${item.name}</p>
                    <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">${texts.quantity}: ${item.quantity}</p>
                  </div>
                  <p style="margin: 0; font-weight: bold;">${item.price.toFixed(2)} ${currency}</p>
                </div>
              `).join('')}
            </div>

            <div style="margin-top: 24px; padding: 16px; background-color: #f3f4f6; border-radius: 8px; text-align: right;">
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #111827;">
                ${texts.total}: ${totalAmount.toFixed(2)} ${currency}
              </p>
            </div>

            <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">${texts.footer}</p>
          </div>
        </div>
      `;
    }
  }
};
