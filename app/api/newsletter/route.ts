import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, locale = 'de' } = await request.json();

    // E-Mail-Validierung
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }

    // Newsletter-Anmeldung verarbeiten
    const subject = locale === 'de' 
      ? 'Newsletter-Anmeldung - Gemilike' 
      : 'Newsletter Subscription - Gemilike';

    const htmlContent = locale === 'de' 
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
            <h2 style="color: #333; margin-top: 0;">Willkommen bei unserem Newsletter!</h2>
            
            <p>Vielen Dank für Ihre Anmeldung zu unserem Newsletter. Sie erhalten nun regelmäßig:</p>
            
            <ul style="color: #666; line-height: 1.6;">
              <li>🎯 <strong>Exklusive Angebote</strong> - Spezielle Rabatte nur für Newsletter-Abonnenten</li>
              <li>💎 <strong>Neue Edelsteine</strong> - Erste Informationen über neue Ankünfte</li>
              <li>📚 <strong>Fachwissen</strong> - Tipps zur Pflege und Bewertung von Edelsteinen</li>
              <li>🎉 <strong>Events & Messen</strong> - Einladungen zu Edelstein-Messen und Events</li>
            </ul>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Ihre E-Mail-Adresse:</h3>
              <p style="color: #666; font-weight: bold;">${email}</p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 0;">
              Sie können sich jederzeit von unserem Newsletter abmelden, indem Sie auf den Abmelde-Link in einer unserer E-Mails klicken.
            </p>
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
            <h2 style="color: #333; margin-top: 0;">Welcome to our newsletter!</h2>
            
            <p>Thank you for subscribing to our newsletter. You will now receive regularly:</p>
            
            <ul style="color: #666; line-height: 1.6;">
              <li>🎯 <strong>Exclusive offers</strong> - Special discounts only for newsletter subscribers</li>
              <li>💎 <strong>New gemstones</strong> - First information about new arrivals</li>
              <li>📚 <strong>Expert knowledge</strong> - Tips for care and evaluation of gemstones</li>
              <li>🎉 <strong>Events & fairs</strong> - Invitations to gemstone fairs and events</li>
            </ul>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your email address:</h3>
              <p style="color: #666; font-weight: bold;">${email}</p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 0;">
              You can unsubscribe from our newsletter at any time by clicking the unsubscribe link in one of our emails.
            </p>
          </div>
        </div>
      `;

    // E-Mail senden
    const messageId = await sendEmail({
      to: email,
      subject,
      html: htmlContent,
    });

    return NextResponse.json({
      message: locale === 'de' 
        ? 'Erfolgreich für Newsletter angemeldet' 
        : 'Successfully subscribed to newsletter',
      messageId
    });

  } catch (error) {
    console.error('Newsletter-Anmeldung Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}