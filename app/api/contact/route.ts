import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, locale = 'de' } = await request.json();

    // Validierung
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    // E-Mail-Validierung
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }

    // Kontaktformular-E-Mail an Admin
    const adminSubject = locale === 'de' 
      ? `Neue Kontaktanfrage: ${subject}` 
      : `New Contact Request: ${subject}`;

    const adminHtml = locale === 'de' 
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FF6B35 0%, #00BCD4 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
              Gemilike - Neue Kontaktanfrage
            </h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Kontaktdaten</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>E-Mail:</strong> ${email}</p>
              <p><strong>Betreff:</strong> ${subject}</p>
            </div>
            
            <h3 style="color: #333;">Nachricht:</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1976d2; font-size: 14px;">
                <strong>Antworten:</strong> Klicken Sie auf "Antworten" in Ihrem E-Mail-Programm, um direkt zu antworten.
              </p>
            </div>
          </div>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FF6B35 0%, #00BCD4 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
              Gemilike - New Contact Request
            </h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <h3 style="color: #333;">Message:</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1976d2; font-size: 14px;">
                <strong>Reply:</strong> Click "Reply" in your email program to respond directly.
              </p>
            </div>
          </div>
        </div>
      `;

    // Bestätigungs-E-Mail an Kunden
    const customerSubject = locale === 'de' 
      ? 'Kontaktanfrage erhalten - Gemilike' 
      : 'Contact Request Received - Gemilike';

    const customerHtml = locale === 'de' 
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FF6B35 0%, #00BCD4 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
              Gemilike - Heroes in Gems
            </h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">
              Ihr Spezialist für rohe und geschliffene Edelsteine
            </p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Vielen Dank für Ihre Nachricht!</h2>
            
            <p>Hallo ${name},</p>
            
            <p>vielen Dank für Ihre Kontaktanfrage. Wir haben Ihre Nachricht erhalten und werden uns so schnell wie möglich bei Ihnen melden.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Ihre Anfrage:</h3>
              <p><strong>Betreff:</strong> ${subject}</p>
              <p><strong>Nachricht:</strong></p>
              <p style="white-space: pre-wrap; line-height: 1.6; background: white; padding: 15px; border-radius: 4px;">${message}</p>
            </div>
            
            <p>Wir antworten normalerweise innerhalb von 24 Stunden. Bei dringenden Anfragen erreichen Sie uns auch telefonisch unter +49 (0) 123 456 789.</p>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1976d2; font-size: 14px;">
                <strong>Gemilike Team</strong><br>
                E-Mail: info@gemilike.com<br>
                Telefon: +49 (0) 123 456 789
              </p>
            </div>
          </div>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FF6B35 0%, #00BCD4 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
              Gemilike - Heroes in Gems
            </h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">
              Your specialist for raw and cut gemstones
            </p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Thank you for your message!</h2>
            
            <p>Hello ${name},</p>
            
            <p>thank you for your contact request. We have received your message and will get back to you as soon as possible.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your request:</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; line-height: 1.6; background: white; padding: 15px; border-radius: 4px;">${message}</p>
            </div>
            
            <p>We usually respond within 24 hours. For urgent inquiries, you can also reach us by phone at +49 (0) 123 456 789.</p>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1976d2; font-size: 14px;">
                <strong>Gemilike Team</strong><br>
                Email: info@gemilike.com<br>
                Phone: +49 (0) 123 456 789
              </p>
            </div>
          </div>
        </div>
      `;

    // E-Mails senden
    const adminMessageId = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'info@gemilike.com',
      subject: adminSubject,
      html: adminHtml,
    });

    const customerMessageId = await sendEmail({
      to: email,
      subject: customerSubject,
      html: customerHtml,
    });

    return NextResponse.json({
      message: locale === 'de' 
        ? 'Nachricht erfolgreich gesendet' 
        : 'Message sent successfully',
      adminMessageId,
      customerMessageId
    });

  } catch (error) {
    console.error('Kontaktformular Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}