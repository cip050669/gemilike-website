import nodemailer from 'nodemailer';

// SMTP-Konfiguration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.strato.de',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'info@gemilike.com',
    pass: process.env.SMTP_PASSWORD || '',
  },
});

// E-Mail senden
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@gemilike.com',
      to,
      subject,
      html,
      text,
    });

    console.log('E-Mail gesendet:', info.messageId);
    return info.messageId;
  } catch (error) {
    console.error('E-Mail-Versand Fehler:', error);
    throw error;
  }
}

// E-Mail-Validierung
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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
      `
    }),
    en: (email: string) => ({
      subject: 'Newsletter Subscription - Gemilike',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to our newsletter!</h1>
          <p>Thank you for subscribing to our newsletter.</p>
          <p>Your email address: ${email}</p>
        </div>
      `
    })
  }
};